export type Collecting = CollectingSuccess | CollectingError;

export type CollectingSuccess = {
  success: true;
  url: string;
  html: string;
  css: string;
  screenshot: string;
  allFonts: allFonts;
  allColors: string[];
  AllComponents: AllComponents;
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
};

export type AllComponents = {
  components: Component[];
  location: Location;
};

export type Component = {
  class: Class[];
  css: string;
  html: string;
};

export type Class = {
  name: string;
  position: number;
};

export type Location = {
  class: Class[];
  css: string;
  html: string;
};

export type UXComponentType =
  | "card"
  | "button"
  | "modal"
  | "input"
  | "navbar"
  | "list";
