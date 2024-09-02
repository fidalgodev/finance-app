import { cn } from "@/lib/utils";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { requiredOptions } from "./ImportCard";

type Props = {
  columnIndex: number;
  selectedColumns: Record<string, string>;
  onChange: (columnIndex: number, value: string) => void;
};

export const TableHeadSelect = ({
  columnIndex,
  selectedColumns,
  onChange,
}: Props) => {
  const currentSelection = selectedColumns[`column_${columnIndex}`];
  const options = [...requiredOptions, "notes"];

  const isOptionDisabled = (option: string) => {
    // Check if the option is already selected in another column
    return Object.values(selectedColumns).includes(option);
  };

  return (
    <Select
      value={currentSelection || "skip"}
      onValueChange={(value) => onChange(columnIndex, value)}
    >
      <SelectTrigger
        className={cn(
          "outline-none border-none bg-transparent capitalize",
          currentSelection && currentSelection !== "skip" && "text-blue-500",
        )}
      >
        <SelectValue placeholder="Skip" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="skip">Skip</SelectItem>
        {options.map((option, index) => {
          return (
            <SelectItem
              key={index}
              value={option}
              disabled={isOptionDisabled(option)}
              className="capitalize"
            >
              {option}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
};
