// app/acesso-negado/page.tsx
export default function AcessoNegadoPage() {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-2">
      <h1 className="text-2xl font-bold">Acesso negado</h1>
      <p className="text-muted-foreground">
        Você não tem permissão para acessar esta área.
      </p>
    </div>
  )
}
