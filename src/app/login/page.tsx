import Link from "next/link";
import { AuthForm } from "@/components/auth-form";

export default function LoginPage() {
  return (
    <main>
      <div className="form-wrap">
        <div className="eyebrow">OSA ID</div>
        <h2>Enter the Vault.</h2>
        <AuthForm mode="login" />
        <p>New Founder? <Link href="/register">Create OSA ID</Link></p>
      </div>
    </main>
  );
}
