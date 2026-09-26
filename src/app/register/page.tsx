import Link from "next/link";
import { AuthForm } from "@/components/auth-form";

export default function RegisterPage() {
  return (
    <main>
      <div className="form-wrap">
        <div className="eyebrow">OSA ID</div>
        <h2>Create your identity.</h2>
        <AuthForm mode="register" />
        <p>Already registered? <Link href="/login">Sign in</Link></p>
      </div>
    </main>
  );
}
