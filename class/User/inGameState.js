const TransmitCode = require('../../transmitcode')
const GameCode = TransmitCode.GameCode
const ClanCode = TransmitCode.ClanCode
const BaseState = require('./baseUserState')
const LevelDescription = require("../levelInfo");

const Vector = require('../../GameUtils/vector')
const SAT = require('sat')

const Melee = require("../weapon/melee");
const Ranged = require("../weapon/ranged");
const Item = require("../Items/item");

const ResourceManager = require('../Player/resourcesManager')
const StructueManager = require('../Player/structureManager')
const LevelManager = require('../Player/levelManager')

class GameState extends BaseState {
    constructor(user, stateManager) {
        super(user, stateManager)
        this.game = null
        this.resourcesView = []
        this.structuresView = []
        this.npcView = []
        this.playersView = []

        this.delayUseItem = false
        this.delayUseItemTime = 500
    }
    enter(options) {
        this.delayUseItem = false
        this.user = options.user
        this.socket = this.user.socket
        this.game = this.user.game

        this.resourcesView = []
        this.structuresView = []
        this.npcView = []
        this.playersView = []

        this.isAutoAttack = false
        this.intervalAutoAttack = null

        this.prepareEnterGame(options.gameData)
        this.registerEvents()
    }
    update(deltaTime) {
        this.updatePosition(deltaTime)
        this.updateRotation()
    }
    exit(options) {
        this.removeEvents()
        this.clearAutoAttackInterval()
        this.resetPlayerAttributes()
        this.user.resetEffects()
    }
    registerEvents() {
        this.socket.on(GameCode.syncLookDirect, (data) => this.syncLookDirect(data))
        this.socket.on(GameCode.syncMoveDirect, (data) => this.syncMoveDirect(data))
        this.socket.on(GameCode.triggerAttack, (data) => this.useItem(data))
        this.socket.on(GameCode.triggerAutoAttack, (data) => this.autoAttack(data))
        this.socket.on(GameCode.switchItem, (data) => this.switchItem(data))
        this.socket.on(GameCode.upgradeItem, (data) => this.upgradeItem(data))
        this.socket.on(GameCode.playerChat, (data) => this.chat(data))
        this.socket.on(GameCode.scoreBoard, () => this.sendScore())
        this.socket.on(GameCode.shopSelectItem, (data) => this.chooseItem(data))

        this.socket.on(ClanCode.createClan, (data) => this.createClan(data))
        this.socket.on(ClanCode.kickMember, (data) => this.kickMember(data))
        this.socket.on(ClanCode.joinClan, (data) => this.requestJoinClan(data))
        this.socket.on(ClanCode.requestJoin, (data) => this.respondRequestJoinClan(data))
    }
    removeEvents() {
        this.socket.off(GameCode.syncLookDirect, (data) => this.syncLookDirect(data))
        this.socket.off(GameCode.syncMoveDirect, (data) => this.syncMoveDirect(data))
        this.socket.off(GameCode.triggerAttack, (data) => this.useItem(data))
        this.socket.off(GameCode.triggerAutoAttack, (data) => this.autoAttack(data))
        this.socket.off(GameCode.switchItem, (data) => this.switchItem(data))
        this.socket.off(GameCode.upgradeItem, (data) => this.upgradeItem(data))
        this.socket.off(GameCode.playerChat, (data) => this.chat(data))
        this.socket.off(GameCode.scoreBoard, () => this.sendScore())
        this.socket.off(GameCode.shopSelectItem, (data) => this.chooseItem(data))

        this.socket.off(ClanCode.createClan, (data) => this.createClan(data))
        this.socket.off(ClanCode.kickMember, (data) => this.kickMember(data))
        this.socket.off(ClanCode.joinClan, (data) => this.requestJoinClan(data))
        this.socket.off(ClanCode.requestJoin, (data) => this.respondRequestJoinClan(data))
    }
    clearAutoAttackInterval() {
        this.isAutoAttack = false
        if (this.intervalAutoAttack != null) {
            clearInterval(this.intervalAutoAttack)
        }
    }
    prepareEnterGame(data) {
        this.user.isJoinedGame = true
        this.user.moveSpeed = data.moveSpeed
        this.user.position = data.position
        this.user.lookDirect = data.lookDirect

        this.user.healthPoint = 100
        this.user.kills = 0
        this.user.scores = 0
        this.user.levelInfo.reset()
        this.user.basicResources.reset()

        this.user.ownedItems = data.items.items
        this.user.weapons = data.items.weapons
        this.user.currentItem = this.createWeapon(this.user.weapons[0])

        this.user.ownedHat = data.shop.hats
        this.user.ownedAccessories = data.shop.accessories

        this.user.isAutoAttack = false
        if (this.user.intervalAutoAttack != null) {
            clearInterval(this.user.intervalAutoAttack)
        }
        this.user.structures.reset();
        this.initBodyCollider(data.bodyRadius)

        this.updateStatus()
        this.syncItem()
        this.syncItemShop()
    }
    resetPlayerAttributes() {
        this.user.moveSpeed = null
        this.user.lookDirect = null

        this.playersView = []
        this.npcView = []
        this.resourcesView = []
        this.structuresView = []

        this.user.lastMovement = null
        this.user.lastLook = null
    }
    /* #region  TRANSFORM JOBS */
    updatePosition(deltaTime) {
        if (this.user.lastMovement == null) {
            return;
        }
        this.user.moveDirect = new Vector(
            Math.cos(this.user.lastMovement),
            Math.sin(this.user.lastMovement)
        );

        this.user.position.add(this.user.moveDirect.clone().scale(this.user.moveSpeed * (this.user.movementEffect() * deltaTime)))
        // console.log("modifier: ", (this.platformStanding == false ? this.speedModifier * this.environmentSpeedModifier : 1))

        this.updateBodyCollider()

        this.checkCollider();
    }
    old_movePlayer(direct, deltaTime) {
        this.user.lastMovement = direct;
        this.user.moveDirect = new Vector(
            Math.cos(this.user.lastMovement),
            Math.sin(this.user.lastMovement)
        );
        this.user.position.add(this.user.moveDirect.clone().scale(this.user.moveSpeed * (this.user.movementEffect() * deltaTime)))
        this.updateBodyCollider()

        this.checkCollider();
    }
    movePlayer(direct, deltaTime) {
        if (this.user.platformStanding) {
            return
        }
        this.user.lastMovement = direct;
    }
    updateRotation() {
        if (this.user.lastLook == null) {
            return;
        }
        this.user.lookDirect = this.user.lastLook;
    }
    updateBodyCollider() {
        this.user.bodyCollider.pos.x = this.user.position.x;
        this.user.bodyCollider.pos.y = this.user.position.y;
    }
    /* #endregion */

