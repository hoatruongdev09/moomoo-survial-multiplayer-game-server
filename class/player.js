const ServerCode = require("../transmitcode").ServerCode;
const GameCode = require("../transmitcode").GameCode;
const ClanCode = require("../transmitcode").ClanCode;

const Vector = require("../GameUtils/vector");
const SAT = require('../GameUtils/modifiedSAT').sat;

const Melee = require("./weapon/melee");
const Ranged = require("./weapon/ranged");
const Item = require("./Items/item");

const levelDescription = require("./levelInfo");

const ResourceManager = require('./Player/resourcesManager')
const StructueManager = require('./Player/structureManager')
const LevelManager = require('./Player/levelManager')
class Player {
    constructor(idServer, server, socket) {
        /* #region SERVER IDENTITIES  */
        this.idServer = idServer;
        this.server = server;
        this.socket = socket;
        this.id = socket.id
        /* #endregion */

        /* #region  CLIENT PROPERTIES */
        this.clientScreenSize = {
            width: 60,
            height: 30
        }
        /* #endregion */


        /* #region SERVER FUNCTION  */
        this.handleSocket(socket);
        this.isSuspend = false;
        this.isDelayQuit = false;
        /* #endregion */

        /* #region GAME IDENTITIES */
        this.game = null;
        this.idGame = -1;
        this.isJoinedGame = false;
        this.name = "";
        this.skinId = 0;
        this.clanId = null;

        /* #endregion */

        // MOVEMENT PROPERTIES
        this.moveSpeed;

        // TRANSFORM
        this.position;
        this.moveDirect; // vector
        this.lookDirect; // angle
        this.lastMovement; // angle
        this.lastLook; // angle

        // BODYPART
        this.bodyCollider;

        // VIEWS
        this.resourcesView = [];
        this.playersView = [];
        this.npcView = [];
        this.structuresView = [];

        // WEAPONS
        this.weapons = [];
        this.onwedItems = [];

        this.currentItem = null;

        // HEALTH
        this.healthPoint = 100;
        this.kills = 0;
        this.scores = 0;

        this.levelInfo = new LevelManager()

        this.basicResources = new ResourceManager()
        // EFFECT
        this.speedModifier = 1;
        this.environmentSpeedModifier = 1;
        this.platformStanding = false;
        // STRUCTURES
        this.spawnPad = null
        this.structures = new StructueManager()
        // OWNED HATS & ACCESSORIES
        this.ownedHat = [];
        this.ownedAccessories = [];
        this.equipedHat = null;
        this.equipedAccessory = null;
        // MISC
        this.isAutoAttack = false;
        this.intervalAutoAttack;
    }
    registerListenter() {
        this.socket.on("disconnect", () => this.onDisconnect());
        this.socket.on(ServerCode.OnPing, () => this.onPing());
        this.socket.on(ServerCode.OnRequestJoin, (data) => this.onJoin(data));
        this.socket.on(ServerCode.ClientStatus, (data) => this.onRecievedClientStatus(data));
        this.socket.on(GameCode.receivedData, (data) => this.onRecievedGameData(data));
        this.socket.on(GameCode.syncLookDirect, (data) => this.syncLookDirect(data));
        this.socket.on(GameCode.syncMoveDirect, (data) => this.syncMoveDirect(data));
        this.socket.on(GameCode.triggerAttack, (data) => this.useItem(data));
        this.socket.on(GameCode.triggerAutoAttack, (data) => this.autoAttack(data));
        this.socket.on(GameCode.switchItem, (data) => this.switchItem(data));
        this.socket.on(GameCode.upgradeItem, (data) => this.upgradeItem(data));
        this.socket.on(GameCode.playerChat, (data) => this.chat(data));
        this.socket.on(GameCode.scoreBoard, () => this.sendScore());
        this.socket.on(GameCode.shopSelectItem, (data) => this.chooseItem(data));

        this.socket.on(ClanCode.createClan, (data) => this.createClan(data));
        this.socket.on(ClanCode.kickMember, (data) => this.kickMember(data));
        this.socket.on(ClanCode.joinClan, (data) => this.requestJoinClan(data));
        this.socket.on(ClanCode.requestJoin, (data) => this.respondRequestJoinClan(data));

    }

