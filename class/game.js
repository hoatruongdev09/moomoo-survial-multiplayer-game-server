const servercode = require("../transmitcode").ServerCode;
const gamecode = require("../transmitcode").GameCode;
const Map = require("./map");
const Resource = require("./resource").Resource;
const ResourceType = require("./resource").ResourceType;

const PhysicEngine = require("./physicEngine");

const Vector = require("../GameUtils/vector");

const WeaponInfo = require("./weapon/weaponInfo");
const ItemInfo = require("./Items/itemInfo");
const AccessoryInfo = require("./Shop/Accessories");
const HatInfo = require("./Shop/Hats");

const ClanManager = require("./ClanManager/clanManager");

const NPC = require("./NPCs/newNPC");
class Game {
    constructor(id, server, gameConfig, name) {
        this.name = name;
        this.id = id;
        this.server = server;
        this.gameConfig = gameConfig;

        this.players;
        this.npcs;
        this.currentPlayerCount = 0;

        this.resources;
        this.userResources = [];
        this.structures = [];
        this.projectile = [];

        this.clanManager = new ClanManager(this);
        this.projectileCount = 0;
        this.structuresCount = 0;

        this.map = new Map(
            this.gameConfig.mapsize,
            {
                x: 2,
                y: 2,
            },
            this.gameConfig.snowSize,
            this.gameConfig.riverSize
        );

        this.physic = new PhysicEngine();
        this.init();
    }

    update(deltaTime) {
        this.new_updatePlayer(deltaTime);
        this.broadcastPlayerPosition();
        this.new_updateNPC(deltaTime);
        this.broadcastNpcPosition();
        this.broadcastStructurePosition()
        this.updatePositionProjectile(deltaTime);
        this.clanManager.update(deltaTime)
    }
    /* #region  CLAN MANAGER */

    createClan(name, player) {
        this.clanManager.createClan(name, player);
    }
    removeClan(clanId) {
        this.clanManager.removeClan(clanId)
    }
    kickMember(memberId, clanId) {
        this.clanManager.kickMember(memberId, clanId)
    }
    checkIsMasterOfClan(memberId, clanId) {
        return this.clanManager.checkIsMasterOfClan(memberId, clanId)
    }
    /* #endregion */
    /* #region  INITIALIZE  */

    init() {
        this.players = new Array(this.gameConfig.maxPlayer);
        this.npcs = new Array(this.gameConfig.npcCount());
        this.initializeResources();
        this.initializeNPC();
    }
    initializeResources() {
        this.resources = new Array(this.gameConfig.resourceCount());
        this.initializeResource(0, this.gameConfig.woodCount, ResourceType.Wood);
        this.initializeResource(10, this.gameConfig.foodCount, ResourceType.Food);
        this.initializeResource(20, this.gameConfig.rockCount, ResourceType.Stone);
        this.initializeResource(30, this.gameConfig.goldCount, ResourceType.Gold);
    }
    initializeResource(startId, count, type) {
        for (let i = startId; i < startId + count; i++) {
            let rs = new Resource(
                i,
                type,
                this.map.randomPosition(),
                -1,
                this.gameConfig.defaultResourceRadius
            );
            this.resources[i] = rs;
        }
    }
    getNpcEvent() {
        return {
            onDie: this.onNpcDie,
            onHit: this.onNpcHit
        }
    }
    initializeNPC() {
        let j = 0;
        for (let i = 0; i < this.gameConfig.npcDuckCount; i++, j++) {
            // DUCK
            this.npcs[j] = new NPC(j, 4, false, 250, this.getRandomPosition(), this, 2, "duck");
        }
        for (let i = 0; i < this.gameConfig.npcChickenCount; i++, j++) {
            // CHICKEN
            this.npcs[j] = new NPC(j, 3, false, 250, this.getRandomPosition(), this, 2, "chicken");
        }
        for (let i = 0; i < this.gameConfig.npcCowCount; i++, j++) {
            // COW
            this.npcs[j] = new NPC(j, 0, false, 500, this.getRandomPosition(), this, 2.4, "cow");
        }
        for (let i = 0; i < this.gameConfig.npcBullCount; i++, j++) {
            // BULL
            this.npcs[j] = new NPC(j, 5, false, 700, this.getRandomPosition(), this, 2.4, "bull");
        }
        for (let i = 0; i < this.gameConfig.npcSheepCount; i++, j++) {
            // SHEEP
            this.npcs[j] = new NPC(j, 2, false, 600, this.getRandomPosition(), this, 2.4, "sheep");
        }
        for (let i = 0; i < this.gameConfig.npcPigCount; i++, j++) {
            // PIG
            this.npcs[j] = new NPC(j, 1, false, 550, this.getRandomPosition(), this, 2.4, "pig");
        }
        for (let i = 0; i < this.gameConfig.npcBullyCount; i++, j++) {
            // BULLY
            this.npcs[j] = new NPC(j, 6, true, 800, this.getRandomPosition(), this, 2.4, "bully");
        }
        for (let i = 0; i < this.gameConfig.npcWolfCount; i++, j++) {
            // WOLF
            this.npcs[j] = new NPC(j, 7, true, 700, this.getRandomPosition(), this, 2.4, "wolf");
        }
    }
    /* #endregion */

