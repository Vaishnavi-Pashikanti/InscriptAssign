import type { FC } from "react";

interface ToolbarProps {
  onSearch: (term: string) => void;
  onAddRow: () => void;
  onAddColumn: () => void;
  cellWrap: boolean;
  toggleCellWrap: () => void;
  onImportCSV: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onExportCSV: () => void;
  customColumns: string[];
  setCustomColumns: React.Dispatch<React.SetStateAction<string[]>>;
}

const Toolbar: FC<ToolbarProps> = ({
  onSearch,
  onAddRow,
  onAddColumn,
  cellWrap,
  toggleCellWrap,
  onImportCSV,
  onExportCSV,
  customColumns,
  setCustomColumns,
}) => {
  const allColumns = [
    "job",
    "submitted",
    "status",
    "submitter",
    "url",
    "assigned",
    "priority",
    "dueDate",
    "value",
  ];

  return (
    <div className="flex items-center justify-between flex-wrap gap-2 border-b pb-2 mb-4">
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium">Tool bar »</span>
        <button className="text-sm text-gray-700" onClick={toggleCellWrap}>
          {cellWrap ? "📄 Wrap" : "📄 Truncate"}
        </button>
        <input
          type="text"
          placeholder="🔎 Search"
          onChange={(e) => onSearch(e.target.value)}
          className="border px-2 py-1 rounded text-sm"
        />
        <select
          className="text-sm border rounded px-2 py-1"
          onChange={(e) =>
            setCustomColumns((prev) =>
              prev.includes(e.target.value)
                ? prev.filter((col) => col !== e.target.value)
                : [...prev, e.target.value]
            )
          }
        >
          <option disabled selected>
            Toggle Columns
          </option>
          {allColumns.map((col) => (
            <option key={col} value={col}>
              {customColumns.includes(col) ? `✅ ${col}` : col}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-2">
        <label className="border rounded px-3 py-1 text-sm cursor-pointer bg-white">
          ⬇ Import
          <input type="file" accept=".csv" onChange={onImportCSV} className="hidden" />
        </label>
        <button onClick={onExportCSV} className="border rounded px-3 py-1 text-sm">
          ⬆ Export
        </button>
        <button className="border rounded px-3 py-1 text-sm">🔗 Share</button>
        <button onClick={onAddRow} className="bg-green-700 text-white px-4 py-1 rounded text-sm">
          ➕ New Row
        </button>
        <button onClick={onAddColumn} className="bg-gray-800 text-white px-3 py-1 rounded text-sm">
          ➕ Add Column
        </button>
      </div>
    </div>
  );
};

export default Toolbar;
