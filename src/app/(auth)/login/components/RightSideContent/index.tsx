import LoginButton from "@/components/LoginButton"

const RightSideContent = () => {
  return (
    <div className="flex flex-1 items-center justify-center bg-[#EFE9CE] p-6 lg:px-12 lg:py-14">
      <div className="flex flex-col justify-center lg:w-120 lg:gap-10">
        <div>
          <h2 className="mb-2 font-serif text-3xl text-[#1B3D54]">
            Bem-vindo de volta
          </h2>
          <p className="mb-10 text-sm text-[#8a7f72]">
            Acesse o painel com sua conta Google autorizada.
          </p>
        </div>
        <div>
          <div className="mb-8 flex items-center gap-3">
            <div className="h-px flex-1 bg-[#1B3D54]/15" />
            <span className="text-[10px] tracking-widest text-[#b0a597] uppercase">
              acesso restrito
            </span>
            <div className="h-px flex-1 bg-[#1B3D54]/15" />
          </div>
          <LoginButton />
          <div className="bg-[#1B3D54]/06 mt-8 rounded-lg p-4 text-xs leading-relaxed text-[#6b6259]">
            <strong className="text-[#1B3D54]">Acesso controlado.</strong>{" "}
            Apenas usuários cadastrados previamente pela administração podem
            entrar.
          </div>
        </div>
      </div>
    </div>
  )
}

export default RightSideContent
