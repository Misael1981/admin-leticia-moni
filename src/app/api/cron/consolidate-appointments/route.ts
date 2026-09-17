import { consolidateDailyAppointments } from "@/app/action/consolidate-daily-appointments"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization")
  if (
    process.env.CRON_SECRET &&
    authHeader !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  const result = await consolidateDailyAppointments()
  return NextResponse.json(result)
}
