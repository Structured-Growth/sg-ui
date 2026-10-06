"use client";

import { useMemo, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import FilterListIcon from "@mui/icons-material/FilterList";
import Badge from "@mui/material/Badge";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import ListItemText from "@mui/material/ListItemText";
import MenuItem from "@mui/material/MenuItem";
import Popover from "@mui/material/Popover";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import type { SelectChangeEvent } from "@mui/material/Select";
import { useTranslation } from "../../../i18n";
import { toLabelKey } from "../../../i18n/labelKey";
import { parseFilterRuleValues, serializeFilterRuleValues } from "../filterRuleValue";

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

type DataToolbarFilterMenuProps = {
  fields: DataToolbarFilterField[];
  value: DataToolbarFilterRule[];
  onApply: (nextRules: DataToolbarFilterRule[]) => void;
};

const toolbarButtonSx = {
  borderColor: "divider",
  color: "text.secondary",
  pl: 1.25,
  pr: 2.25,
  py: 0.25,
  textTransform: "none",
};

const compactSelectMenuProps = {
  MenuListProps: {
    dense: true,
  },
  PaperProps: {
    sx: {
      minWidth: 180,
    },
  },
};

const compactSelectMenuItemSx = {
  fontSize: 13,
  minHeight: 30,
  px: 1.25,
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

export function DataToolbarFilterMenu({ fields, value, onApply }: DataToolbarFilterMenuProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [draftRules, setDraftRules] = useState<DataToolbarFilterRule[]>(value.length ? value : [createEmptyRule()]);
  const { t, useNamespace } = useTranslation();
  useNamespace("common.ui");
  const tr = (key: string, defaultMessage: string) => t(key, { defaultMessage, namespace: "common.ui" });
  const trLabel = (label: string) => t(toLabelKey("common.ui.label", label), { defaultMessage: label, namespace: "common.ui" });
  const isOpen = Boolean(anchorEl);

  const addRule = () => {
    setDraftRules((prev) => [...prev, createEmptyRule()]);
  };

  const removeRule = (index: number) => {
    setDraftRules((prev) => prev.filter((_, currentIndex) => currentIndex !== index));
  };

  const updateField = (index: number, event: SelectChangeEvent<string>) => {
    const nextFieldId = event.target.value;
    const nextField = getFieldById(fields, nextFieldId);
    const nextOperators = getOperatorsForField(nextField);
    setDraftRules((prev) =>
      prev.map((rule, currentIndex) =>
        currentIndex === index
          ? {
              field: nextFieldId,
              operator: nextOperators[0]?.id ?? "",
              value: "",
            }
          : rule,
      ),
    );
  };

  const updateOperator = (index: number, event: SelectChangeEvent<string>) => {
    const nextOperator = event.target.value as DataToolbarFilterOperator;
    setDraftRules((prev) =>
      prev.map((rule, currentIndex) =>
        currentIndex === index
          ? {
              ...rule,
              operator: nextOperator,
              value: "",
            }
          : rule,
      ),
    );
  };

  const updateValue = (index: number, nextValue: string) => {
    setDraftRules((prev) =>
      prev.map((rule, currentIndex) =>
        currentIndex === index
          ? {
              ...rule,
              value: nextValue,
            }
          : rule,
      ),
    );
  };

  const updateEnumValues = (index: number, nextValues: string[]) => {
    setDraftRules((prev) =>
      prev.map((rule, currentIndex) =>
        currentIndex === index
          ? {
              ...rule,
              value: nextValues.length > 0 ? serializeFilterRuleValues(nextValues) : "",
            }
          : rule,
      ),
    );
  };

  const activeRuleCount = useMemo(
    () =>
      value.filter((rule) => {
        const field = getFieldById(fields, rule.field);
        if (!field || !rule.operator) {
          return false;
        }

        const operator = getOperatorsForField(field).find((item) => item.id === rule.operator);
        if (!operator) {
          return false;
        }

        if (!operator.requiresValue) {
          return true;
        }

        return hasRuleValue(rule, field);
      }).length,
    [fields, value],
  );

  return (
    <>
      <Badge
        badgeContent={activeRuleCount > 0 ? activeRuleCount : 0}
        anchorOrigin={{ horizontal: "right", vertical: "top" }}
        color="primary"
        overlap="rectangular"
        sx={{
          "& .MuiBadge-badge": {
            fontSize: 12,
            fontWeight: 700,
            minWidth: 22,
            right: 6,
            top: 6,
          },
        }}
      >
        <Button
          onClick={(event) => {
            setDraftRules(value.length ? value : [createEmptyRule()]);
            setAnchorEl(event.currentTarget);
          }}
          size="small"
          startIcon={<FilterListIcon fontSize="small" />}
          sx={toolbarButtonSx}
          variant="outlined"
        >
          {tr("common.ui.toolbar.filter", "Filter")}
        </Button>
      </Badge>

      <Popover
        anchorEl={anchorEl}
        anchorOrigin={{ horizontal: "left", vertical: "bottom" }}
        disableScrollLock
        onClose={() => setAnchorEl(null)}
        open={isOpen}
        transformOrigin={{ horizontal: "left", vertical: "top" }}
      >
        <Box sx={{ minWidth: 820, p: 2 }}>
          <Box sx={{ display: "grid", gap: 1.5, gridTemplateColumns: "1fr 1fr 1fr 32px", mb: 1 }}>
            <Typography sx={{ fontSize: 13, fontWeight: 700 }}>{tr("common.ui.filter.columns", "Columns")}</Typography>
            <Typography sx={{ fontSize: 13, fontWeight: 700 }}>{tr("common.ui.filter.operator", "Operator")}</Typography>
            <Typography sx={{ fontSize: 13, fontWeight: 700 }}>{tr("common.ui.filter.value", "Value")}</Typography>
            <Box />
          </Box>

          <Box sx={{ display: "grid", gap: 1.5 }}>
            {draftRules.map((rule, index) => {
              const field = getFieldById(fields, rule.field);
              const operators = getOperatorsForField(field);
              const selectedOperator = operators.find((operator) => operator.id === rule.operator);
              const requiresValue = selectedOperator?.requiresValue ?? false;
              const isEnumField = field?.type === "enum";
              const selectedEnumValues = isEnumField ? parseFilterRuleValues(rule.value) : [];

              return (
                <Box key={`${rule.field}-${index}`} sx={{ alignItems: "flex-end", display: "grid", gap: 1.5, gridTemplateColumns: "1fr 1fr 1fr 32px" }}>
                  <Select
                    MenuProps={compactSelectMenuProps}
                    displayEmpty
                    fullWidth
                    onChange={(event) => updateField(index, event)}
                    size="small"
                    value={rule.field}
                    variant="standard"
                  >
                    <MenuItem sx={compactSelectMenuItemSx} value="">
                      <em>{tr("common.ui.filter.selectColumn", "Select column")}</em>
                    </MenuItem>
                    {fields.map((fieldOption) => (
                      <MenuItem key={fieldOption.id} sx={compactSelectMenuItemSx} value={fieldOption.id}>
                        {trLabel(fieldOption.label)}
                      </MenuItem>
                    ))}
                  </Select>

                  <Select
                    MenuProps={compactSelectMenuProps}
                    displayEmpty
                    fullWidth
                    onChange={(event) => updateOperator(index, event)}
                    size="small"
                    value={rule.operator}
                    variant="standard"
                  >
                    <MenuItem sx={compactSelectMenuItemSx} value="">
                      <em>{tr("common.ui.filter.selectOperator", "Select operator")}</em>
                    </MenuItem>
                    {operators.map((operator) => (
                      <MenuItem key={operator.id} sx={compactSelectMenuItemSx} value={operator.id}>
                        {tr(operator.labelKey, operator.defaultMessage)}
                      </MenuItem>
                    ))}
                  </Select>

                  {isEnumField ? (
                    <Select
                      disabled={!requiresValue || !field}
                      displayEmpty
                      fullWidth
                      MenuProps={compactSelectMenuProps}
                      multiple
                      onChange={(event) => {
                        const nextValues = event.target.value;
                        updateEnumValues(
                          index,
                          Array.isArray(nextValues)
                            ? nextValues
                            : nextValues
                                .split(",")
                                .map((item) => item.trim())
                                .filter(Boolean),
                        );
                      }}
                      renderValue={(selected) => {
                        if (!Array.isArray(selected) || selected.length === 0) {
                          return tr("common.ui.filter.selectValues", "Select values");
                        }

                        const labelById = new Map((field?.enumOptions ?? []).map((option) => [option.id, option.label]));
                        return selected.map((id) => trLabel(labelById.get(id) ?? id)).join(", ");
                      }}
                      size="small"
                      value={selectedEnumValues}
                      variant="standard"
                    >
                      {(field?.enumOptions ?? []).map((option) => (
                        <MenuItem key={option.id} sx={compactSelectMenuItemSx} value={option.id}>
                          <Checkbox checked={selectedEnumValues.includes(option.id)} size="small" />
                          <ListItemText primary={trLabel(option.label)} primaryTypographyProps={{ fontSize: 13 }} />
                        </MenuItem>
                      ))}
                    </Select>
                  ) : (
                    <TextField
                      disabled={!requiresValue}
                      fullWidth
                      onChange={(event) => updateValue(index, event.target.value)}
                      placeholder={tr("common.ui.filter.valueInput", "Value")}
                      size="small"
                      type={field?.type === "number" ? "number" : field?.type === "date" ? "date" : "text"}
                      value={rule.value}
                      variant="standard"
                    />
                  )}

                  <Box sx={{ alignItems: "center", display: "grid", minHeight: 32, width: 32 }}>
                    {draftRules.length > 1 ? (
                      <IconButton onClick={() => removeRule(index)} size="small">
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    ) : (
                      <Box sx={{ height: 32, width: 32 }} />
                    )}
                  </Box>
                </Box>
              );
            })}
          </Box>

          <Box sx={{ alignItems: "center", display: "flex", justifyContent: "space-between", mt: 1.5 }}>
            <IconButton
              onClick={addRule}
              size="small"
              sx={{
                border: 1,
                borderColor: "primary.main",
                borderRadius: 1,
                color: "primary.main",
                p: 0.5,
              }}
            >
              <AddIcon fontSize="small" />
            </IconButton>

            <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
              <Button onClick={() => setDraftRules([createEmptyRule()])} size="small" variant="outlined">
                {tr("common.ui.common.reset", "Reset")}
              </Button>
              <Button
                onClick={() => {
                  const nextRules = draftRules.filter((rule) => {
                    const currentField = getFieldById(fields, rule.field);
                    if (!currentField || !rule.operator) {
                      return false;
                    }

                    const operator = getOperatorsForField(currentField).find((item) => item.id === rule.operator);
                    if (!operator) {
                      return false;
                    }

                    if (!operator.requiresValue) {
                      return true;
                    }

                    return hasRuleValue(rule, currentField);
                  });

                  onApply(nextRules);
                  setAnchorEl(null);
                }}
                size="small"
                variant="contained"
              >
                {tr("common.ui.common.apply", "Apply")}
              </Button>
            </Box>
          </Box>
        </Box>
      </Popover>
    </>
  );
}
