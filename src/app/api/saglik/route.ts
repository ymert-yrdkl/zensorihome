// Coolify sağlık kontrolü
export const dynamic = "force-dynamic";

export function GET() {
  return Response.json({ durum: "ok", zaman: new Date().toISOString() });
}
