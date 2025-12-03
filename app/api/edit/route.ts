import { type NextRequest } from "next/server"
import { edit } from "@/lib/api"

export async function POST(req: NextRequest) {
  return edit(req)
}
