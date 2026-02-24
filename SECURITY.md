# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability in fast-xml-parser, please report it responsibly.

**Preferred**: [GitHub Private Security Advisory](https://github.com/NaturalIntelligence/fast-xml-parser/security/advisories/new)
- Provides a secure, private channel for discussion
- Allows coordinated disclosure and CVE assignment

**Alternative**: Email amitguptagwl@gmail.com with a clear description and steps to reproduce.

## Response Timeline

- **Acknowledgment**: Within 72 hours
- **Status updates**: Every 7 days while investigating
- **Target fix**: 14 days for critical, 30 days for moderate/low

Timelines may vary based on complexity.

## Supported Versions

| Version | Supported |
|---------|-----------|
| 5.x (latest) | Yes |
| 4.x | Security fixes only |
| < 4.0 | No |

## What to Expect

1. We acknowledge your report
2. We investigate and confirm the issue
3. We develop a fix and coordinate release timing with you
4. We publish a security advisory via GitHub and npm
5. You receive credit (unless you prefer anonymity)

## Secure Configuration

When parsing untrusted XML, consider these hardening options:

```js
const parser = new XMLParser({
  processEntities: false,       // disable entity expansion
  ignoreDeclaration: true,      // strip XML declaration
  allowBooleanAttributes: false // strict attribute parsing
});
```

Always wrap `parser.parse()` in try/catch when handling untrusted input.

## Thank You

We appreciate the security research community. Responsible disclosure helps keep fast-xml-parser safe for the millions of projects that depend on it.
