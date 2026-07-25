export type ChipVariant =
  | "elevated"
  | "flat"
  | "tonal"
  | "outlined"
  | "text"
  | "plain";

export interface MenuItem {
  header?: string;
  title?: string;
  icon?: string;
  to?: string;
  divider?: boolean;
  chip?: string;
  chipColor?: string;
  chipVariant?: ChipVariant;
  chipIcon?: string;
  children?: MenuItem[];
  disabled?: boolean;
  type?: string;
  subCaption?: string;
}
