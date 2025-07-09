import { useState } from "react";
import Toolbar from "./components/Toolbar";
import SpreadsheetTable from "./components/SpreadsheetTable";
import { jobData } from "./data/spreadsheetData";
import type { JobRequest } from "./types/types";

const App = () => {
  const [rows, setRows] = useState<JobRequest[]>(jobData);
  const [cellWrap, setCellWrap] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [customColumns, setCustomColumns] = useState<string[]>(
    Object.keys(jobData[0])
  );

  const filteredData = rows.filter((row) =>
    Object.values(row).some((val) =>
      String(val).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleAddRow = () => {
    const newRow: JobRequest = {
      job: "",
      submitted: new Date().toISOString().split("T")[0],
      status: "Need to start",
      submitter: "",
      url: "",
      assigned: "",
      priority: "Medium",
      dueDate: "",
      value: "",
    };
    setRows((prev) => [...prev, newRow]);
  };

  const handleAddColumn = () => {
    const newCol = prompt("Enter new column name:");
    if (!newCol || customColumns.includes(newCol)) return;
    const updatedRows = rows.map((row) => ({ ...row, [newCol]: "" }));
    setRows(updatedRows);
    setCustomColumns((prev) => [...prev, newCol]);
  };

  const handleImportCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const [headerLine, ...lines] = text.trim().split("\n");
      const headers = headerLine.split(",");
      const imported = lines.map((line) => {
        const values = line.split(",");
        const obj: any = {};
        headers.forEach((h, i) => {
          obj[h] = values[i]?.replace(/^\"|\"$/g, "") ?? "";
        });
        return obj;
      });
      setRows(imported);
      setCustomColumns(headers);
    };
    reader.readAsText(file);
  };

  const handleExportCSV = () => {
    const csv = [
      customColumns.join(","),
      ...rows.map((row) =>
        customColumns.map((col) => JSON.stringify((row as any)[col] ?? "")).join(",")
      ),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "spreadsheet.csv";
    a.click();
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-xl font-bold mb-4">📊 Spreadsheet Manager</h1>
      <Toolbar
        onSearch={setSearchTerm}
        onAddRow={handleAddRow}
        onAddColumn={handleAddColumn}
        cellWrap={cellWrap}
        toggleCellWrap={() => setCellWrap((w) => !w)}
        onImportCSV={handleImportCSV}
        onExportCSV={handleExportCSV}
        customColumns={customColumns}
        setCustomColumns={setCustomColumns}
      />
      <SpreadsheetTable
        data={filteredData}
        setData={setRows} // ✅ required for editing to work
        cellWrap={cellWrap}
        customColumns={customColumns}
        globalFilter={searchTerm}
      />

    </div>
  );
};

export default App;
