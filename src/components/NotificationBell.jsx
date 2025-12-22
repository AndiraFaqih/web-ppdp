import { HiBell } from "react-icons/hi";

export default function NotificationBell({ count = 0, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="relative rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900
                 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
      aria-label="Notifications"
    >
      <HiBell className="h-6 w-6" />
      {count > 0 && (
        <span className="absolute -top-0.5 -right-0.5 inline-flex h-[18px] min-w-[18px]
                         items-center justify-center rounded-full bg-red-600 px-1
                         text-[11px] font-bold text-white">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </button>
  );
}
