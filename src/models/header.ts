export interface SubLabelNavItem {
  subLabelNavItem: string;
}
export interface SubLabel {
  subLabelName: string;
  children: SubLabelNavItem[];
}

export interface FeaturedItem {
  categoryName: string;
  imgPath: string;
}
export interface SubLabels {
  label: string;
  subLabels: SubLabel[];
}

export interface NavItem {
  label: string;
  children?: SubLabels[];
  href?: string;
  featuredItems?: FeaturedItem[];
}