    /* #region  PLAYER MANAGER */
    getPlayerScore() {
        let data = [];
        this.players.forEach((p) => {
            if (p != null && p.isJoinedGame) {
                data.push({
                    id: p.idGame,
                    name: p.name,
                    skinId: p.skinId,
                    score: p.scores,
                });
            }
        });
        return data;
    }
    isFull() {
        return this.currentPlayerCount >= this.gameConfig.maxPlayer;
    }
    new_canJoin() {
        if (this.currentPlayerCount >= this.gameConfig.maxPlayer) {
            return {
                result: false,
                reason: "Game is full",
            };
        }
        return {
            result: true,
            reason: "",
        };
    }
    canJoin(data) {
        if (data.name.length >= this.gameConfig.maxNameLength) {
            return {
                result: false,
                reason: "Name is over 15 characters",
            };
        }
        if (this.currentPlayerCount >= this.gameConfig.maxPlayer) {
            return {
                result: false,
                reason: "Game is full",
            };
        }
        return {
            result: true,
            reason: "",
        };
    }
    new_addPlayer(player) {
        let slot = this.findEmptySlot()
        if (slot != null) {
            this.players[slot] = player
            this.currentPlayerCount++
            player.receiveGameData({
                game: this,
                idGame: slot,
                gameData: this.getCurrentGameData()
            })
        } else {
            console.log("game slot is null")
        }
    }
    addPlayer(player, data) {
        let slot = this.findEmptySlot();
        if (slot != null) {
            this.players[slot] = player;
            this.currentPlayerCount++;
            player.name = data.name;
            player.game = this;
            player.idGame = slot;
            player.send(gamecode.gameData, this.getCurrentGameData());
        } else {
            console.log("game slot is null");
        }
    }

