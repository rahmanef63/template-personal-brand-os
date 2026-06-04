/** PropertyType → config-panel mapping for the Edit-property submenu.
 *  Types absent here render only the shared Name + Description rows. */

import type { ComponentType } from "react";
import type { PropertyType } from "../../../types";
import type { PanelProps } from "./atoms";
import { NumberPanel } from "./NumberPanel";
import { DatePanel } from "./DatePanel";
import { FormulaPanel, UniqueIdPanel, SelectPanel } from "./MiscPanels";
import { RelationPanel, RollupPanel } from "./RelationRollupPanels";

export const PROPERTY_TYPE_PANEL: Partial<Record<PropertyType, ComponentType<PanelProps>>> = {
  number: NumberPanel,
  date: DatePanel,
  created_time: DatePanel,
  last_edited_time: DatePanel,
  formula: FormulaPanel,
  unique_id: UniqueIdPanel,
  select: SelectPanel,
  multi_select: SelectPanel,
  status: SelectPanel,
  relation: RelationPanel,
  rollup: RollupPanel,
};
