# n8n Examples

Ready-to-import [n8n](https://n8n.io/) workflow examples for the **HTML Screenshot API**.

These examples show how to use the API inside n8n workflows to convert HTML into PNG images.

## Available Examples

### HTML → Screenshot

[`html-to-screenshot.json`](./html-to-screenshot.json)

A simple, ready-to-import n8n workflow that:

1. Creates sample HTML.
2. Sends the HTML to the Screenshot API.
3. Receives the generated PNG as binary data.

### Workflow

```text
Manual Trigger
      ↓
Set HTML
      ↓
HTTP Request
      ↓
PNG Screenshot
```

## Import the Workflow

1. Download [`html-to-screenshot.json`](./html-to-screenshot.json).
2. Open your n8n instance.
3. Go to **Workflows**.
4. Select **Import from File**.
5. Select `html-to-screenshot.json`.
6. Open the **HTML Screenshot API** node.
7. Replace the example API URL with your own Screenshot API URL.
8. Execute the workflow.

## Configure the API URL

The example uses a placeholder URL:

```text
https://your-screenshot-api.example.com/screenshot
```

Replace it with your actual API endpoint.

For example:

```text
https://screenshot.example.com/screenshot
```

## API Request

The workflow sends a `POST` request to:

```text
/screenshot
```

with:

```json
{
  "html": "..."
}
```

The API renders the HTML using Chromium and returns the generated PNG image.

## Output

The HTTP Request node stores the generated image as binary data in:

```text
screenshot
```

You can connect this output to other n8n nodes that support binary files.

For example:

```text
HTML Screenshot API
        ↓
       PNG
        ↓
   WhatsApp / Email / Storage
```

## Customize the HTML

Open the **Set HTML** node and replace the sample HTML with your own content.

You can generate:

* Email screenshots
* Invoices
* Reports
* Certificates
* Notifications
* HTML templates
* Customer previews
* Social media images
* Automated documents

For dynamic HTML, you can also use n8n expressions:

```html
<h1>{{ $json.name }}</h1>
<p>{{ $json.message }}</p>
```

This allows your workflow to generate personalized screenshots from incoming data.

## Requirements

* [n8n](https://n8n.io/)
* A running HTML Screenshot API instance

The Screenshot API can be self-hosted using Docker.

## Related Documentation

For the complete n8n integration guide, see:

[`docs/n8n.md`](../../docs/n8n.md)

## Security

The example workflow does not contain API credentials or private infrastructure settings.

Before using it, configure your own:

* Screenshot API URL
* Authentication, if you add it
* n8n credentials, if required

Do not commit API keys, passwords, tokens, or other private credentials to your repository.
