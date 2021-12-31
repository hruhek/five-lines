
const TILE_SIZE = 30;
const FPS = 30;
const SLEEP = 1000 / FPS;

enum RawTile {
  AIR,
  FLUX,
  UNBREAKABLE,
  PLAYER,
  STONE, FALLING_STONE,
  BOX, FALLING_BOX,
  KEY1, LOCK1,
  KEY2, LOCK2
}

interface FallingState {
  isFalling(): boolean;
  moveHorizontal(tile: Tile, dx: number): void;
  drop(tile: Tile, x: number, y: number): void;
}

class Falling implements FallingState {
  isFalling(): boolean { return true; }
  moveHorizontal(tile: Tile, dx: number) {}
  drop(tile: Tile, x: number, y: number) {
    map[y + 1][x] = tile;
    map[y][x] = new Air();
  }
}

class Resting implements FallingState {
  isFalling(): boolean { return false; }
  moveHorizontal(tile: Tile, dx: number) {
    if (map[playerY][playerX + dx + dx].isAir() && !map[playerY + 1][playerX + dx].isAir()) {
      map[playerY][playerX + dx + dx] = map[playerY][playerX + dx];
      moveToTile(playerX + dx, playerY);
    }
  }
  drop(tile: Tile, x: number, y: number) {}
}

class FallStrategy {
  constructor(private falling: FallingState) {}
  getFalling() { return this.falling; }
  update(tile: Tile, x: number, y: number) {
    this.falling = map[y + 1][x].getBlockOnTopState();
    this.falling.drop(tile, x, y);
  }
}

interface Tile {
  isAir(): boolean;
  isLock1(): boolean;
  isLock2(): boolean;
  draw(g: CanvasRenderingContext2D, x: number, y: number): void;
  moveHorizontal(dx: number): void;
  moveVertical(dy: number): void;
  update(x: number, y:number): void;
  getBlockOnTopState(): FallingState;
}

class Air implements Tile {
  isAir(): boolean { return true; }
  isLock1(): boolean {return false;}
  isLock2(): boolean {return false;}
  draw(g: CanvasRenderingContext2D, x: number, y: number) {}
  moveHorizontal(dx: number) {
    moveToTile(playerX + dx, playerY);
  }
  moveVertical(dy: number) {
    moveToTile(playerX, playerY + dy);
  }
  update(x: number, y: number) {}
  getBlockOnTopState(): FallingState {
    return new Falling();
  }
}

class Box implements Tile {
  private fallStrategy: FallStrategy;
  constructor(falling: FallingState) {
    this.fallStrategy = new FallStrategy(falling);
  }
  isAir(): boolean {return false;}
  isLock1(): boolean {return false;}
  isLock2(): boolean {return false;}
  draw(g: CanvasRenderingContext2D, x: number, y: number) {
    g.fillStyle = "#8b4513";
    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }
  moveHorizontal(dx: number) {
    this.fallStrategy.getFalling().moveHorizontal(this, dx)
  }
  moveVertical(dy: number) {}
  update(x: number, y: number) {
    this.fallStrategy.update(this, x, y);
  }
  getBlockOnTopState(): FallingState {
    return new Resting();
  }
}

class Flux implements Tile {
  isAir(): boolean {return false}
  isLock1(): boolean {return false;}
  isLock2(): boolean {return false;}
  draw(g: CanvasRenderingContext2D, x: number, y: number) {
    g.fillStyle = "#ccffcc";
    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }
  moveHorizontal(dx: number) {
      moveToTile(playerX + dx, playerY);
  }
  moveVertical(dy: number) {
    moveToTile(playerX, playerY + dy);
  }
  update(x: number, y: number) {}
  getBlockOnTopState(): FallingState {
    return new Resting();
  }
}

