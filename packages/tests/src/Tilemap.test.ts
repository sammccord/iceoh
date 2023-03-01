import { IsoTilemap, Tilemap } from "../../iceoh/src";
import { beforeEach, describe, expect, test } from "vitest";

interface Sprite {}

describe("IsoTilemap", () => {
  let tilemap: Tilemap<Sprite>;
  let isoTilemap: IsoTilemap<Sprite>;

  beforeEach(() => {
    tilemap = new Tilemap<Sprite>({
      baseTileDimensions: { width: 10, height: 10 },
      getGlobalDimensions: () => ({ width: 100, height: 100 }),
    });
    isoTilemap = new IsoTilemap<Sprite>({
      baseTileDimensions: { width: 10, height: 10 },
      getGlobalDimensions: () => ({ width: 100, height: 100 }),
    });
  });

  test("add with no z", () => {
    const sprite = { foo: "bar" };
    tilemap.add(sprite, { x: 10, y: 20 });
    const t = tilemap.get({ x: 10, y: 20 });
    expect(t).toBe(sprite);
  });

  test("add with no z", () => {
    const sprite = { foo: "bar" };
    isoTilemap.add(sprite, { x: 10, y: 20 });
    const t = isoTilemap.get({ x: 10, y: 20 });
    expect(t).toBe(sprite);
  });

  // test("renders children", () => {
  //   let container, child;
  //   const { unmount } = render(() => (
  //     <Container use={(c) => (container = c)}>
  //       <Text use={(t) => (child = t)}>Fantastic</Text>
  //     </Container>
  //   ));

  //   expect(child).instanceOf(pText);
  //   expect(child.parent).toBe(container);
  //   unmount();
  // });

  // test("passes pixi props to instance", () => {
  //   let inst: pContainer;

  //   const [position, setPosition] = createSignal<IPointData>({ x: 10, y: 10 });
  //   const { unmount } = render(() => (
  //     <Container use={(c) => (inst = c)} x={position().x} y={position().y} />
  //   ));

  //   expect(inst!.x).toBe(10);
  //   expect(inst!.y).toBe(10);
  //   setPosition({ x: 20, y: 20 });
  //   expect(inst!.x).toBe(20);
  //   expect(inst!.y).toBe(20);

  //   unmount();
  // });
});
