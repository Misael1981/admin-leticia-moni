import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import Image from "next/image"
import { authOptions } from "@/lib/auth"
import { Suspense } from "react"
import RightSideContent from "./components/RightSideContent"

export default async function LoginPage() {
  const session = await getServerSession(authOptions)

  if (session) redirect("/dashboard")

  return (
    <main className="flex min-h-screen flex-col lg:flex-row">
      <Suspense>
        {/* Lado esquerdo */}
        <div className="flex flex-col justify-between bg-[#1B3D54] p-6 lg:p-12">
          <div className="flex items-center gap-3">
            <Image src="/logo.svg" alt="Logo" width={40} height={40} />
            <span className="font-serif text-xl text-[#EFE9CE]">
              Letícia Moni Fisioterapia
            </span>
          </div>
          <div>
            <h1 className="mb-4 font-serif text-5xl leading-tight font-light text-[#EFE9CE]">
              Gestão que
              <br />
              <span className="text-[#C2AB9F]">cuida</span> de
              <br />
              quem cuida.
            </h1>
            <p className="text-sm font-light text-[#EFE9CE]/50">
              Plataforma administrativa para fisioterapeutas e sua equipe.
            </p>
          </div>
          <div className="flex gap-2">
            <div className="h-1.5 w-5 rounded-full bg-[#C2AB9F]" />
            <div className="h-1.5 w-1.5 rounded-full bg-[#C2AB9F]/30" />
            <div className="h-1.5 w-1.5 rounded-full bg-[#C2AB9F]/30" />
          </div>
        </div>

        {/* Lado direito */}
        <RightSideContent />
      </Suspense>
    </main>
  )
}
