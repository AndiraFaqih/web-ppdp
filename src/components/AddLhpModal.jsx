import { Button, Label, Modal, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";

const uid = () =>
  crypto?.randomUUID?.()
    ? crypto.randomUUID()
    : String(Date.now() + Math.random());

const makeEmptyTemuan = () => ({
  id: uid(),
  temuan: "",
  rekomendasiList: [
    {
      id: uid(),
      rekomendasi: "",
      batasWaktu: "",
    },
  ],
});

export default function AddLhpModal({ isOpen, onClose, onSubmit }) {
  const [nomorLhp, setNomorLhp] = useState("");
  const [pic, setPic] = useState("");
  const [emailPic, setEmailPic] = useState("");
  const [perusahaan, setPerusahaan] = useState("");

  const [temuanList, setTemuanList] = useState([makeEmptyTemuan()]);

  // reset form tiap modal dibuka
  useEffect(() => {
    if (isOpen) {
      setNomorLhp("");
      setPic("");
      setEmailPic("");
      setPerusahaan("");
      setTemuanList([makeEmptyTemuan()]);
    }
  }, [isOpen]);

  // ========== TEMUAN ==========
  const addTemuan = () => setTemuanList((prev) => [...prev, makeEmptyTemuan()]);

  const removeTemuan = (temuanId) =>
    setTemuanList((prev) => prev.filter((t) => t.id !== temuanId));

  const updateTemuanText = (temuanId, value) =>
    setTemuanList((prev) =>
      prev.map((t) => (t.id === temuanId ? { ...t, temuan: value } : t))
    );

  // ========== REKOMENDASI ==========
  const addRekomendasi = (temuanId) =>
    setTemuanList((prev) =>
      prev.map((t) => {
        if (t.id !== temuanId) return t;
        return {
          ...t,
          rekomendasiList: [
            ...t.rekomendasiList,
            { id: uid(), rekomendasi: "", batasWaktu: "" },
          ],
        };
      })
    );

  const removeRekomendasi = (temuanId, rekomId) =>
    setTemuanList((prev) =>
      prev.map((t) => {
        if (t.id !== temuanId) return t;
        const next = t.rekomendasiList.filter((r) => r.id !== rekomId);
        // minimal 1 rekomendasi per temuan
        return { ...t, rekomendasiList: next.length ? next : t.rekomendasiList };
      })
    );

  const updateRekomField = (temuanId, rekomId, key, value) =>
    setTemuanList((prev) =>
      prev.map((t) => {
        if (t.id !== temuanId) return t;
        return {
          ...t,
          rekomendasiList: t.rekomendasiList.map((r) =>
            r.id === rekomId ? { ...r, [key]: value } : r
          ),
        };
      })
    );

  // ========== SUBMIT ==========
  const handleSubmit = () => {
    const payload = {
      nomorLhp: nomorLhp.trim(),
      pic: pic.trim(),
      emailPic: emailPic.trim(),
      perusahaan: perusahaan.trim(),
      temuan: temuanList.map((t) => ({
        temuan: (t.temuan || "").trim(),
        rekomendasi: (t.rekomendasiList || []).map((r) => ({
          rekomendasi: (r.rekomendasi || "").trim(),
          batasWaktu: r.batasWaktu || "", // YYYY-MM-DD
          status: "Belum Tindak Lanjut",
        })),
      })),
    };

    // validasi minimal
    if (!payload.nomorLhp) return;
    if (!payload.pic || !payload.emailPic) return;
    if (!payload.perusahaan) return;
    if (payload.temuan.some((t) => !t.temuan)) return;
    if (
      payload.temuan.some((t) =>
        t.rekomendasi.some((r) => !r.rekomendasi || !r.batasWaktu)
      )
    )
      return;

    // ✅ INI yang kamu minta: benar-benar memanggil onSubmit(payload)
    onSubmit?.(payload);

    // tutup modal
    onClose?.();
  };

  return (
    <Modal onClose={onClose} show={isOpen} size="4xl">
      <Modal.Header className="border-b border-gray-200 !p-6 dark:border-gray-700">
        <strong>Input LHP</strong>
      </Modal.Header>

      <Modal.Body>
        {/* Header LHP */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Label htmlFor="nomorLhp">Nomor LHP</Label>
            <div className="mt-1">
              <TextInput
                id="nomorLhp"
                name="nomorLhp"
                placeholder="1/LHP/DPDK/04/2025"
                value={nomorLhp}
                onChange={(e) => setNomorLhp(e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="pic">PIC</Label>
            <div className="mt-1">
              <TextInput
                id="pic"
                name="pic"
                placeholder="Witari"
                value={pic}
                onChange={(e) => setPic(e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="emailPic">Email PIC</Label>
            <div className="mt-1">
              <TextInput
                id="emailPic"
                name="emailPic"
                type="email"
                placeholder="witari@ojk.go.id"
                value={emailPic}
                onChange={(e) => setEmailPic(e.target.value)}
              />
            </div>
          </div>

          <div className="sm:col-span-2">
            <Label htmlFor="perusahaan">Perusahaan</Label>
            <div className="mt-1">
              <TextInput
                id="perusahaan"
                name="perusahaan"
                placeholder="PT. Contoh Indonesia"
                value={perusahaan}
                onChange={(e) => setPerusahaan(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Temuan list */}
        <div className="mt-6 space-y-6">
          {temuanList.map((t, idx) => (
            <div
              key={t.id}
              className="rounded-lg border border-gray-200 p-4 dark:border-gray-700"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                  Temuan #{idx + 1}
                </h3>

                {temuanList.length > 1 && (
                  <button
                    type="button"
                    className="text-sm text-red-600 hover:underline"
                    onClick={() => removeTemuan(t.id)}
                  >
                    Hapus Temuan
                  </button>
                )}
              </div>

              <div className="mt-3">
                <Label htmlFor={`temuan-${t.id}`}>Temuan</Label>
                <div className="mt-1">
                  <textarea
                    id={`temuan-${t.id}`}
                    rows={4}
                    value={t.temuan}
                    onChange={(e) => updateTemuanText(t.id, e.target.value)}
                    className="block w-full rounded-lg border border-gray-300 bg-white p-3 text-sm text-gray-900
                               dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                    placeholder="Tulis detail temuan..."
                  />
                </div>
              </div>

              {/* Rekomendasi */}
              <div className="mt-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                    Rekomendasi
                  </h4>
                  <Button
                    color="gray"
                    size="xs"
                    onClick={() => addRekomendasi(t.id)}
                  >
                    + Tambah Rekomendasi
                  </Button>
                </div>

                {t.rekomendasiList.map((r, rIdx) => (
                  <div
                    key={r.id}
                    className="rounded-lg border border-gray-200 p-3 dark:border-gray-700"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                        Rekomendasi #{rIdx + 1}
                      </p>

                      {t.rekomendasiList.length > 1 && (
                        <button
                          type="button"
                          className="text-sm text-red-600 hover:underline"
                          onClick={() => removeRekomendasi(t.id, r.id)}
                        >
                          Hapus
                        </button>
                      )}
                    </div>

                    <div className="mt-3">
                      <Label htmlFor={`rekom-${t.id}-${r.id}`}>Isi Rekomendasi</Label>
                      <textarea
                        id={`rekom-${t.id}-${r.id}`}
                        rows={3}
                        value={r.rekomendasi}
                        onChange={(e) =>
                          updateRekomField(t.id, r.id, "rekomendasi", e.target.value)
                        }
                        className="mt-1 block w-full rounded-lg border border-gray-300 bg-white p-3 text-sm text-gray-900
                                   dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                        placeholder="Tulis rekomendasi..."
                      />
                    </div>

                    <div className="mt-3 sm:max-w-xs">
                      <Label htmlFor={`batas-${t.id}-${r.id}`}>Batas Waktu</Label>
                      <div className="mt-1">
                        <TextInput
                          id={`batas-${t.id}-${r.id}`}
                          type="date"
                          value={r.batasWaktu}
                          onChange={(e) =>
                            updateRekomField(t.id, r.id, "batasWaktu", e.target.value)
                          }
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6">
          <Button color="gray" onClick={addTemuan}>
            + Tambah Temuan
          </Button>
        </div>

        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          * Wajib: Nomor LHP, PIC, Email PIC, Perusahaan, setiap Temuan terisi, setiap Rekomendasi + batas waktu terisi.
        </p>
      </Modal.Body>

      <Modal.Footer>
        <Button color="primary" onClick={handleSubmit}>
          Simpan LHP
        </Button>
        <Button color="gray" onClick={onClose}>
          Batal
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
