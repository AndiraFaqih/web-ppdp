import { Button, Label, Modal, TextInput } from "flowbite-react";
import { useEffect, useMemo, useState } from "react";
import { laporanService } from "../service/laporan-service";
import { rekomendasiService } from "../service/rekomendasi-service";

export default function UpdateDataModal({
  isOpen,
  onClose,
  rows = [],
  onAddRow,
  onUpdateRowDate,
  onRefresh,
}) {
  // Mode selection: 'update' or 'add'
  const [mode, setMode] = useState("update");
  
  // === UPDATE MODE STATES ===
  // Step 1: Select nomorLHP
  const [nomorLhp, setNomorLhp] = useState("");
  
  // Step 2: Select temuan
  const [selectedTemuanId, setSelectedTemuanId] = useState(null);
  const [temuanInputValue, setTemuanInputValue] = useState("");
  
  // Step 3: Select rekomendasi
  const [selectedRekId, setSelectedRekId] = useState(null);
  const [rekInputValue, setRekInputValue] = useState("");
  
  // Step 4: Input batas waktu
  const [batasWaktu, setBatasWaktu] = useState("");

  // State for rekomendasi from backend
  const [rekomOptions, setRekomOptions] = useState([]);
  const [loadingRekom, setLoadingRekom] = useState(false);

  // === ADD MODE STATES ===
  const [addNomorLhp, setAddNomorLhp] = useState("");
  const [addTemuan, setAddTemuan] = useState([
    { temuan: "", rekomendasi: [{ rekomendasi: "", batasWaktu: "" }] }
  ]);

  // ✅ Extract unique nomor LHP
  const nomorOptions = useMemo(
    () => Array.from(new Set(rows.map((r) => r.nomorLhp))).filter(Boolean).sort(),
    [rows]
  );

  // ✅ Get all rows for selected nomorLHP
  const rowsByLhp = useMemo(
    () => rows.filter((r) => r.nomorLhp === nomorLhp),
    [rows, nomorLhp]
  );

  // ✅ Extract unique temuan for selected nomorLHP using temuanId
  const temuanOptions = useMemo(() => {
    const map = new Map();
    
    rowsByLhp.forEach((r) => {
      if (!r.temuan || !r.temuanId) return;
      
      // Use temuanId as key to avoid duplicates
      if (!map.has(r.temuanId)) {
        map.set(r.temuanId, {
          temuanId: r.temuanId, // Actual temuan ID from database
          deskripsi: r.temuan, // Already cleaned by transformLaporanToRows
        });
      }
    });
    
    return Array.from(map.values());
  }, [rowsByLhp]);

  // ✅ Fetch rekomendasi from backend when temuan is selected
  useEffect(() => {
    const fetchRekomendasi = async () => {
      if (selectedTemuanId === null) {
        setRekomOptions([]);
        return;
      }

      const selectedTemuan = temuanOptions.find(t => t.temuanId === selectedTemuanId);
      if (!selectedTemuan?.temuanId) {
        setRekomOptions([]);
        return;
      }

      setLoadingRekom(true);
      try {
        const rekomendasiList = await rekomendasiService.getRekomendasiByTemuanId(selectedTemuan.temuanId);
        
        // Find corresponding rows for batasWaktu and rowId
        const formattedRekom = rekomendasiList.map((rek) => {
          const matchingRow = rowsByLhp.find(r => r.rekomendasiId === rek.id);
          return {
            id: rek.id,
            isi: rek.isi,
            batasWaktu: matchingRow?.batasWaktu || "",
            rowId: matchingRow?.id || null,
          };
        });
        
        setRekomOptions(formattedRekom);
      } catch (error) {
        console.error("Error fetching rekomendasi:", error);
        setRekomOptions([]);
      } finally {
        setLoadingRekom(false);
      }
    };

    fetchRekomendasi();
  }, [selectedTemuanId, temuanOptions, rowsByLhp]);

  // ✅ Get selected temuan and rekomendasi details
  const selectedTemuan = useMemo(
    () => temuanOptions.find((t) => t.temuanId === selectedTemuanId),
    [temuanOptions, selectedTemuanId]
  );

  const selectedRekomendasi = useMemo(
    () => rekomOptions.find((r) => r.id === selectedRekId),
    [rekomOptions, selectedRekId]
  );

  // ✅ Get PIC info
  const basePic = rowsByLhp[0]?.picNama || "";
  const baseEmail = rowsByLhp[0]?.picEmail || "";

  // === ADD MODE HELPER FUNCTIONS ===
  const handleAddTemuan = () => {
    setAddTemuan([...addTemuan, { temuan: "", rekomendasi: [{ rekomendasi: "", batasWaktu: "" }] }]);
  };

  const handleRemoveTemuan = (temuanIdx) => {
    if (addTemuan.length > 1) {
      setAddTemuan(addTemuan.filter((_, idx) => idx !== temuanIdx));
    }
  };

  const handleTemuanChange = (temuanIdx, value) => {
    const updated = [...addTemuan];
    updated[temuanIdx].temuan = value;
    setAddTemuan(updated);
  };

  const handleAddRekomendasi = (temuanIdx) => {
    const updated = [...addTemuan];
    updated[temuanIdx].rekomendasi.push({ rekomendasi: "", batasWaktu: "" });
    setAddTemuan(updated);
  };

  const handleRemoveRekomendasi = (temuanIdx, rekIdx) => {
    const updated = [...addTemuan];
    if (updated[temuanIdx].rekomendasi.length > 1) {
      updated[temuanIdx].rekomendasi = updated[temuanIdx].rekomendasi.filter((_, idx) => idx !== rekIdx);
      setAddTemuan(updated);
    }
  };

  const handleRekomendasiChange = (temuanIdx, rekIdx, field, value) => {
    const updated = [...addTemuan];
    updated[temuanIdx].rekomendasi[rekIdx][field] = value;
    setAddTemuan(updated);
  };

  // ✅ Reset form when modal closes or mode changes
  useEffect(() => {
    if (!isOpen) {
      setMode("update");
      setNomorLhp("");
      setSelectedTemuanId(null);
      setTemuanInputValue("");
      setSelectedRekId(null);
      setRekInputValue("");
      setBatasWaktu("");
      setAddNomorLhp("");
      setAddTemuan([{ temuan: "", rekomendasi: [{ rekomendasi: "", batasWaktu: "" }] }]);
    }
  }, [isOpen]);

  // ✅ Reset temuan/rekomendasi selection when nomorLhp changes
  useEffect(() => {
    setSelectedTemuanId(null);
    setTemuanInputValue("");
    setSelectedRekId(null);
    setRekInputValue("");
    setBatasWaktu("");
  }, [nomorLhp]);

  // ✅ Reset rekomendasi selection when temuan changes
  useEffect(() => {
    setSelectedRekId(null);
    setRekInputValue("");
    setBatasWaktu("");
  }, [selectedTemuanId]);

  // ✅ Set input values when rekomendasi selected
  useEffect(() => {
    if (selectedTemuan) {
      setTemuanInputValue(selectedTemuan.deskripsi);
    }
  }, [selectedTemuan]);

  useEffect(() => {
    if (selectedRekomendasi) {
      setRekInputValue(selectedRekomendasi.isi);
      setBatasWaktu(selectedRekomendasi.batasWaktu || "");
    }
  }, [selectedRekomendasi]);

  // ✅ Check if temuan is shared by other rekomendasi
  const isTemuanShared = useMemo(() => {
    if (!selectedTemuan?.temuanId) return false;
    
    // Count how many unique rekomendasi share this temuanId
    const rowsWithSameTemuan = rowsByLhp.filter(
      (r) => r.temuanId === selectedTemuan.temuanId && r.rekomendasiId
    );
    const uniqueRekIds = new Set(rowsWithSameTemuan.map((r) => r.rekomendasiId));
    
    return uniqueRekIds.size > 1;
  }, [rowsByLhp, selectedTemuan]);

  // ✅ Handle submit - update existing data
  const handleSubmit = async () => {
    // Validate
    if (!nomorLhp || rowsByLhp.length === 0) return;
    if (selectedTemuanId === null) return;
    if (selectedRekId === null) return;

    try {
      const temuanChanged = temuanInputValue && selectedTemuan && temuanInputValue !== selectedTemuan.deskripsi;
      const rekomendasiChanged = rekInputValue && selectedRekomendasi && rekInputValue !== selectedRekomendasi.isi;
      
      // Normalize dates for comparison
      const currentBatasWaktu = selectedRekomendasi?.batasWaktu 
        ? new Date(selectedRekomendasi.batasWaktu).toISOString().split('T')[0] 
        : null;
      const newBatasWaktu = batasWaktu || null;
      const batasWaktuChanged = newBatasWaktu && newBatasWaktu !== currentBatasWaktu;
      
      console.log("=== UPDATE DEBUG ===");
      console.log("temuanChanged:", temuanChanged);
      console.log("rekomendasiChanged:", rekomendasiChanged);
      console.log("batasWaktuChanged:", batasWaktuChanged);
      
      // Handle temuan update
      if (temuanChanged) {
        if (isTemuanShared) {
          // Temuan is shared, create new temuan
          const newTemuan = await laporanService.addTemuanToLaporan(nomorLhp, {
            deskripsi: temuanInputValue,
          });
          
          // Update rekomendasi to link to new temuan
          await rekomendasiService.updateRekomendasi(selectedRekId, {
            isi: rekomendasiChanged ? rekInputValue : selectedRekomendasi.isi,
            temuanId: newTemuan.id,
            batasWaktu: batasWaktu || null,
          });
        } else {
          // Temuan is not shared, safe to update directly
          await laporanService.updateTemuanById(selectedTemuan.temuanId, {
            deskripsi: temuanInputValue,
          });
          
          // Also update rekomendasi if changed
          if (rekomendasiChanged || batasWaktuChanged) {
            await rekomendasiService.updateRekomendasi(selectedRekId, {
              isi: rekomendasiChanged ? rekInputValue : selectedRekomendasi.isi,
              batasWaktu: batasWaktu || null,
            });
          }
        }
      } else if (rekomendasiChanged || batasWaktuChanged) {
        // Only rekomendasi or batasWaktu changed
        const updateData = {};
        if (rekomendasiChanged) updateData.isi = rekInputValue;
        if (batasWaktuChanged) updateData.batasWaktu = batasWaktu;
        
        await rekomendasiService.updateRekomendasi(selectedRekId, updateData);
      }

      // Refresh data
      if (onRefresh) {
        await onRefresh();
      }

      onClose();
    } catch (error) {
      console.error("Error updating data:", error);
      alert("Gagal mengupdate data: " + (error.message || "Unknown error"));
    }
  };

  // Handle submit for ADD mode
  const handleSubmitAdd = async () => {
    if (!addNomorLhp) {
      alert("Pilih Nomor LHP terlebih dahulu");
      return;
    }

    // Validate at least one temuan with rekomendasi
    const hasValidData = addTemuan.some(t => 
      t.temuan.trim() && t.rekomendasi.some(r => r.rekomendasi.trim())
    );

    if (!hasValidData) {
      alert("Minimal harus ada 1 temuan dan 1 rekomendasi");
      return;
    }

    try {
      // Process each temuan
      for (const temuanItem of addTemuan) {
        if (!temuanItem.temuan.trim()) continue;

        // Create temuan first
        const newTemuan = await laporanService.addTemuanToLaporan(addNomorLhp, {
          deskripsi: temuanItem.temuan.trim(),
        });

        // Create rekomendasi for this temuan
        for (const rekItem of temuanItem.rekomendasi) {
          if (!rekItem.rekomendasi.trim()) continue;

          await rekomendasiService.addRekomendasi(addNomorLhp, {
            isi: rekItem.rekomendasi.trim(),
            temuanId: newTemuan.id,
            batasWaktu: rekItem.batasWaktu || null,
          });
        }
      }

      // Refresh data
      if (onRefresh) {
        await onRefresh();
      }

      onClose();
    } catch (error) {
      console.error("Error adding data:", error);
      alert("Gagal menambah data: " + (error.message || "Unknown error"));
    }
  };

  const isFormValid = mode === "update" 
    ? (nomorLhp && selectedTemuanId !== null && selectedRekId !== null)
    : (addNomorLhp && addTemuan.some(t => t.temuan.trim()));

  return (
    <Modal onClose={onClose} show={isOpen} size="xl">
      <Modal.Header className="border-b border-gray-200 !p-6 dark:border-gray-700">
        <strong>Kelola Data LHP</strong>
      </Modal.Header>

      <Modal.Body>
        {/* Mode Tabs */}
        <div className="mb-6 border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8">
            <button
              onClick={() => setMode("update")}
              className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                mode === "update"
                  ? "border-blue-500 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Update Data Existing
            </button>
            <button
              onClick={() => setMode("add")}
              className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                mode === "add"
                  ? "border-blue-500 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              ➕ Tambah Temuan & Rekomendasi Baru
            </button>
          </nav>
        </div>

        {/* UPDATE MODE */}
        {mode === "update" && (
        <div className="space-y-6">
          {/* Step 1: Select Nomor LHP */}
          <div className="sm:col-span-2">
            <Label htmlFor="upd-nomor">1. Pilih Nomor LHP</Label>
            <div className="mt-1">
              <select
                id="upd-nomor"
                value={nomorLhp}
                onChange={(e) => setNomorLhp(e.target.value)}
                className="block w-full rounded-lg border border-gray-300 bg-white p-2.5 text-sm text-gray-900
                           dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
              >
                <option value="">-- Pilih Nomor LHP --</option>
                {nomorOptions.map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Display PIC info */}
          {nomorLhp && rowsByLhp.length > 0 && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <Label>PIC</Label>
                <div className="mt-1 text-sm text-gray-900 dark:text-gray-100">{basePic}</div>
              </div>
              <div>
                <Label>Email PIC</Label>
                <div className="mt-1 text-sm text-gray-900 dark:text-gray-100">{baseEmail}</div>
              </div>
            </div>
          )}

          {/* Step 2: Select Temuan */}
          {nomorLhp && rowsByLhp.length > 0 && (
            <div>
              <Label htmlFor="upd-temuan">2. Pilih Temuan</Label>
              <div className="mt-1">
                <select
                  id="upd-temuan"
                  value={selectedTemuanId === null ? "" : selectedTemuanId}
                  onChange={(e) =>
                    setSelectedTemuanId(e.target.value === "" ? null : parseInt(e.target.value, 10))
                  }
                  className="block w-full rounded-lg border border-gray-300 bg-white p-2.5 text-sm text-gray-900
                             dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                >
                  <option value="">-- Pilih Temuan --</option>
                  {temuanOptions.map((t) => (
                    <option key={t.temuanId} value={t.temuanId}>
                      {t.deskripsi.length > 80 ? t.deskripsi.slice(0, 80) + "..." : t.deskripsi}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Step 3: Select Rekomendasi */}
          {selectedTemuanId !== null && (
            <div>
              <Label htmlFor="upd-rekom">3. Pilih Rekomendasi</Label>
              <div className="mt-1">
                <select
                  id="upd-rekom"
                  value={selectedRekId === null ? "" : selectedRekId}
                  onChange={(e) =>
                    setSelectedRekId(e.target.value === "" ? null : parseInt(e.target.value, 10))
                  }
                  className="block w-full rounded-lg border border-gray-300 bg-white p-2.5 text-sm text-gray-900
                             dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                  disabled={loadingRekom}
                >
                  <option value="">
                    {loadingRekom ? "Loading rekomendasi..." : "-- Pilih Rekomendasi --"}
                  </option>
                  {rekomOptions.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.isi.length > 80 ? r.isi.slice(0, 80) + "..." : r.isi}
                      {r.batasWaktu ? ` (${r.batasWaktu})` : ""}
                    </option>
                  ))}
                </select>
              </div>
              {loadingRekom && (
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Memuat rekomendasi dari server...
                </p>
              )}
            </div>
          )}

          {/* Step 4: Edit Fields */}
          {selectedRekId !== null && (
            <div className="space-y-4 rounded-lg border border-gray-200 p-4 dark:border-gray-700">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                4. Edit Data
              </h3>

              <div>
                <Label htmlFor="upd-temuan-edit">Deskripsi Temuan</Label>
                <textarea
                  id="upd-temuan-edit"
                  rows={3}
                  value={temuanInputValue}
                  onChange={(e) => setTemuanInputValue(e.target.value)}
                  className="mt-1 block w-full rounded-lg border border-gray-300 bg-white p-3 text-sm text-gray-900
                             dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                />
              </div>

              <div>
                <Label htmlFor="upd-rekom-edit">Isi Rekomendasi</Label>
                <textarea
                  id="upd-rekom-edit"
                  rows={3}
                  value={rekInputValue}
                  onChange={(e) => setRekInputValue(e.target.value)}
                  className="mt-1 block w-full rounded-lg border border-gray-300 bg-white p-3 text-sm text-gray-900
                             dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                />
              </div>

              <div>
                <Label htmlFor="upd-batas">Batas Waktu</Label>
                <TextInput
                  id="upd-batas"
                  type="date"
                  value={batasWaktu}
                  onChange={(e) => setBatasWaktu(e.target.value)}
                />
              </div>
            </div>
          )}
        </div>
        )}

        {/* ADD MODE */}
        {mode === "add" && (
        <div className="space-y-6">
          {/* Select Nomor LHP */}
          <div>
            <Label htmlFor="add-nomor">Pilih Nomor LHP</Label>
            <div className="mt-1">
              <select
                id="add-nomor"
                value={addNomorLhp}
                onChange={(e) => setAddNomorLhp(e.target.value)}
                className="block w-full rounded-lg border border-gray-300 bg-white p-2.5 text-sm text-gray-900
                           dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
              >
                <option value="">-- Pilih Nomor LHP --</option>
                {nomorOptions.map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Dynamic Temuan & Rekomendasi */}
          {addNomorLhp && (
            <div className="space-y-6">
              {addTemuan.map((temuanItem, temuanIdx) => (
                <div
                  key={temuanIdx}
                  className="rounded-lg border-2 border-gray-300 p-4 dark:border-gray-600"
                >
                  {/* Temuan Header */}
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                      Temuan #{temuanIdx + 1}
                    </h3>
                    {addTemuan.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveTemuan(temuanIdx)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        ✕ Hapus Temuan
                      </button>
                    )}
                  </div>

                  {/* Temuan Input */}
                  <div className="mb-4">
                    <Label htmlFor={`add-temuan-${temuanIdx}`}>
                      Deskripsi Temuan <span className="text-red-500">*</span>
                    </Label>
                    <textarea
                      id={`add-temuan-${temuanIdx}`}
                      rows={3}
                      value={temuanItem.temuan}
                      onChange={(e) => handleTemuanChange(temuanIdx, e.target.value)}
                      placeholder="Masukkan deskripsi temuan..."
                      className="mt-1 block w-full rounded-lg border border-gray-300 bg-white p-3 text-sm text-gray-900
                                 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                    />
                  </div>

                  {/* Rekomendasi List */}
                  <div className="space-y-3 ml-4 border-l-2 border-blue-300 pl-4">
                    <Label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                      Rekomendasi untuk Temuan #{temuanIdx + 1}
                    </Label>
                    
                    {temuanItem.rekomendasi.map((rekItem, rekIdx) => (
                      <div
                        key={rekIdx}
                        className="rounded border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800"
                      >
                        <div className="mb-2 flex items-center justify-between">
                          <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                            Rekomendasi {temuanIdx + 1}.{rekIdx + 1}
                          </span>
                          {temuanItem.rekomendasi.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveRekomendasi(temuanIdx, rekIdx)}
                              className="text-xs text-red-600 hover:text-red-800"
                            >
                              ✕ Hapus
                            </button>
                          )}
                        </div>

                        <div className="space-y-2">
                          <div>
                            <Label htmlFor={`add-rek-${temuanIdx}-${rekIdx}`} className="text-xs">
                              Isi Rekomendasi <span className="text-red-500">*</span>
                            </Label>
                            <textarea
                              id={`add-rek-${temuanIdx}-${rekIdx}`}
                              rows={2}
                              value={rekItem.rekomendasi}
                              onChange={(e) =>
                                handleRekomendasiChange(temuanIdx, rekIdx, "rekomendasi", e.target.value)
                              }
                              placeholder="Masukkan rekomendasi..."
                              className="mt-1 block w-full rounded-lg border border-gray-300 bg-white p-2 text-sm
                                         dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                            />
                          </div>

                          <div>
                            <Label htmlFor={`add-batas-${temuanIdx}-${rekIdx}`} className="text-xs">
                              Batas Waktu
                            </Label>
                            <TextInput
                              id={`add-batas-${temuanIdx}-${rekIdx}`}
                              type="date"
                              value={rekItem.batasWaktu}
                              onChange={(e) =>
                                handleRekomendasiChange(temuanIdx, rekIdx, "batasWaktu", e.target.value)
                              }
                              sizing="sm"
                            />
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Add Rekomendasi Button */}
                    <button
                      type="button"
                      onClick={() => handleAddRekomendasi(temuanIdx)}
                      className="mt-2 text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400"
                    >
                      ➕ Tambah Rekomendasi
                    </button>
                  </div>
                </div>
              ))}

              {/* Add Temuan Button */}
              <button
                type="button"
                onClick={handleAddTemuan}
                className="w-full rounded-lg border-2 border-dashed border-gray-300 p-4 text-sm font-medium text-gray-600 hover:border-gray-400 hover:text-gray-700 dark:border-gray-600 dark:text-gray-400"
              >
                ➕ Tambah Temuan Baru
              </button>
            </div>
          )}
        </div>
        )}
      </Modal.Body>

      <Modal.Footer>
        <Button 
          color="primary" 
          onClick={mode === "update" ? handleSubmit : handleSubmitAdd} 
          disabled={!isFormValid}
        >
          {mode === "update" ? "Simpan Update" : "Simpan Data Baru"}
        </Button>
        <Button color="gray" onClick={onClose}>
          Batal
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
