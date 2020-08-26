const SAT = require('../../GameUtils/modifiedSAT').sat;
const Vector = require("../../GameUtils/vector");
const Mathf = require("../../GameUtils/mathfPlus");

class NPC {
  constructor(id, skinId, isHostitle, maxHp, position, game, size) {
    this.id = id;
    this.skinId = skinId;
    this.size = size;
    this.position = position;
    this.game = game;

    this.normalMoveSpeed = 6 + (isHostitle ? 2 : 0);
    this.moveSpeed = this.normalMoveSpeed;
    this.rotateSpeed = 1.2 + (isHostitle ? 2 : 0);
    this.environmentSpeedModifier = 1;

    this.lastMoveDirect;
    this.moveDirect = Vector.zero();
    this.lookAngle;
    this.maxHp = maxHp;
    this.healthPoint = maxHp;

    this.isHostitle = isHostitle;
    this.isResting = true;
    this.targetPosition = this.position.clone();
    this.isTiming = false;
    this.isRunaway = false;
    this.searchedAround = false;

    this.bodyCollider;
    this.initCollider();

    this.isTrapped = false;
    this.isJoined = true;

    this.lookRange = 20;
    this.target = null;

    this.damage = 10;

    this.playersNearby = [];
    this.resourcesView = [];
    this.structureView = [];
  }
  initCollider() {
    this.bodyCollider = new SAT.Circle(this.position, this.size);
    // this.bodyCollider.setOffset(new SAT.Vector(this.size.x / 2, this.size.y / 2))
  }
  reset() {
    this.target = null;
    this.isTrapped = false;
    this.isTiming = false;
    this.isRunaway = false;
    this.searchedAround = false;
    this.isResting = true;
    this.environmentSpeedModifier = 1;
    this.healthPoint = this.maxHp;
  }
  update(deltaTime) {
    this.logic(deltaTime);
    this.updatePosition(deltaTime);
  }
  logic(deltaTime) {
    if (this.isTrapped) {
      return;
    }
    if (this.isHostitle) {
      if (this.isResting) {
        this.rest();
      } else {
        this.hunt();
      }
    } else {
      if (this.isResting) {
        // RESTING
        this.rest();
      } else {
        // ACTIVE
        // console.log("npc move: ", this.position, ", lastMoveDirect: ", this.lastMoveDirect, ", move direct: ", this.moveDirect)

        this.active();
      }
    }
  }
  rest() {
    if (this.isTiming) {
      return;
    }
    this.lastMoveDirect = null;
    this.isTiming = true;
    setTimeout(() => {
      this.isResting = false;
      this.setTarget(this.getRandomPosition());
      this.setMove(this.targetPosition);
      this.isTiming = false;
    }, Mathf.RandomRange(7, 20) * 1000); // REST TIME
  }
  hunt() {
    if (this.target == null || !this.target.isJoinedGame) {
      this.searchAround();
    } else {
      if (
        this.position.clone().sub(this.target.position).sqrMagnitude() <= 16
      ) {
        this.makeAttack();
      } else if (
        this.position.clone().sub(this.target.position).sqrMagnitude() >
        Math.pow(this.lookRange, 2)
      ) {
        this.target = null;
        return;
      }
      this.setTarget(this.target.position);
      this.setMove(this.target.position);
    }
    if (this.isTiming) {
      return;
    }
    this.isTiming = true;
    setTimeout(() => {
      this.isResting = true;
      this.isTiming = false;
    }, Mathf.RandomRange(10, 12) * 1000);
  }
  makeAttack() {
    if (this.target != null) {
      this.game.npcHitPlayer(this.id, this.target.idGame, this.damage);
      this.game.pushPlayerBack(
        this.target,
        this.target.position.clone().sub(this.position),
        5
      );

      this.isResting = true;
      this.isTiming = true;
      setTimeout(() => {
        this.isTiming = false;
      }, Mathf.RandomRange(5, 6) * 1000);
    }
  }
  findClosestTarget(targetArr) {
    let target = targetArr[0];
    targetArr.forEach((t) => {
      if (
        new Vector(t.bodyCollider.pos.x, t.bodyCollider.pos.y)
        .sub(this.position)
        .sqrMagnitude() <
        new Vector(target.bodyCollider.pos.x, target.bodyCollider.pos.y).sub(
          this.position
        ).sqrMagnitude
      ) {
        target = t;
      }
    });
    return target;
  }
  searchAround() {
    if (this.searchedAround) {
      return;
    }
    this.searchedAround = true;
    this.playersNearby = this.game.getPlayersFromViewInRange(
      this.position,
      this.lookRange
    );
    if (this.playersNearby.length != 0) {
      let temp = this.findClosestTarget(this.playersNearby);
      this.target = this.game.getPlayerInfo(temp.id);
    } else {
      this.setTarget(this.getRandomPosition());
      this.setMove(this.targetPosition);
    }
    setTimeout(() => {
      this.searchedAround = false;
    }, Mathf.RandomRange(5, 8) * 1000);
  }
  active() {
    if (this.position.clone().sub(this.targetPosition).sqrMagnitude() <= 1) {
      this.setTarget(this.getRandomPosition());
    }
    if (this.isTiming) {
      return;
    }
    this.isTiming = true;
    setTimeout(() => {
      this.isResting = true;
      this.isTiming = false;
    }, Mathf.RandomRange(5, 9) * 1000);
  }

