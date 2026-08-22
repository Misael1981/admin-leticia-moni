import PageHeader from "@/components/PageHeader"
import AddUsersButton from "./components/AddUsersButton"
import { getCountUsers, getUsers } from "@/data/get-users-queries"
import { Prisma } from "@misael1981/physio-database"
import { UserRole } from "@/constants/enums"
import UserFilters from "./components/UserFilters"
import { Suspense } from "react"
import EmptyData from "@/components/EmptyData"
import { User } from "lucide-react"
import CardUser from "./components/CardUser"
import PaginationComponent from "@/components/PaginationComponent"

interface UsersPageProps {
  searchParams: Promise<{
    role?: string
    search?: string
    page?: string
  }>
}

const ITEMS_PER_PAGE = 10

export default async function UsersPage({ searchParams }: UsersPageProps) {
  const params = await searchParams

  const currentRole = params.role
  const searchQuery = params.search || ""
  const currentPage = Number(params.page) || 1

  const whereClause: Prisma.UserWhereInput = {}

  // Ajustado para bater com o "TODOS" em caixa alta do UserFilters
  if (currentRole && currentRole.toUpperCase() !== "TODOS") {
    whereClause.role = currentRole as UserRole
  }

  if (searchQuery) {
    whereClause.OR = [
      { name: { contains: searchQuery, mode: "insensitive" } },
      { email: { contains: searchQuery, mode: "insensitive" } },
    ]
  }

  const [users, totalUsers] = await Promise.all([
    getUsers({ whereClause, currentPage, ITEMS_PER_PAGE }),
    getCountUsers({ whereClause }),
  ])

  const totalPages = Math.ceil(totalUsers / ITEMS_PER_PAGE)

  return (
    <div className="space-y-6">
      <PageHeader title="Gerencie os Usuários do Sistema" />

      <AddUsersButton />

      <Suspense
        fallback={
          <div className="h-10 w-full animate-pulse rounded-md bg-slate-100" />
        }
      >
        <UserFilters />
      </Suspense>

      <div>
        <p className="text-muted-foreground mb-4 text-sm">
          Mostrando {users.length} de {totalUsers} usuários encontrados.
        </p>

        {users.length === 0 ? (
          <EmptyData
            icon={User}
            title="Nenhum Usuário Encontrado"
            description="Cadastre o primeiro usuário com esse perfil de acesso ou limpe os filtros."
          />
        ) : (
          <ul className="flex w-full flex-col items-center justify-center gap-4 divide-y">
            {users.map((user) => (
              <li key={user.id} className="w-full max-w-4xl pt-4 first:pt-0">
                <CardUser user={user} />
              </li>
            ))}
          </ul>
        )}
      </div>

      {totalPages > 1 && (
        <PaginationComponent
          currentPage={currentPage}
          totalPages={totalPages}
        />
      )}
    </div>
  )
}
