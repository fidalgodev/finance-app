"use client";

import { format, subDays } from "date-fns";
import { ChevronDown } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import qs from "query-string";
import { useState } from "react";
import { DateRange } from "react-day-picker";

import { cn, formatDateRange } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export const DateFilter = () => {
  const router = useRouter();
  const pathname = usePathname();

  const params = useSearchParams();
  const accountId = params.get("accountId");
  const from = params.get("from") || "";
  const to = params.get("to") || "";

  const defaultTo = new Date();
  const defaultFrom = subDays(defaultTo, 30);

  // Initial state from URL params or default
  const paramState = {
    from: from ? new Date(from) : defaultFrom,
    to: to ? new Date(to) : defaultTo,
  };

  const [date, setDate] = useState<DateRange | undefined>(paramState);
  const [isOpen, setIsOpen] = useState(false);

  const pushToUrl = (dateRange?: DateRange) => {
    const from = dateRange?.from ? format(dateRange?.from, "yyyy-MM-dd") : null;
    const to = dateRange?.to ? format(dateRange?.to, "yyyy-MM-dd") : null;

    const url = qs.stringifyUrl(
      {
        url: pathname,
        query: {
          from,
          to,
          accountId,
        },
      },
      { skipEmptyString: true, skipNull: true },
    );

    router.push(url);
  };

  const onReset = () => {
    // Reset to default date range
    setDate({
      from: defaultFrom,
      to: defaultTo,
    });
    pushToUrl();
    setIsOpen(false);
  };

  const onSubmit = () => {
    pushToUrl(date);
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen}>
      <PopoverTrigger asChild>
        <Button
          disabled={false}
          size="sm"
          variant="outline"
          className="lg:w-auto w-full h-9 rounded-md px-3 font-normal bg-white/10 hover:bg-white/20 hover:text-white border-none focus:ring-offset-0 focus:ring-transparent outline-none text-white focus:bg-white/30 transition"
          onClick={() => setIsOpen(true)}
        >
          <span>{formatDateRange(paramState)}</span>
          <ChevronDown className="ml-2 size-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="lg:w-auto w-full p-0"
        align="start"
        onPointerDownOutside={() => setIsOpen(false)}
      >
        <Calendar
          disabled={false}
          initialFocus
          mode="range"
          defaultMonth={date?.from}
          selected={date}
          onSelect={setDate}
          numberOfMonths={2}
        />
        <div className="p-4 w-full flex items-center gap-x-2">
          <Button
            onClick={onReset}
            disabled={!date?.from || !date?.to}
            className="w-full"
            variant="outline"
          >
            Reset
          </Button>
          <Button
            onClick={onSubmit}
            disabled={!date?.from || !date?.to}
            className="w-full"
          >
            Apply
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};
