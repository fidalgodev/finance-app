"use client";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { InferResponseType } from "hono";
import { ArrowUpDown, TriangleAlert } from "lucide-react";

import { client } from "@/lib/hono";
import { cn, formatCurrency } from "@/lib/utils";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

import { Actions } from "./Actions";
import { CategoryColumn } from "./CategoryColumn";

export type TransactionsResponseType = InferResponseType<
  typeof client.api.transactions.$get,
  200
>["data"][0];

export const columns: ColumnDef<TransactionsResponseType>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "date",
    header: ({ column }) => {
      return (
        <Button
          variant="link"
          className="-ml-2 p-2"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = row.getValue("date") as Date;
      return <span>{format(date, "dd MMMM, yyyy")}</span>;
    },
  },
  {
    accessorKey: "category",
    header: () => {
      return <p>Category</p>;
    },
    cell: ({ row }) => {
      const { category, id } = row.original;

      return <CategoryColumn transactionId={id} category={category} />;
    },
  },
  {
    accessorKey: "payee",
    header: () => {
      return <p>Payee</p>;
    },
  },
  {
    accessorKey: "amount",
    header: () => {
      return <p>Amount</p>;
    },
    cell: ({ row }) => {
      const { amount } = row.original;

      return (
        <Badge
          variant={amount < 0 ? "destructive" : "primary"}
          className="text-sm font-medium px-2.5 py-1.5"
        >
          {formatCurrency(amount)}
        </Badge>
      );
    },
  },
  {
    accessorKey: "account",
    header: () => {
      return <p>Account</p>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <Actions id={row.original.id} />,
  },
];
