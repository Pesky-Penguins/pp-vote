import Link from 'next/link';

const LINKS = {
  Home: 'https://pesky-penguins.com',
  Blog: 'https://blog.pesky-penguins.com',
  Nootopia: 'https://nootopia.pesky-penguins.com',
  Twitter: 'https://twitter.com/peskypenguins',
};

export default function Footer() {
  return (
    <div className="flex flex-col w-full px-8 mb-4 justify-center items-center">
      <div className="divider" />
      <div className="flex justify-around max-w-screen-md w-full">
        {Object.entries(LINKS).map(([name, link]) => (
          <div key={link} className="cursor-pointer hover:text-blue-700">
            <Link href={link} target="_blank" rel="noreferrer">
              <p className="font-lucky text-xl underline">{name}</p>
            </Link>
          </div>
        ))}
      </div>
      <div className="hidden  bg-error btn-error bg-success btn-success" />
    </div>
  );
}
