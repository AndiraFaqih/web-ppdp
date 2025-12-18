import { Table } from "flowbite-react";
import { Helmet } from "react-helmet-async";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { adminService } from "../../../service/admin-service";
import NavbarSidebarLayout from "../layouts/NavbarSidebar";
import {
  Label,
  Button,
  Modal,
  TextInput,
  Select,
  Spinner,
} from "flowbite-react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FaPlus } from "react-icons/fa";
import {
  HiCheck,
  HiOutlineExclamationCircle,
  HiOutlineTrash,
  HiOutlinePencilAlt,
} from "react-icons/hi";
import Toast from "../../../components/Toast";
import { useNavigate } from "react-router-dom";

// Validation schema for adding employee
const addSchema = z.object({
  name: z
    .string({
      required_error: "Name is required",
    })
    .nonempty("Name is required")
    .min(3, { message: "Name must be at least 3 characters" })
    .max(50, { message: "Name must be at most 50 characters" }),

  email: z
    .string({
      required_error: "Email is required",
    })
    .nonempty("Email is required")
    .email({ message: "Please enter a valid email address" }),

  password: z
    .string({
      required_error: "Password is required",
    })
    .nonempty("Password is required")
    .min(6, { message: "Password must be at least 6 characters" }),

  role: z.enum(["employee", "admin"], {
    message: "Role must be either 'employee' or 'admin'",
  }),
});

// Validation schema for editing employee
const editSchema = z.object({
  name: z
    .string({
      required_error: "Name is required",
    })
    .nonempty("Name is required")
    .min(3, { message: "Name must be at least 3 characters" })
    .max(50, { message: "Name must be at most 50 characters" }),

  email: z
    .string({
      required_error: "Email is required",
    })
    .nonempty("Email is required")
    .email({ message: "Please enter a valid email address" }),

  role: z.enum(["employee", "admin"], {
    message: "Role must be either 'employee' or 'admin'",
  }),
});

// Add employee component
const AddEmployee = (props) => {
  const { onAddEmployeeSuccess, onAddEmployeeError } = props;
  const [isOpen, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const openModal = () => {
    reset();
    setOpen(true);
  };

  const closeModal = () => {
    reset();
    setOpen(false);
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(addSchema),
  });

  const onSubmitEmployee = async (data) => {
    setIsLoading(true);
    try {
      await adminService.addEmployee(data);
      onAddEmployeeSuccess();
      closeModal();
    } catch (error) {
      onAddEmployeeError();
      console.error("Failed to add employee:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button pill className="p-1" color="primary" onClick={openModal}>
        <FaPlus className="mr-3 mt-1 text-sm" />
        Add Employee
      </Button>
      <Modal onClose={() => setOpen(false)} show={isOpen}>
        <Modal.Header className="border-b border-gray-200 !p-6 dark:border-gray-700">
          <strong>Add Employee</strong>
        </Modal.Header>
        <Modal.Body className="max-h-[70vh] overflow-y-auto">
          <form>
            <div className="grid grid-cols-1 gap-6">
              {/* Name */}
              <div>
                <Label htmlFor="name">
                  Name <span className="text-red-500">*</span>
                </Label>
                <TextInput
                  id="name"
                  {...register("name", { required: true })}
                  className="mt-1"
                  defaultValue=""
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.name.message || "Name is required"}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <Label htmlFor="email">
                  Email <span className="text-red-500">*</span>
                </Label>
                <TextInput
                  id="email"
                  type="email"
                  {...register("email", { required: true })}
                  className="mt-1"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.email.message || "Email is required"}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <Label htmlFor="password">
                  Password <span className="text-red-500">*</span>
                </Label>
                <TextInput
                  id="password"
                  type="password"
                  {...register("password", { required: true })}
                  className="mt-1"
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.password.message || "Password is required"}
                  </p>
                )}
              </div>

              {/* Role */}
              <div>
                <Label htmlFor="role">
                  Role <span className="text-red-500">*</span>
                </Label>
                <Select
                  id="role"
                  {...register("role", { required: true })}
                  defaultValue=""
                  className="mt-1"
                >
                  <option value="" disabled>
                    Select Role
                  </option>
                  <option value="employee">Employee</option>
                  <option value="admin">Admin</option>
                </Select>
                {errors.role && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.role.message || "Role is required"}
                  </p>
                )}
              </div>
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <div className="flex items-center gap-x-3">
            <Button
              type="submit"
              className="font-medium"
              color="primary"
              onClick={handleSubmit(onSubmitEmployee)}
              disabled={isLoading}
            >
              {isLoading ? (
                <Spinner color="info" aria-label="Loading spinner" />
              ) : (
                "Add Employee"
              )}
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