    /* #region CHECK COLLIDER JOBS  */
    checkCollider() {
        this.checkColliderWithResources();
        this.checkColliderWithStructures();
    }
    checkColliderWithResources() {
        this.resourcesView = this.game.getResourceFromView(this.user.position)
        for (const r of this.resourcesView) {
            this.game.testCollisionCircle2Circle(this.user, r, (response, objectCollide) =>
                this.onCollisionWithResource(response, objectCollide)
            );
        }
        // console.log("resource: ", this.resourcesView)
    }
    checkColliderWithStructures() {
        this.structuresView = this.game.getStructureFromView(this.user.position);
        for (const s of this.structuresView) {
            this.game.testCollisionCircle2Circle(this.user, s, (response, objectCollide) =>
                this.onCollisionWithStructures(response, objectCollide, s)
            );
        }
    }
    onCollisionWithResource(response, object) {
        let overlapPos = response.overlapV;
        this.user.position.x -= overlapPos.x;
        this.user.position.y -= overlapPos.y;
    }
    onCollisionWithStructures(response, object, objectInfo) {
        let structures = ["Wall", "Spike", "Windmill", "Turret", "MineStone", "Sapling"]
        if (structures.includes(objectInfo.type)) {
            // if (objectInfo.type == "Wall" || objectInfo.type == "Spike" || objectInfo.type == "Windmill" || objectInfo.type == "Turret" || ) {
            let overlapPos = response.overlapV;
            this.user.position.x -= overlapPos.x;
            this.user.position.y -= overlapPos.y;
        }
        this.game.playerHitStructures(this.user.idGame, objectInfo.id)
    }
    /* #endregion */

