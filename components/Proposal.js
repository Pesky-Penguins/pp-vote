import { useEffect, useMemo } from 'react';

import { useRecoilValue } from 'recoil';
import { votesState, voteDataState } from '@/lib/state.js';

import Ballot from '@/components/Ballot.js';
import CountdownTimer from '@/components/CountdownTimer.js';
import Markdown from '@/components/Markdown';

export default function Proposal({ id, info }) {
  const votes = useRecoilValue(votesState);
  const voteData = useRecoilValue(voteDataState);
  const { title, active, ballot, description, endDate, options } = info;

  if (!active) {
    return null;
  }

  return (
    <div className="flex flex-col">
      <h1 className="text-3xl md:text-4xl text-center font-bold">{title}</h1>
      <div className="text-center my-4">
        <CountdownTimer endDate={endDate} />
      </div>
      <div className="flex w-full items-center justify-center text-center my-4">
        <Ballot id={id} ballot={ballot} options={options} endDate={endDate} />
      </div>
      <div className="my-4 space-y-4">
        {description.map((d) => (
          <Markdown className="py-2" key={d.slice(5, 10)}>
            {d}
          </Markdown>
        ))}
      </div>
    </div>
  );
}
