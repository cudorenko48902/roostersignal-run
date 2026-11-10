import * as fs from 'fs';
import * as path from 'path';
import * as economy from '../src/game/economy';

const SRC = path.join(__dirname, '..', 'src');

function walk(dir: string, out: string[] = []): string[] {
  const names = fs.readdirSync(dir);
  for (let i = 0; i < names.length; i++) {
    const full = path.join(dir, names[i]);
    if (fs.statSync(full).isDirectory()) {
      walk(full, out);
    } else if (/\.tsx?$/.test(names[i])) {
      out.push(full);
    }
  }
  return out;
}

describe('no real-money gameplay and no network', () => {
  it('exposes no price, purchase, ad or cash-out API', () => {
    const api = Object.keys(economy).map(k => k.toLowerCase());
    expect(api.join(' ')).toContain('feathers');
    const banned = ['price', 'purchase', 'buy', 'iap', 'cashout', 'ad'];
    for (let i = 0; i < banned.length; i++) {
      expect(api.indexOf(banned[i])).toBe(-1);
    }
  });

  it('keeps feathers a non-negative integer counter', () => {
    expect(economy.addFeathers(0, 10)).toBe(10);
    expect(economy.addFeathers(10, -50)).toBe(10);
    expect(economy.formatFeathers(1240)).toBe('1,240');
  });

  it('contains no network call anywhere in the source tree', () => {
    const offenders: string[] = [];
    const files = walk(SRC);
    const network = /(\bfetch\s*\()|XMLHttpRequest|WebSocket|https?:\/\/[a-z]/i;
    for (let i = 0; i < files.length; i++) {
      if (network.test(fs.readFileSync(files[i], 'utf8'))) {
        offenders.push(files[i]);
      }
    }
    expect(offenders).toEqual([]);
  });
});
