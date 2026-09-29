const express = require("express");
const { chromium } = require("playwright");

const app = express();

app.use(express.json({
  limit: "20mb"
}));

let browser;

async function startBrowser() {
  browser = await chromium.launch({
    headless: true
  });

  console.log("Chromium started");
}

app.post("/screenshot", async (req, res) => {

  try {

    const { html } = req.body;

    if (!html) {
      return res.status(400).json({
        error: "HTML is required"
      });
    }

    const page = await browser.newPage({
      viewport: {
        width: 1200,
        height: 800
      },
      deviceScaleFactor: 1
    });

    await page.setContent(html, {
      waitUntil: "networkidle"
    });

    // Give external images/fonts a moment to render
    await page.waitForTimeout(1000);

    const screenshot = await page.screenshot({
      type: "png",
      fullPage: true
    });

    await page.close();

    res.setHeader("Content-Type", "image/png");

    res.send(screenshot);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: error.message
    });

  }
});

app.get("/health", (req, res) => {
  res.json({
    status: "ok"
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {

  console.log(`Server listening on ${PORT}`);

  await startBrowser();

});