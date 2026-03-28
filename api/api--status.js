module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(204).end();

  try {
    const falUrl = req.query.fal_url;
    if (!falUrl) return res.status(400).json({ error: "fal_url is required" });

    const FAL_KEY = process.env.FAL_KEY;
    if (!FAL_KEY) return res.status(500).json({ error: "FAL_KEY not configured" });

    const response = await fetch(falUrl, {
      headers: { "Authorization": "Key " + FAL_KEY }
    });

    if (!response.ok) {
      const errText = await response.text();
      return res.status(200).json({ error: "Status check failed", detail: errText, status: "CHECKING" });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (err) {
    console.error("status error:", err);
    return res.status(500).json({ error: err.message });
  }
};
