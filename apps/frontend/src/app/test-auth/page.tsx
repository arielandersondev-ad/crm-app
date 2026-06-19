import { AuthTest } from "@/features/auth/components/auth-test";

export default function Page() {
  return (
    <main className="p-8">
      <h1 className="mb-4 text-2xl font-bold">
        Test Auth
      </h1>
      <AuthTest />
    </main>
  )
}