    /* #region  LOGIC */



    syncLookDirect(data) {
        this.user.lastLook = data;
    }
    syncMoveDirect(data) {
        this.user.lastMovement = data;
    }

    initBodyCollider(bodyRadius) {
        if (this.user.bodyCollider == null) {
            this.user.bodyCollider = new SAT.Circle(new SAT.Vector(this.user.position.x, this.user.position.y), bodyRadius);
        } else {
            this.updateBodyCollider()
            // this.bodyCollider = new SAT.Circle(new SAT.Vector(this.position.x, this.position.syncLookDirect), data.bodyRadius)
        }
    }


    updateStatus() {
        this.user.send(TransmitCode.GameCode.playerStatus, {
            scores: this.user.scores,
            kills: this.user.kills,
            level: this.user.levelInfo.level,
            xp:
                this.user.levelInfo.xp /
                LevelDescription[this.user.levelInfo.level].nextLevelUpXp,
            wood: this.user.basicResources.Wood,
            food: this.user.basicResources.Food,
            stone: this.user.basicResources.Stone,
            gold: this.user.basicResources.Gold,
        });
    }





    /* #endregion */
    /* #region  SHOP  */
    syncItem() {
        this.user.send(GameCode.syncItem, {
            items: this.user.getCurrentItems(),
        });
    }
    syncItemShop() {
        this.user.send(GameCode.syncShop, {
            owned: this.user.ownedAccessories.concat(this.user.ownedHat).map((i) => {
                return i.id;
            }),
            equippedHat: this.user.equippedHat == null ? "" : this.user.equippedHat.id,
            equippedAccessory:
                this.user.equippedAccessory == null ? "" : this.user.equippedAccessory.id,
        });
    }

