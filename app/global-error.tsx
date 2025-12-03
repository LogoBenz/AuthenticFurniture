'use client'

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    return (
        <html>
            <body>
                <div className="flex flex-col items-center justify-center min-h-screen p-4">
                    <h2 className="text-2xl font-bold mb-4">Global Error</h2>
                    <div className="p-4 bg-red-50 border border-red-200 rounded mb-4 max-w-2xl overflow-auto">
                        <p className="text-red-800 font-mono text-sm">{error.message}</p>
                        {error.stack && (
                            <pre className="mt-2 text-xs text-red-600 whitespace-pre-wrap">{error.stack}</pre>
                        )}
                    </div>
                    <button
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        onClick={() => reset()}
                    >
                        Try again
                    </button>
                </div>
            </body>
        </html>
    )
}
