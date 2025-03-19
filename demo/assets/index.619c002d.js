var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
(async () => {
  (function() {
    const o = document.createElement("link").relList;
    if (o && o.supports && o.supports("modulepreload"))
      return;
    for (const A of document.querySelectorAll('link[rel="modulepreload"]'))
      n(A);
    new MutationObserver((A) => {
      for (const t of A)
        if (t.type === "childList")
          for (const i of t.addedNodes)
            i.tagName === "LINK" && i.rel === "modulepreload" && n(i);
    }).observe(document, {
      childList: true,
      subtree: true
    });
    function r(A) {
      const t = {};
      return A.integrity && (t.integrity = A.integrity), A.referrerpolicy && (t.referrerPolicy = A.referrerpolicy), A.crossorigin === "use-credentials" ? t.credentials = "include" : A.crossorigin === "anonymous" ? t.credentials = "omit" : t.credentials = "same-origin", t;
    }
    function n(A) {
      if (A.ep)
        return;
      A.ep = true;
      const t = r(A);
      fetch(A.href, t);
    }
  })();
  const k = async (s = {}, o) => {
    let r;
    if (o.startsWith("data:")) {
      const n = o.replace(/^data:.*?base64,/, "");
      let A;
      if (typeof Buffer == "function" && typeof Buffer.from == "function")
        A = Buffer.from(n, "base64");
      else if (typeof atob == "function") {
        const t = atob(n);
        A = new Uint8Array(t.length);
        for (let i = 0; i < t.length; i++)
          A[i] = t.charCodeAt(i);
      } else
        throw new Error("Cannot decode base64-encoded data URL");
      r = await WebAssembly.instantiate(A, s);
    } else {
      const n = await fetch(o), A = n.headers.get("Content-Type") || "";
      if ("instantiateStreaming" in WebAssembly && A.startsWith("application/wasm"))
        r = await WebAssembly.instantiateStreaming(n, s);
      else {
        const t = await n.arrayBuffer();
        r = await WebAssembly.instantiate(t, s);
      }
    }
    return r.instance.exports;
  }, R = await k({}, "data:application/wasm;base64,AGFzbQEAAAABCwFgB39/f39/fX0AAwIBAAUDAQAIBxECBm1lbW9yeQIABHJ1bGUAAAqjBAGgBAIHfQF/AkAgAEUNACADBEAgBCADQQN0aiEDIAEgAEEDdGohDiAFIAWUIQsDQCABKgIEIQwgASoCACENIAQhAEMAAAAAIQVDAAAAACEHA0ACQCANIAAqAgCTIgkgCZQgDCAAQQRqKgIAkyIKIAqUkiIIQwAAAABeRQ0AIAggC11FDQAgBiAIkZUiCCAKlCAHkiEHIAggCZQgBZIhBQsgAEEIaiIAIANHDQALIAIgBSACKgIAkkMAAAA/lCIFOAIAIAIgByACKgIEkkMAAAA/lDgCBCABIAUgASoCAJIiBzgCACABIAIqAgQgASoCBJIiBTgCBEEBIAdDAACAv10gB0MAAIA/XhsEQCACIAdDCtcjvJQ4AgAgASoCBCEFC0EBIAVDAACAv10gBUMAAIA/XhsEQCACIAVDCtcjvJQ4AgQLIAJBCGohAiABQQhqIgEgDkcNAAsMAQsgAEEDdCEEA0AgAiACKgIAQwAAAACSQwAAAD+UIgU4AgAgAkEEaiIAIAAqAgBDAAAAAJJDAAAAP5Q4AgAgASAFIAEqAgCSIgY4AgAgAUEEaiIDIAAqAgAgAyoCAJIiBTgCAEEBIAZDAACAv10gBkMAAIA/XhsEQCACIAZDCtcjvJQ4AgAgAyoCACEFC0EBIAVDAACAv10gBUMAAIA/XhsEQCAAIAVDCtcjvJQ4AgALIAJBCGohAiABQQhqIQEgBEEIayIEDQALCwsAJglwcm9kdWNlcnMBDHByb2Nlc3NlZC1ieQEFY2xhbmcGMTQuMC42"), N = R.memory, P = R.rule, x = `precision highp float;

uniform vec3 color;

void main() {
  gl_FragColor = vec4(color, 1.0);
}`, L = `attribute vec2 position;

void main() {
  gl_PointSize = 2.0;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}`, v = document.querySelector("canvas");
  v.width = innerWidth * devicePixelRatio;
  v.height = innerHeight * devicePixelRatio;
  const e = v.getContext("webgl2");
  let S = 0;
  function w(s) {
    const o = new Float32Array(N.buffer, S, s);
    return S += o.byteLength, o;
  }
  const f = e.createProgram(), I = e.createShader(e.VERTEX_SHADER);
  e.shaderSource(I, L);
  e.compileShader(I);
  e.attachShader(f, I);
  const C = e.createShader(e.FRAGMENT_SHADER);
  e.shaderSource(C, x);
  e.compileShader(C);
  e.attachShader(f, C);
  e.linkProgram(f);
  e.getProgramParameter(f, e.LINK_STATUS) || (console.log(e.getShaderInfoLog(I)), console.log(e.getShaderInfoLog(C)));
  e.useProgram(f);
  const q = e.getUniformLocation(f, "color");
  class T {
    constructor(o, r) {
      __publicField(this, "size");
      __publicField(this, "position");
      __publicField(this, "velocity");
      __publicField(this, "buffer");
      __publicField(this, "color");
      const n = w(o * 2);
      for (let i = 0; i < n.length; ++i)
        n[i] = (Math.random() - 0.5) * 2 * 1e-3;
      const A = w(o * 2);
      for (let i = 0; i < A.length; ++i)
        A[i] = 0;
      const t = e.createBuffer();
      e.bindBuffer(e.ARRAY_BUFFER, t), e.bufferData(e.ARRAY_BUFFER, n, e.DYNAMIC_DRAW), this.size = o, this.position = n, this.velocity = A, this.buffer = t, this.color = r;
    }
    rule(o, r, n) {
      P(this.size, this.position.byteOffset, this.velocity.byteOffset, o.size, o.position.byteOffset, r, n);
    }
    rule_js(o, r, n) {
      const A = r * r;
      for (let t = 0; t < this.position.length; t += 2) {
        let i = 0, a = 0;
        for (let c = 0; c < o.position.length; c += 2) {
          let m = this.position[t] - o.position[c], p = this.position[t + 1] - o.position[c + 1], y = m * m + p * p;
          if (y > 0 && y < A) {
            let U = Math.sqrt(y), D = n / U;
            i += D * m, a += D * p;
          }
        }
        this.velocity[t] = (this.velocity[t] + i) * 0.5, this.velocity[t + 1] = (this.velocity[t + 1] + a) * 0.5, this.position[t] = this.velocity[t] + this.position[t], this.position[t + 1] = this.velocity[t + 1] + this.position[t + 1], (this.position[t] <= -1 || this.position[t] >= 1) && (this.velocity[t + 0] = -this.position[t] * 0.01), (this.position[t + 1] <= -1 || this.position[t + 1] >= 1) && (this.velocity[t + 1] = -this.position[t + 1] * 0.01);
      }
    }
    updatePosition() {
      e.bindBuffer(e.ARRAY_BUFFER, this.buffer), e.bufferData(e.ARRAY_BUFFER, this.position, e.DYNAMIC_DRAW);
    }
    draw() {
      e.bindBuffer(e.ARRAY_BUFFER, this.buffer), e.vertexAttribPointer(0, 2, e.FLOAT, false, 0, 0), e.enableVertexAttribArray(0), e.uniform3fv(q, this.color), e.drawArrays(e.POINTS, 0, this.size);
    }
  }
  const g = 1024 * 1, l = [
    {
      count: g,
      color: [
        1,
        0,
        0
      ]
    },
    {
      count: g,
      color: [
        0,
        1,
        0
      ]
    },
    {
      count: g,
      color: [
        0,
        0,
        1
      ]
    },
    {
      count: g,
      color: [
        1,
        1,
        1
      ]
    },
    {
      count: g,
      color: [
        1,
        1,
        0
      ]
    }
  ].map(({ count: s, color: o }) => new T(s, o));
  let F = 0;
  function d(s, o, r) {
    return s.map((n) => Math.max(o, Math.min(r, n + (Math.random() - 0.5) * 5e-3)));
  }
  function M(s, o) {
    return Array.from(new Float32Array(s)).map(() => (Math.random() - 0.5) * o);
  }
  function _() {
    return 6 + Math.floor(Math.random() * 120);
  }
  let h = M(l.length ** 2, 2e-3), E = d(h, -0.01, 0.01), u = M(l.length ** 2, 0.05), B = d(u, 0.01, 0.1), b = 0, Q = _();
  for (; ; ) {
    const s = await new Promise(requestAnimationFrame);
    if (!(s - F < 1e3 / 30)) {
      F = s;
      {
        ++b, b % Q === 0 && (h = E, E = d(h, -0.01, 0.01), u = B, B = d(u, 0.01, 0.1), Q = _());
        const o = (i, a, c) => i + (a - i) * c, r = (i, a, c) => i + (a - i) * Math.sin(c * Math.PI * 2), n = b / Q, A = h.map((i, a) => r(i, E[a], n)), t = u.map((i, a) => o(i, B[a], n));
        l.forEach((i) => {
          l.forEach((a) => {
            i.rule(a, t.shift(), A.shift());
          });
        });
      }
      l.forEach((o) => o.updatePosition()), e.clearColor(0, 0, 0, 1), e.clear(e.COLOR_BUFFER_BIT), l.forEach((o) => o.draw());
    }
  }
})();
