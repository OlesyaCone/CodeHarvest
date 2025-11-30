import puppeteer from 'puppeteer';

export async function extractSiteHTML(url: string): Promise<string> {
  const browser = await puppeteer.launch({ 
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  await page.goto(url);
  
  const html = await page.content();
  await browser.close();
  
  return html;
}

export async function extractSiteCss(url: string): Promise<string> {
  const browser = await puppeteer.launch({ 
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  await page.goto(url);

  const cssContent = await page.evaluate(async () => {
    let allCSS = '';

    const styleTags = Array.from(document.querySelectorAll('style'));
    styleTags.forEach(style => {
      allCSS += style.textContent + '\n';
    });

    const linkTags = Array.from(document.querySelectorAll('link[rel="stylesheet"]'));
    
    for (const link of linkTags) {
      const href = link.getAttribute('href'); 
      try {
        if (href) {
          const absoluteUrl = new URL(href, window.location.href).href;
          const response = await fetch(absoluteUrl);
          const cssText = await response.text();
          allCSS += cssText + '\n';
        }
      } catch (error) {
        console.warn('Failed to fetch CSS:', href);
      }
    }

    return allCSS;
  });
  
  await browser.close();
  return cssContent;
}