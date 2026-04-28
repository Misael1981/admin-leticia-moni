import { prisma } from "@misael1981/physio-database";

export default async function Home() {
  const patients = await prisma.patient.findMany();
  console.log(patients);

  return (
    <>
      <h1>Leticia Moni</h1>
    </>
  );
}
