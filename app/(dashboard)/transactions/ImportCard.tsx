import { format, parse } from "date-fns";
import { useState } from "react";

import { convertAmountToMiliUnits } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { ImportTable } from "./ImportTable";

const dateFormat = "yyyy-MM-dd HH:mm:ss";
const outputFormat = "yyyy-MM-dd";

export const requiredOptions = ["amount", "date", "payee"];

// Types
interface SelectedColumnsState {
  [key: string]: string;
}

type Props = {
  data: string[][];
  onCancel: () => void;
  onSubmit: (data: any) => void;
};

export const ImportCard = ({ data, onCancel, onSubmit }: Props) => {
  const [selectedColumns, setSelectedColumns] = useState<SelectedColumnsState>(
    {},
  );

  const headers = data[0];
  const body = data.slice(1);

  const onTableHeadSelectChange = (columnIndex: number, value: string) => {
    setSelectedColumns((prev) => ({
      ...prev,
      [`column_${columnIndex}`]: value,
    }));
  };

  // Check how many options are selected
  const progress = Object.values(selectedColumns).filter(
    (v) => v && v !== "skip",
  ).length;

  const handleImport = () => {
    const mappedData = {
      headers: headers.map(
        // Set the header to null if it's not selected
        (_, index) => selectedColumns[`column_${index}`] || null,
      ),
      body: body
        .map((row) =>
          row.map((cell, index) =>
            selectedColumns[`column_${index}`] ? cell : null,
          ),
        )
        // Clears empty rows by making sure at least one cell is not null
        .filter((row) => row.some((cell) => !!cell)),
    };

    const arrayOfData = mappedData.body.map((row) =>
      /**
        For each row, build an object with the header as the key.

        Example:
        mappedData.headers = ["null", "date"]
        mappedData.body = [
          ["whatever", "2021-01-01"],
          ["whatever", "2021-01-02"]
        ]

        Will result in the following:
        // First cell on each row is skipped because it's not selected in the headers
        [
          { date: "2021-01-01" },
          { date: "2021-01-02" },
        ]
      */
      row.reduce((acc: any, cell, index) => {
        const header = mappedData.headers[index];
        if (header) acc[header] = cell;

        return acc;
      }, {}),
    );

    const formattedData = arrayOfData.map((transaction) => ({
      ...transaction,
      amount: convertAmountToMiliUnits(parseFloat(transaction.amount)),
      date: format(
        parse(transaction.date, dateFormat, new Date()),
        outputFormat,
      ),
    }));

    onSubmit(formattedData);
  };

  return (
    <div className="mx-auto -mt-24 max-w-screen-xl pb-10">
      <Card className="border-none drop-shadow-sm">
        <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
          <CardTitle className="line-clamp-1 text-xl">
            Import Transaction
          </CardTitle>
          <div className="flex gap-2 flex-col lg:flex-row">
            <Button size="sm" className="w-full lg:w-auto" onClick={onCancel}>
              Cancel
            </Button>
            <Button
              size="sm"
              disabled={progress < requiredOptions.length}
              onClick={handleImport}
              className="w-full lg:w-auto"
            >
              Continue ({progress} / {requiredOptions.length})
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <ImportTable
            headers={headers}
            body={body}
            selectedColumns={selectedColumns}
            onTableHeadSelectChange={onTableHeadSelectChange}
          />
        </CardContent>
      </Card>
    </div>
  );
};
