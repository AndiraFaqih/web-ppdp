export default function ViewBuktiButton({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-xs text-gray-600 hover:underline dark:text-gray-300"
    >
      Lihat bukti
    </button>
  );
}
