// api/tradier.js
// Vercel serverless function that proxies Tradier API calls
// Keeps your API key safe on the server, solves CORS for the browser

export default async function handler(req, res) {
// Allow requests from anywhere (your Claude dashboard)
res.setHeader(“Access-Control-Allow-Origin”, “*”);
res.setHeader(“Access-Control-Allow-Methods”, “GET, OPTIONS”);
res.setHeader(“Access-Control-Allow-Headers”, “Content-Type”);

// Handle preflight
if (req.method === “OPTIONS”) {
return res.status(200).end();
}

const { path } = req.query;

if (!path) {
return res.status(400).json({ error: “Missing path parameter” });
}

// Build Tradier URL from the path param
// e.g. /api/tradier?path=/markets/quotes%3Fsymbols%3DMETA
const tradierUrl = `https://api.tradier.com/v1${decodeURIComponent(path)}`;

try {
const tradierRes = await fetch(tradierUrl, {
headers: {
Authorization: `Bearer ${process.env.TRADIER_TOKEN}`,
Accept: “application/json”,
},
});

```
if (!tradierRes.ok) {
  return res.status(tradierRes.status).json({
    error: `Tradier returned ${tradierRes.status}`,
  });
}

const data = await tradierRes.json();
return res.status(200).json(data);
```

} catch (err) {
return res.status(500).json({ error: err.message });
}
}
