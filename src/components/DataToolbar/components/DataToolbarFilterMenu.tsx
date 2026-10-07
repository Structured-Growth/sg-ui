"use client";
import { useEffect, useRef, useState } from "react";
import { Button } from "../../../experimental/Button/Button";
import { IconButton } from "../../../experimental/IconButton/IconButton";
import { Checkbox } from "../../../experimental/Checkbox/Checkbox";
import { Select } from "../../../experimental/Select/Select";
import { Popover } from "../../../experimental/Popover/Popover";
import { AddIcon } from "../../../experimental/icons/AddIcon";
import { CloseIcon } from "../../../experimental/icons/CloseIcon";
import { FilterListIcon } from "../../../experimental/icons/FilterListIcon";
import { useTranslation } from "../../../i18n";
import { parseFilterRuleValues, serializeFilterRuleValues } from "../filterRuleValue";
import styles from "./DataToolbarFilterMenu.module.css";
export type DataToolbarFilterFieldType = "string" | "number" | "date" | "enum";

export type DataToolbarFilterField = {
  id: string;
  label: string;
  type: DataToolbarFilterFieldType;
  enumOptions?: Array<{ id: string; label: string }>;
};

export type DataToolbarFilterOperator =
  | "contains"
  | "equals"
  | "starts_with"
  | "ends_with"
  | "is_empty"
  | "is_not_empty"
  | "eq"
  | "neq"
  | "gt"
  | "gte"
  | "lt"
  | "lte"
  | "on"
  | "before"
  | "after"
  | "on_or_before"
  | "on_or_after"
  | "is"
  | "is_not";

export type DataToolbarFilterRule = {
  field: string;
  operator: DataToolbarFilterOperator | "";
  value: string;
};

export type DataToolbarFilterMenuProps = {
  fields: DataToolbarFilterField[];
  value: DataToolbarFilterRule[];
  onApply: (nextRules: DataToolbarFilterRule[]) => void;
};

type OperatorOption = {
  id: DataToolbarFilterOperator;
  labelKey: string;
  defaultMessage: string;
  requiresValue: boolean;
};

const operatorConfig: Record<DataToolbarFilterFieldType, OperatorOption[]> = {
  string: [
    { id: "contains", labelKey: "common.ui.filter.operator.contains", defaultMessage: "contains", requiresValue: true },
    { id: "equals", labelKey: "common.ui.filter.operator.equals", defaultMessage: "=", requiresValue: true },
    {
      id: "starts_with",
      labelKey: "common.ui.filter.operator.startsWith",
      defaultMessage: "starts with",
      requiresValue: true,
    },
    { id: "ends_with", labelKey: "common.ui.filter.operator.endsWith", defaultMessage: "ends with", requiresValue: true },
    { id: "is_empty", labelKey: "common.ui.filter.operator.isEmpty", defaultMessage: "is empty", requiresValue: false },
    {
      id: "is_not_empty",
      labelKey: "common.ui.filter.operator.isNotEmpty",
      defaultMessage: "is not empty",
      requiresValue: false,
    },
  ],
  number: [
    { id: "eq", labelKey: "common.ui.filter.operator.eq", defaultMessage: "=", requiresValue: true },
    { id: "neq", labelKey: "common.ui.filter.operator.neq", defaultMessage: "!=", requiresValue: true },
    { id: "gt", labelKey: "common.ui.filter.operator.gt", defaultMessage: ">", requiresValue: true },
    { id: "gte", labelKey: "common.ui.filter.operator.gte", defaultMessage: ">=", requiresValue: true },
    { id: "lt", labelKey: "common.ui.filter.operator.lt", defaultMessage: "<", requiresValue: true },
    { id: "lte", labelKey: "common.ui.filter.operator.lte", defaultMessage: "<=", requiresValue: true },
  ],
  date: [
    { id: "on", labelKey: "common.ui.filter.operator.on", defaultMessage: "on", requiresValue: true },
    { id: "before", labelKey: "common.ui.filter.operator.before", defaultMessage: "before", requiresValue: true },
    { id: "after", labelKey: "common.ui.filter.operator.after", defaultMessage: "after", requiresValue: true },
    {
      id: "on_or_before",
      labelKey: "common.ui.filter.operator.onOrBefore",
      defaultMessage: "on or before",
      requiresValue: true,
    },
    { id: "on_or_after", labelKey: "common.ui.filter.operator.onOrAfter", defaultMessage: "on or after", requiresValue: true },
  ],
  enum: [
    { id: "is", labelKey: "common.ui.filter.operator.is", defaultMessage: "is", requiresValue: true },
    { id: "is_not", labelKey: "common.ui.filter.operator.isNot", defaultMessage: "is not", requiresValue: true },
  ],
};

