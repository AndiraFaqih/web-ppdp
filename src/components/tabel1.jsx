/* eslint-disable jsx-a11y/anchor-is-valid */
import {
  Breadcrumb,
  Button,
  Checkbox,
  Label,
  Modal,
  Table,
  TextInput,
} from "flowbite-react";
import { useEffect, useState } from "react";
import {
  HiChevronLeft,
  HiChevronRight,
  HiCog,
  HiDocumentDownload,
  HiDotsVertical,
  HiExclamationCircle,
  HiHome,
  HiOutlineExclamationCircle,
  HiOutlinePencilAlt,
  HiPlus,
  HiTrash,
} from "react-icons/hi";
import NavbarSidebarLayout from "../views/Admin/layouts/NavbarSidebar";

const Tabel1 = function () {
  return (
    <NavbarSidebarLayout isFooter={false}>
      <div className="block items-center justify-between border-b border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800 sm:flex">
        <div className="mb-1 w-full">
          <div className="mb-4">
            <Breadcrumb className="mb-4"></Breadcrumb>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
              All users
            </h1>
          </div>
          <div className="sm:flex">
            <div className="mb-3 hidden items-center dark:divide-gray-700 sm:mb-0 sm:flex sm:divide-x sm:divide-gray-100">
              <form className="lg:pr-3">
                <Label htmlFor="users-search" className="sr-only">
                  Search
                </Label>
                <div className="relative mt-1 lg:w-64 xl:w-96">
                  <TextInput
                    id="users-search"
                    name="users-search"
                    placeholder="Search for users"
                  />
                </div>
              </form>
            </div>
            <div className="ml-auto flex items-center space-x-2 sm:space-x-3">
              <AddUserModal />
              <Button color="gray">
                <div className="flex items-center gap-x-3">
                  <HiDocumentDownload className="text-xl" />
                  <span>Export</span>
                </div>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden shadow">
              <AllUsersTable />
            </div>
          </div>
        </div>
      </div>

      <Pagination />
    </NavbarSidebarLayout>
  );
};

