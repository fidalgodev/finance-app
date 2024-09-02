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

  // Check how many required options are selected
  const progress = Object.values(selectedColumns).reduce((acc, column) => {
    return requiredOptions.includes(column) ? acc + 1 : acc;
  }, 0);

  const handleContinue = () => {
    const mappedData = {
      headers: headers.map(
        (_, index) => selectedColumns[`column_${index}`] || null,
      ),
      body: body
        .map((row) =>
          row.map((cell, index) =>
            selectedColumns[`column_${index}`] ? cell : null,
          ),
        )
        .filter((row) => row.some((item) => item)),
    };

    console.log({ mappedData });

    const arrayOfData = mappedData.body.map((row) =>
      row.reduce((acc: any, cell, index) => {
        const header = mappedData.headers[index];
        if (header) acc[header] = cell;

        return acc;
      }, {}),
    );

    console.log({ arrayOfData });

    const formattedData = arrayOfData.map((item) => ({
      ...item,
      amount: convertAmountToMiliUnits(parseFloat(item.amount)),
      date: format(parse(item.date, dateFormat, new Date()), outputFormat),
    }));

    console.log({ formattedData });

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
              onClick={handleContinue}
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
