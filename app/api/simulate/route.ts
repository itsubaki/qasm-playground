import { type NextRequest } from "next/server"
import { apiCall, Path, Key } from "@/lib/api"

export async function POST(req: NextRequest) {
  return apiCall(req, Path.Simulate, Key.Code)
}
