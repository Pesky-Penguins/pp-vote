import mainnetPenguins from '../../data/tokenMetadataV5.json';
import devnetPenguins from '../../data/devnetPenguins.json';

export default async function handler(req, res) {
  const { query } = req;
  const { noot, isDevnet } = query;

  const penguin =
    isDevnet === 'true' ? devnetPenguins.find((p) => p.tokenId === noot) : mainnetPenguins[noot];

  res.status(200).json(penguin);
}
