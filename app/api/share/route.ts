import { request, Path, Key } from "@/lib/request"
import { type NextRequest } from "next/server"

export async function POST(req: NextRequest) {
  return request(req, Path.Share, Key.Code)
}
