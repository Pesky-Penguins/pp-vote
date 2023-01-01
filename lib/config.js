const solNetwork = process.env.NEXT_PUBLIC_SOL_NETWORK || 'devnet';

const networkUris = {
  'mainnet-beta': process.env.NEXT_PUBLIC_RPC_NODES
    ? JSON.parse(process.env.NEXT_PUBLIC_RPC_NODES)
    : [
        'https://bold-tame-uranium.solana-mainnet.discover.quiknode.pro/7a583b79ddb6d4e5f8c62033ffefe09bd7401ffb/',
      ],
  mainnet: process.env.NEXT_PUBLIC_RPC_NODES
    ? JSON.parse(process.env.NEXT_PUBLIC_RPC_NODES)
    : [
        'https://bold-tame-uranium.solana-mainnet.discover.quiknode.pro/7a583b79ddb6d4e5f8c62033ffefe09bd7401ffb/',
      ],
  devnet: ['https://devnet.genesysgo.net/'],
  //'mainnet-beta': 'https://peskypenguins.genesysgo.net/',
  // devnet: 'https://api.devnet.solana.com',
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
