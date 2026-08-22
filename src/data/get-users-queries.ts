import { db } from "@/lib/prisma"
import { Prisma } from "@misael1981/physio-database"

interface GetUsersProps {
  whereClause?: Prisma.UserWhereInput
  currentPage: number
  ITEMS_PER_PAGE: number
}

export type UserType = Prisma.UserGetPayload<{
  select: {
    name: true
    id: true
    phone: true
    email: true
    createdAt: true
    updatedAt: true
    clinicId: true
    emailVerified: true
    image: true
    password: true
    role: true
  }
}>

export async function getUsers({
  whereClause,
  currentPage,
  ITEMS_PER_PAGE,
}: GetUsersProps): Promise<UserType[]> {
  try {
    const users = await db.user.findMany({
      where: whereClause,
      orderBy: { name: "asc" },
      skip: (currentPage - 1) * ITEMS_PER_PAGE,
      take: ITEMS_PER_PAGE,
      select: {
        name: true,
        id: true,
        phone: true,
        email: true,
        createdAt: true,
        updatedAt: true,
        clinicId: true,
        emailVerified: true,
        image: true,
        password: true,
        role: true,
      },
    })

    return users
  } catch (error) {
    console.error("Erro ao buscar usuários:", error)
    throw new Error("Não foi possível carregar os usuários.")
  }
}

interface GetCountUsersProps {
  whereClause?: Prisma.UserWhereInput
}

export async function getCountUsers({
  whereClause,
}: GetCountUsersProps): Promise<number> {
  try {
    const totalUsers = db.user.count({
      where: whereClause,
    })

    return totalUsers
  } catch (error) {
    console.error("Erro ao buscar total de usuários:", error)
    throw new Error("Não foi possível carregar total de usuários.")
  }
}
