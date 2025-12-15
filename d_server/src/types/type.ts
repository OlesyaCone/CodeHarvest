export type WebsiteAnalysis = {
  url: string;
  analyzedAt: string;
  originalHTML: string;
  originalCSS: string;
  detectedComponents: DetectedComponent[];
  allClasses: string[];
  allFonts: allFonts[];
  allColors: string[];
  cssComponents: CSSBlock[];
  classUsage: ClassUsage[];
};

export type allFonts = {
  html: string;
  css: string;
};

export type DetectedComponent = {
  name: string;
  type: string;
  html: string;
  css: string;
  classes: string[];
};

export type CSSBlock = {
  selector: string;
  cssCode: string;
  appliesTo: string[];
};

export type ClassUsage = {
  className: string;
  usedInComponents: string[];
  cssRules: string;
};
