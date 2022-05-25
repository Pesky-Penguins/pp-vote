import Image from 'next/image';
import Toolbar from '../components/Toolbar.js';

export default function Home() {
  return (
    <div className="flex flex-col">
      <Toolbar className="relative" />
      <h1 className="text-5xl">noot noot</h1>
    </div>
  );
}
