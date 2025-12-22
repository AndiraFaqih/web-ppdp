import { Breadcrumb, Label, TextInput, Select } from "flowbite-react";
import { useMemo, useState } from "react";

import AddLhpButton from "./AddLhpButton";
import AddLhpModal from "./AddLhpModal";

import UpdateDataButton from "./UpdateDataButton";
import UpdateDataModal from "./UpdateDataModal";

import ResetFiltersButton from "./ResetFiltersButton"; // ✅ tambah
import SummaryDashboard from "./SummaryDashboard"; // ✅ TAMBAHAN MINIMAL

export default function HeaderBar({
  rows = [],
  onAddLhpPayload,
  onAddUpdateRow,
  onUpdateRowDate,

  // ✅ filter props
  filterNomorLhp,
  onChangeFilterNomorLhp,
  filterStatus,
  onChangeFilterStatus,
  filterPic,
  onChangeFilterPic,

  // ✅ tambah
  onResetFilters,
  resetDisabled, // ✅ TAMBAHAN MINIMAL

  // ✅ TAMBAHAN MINIMAL: data untuk summary (misal filteredRows)
  summaryRows,
}) {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);

  // ✅ options dropdown dari rows
  const statusOptions = useMemo(() => {
    const set = new Set();
    (rows || []).forEach((r) => r?.statusLabel && set.add(r.statusLabel));
    return ["ALL", ...Array.from(set)];
  }, [rows]);

  const picOptions = useMemo(() => {
    const set = new Set();
    (rows || []).forEach((r) => r?.picNama && set.add(r.picNama));
    return ["ALL", ...Array.from(set)];
  }, [rows]);

  return (
    <>
      <div className="block items-center justify-between border-b border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800 sm:flex">
        <div className="mb-1 w-full">
          <div className="mb-4">
            <Breadcrumb className="mb-4"></Breadcrumb>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
              Monitoring LHP
            </h1>

            {/* ✅ TAMBAHAN MINIMAL: summary dashboard */}
            <SummaryDashboard rows={summaryRows || rows} />
          </div>

          <div className="sm:flex sm:items-center sm:gap-3">
            {/* FILTERS */}
            <div className="mb-3 flex flex-col gap-2 sm:mb-0 sm:flex-row sm:items-center">
              <form className="lg:pr-3">
                <Label htmlFor="users-search" className="sr-only">
                  Search
                </Label>
                <div className="relative mt-1 lg:w-64 xl:w-96">
                  <TextInput
                    id="users-search"
                    name="users-search"
                    placeholder="Cari keyword..."
                    value={filterNomorLhp || ""}
                    onChange={(e) => onChangeFilterNomorLhp?.(e.target.value)}
                  />
                </div>
              </form>

              <div className="min-w-[180px]">
                <Select
                  value={filterStatus || "ALL"}
                  onChange={(e) => onChangeFilterStatus?.(e.target.value)}
                >
                  {statusOptions.map((s) => (
                    <option key={s} value={s}>
                      {s === "ALL" ? "Semua Status" : s}
                    </option>
                  ))}
                </Select>
              </div>

              <div className="min-w-[180px]">
                <Select
                  value={filterPic || "ALL"}
                  onChange={(e) => onChangeFilterPic?.(e.target.value)}
                >
                  {picOptions.map((p) => (
                    <option key={p} value={p}>
                      {p === "ALL" ? "Semua PIC" : p}
                    </option>
                  ))}
                </Select>
              </div>

              {/* ✅ tombol reset terpisah */}
              <ResetFiltersButton
                onClick={onResetFilters}
                disabled={resetDisabled} // ✅ TAMBAHAN MINIMAL
              />
            </div>

            {/* BUTTONS RIGHT */}
            <div className="ml-auto flex items-center space-x-2 sm:space-x-3">
              <AddLhpButton onClick={() => setIsAddOpen(true)} />
              <UpdateDataButton onClick={() => setIsUpdateOpen(true)} />
            </div>
          </div>
        </div>
      </div>

      <AddLhpModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSubmit={onAddLhpPayload}
      />

      <UpdateDataModal
        isOpen={isUpdateOpen}
        onClose={() => setIsUpdateOpen(false)}
        rows={rows}
        onAddRow={onAddUpdateRow}
        onUpdateRowDate={onUpdateRowDate}
      />
    </>
  );
}
