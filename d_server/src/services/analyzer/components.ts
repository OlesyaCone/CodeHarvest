import { Component, Location, AllComponents, Class } from "../../types/type";

interface CssBlock {
  selector: string;
  content: string;
  fullBlock: string;
}

class AnalyzerComponents {
  async extractAll(css: string, html: string): Promise<AllComponents> {
    const { uniqueClasses, classPositions, htmlElementsByClass } = this.parseHtmlOnce(html);
    const cssIndex = this.createCssIndex(css);
    const components = this.buildComponents(uniqueClasses, htmlElementsByClass, cssIndex, classPositions);
    
    return {
      components,
      location: {
        class: classPositions,
        css: this.filterLayoutCss(css),
        html: this.makeSimpleHtml(html),
      },
    };
  }

  private parseHtmlOnce(html: string): {
    uniqueClasses: Set<string>;
    classPositions: Class[];
    htmlElementsByClass: Map<string, string[]>;
  } {
    const uniqueClasses = new Set<string>();
    const classes: Class[] = [];
    const htmlByClass = new Map<string, string[]>();
    const depthStack: string[] = [];
    
    const tagRegex = /<([^>]+)>/g;
    let tagMatch;
    
    while ((tagMatch = tagRegex.exec(html)) !== null) {
      const tagContent = tagMatch[1];
      const isClosingTag = tagContent.startsWith('/');
      const fullTag = tagMatch[0];

      if (isClosingTag) {
        depthStack.pop();
        continue;
      }
      
      const isSelfClosing = this.isSelfClosingTag(tagContent);
      
      if (!isSelfClosing) {
        depthStack.push('item');
      }
      
      const classAttrMatch = /class=["']([^"']+)["']/.exec(tagContent);
      if (classAttrMatch) {
        const currentDepth = Math.max(0, depthStack.length - 1);
        const classNames = classAttrMatch[1].split(/\s+/);
        
        classNames.forEach(cls => {
          const className = cls.trim();
          if (!className) return;
          
          uniqueClasses.add(className);
          classes.push({ name: className, position: currentDepth });

          if (!htmlByClass.has(className)) {
            htmlByClass.set(className, []);
          }
          htmlByClass.get(className)!.push(fullTag);
        });
      }
    }
    
    const uniquePositions = new Map<string, Class>();
    classes.forEach(cls => {
      if (!uniquePositions.has(cls.name) || 
          uniquePositions.get(cls.name)!.position > cls.position) {
        uniquePositions.set(cls.name, cls);
      }
    });
    
    return {
      uniqueClasses,
      classPositions: Array.from(uniquePositions.values()),
      htmlElementsByClass: htmlByClass,
    };
  }

  private isSelfClosingTag(tagContent: string): boolean {
    return tagContent.includes('/') || 
           tagContent.includes('br ') || 
           tagContent.includes('img ') || 
           tagContent.includes('input ') ||
           tagContent.includes('meta ') ||
           tagContent.includes('link ') ||
           tagContent.includes('hr ') ||
           tagContent.includes('source ') ||
           tagContent.includes('track ') ||
           tagContent.includes('embed ') ||
           tagContent.includes('col ') ||
           tagContent.includes('area ') ||
           tagContent.includes('base ') ||
           tagContent.includes('wbr ');
  }

  private createCssIndex(css: string): Map<string, string[]> {
    const cssIndex = new Map<string, string[]>();
    
    const cssBlocks = this.splitCssIntoBlocks(css);

    cssBlocks.forEach(block => {
      const classesInBlock = this.extractClassesFromSelector(block.selector);
      
      classesInBlock.forEach(className => {
        if (!cssIndex.has(className)) {
          cssIndex.set(className, []);
        }
        cssIndex.get(className)!.push(block.fullBlock);
      });
    });
    
    return cssIndex;
  }

  private splitCssIntoBlocks(css: string): CssBlock[] {
    const blocks: CssBlock[] = [];
    let i = 0;
    let braceCount = 0;
    let start = 0;
    let inSelector = true;
    let selector = '';

    const cleanedCss = css.replace(/\/\*[\s\S]*?\*\//g, '');
    
    while (i < cleanedCss.length) {
      const char = cleanedCss[i];
      
      if (char === '{') {
        braceCount++;
        if (braceCount === 1) {
          selector = cleanedCss.substring(start, i).trim();
          start = i + 1;
          inSelector = false;
        }
      } else if (char === '}') {
        braceCount--;
        if (braceCount === 0) {
          const content = cleanedCss.substring(start, i).trim();
          const fullBlock = cleanedCss.substring(start - selector.length - 1, i + 1).trim();
          
          blocks.push({
            selector,
            content,
            fullBlock,
          });
          
          start = i + 1;
          inSelector = true;
        }
      }
      
      i++;
    }
    
    return blocks;
  }

  private extractClassesFromSelector(selector: string): string[] {
    const classes = new Set<string>();
    
    const classRegex = /\.([a-zA-Z_][a-zA-Z0-9_-]*)/g;
    let match;
    
    while ((match = classRegex.exec(selector)) !== null) {
      const className = match[1];
      if (!className.startsWith(':')) {
        classes.add(className);
      }
    }
    
    return Array.from(classes);
  }

  private buildComponents(
    uniqueClasses: Set<string>,
    htmlByClass: Map<string, string[]>,
    cssIndex: Map<string, string[]>,
    classPositions: Class[]
  ): Component[] {
    const components: Component[] = [];
    const positionMap = new Map<string, number>();
    
    classPositions.forEach(pos => {
      positionMap.set(pos.name, pos.position);
    });
    
    for (const className of uniqueClasses) {
      const htmlElements = htmlByClass.get(className) || [];
      const cssRules = cssIndex.get(className) || [];

      if (htmlElements.length > 0 || cssRules.length > 0) {
        components.push({
          class: [{ 
            name: className, 
            position: positionMap.get(className) || 0 
          }],
          css: cssRules.join('\n\n'),
          html: htmlElements.join('\n'),
        });
      }
    }
    
    return components;
  }

  private filterLayoutCss(css: string): string {
    const layoutProps = [
      'display', 'position', 'top', 'right', 'bottom', 'left',
      'grid', 'grid-template', 'grid-area', 'grid-column', 'grid-row',
      'flex', 'flex-direction', 'justify-content', 'align-items',
      'float', 'clear', 'z-index', 'width', 'height', 'margin', 'padding',
      'max-width', 'min-width', 'max-height', 'min-height',
      'overflow', 'overflow-x', 'overflow-y', 'visibility',
      'box-sizing', 'border-box', 'box-shadow', 'border', 'outline',
      'gap', 'row-gap', 'column-gap', 'order', 'align-self', 'justify-self'
    ];
    
    const blocks = this.splitCssIntoBlocks(css);
    const layoutBlocks: string[] = [];
    
    for (const block of blocks) {
      let hasLayout = false;
      
      for (const prop of layoutProps) {
        if (block.content.includes(prop + ':') || 
            block.content.includes(prop + ' :')) {
          hasLayout = true;
          break;
        }
      }
      
      if (hasLayout) {
        layoutBlocks.push(block.fullBlock);
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
      
      if (this.isSelfClosingTag(tagContent)) {
        const indent = '  '.repeat(currentIndent);
        lines.push(indent + fullTag);
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