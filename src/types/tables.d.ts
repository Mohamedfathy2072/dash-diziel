import type { ReactNode } from "react";
import type { EntityTypes } from "./app";

interface PrimaryTableTypes {
  children: ReactNode;
  variant?: EntityTypes;
  count?: number;
  currentCount?: number;
  pagination?: boolean;
  loading?: boolean;
  id?: string
}

export type { PrimaryTableTypes };
