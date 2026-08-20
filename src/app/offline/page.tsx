"use client"

export default function OfflinePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#ebe5cc] p-6 text-center text-[#1b3d54]">
      <div className="w-full max-w-sm rounded-2xl border border-[#1b3d54]/10 bg-white p-8 shadow-lg">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#1b3d54]/10">
          <svg
            className="h-8 w-8 text-[#1b3d54]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M18.364 5.636a9 9 0 010 12.728m-2.829-2.829a5 5 0 010-7.071m-4.243 4.243a1 1 0 11-1.414-1.414 1 1 0 011.414 1.414zM5.636 18.364a9 9 0 010-12.728m2.829 2.829a5 5 0 010 7.071"
            />
          </svg>
        </div>
        <h1 className="mb-2 text-xl font-bold">Você está sem conexão</h1>
        <p className="mb-6 text-sm opacity-80">
          Não conseguimos carregar esta página. Verifique sua conexão de
          internet e tente novamente.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="w-full rounded-xl bg-[#1b3d54] py-3 font-medium text-white transition-colors hover:bg-[#1b3d54]/90"
        >
          Tentar Novamente
        </button>
      </div>
    </main>
  )
}
