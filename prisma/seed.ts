import { prisma } from "@misael1981/physio-database"

async function main() {
  const user = await prisma.user.upsert({
    where: { email: "misaelborges1981@gmail.com" },
    update: {},
    create: {
      name: "Misael Borges",
      email: "misaelborges1981@gmail.com",
      role: "ADMIN",
    },
  })

  console.log("✅ Usuário criado:", user)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
