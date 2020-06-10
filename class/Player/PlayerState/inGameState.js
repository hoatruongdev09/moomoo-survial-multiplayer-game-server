const TransmitCode = require('../../../transmitcode')
const ServerCode = TransmitCode.ServerCode
const GameCode = TransmitCode.GameCode
const ClanCode = TransmitCode.ClanCode


const Vector = require("../../../GameUtils/vector");
const SAT = require("sat");

const PlayerState = require('./playerState.js')


class InGameState extends PlayerState {
    constructor(player, stateManager) {
        super(player, stateManager)
        this.game = null
    }

    enter() {
        this.game = this.player.game
        this.registerEvents()
        this.resetAttributes()

    }

    update(deltaTime) {
        this.updatePosition(deltaTime);
        this.updateRotation();
    }

    exit() {

    }
    updatePosition(deltaTime) {
        if (this.player.lastMovement == null) {
            return;
        }
        this.player.moveDirect = new Vector(
            Math.cos(this.player.lastMovement),
            Math.sin(this.player.lastMovement)
        );

        this.player.position.add(this.player.moveDirect.clone().scale(this.player.moveSpeed * (!this.player.platformStanding ? this.player.speedModifier * this.player.inviromentSpeedModifier : 1) * deltaTime));
        // console.log("modifier: ", (this.platformStanding == false ? this.speedModifier * this.inviromentSpeedModifier : 1))

        this.player.bodyCollider.pos.x = this.player.position.x;
        this.player.bodyCollider.pos.y = this.player.position.y;

        this.checkCollider();
    }
    updateRotation() {
        if (this.player.lastLook == null) {
            return;
        }
        this.player.lookDirect = this.player.lastLook;
    }
    registerEvents() {
        this.socket.on(GameCode.syncLookDirect, (data) => this.syncLookDirect(data));
        this.socket.on(GameCode.syncMoveDirect, (data) => this.syncMoveDirect(data));

        // this.socket.on(GameCode.triggerAttack, (data) => this.useItem(data));
        // this.socket.on(GameCode.triggerAutoAttack, (data) => this.autoAttack(data));
        // this.socket.on(GameCode.switchItem, (data) => this.switchItem(data));
        // this.socket.on(GameCode.upgradeItem, (data) => this.upgradeItem(data));
        // this.socket.on(GameCode.playerChat, (data) => this.chat(data));
        // this.socket.on(GameCode.scoreBoard, () => this.sendScore());
        // this.socket.on(GameCode.shopSelectItem, (data) => this.chooseItem(data));

        // this.socket.on(ClanCode.createClan, (data) => this.createClan(data));
        // this.socket.on(ClanCode.kickMember, (data) => this.kickMember(data));
        // this.socket.on(ClanCode.joinClan, (data) => this.requestJoinClan(data));
        // this.socket.on(ClanCode.requestJoin, (data) => this.responRequestJoinClan(data));
    }
    removeEvenst() {
        this.socket.on(GameCode.syncLookDirect, this.syncLookDirect);
        this.socket.on(GameCode.syncMoveDirect, this.syncMoveDirect);
    }
    syncLookDirect(data) {
        this.player.lastLook = data;
    }
    syncMoveDirect(data) {
        this.player.lastMovement = data;
    }

    movePlayer(direct, deltaTime) {
        this.player.lastMovement = direct;
        this.player.moveDirect = new Vector(
            Math.cos(this.player.lastMovement),
            Math.sin(this.player.lastMovement)
        );
        this.player.position.add(
            this.player.moveDirect.clone().scale(this.player.moveSpeed * deltaTime)
        );
        this.player.bodyCollider.pos.x = this.player.position.x;
        this.player.bodyCollider.pos.y = this.player.position.y;

        this.checkCollider();
    }

    checkCollider() {
        this.checkColliderWithResources();
        this.checkColliderWithStructures();
    }
    checkColliderWithResources() {
        let resourcesView = this.game.getResourceFromView(this.player.position);
        for (const r of resourcesView) {
            this.game.testCollisionCircle2Cirle(this.player, r, (response, objectCollide) =>
                this.onCollisionWithResource(response, objectCollide)
            );
        }
        // console.log("resource: ", this.resourcesView)
    }
    checkColliderWithStructures() {
        let structuresView = this.game.getStructureFromView(this.player.position);
        for (const s of structuresView) {
            this.game.testCollisionCircle2Cirle(this, s, (response, objectCollide) =>
                this.onCollisionWithStructures(response, objectCollide, s)
            );
        }
    }
    onCollisionWithResource(response, object) {
        let overlapPos = response.overlapV;
        this.player.position.x -= overlapPos.x;
        this.player.position.y -= overlapPos.y;
    }
    onCollisionWithStructures(response, object, objectInfo) {
        let structures = ["Wall", "Spike", "Windmill", "Turret", "MineStone", "Sapling"]
        if (structures.includes(objectInfo.type)) {
            // if (objectInfo.type == "Wall" || objectInfo.type == "Spike" || objectInfo.type == "Windmill" || objectInfo.type == "Turret" || ) {
            let overlapPos = response.overlapV;
            this.player.position.x -= overlapPos.x;
            this.player.position.y -= overlapPos.y;
        }
        this.game.playerHitStructures(this.player.idGame, objectInfo.id);
    }

    resetAttributes() {
        this.player.isJoinedGame = true

        this.player.healthPoint = 100;
        this.player.kills = 0;
        this.player.scores = 0;
        this.player.levelInfo.reset();
        this.player.basicResources.reset();

        this.player.isAutoAttack = false
        clearInterval(this.player.intervalAutoAttack);

        this.player.structures.reset()

        if (this.player.bodyCollider == null) {
            this.player.bodyCollider = new SAT.Circle(new SAT.Vector(this.player.position.x, this.player.position.syncLookDirect), this.player.bodyRadius);
        } else {
            this.player.bodyCollider.pos.x = this.player.position.x;
            this.player.bodyCollider.pos.y = this.player.position.y;
            // this.bodyCollider = new SAT.Circle(new SAT.Vector(this.position.x, this.position.syncLookDirect), data.bodyRadius)
        }
    }
}
module.exports = InGameState