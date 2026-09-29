# Email Screenshot API

A lightweight, self-hosted **HTML-to-PNG screenshot API** built with **Node.js, Express, Playwright, and Chromium**.

This service accepts HTML through a simple REST API and returns a full-page PNG screenshot. It is particularly useful for automation workflows where HTML content needs to be rendered as an image before being sent to another service.

It can be easily deployed using Docker on your own VPS, including platforms such as Coolify.

## ✨ Features

* Convert HTML into PNG screenshots
* Full-page screenshots
* Headless Chromium rendering with Playwright
* Supports external images, fonts, CSS, and other web resources
* Simple REST API
* JSON request body
* PNG response
* Health-check endpoint
* Docker-ready
* No browser installation required on the host
* Self-hosted and suitable for private infrastructure
* Works well with n8n and other automation platforms

---

## 🏗️ How It Works

```text
HTML
  │
  ▼
POST /screenshot
  │
  ▼
Express API
  │
  ▼
Playwright
  │
  ▼
Headless Chromium
  │
  ▼
Rendered HTML
  │
  ▼
PNG Screenshot
```

A typical automation workflow can look like:

```text
IMAP Email
     │
     ▼
Extract HTML
     │
     ▼
Email Screenshot API
     │
     ▼
PNG Screenshot
     │
     ▼
Webhook / Storage / Notification
```

This makes the project useful for automated email processing, visual email archiving, monitoring, reporting, and notification workflows.

---

# 🚀 Quick Start

## Requirements

You can run the application using Docker, so the host machine does not need a separate Chromium installation.

You need:

* Docker
* Git

Node.js is only required if you want to run the project directly without Docker.

---

# 🐳 Run with Docker

Clone the repository:

```bash
git clone https://github.com/YOUR_USERNAME/email-screenshot.git
```

Enter the directory:

```bash
cd email-screenshot
```

Build the Docker image:

```bash
docker build -t email-screenshot .
```

Run the container:

```bash
docker run -d \
  --name email-screenshot \
  -p 3000:3000 \
  email-screenshot
```

The API will now be available at:

```text
http://localhost:3000
```

---

# ❤️ Health Check

You can verify that the service is running:

```bash
curl http://localhost:3000/health
```

Expected response:

```json
{
  "status": "ok"
}
```

---

# 📸 Create a Screenshot

Send HTML to the `/screenshot` endpoint.

### Request

```bash
curl -X POST http://localhost:3000/screenshot \
  -H "Content-Type: application/json" \
  --data '{"html":"<html><body><h1>Hello World</h1><p>This is a screenshot.</p></body></html>"}' \
  --output screenshot.png
```

The resulting `screenshot.png` will contain the rendered HTML.

---

# 📡 API Reference

## `GET /health`

Checks whether the API is running.

### Response

```json
{
  "status": "ok"
}
```

---

## `POST /screenshot`

Converts supplied HTML into a PNG screenshot.

### Request Headers

```text
Content-Type: application/json
```

### Request Body

```json
{
  "html": "<html>...</html>"
}
```

### Example

```json
{
  "html": "<html><body><h1>Invoice</h1><p>Thank you for your purchase.</p></body></html>"
}
```

### Response

The endpoint returns a PNG image:

```text
Content-Type: image/png
```

The screenshot is rendered at:

```text
Width: 1200px
Height: 800px viewport
```

The screenshot itself uses:

```text
fullPage: true
```

so the resulting image includes the complete rendered page rather than only the initial viewport.

---

# 🧪 Using JavaScript

Example using `fetch`:

```javascript
const response = await fetch("http://localhost:3000/screenshot", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    html: `
      <!DOCTYPE html>
      <html>
        <body>
          <h1>Hello from Email Screenshot API</h1>
          <p>This HTML will be converted into a PNG.</p>
        </body>
      </html>
    `
  })
});

const imageBuffer = await response.arrayBuffer();
```

---

# 🔄 n8n Integration

This API can be used directly from an **n8n HTTP Request node**.

A typical workflow:

```text
IMAP Email
    ↓
Extract Email HTML
    ↓
HTTP Request
    ↓
Email Screenshot API
    ↓
PNG Binary Data
    ↓
Your Next Automation Step
```

## HTTP Request Node

Configure the HTTP Request node approximately as follows:

### Method

```text
POST
```

### URL

```text
https://your-domain.com/screenshot
```

### Send Body

Enable JSON.

### Body

```json
{
  "html": "={{ $json.html }}"
}
```

The exact expression will depend on where your email HTML is stored in your n8n workflow.

### Response

Configure the HTTP Request node to receive the response as a **file/binary response**.

The returned binary data will be the generated PNG screenshot.

---

# 📧 Email Screenshot Workflow

One of the intended use cases is automatically converting incoming HTML emails into screenshots.

For example:

```text
                    ┌─────────────────┐
                    │   IMAP Server   │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │   n8n / IMAP    │
                    │  Email Trigger  │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │ Extract HTML    │
                    │ Email Content   │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │ Email Screenshot│
                    │      API        │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │   Playwright    │
                    │    Chromium     │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │   PNG Image     │
                    └────────┬────────┘
                             │
                             ▼
                  Webhook / Storage /
                  Notification / API
```

---

# 🐳 Docker

The project uses the official Playwright Docker image:

```dockerfile
FROM mcr.microsoft.com/playwright:v1.55.0-noble

WORKDIR /app

COPY package*.json ./

RUN npm install --omit=dev

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
```

