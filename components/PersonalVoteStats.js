import { useMemo } from 'react';

export default function PersonalVoteStats({ className, id, myVotes, remainingVotes }) {
  const inFavor = useMemo(() => myVotes[id][1] || [], [myVotes, id]);
  const opposed = useMemo(() => myVotes[id][0] || [], [myVotes, id]);
  const totalVotes = useMemo(() => inFavor.length + opposed.length, [inFavor, opposed]);

  return (
    <div className={className}>
      <div className="flex flex-col w-full font-light">
        {remainingVotes[id]?.length > 0 && (
          <p className="text-lg">
            You have <span className="font-mono">{remainingVotes[id].length}</span> eligible
            Penguins.
          </p>
        )}
        {(inFavor.length > 0 || opposed.length > 0) && (
          <p className="text-lg">
            <span className="font-mono">{totalVotes}</span> of your Penguins have{' '}
            <span className="font-bold">already voted.</span>
          </p>
        )}
      </div>
    </div>
  );
}
