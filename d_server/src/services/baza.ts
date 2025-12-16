import { allFonts, Baza } from "../types/type";

class FontAndColor {
  async extractAll(html: string, css: string): Promise<Baza> {
    const mainFont = this.extractMainFont(css, html);
    const colors = this.extractColors(css);

    return {
      allFonts: mainFont,
      allColors: colors,
    };
  }

  private extractMainFont(css: string, html: string): allFonts {
    const fontFaceMatch = css.match(/@font-face\s*{[^}]+}/);
    if (fontFaceMatch) {
      const block = fontFaceMatch[0];
      const fontFamilyMatch = block.match(
        /font-family:\s*['"]?([^;'"]+)['"]?/i
      );

      if (fontFamilyMatch) {
        const fontFamily = fontFamilyMatch[1].trim().replace(/['"]/g, "");
        return {
          html: `<div style="font-family: '${fontFamily}'">Пример текста</div>`,
          css: block,
        };
      }
    }

    const fontFamilyMatch = css.match(/font-family:\s*['"]?([^;'"]+)['"]?/i);
    if (fontFamilyMatch) {
      const fontFamily = fontFamilyMatch[1]
        .trim()
        .replace(/['"]/g, "")
        .split(",")[0];
      return {
        html: `<div style="font-family: '${fontFamily}'">Пример текста</div>`,
        css: `/* Используется в CSS */\nfont-family: '${fontFamily}';`,
      };
    }

    return {
      html: "<div>Шрифты не найдены</div>",
      css: "/* Шрифты не обнаружены */",
    };
  }

  private extractColors(css: string): string[] {
    const colorRegex =
      /(#[0-9a-fA-F]{3,8})|(rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\))|(rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*[\d.]+\s*\))/gi;
    const matches = css.match(colorRegex) || [];
    const uniqueColors = new Set<string>();

    matches.forEach((color) => {
      uniqueColors.add(color.toLowerCase());
    });

    return Array.from(uniqueColors);
  }
}

export { FontAndColor };
