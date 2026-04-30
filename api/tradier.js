// api/tradier.js
const https = require(“https”);

module.exports = async function handler(req, res) {
res.setHeader(“Access-Control-Allow-Origin”, “*”);
res.setHeader(“Access-Control-Allow-Methods”, “GET, OPTIONS”);
res.setHeader(“Access-Control-Allow-Headers”, “Content-Type, Authorization”);

if (req.method === “OPTIONS”) return res.status(200).end();

const { path } = req.query;
if (!path) return res.status(400).json({ error: “Missing path parameter” });

const token = process.env.TRADIER_TOKEN;
if (!token) return res.status(500).json({ error: “TRADIER_TOKEN not configured” });

const decodedPath = decodeURIComponent(path);
const fullUrl = `https://api.tradier.com/v1${decodedPath}`;

try {
const response = await fetch(fullUrl, {
method: “GET”,
headers: {
“Authorization”: `Bearer ${token}`,
“Accept”: “application/json”,
},
});

```
const data = await response.json();
return res.status(200).json(data);
```

} catch (err) {
return res.status(500).json({ error: err.message, token_present: !!token });
}
};
