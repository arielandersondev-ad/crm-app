'use client'
import { useAuthStore } from "@/stores/auth.store";
import { useLogin } from "../api/use-login";

export function AuthTest() {

  const loginMutation = useLogin()

  const user = useAuthStore((state) => state.user)
  const tenant = useAuthStore((state) => state.tenant)
  const branch = useAuthStore((state) => state.branch)

  const handleLogin = () => {
    loginMutation.mutate({
      email: "test@mail.com",
      password: "test",
    })
    console.log("Login Test")

  }
  return (
    <div className="space-y-4">
      <button
        onClick={handleLogin}
        className="rounded bg-black px-4 py-2 text-white"
      >
        Login Test
      </button>
      <pre>
        {JSON.stringify({
          user,
          tenant,
          branch,
        },
        null,
        2,
        )}
      </pre>
    </div>
  );
}