"use client";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    useReactTable
} from "@tanstack/react-table";
import { DataTablePagination } from "./data-table-pagination";
import { useState } from "react";

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
}

export function DataTable<TData, TValue>({ columns, data }: DataTableProps<TData, TValue>) {
    const [columnPinning, setColumnPinning] = useState({})
    const [rowSelection , setRowSelection] = useState({});
    const table = useReactTable({
        data,
        columns,
        columnResizeMode: 'onChange',
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        enableMultiRowSelection: false,
        state: {
            columnPinning,
            rowSelection:rowSelection
          },
          onRowSelectionChange:setRowSelection
    });

    // TASK : Make first 2 columns (i.e. checkbox and task id) sticky
    // TASK : Make header columns resizable
    return (
        <div className="space-y-4 overflow-x-scroll overflow-y-hidden">
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id} colSpan={header.colSpan} style={{width: header.getSize() }} className={(header.id=='check')?'sticky left-0':(header.id=='id')?"sticky left-30":"relative"}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                      header.column.columnDef.header,
                                                      header.getContext(),
                                                  )}
                                                  {header.column.getCanResize() && (
                      <div
                        onMouseDown={header.getResizeHandler()}
                        onTouchStart={header.getResizeHandler()}
                        className={`resizer ${
                          header.column.getIsResizing() ? 'isResizing' : ''
                        }`}
                      ></div>
                    )}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                    {table.getRowModel().rows?.length ? (
    table.getRowModel().rows.map((row) => (
        <TableRow
            key={row.id}
            data-state={row.getIsSelected() ? "selected" : undefined}
            className={row.getIsSelected() ? "selected" : ""}
            onClick={row.getToggleSelectedHandler()}
        >
            {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id} style={{ width: cell.column.getSize()}} className={(cell.id.slice(2,)=='check')?'sticky left-0':(cell.id.slice(2,)=='id')?"sticky left-30":"relative"}>
                    {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                    )}
                </TableCell>
            ))}
        </TableRow>
    ))
) : (
    <TableRow>
        <TableCell colSpan={columns.length} className="h-24 text-center">
            No results.
        </TableCell>
    </TableRow>
)}
                    </TableBody>
                </Table>
            </div>
            <DataTablePagination table={table} />
        </div>
    );
}
