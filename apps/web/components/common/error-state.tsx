interface ErrorStateProps {
  message: string;
}

export function ErrorState({
  message,
}: ErrorStateProps) {
  return (
    <div className="border border-red-200 bg-red-50 rounded-xl p-6">
      <p className="text-red-700">
        {message}
      </p>
    </div>
  );
}