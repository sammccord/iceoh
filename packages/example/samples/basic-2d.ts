import { Application, Container, Sprite, Assets } from "pixi.js";
import { Tilemap } from "../../iceoh/src";

let sheet;
const columns = 34;
const tilemap = [
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2,
  2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 5, 12,
  12, 12, 13, 12, 13, 13, 14, 13, 13, 13, 14, 13, 5, 13, 14, 13, 13, 13, 14, 5,
  3, 7, 0, 0, 0, 0, 0, 0, 0, 0, 7, 3, 16, 17, 15, 15, 15, 15, 15, 15, 15, 15,
  15, 15, 15, 15, 15, 18, 18, 18, 18, 18, 18, 18, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 3, 16, 20, 20, 20, 20, 20, 15, 15, 21, 1, 3, 21, 15, 17, 18, 18, 18, 18,
  22, 23, 22, 18, 3, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 26, 20, 27, 27, 27, 20,
  15, 15, 21, 2, 2, 21, 15, 15, 15, 15, 18, 18, 18, 22, 23, 23, 3, 7, 0, 0, 0,
  0, 0, 0, 0, 0, 7, 3, 26, 33, 34, 35, 34, 36, 15, 15, 21, 37, 37, 21, 15, 1, 2,
  2, 2, 2, 2, 38, 18, 38, 2, 7, 0, 0, 0, 0, 0, 0, 0, 0, 7, 3, 17, 20, 34, 34,
  15, 20, 15, 15, 21, 21, 21, 21, 15, 3, 13, 13, 13, 13, 5, 5, 39, 5, 5, 7, 0,
  0, 0, 0, 0, 0, 0, 0, 7, 3, 16, 20, 20, 20, 20, 20, 15, 15, 45, 15, 15, 15, 15,
  3, 46, 46, 46, 46, 46, 46, 18, 46, 46, 7, 0, 0, 0, 0, 0, 0, 0, 0, 7, 3, 15,
  15, 47, 47, 47, 15, 15, 15, 3, 15, 15, 15, 15, 3, 7, 0, 0, 0, 0, 0, 23, 7, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 47, 47, 15, 2, 2, 2, 2, 2, 2, 2, 2, 3,
  7, 0, 0, 0, 15, 18, 23, 18, 23, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 13, 50, 15,
  47, 47, 5, 32, 13, 10, 49, 49, 49, 5, 3, 7, 0, 0, 0, 15, 1, 1, 3, 18, 7, 0, 0,
  0, 0, 0, 0, 0, 0, 7, 3, 15, 47, 47, 47, 16, 17, 26, 15, 9, 8, 24, 52, 52, 53,
  7, 0, 15, 54, 23, 1, 1, 3, 22, 18, 23, 0, 0, 0, 0, 0, 0, 0, 7, 3, 47, 55, 47,
  47, 17, 26, 17, 15, 8, 24, 24, 52, 52, 5, 0, 0, 54, 1, 3, 1, 1, 1, 1, 1, 18,
  7, 0, 0, 0, 0, 0, 0, 0, 3, 47, 55, 15, 47, 26, 17, 16, 15, 24, 24, 19, 52, 52,
  56, 57, 57, 15, 2, 2, 1, 1, 1, 2, 2, 18, 0, 0, 0, 0, 0, 0, 0, 7, 2, 2, 2, 2,
  2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 38, 46, 46, 15, 5, 11, 1, 1, 3, 13, 14, 23, 7,
  0, 0, 0, 0, 0, 0, 7, 5, 13, 13, 13, 5, 13, 13, 13, 13, 13, 5, 13, 13, 13, 5,
  7, 7, 15, 15, 15, 2, 2, 2, 58, 44, 23, 7, 0, 59, 60, 61, 62, 61, 7, 46, 46,
  46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 0, 7, 46, 46, 15, 5, 6, 6,
  58, 46, 46, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 16, 15, 15, 44, 54, 7, 0, 0, 0, 63, 64, 65, 66, 67, 0, 0, 0, 0,
  0, 0, 1, 38, 23, 54, 0, 0, 16, 24, 16, 19, 0, 0, 0, 7, 46, 46, 46, 46, 46, 7,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 15, 52, 26, 0, 0, 53, 5, 18, 23, 7, 7, 19, 24, 24,
  45, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 68, 69, 70, 71, 72, 0, 26, 17, 52,
  7, 7, 5, 18, 23, 54, 0, 7, 16, 24, 38, 2, 7, 0, 0, 0, 48, 48, 51, 51, 48, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 7, 15, 15, 16, 7, 0, 54, 15, 23, 15, 7, 7, 15, 19, 5,
  5, 0, 0, 0, 7, 48, 48, 48, 51, 48, 7, 0, 0, 0, 74, 75, 0, 76, 77, 7, 46, 46,
  46, 7, 7, 46, 46, 46, 46, 7, 7, 46, 46, 46, 46, 7, 0, 0, 7, 46, 46, 46, 46,
  46, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 78, 79, 0, 80, 81, 0, 25, 82, 83, 0, 0,
  84, 85, 86, 4, 0, 0, 25, 87, 88, 89, 0, 0, 0, 0, 88, 90, 88, 88, 89, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 91, 82, 92, 93, 94, 91, 95, 96, 97, 86, 94, 94, 89, 90, 90,
  98, 94, 0, 0, 94, 88, 90, 90, 89, 88, 94, 0, 0, 0, 99, 100, 0, 101, 102, 91,
  82, 83, 25, 94, 91, 103, 25, 25, 104, 94, 91, 88, 88, 85, 105, 94, 0, 0, 94,
  106, 106, 106, 107, 106, 91, 0, 0, 0, 0, 0, 0, 0, 0, 94, 106, 106, 107, 91,
  94, 83, 93, 25, 25, 91, 94, 87, 89, 96, 108, 91, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 109, 110, 0, 0, 0, 0, 0, 0, 0, 0, 94, 107, 106, 106, 107, 94, 91, 106,
  106, 107, 106, 94, 0, 0, 0, 82, 92, 82, 92, 82, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 91, 83, 84, 84, 84, 92,
  91, 0, 0, 0, 0, 0, 0, 0, 0, 0, 84, 105, 105, 105, 105, 105, 105, 105, 105,
  105, 105, 105, 105, 105, 85, 0, 0, 86, 97, 82, 84, 84, 84, 82, 92, 82, 0, 0,
  0, 0, 0, 0, 0, 91, 84, 108, 111, 112, 113, 112, 111, 111, 112, 113, 113, 112,
  111, 114, 96, 91, 91, 25, 84, 84, 84, 84, 84, 84, 84, 92, 94, 0, 0, 0, 0, 0,
  0, 91, 84, 25, 83, 92, 82, 83, 82, 25, 25, 25, 97, 4, 86, 4, 39, 4, 86, 25,
  105, 105, 84, 84, 84, 105, 105, 82, 94, 0, 0, 0, 0, 0, 0, 94, 84, 83, 92, 92,
  92, 82, 25, 83, 25, 25, 86, 104, 104, 86, 98, 106, 106, 86, 111, 108, 84, 84,
  84, 112, 111, 83, 91, 0, 0, 0, 0, 0, 0, 91, 84, 25, 82, 92, 25, 83, 25, 25,
  87, 86, 25, 25, 104, 25, 84, 94, 94, 104, 86, 104, 105, 105, 105, 83, 82, 25,
  94, 0, 0, 0, 0, 0, 0, 0, 84, 105, 85, 25, 83, 25, 85, 105, 105, 84, 105, 105,
  105, 105, 84, 91, 91, 106, 106, 25, 111, 112, 111, 25, 106, 107, 91, 0, 0, 0,
  0, 0, 0, 94, 84, 111, 96, 82, 82, 25, 96, 112, 111, 84, 108, 112, 112, 111,
  84, 91, 0, 0, 94, 97, 25, 25, 83, 83, 91, 0, 0, 0, 0, 0, 0, 0, 0, 91, 84, 25,
  83, 82, 92, 83, 83, 25, 25, 95, 104, 97, 104, 86, 84, 94, 0, 0, 91, 106, 106,
  83, 106, 106, 94, 0, 0, 0, 0, 0, 0, 0, 0, 94, 84, 83, 82, 93, 93, 82, 92, 82,
  83, 103, 4, 4, 86, 4, 84, 91, 0, 0, 0, 0, 0, 25, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 94, 84, 25, 93, 115, 115, 87, 92, 92, 83, 83, 86, 4, 4, 4, 105, 105, 105,
  105, 105, 105, 85, 86, 85, 84, 0, 0, 0, 0, 0, 0, 0, 0, 0, 91, 84, 93, 93, 116,
  117, 115, 93, 82, 97, 86, 4, 86, 4, 4, 111, 111, 112, 112, 111, 114, 96, 56,
  96, 84, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 84, 83, 93, 116, 116, 116, 93, 83, 25,
  104, 30, 31, 86, 97, 86, 97, 25, 89, 88, 88, 88, 90, 90, 84, 91, 0, 0, 0, 0,
  0, 0, 0, 0, 91, 84, 82, 93, 93, 82, 93, 82, 92, 92, 83, 42, 43, 104, 25, 89,
  88, 89, 88, 90, 88, 90, 90, 90, 84, 94, 0, 0, 0, 0, 0, 0, 0, 0, 94, 84, 92,
  92, 82, 82, 83, 83, 82, 83, 25, 104, 25, 97, 104, 25, 89, 25, 89, 88, 90, 90,
  88, 88, 84, 91, 0, 0, 0, 0, 0, 0, 0, 0, 94, 105, 105, 105, 105, 105, 105, 105,
  105, 105, 105, 105, 105, 105, 105, 105, 105, 105, 105, 105, 105, 105, 105,
  105, 105, 94, 0, 0, 0, 0, 0, 0, 0, 0, 94, 111, 112, 111, 111, 112, 112, 113,
  112, 111, 111, 112, 113, 112, 113, 113, 112, 111, 108, 112, 113, 113, 112,
  111, 111, 94, 0, 0, 0, 0, 0, 0, 0, 0, 94, 106, 106, 106, 106, 107, 106, 106,
  106, 106, 106, 106, 106, 107, 107, 107, 106, 106, 106, 107, 106, 106, 106,
  106, 107, 91, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
];

