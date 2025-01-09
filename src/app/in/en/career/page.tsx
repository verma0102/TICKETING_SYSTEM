import type { Metadata } from "next"
import Career from "./career"
export const metadata: Metadata = {
  title: "Career"
}
export default function Page() {
  return (
    <Career />
  )
}