    update(deltaTime) {
        this.updatePosition(deltaTime);
        this.updateRotation();
    }
    /* #region  CLAN EVENTS */
    createClan(data) {
        this.game.createClan(data.name, this);
    }
    kickMember(data) {
        if (this.clanId == null) {
            return;
        }
        if (this.game.clanManager.checkIsMasterOfClan(this.idGame, this.clanId)) {
            if (data.id == this.idGame) {
                this.game.clanManager.removeClan(this.clanId);
            } else {
                this.game.clanManager.kickMember(data.id, this.clanId);
            }
        } else {
            if (data.id == this.idGame) {
                this.game.clanManager.kickMember(data.id, this.clanId);
            }
        }
    }
    requestJoinClan(data) {
        console.log("request join clan: ", data, " this.clanId: ", this.clanId);
        if (this.clanId != null) {
            return;
        }
        this.game.clanManager.addRequestJoin(this, data.id);
        // this.game.clanManager.addMember(this, data.id)
    }
    respondRequestJoinClan(data) {
        if (this.clanId == null) {
            return;
        }
        if (this.game.clanManager.checkIsMasterOfClan(this.idGame, this.clanId)) {
            this.game.clanManager.respondRequestJoin(
                data.id,
                this.clanId,
                data.action
            );
        }
    }
    /* #endregion */

    /* #region  COLLISION EVENTS */
    checkCollider() {
        this.checkColliderWithResources();
        this.checkColliderWithStructures();
    }
    checkColliderWithResources() {
        this.resourcesView = this.game.getResourceFromView(this.position);
        for (const r of this.resourcesView) {
            this.game.testCollisionCircle2Circle(this, r, (response, objectCollide) =>
                this.onCollisionWithResource(response, objectCollide)
            );
        }
        // console.log("resource: ", this.resourcesView)
    }
    checkColliderWithStructures() {
        this.structuresView = this.game.getStructureFromView(this.position);
        for (const s of this.structuresView) {
            this.game.testCollisionCircle2Circle(this, s, (response, objectCollide) =>
                this.onCollisionWithStructures(response, objectCollide, s)
            );
        }
    }
    checkAttackToResource() {
        this.resourcesView = this.game.getResourceFromView(this.position);
        for (const r of this.resourcesView) {
            this.game.testCollisionPolygon2Circle(
                this.currentItem,
                r,
                (response, objectCollide) =>
                this.onHitResource(response, objectCollide, r)
            );
        }
    }
    checkAttackToStructure() {
        for (const s of this.structuresView) {
            this.game.testCollisionCircle2Circle(
                this.currentItem,
                s,
                (response, objectCollide) =>
                this.onHitStructure(response, objectCollide, s)
            );
        }
    }

