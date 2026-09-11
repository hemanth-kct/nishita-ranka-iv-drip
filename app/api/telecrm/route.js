export async function POST(req) {
  const api =
    "https://next-api.telecrm.in/enterprise/6a7070857da9006794fa126c/autoupdatelead";
  const token = process.env.TELECRM_TOKEN;

  if (!token) {
    console.error("TELECRM_TOKEN is not set");
    return Response.json({ error: "TeleCRM not configured" }, { status: 500 });
  }

  const { name, phone, email, area, landing_page_1 } = await req.json();
  const digits = String(phone ?? "").replace(/\D/g, "");
  const phoneWithCountryCode = digits.length === 10 ? `91${digits}` : digits;

  try {
    const response = await fetch(api, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        fields: {
          name,
          phone: phoneWithCountryCode,
          email,
          primary_skin_concernhydra: area,
          landing_page_1,
          lead_source: "Landing Page",
        },
      }),
    });

    const data = await response.text();
    console.log("TeleCRM lead submission response", response.status, data);

    return Response.json({ ok: response.ok }, { status: response.status });
  } catch (error) {
    console.error("Failed to submit lead to TeleCRM", error);
    return Response.json(
      { error: "Failed to submit lead to TeleCRM" },
      { status: 500 },
    );
  }
}
