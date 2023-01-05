import { Application, Container, Sprite, Assets } from "pixi.js";
import { IsoTilemap } from "iceoh";

export default function basicIso() {
  const app = new Application({
    view: document.getElementById("canvas"),
  });
  let sheet;
  const mapContainer = new Container();
  mapContainer.sortableChildren = true;
  app.stage.addChild(mapContainer);

  const map = new IsoTilemap({
    getGlobalDimensions: () => app.view,
    getWorldPosition: () => mapContainer.position,
    getWorldScale: () => mapContainer.scale,
    worldOrigin: { x: 0.5, y: 0.5 },
    baseTileDimensions: {
      width: 64,
      height: 64,
      depth: 32,
    },
  });
  Assets.load("mushy.json").then((_sheet) => {
    sheet = _sheet;
    for (let y = 0; y < 5; y++) {
      for (let x = 0; x < 5; x++) {
        const sprite = new Sprite(_sheet.textures["train_459_0001-30.png"]);
        sprite.anchor.set(0.5);
        const position = map.add(sprite, { x, y, z: 0 });
        sprite.zIndex = position.z;
        sprite.position.set(position.x, position.y);
        mapContainer.addChild(sprite);
      }
    }
  });
  // .add("mushy.json")
  // .load((loader, resources) => {
  //   sheet = resources["mushy.json"];
  //   for (let y = 0; y < 5; y++) {
  //     for (let x = 0; x < 5; x++) {
  //       const sprite = new Sprite(
  //         sheet.spritesheet.textures["train_459_0001-30.png"]
  //       );
  //       sprite.anchor.set(0.5);
  //       const position = map.add(sprite, { x, y, z: 0 });
  //       sprite.zIndex = position.z;
  //       sprite.position.set(position.x, position.y);
  //       mapContainer.addChild(sprite);
  //     }
  //   }
  // });

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
  }

  function onMouseDown(e) {
    if (!dragging) {
      dragInitStartingX = dragPrevStartingX = e.data.global.x;
      dragInitStartingY = dragPrevStartingY = e.data.global.y;
    }
    dragging = true;
  }

  function onMouseUp(e) {
    const global = e.data ? e.data.global : { x: e.offsetX, y: e.offsetY };
    if (dragging) {
      dragging = false;
      var distX = global - dragInitStartingX;
      var distY = global - dragInitStartingY;

      if (Math.abs(distX) > 5 && Math.abs(distY) > 5) return;
      const tile = map.toTile(mapContainer.toLocal(e.data.global));
      const sprite = new Sprite(sheet.textures["train_459_0001-30.png"]);
      sprite.anchor.set(0.5);
      const position = map.add(sprite, { x: tile.x, y: tile.y, z: 1 });
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
