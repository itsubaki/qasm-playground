import { type NextRequest } from "next/server"
import { simulate } from "@/lib/api"

export async function POST(req: NextRequest) {
  return simulate(req)
}
