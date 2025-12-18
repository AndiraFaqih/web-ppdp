import { Toast as FlowbiteToast } from "flowbite-react";

// Toast component
const Toast = ({ message, color, icon, onClose }) => {
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <FlowbiteToast
        className={`bg-opacity-85 ${
          color === "success" ? "bg-[#68c63b]" : "bg-[#e13f25]"
        }`}
      >
        <div className="inline-flex size-8 shrink-0 items-center justify-center font-medium text-white">
          {icon}
        </div>
        <div className="mx-5 text-sm font-medium text-white">{message}</div>
        <FlowbiteToast.Toggle
          className="bg-transparent text-white"
          onClick={onClose}
        />
      </FlowbiteToast>
    </div>
  );
};

export default Toast;
