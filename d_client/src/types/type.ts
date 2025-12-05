export type Collecting = CollectingSuccess | CollectingError;

export type CollectingSuccess = {
  success: true;
  url: string;
  html: string;
  css: string;
};

export type CollectingError = {
  success: false;
  error: string;
};

export type WebsiteAnalysis = {
  url: string;
  analyzedAt: string;
  originalHTML: string;
  originalCSS: string;
  detectedComponents: DetectedComponent[];
  usedFramework: string | null;
  allClasses: string[];
  allFonts: string[];
  allColors: string[];
  cssComponents: CSSBlock[];
  classUsage: ClassUsage[];
};

export type DetectedComponent = {
  name: string;
  type: string;
  html: string;
  classes: string[];
  frequency: number;
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