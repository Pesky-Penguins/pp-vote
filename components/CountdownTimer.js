import { isPast, formatDistanceToNow } from 'date-fns';

export default function CountdownTimer({ expires }) {
  if (isPast(expires)) {
    return <p className="bold font-mono">The voting period has passed</p>;
  }
  const remaining = formatDistanceToNow(expires, { addSuffix: true });
  return <p className="bold font-mono">The voting period expires {remaining}</p>;
}
