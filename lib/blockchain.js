export function getPubkeyShorthand(publicKey) {
  if (!(publicKey && publicKey.toBase58)) {
    return '';
  }
  const s = publicKey.toBase58();
  return [s.slice(0, 4), s.slice(-4)];
}
