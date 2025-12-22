import { Button } from "flowbite-react";
import { HiRefresh } from "react-icons/hi";

export default function ResetFiltersButton({ onClick, disabled }) {
  return (
    <Button color="gray" onClick={onClick} disabled={disabled}>
      <HiRefresh className="mr-2 h-5 w-5" />
      Reset
    </Button>
  );
}
