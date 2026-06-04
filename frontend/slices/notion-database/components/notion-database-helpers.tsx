"use client";

/** Column header render helper for NotionDatabase. Extracted to keep
 *  the orchestrator file under the 200-LOC audit cap. Maps the host's
 *  property/view callbacks onto the config-driven ColumnHeaderMenu. */

import { ColumnHeaderMenu } from "./ColumnHeaderMenu";
import type { Database, DatabaseViewConfig, Property } from "../types";

interface Args {
  prop: Property;
  db: Database;
  activeView: DatabaseViewConfig;
  /** Workspace catalog — relation / rollup config panels need it. */
  databases?: Database[];
  onPropertyUpdate?: (propId: string, patch: Partial<Property>) => void;
  onPropertyRemove?: (propId: string) => void;
  onPropertyDuplicate?: (propId: string) => void;
  /** offset -1 = insert left of `propId`, +1 = insert right. */
  onPropertyInsert?: (propId: string, offset: -1 | 1) => void;
  /** offset -1 = move `propId` left, +1 = move right. */
  onPropertyMove?: (propId: string, offset: -1 | 1) => void;
  onViewConfigChange?: (viewId: string, patch: Partial<DatabaseViewConfig>) => void;
}

export function buildColumnHeader({
  prop, db, activeView, databases,
  onPropertyUpdate, onPropertyRemove, onPropertyDuplicate,
  onPropertyInsert, onPropertyMove, onViewConfigChange,
}: Args) {
  const index = db.properties.findIndex((p) => p.id === prop.id);
  return (
    <ColumnHeaderMenu
      prop={prop}
      view={activeView}
      index={index}
      propertyCount={db.properties.length}
      db={db}
      databases={databases}
      onPatch={onPropertyUpdate ? (patch) => onPropertyUpdate(prop.id, patch) : undefined}
      onTypeChange={onPropertyUpdate ? (type) => onPropertyUpdate(prop.id, { type }) : undefined}
      onHide={onPropertyUpdate ? () => onPropertyUpdate(prop.id, { hidden: true }) : undefined}
      onDelete={onPropertyRemove ? () => onPropertyRemove(prop.id) : undefined}
      onDuplicate={onPropertyDuplicate ? () => onPropertyDuplicate(prop.id) : undefined}
      onInsert={onPropertyInsert ? (offset) => onPropertyInsert(prop.id, offset) : undefined}
      onMove={onPropertyMove ? (offset) => onPropertyMove(prop.id, offset) : undefined}
      onViewConfigChange={onViewConfigChange
        ? (patch) => onViewConfigChange(activeView.id, patch)
        : undefined}
    />
  );
}
