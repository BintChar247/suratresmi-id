'use client';

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}): JSX.Element {
  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold">Terjadi Kesalahan</h2>
        <p className="text-gray-600">Maaf, terjadi kesalahan yang tidak terduga.</p>
        <button
          onClick={reset}
          className="bg-primary-500 text-white px-4 py-2 rounded hover:bg-primary-600 transition-colors"
        >
          Coba Lagi
        </button>
      </div>
    </div>
  );
}
