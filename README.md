# Email Screenshot API

A lightweight, self-hosted **HTML-to-PNG screenshot API** built with **Node.js, Express, Playwright, and Chromium**.

**Email Screenshot API** accepts HTML through a simple REST API, renders it using headless Chromium, and returns a full-page PNG screenshot.

It is designed primarily for **email automation**, but can also be used for invoices, reports, notifications, previews, documents, and other HTML-based content that needs to be converted into an image.

The API is Docker-ready and can be deployed on your own VPS or infrastructure.

---

## ✨ Features

* 📧 Convert HTML emails into PNG screenshots
* 🖼️ Convert any HTML content into PNG
* 📄 Full-page screenshots
* 🌐 Supports external images, fonts, CSS, and web resources
* 🎭 Headless Chromium rendering with Playwright
* ⚡ Simple REST API
* 📦 JSON request body
* 🖼️ PNG response
* ❤️ Health-check endpoint
* 🐳 Docker-ready
* 🔒 Self-hosted and suitable for private infrastructure
* 🔄 Works with n8n and other automation platforms
* 🚀 Easy to deploy on a VPS
* 🧩 No browser installation required on the host when using Docker

---

# 🏗️ How It Works

```text
HTML Email
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

A typical email automation workflow can look like:

```text
IMAP Email
    │
    ▼
Extract Email HTML
    │
    ▼
Email Screenshot API
    │
    ▼
PNG Screenshot
    │
    ▼
WhatsApp / Email / Storage / Notification
```

---

# 🚀 Quick Start

## Requirements

The easiest way to run Email Screenshot API is with Docker.

You need:

* Docker
* Git

Node.js is only required if you want to run the application directly without Docker.

---

# 🐳 Run with Docker

Clone the repository:

```bash
git clone https://github.com/icodedigita/EmailScreenshotAPI.git
```

Enter the directory:

```bash
cd EmailScreenshotAPI
```

Build the Docker image:

```bash
docker build -t email-screenshot-api .
```

Run the container:

```bash
docker run -d \
  --name email-screenshot-api \
  -p 3000:3000 \
  email-screenshot-api
```

The API will now be available at:

```text
http://localhost:3000
```

---

# ❤️ Health Check

Check whether the API is running:

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

The generated image will be saved as:

```text
screenshot.png
```

---

# 📡 API Reference

## `GET /health`

Checks whether Email Screenshot API is running.

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

The endpoint returns:

```text
Content-Type: image/png
```

The browser viewport is configured as:

```text
Width: 1200px
Height: 800px
Device Scale Factor: 1
```

The screenshot is generated with:

```text
fullPage: true
```

This means the generated PNG contains the complete rendered page rather than only the initial viewport.

---

# 🧪 JavaScript Example

```javascript
const response = await fetch(
  "http://localhost:3000/screenshot",
  {
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
  }
);

if (!response.ok) {
  throw new Error(
    `Screenshot API returned ${response.status}`
  );
}

const imageBuffer = await response.arrayBuffer();
```

---

# 🐍 Python Example

```python
import requests

html = """
<!DOCTYPE html>
<html>
<head>
    <style>
        body {
            font-family: Arial, sans-serif;
            padding: 40px;
        }
    </style>
</head>
<body>
    <h1>Hello from Python</h1>
    <p>This HTML will be rendered as a PNG.</p>
</body>
</html>
"""

response = requests.post(
    "http://localhost:3000/screenshot",
    json={"html": html}
)

response.raise_for_status()

with open("screenshot.png", "wb") as file:
    file.write(response.content)

print("Screenshot saved as screenshot.png")
```

---

# 🔄 n8n Integration

Email Screenshot API works directly with **n8n** using the HTTP Request node.

A basic workflow:

```text
HTML
  │
  ▼
HTTP Request
  │
  ▼
Email Screenshot API
  │
  ▼
PNG Binary
  │
  ▼
Next Automation Step
```

For email automation:

```text
IMAP Email
    │
    ▼
Extract HTML
    │
    ▼
HTTP Request
    │
    ▼
Email Screenshot API
    │
    ▼
PNG
    │
    ▼
WhatsApp / Email / Storage
```

## HTTP Request Node

Configure the HTTP Request node:

### Method

```text
POST
```

### URL

```text
https://your-domain.com/screenshot
```

### Body Content Type

```text
JSON
```

### JSON Body

```json
{
  "html": "={{ $json.html }}"
}
```

Configure the response as a **file/binary response**.

The generated PNG can then be passed to other n8n nodes.

### Ready-to-import n8n workflow

A ready-to-import example is included:

[`examples/n8n/html-to-screenshot.json`](./examples/n8n/html-to-screenshot.json)

Additional n8n documentation is available here:

[`docs/n8n.md`](./docs/n8n.md)

---

# 📧 Email Screenshot Workflow

Email Screenshot API was designed with email automation in mind.

A typical workflow:

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
                    │  Extract Email  │
                    │      HTML       │
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
                 WhatsApp / Email /
                 Storage / Notification
```

