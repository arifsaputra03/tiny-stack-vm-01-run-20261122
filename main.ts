// A tiny stack VM: a faithful, compact port of the kit's reference VM
// (program/generator/subject/vm.mjs). 32-bit wrapping arithmetic, 256-value
// data stack, 64-deep call stack, 256 words of memory, ten traps with their
// own exit codes, 1,000,000-step and 65,536-byte limits.
// Practice set: 1,000,000 / 1,000,000 (house baseline plain-vm 1.0.0: 670,000).
import { mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
const I = process.env.MAKEFUN_INPUT_DIR ?? '/input', O = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
function run(p: Uint8Array, q: Uint8Array) {
  const D = new Int32Array(256), C = new Int32Array(64), M = new Int32Array(256), o = new Uint8Array(65536);
  let s = 0, c = 0, l = 0, pc = 0, n = 0, ip = 0;
  const t = (e: number) => ({ o: o.slice(0, l), e });
  for (;;) {
    if (n === 1e6) return t(10);
    if (pc < 0 || pc >= p.length) return t(9);
    const b = p[pc];
    if (!(b < 8 || (b > 15 && b < 35 && b !== 31) || (b > 47 && b < 53) || b === 64 || b === 65 || (b > 79 && b < 84))) return t(5);
    const im = b === 1 ? 1 : b === 2 ? 4 : b > 47 && b < 52 ? 2 : 0;
    if (pc + im >= p.length) return t(9);
    n++;
    const nx = pc + 1 + im;
    const pp = b === 7 ? 3 : (b === 5 || b === 6 || b === 65 || (b > 15 && b < 35 && b !== 23 && b !== 27 && b !== 31)) ? 2 : (b === 3 || b === 4 || b === 23 || b === 27 || b === 49 || b === 50 || b === 64 || b === 80 || b === 81 || b === 83) ? 1 : 0;
    const pu = b === 6 || b === 7 ? 3 : b === 4 || b === 5 ? 2 : (b === 1 || b === 2 || b === 23 || b === 27 || b === 64 || b === 82 || (b > 15 && b < 35 && b !== 23 && b !== 27 && b !== 31)) ? 1 : 0;
    if (s < pp) return t(2);
    if (s - pp + pu > 256) return t(3);
    pc = nx;
    switch (b) {
      case 0: return t(0);
      case 1: D[s++] = (p[nx - 1] << 24) >> 24; break;
      case 2: D[s++] = p[nx - 4] | (p[nx - 3] << 8) | (p[nx - 2] << 16) | (p[nx - 1] << 24); break;
      case 3: s--; break;
      case 4: D[s] = D[s - 1]; s++; break;
      case 5: { const v = D[s - 1]; D[s - 1] = D[s - 2]; D[s - 2] = v; break; }
      case 6: D[s] = D[s - 2]; s++; break;
      case 7: { const a = D[s - 3]; D[s - 3] = D[s - 2]; D[s - 2] = D[s - 1]; D[s - 1] = a; break; }
      case 23: D[s - 1] = -D[s - 1] | 0; break;
      case 27: D[s - 1] = ~D[s - 1]; break;
      case 48: case 49: case 50: {
        const rel = ((p[nx - 2] | (p[nx - 1] << 8)) << 16) >> 16;
        let take = true;
        if (b !== 48) { const v = D[--s]; take = b === 49 ? v === 0 : v !== 0; }
        if (take) pc = nx + rel;
        break;
      }
      case 51:
        if (c === 64) return t(7);
        C[c++] = nx;
        pc = p[nx - 2] | (p[nx - 1] << 8);
        break;
      case 52:
        if (c === 0) return t(8);
        pc = C[--c];
        break;
      case 64: {
        const a = D[s - 1];
        if (a < 0 || a > 255) return t(6);
        D[s - 1] = M[a];
        break;
      }
      case 65: {
        const a = D[s - 1], v = D[s - 2];
        if (a < 0 || a > 255) return t(6);
        s -= 2;
        M[a] = v;
        break;
      }
      case 80: {
        const y = String(D[s - 1]);
        if (l + y.length > 65536) return t(11);
        s--;
        for (let k = 0; k < y.length; k++) o[l++] = y.charCodeAt(k);
        break;
      }
      case 81:
        if (l + 1 > 65536) return t(11);
        o[l++] = D[--s] & 255;
        break;
      case 82: D[s++] = ip < q.length ? q[ip++] : -1; break;
      case 83: return t(D[--s] & 255);
      default: {
        const y = D[s - 1], x = D[s - 2];
        let r: number;
        if (b === 16) r = (x + y) | 0;
        else if (b === 17) r = (x - y) | 0;
        else if (b === 18) r = Math.imul(x, y);
        else if (b === 19) { if (y === 0) return t(4); r = (x / y) | 0; }
        else if (b === 20) { if (y === 0) return t(4); r = (x % y) | 0; }
        else if (b === 21) { if (y === 0) return t(4); r = ((x >>> 0) / (y >>> 0)) | 0; }
        else if (b === 22) { if (y === 0) return t(4); r = ((x >>> 0) % (y >>> 0)) | 0; }
        else if (b === 24) r = x & y;
        else if (b === 25) r = x | y;
        else if (b === 26) r = x ^ y;
        else if (b === 28) r = x << y;
        else if (b === 29) r = x >> y;
        else if (b === 30) r = (x >>> y) | 0;
        else if (b === 32) r = x === y ? 1 : 0;
        else if (b === 33) r = x < y ? 1 : 0;
        else r = (x >>> 0) < (y >>> 0) ? 1 : 0;
        s -= 2;
        D[s++] = r;
        break;
      }
    }
  }
}
for (const id of readdirSync(I).sort()) {
  const r = run(new Uint8Array(readFileSync(join(I, id, 'program.bin'))), new Uint8Array(readFileSync(join(I, id, 'input.bin'))));
  mkdirSync(join(O, id), { recursive: true });
  writeFileSync(join(O, id, 'stdout.bin'), r.o);
  writeFileSync(join(O, id, 'exit.txt'), `${r.e}\n`);
}
