import { useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import { nftsState } from '../lib/state.js';

export default function PersonalVoteStats({ className, id, myVotes, remainingVotes }) {
  const nfts = useRecoilValue(nftsState);
  const votesCast = useMemo(
    () => (nfts?.length || 0) - (remainingVotes[id]?.length || 0),
    [nfts, remainingVotes, id]
  );

  return (
    <div className={className}>
      <div className="flex flex-col w-full font-light">
        {remainingVotes[id]?.length > 0 && (
          <p className="text-lg">
            Voting will cast <span className="font-mono">{remainingVotes[id].length}</span> ballots:
            one for each eligible Penguin in this wallet.
          </p>
        )}
        {(remainingVotes[id]?.length || 0) < (nfts?.length || 0) && (
          <p className="text-lg">
            <span className="font-mono">{votesCast}</span> of your Penguins{' '}
            {votesCast === 1 ? 'has' : 'have'} <span className="font-bold">already voted.</span>
          </p>
        )}
      </div>
    </div>
  );
}