    new_playerJoin(player) {
        let spawnPosition = this.map.randomPosition()
        if (player.spawnPad != null) {
            spawnPosition = player.spawnPad.position
            this.removePlayerSpawnPad(player.idGame)
            player.structures.Spawnpad = 0
            player.spawnPad = null
        }
        let spawnRotation = this.map.rangdomAngle()
        player.clientScreenSize.width *= this.gameConfig.viewScale
        player.clientScreenSize.height *= this.gameConfig.viewScale
        player.enterGame({
            moveSpeed: this.gameConfig.playerSpeed,
            position: new Vector(spawnPosition.x, spawnPosition.y),
            lookDirect: spawnRotation,
            bodyRadius: this.gameConfig.playColliderRadius,
            items: this.getStarterPack(),
            shop: {
                hats: this.getStarterHats(),
                accessories: this.getStarterAccessories(),
            },
        })
        this.onNewPlayerJoin(player)
    }
    removePlayer(player) {
        if (player.isJoinedGame) {
            this.onPlayerQuit(player.idGame)
        }
        this.removePlayerSpawnPad(player.idGame);
        this.removePlayerStructures(player.idGame);
        this.players[player.idGame] = null;
        this.currentPlayerCount--;
    }
    findEmptySlot() {
        for (let slot = 0; slot < this.players.length; slot++) {
            if (this.players[slot] == null) {
                return slot;
            }
        }
        return null;
    }
    getOtherPlayersInPlayerView(player) {
        let playerInView = this.getPlayerFromScreenView(player.position, player.clientScreenSize)
        return playerInView
    }
    getNpcInPlayerView(player) {
        let npcInInView = this.getNpcFromScreenView(player.position, player.clientScreenSize)
        return npcInInView
    }
    new_updatePlayer(deltaTime) {
        this.players.forEach((p) => {
            if (p != null && p.isJoinedGame) {
                p.update(deltaTime);
                this.new_syncSinglePlayerPosition(p, deltaTime);
            }
        });
    }
    broadcastPlayerPosition() {
        this.players.forEach(p => {
            if (p != null && p.isJoinedGame) {
                let other = this.getOtherPlayersInPlayerView(p)
                let positionData = []
                let lookData = []
                other.forEach(player => {
                    if (player.lastMovement == null && player.isVisible) {

                    } else {
                        positionData.push({
                            id: player.idGame,
                            pos: {
                                x: player.position.x,
                                y: player.position.y,
                            },
                        })
                        lookData.push({
                            id: player.idGame,
                            angle: player.lookDirect,
                        })
                    }
                })
                p.send(gamecode.syncTransform, {
                    pos: positionData,
                    rot: lookData,
                });
            }
        })
    }
    broadcastStructurePosition() {
        this.players.forEach(p => {
            if (p != null && p.isJoinedGame) {
                let otherStructure = this.getStructureInScreenView(p.position, p.clientScreenSize)
                if (otherStructure.length != 0) {
                    let strData = otherStructure.map((str) => {
                        return {
                            id: str.id,
                            pos: {
                                x: str.position.x,
                                y: str.position.y
                            },
                            rot: str.rotation
                        }
                    })
                    p.send(gamecode.syncStructure, {
                        structures: strData
                    })
                }
            }
        })
    }
    broadcastNpcPosition() {
        this.players.forEach(p => {
            if (p != null && p.isJoinedGame) {
                let otherNPC = this.getNpcInPlayerView(p)
                let positionData = otherNPC.map((npc) => {
                    return {
                        id: npc.id,
                        pos: {
                            x: npc.position.x,
                            y: npc.position.y,
                        },
                        rot: npc.lookAngle,
                    }
                })
                if (positionData.length != 0) {
                    p.send(gamecode.syncNpcTransform, {
                        pos: positionData,
                    });
                }
            }
        })
    }
    updatePlayers(deltaTime) {
        var positionData = [];
        var lookData = [];

        let temp = null;
        this.players.forEach((p) => {
            if (p != null && p.isJoinedGame) {
                p.update(deltaTime);
                temp = this.syncSinglePlayerPosition(p, deltaTime);
                if (temp.pos != null) {
                    positionData.push(temp.pos);
                }
                if (temp.rot != null) {
                    lookData.push(temp.rot);
                }
            }
        });
        if (positionData.length != 0 || lookData.length != 0) {
            this.broadcast(gamecode.syncTransform, {
                pos: positionData,
                rot: lookData,
            });
        }
    }
    new_updateNPC(deltaTime) {
        this.npcs.forEach((n) => {
            if (n != null && n.isJoined) {
                n.update(deltaTime);
                this.new_syncSingleNpcPosition(n, deltaTime);
            }
        });
    }
    new_syncSingleNpcPosition(npc, deltaTime) {
        if (npc != null && npc.isJoined) {
            if (this.map.checkIfIsInRiver(npc.position)) {
                npc.environmentSpeedModifier = this.gameConfig.riverSpeedModifier;
                npc.moveNpc(new Vector(1, 0), deltaTime);
            } else if (this.map.checkIfIsInSnow(npc.position)) {
                npc.environmentSpeedModifier = this.gameConfig.snowSpeedModifier;
            } else {
                npc.environmentSpeedModifier = 1;
            }
            npc.position = this.map.clampPositionToMap(npc.position);
        }
    }
    new_syncSinglePlayerPosition(player, deltaTime) {
        if (this.map.checkIfIsInRiver(player.position) && !player.platformStanding && !player.isWaterMoveNormal) {
            player.environmentSpeedModifier = this.gameConfig.riverSpeedModifier;
            player.movePlayer(0, deltaTime);
        } else if (this.map.checkIfIsInSnow(player.position) && !player.isSnowMoveNormal) {
            player.environmentSpeedModifier = this.gameConfig.snowSpeedModifier;
        } else {
            player.environmentSpeedModifier = 1;
        }
        player.position = this.map.clampPositionToMap(player.position);
    }
    getNpcFromView(position) {
        let viewObjects = [];
        let temp = new Vector(0, 0);
        this.npcs.forEach((n) => {
            if (n != null && n.isJoined) {
                temp.x = position.x - n.position.x;
                temp.y = position.y - n.position.y;
                if (
                    temp.sqrMagnitude() < Math.pow(this.gameConfig.viewPlayerRadius, 2)
                ) {
                    viewObjects.push({
                        id: n.id,
                        bodyCollider: n.bodyCollider,
                    });
                }
            }
        });
        return viewObjects;
    }
    getNpcFromScreenView(position, screenView) {
        let viewObjects = this.npcs.filter(n => {
            if (n != null && n.isJoined && this.checkIfPositionIsInScreenView(n.position, position, screenView)) {
                return n
            }
        })
        return viewObjects
    }
    checkIfPositionIsInScreenView(position, screenPosition, screenView) {
        let deltaX = Math.abs(position.x - screenPosition.x)
        let deltaY = Math.abs(position.y - screenPosition.y)

        return deltaX < screenView.width && deltaY < screenView.height
    }
    getPlayerFromScreenView(position, screenView) {
        let viewObjects = this.players.filter(p => {
            if (
                p != null && p.isJoinedGame &&
                this.checkIfPositionIsInScreenView(p.position, position, screenView)
            ) {
                return p
            }
        })
        return viewObjects;
    }
    getPlayersFromView(position) {
        let viewObjects = [];
        let temp = new Vector(0, 0);

        this.players.forEach((p) => {
            if (p != null && p.isJoinedGame) {
                temp.x = position.x - p.position.x;
                temp.y = position.y - p.position.y;
                if (
                    temp.sqrMagnitude() < Math.pow(this.gameConfig.viewPlayerRadius, 2)
                ) {
                    viewObjects.push({
                        id: p.idGame,
                        bodyCollider: p.bodyCollider,
                    });
                }
            }
        });
        return viewObjects;
    }
    getPlayersFromViewInRange(position, range) {
        let viewObjects = [];
        let temp = new Vector(0, 0);

        this.players.forEach((p) => {
            if (p != null && p.isJoinedGame) {
                temp.x = position.x - p.position.x;
                temp.y = position.y - p.position.y;
                if (temp.sqrMagnitude() < Math.pow(range, 2)) {
                    viewObjects.push({
                        id: p.idGame,
                        bodyCollider: p.bodyCollider,
                    });
                }
            }
        });
        return viewObjects;
    }
    getPlayerInfo(id) {
        return this.players[id];
    }
    /* #endregion */