const AddUserModal = function () {
  const [isOpen, setOpen] = useState(false);

  return (
    <>
      <Button color="primary" onClick={() => setOpen(true)}>
        <div className="flex items-center gap-x-3">
          <HiPlus className="text-xl" />
          Input LHP
        </div>
      </Button>
      <Modal onClose={() => setOpen(false)} show={isOpen}>
        <Modal.Header className="border-b border-gray-200 !p-6 dark:border-gray-700">
          <strong>Input LHP</strong>
        </Modal.Header>
        <Modal.Body>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <Label htmlFor="firstName">Nomor LHP</Label>
              <div className="mt-1">
                <TextInput
                  id="firstName"
                  name="firstName"
                  placeholder="1/LHP/DPDK/04/2025"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="lastName">Temuan</Label>
              <div className="mt-1">
                <TextInput id="lastName" name="lastName" placeholder="Green" />
              </div>
            </div>
            <div>
              <Label htmlFor="email">Rekomendasi</Label>
              <div className="mt-1">
                <TextInput
                  id="email"
                  name="email"
                  placeholder="example@company.com"
                  type="email"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="phone">Batas Waktu</Label>
              <div className="mt-1">
                <TextInput
                  id="phone"
                  name="phone"
                  placeholder="e.g., +(12)3456 789"
                  type="tel"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="department">PIC</Label>
              <div className="mt-1">
                <TextInput
                  id="department"
                  name="department"
                  placeholder="Development"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="company">Email PIC</Label>
              <div className="mt-1">
                <TextInput id="company" name="company" placeholder="Somewhere" />
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button color="primary" onClick={() => setOpen(false)}>
            Input LHP
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

/**
 * ✅ UPDATE MINIMAL DI SINI:
 * - Kolom "Rekomendasi" jadi clickable
 * - Muncul modal "Input Bukti"
 * - Setelah submit, bukti bisa dilihat (modal lihat bukti)
 */
const AllUsersTable = function () {
  const [isInputBuktiOpen, setIsInputBuktiOpen] = useState(false);
  const [isViewBuktiOpen, setIsViewBuktiOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  // Simpan bukti per nomor LHP (frontend state)
  const [buktiByLhp, setBuktiByLhp] = useState({});

  const formatTanggal = (val) => {
  if (!val) return "-";
  const s = String(val);

  // date-only dari input type="date"
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) {
    const d = new Date(`${s}T00:00:00`); // local time
    return new Intl.DateTimeFormat("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(d);
  }

  const d = new Date(s);
  if (Number.isNaN(d.getTime())) return s;

  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(d);
};


  const openInputBukti = (row) => {
    setSelectedRow(row);
    setIsInputBuktiOpen(true);
  };

  const openViewBukti = (row) => {
    setSelectedRow(row);
    setIsViewBuktiOpen(true);
  };

  const handleSubmitBukti = (payload) => {
    if (!selectedRow?.nomorLhp) return;

    setBuktiByLhp((prev) => {
      const prevData = prev[selectedRow.nomorLhp];
      if (prevData?.fileUrl && prevData.fileUrl.startsWith("blob:")) {
        try {
          URL.revokeObjectURL(prevData.fileUrl);
        } catch (e) {}
      }
      return {
        ...prev,
        [selectedRow.nomorLhp]: payload,
      };
    });

    setIsInputBuktiOpen(false);
  };

  // ✅ Hapus bukti
  const handleDeleteBukti = (nomorLhp) => {
    if (!nomorLhp) return;

    setBuktiByLhp((prev) => {
      const next = { ...prev };
      const old = next[nomorLhp];

      if (old?.fileUrl && old.fileUrl.startsWith("blob:")) {
        try {
          URL.revokeObjectURL(old.fileUrl);
        } catch (e) {}
      }

      delete next[nomorLhp];
      return next;
    });

    setIsViewBuktiOpen(false);
  };

  // cleanup saat unmount
  useEffect(() => {
    return () => {
      Object.values(buktiByLhp).forEach((b) => {
        if (b?.fileUrl && b.fileUrl.startsWith("blob:")) {
          try {
            URL.revokeObjectURL(b.fileUrl);
          } catch (e) {}
        }
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
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
          <Table.Row className="hover:bg-gray-100 dark:hover:bg-gray-700">
            <Table.Cell className="mr-12 flex items-center space-x-6 whitespace-nowrap p-4 lg:mr-0">
              <div className="text-sm font-normal text-gray-500 dark:text-gray-400">
                <div className="text-base font-semibold text-gray-900 dark:text-white">
                  1/LHP/DPDK/04/2025
                </div>
              </div>
            </Table.Cell>

            <Table.Cell className="p-4 text-base font-medium text-gray-900 dark:text-white whitespace-normal break-words">
              Dalam pemeriksaan pengawasan terhadap Perusahaan Penjaminan ABC,
              ditemukan bahwa nilai ekuitas perusahaan belum memenuhi ketentuan
              minimum yang diatur oleh OJK sesuai POJK nomor 11 Tahun 2025 tentang
              Penyelenggaraan Usaha Lembaga Penjamin. Ketentuan tersebut
              menetapkan bahwa perusahaan penjaminan lingkup nasional wajib
              memiliki ekuitas minimum sebesar Rp250 miliar, lingkup provinsi
              Rp100 miliar, dan lingkup kabupaten/kota Rp50 miliar, dengan
              tenggat pemenuhan bertahap hingga 31 Desember 2028 (minimal 75%
              dari ketentuan) dan 100% pada akhir 2028. Perusahaan ABC, yang
              beroperasi di lingkup provinsi, masih memiliki ekuitas di bawah
              Rp100 miliar per tanggal pemeriksaan, sehingga berpotensi
              mengurangi kemampuan perusahaan dalam menanggung risiko penjaminan
              secara prudent.
            </Table.Cell>

            {/* ✅ REKOMENDASI: klik -> Input Bukti */}
            <Table.Cell className="p-4 text-base font-medium text-gray-900 dark:text-white whitespace-normal break-words">
              {(() => {
                const rowData = {
                  nomorLhp: "1/LHP/DPDK/04/2025",
                  temuan:
                    "Dalam pemeriksaan pengawasan terhadap Perusahaan Penjaminan ABC, ditemukan bahwa nilai ekuitas perusahaan belum memenuhi ketentuan minimum yang diatur oleh OJK sesuai POJK nomor 11 Tahun 2025 ...",
                };

                const bukti = buktiByLhp[rowData.nomorLhp];

                return (
                  <>
                    <button
                      type="button"
                      onClick={() => openInputBukti(rowData)}
                      className="text-primary-700 hover:underline dark:text-primary-400 text-left"
                      title="Klik untuk input bukti"
                    >
                      Menyusun Rencana Aksi Pemenuhan Ekuitas: Perusahaan wajib
                      menyusun rencana aksi tertulis untuk menambah ekuitas agar
                      memenuhi ketentuan pemenuhan minimum ekuitas sesuai lingkup
                      usaha (provinsi/nasional), termasuk timeline jelas dan
                      sumber pendanaan yang direncanakan.
                    </button>

                    {/* ✅ tampilkan tanggal upload */}
                    <div className="mt-2 flex items-center gap-3">
                      <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                        Bukti:{" "}
                        {bukti
                          ? `Sudah ada • ${formatTanggal(bukti.uploadedAt)}`
                          : "Belum ada"}
                      </span>

                      {bukti && (
                        <button
                          type="button"
                          onClick={() => openViewBukti(rowData)}
                          className="text-xs text-gray-600 hover:underline dark:text-gray-300"
                        >
                          Lihat bukti
                        </button>
                      )}
                    </div>
                  </>
                );
              })()}
            </Table.Cell>

            <Table.Cell className="p-4 text-base font-medium text-gray-900 dark:text-white whitespace-normal break-words">
              30 Juni 2025
            </Table.Cell>

            <Table.Cell className="whitespace-nowrap p-4 text-base font-normal text-gray-900 dark:text-white break-words">
              <div className="flex items-center">
                <div className="mr-2 h-2.5 w-2.5 rounded-full bg-green-400"></div>{" "}
                Belum Tindak Lanjut
              </div>
            </Table.Cell>

            <Table.Cell className="p-4 text-base font-medium text-gray-900 dark:text-white whitespace-normal break-words">
              Witari
              <div className="text-sm font-normal text-gray-500 dark:text-gray-400">
                witari@ojk.go.id.com
              </div>
            </Table.Cell>
          </Table.Row>

          {/* ... (sisanya table row tetap sama persis dari kode kamu) ... */}
        </Table.Body>
      </Table>

      <InputBuktiModal
        isOpen={isInputBuktiOpen}
        onClose={() => setIsInputBuktiOpen(false)}
        row={selectedRow}
        existing={selectedRow ? buktiByLhp[selectedRow.nomorLhp] : null}
        onSubmit={handleSubmitBukti}
      />

      <ViewBuktiModal
        isOpen={isViewBuktiOpen}
        onClose={() => setIsViewBuktiOpen(false)}
        row={selectedRow}
        bukti={selectedRow ? buktiByLhp[selectedRow.nomorLhp] : null}
        onDelete={handleDeleteBukti}  // ✅ baru
      />
    </>
  );
};

/**
 * ✅ MODAL: INPUT BUKTI
 * - Nomor LHP & Temuan auto sesuai row
 * - Input bukti: upload file + link + catatan
 */
const InputBuktiModal = function ({ isOpen, onClose, row, existing, onSubmit }) {
  const [fileObj, setFileObj] = useState(null);
  const [link, setLink] = useState("");
  const [catatan, setCatatan] = useState("");
  const [tanggalBukti, setTanggalBukti] = useState(""); // ✅ tanggal input (YYYY-MM-DD)

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
    if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s; // already date-only
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
      // ✅ prefill: kalau sudah pernah upload -> ambil tanggalnya, kalau belum -> hari ini
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
      uploadedAt: tanggalBukti, // ✅ simpan tanggal dari input (YYYY-MM-DD)
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
};


/**
 * ✅ MODAL: LIHAT BUKTI
 */
const ViewBuktiModal = function ({ isOpen, onClose, row, bukti, onDelete }) {
  if (!row) return null;

  const formatTanggal = (iso) => {
    if (!iso) return "-";
    try {
      return new Intl.DateTimeFormat("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(new Date(iso));
    } catch (e) {
      return iso;
    }
  };

  const handleDelete = () => {
    // langsung hapus (minimal). Kalau mau confirm, nanti aku bikinin modal konfirmasi.
    onDelete?.(row.nomorLhp);
  };

  return (
    <Modal onClose={onClose} show={isOpen} size="lg">
      <Modal.Header className="border-b border-gray-200 !p-6 dark:border-gray-700">
        <strong>Lihat Bukti</strong>
      </Modal.Header>

      <Modal.Body>
        {!bukti ? (
          <p className="text-gray-600 dark:text-gray-300">
            Belum ada bukti untuk LHP ini.
          </p>
        ) : (
          <div className="space-y-3 text-sm text-gray-700 dark:text-gray-200">
            <div>
              <span className="font-semibold">Nomor LHP:</span> {bukti.nomorLhp}
            </div>

            {/* ✅ tanggal upload */}
            <div>
              <span className="font-semibold">Tanggal upload:</span>{" "}
              {formatTanggal(bukti.uploadedAt)}
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
        {/* ✅ tombol hapus */}
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
};


const EditUserModal = function () {
  const [isOpen, setOpen] = useState(false);

  return (
    <>
      <Button color="primary" onClick={() => setOpen(true)}>
        <div className="flex items-center gap-x-2">
          <HiOutlinePencilAlt className="text-lg" />
          Edit user
        </div>
      </Button>
      <Modal onClose={() => setOpen(false)} show={isOpen}>
        <Modal.Header className="border-b border-gray-200 !p-6 dark:border-gray-700">
          <strong>Edit user</strong>
        </Modal.Header>
        <Modal.Body>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <Label htmlFor="firstName">First name</Label>
              <div className="mt-1">
                <TextInput id="firstName" name="firstName" placeholder="Bonnie" />
              </div>
            </div>
            <div>
              <Label htmlFor="lastName">Last name</Label>
              <div className="mt-1">
                <TextInput id="lastName" name="lastName" placeholder="Green" />
              </div>
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <div className="mt-1">
                <TextInput
                  id="email"
                  name="email"
                  placeholder="example@company.com"
                  type="email"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="phone">Phone number</Label>
              <div className="mt-1">
                <TextInput
                  id="phone"
                  name="phone"
                  placeholder="e.g., +(12)3456 789"
                  type="tel"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="department">Department</Label>
              <div className="mt-1">
                <TextInput
                  id="department"
                  name="department"
                  placeholder="Development"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="company">Company</Label>
              <div className="mt-1">
                <TextInput id="company" name="company" placeholder="Somewhere" />
              </div>
            </div>
            <div>
              <Label htmlFor="passwordCurrent">Current password</Label>
              <div className="mt-1">
                <TextInput
                  id="passwordCurrent"
                  name="passwordCurrent"
                  placeholder="••••••••"
                  type="password"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="passwordNew">New password</Label>
              <div className="mt-1">
                <TextInput
                  id="passwordNew"
                  name="passwordNew"
                  placeholder="••••••••"
                  type="password"
                />
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button color="primary" onClick={() => setOpen(false)}>
            Save all
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

const DeleteUserModal = function () {
  const [isOpen, setOpen] = useState(false);

  return (
    <>
      <Button color="failure" onClick={() => setOpen(true)}>
        <div className="flex items-center gap-x-2">
          <HiTrash className="text-lg" />
          Delete user
        </div>
      </Button>
      <Modal onClose={() => setOpen(false)} show={isOpen} size="md">
        <Modal.Header className="px-6 pt-6 pb-0">
          <span className="sr-only">Delete user</span>
        </Modal.Header>
        <Modal.Body className="px-6 pt-0 pb-6">
          <div className="flex flex-col items-center gap-y-6 text-center">
            <HiOutlineExclamationCircle className="text-7xl text-red-500" />
            <p className="text-xl text-gray-500">
              Are you sure you want to delete this user?
            </p>
            <div className="flex items-center gap-x-3">
              <Button color="failure" onClick={() => setOpen(false)}>
                Yes, I&apos;m sure
              </Button>
              <Button color="gray" onClick={() => setOpen(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

const Pagination = function () {
  return (
    <div className="sticky right-0 bottom-0 w-full items-center border-t border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800 sm:flex sm:justify-between">
      <div className="mb-4 flex items-center sm:mb-0">
        <a
          href="#"
          className="inline-flex cursor-pointer justify-center rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
        >
          <span className="sr-only">Previous page</span>
          <HiChevronLeft className="text-2xl" />
        </a>
        <a
          href="#"
          className="mr-2 inline-flex cursor-pointer justify-center rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
        >
          <span className="sr-only">Next page</span>
          <HiChevronRight className="text-2xl" />
        </a>
        <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
          Showing&nbsp;
          <span className="font-semibold text-gray-900 dark:text-white">1-20</span>
          &nbsp;of&nbsp;
          <span className="font-semibold text-gray-900 dark:text-white">2290</span>
        </span>
      </div>
      <div className="flex items-center space-x-3">
        <a
          href="#"
          className="inline-flex flex-1 items-center justify-center rounded-lg bg-primary-700 py-2 px-3 text-center text-sm font-medium text-white hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
        >
          <HiChevronLeft className="mr-1 text-base" />
          Previous
        </a>
        <a
          href="#"
          className="inline-flex flex-1 items-center justify-center rounded-lg bg-primary-700 py-2 px-3 text-center text-sm font-medium text-white hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
        >
          Next
          <HiChevronRight className="ml-1 text-base" />
        </a>
      </div>
    </div>
  );
};

export default Tabel1;