class Key implements Tile {
  constructor(private keyConf: KeyConfiguration) {}
  isAir(): boolean {return false}
  isLock1(): boolean {return false;}
  isLock2(): boolean {return false;}
  draw(g: CanvasRenderingContext2D, x: number, y: number) {
    this.keyConf.setColor(g);
    this.keyConf.fillRect(g, x, y);
  }
  moveHorizontal(dx: number) {
    this.keyConf.removeLock();
    moveToTile(playerX + dx, playerY);
  }
  moveVertical(dy: number) {
    moveToTile(playerX, playerY + dy);
  }
  update(x: number, y: number) {}
  getBlockOnTopState(): FallingState {
    return new Resting();
  }
}

class Lock implements Tile {
  constructor(private keyConf: KeyConfiguration) {}
  isAir(): boolean {return false}
  isLock1(): boolean {return this.keyConf.is1();}
  isLock2(): boolean {return !this.keyConf.is1();}
  draw(g: CanvasRenderingContext2D, x: number, y: number) {
    this.keyConf.setColor(g);
    this.keyConf.fillRect(g, x, y)
  }
  moveHorizontal(dx: number) {}
  moveVertical(dy: number) {}
  update(x: number, y: number) {}
  getBlockOnTopState(): FallingState {
    return new Resting();
  }
}

class Player implements Tile {
  isAir(): boolean {return false}
  isLock1(): boolean {return false;}
  isLock2(): boolean {return false;}
  draw(g: CanvasRenderingContext2D, x: number, y: number) {}
  moveHorizontal(dx: number) {}
  moveVertical(dy: number) {}
  update(x: number, y: number) {}
  getBlockOnTopState(): FallingState {
    return new Resting();
  }
}

class Stone implements Tile {
  private fallStrategy: FallStrategy;
  constructor(falling: FallingState) {
    this.fallStrategy = new FallStrategy(falling);
  }
  isAir(): boolean {return false}
  isLock1(): boolean {return false;}
  isLock2(): boolean {return false;}
  draw(g: CanvasRenderingContext2D, x: number, y: number) {
    g.fillStyle = "#0000cc";
    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }
  moveHorizontal(dx: number) {
    this.fallStrategy.getFalling().moveHorizontal(this, dx)
  }
  moveVertical(dy: number) {}
  update(x: number, y: number) {
    this.fallStrategy.update(this, x, y);
  }
  getBlockOnTopState(): FallingState {
    return new Resting();
  }
}

class Unbreakable implements Tile {
  isAir(): boolean {return false}
  isLock1(): boolean {return false;}
  isLock2(): boolean {return false;}
  draw(g: CanvasRenderingContext2D, x: number, y: number) {
    g.fillStyle = "#999999";
    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }
  moveHorizontal(dx: number) {}
  moveVertical(dy: number) {}
  update(x: number, y: number) {}
  getBlockOnTopState(): FallingState {
    return new Resting();
  }
}

let playerX = 1;
let playerY = 1;
let rawMap: RawTile[][] = [
  [2, 2, 2, 2, 2, 2, 2, 2],
  [2, 3, 0, 1, 1, 2, 0, 2],
  [2, 4, 2, 6, 1, 2, 0, 2],
  [2, 8, 4, 1, 1, 2, 0, 2],
  [2, 4, 1, 1, 1, 9, 0, 2],
  [2, 2, 2, 2, 2, 2, 2, 2],
];

let map: Tile[][];

function assertExhausted(x: never) : never {
    throw new Error("Unexpected object: " + x)
}

function transformTile(tile: RawTile) {
  switch (tile) {
    case RawTile.AIR: return new Air();
    case RawTile.PLAYER: return new Player();
    case RawTile.UNBREAKABLE: return new Unbreakable();
    case RawTile.STONE: return new Stone(new Resting());
    case RawTile.FALLING_STONE: return new Stone(new Falling());
    case RawTile.BOX: return new Box(new Resting());
    case RawTile.FALLING_BOX: return new Box(new Falling());
    case RawTile.FLUX: return new Flux();
    case RawTile.KEY1: return new Key(YELLOW_KEY);
    case RawTile.KEY2: return new Key(BLUE_KEY);
    case RawTile.LOCK1: return new Lock(YELLOW_KEY);
    case RawTile.LOCK2: return new Lock(BLUE_KEY);
    default: assertExhausted(tile);
  }
}