    /* #region  GAME DATA */
    getCurrentGameData() {
        let gameData = {
            maxPlayer: this.gameConfig.maxPlayer,
            maxNpcCount: this.gameConfig.npcCount(),
            mapSize: {
                x: this.gameConfig.mapsize.x,
                y: this.gameConfig.mapsize.y,
            },
            snowSize: this.gameConfig.snowSize,
            riverSize: this.gameConfig.riverSize,
            resource: this.getResourceInfo(),
            players: this.getPlayersInfo(),
            structures: this.getStructuresInfo(),
            npc: this.getNpcInfo(),
            clans: this.clanManager.getClanData(),
            clansMember: this.clanManager.getClansMemberData(),
            shop: this.getAllShopItem(),
        };

        return gameData;
    }
    getPlayersInfo() {
        let playingPlayer = this.players.filter(p => {
            if (p != null && p.isJoinedGame) { return p }
        })
        let data = playingPlayer.map(p => {
            return {
                id: p.idGame,
                name: p.name,
                skinId: p.skinId,
                itemId: p.currentItem.info.id,
                hat: p.equippedHat == null ? "" : p.equippedHat.id,
                acc: p.equippedAccessory == null ? "" : p.equippedAccessory.id,
                hp: p.getHealthPointData(),
                pos: {
                    x: p.position.x,
                    y: p.position.y,
                },
            }
        })
        return data;
    }
    getNpcInfo() {
        let joinedNpc = this.npcs.filter(n => {
            if (n != null && n.isJoined) { return n }
        })
        let data = joinedNpc.map(n => {
            return {
                id: n.id,
                skinId: n.skinId,
                hp: n.getHpPercent(),
                pos: {
                    x: n.position.x,
                    y: n.position.y,
                },
                rot: n.lookAngle,
            }
        })
        return data;
    }
    getStructuresInfo() {
        let data = this.structures.map(item => {
            return {
                id: item.id,
                itemId: item.itemId,
                pos: {
                    x: item.position.x,
                    y: item.position.y,
                },
                rot: item.rotation,
            }
        })
        return data;
    }
    getResourceInfo() {
        let data = this.resources.map(r => {
            return {
                id: r.id,
                type: r.idType,
                pos: r.position,
            }
        })
        return data;
    }
    /* #endregion */
    /* #region  ITEM & SHOP */
    getStarterHats() {
        return HatInfo.getHatsByPrice(0);
    }
    getStarterAccessories() {
        return AccessoryInfo.getAccessoriesByPrice(0);
    }
    getAllShopItem() {
        return {
            hats: HatInfo.getAllInfo(),
            accessories: AccessoryInfo.getAllInfo(),
        };
    }
    getHatById(id) {
        return HatInfo.getHatById(id);
    }
    getAccessoryById(id) {
        return AccessoryInfo.getAccessoryById(id);
    }
    /* #endregion */
    /* #region  GAME WEAPON AND STRUCTURE */

