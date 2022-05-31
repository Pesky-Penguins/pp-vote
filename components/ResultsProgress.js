import { useMemo } from 'react';
import StackedProgress from './StackedProgress.js';

export const ALIVE_PENGUINS = 8447; // TODO move back to BAllot

export default function ResultsProgress({ className, proposalId, votes, results, options }) {
  const counts = useMemo(
    () => options.map((_, i) => results[proposalId][i] || 0),
    [results, proposalId, options]
  );

  return (
    <div className={className}>
      <div className="flex flex-col w-full">
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