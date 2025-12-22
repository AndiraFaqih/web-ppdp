import { Button, Label, Modal, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";

export default function InputBuktiModal({ isOpen, onClose, row, existing, onSubmit }) {
  const [fileObj, setFileObj] = useState(null);
  const [link, setLink] = useState("");
  const [catatan, setCatatan] = useState("");
  const [tanggalBukti, setTanggalBukti] = useState(""); // YYYY-MM-DD

  const todayYYYYMMDD = () => {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  const toYYYYMMDD = (val) => {
    if (!val) return "";
    const s = String(val);
    if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
    const d = new Date(s);
    if (Number.isNaN(d.getTime())) return "";
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  useEffect(() => {
    if (isOpen) {
      setFileObj(null);
      setLink(existing?.link || "");
      setCatatan(existing?.catatan || "");
      setTanggalBukti(toYYYYMMDD(existing?.uploadedAt) || todayYYYYMMDD());
    }
  }, [isOpen, existing]);

  if (!row) return null;

  const handleSubmit = () => {
    const fileUrl = fileObj ? URL.createObjectURL(fileObj) : existing?.fileUrl || "";
    const fileName = fileObj ? fileObj.name : existing?.fileName || "";

    onSubmit({
      nomorLhp: row.nomorLhp,
      temuan: row.temuan,
      fileName,
      fileUrl,
      link: link.trim(),
      catatan: catatan.trim(),
      uploadedAt: tanggalBukti, // ✅ dari input user
    });
  };

  return (
    <Modal onClose={onClose} show={isOpen} size="lg">
      <Modal.Header className="border-b border-gray-200 !p-6 dark:border-gray-700">
        <strong>Input Bukti</strong>
      </Modal.Header>

      <Modal.Body>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <Label htmlFor="bukti-nomor-lhp">Nomor LHP</Label>
            <div className="mt-1">
              <TextInput id="bukti-nomor-lhp" value={row.nomorLhp} readOnly />
            </div>
          </div>

          <div>
            <Label htmlFor="bukti-tanggal">Tanggal Bukti</Label>
            <div className="mt-1">
              <TextInput
                id="bukti-tanggal"
                type="date"
                value={tanggalBukti}
                onChange={(e) => setTanggalBukti(e.target.value)}
              />
            </div>
          </div>

          <div className="sm:col-span-2">
            <Label htmlFor="bukti-temuan">Temuan</Label>
            <div className="mt-1">
              <textarea
                id="bukti-temuan"
                rows={4}
                readOnly
                value={row.temuan}
                className="block w-full rounded-lg border border-gray-300 bg-white p-3 text-sm text-gray-900
                           dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
              />
            </div>
          </div>

          <div className="sm:col-span-2">
            <Label htmlFor="bukti-file">Upload Bukti</Label>
            <div className="mt-1">
              <input
                id="bukti-file"
                type="file"
                onChange={(e) => setFileObj(e.target.files?.[0] || null)}
                className="block w-full cursor-pointer rounded-lg border border-gray-300 bg-gray-50 text-sm text-gray-900
                           dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
              />
              {existing?.fileName ? (
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  File terakhir: <span className="font-medium">{existing.fileName}</span>
                </p>
              ) : null}
            </div>
          </div>

          <div className="sm:col-span-2">
            <Label htmlFor="bukti-link">Link Bukti (opsional)</Label>
            <div className="mt-1">
              <TextInput
                id="bukti-link"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                placeholder="https://drive.google.com/..."
              />
            </div>
          </div>

          <div className="sm:col-span-2">
            <Label htmlFor="bukti-catatan">Catatan Bukti (opsional)</Label>
            <div className="mt-1">
              <textarea
                id="bukti-catatan"
                rows={4}
                value={catatan}
                onChange={(e) => setCatatan(e.target.value)}
                className="block w-full rounded-lg border border-gray-300 bg-white p-3 text-sm text-gray-900
                           dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                placeholder="Tulis keterangan singkat bukti..."
              />
            </div>
          </div>
        </div>
      </Modal.Body>

      <Modal.Footer>
        <Button color="primary" onClick={handleSubmit}>
          Submit Bukti
        </Button>
        <Button color="gray" onClick={onClose}>
          Batal
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

