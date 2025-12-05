import puppeteer from "puppeteer";

class SiteExtractor {
  async extractBoth(url: string): Promise<{ html: string; css: string }> {
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    await page.goto(url);

    const [html, css] = await Promise.all([
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
      })
    ]);

    await browser.close();
    return { html, css };
  }
}

export { SiteExtractor };