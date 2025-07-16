import { useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";
import {
  Loader2,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Search,
} from "lucide-react";
import { format } from "date-fns";

const FundingTable = ({ funds, loading, isAdmin }) => {
  const columns = useMemo(
    () => [
      {
        accessorKey: "userName",
        header: "Donor",
        cell: ({ row }) => {
          const userName = row.getValue("userName");
          const userEmail = row.original.userEmail;
          return (
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-300 font-semibold">
                {userName?.charAt(0)?.toUpperCase() || "A"}
              </div>
              <div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {userName || "Anonymous"}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {userEmail || "No email"}
                </div>
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: "amount",
        header: "Amount",
        cell: ({ row }) => {
          const amount = row.getValue("amount");
          return (
            <span className="inline-flex items-center text-xs font-medium px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-900/20 text-amber-800 dark:text-amber-300">
              ৳{amount?.toLocaleString()}
            </span>
          );
        },
      },
      {
        accessorKey: "createdAt",
        header: "Date",
        cell: ({ row }) => {
          const dateString = row.getValue("createdAt");
          try {
            return (
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {format(new Date(dateString), "MMM dd, yyyy - hh:mm a")}
              </span>
            );
          } catch {
            return (
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {dateString}
              </span>
            );
          }
        },
      },
      ...(isAdmin
        ? [
            {
              id: "actions",
              cell: ({ row }) => (
                <button
                  title="View details"
                  className="text-amber-600 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-300 transition-colors p-1 rounded hover:bg-amber-100 dark:hover:bg-amber-900/20"
                >
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              ),
            },
          ]
        : []),
    ],
    [isAdmin]
  );

  const table = useReactTable({
    data: funds,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            placeholder="Search donations..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 dark:bg-gray-800 dark:text-white text-sm"
            value={table.getState().globalFilter ?? ""}
            onChange={(e) => table.setGlobalFilter(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            className="block px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 dark:bg-gray-800 dark:text-white text-sm"
            value={table.getState().pagination.pageSize}
            onChange={(e) => {
              table.setPageSize(Number(e.target.value));
            }}
          >
            {[5, 10, 20, 30, 40, 50].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                Show {pageSize}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide"
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>

            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
              {loading ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-6 py-12 text-center"
                  >
                    <div className="flex justify-center items-center gap-2 text-gray-500 dark:text-gray-400">
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>Loading donations...</span>
                    </div>
                  </td>
                </tr>
              ) : table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className="hover:bg-amber-50 dark:hover:bg-amber-900/10 transition-colors duration-150"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-4 py-4 whitespace-nowrap">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-6 py-12 text-center text-gray-500 dark:text-gray-400"
                  >
                    No donations found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div className="text-sm text-gray-700 dark:text-gray-300">
              Showing{" "}
              <span className="font-medium">
                {table.getState().pagination.pageIndex *
                  table.getState().pagination.pageSize +
                  1}
              </span>{" "}
              to{" "}
              <span className="font-medium">
                {Math.min(
                  (table.getState().pagination.pageIndex + 1) *
                    table.getState().pagination.pageSize,
                  funds.length
                )}
              </span>{" "}
              of <span className="font-medium">{funds.length}</span> results
            </div>
            <div className="flex gap-1">
              <button
                className="p-1 rounded border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
              >
                <ChevronsLeft className="h-4 w-4" />
              </button>
              <button
                className="p-1 rounded border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                className="p-1 rounded border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <ChevronRight className="h-4 w-4" />
              </button>
              <button
                className="p-1 rounded border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
              >
                <ChevronsRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FundingTable;
