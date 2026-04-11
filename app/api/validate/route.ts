import { type NextRequest } from "next/server"
import { validate } from "@/lib/api"

export async function POST(req: NextRequest) {
    return validate(req)
}
