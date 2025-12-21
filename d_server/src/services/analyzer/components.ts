import { Component, Location, AllComponents, Class } from "../../types/type";

class AnalyzerComponents {
  async extractAll(css: string, html: string): Promise<AllComponents> {
    return {
      components: this.extractComponents(css, html),
      location: this.extractLocation(css, html),
    };
  }

  private extractComponents(css: string, html: string): Component[] {
    const components: Component[] = [];
    const classRegex = /class=["']([^"']+)["']/gi;
    const foundClasses = new Set<string>();
    
    let classMatch;
    while ((classMatch = classRegex.exec(html)) !== null) {
      classMatch[1].split(/\s+/).forEach(cls => {
        if (cls.trim()) foundClasses.add(cls.trim());
      });
    }

    for (const className of Array.from(foundClasses)) {
      const componentCss = this.findCssForClass(css, className);
      const componentHtml = this.findHtmlForClass(html, className);
      
      components.push({
        class: [{ name: className, position: 0 }],
        css: componentCss,
        html: componentHtml,
      });
    }

    return components;
  }

  private extractLocation(css: string, html: string): Location {
    return {
      class: this.findClassPositions(html),
      css: this.filterLayoutCss(css),
      html: this.makeSimpleHtml(html),
    };
  }

  private findCssForClass(css: string, className: string): string {
    const cssRules: string[] = [];
    const cssRegex = new RegExp(`[^{}]*\\.${className}[^{}]*{[^}]*}`, 'gi');
    
    let cssMatch;
    while ((cssMatch = cssRegex.exec(css)) !== null) {
      cssRules.push(cssMatch[0]);
    }
    
    return cssRules.join('\n\n');
  }

  private findHtmlForClass(html: string, className: string): string {
    const htmlElements: string[] = [];
    const htmlRegex = new RegExp(`<([^>]*)class=["'][^"']*\\b${className}\\b[^"']*["'][^>]*>`, 'gi');
    
    let htmlMatch;
    while ((htmlMatch = htmlRegex.exec(html)) !== null) {
      htmlElements.push(htmlMatch[0]);
    }
    
    return htmlElements.join('\n');
  }

  private findClassPositions(html: string): Class[] {
    const classes: Class[] = [];
    const tagRegex = /<([^>]+)>/g;
    const depthStack: string[] = [];
    
    let tagMatch;
    while ((tagMatch = tagRegex.exec(html)) !== null) {
      const fullTag = tagMatch[1];
      
      if (fullTag.startsWith('/')) {
        depthStack.pop();
        continue;
      }

      if (fullTag.includes('/') || 
          fullTag.includes('br ') || 
          fullTag.includes('img ') || 
          fullTag.includes('input ') ||
          fullTag.includes('meta ') ||
          fullTag.includes('link ')) {
      } else {
        depthStack.push('item');
      }

      const classAttrMatch = /class=["']([^"']+)["']/.exec(fullTag);
      if (classAttrMatch) {
        const position = depthStack.length - 1;
        classAttrMatch[1].split(/\s+/).forEach(cls => {
          if (cls.trim()) {
            classes.push({ name: cls.trim(), position: position });
          }
        });
      }
    }

    const uniqueClasses = new Map<string, Class>();
    classes.forEach(cls => {
      if (!uniqueClasses.has(cls.name) || uniqueClasses.get(cls.name)!.position > cls.position) {
        uniqueClasses.set(cls.name, cls);
      }
    });

    return Array.from(uniqueClasses.values());
  }

  private filterLayoutCss(css: string): string {
    const layoutProps = [
      'display', 'position', 'top', 'right', 'bottom', 'left',
      'grid', 'grid-template', 'grid-area', 'grid-column', 'grid-row',
      'flex', 'flex-direction', 'justify-content', 'align-items',
      'float', 'clear', 'z-index', 'width', 'height', 'margin', 'padding'
    ];
    
    const cssBlocks = css.split('}');
    const layoutBlocks: string[] = [];
    
    for (const block of cssBlocks) {
      if (!block.trim()) continue;
      
      let hasLayout = false;
      for (const prop of layoutProps) {
        if (block.includes(prop + ':') || block.includes(prop + ' :')) {
          hasLayout = true;
          break;
        }
      }
      
      if (hasLayout) {
        layoutBlocks.push(block.trim() + '}');
      }
    }
    
    return layoutBlocks.join('\n\n');
  }

  private makeSimpleHtml(html: string): string {
    const lines: string[] = [];
    const tagRegex = /<([^>]+)>/g;
    let currentIndent = 0;
    
    let tagMatch;
    while ((tagMatch = tagRegex.exec(html)) !== null) {
      const fullTag = tagMatch[0];
      const tagContent = tagMatch[1];
      
      if (tagContent.startsWith('/')) {
        currentIndent = Math.max(0, currentIndent - 1);
        continue;
      }
      
      if (tagContent.includes('/') || 
          tagContent.includes('br ') || 
          tagContent.includes('img ') || 
          tagContent.includes('input ') ||
          tagContent.includes('meta ') ||
          tagContent.includes('link ')) {
      } else {
        const indent = '  '.repeat(currentIndent);
        lines.push(indent + fullTag);
        currentIndent++;
      }
    }
    
    return lines.join('\n');
  }
}

export { AnalyzerComponents };