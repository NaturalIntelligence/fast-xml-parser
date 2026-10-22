"use strict";

import { spawnSync } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const cliPath = path.join(__dirname, "../src/cli/cli.js");
const missingPath = path.join(__dirname, "assets/does-not-exist.xml");

function runCli(args, input) {
  return spawnSync(process.execPath, [cliPath, ...args], { input, encoding: "utf8" });
}

describe("CLI", function() {

  it("should parse xml from stdin", function() {
    const result = runCli([], "<a>1</a>");

    expect(result.status).toBe(0);
    expect(JSON.parse(result.stdout)).toEqual({ a: 1 });
  });

  it("should report a missing input file instead of crashing", function() {
    const result = runCli([missingPath]);

    expect(result.status).toBe(1);
    expect(result.stdout).toContain("Seems an invalid file or stream.");
    expect(result.stdout).toContain("ENOENT");
    expect(result.stderr).not.toContain("throw err");
  });

  it("should report an unwritable output file instead of crashing", function() {
    const result = runCli(["-o", path.join(missingPath, "out.json")], "<a>1</a>");

    expect(result.status).toBe(1);
    expect(result.stdout).toContain("Seems an invalid file or stream.");
    expect(result.stderr).not.toContain("throw err");
  });
});
