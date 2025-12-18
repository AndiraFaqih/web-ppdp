import { Table } from "flowbite-react";
import { Helmet } from "react-helmet-async";
import NavbarSidebarLayout from "../layouts/NavbarSidebar";
import { adminService } from "../../../service/admin-service";
import { useEffect, useState } from "react";

// Table for displaying attendance data
const AttendanceTable = (props) => {
  const { attendances = [] } = props;

  return (
    <div className="rounded-lg bg-white p-4 shadow dark:bg-gray-800 sm:p-6 xl:p-8">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">
            List of Employees Attendances
          </h3>
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
                  <Table.HeadCell className="min-w-[70px] text-center">
                    Proof of Attendance
                  </Table.HeadCell>
                  <Table.HeadCell className="text-center">
                    Attendance Time
                  </Table.HeadCell>
                </Table.Head>
                <Table.Body className="bg-white dark:bg-gray-800">
                  {attendances.length > 0 ? (
                    attendances.map((item, index) => (
                      <Table.Row key={`${item.id}-${index}`}>
                        <Table.Cell className="text-center">
                          {index + 1}
                        </Table.Cell>
                        <Table.Cell className="text-center">
                          {item.employee?.name ?? "Unknown"}
                        </Table.Cell>
                        <Table.Cell className="text-center">
                          {item.employee?.email ?? "Unknown"}
                        </Table.Cell>
                        <Table.Cell className="text-center">
                          {item.photo ? (
                            <a
                              href={item.photo}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-800 underline"
                            >
                              View Proof
                            </a>
                          ) : (
                            "No Proof"
                          )}
                        </Table.Cell>
                        <Table.Cell className="text-center">
                          {item.attendanceTime ?? "Unknown"}
                        </Table.Cell>
                      </Table.Row>
                    ))
                  ) : (
                    <Table.Row>
                      <Table.Cell
                        colSpan={5}
                        className="text-center text-gray-500"
                      >
                        No Attendance found.
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

// Attendance Monitoring Page
const AttendanceMonitoringPage = () => {
  const [attendances, setAttendances] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchAttendances = async () => {
    setLoading(true);
    try {
      const response = await adminService.getAttendance();
      const attendances = response?.data?.attendance || [];
      setAttendances(attendances);
    } catch (error) {
      console.error("Failed to fetch attendances:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendances();
  }, []);

  return (
    <>
      <Helmet>
        <title>Attendances Monitoring</title>
      </Helmet>
      <NavbarSidebarLayout isFooter={true}>
        <div className="flex flex-col">
          <div className="overflow-x-auto">
            <div className="inline-block min-w-full align-middle">
              <div className="px-4 py-6">
                {loading ? (
                  <div className="text-center">Loading...</div>
                ) : (
                  <AttendanceTable attendances={attendances} />
                )}
              </div>
            </div>
          </div>
        </div>
      </NavbarSidebarLayout>
    </>
  );
};

export default AttendanceMonitoringPage;
