const solNetwork = process.env.NEXT_PUBLIC_SOL_NETWORK || 'devnet';

const networkUris = {
  'mainnet-beta': 'https://peskypenguins.genesysgo.net/',
  mainnet: 'https://peskypenguins.genesysgo.net/',
  devnet: 'https://psytrbhymqlkfrhudd.dev.genesysgo.net:8899/',
};

const config = {
  networkUris,
  solNetwork,
};

config.isDevnet = config.solNetwork === 'devnet';

export default config;
export function getNetworkUri() {
  return networkUris[config.solNetwork] || networkUris.devnet;
}
