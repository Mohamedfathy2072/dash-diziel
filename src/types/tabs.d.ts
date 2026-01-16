import type { ReactNode } from "react";

interface TabPanelProps {
  children?: ReactNode;
  index: number;
  value: number;
}

interface PrimaryTabsTypes {
  variant: "EMPLOYEE";
  tabsTitles: string[];
  children: ReactNode;
  disabled?: boolean;
}

interface SecondaryTabsTypes {
  variant: "PACKAGE";
  tabsTitles: string[];
  children: ReactNode;
  disabled?: boolean;
}

export type { PrimaryTabsTypes, SecondaryTabsTypes, TabPanelProps };
