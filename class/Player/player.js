const ServerCode = require('../../transmitcode').ServerCode
const GameCode = require('../../transmitcode').GameCode
const ClanCode = require('../../transmitcode').ClanCode

const StateManager = require('./PlayerState/playerStateManager')
const MenuState = require('./PlayerState/menuState')
const InGameState = require('./PlayerState/inGameState')

const Vector = require("../../GameUtils/vector");
const SAT = require('../../GameUtils/modifiedSAT').sat;

const Melee = require("../weapon/melee");
const Ranged = require("../weapon/ranged");
const Item = require("../Items/item");

const levelDescription = require("../levelInfo");

const ResourceManager = require('./resourcesManager')
const StructureManager = require('./structureManager')
const LevelManager = require('./levelManager')

class Player {
    constructor(idServer, server, socket) {
        /* #region SERVER IDENTITIES  */
        this.idServer = idServer;
        this.server = server;
        this.socket = socket;
        /* #endregion */

        /* #region  CLIENT PROPERTIES */
        this.clientScreenSize = {
            width: 60,
            height: 30
        }
        /* #endregion */

        /* #region  SERVER FUNCTION */
        this.handleSocket(socket);
        this.isSuspend = false
        this.isDelayQuit = false
        /* #endregion */

        /* #region   GAME IDENTITIES*/
        this.game = null
        this.idGame = -1
        this.isJoinedGame = false
        this.name = ''
        this.skinId = 0
        this.clanId = null
        /* #endregion */

        /* #region  TRANSFORM */
        this.moveSpeed
        this.position
        this.moveDirect
        this.lookDirect
        this.lastMovement
        this.lastLook
        this.bodyCollider
        this.bodyRadius
        /* #endregion */

        /* #region  WEAPONS */
        this.weapons = []
        this.onwedItems = []
        this.currentItem = null
        /* #endregion */

        this.healthPoint = 100
        this.kills = 0
        this.scores = 0

        this.levelInfo = new LevelManager()
        this.basicResources = new ResourceManager()

        /* #region  EFFECTS */
        this.speedModifier = 1
        this.environmentSpeedModifier = 1
        this.platformStanding = false
        /* #endregion */

        /* #region  STRUCTURES */
        this.spawnPad = null
        this.structures = new StructureManager()
        /* #endregion */

        /* #region  OWNED HATS & ACCESSORIES */
        this.ownedHat = [];
        this.ownedAccessories = [];
        this.equipedHat = null;
        this.equipedAccessory = null;
        /* #endregion */

        this.isAutoAttack = false;
        this.intervalAutoAttack;

        /* #region  STATES */
        this.stateManager = new StateManager()
        this.menuState = new MenuState(this, this.stateManager)
        this.inGameState = new InGameState(this, this.stateManager)

        this.stateManager.start(this.menuState)
        /* #endregion */
    }
    update(deltaTime) {
        this.stateManager.currentState.update(deltaTime)
    }
    /* #region   CONNECT EVENTS*/
    handleSocket(socket) {
        this.send(ServerCode.OnConnect, {
            id: this.idServer,
            listGame: this.server.listGame(),
        });
        this.registerListenter();
    }
    registerListenter() {
        this.socket.on("disconnect", () => this.onDisconnect());
        this.socket.on(ServerCode.OnPing, () => this.onPing());
        this.socket.on(ServerCode.ClientStatus, (data) => this.onRecievedClientStatus(data));

    }
    /* #endregion */

    /* #region  LOGIC */
    enterGame(data) {
        this.moveSpeed = data.moveSpeed;
        this.position = data.position;
        this.lookDirect = data.lookDirect;
        this.onwedItems = data.items.items;
        this.weapons = data.items.weapons;
        this.ownedHat = data.shop.hats;
        this.ownedAccessories = data.shop.accessories;
        this.bodyRadius = data.bodyRadius
        this.stateManager.changeState(this.inGameState)

        this.updateStatus();
        this.syncItem();
        this.syncItemShop();
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
    /* #endregion */

    /* #region  MOVEMENTS */
    movePlayer(direct, deltaTime) {
        this.stateManager.currentState.movePlayer(direct, deltaTime)
    }
    /* #endregion */

    /* #region  DATA ACCESS */
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
    /* #endregion */

    /* #region  TRANSMIT EVENTS */
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
    onPing() {
        this.send(ServerCode.OnPing, null);
    }
    send(event, args) {
        this.socket.emit(event, args);
    }
    /* #endregion */
}

module.exports = Player