import { signIn } from "@/auth/authSetup";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center py-12 px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
            Hesabınıza Giriş Yapın
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Etkinlikleri keşfetmek ve katılmak için giriş yapın
          </p>
        </div>
        
        <div className="mt-8 space-y-6">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border">
            <form
              action={async () => {
                "use server";
                await signIn("google", { redirectTo: "/" });
              }}
              className="space-y-6"
            >
              <Button 
                type="submit" 
                className="w-full flex justify-center py-6 text-lg"
                variant="outline"
              >
                <svg className="mr-2 h-6 w-6" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                  <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
                </svg>
                Google ile Giriş Yap
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}