import * as AtomsModule from "./atoms-module.wasm";
import fragmentShaderSource from "./fragment.fs?raw";
import vertexShaderSource from "./vertex.vs?raw";

void fragmentShaderSource;
void vertexShaderSource;

const canvas = document.querySelector("canvas")!;
canvas.width = innerWidth * devicePixelRatio;
canvas.height = innerHeight * devicePixelRatio;

const gl = canvas.getContext("webgl2")!;

let memoryOffset = 0;

function takeFloat32Array(size: number) {
  const result = new Float32Array(
    AtomsModule.memory.buffer,
    memoryOffset,
    size
  );
  memoryOffset += result.byteLength;
  return result;
}

const program = gl.createProgram()!;

const vertexShader = gl.createShader(gl.VERTEX_SHADER)!;
gl.shaderSource(vertexShader, vertexShaderSource);
gl.compileShader(vertexShader);
gl.attachShader(program, vertexShader);

const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)!;
gl.shaderSource(fragmentShader, fragmentShaderSource);
gl.compileShader(fragmentShader);
gl.attachShader(program, fragmentShader);

gl.linkProgram(program);

if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
  console.log(gl.getShaderInfoLog(vertexShader));
  console.log(gl.getShaderInfoLog(fragmentShader));
}

gl.useProgram(program);

const color_loc = gl.getUniformLocation(program, "color");

class Group {
  public size: number;
  public position: Float32Array;
  public velocity: Float32Array;
  public buffer: WebGLBuffer;
  public color: number[];

  constructor(size: number, color: number[]) {
    const position = takeFloat32Array(size * 2);
    for (let i = 0; i < position.length; ++i) {
      position[i] = (Math.random() - 0.5) * 2.0 * 0.001;
    }

    const velocity = takeFloat32Array(size * 2);
    for (let i = 0; i < velocity.length; ++i) {
      velocity[i] = 0;
    }

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, position, gl.DYNAMIC_DRAW);

    this.size = size;
    this.position = position;
    this.velocity = velocity;
    this.buffer = buffer!;
    this.color = color;
  }

  public rule(otherGroup: Group, range: number, gravity: number) {
    AtomsModule.rule(
      this.size,
      this.position.byteOffset,
      this.velocity.byteOffset,
      otherGroup.size,
      otherGroup.position.byteOffset,
      range,
      gravity
    );
  }

  public rule_js(otherGroup: Group, range: number, gravity: number) {
    const rangeSq = range * range;
    for (let i = 0; i < this.position.length; i += 2) {
      let fx = 0;
      let fy = 0;
      for (let j = 0; j < otherGroup.position.length; j += 2) {
        let dx = this.position[i] - otherGroup.position[j];
        let dy = this.position[i + 1] - otherGroup.position[j + 1];
        let dSq = dx * dx + dy * dy;

        if (dSq > 0 && dSq < rangeSq) {
          let d = Math.sqrt(dSq);
          let F = gravity / d;
          fx += F * dx;
          fy += F * dy;
        }
      }
      this.velocity[i] = (this.velocity[i] + fx) * 0.5;
      this.velocity[i + 1] = (this.velocity[i + 1] + fy) * 0.5;
      this.position[i] = this.velocity[i] + this.position[i];
      this.position[i + 1] = this.velocity[i + 1] + this.position[i + 1];

      if (this.position[i] <= -1 || this.position[i] >= 1) {
        this.velocity[i + 0] = -this.position[i] * 0.01;
      }
      if (this.position[i + 1] <= -1 || this.position[i + 1] >= 1) {
        this.velocity[i + 1] = -this.position[i + 1] * 0.01;
      }
    }
  }

  public updatePosition() {
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
    gl.bufferData(gl.ARRAY_BUFFER, this.position, gl.DYNAMIC_DRAW);
  }

  public draw() {
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(0);
    gl.uniform3fv(color_loc, this.color);
    gl.drawArrays(gl.POINTS, 0, this.size);
  }
}

//

const atomsCount = 1024 * 1;

// prettier-ignore
const groups = [
  { count: atomsCount, color: [1, 0, 0] },
  { count: atomsCount, color: [0, 1, 0] },
  { count: atomsCount, color: [0, 0, 1] },
  { count: atomsCount, color: [1, 1, 1] },
  { count: atomsCount, color: [1, 1, 0] },
  // { count: atomsCount, color: [0, 1, 1] },
].map(({count, color})=>{
  return new Group(count, color);
});

let startTime = 0;

function genNextDirs(prevDirs: number[], min: number, max: number) {
  return prevDirs.map((v) =>
    Math.max(min, Math.min(max, v + (Math.random() - 0.5) * 0.005))
  );
}

function genInitDirs(count: number, s: number) {
  return Array.from(new Float32Array(count)).map(
    () => (Math.random() - 0.5) * s
  );
}

function getNextTick() {
  return 6 + Math.floor(Math.random() * 120);
}

let prevDirs = genInitDirs(groups.length ** 2, 0.002);
let nextDirs = genNextDirs(prevDirs, -0.01, 0.01);

let prevRanges = genInitDirs(groups.length ** 2, 0.05);
let nextRanges = genNextDirs(prevRanges, 0.01, 0.1);

let tick = 0;
let tickPeriod = getNextTick();

while (true) {
  const currentTime = await new Promise(requestAnimationFrame);

  if (currentTime - startTime < 1000 / 30) continue;
  else startTime = currentTime;

  // UPDATE

  // prettier-ignore
  {
    ++tick;

    if ((tick % tickPeriod) === 0) {
      prevDirs = nextDirs;
      nextDirs = genNextDirs(prevDirs, -0.01, 0.01);
      prevRanges = nextRanges;
      nextRanges = genNextDirs(prevRanges, 0.01, 0.1);
      tickPeriod = getNextTick();
    }
    
    const slope = (from: number, to: number, t: number) => (from + (to - from) * t);
    const slope2 = (from: number, to: number, t: number) => (from + (to - from) * Math.sin(t * Math.PI * 2));
    
    const t = tick / tickPeriod;

    const dirs = prevDirs.map((v, i)=> slope2(v, nextDirs[i], t));
    const ranges = prevRanges.map((v, i)=> slope(v, nextRanges[i], t));

    groups.forEach((a) => {
      groups.forEach((b) => {
        a.rule(b, ranges.shift()!, dirs.shift()!);
      });
    });
  }

  groups.forEach((group) => group.updatePosition());

  // DRAW

  gl.clearColor(0, 0, 0, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);

  groups.forEach((group) => group.draw());
}
