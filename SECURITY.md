# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | Yes                |
| < 1.0   | No                 |

## Reporting a Vulnerability

If you discover a security vulnerability in Tabletop Mastering, please report it responsibly. Do not open a public issue.

**How to report:**

1. Send an email with a detailed description of the vulnerability.
2. Include steps to reproduce the issue, if possible.
3. Allow up to 48 hours for an initial response.

We take all security reports seriously and will work with you to understand and resolve the issue promptly.

## Security Measures

### Authentication

- Passwords are hashed using bcrypt with a cost factor of 10.
- JWT tokens are used for session management with configurable expiration.
- Tokens are validated on every authenticated request.

### Data Protection

- All API endpoints are protected with appropriate authentication middleware.
- User input is validated and sanitized before processing.
- MongoDB queries use parameterized inputs to prevent injection attacks.

### Infrastructure

- CORS is configured to accept requests only from allowed origins.
- Rate limiting is applied to prevent brute-force and DDoS attacks.
- Security headers (X-Frame-Options, X-Content-Type-Options, etc.) are set via Nginx.
- File uploads are restricted by type and size.

### Environment Variables

The following sensitive values must be configured securely in production:

| Variable | Description |
| -------- | ----------- |
| `JWT_SECRET` | Secret key for signing JWT tokens. Use a strong random value. |
| `MONGO_PASSWORD` | MongoDB authentication password. |
| `SENTRY_DSN` | Sentry Data Source Name for error tracking. |
| `GRAFANA_PASSWORD` | Grafana admin password for observability dashboard. |

Never commit `.env` files or secrets to version control.

### Production Checklist

Before deploying to production, ensure:

- [ ] `NODE_ENV` is set to `production`.
- [ ] `JWT_SECRET` is a cryptographically secure random string (minimum 32 characters).
- [ ] `MONGO_PASSWORD` is a strong, unique password.
- [ ] HTTPS is enabled and HTTP traffic is redirected.
- [ ] Debug logs are disabled or sanitized.
- [ ] Rate limiting thresholds are adjusted for expected traffic.
- [ ] Backup strategy is in place for MongoDB data.

## Disclosure Policy

We follow a coordinated disclosure process:

1. The reporter submits the vulnerability privately.
2. We acknowledge receipt within 48 hours.
3. We investigate and develop a fix.
4. We release the fix and publicly disclose the vulnerability (if applicable).
5. We credit the reporter, unless anonymity is requested.
