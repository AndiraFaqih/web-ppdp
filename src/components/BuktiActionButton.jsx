export default function BuktiActionButton({ text, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-primary-700 hover:underline dark:text-primary-400 text-left"
      title="Klik untuk input bukti"
    >
      {text}
    </button>
  );
}
