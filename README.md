## PeskyVote
This is a [Next.js](https://nextjs.org/) project that has been augmented to work on the Solana blockchain and styled with [ TailwindCSS ](https://tailwindcss.com) and [ DaisyUI ](https://daisyui.com).

Proposal information is stored in `public/proposals/`, and all votes are stored on the Blockchain.

## Getting Started

First, `npm install` to download all dependencies.

To run on devnet, simply

```bash
npm start
```

If you want to run on mainnet, you must set the `NEXT_PUBLIC_SOL_NETWORK` environment variable, like so:

```bash
NEXT_PUBLIC_SOL_NETWORK=mainnet-beta npm start
```

Open [http://localhost:3000](http://localhost:3000) with your browser, and you'll be online!

## Creating Proposals
This application uses a slightly modified version of [solana-daovote](https://github.com/Flawm/solana-daovote).
By "slightly modified," I mean maybe a 4 line delta to look for our Update Authority in a different position in the creators array.

Collections whose update authority is position 0 of the creators array should use the solana-daovote program, and those whose update authority is in position 1 are welcome to use the PeskyVote spl program.

+ **Update auth in pos 0:** `Daovoteq2Y28gJyme6TNUXT9TxXrePiouFuHezkiozci`
+ **Update auth in pos 1:** `pVote9oe2CcmLxQTNHbF1eLQTQXNkh5XLNPR9ZuQjBf`

Once you've decided which program to use, you can follow the instructions on the [`solana-daovote` README](https://github.com/Flawm/solana-daovote/tree/main/dao-vote) to create proposals on-chain.

To create our proposal, we ran the following command (in our forked repo):

```bash
npm run create -- HLMv2cTyTYD8JJbqbgZ9Yuv3BG9mw98utiQQW7EV1kLx 1 pEsKYABNARLiDFYrjbjHDieD5h6gHrvYf9Vru62NX9k 1
```

**Explanation:**

+ Pesky Penguin `HLMv2cTyTYD8JJbqbgZ9Yuv3BG9mw98utiQQW7EV1kLx` submitted the proposal
+ The proposal is number 1
+ The update authority for the collection is `pEsKYABNARLiDFYrjbjHDieD5h6gHrvYf9Vru62NX9k`
+ Placeholder data

PeskyVote does not use the final argument in the create command; we store our proposals on GitHub rather than on-chain.
This streamlines the user experience while still allowing for a distributed history of all proposals.

## Important files
+ Please set your constants in `lib/constants.js`
+ Please set your RPC endpoints in `lib/config.js`
+ Please add your proposals to `public/proposals/`
+ Please designate valid proposals in `components/VoteProvider.js`
+ Please add your NFT metadata in the `data/` folder, and add the references to it in `pages/api/`

Et voila, you have on-chain voting!