The Playwright image includes Chromium and the required Linux dependencies.

This avoids having to manually install and configure Chromium on the host server.

---

# ☁️ Deploying with Coolify

This project can be deployed directly to a VPS running Coolify.

## 1. Create a New Resource

In Coolify:

```text
New Resource
    ↓
Application
    ↓
Git Repository
```

Connect your GitHub repository.

## 2. Build Pack

Use:

```text
Dockerfile
```

Coolify will detect the `Dockerfile` and build the application.

## 3. Port

Set the application port to:

```text
3000
```

## 4. Domain

Assign your domain, for example:

```text
https://screenshot.example.com
```

Your API endpoint will then be:

```text
https://screenshot.example.com/screenshot
```

And the health check:

```text
https://screenshot.example.com/health
```

---

# 🔐 Security Considerations

This project is intentionally lightweight and currently provides a simple rendering API.

If you expose the API publicly, you should consider adding authentication before allowing arbitrary users to submit HTML.

Potential improvements include:

* API keys
* Bearer-token authentication
* Rate limiting
* Request size limits
* IP restrictions
* Reverse-proxy authentication
* Request logging
* Concurrent rendering limits
* Timeouts
* Resource restrictions

For private automation infrastructure, placing the service behind a private network or authenticated reverse proxy is recommended.

---

# ⚠️ Important Security Note

The API renders user-provided HTML inside Chromium.

If this endpoint is exposed to untrusted users, treat submitted HTML as potentially unsafe input.

A production deployment should consider additional isolation and restrictions around:

* External network requests
* JavaScript execution
* Resource consumption
* Arbitrary URLs
* Concurrent browser pages
* Large HTML documents
* Malicious or intentionally expensive pages

For a trusted internal automation workflow, such as an n8n server sending email HTML to this service, the risk profile is substantially different from exposing the endpoint as a public anonymous API.

---

# ⚙️ Configuration

The application currently supports the following environment variable:

### `PORT`

Default:

```text
3000
```

Example:

```bash
docker run -d \
  -p 3000:3000 \
  -e PORT=3000 \
  email-screenshot
```

---

# 📦 Project Structure

```text
email-screenshot/
│
├── Dockerfile
│
├── package.json
│
├── server.js
│
├── .gitignore
│
└── README.md
```

### `server.js`

Contains the Express API and Playwright screenshot functionality.

### `Dockerfile`

Defines the container image and uses the official Playwright image containing Chromium.

### `package.json`

Defines the Node.js application and dependencies.

### `README.md`

Project documentation.

---

# 🧰 Technology Stack

| Technology | Purpose                         |
| ---------- | ------------------------------- |
| Node.js    | Runtime                         |
| Express    | HTTP API                        |
| Playwright | Browser automation              |
| Chromium   | HTML rendering                  |
| Docker     | Containerization                |
| n8n        | Optional automation integration |

---

# 📋 Requirements

The Docker deployment requires only:

```text
Docker
```

The application itself uses:

```text
Node.js
Express
Playwright
Chromium
```

---

# 🛠️ Local Development

If you want to run the project without Docker, install Node.js first.

Install dependencies:

```bash
npm install
```

Install Playwright browsers:

```bash
npx playwright install chromium
```

Start the server:

```bash
npm start
```

The API will be available at:

```text
http://localhost:3000
```

---

# 🧪 Testing

Check the health endpoint:

```bash
curl http://localhost:3000/health
```

Test screenshot generation:

```bash
curl -X POST http://localhost:3000/screenshot \
  -H "Content-Type: application/json" \
  --data '{"html":"<h1>Hello World</h1>"}' \
  --output screenshot.png
```

Then open:

```text
screenshot.png
```

---

# 🗺️ Roadmap

Potential future improvements:

* [ ] API key authentication
* [ ] Rate limiting
* [ ] Configurable viewport size
* [ ] Configurable device scale factor
* [ ] JPEG/WebP output
* [ ] PDF generation
* [ ] Custom screenshot dimensions
* [ ] Custom user-agent support
* [ ] Custom HTTP headers
* [ ] Screenshot quality settings
* [ ] Authentication support
* [ ] Request timeout configuration
* [ ] Browser/page concurrency controls
* [ ] Queue-based rendering
* [ ] Optional JavaScript execution controls
* [ ] n8n workflow examples
* [ ] Docker Compose example
* [ ] Production deployment documentation

---

# 🤝 Contributing

Contributions are welcome.

If you find a bug or have an idea for an improvement:

1. Fork the repository.
2. Create a feature branch.
3. Make your changes.
4. Test the application.
5. Submit a pull request.

For larger changes, opening an issue first is recommended so the approach can be discussed.

---

# 📄 License

Choose a license appropriate for your project before publishing the repository.

For example, if you want a permissive open-source license, you can use the MIT License.

Add a `LICENSE` file to the repository containing the appropriate license text.

---

# ⭐ Why This Project?

Rendering HTML reliably outside a browser can be difficult, especially when dealing with modern email HTML containing CSS, images, fonts, and complex layouts.

This project provides a simple interface:

```text
HTML → API → Chromium → PNG
```

No browser automation code is required in the calling application.

Send HTML to the API and receive a ready-to-use screenshot.

---

## 📜 License

© 2026 ICODEDIGITA LLC.

See the `LICENSE` file for licensing information.
