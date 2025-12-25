import { Table } from "flowbite-react";

export default function LhpTable({
  rows = [],
  buktiByLhp = {},
  formatTanggal = (x) => x,
  onOpenInputBukti,
  onOpenViewBukti,
}) {
  return (
    <Table className="min-w-full divide-y-2 divide-gray-300 dark:divide-gray-600">
      <Table.Head className="bg-gray-100 dark:bg-gray-700 border-b-4 border-gray-400 dark:border-gray-500">
        <Table.HeadCell>NOMOR LHP</Table.HeadCell>
        <Table.HeadCell>TEMUAN</Table.HeadCell>
        <Table.HeadCell>REKOMENDASI</Table.HeadCell>
        <Table.HeadCell>BATAS WAKTU</Table.HeadCell>
        <Table.HeadCell>STATUS</Table.HeadCell>
        <Table.HeadCell>PIC</Table.HeadCell>
        <Table.HeadCell>PERUSAHAAN</Table.HeadCell>
      </Table.Head>

      <Table.Body className="divide-y-2 divide-gray-300 bg-white dark:divide-gray-600 dark:bg-gray-800">
        {rows.length === 0 ? (
          <Table.Row>
            <Table.Cell
              colSpan={6}
              className="p-6 text-center text-sm text-gray-500 dark:text-gray-400"
            >
              Belum ada data.
            </Table.Cell>
          </Table.Row>
        ) : (
          rows.map((row) => {
            // ✅ bukti diikat ke rekomendasiId (fallback ke nomorLhp jika belum ada id)
            const buktiList = Array.isArray(buktiByLhp?.[row.rekomendasiId])
              ? buktiByLhp[row.rekomendasiId]
              : Array.isArray(buktiByLhp?.[row.nomorLhp])
                ? buktiByLhp[row.nomorLhp]
                : [];

            const hasBukti = buktiList.length > 0;
            const latestBukti = hasBukti ? buktiList[0] : null;

            const dot = row.statusDot || "bg-green-400";
            const status = row.statusLabel || "Belum Tindak Lanjut";

            return (
              <Table.Row
                key={row.id}
                id={`row-${row.id}`} // ✅ penting untuk scroll dari notifikasi
                className="hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                {/* NOMOR LHP */}
                <Table.Cell className="p-4 align-top whitespace-nowrap">
                  <div className="text-base font-semibold text-gray-900 dark:text-white">
                    {row.nomorLhp}
                  </div>
                </Table.Cell>

                {/* TEMUAN */}
                <Table.Cell className="p-4 align-top text-base font-medium text-gray-900 dark:text-white whitespace-normal break-words">
                  {row.temuan}
                </Table.Cell>

                {/* REKOMENDASI */}
                <Table.Cell className="p-4 align-top text-base font-medium text-gray-900 dark:text-white whitespace-normal break-words">
                  <button
                    type="button"
                    className="text-left text-primary-700 hover:underline dark:text-primary-300"
                    onClick={() => onOpenInputBukti?.(row)}
                    title="Klik untuk input bukti"
                  >
                    {row.rekomendasi}
                  </button>

                  {/* indikator bukti */}
                  <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    Bukti: {hasBukti ? `Sudah ada (${buktiList.length})` : "Belum ada"}
                    {hasBukti && latestBukti?.tanggalUpload ? (
                      <>
                        {" "}
                        • Terakhir:{" "}
                        <span className="font-medium">
                          {formatTanggal(latestBukti.tanggalUpload)}
                        </span>
                      </>
                    ) : null}
                  </div>

                  {hasBukti && (
                    <div className="mt-1">
                      <button
                        type="button"
                        className="text-sm text-gray-700 hover:underline dark:text-gray-200"
                        onClick={() => onOpenViewBukti?.(row)}
                      >
                        Lihat bukti
                      </button>
                    </div>
                  )}
                </Table.Cell>

                {/* BATAS WAKTU */}
                <Table.Cell className="p-4 align-top text-base font-medium text-gray-900 dark:text-white whitespace-normal break-words">
                  {formatTanggal(row.batasWaktu)}
                </Table.Cell>

                {/* STATUS */}
                <Table.Cell className="p-4 align-top whitespace-nowrap text-base font-normal text-gray-900 dark:text-white">
                  <div className="flex items-center">
                    <div className={`mr-2 h-2.5 w-2.5 rounded-full ${dot}`} />
                    {status}
                  </div>
                </Table.Cell>

                {/* PIC */}
                <Table.Cell className="p-4 align-top text-base font-medium text-gray-900 dark:text-white whitespace-normal break-words">
                  {row.picNama}
                  <div className="text-sm font-normal text-gray-500 dark:text-gray-400">
                    {row.picEmail}
                  </div>
                </Table.Cell>

                {/* PERUSAHAAN */}
                <Table.Cell className="p-4 align-top text-base font-medium text-gray-900 dark:text-white whitespace-normal break-words">
                  {row.perusahaanNama}
                </Table.Cell>
              </Table.Row>
            );
          })
        )}
      </Table.Body>
    </Table>
  );
}
