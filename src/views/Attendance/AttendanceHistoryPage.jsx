import { Table } from "flowbite-react";
import { Helmet } from "react-helmet-async";
import { attendanceService } from "../../service/attendance-service";
import { useEffect, useState } from "react";
import NavbarSidebarLayout from "../Admin/layouts/NavbarSidebar";
import ProductTable from "../../components/ProductTable";

// Table for displaying attendance data
const AttendanceTableHistory = (props) => {
  const { attendances = [] } = props;

  return (
    <div className="rounded-lg bg-white p-4 shadow dark:bg-gray-800 sm:p-6 xl:p-8">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">
            My Attendances History
          </h3>
          <span className="text-base font-normal text-gray-600 dark:text-gray-400">
            List of Your Attendances History
          </span>
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
                          {item.employee?.email}
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
                          {item.attendanceTime}
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

// Attendance history page
const AttendanceHistoryPage = () => {
  const [attendances, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAttendances = async () => {
    setLoading(true);
    try {
      const response = await attendanceService.getAttendanceByEmployee();
      const attendances = response?.data?.attendance || [];
      setAttendance(attendances);
    } catch (error) {
      console.error("Failed to fetch employees:", error);
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
        <title>Attendances History</title>
      </Helmet>
      <NavbarSidebarLayout isFooter={true}>
        <div className="flex flex-col">
          <div className="overflow-x-auto">
            <div className="inline-block min-w-full align-middle">
              <div className="px-4 py-6">
                {loading ? (
                  <div className="text-center">Loading...</div>
                ) : (
                  // <AttendanceTableHistory attendances={attendances} />
                  <ProductTable />
                )}
              </div>
            </div>
          </div>
        </div>
      </NavbarSidebarLayout>
    </>
  );
};

export default AttendanceHistoryPage;
