import { getAllUser } from "../lib/api"

export function GET() {
    const users = getAllUser()
    return Response.json({ users })
}

