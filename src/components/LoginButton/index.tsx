"use client"

import { signIn } from "next-auth/react"
import { FcGoogle } from "react-icons/fc"

const LoginButton = () => {
  return (
    <button
      onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
      className="flex w-full items-center justify-center gap-3 rounded-xl bg-[#1B3D54] px-6 py-3.5 text-sm text-[#EFE9CE] transition-colors hover:bg-[#15303f]"
    >
      <FcGoogle size={20} />
      Entrar com Google
    </button>
  )
}

export default LoginButton
