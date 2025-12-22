import { Table } from "flowbite-react";
import BuktiActionButton from "./BuktiActionButton";
import ViewBuktiButton from "./ViewBuktiButton";

export default function LhpTable({
  rows,
  buktiByLhp,
  formatTanggal,
  onOpenInputBukti,
  onOpenViewBukti,
}) {
  return (
    <Table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
      <Table.Head className="bg-gray-100 dark:bg-gray-700">
        <Table.HeadCell>Nomor LHP</Table.HeadCell>
        <Table.HeadCell>Temuan</Table.HeadCell>
        <Table.HeadCell>Rekomendasi</Table.HeadCell>
        <Table.HeadCell>Batas Waktu</Table.HeadCell>
        <Table.HeadCell>Status</Table.HeadCell>
        <Table.HeadCell>PIC</Table.HeadCell>
      </Table.Head>

      <Table.Body className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
        {rows.map((row) => {
          const bukti = buktiByLhp[row.nomorLhp];

          return (
            <Table.Row key={row.nomorLhp} className="hover:bg-gray-100 dark:hover:bg-gray-700">
              <Table.Cell className="mr-12 flex items-center space-x-6 whitespace-nowrap p-4 lg:mr-0">
                <div className="text-sm font-normal text-gray-500 dark:text-gray-400">
                  <div className="text-base font-semibold text-gray-900 dark:text-white">
                    {row.nomorLhp}
                  </div>
                </div>
              </Table.Cell>

              <Table.Cell className="p-4 text-base font-medium text-gray-900 dark:text-white whitespace-normal break-words">
                {row.temuan}
              </Table.Cell>

              <Table.Cell className="p-4 text-base font-medium text-gray-900 dark:text-white whitespace-normal break-words">
                <BuktiActionButton
                  text={row.rekomendasi}
                  onClick={() => onOpenInputBukti(row)}
                />

                <div className="mt-2 flex items-center gap-3">
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                    Bukti: {bukti ? `Sudah ada • ${formatTanggal(bukti.uploadedAt)}` : "Belum ada"}
                  </span>

                  {bukti && <ViewBuktiButton onClick={() => onOpenViewBukti(row)} />}
                </div>
              </Table.Cell>

              <Table.Cell className="p-4 text-base font-medium text-gray-900 dark:text-white whitespace-normal break-words">
                {row.batasWaktu}
              </Table.Cell>

              <Table.Cell className="whitespace-nowrap p-4 text-base font-normal text-gray-900 dark:text-white break-words">
                <div className="flex items-center">
                  <div className={`mr-2 h-2.5 w-2.5 rounded-full ${row.statusDot}`}></div>
                  {row.statusLabel}
                </div>
              </Table.Cell>

              <Table.Cell className="p-4 text-base font-medium text-gray-900 dark:text-white whitespace-normal break-words">
                {row.picNama}
                <div className="text-sm font-normal text-gray-500 dark:text-gray-400">
                  {row.picEmail}
                </div>
              </Table.Cell>
            </Table.Row>
          );
        })}
      </Table.Body>
    </Table>
  );
}
