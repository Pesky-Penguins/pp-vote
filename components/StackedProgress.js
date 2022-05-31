export default function StackedProgress({ className, options, counts }) {
  const total = counts.reduce((acc, c) => acc + c);
  const results = options.map((o, i) => ({ ...o, count: counts[i] }));

  return (
    <div className={className}>
      <div className="relative pt-1 w-full">
        <div
          className={`overflow-hidden h-2 mb-4 text-xs flex rounded ${
            results[results.length - 1].classes
          }`}
        >
          {results.slice(0, -1).map((r, index) => (
            <div
              key={`${index}-${r.count}`}
              style={{ width: `${(r.count / total) * 100}%` }}
              className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${r.classes}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
