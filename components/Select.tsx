"use client";

import { useMemo } from "react";
import CreatableSelect from "react-select/creatable";

type Props = {
  onChange: (value?: string) => void;
  onCreate?: (name: string) => void;
  options?: { label: string; value: string }[];
  value?: string | null;
  disabled?: boolean;
  placeholder?: string;
};

export const Select = ({
  value,
  onChange,
  onCreate,
  options = [],
  disabled = false,
  placeholder,
}: Props) => {
  const selectedValue = useMemo(() => {
    return options.find((option) => option.value === value);
  }, [options, value]);

  return (
    <CreatableSelect
      value={selectedValue}
      options={options}
      placeholder={placeholder}
      onChange={(newOption) => onChange(newOption?.value)}
      onCreateOption={onCreate}
      isDisabled={disabled}
      className="text-sm h-10"
      styles={{
        control: (styles) => ({
          ...styles,
          borderColor: "#e2e8f0",
          ":hover": {
            borderColor: "#e2e8f0",
          },
        }),
      }}
    />
  );
};