    onHitStructure(response, object, objectInfo) {
        this.game.playerAttackStructure(
            this.idGame,
            objectInfo.id,
            this.currentItem
        );
    }
    onHitResource(response, object, objectInfo) {
        this.game.playerAttackResource(this, objectInfo.id, this.currentItem);
    }
    checkAttackToPlayer() {
        this.playersView = this.game.getPlayersFromView(this.position);
        // console.log("player view: ", this.playersView);
        for (const p of this.playersView) {
            this.game.testCollisionPolygon2Circle(
                this.currentItem,
                p,
                (response, objectCollide) =>
                this.onHitPlayer(response, objectCollide, p)
            );
        }
    }
    checkAttackToNpc() {
        this.npcView = this.game.getNpcFromView(this.position);
        for (const n of this.npcView) {
            this.game.testCollisionPolygon2Circle(this.currentItem, n, (response, objectCollide) => this.onHitNpc(response, objectCollide, n));
        }
    }
    onHitNpc(response, object, objectInfo) {
        this.game.playerHitNpc(
            this.idGame,
            objectInfo.id,
            this.currentItem.info.damage
        );
    }
    onHitPlayer(response, object, objectInfo) {
        if (objectInfo.id != this.idGame) {
            console.log("hit player: ", objectInfo.id);
            this.game.playerHitPlayer(
                this.idGame,
                objectInfo.id,
                this.currentItem.info.damage
            );
        }
    }
    onCollisionWithStructures(response, object, objectInfo) {
        let structures = ["Wall", "Spike", "Windmill", "Turret", "MineStone", "Sapling"]
        if (structures.includes(objectInfo.type)) {
            // if (objectInfo.type == "Wall" || objectInfo.type == "Spike" || objectInfo.type == "Windmill" || objectInfo.type == "Turret" || ) {
            let overlapPos = response.overlapV;
            this.position.x -= overlapPos.x;
            this.position.y -= overlapPos.y;
        }
        this.game.playerHitStructures(this.idGame, objectInfo.id);
    }
    onCollisionWithResource(response, object) {
        let overlapPos = response.overlapV;
        this.position.x -= overlapPos.x;
        this.position.y -= overlapPos.y;
    }
    /* #endregion */

    /* #region  CONNECT EVENTS */
    handleSocket(socket) {
        this.send(ServerCode.OnConnect, {
            id: this.idServer,
            listGame: this.server.listGame(),
        });
        this.registerListenter();
    }
    onPing() {
        this.send(ServerCode.OnPing, null);
    }
    onJoin(data) {
        this.skinId = data.skinId;
        this.clientScreenSize.width = data.screenSizeX
        this.clientScreenSize.height = data.screenSizeY
        this.server.playerJoinGame(this, data);
    }
    onRecievedClientStatus(data) {
        if (data.focus !== true) {
            this.isSuspend = false;
            this.isDelayQuit = false;
        } else {
            this.isSuspend = true;
            this.isDelayQuit = true;
            setTimeout(() => {
                if (this.isDelayQuit) {
                    this.isSuspend = false;
                    console.log(`player: ${this.idServer} kicked for afk too long`);
                    this.onDisconnect();
                }
            }, 30000);
        }
    }
    onRecievedGameData(data) {
        this.game.playerJoin(this);
    }
    onDisconnect() {
        if (this.isSuspend) {
            return;
        }
        if (this.game != null) {
            this.game.removePlayer(this);
        }
        this.isAutoAttack = false;
        if (this.intervalAutoAttack != null) {
            clearInterval(this.intervalAutoAttack);
        }
        this.kickMember({
            id: this.idGame,
        });
        this.server.removePlayer(this);
    }
    enterGame(data) {
        this.isJoinedGame = true;
        this.moveSpeed = data.moveSpeed;
        this.position = data.position;
        this.lookDirect = data.lookDirect;

        this.healthPoint = 100;
        this.kills = 0;
        this.scores = 0;
        this.levelInfo.reset();
        this.basicResources.reset();

        this.onwedItems = data.items.items;
        this.weapons = data.items.weapons;
        this.currentItem = this.createWeapon(this.weapons[0]);

        this.ownedHat = data.shop.hats;
        this.ownedAccessories = data.shop.accessories;

        this.isAutoAttack = false;
        clearInterval(this.intervalAutoAttack);

        this.structures.reset();
        if (this.bodyCollider == null) {
            this.bodyCollider = new SAT.Circle(new SAT.Vector(this.position.x, this.position.y), data.bodyRadius);
        } else {
            this.bodyCollider.pos.x = this.position.x;
            this.bodyCollider.pos.y = this.position.y;
            // this.bodyCollider = new SAT.Circle(new SAT.Vector(this.position.x, this.position.syncLookDirect), data.bodyRadius)
        }
        this.updateStatus();
        this.syncItem();
        this.syncItemShop();
    }
    /* #endregion */

