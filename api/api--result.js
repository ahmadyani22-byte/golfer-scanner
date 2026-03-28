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

    const bodyText = await response.text();
    var bodyJson;
    try { bodyJson = JSON.parse(bodyText); } catch (e) { bodyJson = { raw: bodyText }; }

    if (!response.ok) {
      var detail = bodyJson.detail || bodyJson.message || bodyText.substring(0, 300);
      if (typeof detail === "object") detail = JSON.stringify(detail);
      return res.status(200).json({ fal_error: true, fal_status: response.status, detail: detail });
    }

    return res.status(200).json(bodyJson);
  } catch (err) {
    console.error("result error:", err);
    return res.status(500).json({ error: err.message });
  }
};
