import { ClaimForm } from "@/components/claim-form";

export default function ClaimPage() {
  return (
    <main>
      <div className="form-wrap">
        <div className="eyebrow">The gate opens once</div>
        <h2>Claim Genesis.</h2>
        <p>Sign in with your OSA ID, then bind one unclaimed Genesis Pass permanently to your account.</p>
        <ClaimForm />
      </div>
    </main>
  );
}