    /* #region  TRANFORM EVENTS */
    updatePosition(deltaTime) {
        if (this.lastMovement == null) {
            return;
        }
        this.moveDirect = new Vector(
            Math.cos(this.lastMovement),
            Math.sin(this.lastMovement)
        );

        this.position.add(this.moveDirect.clone().scale(this.moveSpeed * (!this.platformStanding ? this.speedModifier * this.environmentSpeedModifier : 1) * deltaTime));
        // console.log("modifier: ", (this.platformStanding == false ? this.speedModifier * this.environmentSpeedModifier : 1))

        this.bodyCollider.pos.x = this.position.x;
        this.bodyCollider.pos.y = this.position.y;

        this.checkCollider();
    }
    syncLookDirect(data) {
        this.lastLook = data;
    }
    syncMoveDirect(data) {
        this.lastMovement = data;
    }
    movePlayer(direct, deltaTime) {
        this.lastMovement = direct;
        this.moveDirect = new Vector(
            Math.cos(this.lastMovement),
            Math.sin(this.lastMovement)
        );
        this.position.add(
            this.moveDirect.clone().scale(this.moveSpeed * deltaTime)
        );
        this.bodyCollider.pos.x = this.position.x;
        this.bodyCollider.pos.y = this.position.y;

        this.checkCollider();
    }
    updateRotation() {
        if (this.lastLook == null) {
            return;
        }
        this.lookDirect = this.lastLook;
    }
    /* #endregion */