    /* #endregion */
    /* #region  ATTACKS JOBS */
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
    autoAttack(data) {
        if (this.user.currentItem.toString() == "Melee") {
            this.isAutoAttack = data.action;
            if (!this.isAutoAttack) {
                clearInterval(this.intervalAutoAttack);
            } else {
                this.startMeleeAutoAttack();
            }
            return;
        } else if (this.user.currentItem.toString() == "Ranged") {
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
        }, this.user.currentItem.info.attackSpeed);
    }
    startRangeAutoAttack() {
        if (this.intervalAutoAttack != null) {
            clearInterval(this.intervalAutoAttack);
        }
        this.intervalAutoAttack = setInterval(() => {
            this.triggerRangedAttack();
        }, this.user.currentItem.info.attackSpeed);
    }
    useItem(data) {
        // console.log("current item: ", this.currentItem)
        if (this.user.currentItem.toString() == "Melee") {
            this.triggerMeleeAttack();
            return;
        } else if (this.user.currentItem.toString() == "Ranged") {
            this.triggerRangedAttack();
        } else {
            if (data.isbtn) this.triggerUseItem();
        }
    }
    triggerRangedAttack() {
        if (!this.user.currentItem.canUse) {
            return;
        }
        let direct = new Vector(
            -Math.cos(this.user.lookDirect),
            -Math.sin(this.user.lookDirect)
        );
        this.user.currentItem.new_use(this.user, direct, (cost) => this.removeResource(cost))
    }
    triggerUseItem() {
        if (this.delayUseItem) {
            return
        }
        this.delayUseItem = true
        setTimeout(() => { this.delayUseItem = false }, this.delayUseItemTime)
        let direct = new Vector(
            -Math.cos(this.user.lookDirect),
            -Math.sin(this.user.lookDirect)
        );
        this.user.currentItem.new_use(this.user, direct, (cost) => {
            this.removeResource(cost)
        }, () => {
            this.switchItem({ code: this.user.weapons[0].id })
        })
    }
    removeResource(cost) {
        console.log("current item: ", this.user.currentItem)
        let costModifier = 1
        if (this.user.currentItem.toString() == "Ranged") {
            costModifier = this.user.projectileCostModifier
        }
        let keys = Object.keys(cost)
        keys.forEach(k => {
            this.user.basicResources[k] -= cost[k] * costModifier
        })
        this.updateStatus()
    }
    triggerMeleeAttack() {
        if (!this.user.currentItem.canUse) {
            return;
        }
        let direct = new Vector(
            -Math.cos(this.user.lookDirect),
            -Math.sin(this.user.lookDirect)
        );
        this.user.currentItem.use(this.user, direct);
        this.checkAttackToResource();
        this.checkAttackToStructure();
        this.checkAttackToNpc();
        this.checkAttackToPlayer();

        this.game.onPlayerTriggerAttack({
            idGame: this.user.idGame,
            type: this.user.currentItem.idType,
        })
    }
    checkAttackToResource() {
        this.resourcesView = this.game.getResourceFromView(this.user.position);
        for (const r of this.resourcesView) {
            this.game.testCollisionPolygon2Circle(
                this.user.currentItem, r, (response, objectCollide) =>
                this.onHitResource(response, objectCollide, r)
            );
        }
    }
    checkAttackToStructure() {
        for (const s of this.structuresView) {
            this.game.testCollisionCircle2Circle(
                this.user.currentItem,
                s,
                (response, objectCollide) =>
                    this.onHitStructure(response, objectCollide, s)
            );
        }
    }
    checkAttackToNpc() {
        this.npcView = this.game.getNpcFromView(this.user.position);
        for (const n of this.npcView) {
            this.game.testCollisionPolygon2Circle(this.user.currentItem, n, (response, objectCollide) => this.onHitNpc(response, objectCollide, n));
        }
    }
    checkAttackToPlayer() {
        this.playersView = this.game.getPlayersFromView(this.user.position);
        // console.log("player view: ", this.playersView);
        for (const p of this.playersView) {
            this.game.testCollisionPolygon2Circle(
                this.user.currentItem,
                p,
                (response, objectCollide) =>
                    this.onHitPlayer(response, objectCollide, p)
            );
        }
    }
    onHitResource(response, object, objectInfo) {
        this.game.playerAttackResource(this.user, objectInfo.id, this.user.currentItem);
    }
    onHitStructure(response, object, objectInfo) {
        let damage = this.user.currentItem.info.structureDamage * (this.user.structureDamageModifier + 1)
        let gatherRate = this.user.currentItem.info.gatherRate
        let goldGatherRate = this.user.currentItem.info.goldGatherRate + this.user.farmGoldBonus
        this.game.playerAttackStructure(
            this.user.idGame,
            objectInfo.id, damage,
            gatherRate,
            goldGatherRate
        )

    }
    onHitNpc(response, object, objectInfo) {
        let damage = this.user.currentItem.info.damage * (1 + this.user.damageModifier)
        this.game.playerHitNpc(
            this.user.idGame,
            objectInfo.id,
            damage
        );
    }
    onHitPlayer(response, object, objectInfo) {
        if (objectInfo.id != this.user.idGame) {
            console.log("hit player: ", objectInfo.id);
            let damage = this.user.currentItem.info.damage * (1 + this.user.damageModifier)
            this.game.playerHitPlayer(
                this.user.idGame,
                objectInfo.id,
                damage
            );
        }
    }

    /* #endregion */
    /* #region  SWITCH ITEMS */
    switchItem(data) {
        // console.log("last item: ", this.currentItem)
        if (this.user.currentItem.info.id == data.code) {
            return;
        }
        let type = data.code.charAt(0);
        if (type == "w") {
            let weapon = this.findWeapon(data.code);
            if (weapon != null) {
                this.user.equipHoldItem(this.createWeapon(weapon))
            }
        } else if (type == "i") {
            let item = this.findItem(data.code);
            if (item != null) {
                this.user.currentItem = this.createItem(item);
            }
        }
        // console.log("current Item: ", this.currentItem)
        this.game.onPlayerSwitchItem({
            id: this.user.idGame,
            item: this.user.currentItem.info.id,
        })
    }
    findWeapon(id) {
        let weapon = null;
        this.user.weapons.forEach((w) => {
            if (w != null && w.id == id) {
                weapon = w;
            }
        });
        return weapon;
    }
    findItem(id) {
        let item = null;
        this.user.ownedItems.forEach((i) => {
            if (i.id == id) {
                item = i;
            }
        });
        return item;
    }

    /* #endregion */
    /* #region  SHOP JOBS */
    chooseItem(data) {
        console.log("choose item: ", data);
        if (data.id[0] == "h") {
            this.chooseHat(data)
        } else {
            this.chooseAccessory(data)
        }
        this.syncEquipItem();
        this.syncItemShop();
    }
    chooseHat(data) {
        if (this.checkIfOwnedHatHaveItem(data.id)) {
            // if owned this item
            if (this.user.equippedHat != null && this.user.equippedHat.id == data.id) {
                // if equiped then unequip
                this.user.equippedHat.remove(this.user)
                this.user.equippedHat = null;
            } else {
                // if not equiped then equip
                if (this.user.equipedHat != null) {
                    this.user.equippedHat.remove(this.user)
                }
                this.user.equippedHat = this.getOwnedItemById(data.id);
                this.user.equippedHat.effect(this.user)
            }
        } else {
            // if not owned this item
            let item = this.game.getHatById(data.id);
            if (this.user.basicResources.Gold >= item.price) {
                this.user.ownedHat.push(item);
                this.user.basicResources.Gold -= item.price;
                this.updateStatus();
            }
        }
    }
    checkIfOwnedHatHaveItem(id) {
        for (let i = 0; i < this.user.ownedHat.length; i++) {
            if (this.user.ownedHat[i].id == id) {
                return true;
            }
        }
        return false;
    }
    checkIfOwnedAccessoryHaveItem(id) {
        for (let i = 0; i < this.user.ownedAccessories.length; i++) {
            if (this.user.ownedAccessories[i].id == id) {
                return true;
            }
        }
        return false;
    }
    getOwnedItemById(id) {
        let allItem = this.user.ownedHat.concat(this.user.ownedAccessories);
        for (let i = 0; i < allItem.length; i++) {
            if (allItem[i].id == id) {
                return allItem[i];
            }
        }
        return null;
    }
    chooseAccessory(data) {
        if (this.checkIfOwnedAccessoryHaveItem(data.id)) {
            // if owned this item
            if (this.user.equippedAccessory != null && this.user.equippedAccessory.id == data.id) {
                // if equiped then unequip
                // console.log("unequip accessory");
                this.user.equippedAccessory.remove(this.user)
                this.user.equippedAccessory = null;
            } else {
                // if not equiped then equip
                // console.log("equip accessory");
                if (this.user.equippedAccessory != null) {
                    this.user.equippedAccessory.remove(this.user)
                }
                this.user.equippedAccessory = this.getOwnedItemById(data.id);
                this.user.equippedAccessory.effect(this.user)
            }
        } else {
            // if not owned this item
            let item = this.game.getAccessoryById(data.id);
            if (this.user.basicResources.Gold >= item.price) {
                this.user.ownedAccessories.push(item);
                this.user.basicResources.Gold -= item.price;
                this.updateStatus();
            }
        }
    }
    syncEquipItem() {
        this.game.onPlayerEquipItem({
            id: this.user.idGame,
            hat: this.user.equippedHat == null ? "" : this.user.equippedHat.id,
            acc: this.user.equippedAccessory == null ? "" : this.user.equippedAccessory.id,
        })
    }
    syncItemShop() {
        this.user.send(GameCode.syncShop, {
            owned: this.user.ownedAccessories.concat(this.user.ownedHat).map((i) => {
                return i.id;
            }),
            equipedHat: this.user.equippedHat == null ? "" : this.user.equippedHat.id,
            equipedAccessory:
                this.user.equippedAccessory == null ? "" : this.user.equippedAccessory.id,
        });
    }
    /* #endregion */
    /* #region  CLAN JOBS */
    createClan(data) {
        this.game.createClan(data.name, this.user);
    }
    kickMember(data) {
        console.log("clanid: ", this.user.clanId)
        if (this.user.clanId == null) {
            return;
        }
        if (this.game.checkIsMasterOfClan(this.user.idGame, this.user.clanId)) {
            if (data.id == this.user.idGame) {
                console.log("remove clan")
                this.game.removeClan(this.user.clanId);
            } else {
                console.log("kick member")
                this.game.kickMember(data.id, this.user.clanId);
            }
        } else {
            console.log("not master")
            if (data.id == this.user.idGame) {
                console.log("kick member")
                this.game.kickMember(data.id, this.user.clanId);
            }
        }
    }
    requestJoinClan(data) {
        console.log("request join clan: ", data, " this.clanId: ", this.clanId);
        if (this.user.clanId != null) {
            return;
        }
        this.game.clanManager.addRequestJoin(this.user, data.id);
        // this.game.clanManager.addMember(this, data.id)
    }
    respondRequestJoinClan(data) {
        if (this.user.clanId == null) {
            return;
        }
        if (this.game.clanManager.checkIsMasterOfClan(this.user.idGame, this.user.clanId)) {
            this.game.clanManager.respondRequestJoin(
                data.id,
                this.user.clanId,
                data.action
            );
        }
    }
    /* #endregion */
    /* #region  LEVEL UP & UPGRADE */
    addXP(value) {
        this.user.levelInfo.xp += value;
        let currentLv = this.user.levelInfo.level;
        if (this.user.levelInfo.level + 1 >= LevelDescription.length) {
            currentLv = LevelDescription.length;
            return;
        }
        if (this.user.levelInfo.xp >= LevelDescription[currentLv].nextLevelUpXp) {
            this.user.levelInfo.level++;
            this.user.levelInfo.xp = 0;
            this.onLevelUp();
        }
        this.updateStatus();
    }
    onLevelUp() {
        let lvUpItem = [];
        let itemByLevel = this.game.getItemsByLevel(this.user.levelInfo.level);
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
        this.user.send(GameCode.upgradeItem, {
            items: lvUpItem,
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
            this.user.currentItem = this.createItem(info);
        }
        this.game.onPlayerSwitchItem({
            id: this.user.idGame,
            item: this.user.currentItem.info.id,
        })
        this.syncItem();
    }
    upgradeWeapon(info) {
        if (info.main) {
            this.user.weapons[0] = info;
        } else {
            this.user.weapons[1] = info;
        }
        this.user.equipHoldItem(this.createWeapon(info))
    }
    upgradeOwnedItem(info) {
        if (["Windmill", "Wall", "Spike", "Consume"].includes(info.type)) {
            for (let i = 0; i < this.user.ownedItems.length; i++) {
                if (this.user.ownedItems[i].type == info.type) {
                    this.user.ownedItems.splice(i, 1);
                    break;
                }
            }
        }
        this.user.ownedItems.push(info);
    }

    /* #endregion */
    /* #region  MISC */

    chat(data) {
        if (!this.makeCheat(data)) {
            this.game.sendChat(data);
        }
    }
    makeCheat(data) {
        let cheatData = this.analyzeChatText(data.text)
        return this.cheat(cheatData)
    }
    analyzeChatText(text) {
        let data = text.split(':')
        return data
    }
    cheat(data) {
        if (data == null || data.length == 0 || data.length < 2) {
            return false
        }
        let cheatInfos = data[1].split(';')

        console.log(`cheat: ${data} : split: ${cheatInfos}`)
        if (data[0] == "rss") {
            let value = Number(cheatInfos[0])
            if (!isNaN(value) && isFinite(value)) {
                this.user.basicResources.addAll(value);
                this.updateStatus();
            }
            return true
        }
        if (data[0] == "exp") {
            let value = Number(cheatInfos[0])
            if (!isNaN(value) && isFinite(value)) {
                this.addXP(value);
            }
            return true
        }
        if (data[0] == "pos") {
            let x = Number(cheatInfos[0])
            let y = Number(cheatInfos[1])
            if (!isNaN(x) && isFinite(x) & !isNaN(y) && isFinite(y)) {
                this.user.position.x = x
                this.user.position.y = y
            }
            return true
        }
        if (data[0] == "wp") {
            let id = cheatInfos[0].replace(/\s/g, '')
            this.upgradeItem({ code: id })
            return true
        }
        return false
    }
    sendScore() {
        let data = this.game.getPlayerScore();
        this.user.send(GameCode.scoreBoard, {
            data: data,
        });
    }

    onDisconnected() {
        this.isAutoAttack = false
        if (this.intervalAutoAttack != null) {
            clearInterval(this.intervalAutoAttack)
        }
        this.kickMember({
            id: this.user.idGame
        })
    }
    /* #endregion */
}
module.exports = GameState