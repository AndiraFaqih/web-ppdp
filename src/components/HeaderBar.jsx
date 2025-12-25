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
  onRefresh,

  // ✅ filter props
  filterNomorLhp,
  onChangeFilterNomorLhp,
  filterStatus,
  onChangeFilterStatus,
  filterPic,
  onChangeFilterPic,
  filterPerusahaan,
  onChangeFilterPerusahaan,

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

  const perusahaanOptions = useMemo(() => {
    const set = new Set();
    (rows || []).forEach((r) => r?.perusahaanNama && set.add(r.perusahaanNama));
    return ["ALL", ...Array.from(set)];
  }, [rows]);

  return (
    <>
      {/* ===== SECTION 1: DASHBOARD GRAFIK DAN SUMMARY ===== */}
      <div className="bg-gray-50 dark:bg-gray-900 p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="mb-4">
          <Breadcrumb className="mb-4"></Breadcrumb>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Dashboard Rekomendasi
          </h2>
        </div>
        
        {/* Summary Dashboard dengan grafik */}
        <SummaryDashboard rows={summaryRows || rows} />
      </div>

      {/* ===== SECTION 2: FILTER & ACTIONS ===== */}
      <div className="p-4 sm:p-6 bg-gray-100 dark:bg-gray-900">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl border-2 border-gray-300 dark:border-gray-600">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
               Filter & Pencarian
            </h3>
            
            <div className="sm:flex sm:items-center sm:gap-3 sm:justify-between">
              {/* FILTERS */}
              <div className="mb-3 flex flex-col gap-2 sm:mb-0 sm:flex-row sm:items-center sm:flex-wrap">
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

              <div className="min-w-[180px]">
                <Select
                  value={filterPerusahaan || "ALL"}
                  onChange={(e) => onChangeFilterPerusahaan?.(e.target.value)}
                >
                  {perusahaanOptions.map((prs) => (
                    <option key={prs} value={prs}>
                      {prs === "ALL" ? "Semua Perusahaan" : prs}
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
            <div className="flex items-center space-x-2 sm:space-x-3">
              <AddLhpButton onClick={() => setIsAddOpen(true)} />
              <UpdateDataButton onClick={() => setIsUpdateOpen(true)} />
            </div>
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
        onRefresh={onRefresh}
      />
    </>
  );
}
