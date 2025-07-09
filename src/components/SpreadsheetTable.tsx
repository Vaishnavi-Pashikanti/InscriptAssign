import type { FC } from "react";
import type { JobRequest } from "../types/types";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  createColumnHelper,
  type ColumnDef,
} from "@tanstack/react-table";

interface SpreadsheetTableProps {
  data: JobRequest[];
  setData: React.Dispatch<React.SetStateAction<JobRequest[]>>;
  cellWrap: boolean;
  customColumns: string[];
  globalFilter: string;
}

const columnHelper = createColumnHelper<JobRequest>();

const getStatusClass = (status: string) => {
  switch (status) {
    case "In-process":
      return "bg-yellow-100 text-yellow-800";
    case "Need to start":
      return "bg-blue-100 text-blue-800";
    case "Complete":
      return "bg-green-100 text-green-800";
    case "Blocked":
      return "bg-red-100 text-red-800";
    default:
      return "";
  }
};

const getPriorityClass = (priority: string) => {
  switch (priority) {
    case "High":
      return "bg-red-100 text-red-800";
    case "Medium":
      return "bg-yellow-100 text-yellow-800";
    case "Low":
      return "bg-green-100 text-green-800";
    default:
      return "";
  }
};

const SpreadsheetTable: FC<SpreadsheetTableProps> = ({
  data,
  setData,
  cellWrap,
  customColumns,
  globalFilter,
}) => {
  const handleCellChange = (rowIndex: number, columnId: string, value: string) => {
    setData((prev) =>
      prev.map((row, idx) =>
        idx === rowIndex
          ? {
              ...row,
              [columnId]: value,
            }
          : row
      )
    );
  };

  const allColumns: ColumnDef<JobRequest>[] = [
    columnHelper.accessor("job", {
      id: "job",
      header: "Job Request",
      cell: (info) => (
        <input
          type="text"
          className="w-full bg-transparent focus:outline-none"
          value={info.getValue() ?? ""}
          onChange={(e) =>
            handleCellChange(info.row.index, info.column.id, e.target.value)
          }
        />
      ),
    }),
    columnHelper.accessor("submitted", {
      id: "submitted",
      header: "Submitted",
      cell: (info) => {
        let dateValue = "";
        try {
          dateValue = new Date(info.getValue() as string).toISOString().split("T")[0];
        } catch {}
        return (
          <input
            type="date"
            className="w-full bg-transparent focus:outline-none"
            value={dateValue}
            onChange={(e) =>
              handleCellChange(info.row.index, info.column.id, e.target.value)
            }
          />
        );
      },
    }),
    columnHelper.accessor("status", {
      id: "status",
      header: "Status",
      cell: (info) => (
        <select
          className={`w-full bg-transparent px-2 py-1 rounded-full text-xs font-medium ${getStatusClass(
            info.getValue() ?? ""
          )}`}
          value={info.getValue() ?? ""}
          onChange={(e) =>
            handleCellChange(info.row.index, info.column.id, e.target.value)
          }
        >
          <option>Need to start</option>
          <option>In-process</option>
          <option>Complete</option>
          <option>Blocked</option>
        </select>
      ),
    }),
    columnHelper.accessor("submitter", {
      id: "submitter",
      header: "Submitter",
      cell: (info) => (
        <input
          type="text"
          className="w-full bg-transparent focus:outline-none"
          value={info.getValue() ?? ""}
          onChange={(e) =>
            handleCellChange(info.row.index, info.column.id, e.target.value)
          }
        />
      ),
    }),
    columnHelper.accessor("url", {
      id: "url",
      header: "URL",
      cell: (info) => (
        <input
          type="url"
          className="w-full bg-transparent focus:outline-none text-blue-600 underline"
          value={info.getValue() ?? ""}
          onChange={(e) =>
            handleCellChange(info.row.index, info.column.id, e.target.value)
          }
        />
      ),
    }),
    columnHelper.accessor("assigned", {
      id: "assigned",
      header: "Assigned",
      cell: (info) => (
        <input
          type="text"
          className="w-full bg-transparent focus:outline-none"
          value={info.getValue() ?? ""}
          onChange={(e) =>
            handleCellChange(info.row.index, info.column.id, e.target.value)
          }
        />
      ),
    }),
    columnHelper.accessor("priority", {
      id: "priority",
      header: "Priority",
      cell: (info) => (
        <select
          className={`w-full bg-transparent px-2 py-1 rounded-full text-xs font-medium ${getPriorityClass(
            info.getValue() ?? ""
          )}`}
          value={info.getValue() ?? ""}
          onChange={(e) =>
            handleCellChange(info.row.index, info.column.id, e.target.value)
          }
        >
          <option>High</option>
          <option>Medium</option>
          <option>Low</option>
        </select>
      ),
    }),
    columnHelper.accessor("dueDate", {
      id: "dueDate",
      header: "Due Date",
      cell: (info) => {
        let dateValue = "";
        try {
          dateValue = new Date(info.getValue() as string).toISOString().split("T")[0];
        } catch {}
        return (
          <input
            type="date"
            className="w-full bg-transparent focus:outline-none"
            value={dateValue}
            onChange={(e) =>
              handleCellChange(info.row.index, info.column.id, e.target.value)
            }
          />
        );
      },
    }),
    columnHelper.accessor("value", {
      id: "value",
      header: "Est. Value",
      cell: (info) => (
        <input
          type="text"
          className="w-full bg-transparent focus:outline-none"
          value={info.getValue() ?? ""}
          onChange={(e) =>
            handleCellChange(info.row.index, info.column.id, e.target.value)
          }
        />
      ),
    }),
  ];

  const visibleColumns = allColumns.filter((col) =>
    customColumns.includes(col.id as string)
  );

  const table = useReactTable({
    data,
    columns: visibleColumns,
    state: { globalFilter },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: (row, columnId, filterValue) =>
      String(row.getValue(columnId)).toLowerCase().includes(filterValue.toLowerCase()),
  });

  return (
    <div className="overflow-x-auto mt-6 rounded shadow">
      <table className="min-w-full text-sm text-left border border-gray-200">
        <thead className="bg-gray-100 text-gray-700">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  onClick={header.column.getToggleSortingHandler()}
                  className="px-4 py-2 font-medium cursor-pointer hover:bg-gray-200 select-none"
                >
                  {flexRender(header.column.columnDef.header, header.getContext())}
                  {header.column.getIsSorted() === "asc" ? " ↑" : ""}
                  {header.column.getIsSorted() === "desc" ? " ↓" : ""}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="divide-y divide-gray-100">
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="hover:bg-gray-50">
              {row.getVisibleCells().map((cell) => (
                <td
                  key={cell.id}
                  className={`px-4 py-2 ${
                    cellWrap ? "whitespace-normal" : "whitespace-nowrap"
                  }`}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SpreadsheetTable;
