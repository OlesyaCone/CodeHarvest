import { WebsiteAnalysis, Collecting } from "../types/type";    

class Analysis {
    async importer(data: Collecting): Promise<WebsiteAnalysis> {
        if (!data.success) {
            throw new Error('Failed to collect website data');
        }
        
        const { url, html, css } = data;
        

        // const detectedComponents = this.detectComponents(html);
        // const allClasses = this.extractClasses(html);
        // const allFonts = this.extractFonts(css);
        // const allColors = this.extractColors(css);
        // const usedFramework = this.detectFramework(html, css);
        // const cssComponents = this.parseCSSBlocks(css);
        // const classUsage = this.analyzeClassUsage(html, css);
        
        const analysis: WebsiteAnalysis = {
            url: url,                    
            analyzedAt: new Date().toISOString(), 
            originalHTML: html,         
            originalCSS: css,            
            // detectedComponents,         
            // usedFramework,              
            // allClasses,                 
            // allFonts,                   
            // allColors,                  
            // cssComponents,              
            // classUsage                  
        };
        
        return analysis;
    }
}