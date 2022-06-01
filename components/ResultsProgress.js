import { useMemo } from 'react';
import StackedProgress from './StackedProgress.js';

export const ALIVE_PENGUINS = 8447;

export default function ResultsProgress({ className, proposalId, votes, results, options }) {
  const counts = useMemo(
    () =>
      options.map((_, i) => {
        try {
          return results[proposalId][i] || 0;
        } catch (err) {}

        return 0;
      }),
    [results, proposalId, options]
  );

  const totalVotes = useMemo(() => counts.reduce((acc, c) => acc + c), [counts]);

  return (
    <div className={className}>
      <div className="flex flex-col w-full">
        <p className="mb-4 text-xl font-light">
          <span className="font-mono">{totalVotes}</span> <span className="">Votes</span> (
          <span className="font-mono">{((totalVotes / ALIVE_PENGUINS) * 100).toFixed(1)}</span>% of
          Penguins)
        </p>
        <StackedProgress className="" options={options} counts={counts} />
        <div className="flex justify-between w-full text-lg">
          {options.map((o, i) => (
            <div key={o.text} className="flex flex-col items-center justify-center text-center">
              <p className="">{o.text}</p>
              <p className="hidden md:flex font-mono w-full text-center">
                {counts[i]} ({((counts[i] / votes.length) * 100).toFixed(1)}%)
              </p>
              <p className="flex md:hidden font-mono w-full text-center">
                {((counts[i] / votes.length) * 100).toFixed(1)}%
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