    getStarterPack() {
        let mainWeapon = WeaponInfo.getInfoByAge(1); //WeaponInfo.getInfoByStringId("w0")
        let items = ItemInfo.getInfoByAge(1);

        return {
            weapons: mainWeapon,
            items: items,
        };
    }
    getItemsByLevel(level) {
        let weapons = WeaponInfo.getInfoByAge(level);
        let items = ItemInfo.getInfoByAge(level);
        return {
            weapons: weapons,
            items: items,
        };
    }
    getWeaponByCode(code) {
        return WeaponInfo.getInfoByStringId(code);
    }
    getItemByCode(code) {
        return ItemInfo.getInfoByStringId(code);
    }
    /* #endregion */

    /* #region  GAME EVIROMENT VIEW */
    getResourceFromView(position) {
        let viewObjects = [];
        let temp = new Vector(0, 0);
        this.resources.forEach((r) => {
            temp.x = position.x - r.position.x;
            temp.y = position.y - r.position.y;
            if (
                temp.sqrMagnitude() < Math.pow(this.gameConfig.viewResourceRadius, 2)
            ) {
                viewObjects.push({
                    id: r.id,
                    bodyCollider: r.bodyCollider,
                });
            }
        });
        return viewObjects;
    }
    getStructureInScreenView(center, screenSize) {
        let viewObjects = this.structures.filter(s => {
            if (this.checkIfPositionIsInScreenView(s.position, center, screenSize))
                return s
        })
        return viewObjects

    }
    getStructureFromView(position) {
        let viewObjects = [];
        let temp = new Vector(0, 0);
        this.structures.forEach((s) => {
            temp.x = position.x - s.position.x;
            temp.y = position.y - s.position.y;
            if (
                temp.sqrMagnitude() < Math.pow(this.gameConfig.viewResourceRadius, 2)
            ) {
                viewObjects.push({
                    id: s.id,
                    type: s.toString(),
                    bodyCollider: s.bodyCollider,
                });
            }
        });
        return viewObjects;
    }
    /* #endregion */

