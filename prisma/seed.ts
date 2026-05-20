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

  const user2 = await prisma.user.upsert({
    where: { email: "leticiamoni.fisioterapia@gmail.com" }, // Coloca o e-mail dela aqui
    update: {},
    create: {
      name: "Letícia Moni",
      email: "leticiamoni.fisioterapia@gmail.com",
      role: "OWNER",
    },
  })

  console.log("✅ Usuários garantidos no banco:", { user, user2 })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
