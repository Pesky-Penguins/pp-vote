import { Connection, PublicKey } from '@solana/web3.js';
import { Metadata } from '@metaplex-foundation/mpl-token-metadata';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';

import config from './config.js';
const { isDevnet } = config;

export async function getMetadataForMint(tokenAddress) {
  try {
    const response = await fetch(`/api/penguins?noot=${tokenAddress}&isDevnet=${isDevnet}`);
    return await response.json();
  } catch (e) {}
  return null;
}

export async function retrieveStorageDataForUrl(uri) {
  try {
    const response = await fetch(uri);
    return await response.json();
  } catch (e) {
    console.error(e);
  }

  return null;
}

export async function getNFTsForWallet(connection, walletAddress, verifiedCreatorAddress) {
  const response = await connection.getParsedTokenAccountsByOwner(walletAddress, {
    programId: TOKEN_PROGRAM_ID,
  });

  // console.log('responses', response);

  const mints = await Promise.all(
    response.value
      .filter(
        (accInfo) =>
          accInfo.account.data.parsed.info.tokenAmount.uiAmount == 1 &&
          accInfo.account.data.parsed.info.tokenAmount.decimals == 0
      )
      .map((accInfo) => getMetadataForMint(accInfo.account.data.parsed.info.mint))
  );

  const filteredMints = mints.filter((mint) => {
    return mint?.properties?.creators?.find(
      (creator) => creator.address === verifiedCreatorAddress
    );
  });

  return filteredMints;
}
