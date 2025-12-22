import { Button } from "flowbite-react";
import { HiOutlinePencilAlt } from "react-icons/hi";

export default function UpdateDataButton({ onClick }) {
  return (
    <Button color="gray" onClick={onClick}>
      <div className="flex items-center gap-x-3">
        <HiOutlinePencilAlt className="text-xl" />
        <span>Update Data</span>
      </div>
    </Button>
  );
}
