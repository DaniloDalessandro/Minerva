import { LoginForm } from "@/components/login-form"

export default function LoginPage() {
  return (
    <div className="min-h-svh bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <LoginForm />
      </div>
    </div>
  )
}
