import { type NextRequest } from "next/server"
import { share } from "@/lib/api"

export async function POST(req: NextRequest) {
  return share(req)
}
