import { Badge } from "flowbite-react";
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { HiUpload } from "react-icons/hi";
import NavbarSidebarLayout from "../Admin/layouts/NavbarSidebar";
import { Button } from "flowbite-react";
import { HiOutlinePencilAlt } from "react-icons/hi";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { attendanceService } from "../../service/attendance-service";
import Toast from "../../components/Toast";
import { HiCheck, HiOutlineExclamationCircle } from "react-icons/hi";

// Zod schema for form validation
const schema = z.object({
  photo: z
    .instanceof(File)
    .refine(
      (file) => /\.(jpg|jpeg|png|gif)$/i.test(file.name),
      "Photo must be a valid image file (jpg, jpeg, png)"
    ),
});

// Component for adding new attendance
const AttachedData = (props) => {
  const { onAttendanceSuccess, onAttendanceError } = props;

  const [isLoading, setIsLoading] = useState(false);

  // State for file upload
  const [photoFileName, setPhotoFileName] = useState("");
  const [isPhotoDragging, setIsPhotoDragging] = useState(false);

  const {
    reset,
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const handleFileChange = (fieldName) => (event) => {
    const file = event.target.files?.[0];
    if (file) {
      setValue(fieldName, file);

      if (fieldName === "photo") {
        setPhotoFileName(file.name);
      }
    }
  };

  const onSubmitAttendance = async (data) => {
    setIsLoading(true);

    console.log("data ", data);
    try {
      await attendanceService.markAttendance(data.photo);
      reset();
      setPhotoFileName("");
      onAttendanceSuccess();
    } catch (error) {
      onAttendanceError();
      console.error("Failed to add employee:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800 sm:p-8">
      <h2 className="mb-7 text-2xl font-bold leading-none text-gray-900 dark:text-white">
        Absence
      </h2>

      <div className="mb-5">
        <form className="grid grid-cols-1 gap-6">
          <div className="lg:col-span-1">
            <Badge
              color="indigo"
              size="sm"
              className="rounded-lg py-1 text-base font-medium leading-none"
            >
              Photo <span className="text-red-500">*</span>
            </Badge>
            <div className="mt-5 flex w-full items-center justify-center">
              <label
                className="flex h-32 w-full cursor-pointer flex-col rounded border-2 border-dashed border-blue-900 hover:bg-blue-50"
                onDragOver={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  e.currentTarget.classList.add("bg-blue-50");
                  setIsPhotoDragging(true);
                }}
                onDragLeave={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  e.currentTarget.classList.remove("bg-blue-50");
                  setIsPhotoDragging(false);
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  e.currentTarget.classList.remove("bg-blue-50");
                  setIsPhotoDragging(false);
                  const file = e.dataTransfer.files[0];
                  if (file) {
                    setPhotoFileName(file.name);
                  }
                }}
              >
                <div className="flex flex-col items-center justify-center pb-6 pt-5">
                  <HiUpload className="text-4xl text-gray-300" />
                  {photoFileName ? (
                    <p className="py-1 text-sm text-gray-600">
                      {photoFileName}
                    </p>
                  ) : (
                    <>
                      <p
                        className={`py-1 ${
                          isPhotoDragging
                            ? "text-base font-semibold"
                            : "text-sm"
                        } text-gray-600 dark:text-gray-500`}
                      >
                        {isPhotoDragging
                          ? "Drop your attendance photo here"
                          : "Upload your attendance photo or drag and drop it here"}
                      </p>
                      {!isPhotoDragging && (
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Accepted formats: PNG, JPG, JPEG, up to 2MB
                        </p>
                      )}
                    </>
                  )}
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept=".jpg,.jpeg,.png"
                  {...register("photo", { required: true })}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setPhotoFileName(file.name);
                    }
                    handleFileChange("photo")(e);
                  }}
                />
              </label>
            </div>
            {errors.photo && (
              <p className="mt-1 text-sm text-red-500">
                {errors.photo.message}
              </p>
            )}
          </div>
          <Button
            pill
            className="py-[5px] w-32"
            color="success"
            onClick={handleSubmit(onSubmitAttendance)}
            isLoading={isLoading}
          >
            <HiOutlinePencilAlt className="mr-2 mt-0.5 text-lg" />
            Submit
          </Button>
        </form>
      </div>
    </div>
  );
};

// Attendance page
const AttendancePage = () => {
  const [showToast, setShowToast] = useState(null);
  const [errorToast, setErrorToast] = useState(null);

  const handleEmployeeAdded = (message) => {
    setShowToast({ message });
    setTimeout(() => setShowToast(null), 3000);
  };

  const handleEmployeeError = (message) => {
    setErrorToast({ message });
    setTimeout(() => setErrorToast(null), 3000);
  };

  return (
    <>
      <Helmet>
        <title>Attendance Page</title>
      </Helmet>
      <NavbarSidebarLayout>
        <div className="px-4 pt-6">
          {showToast && (
            <Toast
              message={showToast.message}
              color="success"
              icon={<HiCheck className="size-5" />}
              onClose={() => setShowToast(null)}
            />
          )}

          {errorToast && (
            <Toast
              message={errorToast.message}
              color="error"
              icon={<HiOutlineExclamationCircle className="size-5" />}
              onClose={() => setErrorToast(null)}
            />
          )}
          <AttachedData
            onAttendanceSuccess={() =>
              handleEmployeeAdded("Absence successfully")
            }
            onAttendanceError={() => handleEmployeeError("Failed to absence")}
          />
        </div>
      </NavbarSidebarLayout>
    </>
  );
};

export default AttendancePage;