// Edit employee component
const EditButton = (props) => {
  const { onEditEmployeeSuccess, onEditEmployeeError, employee } = props;
  const [isOpen, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const openModal = () => {
    reset();
    setOpen(true);
  };

  const closeModal = () => {
    reset();
    setOpen(false);
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(editSchema),
  });

  const onSubmitEditEmployee = async (data) => {
    setIsLoading(true);
    try {
      await adminService.updateEmployee(data, employee.id);

      onEditEmployeeSuccess();
      closeModal();
    } catch (error) {
      onEditEmployeeError();
      console.error("Failed to edit employee:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button pill className="py-[5px]" color="warning" onClick={openModal}>
        <HiOutlinePencilAlt className="mr-2 mt-0.5 text-lg" />
        Edit
      </Button>
      <Modal onClose={() => setOpen(false)} show={isOpen}>
        <Modal.Header className="border-b border-gray-200 !p-6 dark:border-gray-700">
          <strong>Edit Employee</strong>
        </Modal.Header>
        <Modal.Body className="max-h-[70vh] overflow-y-auto">
          <form>
            <div className="grid grid-cols-1 gap-6">
              {/* Name */}
              <div>
                <Label htmlFor="name">Name</Label>
                <TextInput
                  id="name"
                  {...register("name")}
                  className="mt-1"
                  defaultValue={employee?.name || ""}
                />
                {errors.name && (
                  <p className="text-red-500">{errors.name.message}</p>
                )}
              </div>
              {/* email */}
              <div>
                <Label htmlFor="email">Email</Label>
                <TextInput
                  id="email"
                  {...register("email")}
                  className="mt-1"
                  defaultValue={employee?.email || ""}
                />
                {errors.email && (
                  <p className="text-red-500">{errors.email.message}</p>
                )}
              </div>
              {/* Role */}
              <div>
                <Label htmlFor="role">Role</Label>
                <Select
                  id="role"
                  {...register("role", { required: true })}
                  defaultValue={employee?.role || ""}
                  className="mt-1"
                >
                  <option value="" disabled>
                    Select Role
                  </option>
                  <option value="employee">Employee</option>
                  <option value="admin">Admin</option>
                </Select>
                {errors.role && (
                  <p className="text-red-500">{errors.role.message}</p>
                )}
              </div>
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <div className="flex items-center gap-x-3">
            <Button
              className="font-medium"
              color="primary"
              onClick={handleSubmit(onSubmitEditEmployee)}
              disabled={isLoading}
            >
              {isLoading ? (
                <Spinner color="info" aria-label="Loading spinner" />
              ) : (
                "Edit Employee"
              )}
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

// Delete employee component
const DeleteButton = (props) => {
  const { employeeId, onDeleteEmployeeSuccess, onDeleteEmployeeError } = props;
  const [isOpen, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await adminService.deleteEmployee(employeeId);
      onDeleteEmployeeSuccess();
      setOpen(false);
    } catch (error) {
      onDeleteEmployeeError();
      console.error("Failed to delete employee:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button
        pill
        className="p-1"
        color="failure"
        onClick={() => setOpen(!isOpen)}
      >
        <HiOutlineTrash className="mr-2 mt-px text-lg" />
        Delete
      </Button>

      <Modal onClose={() => setOpen(false)} show={isOpen} size="md">
        <Modal.Header className="px-3 pb-0 pt-3">
          <span className="sr-only">Delete Employee</span>
        </Modal.Header>
        <Modal.Body className="px-6 pb-6 pt-0">
          <div className="flex flex-col items-center gap-y-6 text-center">
            <HiOutlineExclamationCircle className="text-7xl text-red-600" />
            <p className="text-lg text-gray-500 dark:text-gray-300">
              Are you sure you want to delete this employee?
            </p>
            <div className="flex items-center gap-x-3">
              <Button
                color="failure"
                onClick={handleDelete}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Spinner color="info" aria-label="Loading spinner" />
                ) : (
                  "Yes, I'm sure"
                )}
              </Button>
              <Button color="gray" onClick={() => setOpen(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

// Employee table component
const EmployeeTable = (props) => {
  const {
    employees,
    onAddEmployeeSuccess,
    onAddEmployeeError,
    onEditEmployeeSuccess,
    onEditEmployeeError,
    onDeleteEmployeeSuccess,
    onDeleteEmployeeError,
  } = props;

  const navigate = useNavigate();
  const goToEmployeeDetail = (id) => {
    navigate(`/admin/employee-detail/${id}`);
  };

  return (
    <div className="rounded-lg bg-white p-4 shadow dark:bg-gray-800 sm:p-6 xl:p-8">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">
            List of Employees
          </h3>
        </div>
        <div className="shrink-0">
          <div className="block items-center sm:flex">
            <div className="flex items-center">
              {
                <AddEmployee
                  onAddEmployeeSuccess={onAddEmployeeSuccess}
                  onAddEmployeeError={onAddEmployeeError}
                />
              }
            </div>
          </div>
        </div>
      </div>
      <div className="mt-8 flex flex-col">
        <div className="overflow-x-auto rounded-lg">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden shadow sm:rounded-lg">
              <Table
                striped
                className="min-w-full divide-y divide-gray-200 dark:divide-gray-600"
              >
                <Table.Head className="bg-gray-50 dark:bg-gray-700">
                  <Table.HeadCell className="text-center">No</Table.HeadCell>
                  <Table.HeadCell className="min-w-[100px] text-center">
                    Name
                  </Table.HeadCell>
                  <Table.HeadCell className="text-center">Email</Table.HeadCell>
                  <Table.HeadCell className="text-center">Role</Table.HeadCell>
                  <Table.HeadCell className="text-center">
                    Action
                  </Table.HeadCell>
                </Table.Head>
                <Table.Body className="bg-white dark:bg-gray-800">
                  {employees.length > 0 ? (
                    employees.map((employee, index) => (
                      <Table.Row key={`${employee.id}-${index}`}>
                        <Table.Cell className="text-center">
                          {index + 1}
                        </Table.Cell>
                        <Table.Cell
                          className="cursor-pointer text-center font-semibold text-blue-800 underline underline-offset-2"
                          onClick={() => goToEmployeeDetail(employee.id)}
                        >
                          {employee.name ?? "Unknown"}
                        </Table.Cell>
                        <Table.Cell className="text-center">
                          {employee.email}
                        </Table.Cell>
                        <Table.Cell className="text-center">
                          {employee.role}
                        </Table.Cell>
                        <Table.Cell className="flex justify-center">
                          <div className="flex items-center gap-x-3">
                            <EditButton
                              employee={employee}
                              onEditEmployeeSuccess={onEditEmployeeSuccess}
                              onEditEmployeeError={onEditEmployeeError}
                            />
                            <DeleteButton
                              employeeId={employee.id}
                              onDeleteEmployeeSuccess={onDeleteEmployeeSuccess}
                              onDeleteEmployeeError={onDeleteEmployeeError}
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                    ))
                  ) : (
                    <Table.Row>
                      <Table.Cell
                        colSpan={5}
                        className="text-center text-gray-500"
                      >
                        No Employees found.
                      </Table.Cell>
                    </Table.Row>
                  )}
                </Table.Body>
              </Table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Employee management page
const EmployeeManagementPage = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(null);
  const [errorToast, setErrorToast] = useState(null);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const response = await adminService.getEmployees();
      const employees = response?.data?.employees || [];
      setEmployees(employees);
    } catch (error) {
      console.error("Failed to fetch employees:", error);
      setErrorToast({ message: "Failed to fetch employees" });
      setTimeout(() => setErrorToast(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleEmployeeAdded = (message) => {
    setShowToast({ message });
    setTimeout(() => setShowToast(null), 3000);
    fetchEmployees();
  };

  const handleEmployeeError = (message) => {
    setErrorToast({ message });
    setTimeout(() => setErrorToast(null), 3000);
  };

  return (
    <>
      <Helmet>
        <title>Employee Management</title>
      </Helmet>
      <NavbarSidebarLayout isFooter={true}>
        <div className="flex flex-col">
          <div className="overflow-x-auto">
            <div className="inline-block min-w-full align-middle">
              <div className="px-4 py-6">
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
                {loading ? (
                  <div className="text-center">Loading...</div>
                ) : (
                  <EmployeeTable
                    employees={employees || []}
                    onAddEmployeeSuccess={() =>
                      handleEmployeeAdded("Employee added successfully")
                    }
                    onAddEmployeeError={() =>
                      handleEmployeeError("Failed to add employee")
                    }
                    onEditEmployeeSuccess={() =>
                      handleEmployeeAdded("Employee updated successfully")
                    }
                    onEditEmployeeError={() =>
                      handleEmployeeError("Failed to update employee")
                    }
                    onDeleteEmployeeSuccess={() =>
                      handleEmployeeAdded("Employee deleted successfully")
                    }
                    onDeleteEmployeeError={() =>
                      handleEmployeeError("Failed to delete employee")
                    }
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </NavbarSidebarLayout>
    </>
  );
};

export default EmployeeManagementPage;
