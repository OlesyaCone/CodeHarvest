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
        page.evaluate(() => {
          const clone = document.cloneNode(true) as Document;

          const iterator = document.createNodeIterator(
            clone,
            NodeFilter.SHOW_COMMENT,
            null
          );

          let node: Node | null;
          const comments: Comment[] = [];

          while ((node = iterator.nextNode())) {
            if (node.nodeType === Node.COMMENT_NODE) {
              comments.push(node as Comment);
            }
          }

          comments.forEach((comment: Comment) => {
            if (comment.parentNode) {
              comment.parentNode.removeChild(comment);
            }
          });

          const scripts = clone.querySelectorAll("script");
          scripts.forEach((script: Element) => script.remove());

          const allElements = clone.querySelectorAll("*");
          allElements.forEach((el: Element) => {
            const attrs = el.getAttributeNames();
            attrs.forEach((attr: string) => {
              if (attr.startsWith("on")) {
                el.removeAttribute(attr);
              }
            });
          });

          return clone.documentElement.outerHTML;
        }),

        page.evaluate(async () => {
          const clone = document.cloneNode(true) as Document;
          let allCSS = "";

          const styleTags = Array.from(document.querySelectorAll("style"));
          styleTags.forEach((style: HTMLStyleElement) => {
            allCSS += style.textContent + "\n";
          });

          const linkTags = Array.from(
            document.querySelectorAll('link[rel="stylesheet"]')
          ) as HTMLLinkElement[];

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
              console.log("Failed to fetch CSS:", href);
            }
          }

          allCSS = allCSS.replace(/\/\*[\s\S]*?\*\//g, "").trim();

          allCSS = allCSS
            .split("\n")
            .filter(line => line.trim() !== "")
            .join("\n");

          const allElements = clone.querySelectorAll("*");
          allElements.forEach((el: Element) => {
            const attrs = el.getAttributeNames();
            attrs.forEach((attr: string) => {
              if (attr.startsWith("on")) {
                el.removeAttribute(attr);
              }
            });
          });

          return allCSS;
        }),

        page.screenshot({
          encoding: "base64",
          type: "png",
          fullPage: true,
        }) as Promise<string>,
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