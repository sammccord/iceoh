import { Application, Container, Sprite, Graphics, Assets } from "pixi.js";
import anime from "animejs";
import { IsoTilemap } from "../../iceoh/src";

export default function basicIso() {
  const app = new Application({
    view: document.getElementById("canvas"),
  });
  let sheet;
  const mapContainer = new Container();
  mapContainer.sortableChildren = true;
  app.stage.addChild(mapContainer);

  mapContainer.scale.x = 1.5;
  mapContainer.scale.y = 1.5;

  const debugGraphics = new Graphics();
  debugGraphics.lineStyle(2, 0xffffff, 1.0);
  app.stage.addChild(debugGraphics);

  const map = new IsoTilemap({
    getScreenDimensions: () => app.view,
    getWorldPosition: () => mapContainer.position,
    getWorldScale: () => mapContainer.scale,
    worldOrigin: { x: 0.5, y: 0.5 },
    baseTileDimensions: {
      width: 64,
      height: 64,
      depth: 32,
    },
  });

  // Reference to sprite that will be moved around
  let player,
    playerPosition = { x: 2, y: 2, z: 1 };

  Assets.load("mushy.json").then((_sheet) => {
    sheet = _sheet;
    for (let y = 0; y < 5; y++) {
      for (let x = 0; x < 5; x++) {
        const sprite = new Sprite(sheet.textures["train_459_0001-30.png"]);
        sprite.anchor.set(0.5);
        const position = map.add(sprite, { x, y, z: 0 });
        sprite.zIndex = position.z;
        sprite.position.set(position.x, position.y);
        mapContainer.addChild(sprite);
      }
    }

    player = new Sprite(sheet.textures["train_1569_0001-34.png"]);
    player.anchor.set(0.5);
    const position = map.add(player, playerPosition);
    player.zIndex = position.z;
    player.position.set(position.x, position.y);
    mapContainer.addChild(player);
  });

  let dragging = false;
  let dragInitStartingX = 0;
  let dragInitStartingY = 0;
  let dragPrevStartingX = 0;
  let dragPrevStartingY = 0;

  function onMouseMove(e) {
    if (dragging) {
      mapContainer.position.set(
        mapContainer.position.x + e.data.global.x - dragPrevStartingX,
        mapContainer.position.y + e.data.global.y - dragPrevStartingY
      );
      dragPrevStartingX = e.data.global.x;
      dragPrevStartingY = e.data.global.y;
    }
    // draw debug graphics
    const tile = map.toTile(mapContainer.toLocal(e.data.global));
    const { x, y } = map.toScreenPoint(tile);
    debugGraphics.clear();
    debugGraphics.lineStyle(2, 0xff00ff, 1);
    debugGraphics.drawRect(
      x - 32 * mapContainer.scale.x,
      y - 32 * mapContainer.scale.y,
      64 * mapContainer.scale.x,
      32 * mapContainer.scale.y
    );
  }

  function onMouseDown(e) {
    if (!dragging) {
      dragInitStartingX = dragPrevStartingX = e.data.global.x;
      dragInitStartingY = dragPrevStartingY = e.data.global.y;
    }
    dragging = true;
  }

  function onMouseUp(e) {
    if (dragging) {
      dragging = false;
      mapContainer.position.set(
        mapContainer.position.x + e.data.global.x - dragPrevStartingX,
        mapContainer.position.y + e.data.global.y - dragPrevStartingY
      );
      dragPrevStartingX = e.data.global.x;
      dragPrevStartingY = e.data.global.y;
    }
    const tile = map.toTile(mapContainer.toLocal(e.data.global));
    if (!map.get(tile)) return;
    anime({
      targets: mapContainer.position,
      duration: 1000,
      easing: "easeInOutSine",
      ...map.centerToTile(tile),
    });
    anime({
      targets: player.position,
      duration: 1000,
      easing: "easeInOutSine",
      complete: () => {
        playerPosition.x = tile.x;
        playerPosition.y = tile.y;
      },
      ...map.move(playerPosition, { ...tile, z: 1 }),
    });
  }

  mapContainer.interactive = true;
  mapContainer
    .on("pointerdown", onMouseDown)
    .on("pointerup", onMouseUp)
    .on("pointerupoutside", onMouseUp)
    .on("pointermove", onMouseMove);
  return () => {
    app.stage.removeChild(mapContainer);
  };
}
