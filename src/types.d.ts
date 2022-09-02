declare module "*/atoms-module.wasm" {
  export const rule: (
    aAtomsCount: number,
    aPosition: number,
    aVelocity: number,
    bAtomsCount: number,
    bPosition: number,
    range: number,
    gravity
  ) => void;
  export const memory: WebAssembly.Memory;
}
