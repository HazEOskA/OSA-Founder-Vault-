export async function GET() {
  return Response.json({
    ok: true,
    service: "osa-founder-vault",
    version: "0.1.0",
  });
}
