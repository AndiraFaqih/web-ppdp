import { Button } from "flowbite-react";
import { HiPlus } from "react-icons/hi";

export default function AddLhpButton({ onClick }) {
  return (
    <Button color="primary" onClick={onClick}>
      <div className="flex items-center gap-x-3">
        <HiPlus className="text-xl" />
        Input LHP
      </div>
    </Button>
  );
}
