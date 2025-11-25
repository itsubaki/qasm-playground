"use client"

import Playground from "@/app/page"
import { useParams } from "next/navigation"

export default function EditPage() {
  const params = useParams<{ id: string }>()
  return <Playground snippetId={params.id} />
}
