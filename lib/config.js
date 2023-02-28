const solNetwork = process.env.NEXT_PUBLIC_SOL_NETWORK || 'devnet';

const networkUris = {
  'mainnet-beta': process.env.NEXT_PUBLIC_RPC_NODES
    ? JSON.parse(process.env.NEXT_PUBLIC_RPC_NODES)
    : ['https://api.mainnet-beta.solana.com'],
  mainnet: process.env.NEXT_PUBLIC_RPC_NODES
    ? JSON.parse(process.env.NEXT_PUBLIC_RPC_NODES)
    : ['https://api.mainnet-beta.solana.com'],
  devnet: process.env.NEXT_PUBLIC_RPC_NODES
    ? JSON.parse(process.env.NEXT_PUBLIC_RPC_NODES)
    : ['https://api.devnet.solana.com'],
};

const config = {
  networkUris,
  solNetwork,
};

config.isDevnet = config.solNetwork === 'devnet';

export default config;

export function getRandomNode() {
  const nodes = networkUris[config.solNetwork] || networkUris.devnet;
  return nodes[Math.floor(Math.random() * nodes.length)];
}
