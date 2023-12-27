import { IconType } from "react-icons";

export interface LinkItemChildren {
 title: string;
 href: string;
}
export interface LinkItemProps {
 name: string;
 icon: IconType;
 children: LinkItemChildren[];
}
