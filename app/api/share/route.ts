import { type NextRequest } from "next/server"
import { request, Path, Key } from "@/lib/api"

export async function POST(req: NextRequest) {
  return request(req, Path.Share, Key.Code)
}
