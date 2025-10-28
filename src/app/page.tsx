import { redirect } from "next/navigation";

export default function Home() {
  // Home siempre manda al login
  redirect("/auth/signin");
}
