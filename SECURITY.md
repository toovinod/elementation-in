# Security Policy

## Supported Versions

Elementation is in active pre-1.0 development. Security fixes are applied to the
`main` branch and the latest published release of each package.

## Reporting a Vulnerability

Please **do not** open a public issue for security vulnerabilities.

Instead, email **security@elementation.in** with:

- A description of the vulnerability and its impact
- Steps to reproduce (proof-of-concept if possible)
- Affected package(s) and version(s)

You will receive an acknowledgement within 72 hours and a remediation timeline
after triage. We practice coordinated disclosure and will credit reporters who
wish to be named once a fix is released.

## Scope

The overlay SDK runs inside a host application's DOM in development. Reports
about DOM injection, prototype pollution, `postMessage` handling, stored-prompt
XSS in the dashboard, or API route authorization are all in scope.
