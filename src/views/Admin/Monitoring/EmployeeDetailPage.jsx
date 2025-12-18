/* eslint-disable react-hooks/exhaustive-deps */
import { Label, TextInput } from "flowbite-react";
import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import NavbarSidebarLayout from "../layouts/NavbarSidebar";
import { useParams } from "react-router-dom";
import { adminService } from "../../../service/admin-service";

// Detail data component
const DetailData = (props) => {
  const { employee } = props;

  return (
    <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800 sm:p-8">
      <h2 className="mb-6 text-2xl font-bold leading-none text-gray-900 dark:text-white">
        Employee Detail Data
      </h2>

      <div className="mb-10 border-2 border-dashed border-blue-900 p-8">
        <h3 className="col-span-2 mb-6 mt-2 text-xl font-medium leading-none text-gray-900 dark:text-white">
          General Personal Information
        </h3>

        <form className="grid grid-cols-1 gap-6">
          {/* Name */}
          <div>
            <Label className="mb-2 block">
              Name
            </Label>
            <TextInput
              id="name"
              className="mt-1"
              defaultValue={employee?.name || ""}
              disabled
            />
          </div>

          {/* Email */}
          <div>
            <Label className="mb-2 block">
              Email
            </Label>
            <TextInput
              className="mt-1"
              defaultValue={employee?.email || ""}
              disabled
            />
          </div>

          {/* Role */}
          <div>
            <Label className="mb-2 block">
              Role
            </Label>
            <TextInput
              className="mt-1"
              defaultValue={employee?.role || ""}
              disabled
            />
          </div>
        </form>
      </div>
    </div>
  );
};

// Employee detail page
const EmployeeDetailPage = () => {
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchEmployeeById = async () => {
    setLoading(true);
    try {
      const response = await adminService.getEmployeeById(Number(id));
      setEmployee(response.data.employee);
    } catch (error) {
      console.error("Failed to fetch employees:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchEmployeeById(Number(id));
    }
  }, [id]);

  return (
    <>
      <Helmet>
        <title>Employee Detail</title>
      </Helmet>
      <NavbarSidebarLayout>
        <div className="px-4 pt-6">
          {loading ? (
            <div className="text-center">Loading...</div>
          ) : (
            <DetailData employee={employee} />
          )}
        </div>
      </NavbarSidebarLayout>
    </>
  );
};

export default EmployeeDetailPage;
