"use client";
import React, { useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from "@tremor/react";

import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { CSVLink } from "react-csv";
import { toast } from "sonner";

import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import {
  RiArrowDownSLine,
  RiArrowUpSLine,
  RiFileExcel2Fill,
  RiFileExcel2Line,
  RiMailAddLine,
} from "@remixicon/react";
import Suggestion from "./suggestion";
import { Button } from "./ui/button";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const ButtonFun = ({ onClick, disabled, children }) => {
  return (
    <button
      type="button"
      className="group px-2.5 py-2 text-tremor-default disabled:cursor-not-allowed disabled:opacity-50"
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

const TablePg = ({ data }) => {
  let timeField = "date";

  const keys = Object.keys(data.queryResult[0]);

  const tableData = useMemo(() => data.queryResult, []);

  const columns = keys.map((item) => {
    return {
      header: item.charAt(0).toUpperCase() + item.slice(1).replace(/_/g, " "),
      accessorKey: item.replace(/ /g, ""),
      enableSorting: true,
      meta: {
        align: "text-left",
      },
    };
  });

  console.log({ tableData, columns });

  const pageSize = 6;

  const table = useReactTable({
    data: tableData,
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize: pageSize,
      },
    },
  });

  function convertToTitleCase(str) {
    // Split the string by underscores
    const words = str.split("_");

    // Capitalize the first letter of each word and convert the rest to lowercase
    const titleCaseWords = words.map(
      (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    );

    // Join the words back together with spaces
    return titleCaseWords.join(" ");
  }

  const csvData = [
    keys.map((item) => convertToTitleCase(item)),
    ...data.queryResult,
  ];

  const sendMail = async (filename) => {
    try {
      await downloadCSV({
        filename: `${data.title.replaceAll(" ", "_")}.csv`,
        columns: keys.map((item) => convertToTitleCase(item)),
        records: data.queryResult,
      });

      const response = await fetch("/api/send-mail", {
        method: "POST",
        body: filename,
      });

      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      const responseData = await response.json();
      toast("Mail successfully sent");
      console.log(responseData);
    } catch (err) {
      console.error(err);
      toast("Error, please try resending the mail");
    }
  };

  const downloadCSV = async (data) => {
    try {
      const response = await fetch("/api/export/csv", {
        method: "POST",
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      const responseData = await response.json();
      toast("CSV downloaded");
      console.log(responseData);
      return responseData.filename; // Return the downloaded filename
    } catch (err) {
      console.error(err);
      toast("Error, please try again");
      throw err; // Rethrow the error to propagate it to the caller
    }
  };

  return (
    <div className="">
      <div className="flex justify-between items-start ">
        <h3 className="text-lg font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
          {data.title}
        </h3>
        <div className="flex gap-3">
          <Button
            size="sm"
            className="text-xs  flex items-center gap-2"
            onClick={() =>
              downloadCSV({
                filename: `${data.title.replaceAll(" ", "_")}.csv`,
                columns: keys.map((item) => convertToTitleCase(item)),
                records: data.queryResult,
              })
            }
          >
            <RiFileExcel2Line className="h-5 w-5" /> Export to CSV
          </Button>
        </div>
      </div>
      <Table className="mt-2">
        <TableHead>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow
              key={headerGroup.id}
              className="border-b border-tremor-border dark:border-dark-tremor-border"
            >
              {headerGroup.headers.map((header) => (
                <TableHeaderCell
                  key={header.id}
                  onClick={header.column.getToggleSortingHandler()}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      header.column.getToggleSortingHandler()(event);
                    }
                  }}
                  className={classNames(
                    header.column.getCanSort()
                      ? "cursor-pointer select-none"
                      : "",
                    "px-0.5 py-1.5"
                  )}
                  tabIndex={header.column.getCanSort() ? 0 : -1}
                  aria-sort={header.column.getIsSorted()}
                >
                  <div
                    className={classNames(
                      header.column.columnDef.enableSorting === true
                        ? "flex items-center justify-between gap-2 hover:bg-tremor-background-muted hover:dark:bg-dark-tremor-background-muted"
                        : header.column.columnDef.meta.align,
                      " rounded-tremor-default px-3 py-1.5"
                    )}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                    {header.column.getCanSort() ? (
                      <div className="-space-y-2">
                        <RiArrowUpSLine
                          className={classNames(
                            "h-4 w-4 text-tremor-content-strong dark:text-dark-tremor-content-strong",
                            header.column.getIsSorted() === "desc"
                              ? "opacity-30"
                              : ""
                          )}
                          aria-hidden={true}
                        />
                        <RiArrowDownSLine
                          className={classNames(
                            "h-4 w-4 text-tremor-content-strong dark:text-dark-tremor-content-strong",
                            header.column.getIsSorted() === "asc"
                              ? "opacity-30"
                              : ""
                          )}
                          aria-hidden={true}
                        />
                      </div>
                    ) : null}
                  </div>
                </TableHeaderCell>
              ))}
            </TableRow>
          ))}
        </TableHead>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <TableCell
                  key={cell.id}
                  className={classNames(cell.column.columnDef.meta.align)}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="mt-10 flex items-center justify-between">
        <p className="text-tremor-default tabular-nums text-tremor-content dark:text-dark-tremor-content">
          Page{" "}
          <span className="font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">{`${
            table.getState().pagination.pageIndex + 1
          }`}</span>{" "}
          of
          <span className="font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
            {" "}
            {`${table.getPageCount()}`}
          </span>
        </p>
        <div className="inline-flex items-center rounded-tremor-full shadow-tremor-input ring-1 ring-inset ring-tremor-ring dark:shadow-dark-tremor-input dark:ring-dark-tremor-ring">
          <ButtonFun
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Previous</span>
            <ArrowLeftIcon
              className="h-5 w-5 text-tremor-content-emphasis group-hover:text-tremor-content-strong dark:text-dark-tremor-content-emphasis group-hover:dark:text-dark-tremor-content-strong"
              aria-hidden={true}
            />
          </ButtonFun>
          <span
            className="h-5 border-r border-tremor-border dark:border-dark-tremor-border"
            aria-hidden={true}
          />
          <ButtonFun
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Next</span>
            <ArrowRightIcon
              className="h-5 w-5 text-tremor-content-emphasis group-hover:text-tremor-content-strong dark:text-dark-tremor-content-emphasis group-hover:dark:text-dark-tremor-content-strong"
              aria-hidden={true}
            />
          </ButtonFun>
        </div>
      </div>
      {data.suggestion && (
        <Suggestion
          suggestion={data.suggestion}
          description={data.description}
        />
      )}
    </div>
  );
};

export default TablePg;
