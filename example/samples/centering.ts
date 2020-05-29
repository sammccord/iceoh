import { Application, Container, Sprite, Graphics } from 'pixi.js'
import anime from 'animejs'
import { IsoTilemap } from '../../src'

export default function basicIso() {
  const app = new Application({
    view: document.getElementById('canvas')
  })
  let sheet
  const mapContainer = new Container()
  mapContainer.sortableChildren = true
  app.stage.addChild(mapContainer);

  const debugGraphics = new Graphics();
  debugGraphics.lineStyle(2, 0xffffff, 1.0);
  app.stage.addChild(debugGraphics);

  const map = new IsoTilemap({
    getGlobalDimensions: () => app.view,
    getWorldPosition: () => mapContainer.position,
    getWorldScale: () => mapContainer.scale,
    worldOrigin: { x: 0.5, y: 0.5 },
    baseTileDimensions: {
      width: 64,
      height: 64,
      depth: 32
    }
  })

  // Reference to sprite that will be moved around
  let player, playerPosition = { x: 2, y: 2, z: 1 }

  app.loader.add('mushy.json').load((loader, resources) => {
    sheet = resources['mushy.json']
    for (let y = 0; y < 5; y++) {
      for (let x = 0; x < 5; x++) {
        const sprite = new Sprite(sheet.spritesheet.textures['train_459_0001-30.png'])
        sprite.anchor.set(0.5)
        const position = map.add(
          sprite,
          { x, y, z: 0 }
        )
        sprite.zIndex = position.z
        sprite.position.set(position.x, position.y)
        mapContainer.addChild(sprite)
      }
    }

    player = new Sprite(sheet.spritesheet.textures['train_1569_0001-34.png'])
    player.anchor.set(0.5)
    const position = map.add(
      player,
      playerPosition
    )
    player.zIndex = position.z
    player.position.set(position.x, position.y)
    mapContainer.addChild(player)
  })

  function onMouseMove(e) {
    const tile = map.toTile(mapContainer.toLocal(e.data.global))
    const { x, y } = map.toPoint(tile)
    debugGraphics.clear()
    debugGraphics.lineStyle(2, 0xFF00FF, 1);
    debugGraphics.drawRect(
      x - (32 * mapContainer.scale.x), y - (32 * mapContainer.scale.y),
      (64 * mapContainer.scale.x), (32 * mapContainer.scale.y)
    );
  }

  function onMouseUp(e) {
    const tile = map.toTile(mapContainer.toLocal(e.data.global))
    if (!map.get(tile)) return
    anime({
      targets: mapContainer.position,
      duration: 1000,
      easing: 'easeInOutSine',
      ...map.centerToTile(tile)
    })
    anime({
      targets: player.position,
      duration: 1000,
      easing: 'easeInOutSine',
      complete: () => {
        playerPosition.x = tile.x
        playerPosition.y = tile.y
      },
      ...map.move(playerPosition, { ...tile, z: 1 })
    })
  }

  mapContainer.interactive = true
  mapContainer
    .on('pointerup', onMouseUp)
    .on('pointerupoutside', onMouseUp)
    .on('pointermove', onMouseMove)
  return () => {
    app.stage.removeChild(mapContainer)
    app.destroy()
  }
}