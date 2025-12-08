import puppeteer from "puppeteer";

class SiteExtractor {
  async extractAll(url: string): Promise<{
    html: string;
    css: string;
    screenshot: string;
  }> {
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();

    try {
      await page.goto(url, { waitUntil: "networkidle0" });

      const [html, css, screenshot] = await Promise.all([
        page.content(),

        page.evaluate(async () => {
          let allCSS = "";

          const styleTags = Array.from(document.querySelectorAll("style"));
          styleTags.forEach((style) => {
            allCSS += style.textContent + "\n";
          });

          const linkTags = Array.from(
            document.querySelectorAll('link[rel="stylesheet"]')
          );

          for (const link of linkTags) {
            const href = link.getAttribute("href");
            try {
              if (href) {
                const absoluteUrl = new URL(href, window.location.href).href;
                const response = await fetch(absoluteUrl);
                const cssText = await response.text();
                allCSS += cssText + "\n";
              }
            } catch (error) {
              console.warn("Failed to fetch CSS:", href);
            }
          }

          return allCSS;
        }),

        page.screenshot({
          encoding: "base64",
          type: "png",
          fullPage: true,
        }),
      ]);

      await browser.close();

      return {
        html,
        css,
        screenshot,
      };
    } catch (error) {
      await browser.close();
      throw error;
    }
  }
}

export { SiteExtractor };