This can be useful for:

* Email archiving
* Visual email processing
* Email notifications
* WhatsApp email previews
* Automated reporting
* Monitoring workflows
* Visual records of transactional emails

---

# 🎨 HTML Support

Because the HTML is rendered using Chromium, the page can use resources that are accessible from the screenshot server.

Supported resources can include:

* Images
* Web fonts
* CSS
* External stylesheets
* Other web resources

Example:

```html
<img src="https://example.com/logo.png">
```

The screenshot server must be able to access the external resource.

---

# 🐳 Docker

Email Screenshot API uses the official Playwright Docker image:

```dockerfile
FROM mcr.microsoft.com/playwright:v1.63.0-noble

WORKDIR /app

COPY package*.json ./

RUN npm install --omit=dev

COPY server.js .

ENV PORT=3000

EXPOSE 3000

CMD ["node", "server.js"]
```

The Playwright image includes Chromium and the required Linux dependencies.

This means you do not need to manually install Chromium on the host machine.

---

# ☁️ Deploying with Coolify

Email Screenshot API can be deployed to a VPS using Coolify.

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

## 2. Build Method

Select:

```text
Dockerfile
```

Coolify will build the application using the repository's Dockerfile.

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

Your screenshot endpoint will then be:

```text
https://screenshot.example.com/screenshot
```

Health check:

```text
https://screenshot.example.com/health
```

---

# 🔐 Security Considerations

This project provides a lightweight rendering API.

If you expose the API publicly, consider adding authentication and additional restrictions.

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

If the endpoint is exposed to untrusted users, submitted HTML should be treated as potentially unsafe input.

A production deployment should consider additional isolation and restrictions around:

* External network requests
* JavaScript execution
* Resource consumption
* Large HTML documents
* Concurrent browser pages
* Potentially expensive pages

For trusted internal automation, such as an n8n server sending controlled HTML to the API, the risk profile is different from exposing the endpoint as a public anonymous API.

---

# ⚙️ Configuration

The application currently supports:

## `PORT`

Default:

```text
3000
```

Example:

```bash
docker run -d \
  --name email-screenshot-api \
  -p 3000:3000 \
  -e PORT=3000 \
  email-screenshot-api
```

---

# 📦 Project Structure

```text
EmailScreenshotAPI/
│
├── Dockerfile
├── package.json
├── server.js
├── README.md
│
├── docs/
│   └── n8n.md
│
└── examples/
    └── n8n/
        ├── README.md
        └── html-to-screenshot.json
```

### `server.js`

Contains the Express API and Playwright screenshot functionality.

### `Dockerfile`

Defines the Docker image using the official Playwright image with Chromium.

### `package.json`

Defines the Node.js application and dependencies.

### `docs/n8n.md`

Detailed documentation for using Email Screenshot API with n8n.

### `examples/n8n/`

Contains ready-to-import n8n workflow examples.

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

## Docker Deployment

Only Docker is required.

## Local Development

You will need:

* Node.js
* npm
* Playwright
* Chromium

---

# 🛠️ Local Development

Install dependencies:

```bash
npm install
```

Install Playwright Chromium:

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

Open:

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
* [ ] Request timeout configuration
* [ ] Browser/page concurrency controls
* [ ] Queue-based rendering
* [ ] Optional JavaScript execution controls
* [ ] Docker Compose example
* [ ] Additional n8n workflow examples

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

# ⭐ Support the Project

If Email Screenshot API is useful to you, consider giving the repository a ⭐ on GitHub.

It helps other developers discover the project and supports continued development.

If you find a bug or have an idea for an improvement, feel free to open an issue or submit a pull request.

---

# 📄 License

This project is released under the license included in the repository's `LICENSE` file.

See [`LICENSE`](./LICENSE) for the complete license terms.

---

# 💡 Why Email Screenshot API?

HTML emails can contain complex layouts, CSS, images, fonts, tables, and other browser-rendered content.

Getting a reliable image representation of that HTML usually requires a browser engine.

Email Screenshot API provides a simple interface:

```text
HTML Email
    ↓
REST API
    ↓
Playwright
    ↓
Chromium
    ↓
PNG
```

Your application or automation platform does not need to manage browser automation itself.

Send HTML to the API and receive a ready-to-use screenshot.

---

# 🚀 Built for Automation

Email Screenshot API can be integrated into almost any workflow:

```text
Email / HTML Template / Application
                 │
                 ▼
        Email Screenshot API
                 │
                 ▼
                PNG
                 │
       ┌─────────┼─────────┐
       ▼         ▼         ▼
    WhatsApp   Email    Storage
```

It can be self-hosted on your own infrastructure and used wherever you need reliable HTML-to-image rendering.

---

© 2026 ICODEDIGITA LLC.