function transformMap() {
  map = new Array(rawMap.length);
  for (let y = 0; y < rawMap.length; y++) {
    map[y] = new Array(rawMap[y].length);
    for (let x = 0; x < rawMap[y].length; x++) {
      map[y][x] = transformTile(rawMap[y][x]);
    }
  }
}

function remove(shouldRemove: RemoveStrategy) {
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      if (shouldRemove.check(map[y][x])) {
        map[y][x] = new Air();
      }
    }
  }
}

interface RemoveStrategy {
  check(tile: Tile): boolean;
}

class RemoveLock1 implements RemoveStrategy{
  check(tile: Tile) {
    return tile.isLock1();
  }
}

class RemoveLock2 implements RemoveStrategy {
  check(tile: Tile): boolean {
    return tile.isLock2();
  }
}

class KeyConfiguration {
  constructor(private color: string, private _1: boolean, private removeStrategy: RemoveStrategy) {}
  is1() {
    return this._1;
  }
  setColor(g: CanvasRenderingContext2D) {
    g.fillStyle = this.color;
  }
  fillRect(g: CanvasRenderingContext2D, x:number, y: number) {
    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }
  removeLock() {
    remove(this.removeStrategy);
  }
}

const YELLOW_KEY = new KeyConfiguration('#ffcc00', true, new RemoveLock1());
const BLUE_KEY = new KeyConfiguration("#00ccff", false, new RemoveLock2());

function moveToTile(newX: number, newY: number) {
  map[playerY][playerX] = new Air();
  map[newY][newX] =  new Player();
  playerX = newX;
  playerY = newY;
}

interface Input {
  handle(): void;
}

class Right implements Input {
  handle() { map[playerY][playerX + 1].moveHorizontal(1) }
}

class Left implements Input {
  handle() { map[playerY][playerX - 1].moveHorizontal(-1) }
}

class Up implements Input {
  handle() { map[playerY - 1][playerX].moveVertical(-1) }
}

class Down implements Input {
  handle() { map[playerY + 1][playerX].moveVertical(1) }
}

let inputs: Input[] = [];

function update() {
  handleInputs();
  updateMap();
}

function handleInputs() {
  while (inputs.length > 0) {
    let input = inputs.pop();
    input.handle();
  }
}

function updateMap() {
  for (let y = map.length - 1; y >= 0; y--) {
    for (let x = 0; x < map[y].length; x++) {
      map[y][x].update(x, y)
    }
  }
}

function createGraphics() {
  let canvas = document.getElementById("GameCanvas") as HTMLCanvasElement;
  let g = canvas.getContext("2d");
  g.clearRect(0, 0, canvas.width, canvas.height);
  return g;
}

function draw() {
  let g = createGraphics();
  drawMap(g);
  drawPlayer(g);
}

function drawMap(g: CanvasRenderingContext2D) {
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      map[y][x].draw(g, x, y)
    }
  }
}

function drawPlayer(g: CanvasRenderingContext2D) {
  g.fillStyle = "#ff0000";
  g.fillRect(playerX * TILE_SIZE, playerY * TILE_SIZE, TILE_SIZE, TILE_SIZE);
}


function gameLoop() {
  let before = Date.now();
  update();
  draw();
  let after = Date.now();
  let frameTime = after - before;
  let sleep = SLEEP - frameTime;
  setTimeout(() => gameLoop(), sleep);
}

window.onload = () => {
  transformMap();
  gameLoop();
}

const LEFT_KEY = "ArrowLeft";
const UP_KEY = "ArrowUp";
const RIGHT_KEY = "ArrowRight";
const DOWN_KEY = "ArrowDown";
window.addEventListener("keydown", e => {
  if (e.key === LEFT_KEY || e.key === "a") inputs.push(new Left());
  else if (e.key === UP_KEY || e.key === "w") inputs.push(new Up());
  else if (e.key === RIGHT_KEY || e.key === "d") inputs.push(new Right());
  else if (e.key === DOWN_KEY || e.key === "s") inputs.push(new Down());
});