  onHit(from) {
    if (!this.isHostitle) {
      this.setTarget(this.getRandomPosition());
      this.setMove(this.targetPosition);
      this.isResting = false;
      if (!this.isRunaway) {
        this.isRunaway = true;
        this.moveSpeed = this.normalMoveSpeed * 2;
        setTimeout(() => {
          this.isRunaway = false;
        }, Mathf.RandomRange(5, 7) * 1000);
      }
    } else {
      this.target = from;
      this.isResting = false;
      this.isTiming = false;
    }
  }
  updatePosition(deltaTime) {
    if (this.isTrapped) {
      return;
    }
    if (this.lastMoveDirect == null) {
      return;
    }
    this.moveDirect.x = Mathf.lerp(
      this.moveDirect.x,
      this.lastMoveDirect.x,
      this.rotateSpeed * deltaTime
    );
    this.moveDirect.y = Mathf.lerp(
      this.moveDirect.y,
      this.lastMoveDirect.y,
      this.rotateSpeed * deltaTime
    );

    this.position.add(
      this.moveDirect.unitVector.scale(
        this.moveSpeed * this.environmentSpeedModifier * deltaTime
      )
    );

    this.lookAngle = Math.atan2(this.moveDirect.y, this.moveDirect.x);

    this.bodyCollider.pos.x = this.position.x;
    this.bodyCollider.pos.y = this.position.y;

    this.checkCollider();
  }
  moveNpc(direct, deltaTime) {
    if (this.isTrapped) {
      return;
    }
    this.position.add(
      direct.unitVector.scale(
        this.moveSpeed * this.environmentSpeedModifier * deltaTime
      )
    );
    this.bodyCollider.pos.x = this.position.x;
    this.bodyCollider.pos.y = this.position.y;
    this.checkCollider();
  }
  checkCollider() {
    this.checkColliderWithResources();
    this.checkColliderWithStrucures();
  }
  checkColliderWithResources() {
    this.resourcesView = this.game.getResourceFromView(this.position);
    for (const r of this.resourcesView) {
      this.game.testCollisionCircle2Circle(this, r, (res, obj) =>
        this.onCollisionWithResource(res, obj)
      );
    }
  }
  checkColliderWithStrucures() {
    this.structureView = this.game.getStructureFromView(this.position);
    // console.log("structure: ", this.structureView)
    for (const r of this.structureView) {
      this.game.testCollisionCircle2Circle(this, r, (res, obj) =>
        this.onCollisionWithStructure(res, obj, r)
      );
    }
  }
  onCollisionWithStructure(response, object, objInfo) {
    if (
      ["Wall", "Spike", "Windmill", "Turret", "MineStone", "Sapling"].includes(
        objInfo.type
      )
    ) {
      // if (objectInfo.type == "Wall" || objectInfo.type == "Spike" || objectInfo.type == "Windmill" || objectInfo.type == "Turret" || ) {
      let overlapPos = response.overlapV;
      this.position.x -= overlapPos.x;
      this.position.y -= overlapPos.y;
    }
    this.game.npcHitStructures(this.id, objInfo.id);
  }
  onCollisionWithResource(response, object) {
    let overlapPos = response.overlapV;
    this.position.x -= overlapPos.x;
    this.position.y -= overlapPos.y;
  }
  setTarget(target) {
    this.targetPosition = target;
  }
  setMove(target) {
    if (target == null) {
      this.lastMoveDirect = null;
      return;
    }
    this.lastMoveDirect = target.clone().sub(this.position);
    // console.log("go to target: ", target, ", this position: ", this.position)
  }
  getRandomPosition() {
    return this.game.getRandomPosition();
  }
  getHpPercent() {
    return this.healthPoint / this.maxHp;
  }
}
module.exports = NPC;