    /* #region  ITEM EVENTS */
    createWeapon(info) {
        if (info.type == "Melee") {
            return new Melee(info);
        }
        if (info.type == "Ranged") {
            return new Ranged(info);
        }
    }
    createItem(info) {
        return new Item(info);
    }
    useItem(data) {
        // console.log("current item: ", this.currentItem)
        if (this.currentItem.toString() == "Melee") {
            this.triggerMeleeAttack();
            return;
        } else if (this.currentItem.toString() == "Ranged") {
            this.triggerRangedAttack();
        } else {
            if (data.isbtn) this.triggerUseItem();
        }
    }
    autoAttack(data) {
        if (this.currentItem.toString() == "Melee") {
            this.isAutoAttack = data.action;
            if (!this.isAutoAttack) {
                clearInterval(this.intervalAutoAttack);
            } else {
                this.startMeleeAutoAttack();
            }
            return;
        } else if (this.currentItem.toString() == "Ranged") {
            this.isAutoAttack = data.action;
            if (!this.isAutoAttack) {
                clearInterval(this.intervalAutoAttack);
            } else {
                this.startRangeAutoAttack();
            }
        }
    }
    startMeleeAutoAttack() {
        if (this.intervalAutoAttack != null) {
            clearInterval(this.intervalAutoAttack);
        }
        this.intervalAutoAttack = setInterval(() => {
            this.triggerMeleeAttack();
        }, this.currentItem.info.attackSpeed);
    }
    startRangeAutoAttack() {
        if (this.intervalAutoAttack != null) {
            clearInterval(this.intervalAutoAttack);
        }
        this.intervalAutoAttack = setInterval(() => {
            this.triggerRangedAttack();
        }, this.currentItem.info.attackSpeed);
    }
    switchItem(data) {
        // console.log("swithc item: ", data)
        // console.log("last item: ", this.currentItem)
        if (this.currentItem.info.id == data.code) {
            return;
        }
        let type = data.code.charAt(0);
        if (type == "w") {
            let weapon = this.findWeapon(data.code);
            if (weapon != null) {
                this.currentItem = this.createWeapon(weapon);
            }
        } else if (type == "i") {
            let item = this.findItem(data.code);
            if (item != null) {
                this.currentItem = this.createItem(item);
            }
        }
        // console.log("current Item: ", this.currentItem)
        this.game.broadcast(GameCode.switchItem, {
            id: this.idGame,
            item: this.currentItem.info.id,
        });
    }
    upgradeItem(data) {
        // console.log("weapon: ", this.weapons)
        let itemType = data.code.charAt(0);
        if (itemType == "w") {
            let info = this.game.getWeaponByCode(data.code);
            this.upgradeWeapon(info);
        } else if (itemType == "i") {
            let info = this.game.getItemByCode(data.code);
            this.upgradeOwnedItem(info);
            this.currentItem = this.createItem(info);
        }
        this.game.broadcast(GameCode.switchItem, {
            id: this.idGame,
            item: this.currentItem.info.id,
        });
        this.syncItem();
    }
    syncItem() {
        this.send(GameCode.syncItem, {
            items: this.getCurrentItems(),
        });
    }
    syncItemShop() {
        this.send(GameCode.syncShop, {
            owned: this.ownedAccessories.concat(this.ownedHat).map((i) => {
                return i.id;
            }),
            equipedHat: this.equipedHat == null ? "" : this.equipedHat.id,
            equipedAccessory: this.equipedAccessory == null ? "" : this.equipedAccessory.id,
        });
    }
    chooseItem(data) {
        console.log("choose item: ", data);
        if (data.id[0] == "h") {
            if (this.checkIfOwnedHatHaveItem(data.id)) {
                // if owned this item
                if (this.equipedHat != null && this.equipedHat.id == data.id) {
                    // if equiped then unequip
                    this.equipedHat = null;
                } else {
                    // if not equiped then equip
                    this.equipedHat = this.getOwnedItemById(data.id);
                }
            } else {
                // if not owned this item
                let item = this.game.getHatById(data.id);
                if (this.basicResources.Gold >= item.price) {
                    this.ownedHat.push(item);
                    this.basicResources.Gold -= item.price;
                    this.updateStatus();
                }
            }
        } else {
            if (this.checkIfOwnedAccessoryHaveItem(data.id)) {
                // if owned this item
                if (this.equipedAccessory != null && this.equipedAccessory.id == data.id) {
                    // if equiped then unequip
                    // console.log("unequip accessory");
                    this.equipedAccessory = null;
                } else {
                    // if not equiped then equip
                    // console.log("equip accessory");
                    this.equipedAccessory = this.getOwnedItemById(data.id);
                }
            } else {
                // if not owned this item
                let item = this.game.getAccessoryById(data.id);
                if (this.basicResources.Gold >= item.price) {
                    this.ownedAccessories.push(item);
                    this.basicResources.Gold -= item.price;
                    this.updateStatus();
                }
            }
        }
        this.syncEquipItem();
        this.syncItemShop();
    }
    syncEquipItem() {
        this.game.broadcast(GameCode.syncEquipItem, {
            id: this.idGame,
            hat: this.equipedHat == null ? "" : this.equipedHat.id,
            acc: this.equipedAccessory == null ? "" : this.equipedAccessory.id,
        });
    }
    checkIfOwnedHatHaveItem(id) {
        for (let i = 0; i < this.ownedHat.length; i++) {
            if (this.ownedHat[i].id == id) {
                return true;
            }
        }
        return false;
    }
    checkIfOwnedAccessoryHaveItem(id) {
        for (let i = 0; i < this.ownedAccessories.length; i++) {
            if (this.ownedAccessories[i].id == id) {
                return true;
            }
        }
        return false;
    }
    getOwnedItemById(id) {
        let allItem = this.ownedHat.concat(this.ownedAccessories);
        for (let i = 0; i < allItem.length; i++) {
            if (allItem[i].id == id) {
                return allItem[i];
            }
        }
        return null;
    }
    upgradeWeapon(info) {
        if (info.main) {
            this.weapons[0] = info;
        } else {
            this.weapons[1] = info;
        }
        this.currentItem = this.createWeapon(info);
    }
    upgradeOwnedItem(info) {
        if (
            info.type == "Windmill" ||
            info.type == "Wall" ||
            info.type == "Spike" ||
            info.type == "Consume"
        ) {
            for (let i = 0; i < this.onwedItems.length; i++) {
                if (this.onwedItems[i].type == info.type) {
                    this.onwedItems.splice(i, 1);
                    break;
                }
            }
        }
        this.onwedItems.push(info);
    }
    getCurrentItems() {
        let data = [];
        this.weapons.forEach((w) => {
            if (w != null) data.push(w.id);
        });
        this.onwedItems.forEach((i) => {
            data.push(i.id);
        });
        return data;
    }
    findWeapon(id) {
        let weapon = null;
        this.weapons.forEach((w) => {
            if (w != null && w.id == id) {
                weapon = w;
            }
        });
        return weapon;
    }
    findItem(id) {
        let item = null;
        this.onwedItems.forEach((i) => {
            if (i.id == id) {
                item = i;
            }
        });
        return item;
    }
    triggerMeleeAttack() {
        if (!this.currentItem.canUse) {
            return;
        }
        let direct = new Vector(
            -Math.cos(this.lookDirect),
            -Math.sin(this.lookDirect)
        );
        this.currentItem.use(this, direct);
        this.checkAttackToResource();
        this.checkAttackToStructure();
        this.checkAttackToNpc();
        this.checkAttackToPlayer();
        this.game.broadcast(GameCode.triggerAttack, {
            idGame: this.idGame,
            type: this.currentItem.idType,
        });
    }
    triggerRangedAttack() {
        if (!this.currentItem.canUse) {
            return;
        }
        let direct = new Vector(
            -Math.cos(this.lookDirect),
            -Math.sin(this.lookDirect)
        );
        this.currentItem.use(this, direct);
    }
    triggerUseItem() {
        let direct = new Vector(
            -Math.cos(this.lookDirect),
            -Math.sin(this.lookDirect)
        );
        this.currentItem.use(this, direct);
    }
    /* #endregion */

