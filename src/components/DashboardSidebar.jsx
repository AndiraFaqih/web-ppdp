import { Sidebar } from "flowbite-react";
import { FaList, FaClipboardList, FaHistory } from "react-icons/fa";
import { MdOutlineManageAccounts } from "react-icons/md";
import { useLocation, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

// Dashboard Sidebar
const DashboardSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const currPage = location.pathname;

  const token = localStorage.getItem("jwtToken");
  const decodedToken = jwtDecode(token);
  const role = decodedToken.role;

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <Sidebar
      aria-label="Sidebar with multi-level dropdown example"
      className="bg-white"
    >
      <div className="-mx-3 -mt-4 flex h-full flex-col justify-between bg-white px-3">
        <Sidebar.Items>
          <Sidebar.ItemGroup className="border-t-0">
            {role === "admin" && (
              <>
                <Sidebar.Item
                  onClick={() => handleNavigation("/absence")}
                  icon={FaClipboardList}
                  className={
                    "/absence" === currPage
                      ? "my-3 cursor-pointer bg-gray-100 dark:bg-gray-700"
                      : "my-3 cursor-pointer"
                  }
                >
                  Halaman Muka
                </Sidebar.Item>
              </>
            )}

            {role === "employee" && (
              <>
                <Sidebar.Item
                  onClick={() => handleNavigation("/attendance-history")}
                  icon={FaHistory}
                  className={
                    "/attendance-history" === currPage
                      ? "my-3 cursor-pointer bg-gray-100 dark:bg-gray-700"
                      : "my-3 cursor-pointer"
                  }
                >
                  My Attendance History
                </Sidebar.Item>
                <Sidebar.Item
                  onClick={() => handleNavigation("/absence")}
                  icon={FaClipboardList}
                  className={
                    "/absence" === currPage
                      ? "my-3 cursor-pointer bg-gray-100 dark:bg-gray-700"
                      : "my-3 cursor-pointer"
                  }
                >
                  Absence
                </Sidebar.Item>
              </>
            )}
          </Sidebar.ItemGroup>
        </Sidebar.Items>
      </div>
    </Sidebar>
  );
};

export default DashboardSidebar;
