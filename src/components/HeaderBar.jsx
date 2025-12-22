import { Breadcrumb, Label, TextInput } from "flowbite-react";
import { useState } from "react";

import AddLhpButton from "./AddLhpButton";
import AddLhpModal from "./AddLhpModal";

import UpdateDataButton from "./UpdateDataButton";
import UpdateDataModal from "./UpdateDataModal";

export default function HeaderBar({
  rows = [],
  onAddLhpPayload,
  onAddUpdateRow,
  onUpdateRowDate,
}) {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);

  return (
    <>
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
              <AddLhpButton onClick={() => setIsAddOpen(true)} />
              <UpdateDataButton onClick={() => setIsUpdateOpen(true)} />
            </div>
          </div>
        </div>
      </div>

      <AddLhpModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSubmit={onAddLhpPayload}
      />

      <UpdateDataModal
        isOpen={isUpdateOpen}
        onClose={() => setIsUpdateOpen(false)}
        rows={rows}
        onAddRow={onAddUpdateRow}
        onUpdateRowDate={onUpdateRowDate}
      />
    </>
  );
}