    /* #region  COLLIDER TESTER */
    testCollisionCircle2Circle(object1, object2, response) {
        return this.physic.testCircle2Circle(
            object1.bodyCollider,
            object2.bodyCollider,
            response
        );
    }
    testCollisionPolygon2Circle(poliObj, circleObj, response) {
        return this.physic.testPolygon2Circle(
            poliObj.bodyCollider,
            circleObj.bodyCollider,
            response
        );
    }
    /* #endregion */
    /* #region   COLLISION CHECK*/
    checkBothPlayerAreInClan(player1, player2) {
        if (player1 == null || player2 == null) { return false }
        if (!player1.isJoinedGame || !player2.isJoinedGame) { return false }
        if (player1.clanId == null || player2.clanId == null) { return false }
        if (player1.idGame == player2.idGame) { return true }
        return player1.clanId == player2.clanId
    }
    playerHitPlayer(idFrom, idTarget, damage) {
        if (this.checkBothPlayerAreInClan(this.players[idFrom], this.players[idTarget])) {
            return
        }
        this.players[idTarget].takeDamage(damage,
            (id) => this.playerDieCallback(idFrom, id),
            (damageReflect, forceReflect) => this.playerReflectAttack(idTarget, idFrom, damageReflect, forceReflect))
        this.players[idFrom].lifeStealing(damage)
        this.players[idFrom].selfTakeDamage(damage, (id) => this.playerDieCallback(idFrom, id), (damageReflect, forceReflect) => { })
    }
    playerStealResourcePlayer(idFrom, idTarget, resource) {
        let playerFrom = this.getPlayerInfo(idFrom)
        let playerTarget = this.getPlayerInfo(idTarget)
        let stoleResource = playerTarget.loseResource(resource)
        playerFrom.takeResource(stoleResource)
    }
    playerDieCallback(idFrom, idTarget) {
        this.bonusKillForPlayer(idFrom, idTarget)
    }
    playerDieDueToNpcCallback(idNpc, idPlayer) {

    }
    playerReflectAttack(idFrom, idTarget, damageReflect, forceReflect) {
        if (damageReflect != 0) {
            this.players[idTarget].takeDamage(damageReflect,
                (id) => this.playerDieCallback(idFrom, id),
                (damageReflect, forceReflect) => { })
        }
        if (forceReflect != 0) {
            let targetPosition = this.players[idTarget].position.clone()
            let originPosition = this.players[idFrom].position.clone()
            this.pushPlayerBack(this.players[idTarget], targetPosition.sub(originPosition), forceReflect)
        }
    }
    playerReflectAttackToNpc(idFrom, idTarget, damageReflect, forceReflect) {
        this.npcs[idTarget].onBeingHit(this.players[idFrom], damageReflect);
        this.pushNpcBack(
            this.npcs[idTarget],
            this.npcs[idTarget].position.clone().sub(this.players[idFrom].position.clone()),
            forceReflect
        );
    }
    bonusKillForPlayer(idPlayer, idTarget) {
        console.log(`player: ${idPlayer}: `, this.players[idPlayer])
        let bonusModifier = this.players[idPlayer].killBonusGold
        let bonusGold = 0
        if (this.players[idPlayer].wearThiefGear) {
            bonusGold = this.players[idTarget].getCurrentGoldAmount() / 2
        }
        if (this.players[idPlayer] == null || !this.players[idPlayer].isJoinedGame) {
            return
        }
        this.players[idPlayer].takeBonus({ kill: 1, gold: (250 + bonusGold) * (1 + bonusModifier), xp: 100 })
    }
    npcHitPlayer(idFrom, idTarget, damage) {
        if (this.players[idTarget] == null || !this.players[idTarget].isJoinedGame) {
            return
        }
        this.players[idTarget].takeDamage(damage,
            (id) => this.playerDieDueToNpcCallback(idFrom, id),
            (damageReflect, forceReflect) => this.playerReflectAttackToNpc(idTarget, idFrom, damageReflect, forceReflect))
    }
    respawnNpc(npc) {
        setTimeout(() => {
            npc.isJoined = true;
            npc.reset();
            let randomPosition = this.getRandomPosition();
            npc.position.x = randomPosition.x
            npc.position.y = randomPosition.y
            this.onCreateNpc({
                id: npc.id,
                skinId: npc.skinId,
                hp: 1,
                pos: {
                    x: npc.position.x,
                    y: npc.position.y,
                },
                rot: npc.lookAngle,
            })
        }, 30 * 1000);
    }
    playerHitNpc(idFrom, idTarget, damage) {
        this.npcs[idTarget].onBeingHit(this.players[idFrom], damage, (fromTarget, npc) => this.onNpcDie(fromTarget, npc));
        this.players[idFrom].lifeStealing(damage)
        this.players[idFrom].selfTakeDamage(damage, (id) => this.playerDieCallback(idFrom, id), (damageReflect, forceReflect) => { })
    }
    playerStructureHitNpc(idFrom, idTarget, damage) {
        this.npcs[idTarget].onBeingHit(this.players[idFrom], damage, (fromTarget, npc) => this.onNpcDie(fromTarget, npc));
    }
    syncNpcHP(data) {
        this.broadcast(gamecode.syncNpcHP, {
            data: data,
        });
    }
    playerStructureHitPlayer(idFrom, idTarget, damage) {
        if (this.checkBothPlayerAreInClan(this.players[idFrom], this.players[idTarget])) {
            return
        }
        console.log(`player structure take damage ${idFrom} ${idTarget}`)
        this.players[idTarget].takeDamage(damage,
            (id) => this.playerDieCallback(idFrom, id),
            (damageReflect, forceReflect) => { })
    }
    syncPlayerHP(data) {
        this.broadcast(gamecode.playerHit, {
            data: data,
        });
    }
    npcHitStructures(id, idStructure) {
        let structure = this.findStructureWithId(idStructure);
        if (structure == null) {
            return;
        }
        if (structure.toString() == "PitTrap") {
            structure.trapNpc(this.npcs[id]);
            return;
        }
        if (structure.toString() == "Spike") {
            this.playerStructureHitNpc(structure.userId, id, structure.damage);
            this.pushNpcBack(
                this.npcs[id],
                this.npcs[id].position.clone().sub(structure.position),
                5
            );
        }
    }
    playerHitStructures(idFrom, idStructure) {
        let structure = this.findStructureWithId(idStructure);
        if (structure == null) {
            return;
        }
        structure.interact(this.players[idFrom], (action) => { })
        if (this.checkBothPlayerAreInClan(this.players[idFrom], this.players[structure.userId])) {
            return
        }
        if (structure.toString() == "Spike") {
            structure.interact(this.players[idFrom], (action) => {
                if (action) {
                    this.playerStructureHitPlayer(structure.userId, idFrom, structure.damage);
                    this.pushPlayerBack(this.players[idFrom], this.players[idFrom].position.clone().sub(structure.position), 5);
                }
            })
            return;
        }
        if (structure.toString() == "PitTrap") {
            structure.interact(this.players[idFrom], (action) => { });
            return;
        }
    }
    playerAttackStructure(idPlayer, idStructure, damage, gatherRate, goldGatherRate) {
        let structure = this.findStructureWithId(idStructure)
        if (structure == null) {
            return
        }
        structure.hitInteract(this.players[idPlayer], (idType) => {
            let key = this.getKeyByValue(ResourceType, idType)
            this.players[idPlayer].receiveResource(weapon.info.gatherRate, key)
            this.players[idPlayer].addXP(weapon.info.goldGatherRate)
        })
        if (this.checkBothPlayerAreInClan(this.players[idPlayer], this.players[structure.userId])) {
            return
        }
        structure.takeDamage(damage, () => {
            this.removeStructure(structure.id)
        })
    }
    old_playerAttackStructure(idPlayer, idStructure, weapon) {
        let damage = weapon.info.structureDamage;
        let structure = this.findStructureWithId(idStructure);
        // console.log("structure: ", structure)
        if (structure == null) {
            return;
        }
        structure.hitInteract(this.players[idPlayer], (idType) => {
            let key = this.getKeyByValue(ResourceType, idType);
            this.players[idPlayer].receiveResource(weapon.info.gatherRate, key);
            this.players[idPlayer].addXP(weapon.info.goldGatherRate);
        })
        if (this.checkBothPlayerAreInClan(this.players[idPlayer], this.players[structure.userId])) {
            return
        }
        structure.takeDamage(damage, () => {
            console.log("remove structure: ", structure.id)
            this.removeStructure(structure.id);
        })
    }
    playerAttackResource(player, idResource, weapon) {
        let key = this.getKeyByValue(
            ResourceType,
            this.resources[idResource].idType
        );
        if (key == "Gold") {
            this.addGold(player, weapon.info.goldGatherRate);
        } else {
            player.receiveResource(weapon.info.gatherRate, key);
        }
        player.addXP(weapon.info.goldGatherRate);
    }
    addGold(player, value) {
        player.basicResources.Gold += value;
        player.scores += value;
    }
    /* #endregion */

