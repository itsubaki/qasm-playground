import { type NextRequest } from "next/server"
import { apiCall, API } from "@/lib/api"

export async function POST(req: NextRequest) {
  return apiCall(req, API.Simulate)
}
