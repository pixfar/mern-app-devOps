// types.ts

export interface ContentItem {
  dir: string;
  fontName: string;
  hasEOL: boolean;
  height: number;
  str: string;
  transform: number[];
  width: number;
}

export interface Result {
  contents: ContentItem[];
  sectionTitle: string;
  contents_string: string;
  law: string;
  documentTitle: string;
}

export interface DataObject {
  fullLine_String: string;
  law: string;
  line: number;
  match: string;
  number: number | null;
  result: Result;
  createdAt: string;
  updatedAt: string;
  _id: string;
  section: string;
  sentence: string | null;
  subsection: string | null;
}

export type SideNavItem = {
  title: string;
  path: string;
  icon?: JSX.Element;
  submenu?: boolean;
  subMenuItems?: SideNavItem[];
};

export type FAQ = {
  id: number;
  quest: string;
  ans: string;
};
