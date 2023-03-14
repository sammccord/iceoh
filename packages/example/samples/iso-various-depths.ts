import { Application, Container, Sprite, Graphics, Assets } from "pixi.js";
import { IsoTilemap, collectRay } from "../../iceoh/src";

export default function basicIso() {
  const app = new Application({
    view: document.getElementById("canvas"),
  });
  let sheet;
  const mapContainer = new Container();
  mapContainer.sortableChildren = true;
  app.stage.addChild(mapContainer);

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

  // mapContainer.scale = { x: 1.5, y: 1.5 };
  // mapContainer.position.x += 64;
  // mapContainer.position.y += 64;

  Assets.load("mushy.json").then((_sheet) => {
    sheet = _sheet;
    for (let y = 0; y < 5; y++) {
      for (let x = 0; x < 5; x++) {
        const sprite = new Sprite(sheet.textures["train_459_0001-30.png"]);
        sprite.anchor.set(0.5);
        const position = map.add({ x, y, z: 0 }, { x, y, z: 0 });
        sprite.zIndex = position.z;
        sprite.position.set(position.x, position.y);
        mapContainer.addChild(sprite);
      }
    }
  });

  let dragging = false;
  let dragInitStartingX = 0;
  let dragInitStartingY = 0;
  let dragPrevStartingX = 0;
  let dragPrevStartingY = 0;

  function onMouseDown(e) {
    if (!dragging) {
      dragInitStartingX = dragPrevStartingX = e.data.global.x;
      dragInitStartingY = dragPrevStartingY = e.data.global.y;
    }
    dragging = true;
  }

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
    const local = mapContainer.toLocal(e.data.global);
    const tile = map.worldToTile(local);
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
    // Test ray casting
    const local = mapContainer.toLocal(e.data.global);
    const tile = map.worldToTile(local);
    const hits = map.collisionMap(local);
    console.log("collisionMap", hits);
    const n = performance.now();
    const ray = collectRay(hits);
    console.log("collectRay ms", performance.now() - n);
    console.log("collectRay", ray);
    console.log("castRay", map.castRay(local));

    const column = map.getColumn(tile).filter((n) => !!n);
    if (column.length === 1) {
      const sprite = Sprite.from("tile2x.png");
      sprite.anchor.set(0.5);
      const position = map.add(
        { x: tile.x, y: tile.y, z: 1 },
        { x: tile.x, y: tile.y, z: 1 },
        { width: 140, height: 80, depth: 10 }
      );
      // console.log(p1.z)
      sprite.zIndex = position.z;
      sprite.position.set(position.x, position.y);
      mapContainer.addChild(sprite);
    } else if (column.length === 2) {
      const sprite = Sprite.from("twostack.png");
      sprite.anchor.set(0.5);
      const position = map.add(
        { x: tile.x, y: tile.y, z: 2 },
        { x: tile.x, y: tile.y, z: 2 },
        { width: 64, height: 96, depth: 64 }
      );
      sprite.zIndex = position.z;
      sprite.position.set(position.x, position.y);
      mapContainer.addChild(sprite);
    } else if (column.length > 2) {
      const sprite = Sprite.from("tile.png");
      sprite.anchor.set(0.5);
      const position = map.add(
        { x: tile.x, y: tile.y, z: column.length + 1 },
        { x: tile.x, y: tile.y, z: column.length + 1 },
        { width: 70, height: 40, depth: 5 }
      );
      // console.log(p1.z)
      sprite.zIndex = position.z;
      sprite.position.set(position.x, position.y);
      mapContainer.addChild(sprite);
    }
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
