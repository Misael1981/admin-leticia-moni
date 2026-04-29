import { prisma } from "@misael1981/physio-database"

async function main() {
  const user = await prisma.user.upsert({
    where: { email: "misaelborges1981@gmail.com" }, // ← troca pelo seu email do Google
    update: {},
    create: {
      name: "Misael Borges",
      email: "misaelborges1981@gmail.com", // ← troca pelo seu email do Google
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