export default function basic2d() {
  const app = new Application({
    view: document.getElementById("canvas"),
  });
  const mapContainer = new Container();
  mapContainer.sortableChildren = true;
  app.stage.addChild(mapContainer);

  mapContainer.scale.x = 1.5;
  mapContainer.scale.y = 1.5;

  const map = new Tilemap({
    getScreenDimensions: () => app.view,
    getWorldPosition: () => mapContainer.position,
    getWorldScale: () => mapContainer.scale,
    worldOrigin: { x: 0, y: 0 },
    baseTileDimensions: {
      width: 64,
      height: 64,
    },
  });
  Assets.load("scut.json").then((_sheet) => {
    sheet = _sheet;
    tilemap.forEach((num, i) => {
      const sprite = new Sprite(sheet.textures[`sprite-${num}.png`]);
      sprite.anchor.set(0.5);
      const position = map.add(sprite, {
        x: i % columns,
        y: Math.floor(i / columns),
        z: 0,
      });
      sprite.position.set(position.x, position.y);
      mapContainer.addChild(sprite);
    });
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

      setTimeout(() => {
        const tile = map.toTile(mapContainer.toLocal(e.data.global));
        const { x, y } = map.toWorldPoint(tile);
        console.log(tile, x, y);
        const sprite = new Sprite(sheet.textures[`sprite-${20}.png`]);
        sprite.anchor.set(0.5);
        sprite.position.set(x, y);
        mapContainer.addChild(sprite);
      }, 1000);
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
