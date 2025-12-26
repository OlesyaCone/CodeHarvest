import { Component, AllComponents, Class, Location } from "../../types/type";

class AnalyzerComponents {
  async extractAll(css: string, html: string): Promise<AllComponents> {
    const buttonElements = this.findButtonTags(html);
    const buttonClasses = this.extractClassesFromButtons(buttonElements);
    const cssIndex = this.createCssIndex(css);
    const components = this.buildButtonComponents(buttonElements, buttonClasses, cssIndex);
    return {
      components,
      location: {
        class: this.extractClassPositions(html),
        css: this.filterLayoutCss(css),
        html: this.makeSimpleHtml(html),
      },
    };
  }

  private findButtonTags(html: string): string[] {
    const buttonRegex = /<button[^>]*>.*?<\/button>/gi;
    const matches = html.match(buttonRegex) || [];
    return matches;
  }

  private extractClassesFromButtons(buttonElements: string[]): Set<string> {
    const classes = new Set<string>();
    
    for (const button of buttonElements) {
      const classMatch = /class=["']([^"']+)["']/.exec(button);
      if (classMatch) {
        classMatch[1].split(/\s+/).forEach(cls => {
          if (cls.trim()) {
            classes.add(cls.trim());
          }
        });
      }
    }
    
    return classes;
  }

  private buildButtonComponents(
    buttonElements: string[],
    buttonClasses: Set<string>,
    cssIndex: Map<string, string[]>
  ): Component[] {
    const components: Component[] = [];
    const buttonsByClass = new Map<string, string[]>();
    
    for (const button of buttonElements) {
      const classMatch = /class=["']([^"']+)["']/.exec(button);
      if (classMatch) {
        const className = classMatch[1].split(/\s+/)[0];
        if (!buttonsByClass.has(className)) {
          buttonsByClass.set(className, []);
        }
        buttonsByClass.get(className)!.push(button);
      } else {
        const className = 'button-no-class';
        if (!buttonsByClass.has(className)) {
          buttonsByClass.set(className, []);
        }
        buttonsByClass.get(className)!.push(button);
      }
    }

    for (const [className, buttons] of buttonsByClass.entries()) {
      const cssRules = cssIndex.get(className) || [];
      
      components.push({
        class: [{ 
          name: className, 
          position: 0
        }],
        css: cssRules.join('\n\n'),
        html: buttons.join('\n'),
      });
    }
    
    return components;
  }
  private createCssIndex(css: string): Map<string, string[]> {
    const cssIndex = new Map<string, string[]>();
    const cssRegex = /([^{]+)\{([^}]+)\}/g;
    
    let match: RegExpExecArray | null;
    while ((match = cssRegex.exec(css)) !== null) {
      const selector = match[1].trim();
      const content = match[2].trim();

      const classRegex = /\.([a-zA-Z_][a-zA-Z0-9_-]*)/g;
      let classMatch: RegExpExecArray | null;
      
      while ((classMatch = classRegex.exec(selector)) !== null) {
        const className = classMatch[1];
        if (!cssIndex.has(className)) {
          cssIndex.set(className, []);
        }
        cssIndex.get(className)!.push(`${selector} {${content}}`);
      }
    }
    
    return cssIndex;
  }
  private extractClassPositions(html: string): Class[] {
    const classes: Class[] = [];
    let depth = 0;
    
    const tagRegex = /<([^>]+)>/g;
    let match: RegExpExecArray | null;
    
    while ((match = tagRegex.exec(html)) !== null) {
      const tag = match[1];
      
      if (tag.startsWith('/')) {
        depth = Math.max(0, depth - 1);
        continue;
      }
      
      const classMatch = /class=["']([^"']+)["']/.exec(tag);
      if (classMatch) {
        classMatch[1].split(/\s+/).forEach(cls => {
          if (cls.trim()) {
            classes.push({ name: cls.trim(), position: depth });
          }
        });
      }
      
      if (!this.isSelfClosingTag(tag)) {
        depth++;
      }
    }
    
    const uniquePositions = new Map<string, number>();
    classes.forEach(cls => {
      if (!uniquePositions.has(cls.name) || uniquePositions.get(cls.name)! > cls.position) {
        uniquePositions.set(cls.name, cls.position);
      }
    });
    
    return Array.from(uniquePositions.entries()).map(([name, position]) => ({
      name,
      position
    }));
  }

  private filterLayoutCss(css: string): string {
    const layoutProps = ['display', 'position', 'top', 'right', 'bottom', 'left', 'grid', 'flex', 'width', 'height', 'margin', 'padding'];
    
    const cssRegex = /([^{]+)\{([^}]+)\}/g;
    const layoutBlocks: string[] = [];
    
    let match: RegExpExecArray | null;
    while ((match = cssRegex.exec(css)) !== null) {
      const selector = match[1].trim();
      const content = match[2].trim();
      
      const hasLayout = layoutProps.some(prop => 
        content.includes(prop + ':') || content.includes(prop + ' :')
      );
      
      if (hasLayout) {
        layoutBlocks.push(`${selector} {${content}}`);
      }
    }
    
    return layoutBlocks.join('\n\n');
  }

  private isSelfClosingTag(tag: string): boolean {
    return /^(img|br|input|meta|link|hr)/i.test(tag);
  }

  private makeSimpleHtml(html: string): string {
    const lines: string[] = [];
    const tagRegex = /<([^>]+)>/g;
    let currentIndent = 0;
    
    let match: RegExpExecArray | null;
    while ((match = tagRegex.exec(html)) !== null) {
      const fullTag = match[0];
      const tag = match[1];
      
      if (tag.startsWith('/')) {
        currentIndent = Math.max(0, currentIndent - 1);
        continue;
      }
      
      const indent = '  '.repeat(currentIndent);
      lines.push(indent + fullTag);
      
      if (!this.isSelfClosingTag(tag)) {
        currentIndent++;
      }
    }
    
    return lines.join('\n');
  }
}

export { AnalyzerComponents };