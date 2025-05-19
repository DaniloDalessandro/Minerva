import { GalleryVerticalEnd } from "lucide-react"
import { LoginForm } from "@/components/login-form"

export default function LoginPage() {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Imagem de fundo como marca d'água */}
      <img
        src="/img-login/login1.png"
        alt="Marca d'água"
        className="absolute inset-0 w-full h-full object-cover opacity-60 z-0"
      />

      {/* Conteúdo sobreposto */}
      <div className="relative z-10 w-full max-w-md p-6 md:p-10 bg-background/90 backdrop-blur-sm rounded-lg shadow-lg">
        {/* Logotipo */}
        <div className="mb-6 flex items-center gap-2 justify-center">
          <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
            <GalleryVerticalEnd className="size-4" />
          </div>
          <span className="text-lg font-semibold">Minerva</span>
        </div>

        {/* Formulário */}
        <LoginForm />
      </div>
    </div>
  )
}
