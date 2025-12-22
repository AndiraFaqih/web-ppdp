import { Button, Modal } from "flowbite-react";

export default function ViewBuktiModal({
  isOpen,
  onClose,
  row,
  bukti,
  onDelete,
  formatTanggal,
}) {
  if (!row) return null;

  const handleDelete = () => onDelete?.(row.nomorLhp);

  return (
    <Modal onClose={onClose} show={isOpen} size="lg">
      <Modal.Header className="border-b border-gray-200 !p-6 dark:border-gray-700">
        <strong>Lihat Bukti</strong>
      </Modal.Header>

      <Modal.Body>
        {!bukti ? (
          <p className="text-gray-600 dark:text-gray-300">Belum ada bukti untuk LHP ini.</p>
        ) : (
          <div className="space-y-3 text-sm text-gray-700 dark:text-gray-200">
            <div>
              <span className="font-semibold">Nomor LHP:</span> {bukti.nomorLhp}
            </div>

            <div>
              <span className="font-semibold">Tanggal bukti:</span>{" "}
              {formatTanggal?.(bukti.uploadedAt) || bukti.uploadedAt}
            </div>

            <div>
              <span className="font-semibold">File:</span>{" "}
              {bukti.fileName ? bukti.fileName : "-"}
              {bukti.fileUrl ? (
                <div className="mt-1">
                  <a
                    href={bukti.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary-700 hover:underline dark:text-primary-400"
                  >
                    Buka file bukti
                  </a>
                </div>
              ) : null}
            </div>

            <div>
              <span className="font-semibold">Link:</span>{" "}
              {bukti.link ? (
                <a
                  href={bukti.link}
                  target="_blank"
                  rel="noreferrer"
                  className="text-primary-700 hover:underline dark:text-primary-400"
                >
                  Buka link bukti
                </a>
              ) : (
                "-"
              )}
            </div>

            <div>
              <span className="font-semibold">Catatan:</span>{" "}
              {bukti.catatan ? bukti.catatan : "-"}
            </div>
          </div>
        )}
      </Modal.Body>

      <Modal.Footer>
        {bukti && (
          <Button color="failure" onClick={handleDelete}>
            Hapus Bukti
          </Button>
        )}
        <Button color="gray" onClick={onClose}>
          Tutup
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

