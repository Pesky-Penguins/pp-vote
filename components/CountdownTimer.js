import { useEffect, useMemo, useState } from 'react';
import { parseISO, isPast, formatDistanceToNow } from 'date-fns';

export default function CountdownTimer({ endDate }) {
  const [time, setTime] = useState(0);
  const expires = useMemo(() => parseISO(endDate), [endDate]);

  useEffect(() => {
    const interval = setInterval(() => setTime((prev) => prev + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  if (isPast(expires)) {
    return <p className="text-xl bold font-mono">The voting period has passed</p>;
  }
  const remaining = formatDistanceToNow(expires, { addSuffix: true });
  return (
    <p className="text-xl bold font-mono">
      This vote closes <u>{remaining}</u>
    </p>
  );
}