    /* #region  PLAYER STATUS */
    receiveResource(amount, type) {
        this.basicResources[type] += amount;
    }
    addGold(value) {
        this.basicResources.Gold += value;
        this.scores += value;
    }
    addXP(value) {
        this.levelInfo.xp += value;
        let currentLv = this.levelInfo.level;
        if (this.levelInfo.level >= levelDescription.length) {
            currentLv = levelDescription.length;
            return;
        }
        if (this.levelInfo.xp >= levelDescription[currentLv].nextLevelUpXp) {
            this.levelInfo.level++;
            this.levelInfo.xp = 0;
            this.onLevelUp();
        }
        this.updateStatus();
    }
    onLevelUp() {
        let lvUpItem = [];
        let itemByLevel = this.game.getItemsByLevel(this.levelInfo.level);
        itemByLevel.weapons.forEach((w) => {
            if (w != null) {
                lvUpItem.push(w.id);
            }
        });
        itemByLevel.items.forEach((i) => {
            if (i != null) {
                lvUpItem.push(i.id);
            }
        });
        this.send(GameCode.upgradeItem, {
            items: lvUpItem,
        });
    }
    updateStatus() {
        this.send(GameCode.playerStatus, {
            scores: this.scores,
            kills: this.kills,
            level: this.levelInfo.level,
            xp: this.levelInfo.xp /
                levelDescription[this.levelInfo.level].nextLevelUpXp,
            wood: this.basicResources.Wood,
            food: this.basicResources.Food,
            stone: this.basicResources.Stone,
            gold: this.basicResources.Gold,
        });
    }
    /* #endregion */

    /* #region  TRANSMIT EVENTS */

    chat(data) {
        console.log(data);
        this.game.sendChat(data);
        if (data.text == "rss") {
            this.basicResources.addAll(1000);
            this.updateStatus();
        } else if (data.text == "exp") {
            this.addXP(1000);
        }
    }
    sendScore() {
        let data = this.game.getPlayerScore();
        this.send(GameCode.scoreBoard, {
            data: data,
        });
    }
    // Transmit
    send(event, args) {
        this.socket.emit(event, args);
    }
    /* #endregion */
}
module.exports = Player;