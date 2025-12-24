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

  // ✅ Reset form when modal closes or nomorLhp changes
  useEffect(() => {
    if (!isOpen) {
      setNomorLhp("");
      setSelectedTemuanId(null);
      setTemuanInputValue("");
      setSelectedRekId(null);
      setRekInputValue("");
      setBatasWaktu("");
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

  // ✅ Handle submit - update only selected temuan & rekomendasi combination
  const handleSubmit = async () => {
    // Validate nomorLhp
    if (!nomorLhp || rowsByLhp.length === 0) return;

    // Validate temuan selected
    if (selectedTemuanId === null) return;

    // Validate rekomendasi selected
    if (selectedRekId === null) return;

    try {
      const temuanChanged = temuanInputValue && selectedTemuan && temuanInputValue !== selectedTemuan.deskripsi;
      const rekomendasiChanged = rekInputValue && selectedRekomendasi && rekInputValue !== selectedRekomendasi.isi;
      
      // DEBUG LOG
      console.log("=== UPDATE DEBUG ===");
      console.log("temuanInputValue:", temuanInputValue);
      console.log("selectedTemuan:", selectedTemuan);
      console.log("temuanChanged:", temuanChanged);
      console.log("isTemuanShared:", isTemuanShared);
      console.log("rekomendasiChanged:", rekomendasiChanged);
      console.log("selectedRekId:", selectedRekId);
      
      // Handle temuan update
      if (temuanChanged) {
        console.log("Temuan changed, isTemuanShared:", isTemuanShared);
        if (isTemuanShared) {
          // Temuan is shared by other rekomendasi, create new temuan
          // Then update this rekomendasi to link to the new temuan
          console.log("Creating new temuan for nomorLhp:", nomorLhp);
          const newTemuan = await laporanService.addTemuanToLaporan(nomorLhp, {
            deskripsi: temuanInputValue,
          });
          console.log("New temuan created:", newTemuan);
          
          // Update rekomendasi to link to new temuan
          console.log("Updating rekomendasi to link to new temuan, rekId:", selectedRekId, "temuanId:", newTemuan.id);
          const rekUpdateResult = await rekomendasiService.updateRekomendasi(selectedRekId, {
            isi: rekomendasiChanged ? rekInputValue : selectedRekomendasi.isi,
            temuanId: newTemuan.id,
          });
          console.log("Rekomendasi update result:", rekUpdateResult);
        } else {
          // Temuan is not shared, safe to update directly
          console.log("Updating temuan directly, temuanId:", selectedTemuan.temuanId);
          const updateResult = await laporanService.updateTemuanById(selectedTemuan.temuanId, {
            deskripsi: temuanInputValue,
          });
          console.log("Temuan update result:", updateResult);
          
          // Also update rekomendasi if changed
          if (rekomendasiChanged) {
            await rekomendasiService.updateRekomendasi(selectedRekId, {
              isi: rekInputValue,
            });
          }
        }
      } else if (rekomendasiChanged) {
        // Only rekomendasi changed, update directly
        await rekomendasiService.updateRekomendasi(selectedRekId, {
          isi: rekInputValue,
        });
      }

      // Update batas waktu
      if (
        batasWaktu &&
        selectedRekomendasi &&
        batasWaktu !== selectedRekomendasi.batasWaktu
      ) {
        onUpdateRowDate?.(selectedRekomendasi.rowId, batasWaktu);
      }

      // Refresh data from backend
      if (onRefresh) {
        await onRefresh();
      }

      onClose();
    } catch (error) {
      console.error("Error updating data:", error);
      alert("Gagal mengupdate data: " + (error.message || "Unknown error"));
    }
  };

  const isFormValid = nomorLhp && selectedTemuanId !== null && selectedRekId !== null;

  return (
    <Modal onClose={onClose} show={isOpen} size="lg">
      <Modal.Header className="border-b border-gray-200 !p-6 dark:border-gray-700">
        <strong>Update Data LHP</strong>
      </Modal.Header>

      <Modal.Body>
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
      </Modal.Body>

      <Modal.Footer>
        <Button color="primary" onClick={handleSubmit} disabled={!isFormValid}>
          Simpan Update
        </Button>
        <Button color="gray" onClick={onClose}>
          Batal
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
