export type Collecting = CollectingSuccess | CollectingError;

export type CollectingSuccess = {
  success: true;
  url: string;
  html: string;
  css: string;
  screenshot: string;
  allFonts: allFonts;
  allColors: string[];
};

export type CollectingError = {
  success: false;
  error: string;
};

export type Baza = {
  allFonts: allFonts;
  allColors: allColors;
};

export type allFonts = {
  html: string;
  css: string;
};

export type allColors = {
  dark: string[];
  light: string[];
  other: string[];
}