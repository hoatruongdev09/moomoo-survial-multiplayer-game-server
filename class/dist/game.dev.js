"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var servercode = require("../transmitcode").ServerCode;

var gamecode = require("../transmitcode").GameCode;

var Map = require("./map");

var Resource = require("./resource").Resource;

var ResourceType = require("./resource").ResourceType;

var PhysicEngine = require("./physicEngine");

var Vector = require("../GameUtils/vector");

var WeaponInfo = require("./weapon/weaponInfo");

var ItemInfo = require("./Items/itemInfo");

var AccessoryInfo = require("./Shop/Accessories");

var HatInfo = require("./Shop/Hats");

var ClanManager = require("./ClanManager/clanManager");

var NPC = require("./NPCs/newNPC");

var Game =
/*#__PURE__*/
function () {
  function Game(id, server, gameConfig, name) {
    _classCallCheck(this, Game);

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
    this.map = new Map(this.gameConfig.mapsize, {
      x: 2,
      y: 2
    }, this.gameConfig.snowSize, this.gameConfig.riverSize);
    this.physic = new PhysicEngine();
    this.init();
  }

  _createClass(Game, [{
    key: "update",
    value: function update(deltaTime) {
      this.new_updatePlayer(deltaTime);
      this.new_updateNPC(deltaTime);
      this.updatePositionProjectile(deltaTime);
      this.clanManager.update(deltaTime);
      this.lateUpdate(deltaTime);
    }
  }, {
    key: "lateUpdate",
    value: function lateUpdate(deltaTime) {
      this.broadcastPlayerPosition();
      this.broadcastStructurePosition();
      this.broadcastNpcPosition();
      this.syncMapData();
    }
    /* #region  CLAN MANAGER */

  }, {
    key: "createClan",
    value: function createClan(name, player) {
      this.clanManager.createClan(name, player);
    }
  }, {
    key: "removeClan",
    value: function removeClan(clanId) {
      this.clanManager.removeClan(clanId);
    }
  }, {
    key: "kickMember",
    value: function kickMember(memberId, clanId) {
      this.clanManager.kickMember(memberId, clanId);
    }
  }, {
    key: "checkIsMasterOfClan",
    value: function checkIsMasterOfClan(memberId, clanId) {
      return this.clanManager.checkIsMasterOfClan(memberId, clanId);
    }
    /* #endregion */

    /* #region  INITIALIZE  */

  }, {
    key: "init",
    value: function init() {
      this.players = new Array(this.gameConfig.maxPlayer);
      this.npcs = new Array(this.gameConfig.npcCount());
      this.initializeResources();
      this.initializeNPC();
    }
  }, {
    key: "initializeResources",
    value: function initializeResources() {
      this.resources = new Array(this.gameConfig.resourceCount());
      var index = 0;

      for (var i = 0; i < this.gameConfig.woodCount; i++, index++) {
        this.resources[index] = new Resource(index, ResourceType.Wood, this.map.randomPosition(), -1, this.gameConfig.defaultResourceRadius);
      }

      for (var _i = 0; _i < this.gameConfig.foodCount; _i++, index++) {
        this.resources[index] = new Resource(index, ResourceType.Food, this.map.randomPosition(), -1, this.gameConfig.defaultResourceRadius);
      }

      for (var _i2 = 0; _i2 < this.gameConfig.rockCount; _i2++, index++) {
        this.resources[index] = new Resource(index, ResourceType.Stone, this.map.randomPosition(), -1, this.gameConfig.defaultResourceRadius);
      }

      for (var _i3 = 0; _i3 < this.gameConfig.goldCount; _i3++, index++) {
        this.resources[index] = new Resource(index, ResourceType.Gold, this.map.randomPosition(), -1, this.gameConfig.defaultResourceRadius);
      }
    }
  }, {
    key: "getNpcEvent",
    value: function getNpcEvent() {
      return {
        onDie: this.onNpcDie,
        onHit: this.onNpcHit
      };
    }
  }, {
    key: "initializeNPC",
    value: function initializeNPC() {
      var j = 0;

      for (var i = 0; i < this.gameConfig.npcDuckCount; i++, j++) {
        // DUCK
        this.npcs[j] = new NPC(j, 4, false, 250, this.getRandomPosition(), this, 2, "duck");
      }

      for (var _i4 = 0; _i4 < this.gameConfig.npcChickenCount; _i4++, j++) {
        // CHICKEN
        this.npcs[j] = new NPC(j, 3, false, 250, this.getRandomPosition(), this, 2, "chicken");
      }

      for (var _i5 = 0; _i5 < this.gameConfig.npcCowCount; _i5++, j++) {
        // COW
        this.npcs[j] = new NPC(j, 0, false, 500, this.getRandomPosition(), this, 2.4, "cow");
      }

      for (var _i6 = 0; _i6 < this.gameConfig.npcBullCount; _i6++, j++) {
        // BULL
        this.npcs[j] = new NPC(j, 5, false, 700, this.getRandomPosition(), this, 2.4, "bull");
      }

      for (var _i7 = 0; _i7 < this.gameConfig.npcSheepCount; _i7++, j++) {
        // SHEEP
        this.npcs[j] = new NPC(j, 2, false, 600, this.getRandomPosition(), this, 2.4, "sheep");
      }

      for (var _i8 = 0; _i8 < this.gameConfig.npcPigCount; _i8++, j++) {
        // PIG
        this.npcs[j] = new NPC(j, 1, false, 550, this.getRandomPosition(), this, 2.4, "pig");
      }

      for (var _i9 = 0; _i9 < this.gameConfig.npcBullyCount; _i9++, j++) {
        // BULLY
        this.npcs[j] = new NPC(j, 6, true, 800, this.getRandomPosition(), this, 2.4, "bully");
      }

      for (var _i10 = 0; _i10 < this.gameConfig.npcWolfCount; _i10++, j++) {
        // WOLF
        this.npcs[j] = new NPC(j, 7, true, 700, this.getRandomPosition(), this, 2.4, "wolf");
      }
    }
    /* #endregion */

    /* #region  PLAYER MANAGER */

  }, {
    key: "getPlayerScore",
    value: function getPlayerScore() {
      var data = [];
      this.players.forEach(function (p) {
        if (p != null && p.isJoinedGame) {
          data.push({
            id: p.idGame,
            name: p.name,
            skinId: p.skinId,
            score: p.scores
          });
        }
      });
      return data;
    }
  }, {
    key: "isFull",
    value: function isFull() {
      return this.currentPlayerCount >= this.gameConfig.maxPlayer;
    }
  }, {
    key: "new_canJoin",
    value: function new_canJoin() {
      if (this.currentPlayerCount >= this.gameConfig.maxPlayer) {
        return {
          result: false,
          reason: "Game is full"
        };
      }

      return {
        result: true,
        reason: ""
      };
    }
  }, {
    key: "canJoin",
    value: function canJoin(data) {
      if (data.name.length >= this.gameConfig.maxNameLength) {
        return {
          result: false,
          reason: "Name is over 15 characters"
        };
      }

      if (this.currentPlayerCount >= this.gameConfig.maxPlayer) {
        return {
          result: false,
          reason: "Game is full"
        };
      }

      return {
        result: true,
        reason: ""
      };
    }
  }, {
    key: "new_addPlayer",
    value: function new_addPlayer(player) {
      var slot = this.findEmptySlot();

      if (slot != null) {
        this.players[slot] = player;
        this.currentPlayerCount++;
        player.receiveGameData({
          game: this,
          idGame: slot,
          gameData: this.getCurrentGameData()
        });
      } else {
        console.log("game slot is null");
      }
    }
  }, {
    key: "addPlayer",
    value: function addPlayer(player, data) {
      var slot = this.findEmptySlot();

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
  }, {
    key: "new_playerJoin",
    value: function new_playerJoin(player) {
      var spawnPosition = this.map.randomPosition();

      if (player.spawnPad != null) {
        spawnPosition = player.spawnPad.position;
        this.removePlayerSpawnPad(player.idGame);
        player.structures.Spawnpad = 0;
        player.spawnPad = null;
      }

      var spawnRotation = this.map.rangdomAngle();
      player.clientScreenSize.width *= this.gameConfig.viewScale;
      player.clientScreenSize.height *= this.gameConfig.viewScale;
      player.enterGame({
        moveSpeed: this.gameConfig.playerSpeed,
        position: new Vector(spawnPosition.x, spawnPosition.y),
        lookDirect: spawnRotation,
        bodyRadius: this.gameConfig.playColliderRadius,
        items: this.getStarterPack(),
        shop: {
          hats: this.getStarterHats(),
          accessories: this.getStarterAccessories()
        }
      });
      this.onNewPlayerJoin(player);
    }
  }, {
    key: "removePlayer",
    value: function removePlayer(player) {
      if (player.isJoinedGame) {
        this.onPlayerQuit(player.idGame);
      }

      this.removePlayerSpawnPad(player.idGame);
      this.removePlayerStructures(player.idGame);
      this.players[player.idGame] = null;
      this.currentPlayerCount--;
    }
  }, {
    key: "findEmptySlot",
    value: function findEmptySlot() {
      for (var slot = 0; slot < this.players.length; slot++) {
        if (this.players[slot] == null) {
          return slot;
        }
      }

      return null;
    }
  }, {
    key: "getOtherPlayersInPlayerView",
    value: function getOtherPlayersInPlayerView(player) {
      var playerInView = this.getPlayerFromScreenView(player.position, player.clientScreenSize);
      return playerInView;
    }
  }, {
    key: "getNpcInPlayerView",
    value: function getNpcInPlayerView(player) {
      var npcInInView = this.getNpcFromScreenView(player.position, player.clientScreenSize);
      return npcInInView;
    }
  }, {
    key: "new_updatePlayer",
    value: function new_updatePlayer(deltaTime) {
      var _this = this;

      this.players.forEach(function (p) {
        if (p != null && p.isJoinedGame) {
          p.update(deltaTime);

          _this.new_syncSinglePlayerPosition(p, deltaTime);
        }
      });
    }
  }, {
    key: "syncMapData",
    value: function syncMapData() {
      this.players.forEach(function (p) {
        if (p != null && p.isJoinedGame) {
          var miniMapInfo = p.getMiniMapPosition();
          p.send(gamecode.miniMapData, {
            data: miniMapInfo
          });
        }
      });
    }
  }, {
    key: "broadcastPlayerPosition",
    value: function broadcastPlayerPosition() {
      var _this2 = this;

      this.players.forEach(function (p) {
        if (p != null && p.isJoinedGame) {
          var other = _this2.getOtherPlayersInPlayerView(p);

          var data = other.map(function (player) {
            return {
              id: player.idGame,
              pos: {
                x: player.position.x,
                y: player.position.y
              },
              rot: player.lookDirect,
              visible: player.isVisible
            };
          });
          p.send(gamecode.syncTransform, {
            data: data
          });
        }
      });
    }
  }, {
    key: "old_broadcastPlayerPosition",
    value: function old_broadcastPlayerPosition() {
      var _this3 = this;

      this.players.forEach(function (p) {
        if (p != null && p.isJoinedGame) {
          var other = _this3.getOtherPlayersInPlayerView(p);

          var positionData = [];
          var lookData = [];
          other.forEach(function (player) {
            if (player.lastMovement == null && player.isVisible) {} else {
              positionData.push({
                id: player.idGame,
                pos: {
                  x: player.position.x,
                  y: player.position.y
                }
              });
              lookData.push({
                id: player.idGame,
                angle: player.lookDirect
              });
            }
          });
          p.send(gamecode.syncTransform, {
            pos: positionData,
            rot: lookData
          });
        }
      });
    }
  }, {
    key: "broadcastStructurePosition",
    value: function broadcastStructurePosition() {
      var _this4 = this;

      this.players.forEach(function (p) {
        if (p != null && p.isJoinedGame) {
          var otherStructure = _this4.getStructureInScreenView(p.position, p.clientScreenSize);

          var strData = otherStructure.map(function (str) {
            return {
              id: str.id,
              pos: {
                x: str.position.x,
                y: str.position.y
              },
              rot: str.rotation
            };
          });
          p.send(gamecode.syncStructure, {
            structures: strData
          });
        }
      });
    }
  }, {
    key: "broadcastNpcPosition",
    value: function broadcastNpcPosition() {
      var _this5 = this;

      this.players.forEach(function (p) {
        if (p != null && p.isJoinedGame) {
          var otherNPC = _this5.getNpcInPlayerView(p);

          var positionData = otherNPC.map(function (npc) {
            return {
              id: npc.id,
              pos: {
                x: npc.position.x,
                y: npc.position.y
              },
              rot: npc.lookAngle
            };
          });
          p.send(gamecode.syncNpcTransform, {
            pos: positionData
          });
        }
      });
    }
  }, {
    key: "updatePlayers",
    value: function updatePlayers(deltaTime) {
      var _this6 = this;

      var positionData = [];
      var lookData = [];
      var temp = null;
      this.players.forEach(function (p) {
        if (p != null && p.isJoinedGame) {
          p.update(deltaTime);
          temp = _this6.syncSinglePlayerPosition(p, deltaTime);

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
          rot: lookData
        });
      }
    }
  }, {
    key: "new_updateNPC",
    value: function new_updateNPC(deltaTime) {
      var _this7 = this;

      this.npcs.forEach(function (n) {
        if (n != null && n.isJoined) {
          n.update(deltaTime);

          _this7.new_syncSingleNpcPosition(n, deltaTime);
        }
      });
    }
  }, {
    key: "new_syncSingleNpcPosition",
    value: function new_syncSingleNpcPosition(npc, deltaTime) {
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
  }, {
    key: "new_syncSinglePlayerPosition",
    value: function new_syncSinglePlayerPosition(player, deltaTime) {
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
  }, {
    key: "getNpcFromView",
    value: function getNpcFromView(center, screenSize) {
      var viewObjects = this.getNpcFromScreenView(center, screenSize);
      return viewObjects.map(function (n) {
        return {
          id: n.id,
          bodyCollider: n.bodyCollider
        };
      });
    }
  }, {
    key: "getNpcFromView",
    value: function getNpcFromView(position) {
      var _this8 = this;

      var viewObjects = [];
      var temp = new Vector(0, 0);
      this.npcs.forEach(function (n) {
        if (n != null && n.isJoined) {
          temp.x = position.x - n.position.x;
          temp.y = position.y - n.position.y;

          if (temp.sqrMagnitude() < Math.pow(_this8.gameConfig.viewPlayerRadius, 2)) {
            viewObjects.push({
              id: n.id,
              bodyCollider: n.bodyCollider
            });
          }
        }
      });
      return viewObjects;
    }
  }, {
    key: "getNpcFromScreenView",
    value: function getNpcFromScreenView(position, screenView) {
      var _this9 = this;

      var viewObjects = this.npcs.filter(function (n) {
        if (n != null && n.isJoined && _this9.checkIfPositionIsInScreenView(n.position, position, screenView)) {
          return n;
        }
      });
      return viewObjects;
    }
  }, {
    key: "checkIfPositionIsInScreenView",
    value: function checkIfPositionIsInScreenView(position, screenPosition, screenView) {
      var deltaX = Math.abs(position.x - screenPosition.x);
      var deltaY = Math.abs(position.y - screenPosition.y);
      return deltaX < screenView.width && deltaY < screenView.height;
    }
  }, {
    key: "getPlayerFromScreenView",
    value: function getPlayerFromScreenView(position, screenView) {
      var _this10 = this;

      var viewObjects = this.players.filter(function (p) {
        if (p != null && p.isJoinedGame && _this10.checkIfPositionIsInScreenView(p.position, position, screenView)) {
          return p;
        }
      });
      return viewObjects;
    }
  }, {
    key: "getPlayersFromView",
    value: function getPlayersFromView(center, screenSize) {
      var viewObject = this.getPlayerFromScreenView(center, screenSize);
      return viewObject.map(function (p) {
        return {
          id: p.idGame,
          bodyCollider: p.bodyCollider
        };
      });
    }
  }, {
    key: "getPlayersFromView",
    value: function getPlayersFromView(position) {
      var _this11 = this;

      var viewObjects = [];
      var temp = new Vector(0, 0);
      this.players.forEach(function (p) {
        if (p != null && p.isJoinedGame) {
          temp.x = position.x - p.position.x;
          temp.y = position.y - p.position.y;

          if (temp.sqrMagnitude() < Math.pow(_this11.gameConfig.viewPlayerRadius, 2)) {
            viewObjects.push({
              id: p.idGame,
              bodyCollider: p.bodyCollider
            });
          }
        }
      });
      return viewObjects;
    }
  }, {
    key: "getPlayersFromViewInRange",
    value: function getPlayersFromViewInRange(position, range) {
      var viewObjects = [];
      var temp = new Vector(0, 0);
      this.players.forEach(function (p) {
        if (p != null && p.isJoinedGame) {
          temp.x = position.x - p.position.x;
          temp.y = position.y - p.position.y;

          if (temp.sqrMagnitude() < Math.pow(range, 2)) {
            viewObjects.push({
              id: p.idGame,
              bodyCollider: p.bodyCollider
            });
          }
        }
      });
      return viewObjects;
    }
  }, {
    key: "getPlayerInfo",
    value: function getPlayerInfo(id) {
      return this.players[id];
    }
    /* #endregion */

    /* #region  GAME DATA */

  }, {
    key: "getCurrentGameData",
    value: function getCurrentGameData() {
      var gameData = {
        maxPlayer: this.gameConfig.maxPlayer,
        maxNpcCount: this.gameConfig.npcCount(),
        mapSize: {
          x: this.gameConfig.mapsize.x,
          y: this.gameConfig.mapsize.y
        },
        snowSize: this.gameConfig.snowSize,
        riverSize: this.gameConfig.riverSize,
        resource: this.getResourceInfo(),
        players: this.getPlayersInfo(),
        structures: this.getStructuresInfo(),
        npc: this.getNpcInfo(),
        clans: this.clanManager.getClanData(),
        clansMember: this.clanManager.getClansMemberData(),
        shop: this.getAllShopItem()
      };
      return gameData;
    }
  }, {
    key: "getPlayersInfo",
    value: function getPlayersInfo() {
      var playingPlayer = this.players.filter(function (p) {
        if (p != null && p.isJoinedGame) {
          return p;
        }
      });
      var data = playingPlayer.map(function (p) {
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
            y: p.position.y
          }
        };
      });
      return data;
    }
  }, {
    key: "getNpcInfo",
    value: function getNpcInfo() {
      var joinedNpc = this.npcs.filter(function (n) {
        if (n != null && n.isJoined) {
          return n;
        }
      });
      var data = joinedNpc.map(function (n) {
        return {
          id: n.id,
          skinId: n.skinId,
          hp: n.getHpPercent(),
          pos: {
            x: n.position.x,
            y: n.position.y
          },
          rot: n.lookAngle
        };
      });
      return data;
    }
  }, {
    key: "getStructuresInfo",
    value: function getStructuresInfo() {
      var data = this.structures.map(function (item) {
        return {
          id: item.id,
          itemId: item.itemId,
          pos: {
            x: item.position.x,
            y: item.position.y
          },
          rot: item.rotation
        };
      });
      return data;
    }
  }, {
    key: "getResourceInfo",
    value: function getResourceInfo() {
      // console.log("raw resource info: ", this.resources)
      var data = this.resources.map(function (r) {
        return {
          id: r.id,
          type: r.idType,
          pos: r.position
        };
      }); // console.log("maped resource info: ", data)

      return data;
    }
    /* #endregion */

    /* #region  ITEM & SHOP */

  }, {
    key: "getStarterHats",
    value: function getStarterHats() {
      return HatInfo.getHatsByPrice(0);
    }
  }, {
    key: "getStarterAccessories",
    value: function getStarterAccessories() {
      return AccessoryInfo.getAccessoriesByPrice(0);
    }
  }, {
    key: "getAllShopItem",
    value: function getAllShopItem() {
      return {
        hats: HatInfo.getAllInfo(),
        accessories: AccessoryInfo.getAllInfo()
      };
    }
  }, {
    key: "getHatById",
    value: function getHatById(id) {
      return HatInfo.getHatById(id);
    }
  }, {
    key: "getAccessoryById",
    value: function getAccessoryById(id) {
      return AccessoryInfo.getAccessoryById(id);
    }
    /* #endregion */

    /* #region  GAME WEAPON AND STRUCTURE */

  }, {
    key: "getStarterPack",
    value: function getStarterPack() {
      var mainWeapon = WeaponInfo.getInfoByAge(1); //WeaponInfo.getInfoByStringId("w0")

      var items = ItemInfo.getInfoByAge(1);
      return {
        weapons: mainWeapon,
        items: items
      };
    }
  }, {
    key: "getItemsByLevel",
    value: function getItemsByLevel(level) {
      var weapons = WeaponInfo.getInfoByAge(level);
      var items = ItemInfo.getInfoByAge(level);
      return {
        weapons: weapons,
        items: items
      };
    }
  }, {
    key: "getWeaponByCode",
    value: function getWeaponByCode(code) {
      return WeaponInfo.getInfoByStringId(code);
    }
  }, {
    key: "getItemByCode",
    value: function getItemByCode(code) {
      return ItemInfo.getInfoByStringId(code);
    }
    /* #endregion */

    /* #region  GAME EVIROMENT VIEW */

  }, {
    key: "getResourceInScreenView",
    value: function getResourceInScreenView(center, screenSize) {
      var _this12 = this;

      var viewObjects = this.resources.filter(function (r) {
        if (_this12.checkIfPositionIsInScreenView(r.position, center, screenSize)) {
          return r;
        }
      });
      return viewObjects;
    }
  }, {
    key: "getResourceFromView",
    value: function getResourceFromView(center, screenSize) {
      var _this13 = this;

      var viewObjects = this.resources.filter(function (r) {
        if (_this13.checkIfPositionIsInScreenView(center, screenSize)) {
          return r;
        }
      });
      return viewObjects.map(function (r) {
        return {
          id: r.id,
          bodyCollider: r.bodyCollider
        };
      });
    }
  }, {
    key: "getResourceFromView",
    value: function getResourceFromView(position) {
      var _this14 = this;

      var viewObjects = [];
      var temp = new Vector(0, 0);
      this.resources.forEach(function (r) {
        temp.x = position.x - r.position.x;
        temp.y = position.y - r.position.y;

        if (temp.sqrMagnitude() < Math.pow(_this14.gameConfig.viewResourceRadius, 2)) {
          viewObjects.push({
            id: r.id,
            bodyCollider: r.bodyCollider
          });
        }
      });
      return viewObjects;
    }
  }, {
    key: "getStructureInScreenView",
    value: function getStructureInScreenView(center, screenSize) {
      var _this15 = this;

      var viewObjects = this.structures.filter(function (s) {
        if (_this15.checkIfPositionIsInScreenView(s.position, center, screenSize)) return s;
      });
      return viewObjects;
    }
  }, {
    key: "getStructureFromView",
    value: function getStructureFromView(center, screenSize) {
      var viewObjects = this.getStructureInScreenView(center, screenSize);
      return viewObjects.map(function (s) {
        return {
          id: s.id,
          type: s.toString(),
          bodyCollider: s.bodyCollider
        };
      });
    }
  }, {
    key: "getStructureFromView",
    value: function getStructureFromView(position) {
      var _this16 = this;

      var viewObjects = [];
      var temp = new Vector(0, 0);
      this.structures.forEach(function (s) {
        temp.x = position.x - s.position.x;
        temp.y = position.y - s.position.y;

        if (temp.sqrMagnitude() < Math.pow(_this16.gameConfig.viewResourceRadius, 2)) {
          viewObjects.push({
            id: s.id,
            type: s.toString(),
            bodyCollider: s.bodyCollider
          });
        }
      });
      return viewObjects;
    }
    /* #endregion */

    /* #region  COLLIDER TESTER */

  }, {
    key: "testCollisionCircle2Circle",
    value: function testCollisionCircle2Circle(object1, object2, response) {
      return this.physic.testCircle2Circle(object1.bodyCollider, object2.bodyCollider, response);
    }
  }, {
    key: "testCollisionPolygon2Circle",
    value: function testCollisionPolygon2Circle(poliObj, circleObj, response) {
      return this.physic.testPolygon2Circle(poliObj.bodyCollider, circleObj.bodyCollider, response);
    }
    /* #endregion */

    /* #region   COLLISION CHECK*/

  }, {
    key: "bulletHitNpc",
    value: function bulletHitNpc(idFrom, idTarget, damage) {
      this.playerHitNpc(idFrom, idTarget, damage);
      return true;
    }
  }, {
    key: "bulletHitPlayer",
    value: function bulletHitPlayer(idFrom, idTarget, damage) {
      var _this17 = this;

      if (this.checkBothPlayerAreInClan(this.players[idFrom], this.players[idTarget])) {
        return false;
      }

      this.players[idTarget].takeDamage(damage, function (id) {
        return _this17.playerDieCallback(idFrom, id);
      }, function (damageReflect, forceReflect) {
        return _this17.playerReflectAttack(idTarget, idFrom, damageReflect, forceReflect);
      });
      this.players[idFrom].lifeStealing(damage);
      this.players[idFrom].selfTakeDamage(damage, function (id) {
        return _this17.playerDieCallback(idFrom, id);
      }, function (damageReflect, forceReflect) {});
      return true;
    }
  }, {
    key: "checkBothPlayerAreInClan",
    value: function checkBothPlayerAreInClan(player1, player2) {
      if (player1.idGame == player2.idGame) {
        return true;
      }

      if (player1 == null || player2 == null) {
        return false;
      }

      if (!player1.isJoinedGame || !player2.isJoinedGame) {
        return false;
      }

      if (player1.clanId == null || player2.clanId == null) {
        return false;
      }

      return player1.clanId == player2.clanId;
    }
  }, {
    key: "playerHitPlayer",
    value: function playerHitPlayer(idFrom, idTarget, damage) {
      var _this18 = this;

      if (this.checkBothPlayerAreInClan(this.players[idFrom], this.players[idTarget])) {
        return;
      }

      this.players[idTarget].takeDamage(damage, function (id) {
        return _this18.playerDieCallback(idFrom, id);
      }, function (damageReflect, forceReflect) {
        return _this18.playerReflectAttack(idTarget, idFrom, damageReflect, forceReflect);
      });
      this.players[idFrom].lifeStealing(damage);
      this.players[idFrom].selfTakeDamage(damage, function (id) {
        return _this18.playerDieCallback(idFrom, id);
      }, function (damageReflect, forceReflect) {});
    }
  }, {
    key: "playerStealResourcePlayer",
    value: function playerStealResourcePlayer(idFrom, idTarget, resource) {
      var playerFrom = this.getPlayerInfo(idFrom);
      var playerTarget = this.getPlayerInfo(idTarget);
      var stoleResource = playerTarget.loseResource(resource);
      playerFrom.takeResource(stoleResource);
    }
  }, {
    key: "playerDieCallback",
    value: function playerDieCallback(idFrom, idTarget) {
      this.bonusKillForPlayer(idFrom, idTarget); // onPlayerDie(idTarget)
    }
  }, {
    key: "playerDieDueToNpcCallback",
    value: function playerDieDueToNpcCallback(idNpc, idPlayer) {}
  }, {
    key: "playerReflectAttack",
    value: function playerReflectAttack(idFrom, idTarget, damageReflect, forceReflect) {
      var _this19 = this;

      if (damageReflect != 0) {
        this.players[idTarget].takeDamage(damageReflect, function (id) {
          return _this19.playerDieCallback(idFrom, id);
        }, function (damageReflect, forceReflect) {});
      }

      if (forceReflect != 0) {
        var targetPosition = this.players[idTarget].position.clone();
        var originPosition = this.players[idFrom].position.clone();
        this.pushPlayerBack(this.players[idTarget], targetPosition.sub(originPosition), forceReflect);
      }
    }
  }, {
    key: "playerReflectAttackToNpc",
    value: function playerReflectAttackToNpc(idFrom, idTarget, damageReflect, forceReflect) {
      this.npcs[idTarget].onBeingHit(this.players[idFrom], damageReflect);
      this.pushNpcBack(this.npcs[idTarget], this.npcs[idTarget].position.clone().sub(this.players[idFrom].position.clone()), forceReflect);
    }
  }, {
    key: "bonusKillForPlayer",
    value: function bonusKillForPlayer(idPlayer, idTarget) {
      console.log("player: ".concat(idPlayer, ": "), this.players[idPlayer]);
      var bonusModifier = this.players[idPlayer].killBonusGold;
      var bonusGold = 0;

      if (this.players[idPlayer].wearThiefGear) {
        bonusGold = this.players[idTarget].getCurrentGoldAmount() / 2;
      }

      if (this.players[idPlayer] == null || !this.players[idPlayer].isJoinedGame) {
        return;
      }

      this.players[idPlayer].takeBonus({
        kills: 1,
        gold: (250 + bonusGold) * (1 + bonusModifier),
        xp: 100
      });
    }
  }, {
    key: "npcHitPlayer",
    value: function npcHitPlayer(idFrom, idTarget, damage) {
      var _this20 = this;

      if (this.players[idTarget] == null || !this.players[idTarget].isJoinedGame) {
        return;
      }

      this.players[idTarget].takeDamage(damage, function (id) {
        return _this20.playerDieDueToNpcCallback(idFrom, id);
      }, function (damageReflect, forceReflect) {
        return _this20.playerReflectAttackToNpc(idTarget, idFrom, damageReflect, forceReflect);
      });
    }
  }, {
    key: "respawnNpc",
    value: function respawnNpc(npc) {
      var _this21 = this;

      setTimeout(function () {
        npc.isJoined = true;
        npc.reset();

        var randomPosition = _this21.getRandomPosition();

        npc.position.x = randomPosition.x;
        npc.position.y = randomPosition.y;

        _this21.onCreateNpc({
          id: npc.id,
          skinId: npc.skinId,
          hp: 1,
          pos: {
            x: npc.position.x,
            y: npc.position.y
          },
          rot: npc.lookAngle
        });
      }, 30 * 1000);
    }
  }, {
    key: "playerHitNpc",
    value: function playerHitNpc(idFrom, idTarget, damage) {
      var _this22 = this;

      this.npcs[idTarget].onBeingHit(this.players[idFrom], damage, function (fromTarget, npc) {
        return _this22.onNpcDie(fromTarget, npc);
      });
      this.players[idFrom].lifeStealing(damage);
      this.players[idFrom].selfTakeDamage(damage, function (id) {
        return _this22.playerDieCallback(idFrom, id);
      }, function (damageReflect, forceReflect) {});
    }
  }, {
    key: "playerStructureHitNpc",
    value: function playerStructureHitNpc(idFrom, idTarget, damage) {
      var _this23 = this;

      this.npcs[idTarget].onBeingHit(this.players[idFrom], damage, function (fromTarget, npc) {
        return _this23.onNpcDie(fromTarget, npc);
      });
    }
  }, {
    key: "syncNpcHP",
    value: function syncNpcHP(data) {
      this.broadcast(gamecode.syncNpcHP, {
        data: data
      });
    }
  }, {
    key: "playerStructureHitPlayer",
    value: function playerStructureHitPlayer(idFrom, idTarget, damage) {
      var _this24 = this;

      if (this.checkBothPlayerAreInClan(this.players[idFrom], this.players[idTarget])) {
        return;
      }

      console.log("player structure take damage ".concat(idFrom, " ").concat(idTarget));
      this.players[idTarget].takeDamage(damage, function (id) {
        return _this24.playerDieCallback(idFrom, id);
      }, function (damageReflect, forceReflect) {});
    }
  }, {
    key: "syncPlayerHP",
    value: function syncPlayerHP(data) {
      this.broadcast(gamecode.playerHit, {
        data: data
      });
    }
  }, {
    key: "npcHitStructures",
    value: function npcHitStructures(id, idStructure) {
      var structure = this.findStructureWithId(idStructure);

      if (structure == null) {
        return;
      }

      if (structure.toString() == "PitTrap") {
        structure.trapNpc(this.npcs[id]);
        return;
      }

      if (structure.toString() == "Spike") {
        this.playerStructureHitNpc(structure.userId, id, structure.damage);
        this.pushNpcBack(this.npcs[id], this.npcs[id].position.clone().sub(structure.position), 5);
      }
    }
  }, {
    key: "playerHitStructures",
    value: function playerHitStructures(idFrom, idStructure) {
      var _this25 = this;

      var structure = this.findStructureWithId(idStructure);

      if (structure == null) {
        return;
      }

      structure.interact(this.players[idFrom], function (action) {});

      if (this.checkBothPlayerAreInClan(this.players[idFrom], this.players[structure.userId])) {
        return;
      }

      if (structure.toString() == "Spike") {
        structure.interact(this.players[idFrom], function (action) {
          if (action) {
            _this25.playerStructureHitPlayer(structure.userId, idFrom, structure.damage);

            _this25.pushPlayerBack(_this25.players[idFrom], _this25.players[idFrom].position.clone().sub(structure.position), 5);
          }
        });
        return;
      }

      if (structure.toString() == "PitTrap") {
        structure.interact(this.players[idFrom], function (action) {});
        return;
      }
    }
  }, {
    key: "playerAttackStructure",
    value: function playerAttackStructure(idPlayer, idStructure, damage, gatherRate, goldGatherRate) {
      var _this26 = this;

      var structure = this.findStructureWithId(idStructure);

      if (structure == null) {
        return;
      }

      structure.hitInteract(this.players[idPlayer], function (idType) {
        var key = _this26.getKeyByValue(ResourceType, idType);

        _this26.players[idPlayer].receiveResource(gatherRate, key);

        _this26.players[idPlayer].addXP(goldGatherRate);
      });

      if (this.checkBothPlayerAreInClan(this.players[idPlayer], this.players[structure.userId])) {
        return;
      }

      structure.takeDamage(damage, function () {
        _this26.removeStructure(structure.id);
      });
    }
  }, {
    key: "playerAttackResource",
    value: function playerAttackResource(player, idResource, weapon) {
      var key = this.getKeyByValue(ResourceType, this.resources[idResource].idType);

      if (key == "Gold") {
        this.addGold(player, weapon.info.goldGatherRate);
      } else {
        player.receiveResource(weapon.info.gatherRate, key);
      }

      player.addXP(weapon.info.goldGatherRate);
    }
  }, {
    key: "addGold",
    value: function addGold(player, value) {
      player.takeGold(value);
    }
    /* #endregion */

    /* #region  STRUCTURE MANAGER */

  }, {
    key: "findStructureWithId",
    value: function findStructureWithId(id) {
      var structure = null;
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this.structures[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var s = _step.value;

          if (s.id == id) {
            structure = s;
            break;
          }
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator["return"] != null) {
            _iterator["return"]();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      return structure;
    }
  }, {
    key: "generateStructureId",
    value: function generateStructureId() {
      return this.structuresCount++;
    }
  }, {
    key: "checkOverlapStructure",
    value: function checkOverlapStructure(playerId, structure) {
      var isOverlapWithStructure = this.checkStructureOverlapStructure(playerId, structure);
      var isOverlapWithResource = this.checkStructureOverlapResource(playerId, structure);
      var isOverlapWithNpc = this.checkStructureOverlapNpc(playerId, structure);
      return isOverlapWithStructure && isOverlapWithResource && isOverlapWithNpc;
    }
  }, {
    key: "checkStructureOverlapStructure",
    value: function checkStructureOverlapStructure(playerId, structure) {
      var structureInView = this.getStructureFromView(structure.position);

      for (var i = 0; i < structureInView.length; i++) {
        if (this.testCollisionCircle2Circle(structure, structureInView[i], function (res, obj) {})) {
          return false;
        }

        if (structureInView[i].toString() == "Blocker" && structureInView[i].userId != playerId) {
          var distance = structureInView[i].position.clone().sub(structure.position).sqrMagnitude();

          if (distance < Math.pow(structureInView[i].range, 2)) {
            return false;
          }
        }
      }

      return true;
    }
  }, {
    key: "checkStructureOverlapResource",
    value: function checkStructureOverlapResource(playerId, structure) {
      var resourceInView = this.getResourceFromView(structure.position);

      for (var i = 0; i < resourceInView.length; i++) {
        if (this.testCollisionCircle2Circle(structure, resourceInView[i], function (res, obj) {})) {
          return false;
        }
      }

      return true;
    }
  }, {
    key: "checkStructureOverlapNpc",
    value: function checkStructureOverlapNpc(playerId, structure) {
      var npcInView = this.getNpcInPlayerView(this.players[playerId]);

      for (var i = 0; i < npcInView.length; i++) {
        if (npcInView[i].isJoined) {
          if (this.testCollisionCircle2Circle(structure, npcInView[i], function (res, obj) {})) {
            return false;
          }
        }
      }

      return true;
    }
  }, {
    key: "addStructure",
    value: function addStructure(user, item) {
      this.structures.push(item);
      user.structures[item.toString()] += 1;
      this.onCreateStructure({
        id: item.id,
        fromId: user.idGame,
        itemId: item.itemId,
        pos: {
          x: item.position.x,
          y: item.position.y
        },
        rot: item.rotation
      });
    }
  }, {
    key: "removeStructure",
    value: function removeStructure(id) {
      for (var i = 0; i < this.structures.length; i++) {
        if (this.structures[i].id == id) {
          this.structures[i].destroy();
          this.structures.splice(i, 1);
          return;
        }
      }

      this.onRemoveStructure([id]);
    }
  }, {
    key: "removePlayerStructures",
    value: function removePlayerStructures(idPlayer) {
      var data = [];

      for (var i = 0; i < this.structures.length; i++) {
        if (this.structures[i].userId == idPlayer) {
          if (this.structures[i].toString() != "Spawnpad") {
            data.push(this.structures[i].id);
            this.structures[i].destroy();
            this.structures.splice(i, 1);
            i--;
          }
        }
      }

      this.onRemoveStructure(data);
    }
  }, {
    key: "removePlayerSpawnPad",
    value: function removePlayerSpawnPad(idPlayer) {
      var data = [];

      for (var i = 0; i < this.structures.length; i++) {
        if (this.structures[i].userId == idPlayer) {
          if (this.structures[i].toString() == "Spawnpad") {
            data.push(this.structures[i].id);
            this.structures[i].destroy();
            this.structures.splice(i, 1);
            break;
          }
        }
      }

      this.onRemoveStructure(data);
    }
    /* #endregion */

    /* #region  PROJECTILE */

  }, {
    key: "getProjectileId",
    value: function getProjectileId() {
      return this.projectileCount++;
    }
  }, {
    key: "addProjectTile",
    value: function addProjectTile(item, direct) {
      this.projectile.push(item);
      this.onCreateProjectile({
        id: item.id,
        skinId: item.idSkin,
        pos: {
          x: item.position.x,
          y: item.position.y
        },
        angle: direct
      });
    }
  }, {
    key: "removeProjectile",
    value: function removeProjectile(id) {
      for (var i = 0; i < i < this.projectile.length; i++) {
        if (this.projectile[i].id == id) {
          this.projectile[i].destroy();
          this.projectile.splice(i, 1);
          this.onRemoveProjectile([id]);
          return;
        }
      }
    }
  }, {
    key: "updatePositionProjectile",
    value: function updatePositionProjectile(deltaTime) {
      var _this27 = this;

      var data = [];
      this.projectile.forEach(function (p) {
        if (p.isDestroy) {
          _this27.removeProjectile(p.id);
        } else {
          p.updatePosition(deltaTime);
          data.push({
            id: p.id,
            pos: {
              x: p.position.x,
              y: p.position.y
            }
          });
        }
      });

      if (data.length != 0) {
        this.onSyncProjectilePosition(data);
      }
    }
    /* #endregion */

    /* #region  GAME EVENTS */

  }, {
    key: "onNewPlayerJoin",
    value: function onNewPlayerJoin(player) {
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
          y: player.position.y
        },
        rot: player.lookDirect
      });
    }
  }, {
    key: "onPlayerQuit",
    value: function onPlayerQuit(data) {
      this.broadcast(gamecode.playerQuit, {
        id: data
      });
    }
  }, {
    key: "onPlayerEquipItem",
    value: function onPlayerEquipItem(data) {
      this.broadcast(gamecode.syncEquipItem, data);
    }
  }, {
    key: "onPlayerGetHit",
    value: function onPlayerGetHit(data) {
      var pack = [];
      pack.push(data);
      this.syncPlayerHP(pack);
    }
  }, {
    key: "onPlayerDie",
    value: function onPlayerDie(idPlayer) {
      this.removePlayerStructures(idPlayer);
      this.broadcast(gamecode.playerDie, {
        id: idPlayer
      });
    }
  }, {
    key: "onPlayerSwitchItem",
    value: function onPlayerSwitchItem(data) {
      this.broadcast(gamecode.switchItem, data);
    }
  }, {
    key: "onCreateNpc",
    value: function onCreateNpc(data) {
      this.broadcast(gamecode.spawnNpc, data);
    }
  }, {
    key: "onNpcDie",
    value: function onNpcDie(player, npc) {
      this.npcs[npc.id].isJoined = false;

      if (this.players[player.idGame] != null && this.players[player.idGame].isJoinedGame) {
        this.addGold(this.players[player.idGame], 100);
      }

      this.respawnNpc(this.npcs[npc.id]);
      this.broadcast(gamecode.syncNpcDie, {
        id: npc.id
      });
    }
  }, {
    key: "onNpcHit",
    value: function onNpcHit(npc) {
      if (this.npcs[npc.id].isJoined) {
        var data = [{
          id: npc.id,
          hp: this.npcs[npc.id].getHpPercent()
        }];
        this.syncNpcHP(data);
      }
    }
  }, {
    key: "onPlayerTriggerAttack",
    value: function onPlayerTriggerAttack(data) {
      this.broadcast(gamecode.triggerAttack, data);
    }
  }, {
    key: "onCreateStructure",
    value: function onCreateStructure(data) {
      this.broadcast(gamecode.spawnnStructures, data);
    }
  }, {
    key: "onRemoveStructure",
    value: function onRemoveStructure(data) {
      this.broadcast(gamecode.removeStructures, {
        id: data
      });
    }
  }, {
    key: "onCreateProjectile",
    value: function onCreateProjectile(data) {
      this.broadcast(gamecode.createProjectile, data);
    }
  }, {
    key: "onRemoveProjectile",
    value: function onRemoveProjectile(data) {
      this.broadcast(gamecode.removeProjectile, {
        id: data
      });
    }
  }, {
    key: "onSyncProjectilePosition",
    value: function onSyncProjectilePosition(data) {
      this.broadcast(gamecode.syncPositionProjectile, {
        pos: data
      });
    }
    /* #endregion */

  }, {
    key: "getRandomPosition",
    value: function getRandomPosition() {
      var pos = this.map.randomPosition();
      return new Vector(pos.x, pos.y);
    }
  }, {
    key: "sendChat",
    value: function sendChat(data) {
      this.broadcast(gamecode.playerChat, data);
    }
  }, {
    key: "getKeyByValue",
    value: function getKeyByValue(object, value) {
      return Object.keys(object).find(function (key) {
        return object[key] === value;
      });
    }
  }, {
    key: "pushNpcBack",
    value: function pushNpcBack(npc, direct, range) {
      npc.position.add(direct.unitVector.scale(range));
    }
  }, {
    key: "pushPlayerBack",
    value: function pushPlayerBack(player, direct, range) {
      player.position.add(direct.unitVector.scale(range));
    }
  }, {
    key: "broadcast",
    value: function broadcast(event, args) {
      this.players.forEach(function (p) {
        if (p != null) {
          p.send(event, args);
        }
      });
    }
  }]);

  return Game;
}();

module.exports = Game;