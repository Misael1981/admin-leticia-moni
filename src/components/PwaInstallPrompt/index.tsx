"use client"

import { useEffect, useState } from "react"

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{
    outcome: "accepted" | "dismissed"
    platform: string
  }>
}

export function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null)
  const [showPrompt, setShowPrompt] = useState(false)

  useEffect(() => {
    const handler = (e: Event) => {
      const beforeInstallPromptEvent = e as BeforeInstallPromptEvent
      beforeInstallPromptEvent.preventDefault()
      setDeferredPrompt(beforeInstallPromptEvent)
      setShowPrompt(true)
    }

    window.addEventListener("beforeinstallprompt", handler)

    return () => window.removeEventListener("beforeinstallprompt", handler)
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return
    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === "accepted") {
      setDeferredPrompt(null)
      setShowPrompt(false)
    }
  }

  if (!showPrompt) return null

  return (
    <div className="animate-bounce-short fixed right-4 bottom-4 left-4 z-50 flex items-center justify-between rounded-2xl bg-[#1b3d54] p-4 text-white shadow-xl">
      <div className="flex items-center space-x-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#ebe5cc] font-bold text-[#1b3d54]">
          MF
        </div>
        <div>
          <p className="text-sm font-semibold">Instalar App Moni Fisio</p>
          <p className="text-xs text-[#ebe5cc]/80">
            Acesse suas sessões com 1 toque
          </p>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <button
          onClick={() => setShowPrompt(false)}
          className="px-2 py-1 text-xs text-white/70"
        >
          Agora não
        </button>
        <button
          onClick={handleInstallClick}
          className="rounded-xl bg-[#ebe5cc] px-3 py-1.5 text-xs font-semibold text-[#1b3d54]"
        >
          Instalar
        </button>
      </div>
    </div>
  )
}
