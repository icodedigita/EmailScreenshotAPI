# n8n Integration

HTML Screenshot API works with [n8n](https://n8n.io/) using the standard **HTTP Request** node.

You can use it to convert HTML generated inside an n8n workflow into a PNG image.

## How It Works

```text
HTML
  ↓
n8n HTTP Request
  ↓
HTML Screenshot API
  ↓
PNG Image
```

This makes it useful for:

* Email screenshots
* Invoices
* Reports
* Certificates
* Notifications
* HTML templates
* Automated documents
* WhatsApp images
* Telegram images
* Image previews

---

## Requirements

You need:

1. A running HTML Screenshot API instance
2. An n8n instance
3. The URL of your Screenshot API

For example:

```text
https://your-domain.com
```

The screenshot endpoint is:

```text
https://your-domain.com/screenshot
```

---

# Basic n8n Workflow

Create the following workflow:

```text
Manual Trigger
      ↓
Set
      ↓
HTTP Request
      ↓
PNG Image
```

## 1. Manual Trigger

Add a **Manual Trigger** node.

No configuration is required.

---

## 2. Set HTML

Add a **Set** node.

Create a field:

```text
Name: html
```

Example value:

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body {
      font-family: Arial, sans-serif;
      padding: 40px;
      background: #ffffff;
    }

    .card {
      padding: 30px;
      border-radius: 12px;
      background: #f5f5f5;
    }
  </style>
</head>

<body>
  <div class="card">
    <h1>Hello from n8n</h1>
    <p>This HTML was rendered using HTML Screenshot API.</p>
  </div>
</body>
</html>
```

---

# 3. HTTP Request

Add an **HTTP Request** node.

Configure it as follows.

### Method

```text
POST
```

### URL

```text
https://your-domain.com/screenshot
```

Replace `your-domain.com` with your own API domain.

### Send Body

Enable:

```text
Send Body
```

### Body Content Type

Select:

```text
JSON
```

### JSON Body

```json
{
  "html": "={{ $json.html }}"
}
```

---

# 4. Receive the PNG

The API returns:

```text
Content-Type: image/png
```

Configure the HTTP Request node to download the response as a file/binary response.

The resulting n8n item will contain the PNG as binary data.

You can then send that binary image to another n8n node.

For example:

```text
HTTP Request
      ↓
WhatsApp
```

or:

```text
HTTP Request
      ↓
Google Drive
```

or:

```text
HTTP Request
      ↓
Email
```

---

# Email Screenshot Workflow

A common use case is converting incoming emails into images.

The workflow can look like:

```text
Email Trigger
      ↓
Extract HTML
      ↓
HTTP Request
      ↓
Screenshot PNG
      ↓
Send Image
```

The email HTML can be sent directly to:

```text
POST /screenshot
```

with:

```json
{
  "html": "={{ $json.html }}"
}
```

The API renders the HTML using Chromium and returns a PNG.

---

# Using the Screenshot in WhatsApp

Once the HTTP Request node has returned the PNG as binary data, you can pass the binary property to your WhatsApp integration.

For example:

```text
Email Trigger
      ↓
Extract HTML
      ↓
HTTP Request
      ↓
Screenshot PNG
      ↓
WhatsApp
```

The same screenshot can also be used by other n8n nodes that accept binary files.

---

# Why Use This Instead of an External Screenshot API?

The API is self-hosted.

Your n8n workflow can send HTML to your own server:

```text
n8n
 ↓
Your Screenshot API
 ↓
Chromium
 ↓
PNG
```

No external screenshot service is required.

This is useful when you want to keep your HTML and generated images inside your own infrastructure.

---

# Troubleshooting

## API returns 400

Make sure the request contains:

```json
{
  "html": "<html>...</html>"
}
```

The `html` property is required.

---

## API returns 500

Check the API container logs.

Make sure Chromium/Playwright started successfully.

---

## Image is empty

Make sure the HTML is valid and that externally loaded resources are accessible from the server.

For example:

* Images
* Fonts
* CSS
* External resources

---

## n8n receives JSON instead of an image

Make sure the HTTP Request node is configured to receive the response as a **file/binary response** rather than JSON.

---

# Ready-to-Import Workflow

A basic example workflow is available here:

`examples/n8n/html-to-screenshot.json`

Import it into n8n and replace the Screenshot API URL with your own deployment.

---

# More Examples

If you are using the API for email automation, you can build workflows such as:

```text
IMAP Email
    ↓
Extract HTML
    ↓
HTML Screenshot API
    ↓
PNG
    ↓
WhatsApp
```

You can also use the API for:

```text
HTML Invoice
    ↓
Screenshot API
    ↓
PNG
    ↓
Customer
```

or:

```text
HTML Report
    ↓
Screenshot API
    ↓
PNG
    ↓
Storage / Messaging / Email
```