const createEmptyRule = (): DataToolbarFilterRule => ({
  field: "",
  operator: "",
  value: "",
});

const getFieldById = (fields: DataToolbarFilterField[], fieldId: string) => fields.find((field) => field.id === fieldId);

const getOperatorsForField = (field?: DataToolbarFilterField) => (field ? operatorConfig[field.type] : []);

const hasRuleValue = (rule: DataToolbarFilterRule, field: DataToolbarFilterField) => {
  if (field.type === "enum") {
    return parseFilterRuleValues(rule.value).length > 0;
  }

  return Boolean(rule.value.trim());
};

type DraftRule = DataToolbarFilterRule & { draftId: number };

export function DataToolbarFilterMenu({ fields, value, onApply }: DataToolbarFilterMenuProps) {
  const [open, setOpen] = useState(false);
  const [draftRules, setDraftRules] = useState<DraftRule[]>([]);
  const nextId = useRef(0);
  const columnTriggers = useRef(new Map<number, HTMLButtonElement>());
  const pendingFocus = useRef<number | null>(null);
  useEffect(() => {
    const draftId = pendingFocus.current;
    pendingFocus.current = null;
    if (!open || draftId === null) return;
    // Let React Aria finish press handling before focusing the surviving row.
    const timer = setTimeout(() => columnTriggers.current.get(draftId)?.focus(), 0);
    return () => clearTimeout(timer);
  }, [draftRules, open]);
  const makeDraft = (rule: DataToolbarFilterRule): DraftRule => ({ ...rule, draftId: nextId.current++ });
  const { t, useNamespace } = useTranslation();
  useNamespace("common.ui");
  const tr = (key: string, defaultMessage: string) => t(key, { defaultMessage, namespace: "common.ui" });
  const sanitize = (rules: DataToolbarFilterRule[]) => rules.flatMap(rule => {
    const field = getFieldById(fields, rule.field);
    const operator = getOperatorsForField(field).find(option => option.id === rule.operator);
    if (!field || !operator || (operator.requiresValue && !hasRuleValue(rule, field))) return [];
    return [{ field: rule.field, operator: rule.operator, value: operator.requiresValue ? rule.value : "" }];
  });
  const count = sanitize(value).length;
  const updateRule = (index: number, patch: Partial<DataToolbarFilterRule>) =>
    setDraftRules(previous => previous.map((rule, current) => current === index ? { ...rule, ...patch } : rule));
  const columnsLabel = tr("common.ui.filter.columns", "Columns");
  const operatorLabel = tr("common.ui.filter.operator", "Operator");
  const valueLabel = tr("common.ui.filter.value", "Value");
  return <Popover title={tr("common.ui.toolbar.filter", "Filter")} size="lg" open={open}
    onOpenChange={nextOpen => {
      pendingFocus.current = null;
      if (nextOpen) setDraftRules((value.length ? value : [createEmptyRule()]).map(makeDraft));
      setOpen(nextOpen);
    }}
    trigger={<Button variant="outlined" tone="neutral" density="compact" startIcon={<FilterListIcon />}>
      {tr("common.ui.toolbar.filter", "Filter")}
      {count > 0 && <> <span className={styles.badge}>{count}</span></>}
    </Button>}>
    <div className={styles.rules} data-sgui-density="compact">
      {draftRules.map((rule, index) => {
        const field = getFieldById(fields, rule.field);
        const operators = getOperatorsForField(field);
        const requiresValue = operators.find(operator => operator.id === rule.operator)?.requiresValue ?? false;
        const selectedValues = field?.type === "enum" ? parseFilterRuleValues(rule.value) : [];
        const valueName = `${valueLabel} ${index + 1}`;
        return <div key={rule.draftId} className={styles.row}>
          <Select ref={element => {
            if (element) columnTriggers.current.set(rule.draftId, element);
            else columnTriggers.current.delete(rule.draftId);
          }} label={`${columnsLabel} ${index + 1}`} value={rule.field || null}
            placeholder={tr("common.ui.filter.selectColumn", "Select column")} options={fields.map(option => ({ id: option.id, label: option.label }))}
            onValueChange={id => updateRule(index, { field: id ?? "", operator: getOperatorsForField(getFieldById(fields, id ?? ""))[0]?.id ?? "", value: "" })} />
          <Select label={`${operatorLabel} ${index + 1}`} value={rule.operator || null} disabled={!field}
            placeholder={tr("common.ui.filter.selectOperator", "Select operator")}
            options={operators.map(operator => ({ id: operator.id, label: tr(operator.labelKey, operator.defaultMessage) }))}
            onValueChange={id => updateRule(index, { operator: (id ?? "") as DataToolbarFilterRule["operator"], value: "" })} />
          {field?.type === "enum" ? <div className={styles.field}>
            <span className={styles.label}>{valueName}</span>
            <Popover title={valueName} trigger={<Button variant="outlined" tone="neutral" density="compact" disabled={!requiresValue} aria-label={valueName}>
              {selectedValues.length ? selectedValues.map(id => field.enumOptions?.find(option => option.id === id)?.label ?? id).join(", ") : tr("common.ui.filter.all", "All")}
            </Button>}>
              <div className={styles.options} data-sgui-density="compact">
                <Checkbox label={tr("common.ui.filter.all", "All")} checked={selectedValues.length === 0} onCheckedChange={() => updateRule(index, { value: "" })} />
                {(field.enumOptions ?? []).map(option => <Checkbox key={option.id} label={option.label} checked={selectedValues.includes(option.id)}
                  onCheckedChange={checked => updateRule(index, { value: serializeFilterRuleValues(checked ? [...selectedValues, option.id] : selectedValues.filter(id => id !== option.id)) })} />)}
              </div>
            </Popover>
          </div> : <label className={styles.field}>
            <span className={styles.label}>{valueName}</span>
            <input className={styles.input} disabled={!requiresValue} type={field?.type === "number" ? "number" : field?.type === "date" ? "date" : "text"}
              value={rule.value} placeholder={valueLabel} onChange={event => updateRule(index, { value: event.target.value })} />
          </label>}
          {draftRules.length > 1 && <IconButton label={`${tr("common.ui.filter.removeRule", "Remove filter")} ${index + 1}`} density="compact"
            onPress={() => {
              pendingFocus.current = (draftRules[index + 1] ?? draftRules[index - 1])?.draftId ?? null;
              setDraftRules(previous => previous.filter(current => current.draftId !== rule.draftId));
            }}><CloseIcon /></IconButton>}
        </div>;
      })}
    </div>
    <div className={styles.footer}>
      <IconButton label={tr("common.ui.filter.addRule", "Add filter")} variant="outlined" density="compact"
        onPress={() => {
          const rule = makeDraft(createEmptyRule());
          pendingFocus.current = rule.draftId;
          setDraftRules(previous => [...previous, rule]);
        }}><AddIcon /></IconButton>
      <div className={styles.actions}>
        <Button variant="outlined" tone="neutral" density="compact" onPress={() => {
          const rule = makeDraft(createEmptyRule());
          pendingFocus.current = rule.draftId;
          setDraftRules([rule]);
        }}>{tr("common.ui.common.reset", "Reset")}</Button>
        <Button variant="text" tone="neutral" density="compact" onPress={() => setOpen(false)}>{tr("common.ui.common.cancel", "Cancel")}</Button>
        <Button density="compact" onPress={() => { onApply(sanitize(draftRules)); setOpen(false); }}>{tr("common.ui.common.apply", "Apply")}</Button>
      </div>
    </div>
  </Popover>;
}
