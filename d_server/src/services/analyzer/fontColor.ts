import { allFonts, allColors, Baza } from "../../types/type";

class FontAndColor {
  async extractAll( css: string): Promise<Baza> {
    return {
      allFonts: this.extractMainFont(css),
      allColors: this.extractColors(css),
    };
  }

  private extractMainFont(css: string): allFonts {
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

  private extractColors(css: string): allColors {
    const result: allColors = { dark: [], light: [], other: [] };
    const colorRegex =
      /(#[0-9a-fA-F]{3,8})|(rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\))|(rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*[\d.]+\s*\))/gi;

    const processMatches = (content: string, category: "dark" | "light") => {
      const colors = content.match(colorRegex) || [];
      colors.forEach((color) => {
        const cleanColor = color.toLowerCase();
        if (!result[category].includes(cleanColor))
          result[category].push(cleanColor);
      });
    };

    const processTheme = (regex: RegExp, category: "dark" | "light") => {
      const matches = css.matchAll(regex);
      for (const match of matches) {
        const content = match[1];
        processMatches(content, category);
      }
    };

    processTheme(
      /@media\s*\(prefers-color-scheme:\s*dark\)\s*{([\s\S]*?)}/gi,
      "dark"
    );
    processTheme(/\[data-theme\s*=\s*["']?dark["']?\][^{]*{([^}]+)}/gi, "dark");
    processTheme(/\.dark[^{]*{([^}]+)}/gi, "dark");
    processTheme(/:root\s*{([^}]+)}/gi, "dark");
    processTheme(
      /@media\s*\(prefers-color-scheme:\s*light\)\s*{([\s\S]*?)}/gi,
      "light"
    );
    processTheme(
      /\[data-theme\s*=\s*["']?light["']?\][^{]*{([^}]+)}/gi,
      "light"
    );
    processTheme(/\.light[^{]*{([^}]+)}/gi, "light");

    const allMatches = css.match(colorRegex) || [];
    allMatches.forEach((color) => {
      const cleanColor = color.toLowerCase();
      if (
        !result.dark.includes(cleanColor) &&
        !result.light.includes(cleanColor)
      ) {
        if (!result.other.includes(cleanColor)) result.other.push(cleanColor);
      }
    });

    return result;
  }
}

export { FontAndColor };