    /* #region  STRUCTURE MANAGER */

    findStructureWithId(id) {
        let structure = null;
        for (let s of this.structures) {
            if (s.id == id) {
                structure = s;
                break;
            }
        }
        return structure;
    }
    generateStructureId() {
        return this.structuresCount++;
    }
    checkOverlapStructure(playerId, structure) {
        let isOverlapWithStructure = this.checkStructureOverlapStructure(playerId, structure)
        let isOverlapWithResource = this.checkStructureOverlapResource(playerId, structure)
        let isOverlapWithNpc = this.checkStructureOverlapNpc(playerId, structure)
        return isOverlapWithStructure && isOverlapWithResource && isOverlapWithNpc

    }
    checkStructureOverlapStructure(playerId, structure) {
        let structureInView = this.getStructureFromView(structure.position)
        for (let i = 0; i < structureInView.length; i++) {
            if (this.testCollisionCircle2Circle(structure, structureInView[i], (res, obj) => { })) {
                return false
            }
            if (structureInView[i].toString() == "Blocker" && structureInView[i].userId != playerId) {
                let distance = structureInView[i].position.clone().sub(structure.position).sqrMagnitude()
                if (distance < Math.pow(structureInView[i].range, 2)) {
                    return false
                }
            }
        }
        return true
    }
    checkStructureOverlapResource(playerId, structure) {
        let resourceInView = this.getResourceFromView(structure.position)
        for (let i = 0; i < resourceInView.length; i++) {
            if (this.testCollisionCircle2Circle(structure, resourceInView[i], (res, obj) => { })) {
                return false
            }
        }
        return true
    }
    checkStructureOverlapNpc(playerId, structure) {
        let npcInView = this.getNpcInPlayerView(this.players[playerId])
        for (let i = 0; i < npcInView.length; i++) {
            if (npcInView[i].isJoined) {
                if (this.testCollisionCircle2Circle(structure, npcInView[i], (res, obj) => { })) {
                    return false
                }
            }
        }
        return true
    }
    addStructure(user, item) {
        this.structures.push(item);
        user.structures[item.toString()] += 1;
        this.onCreateStructure({
            id: item.id,
            fromId: user.idGame,
            itemId: item.itemId,
            pos: {
                x: item.position.x,
                y: item.position.y,
            },
            rot: item.rotation,
        })
    }
    removeStructure(id) {
        for (let i = 0; i < this.structures.length; i++) {
            if (this.structures[i].id == id) {
                this.structures[i].destroy();
                this.structures.splice(i, 1);
                return;
            }
        }
        this.onRemoveStructure([id])
    }
    removePlayerStructures(idPlayer) {
        let data = [];
        for (let i = 0; i < this.structures.length; i++) {
            if (this.structures[i].userId == idPlayer) {
                if (this.structures[i].toString() != "Spawnpad") {
                    data.push(this.structures[i].id);
                    this.structures[i].destroy();
                    this.structures.splice(i, 1);
                    i--;
                }
            }
        }
        this.onRemoveStructure(data)
    }
    removePlayerSpawnPad(idPlayer) {
        let data = [];
        for (let i = 0; i < this.structures.length; i++) {
            if (this.structures[i].userId == idPlayer) {
                if (this.structures[i].toString() == "Spawnpad") {
                    data.push(this.structures[i].id);
                    this.structures[i].destroy();
                    this.structures.splice(i, 1);
                    break;
                }
            }
        }
        this.onRemoveStructure(data)
    }
    /* #endregion */
    /* #region  PROJECTILE */

