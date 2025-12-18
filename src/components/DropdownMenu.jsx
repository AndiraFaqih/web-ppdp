// Dropdown menu component
const DropdownMenu = (props) => {
  const { name, email, onSignOut } = props;
  return (
    <div
      id="dropdownInformation"
      className="absolute -right-1 z-10 mt-44 w-44 divide-y divide-gray-100 rounded-lg bg-white shadow dark:divide-gray-600 dark:bg-gray-700"
    >
      <div className="px-4 py-3 text-sm text-gray-900 dark:text-white">
        <div>{name}</div>
        <div className="truncate font-medium">{email}</div>
      </div>
      <div className="py-2">
        <a
          onClick={onSignOut}
          className="block cursor-pointer px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600 dark:hover:text-white"
        >
          Sign out
        </a>
      </div>
    </div>
  );
};

export default DropdownMenu;
