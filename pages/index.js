import { useEffect } from "react";
import { supabase } from "../client";
import { useRouter } from "next/router";

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "github",
    });

    if (error) {
      console.error("Error during login:", error.message);
    }
  };

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        router.push("/tasks");
      }
    });
    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <button onClick={handleLogin} className="bg-gray-800 text-white px-6 py-3 rounded">
        Login with GitHub
      </button>
    </div>
  );
}
