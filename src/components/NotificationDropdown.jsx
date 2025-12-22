export default function NotificationDropdown({
  isOpen,
  notifList = [],
  onClose,
  onClickItem,
}) {
  if (!isOpen) return null;

  const notifCount = notifList?.length || 0;

  return (
    <div className="absolute right-0 top-12 z-50 w-96 rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
      <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3 dark:border-gray-700">
        <p className="text-sm font-semibold text-gray-900 dark:text-white">
          Notifikasi (H-3 Batas Waktu)
        </p>
        <button
          type="button"
          className="text-xs text-gray-500 hover:underline dark:text-gray-400"
          onClick={onClose}
        >
          Tutup
        </button>
      </div>

      <div className="max-h-96 overflow-auto">
        {notifCount === 0 ? (
          <div className="px-4 py-4 text-sm text-gray-500 dark:text-gray-400">
            Tidak ada notifikasi.
          </div>
        ) : (
          notifList.map((n) => (
            <button
              key={n.key}
              type="button"
              onClick={() => onClickItem?.(n)}
              className="w-full border-b border-gray-100 px-4 py-3 text-left hover:bg-gray-50
                         dark:border-gray-700 dark:hover:bg-gray-700"
            >
              <div className="text-sm font-semibold text-gray-900 dark:text-white">
                {n.nomorLhp}
              </div>
              <div className="mt-0.5 text-xs text-gray-600 dark:text-gray-300">
                Batas Waktu: <span className="font-medium">{n.batasWaktu}</span>
              </div>
              {n.rekomPreview && (
                <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  {n.rekomPreview}
                </div>
              )}
            </button>
          ))
        )}
      </div>
    </div>
  );
}
