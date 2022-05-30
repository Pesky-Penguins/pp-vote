export function toU64Le(n) {
  const a = [];
  a.unshift(n & 255);
  while (n >= 256) {
    n = n >>> 8;
    a.unshift(n & 255);
  }
  for (let i = a.length; i < 8; i++) {
    a.push(0);
  }
  return new Uint8Array(a);
}

export function getPubkeyShorthand(publicKey) {
  if (!(publicKey && publicKey.toBase58)) {
    return '';
  }
  const s = publicKey.toBase58();
  return [s.slice(0, 4), s.slice(-4)];
}