    getProjectileId() {
        return this.projectileCount++;
    }
    addProjectTile(item, direct) {
        this.projectile.push(item);
        this.onCreateProjectile({
            id: item.id,
            skinId: item.idSkin,
            pos: {
                x: item.position.x,
                y: item.position.y,
            },
            angle: direct,
        })
    }
    removeProjectile(id) {
        for (let i = 0; i < i < this.projectile.length; i++) {
            if (this.projectile[i].id == id) {
                this.projectile[i].destroy();
                this.projectile.splice(i, 1);
                this.onRemoveProjectile([id])
                return;
            }
        }
    }
    updatePositionProjectile(deltaTime) {
        let data = [];
        this.projectile.forEach((p) => {
            if (p.isDestroy) {
                this.removeProjectile(p.id);
            } else {
                p.updatePosition(deltaTime);
                data.push({
                    id: p.id,
                    pos: {
                        x: p.position.x,
                        y: p.position.y,
                    },
                });
            }
        });
        if (data.length != 0) {
            this.onSyncProjectilePosition(data)
        }
    }
    /* #endregion */
    /* #region  GAME EVENTS */
    onNewPlayerJoin(player) {
        // console.log(`player join: ${player.lastMovement} ${player.lastLook}`)
        this.broadcast(gamecode.spawnPlayer, {
            clientId: player.id,
            id: player.idGame,
            clanId: player.clanId == null ? -1 : player.clanId,
            name: player.name,
            skinId: player.skinId,
            hp: player.getHealthPointData(),
            pos: {
                x: player.position.x,
                y: player.position.y,
            },
            rot: player.lookDirect
        });
    }
    onPlayerQuit(data) {
        this.broadcast(gamecode.playerQuit, {
            id: data
        });
    }
    onPlayerEquipItem(data) {
        this.broadcast(gamecode.syncEquipItem, data)
    }
    onPlayerGetHit(data) {
        let pack = [];
        pack.push(data);
        this.syncPlayerHP(pack);
    }
    onPlayerDie(idPlayer) {
        this.removePlayerStructures(idPlayer)
        this.broadcast(gamecode.playerDie, { id: idPlayer })
    }
    onPlayerSwitchItem(data) {
        this.broadcast(gamecode.switchItem, data)
    }
    onCreateNpc(data) {
        this.broadcast(gamecode.spawnNpc, data)
    }
    onNpcDie(player, npc) {
        this.npcs[npc.id].isJoined = false
        if (this.players[player.idGame] != null && this.players[player.idGame].isJoinedGame) {
            this.addGold(this.players[player.idGame], 100)
        }
        this.respawnNpc(this.npcs[npc.id]);
        this.broadcast(gamecode.syncNpcDie, {
            id: npc.id,
        });
    }
    onNpcHit(npc) {
        if (this.npcs[npc.id].isJoined) {
            let data = [{
                id: npc.id,
                hp: this.npcs[npc.id].getHpPercent()
            }]
            this.syncNpcHP(data)
        }
    }
    onPlayerTriggerAttack(data) {
        this.broadcast(gamecode.triggerAttack, data)
    }
    onCreateStructure(data) {
        this.broadcast(gamecode.spawnnStructures, data)
    }
    onRemoveStructure(data) {
        this.broadcast(gamecode.removeStructures, {
            id: data
        })
    }
    onCreateProjectile(data) {
        this.broadcast(gamecode.createProjectile, data)
    }
    onRemoveProjectile(data) {
        this.broadcast(gamecode.removeProjectile, {
            id: data
        })
    }
    onSyncProjectilePosition(data) {
        this.broadcast(gamecode.syncPositionProjectile, {
            pos: data
        })
    }

    /* #endregion */
    getRandomPosition() {
        let pos = this.map.randomPosition();
        return new Vector(pos.x, pos.y);
    }
    sendChat(data) {
        this.broadcast(gamecode.playerChat, data);
    }
    getKeyByValue(object, value) {
        return Object.keys(object).find((key) => object[key] === value);
    }
    pushNpcBack(npc, direct, range) {
        npc.position.add(direct.unitVector.scale(range));
    }
    pushPlayerBack(player, direct, range) {
        player.position.add(direct.unitVector.scale(range));
    }
    broadcast(event, args) {
        this.players.forEach((p) => {
            if (p != null) {
                p.send(event, args);
            }
        });
    }
}

module.exports = Game;
