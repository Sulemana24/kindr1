interface Props {
  donated: number;
  target: number;
}

export default function ProgressBar({ donated, target }: Props) {
  const percentage = Math.min((donated / target) * 100, 100);

  return (
    <div>
      <div className="w-full bg-gray-200 rounded-full h-4">
        <div
          className="bg-pink-600 h-4 rounded-full"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <p className="mt-2 text-sm text-gray-500">
        ₵{donated} raised of ₵{target}
      </p>
    </div>
  );
}
