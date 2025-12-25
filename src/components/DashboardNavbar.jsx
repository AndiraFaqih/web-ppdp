import { Navbar, Avatar, Badge } from "flowbite-react";
import { useRef, useState, useEffect } from "react";
import DropdownMenu from "./DropdownMenu";
import { useNavigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

import NotificationBell from "./NotificationBell";
import NotificationDropdown from "./NotificationDropdown";

const DashboardNavbar = () => {
  const token = localStorage.getItem("jwtToken");
  const decodedToken = jwtDecode(token);
  const name = decodedToken.name;
  const email = decodedToken.email;

  const navigate = useNavigate();
  const location = useLocation();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const dropdownRef = useRef(null);

  const [notifList, setNotifList] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("lhp_notifications") || "[]");
    } catch {
      return [];
    }
  });

  const handleAvatarClick = () => {
    setIsDropdownOpen((prev) => !prev);
    setIsNotifOpen(false);
  };

  const handleNotifClick = () => {
    setIsNotifOpen((prev) => !prev);
    setIsDropdownOpen(false);
  };

  const handleSignOut = () => {
    localStorage.removeItem("jwtToken");
    navigate("/login");
  };

  useEffect(() => {
    const handler = (e) => {
      const list = e?.detail || [];
      setNotifList(Array.isArray(list) ? list : []);
    };

    window.addEventListener("lhpNotificationsUpdated", handler);
    return () => window.removeEventListener("lhpNotificationsUpdated", handler);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
        setIsNotifOpen(false);
      }
    };

    if (isDropdownOpen || isNotifOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isDropdownOpen, isNotifOpen]);

  const ATTENDANCE_ROUTE = "/absence";

  const handleClickNotifItem = (n) => {
    setIsNotifOpen(false);

    const target = {
      rowId: n.rowId,
      nomorLhp: n.nomorLhp,
      batasWaktu: n.batasWaktu,
    };

    const isOnAttendance =
      location.pathname === ATTENDANCE_ROUTE ||
      location.pathname.startsWith(`${ATTENDANCE_ROUTE}/`);

    if (!isOnAttendance) {
      localStorage.setItem("lhp_scroll_target", JSON.stringify(target));
      navigate(ATTENDANCE_ROUTE);
      return;
    }

    window.dispatchEvent(new CustomEvent("goToLhpRow", { detail: target }));
  };


  const notifCount = notifList?.length || 0;

  return (
    <Navbar fluid className="bg-white/80 backdrop-blur border-b border-gray-200 dark:bg-gray-900/80 dark:border-gray-700">
      <div className="w-full p-3 lg:px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Navbar.Brand>
              <span className="self-center whitespace-nowrap text-xl font-semibold text-gray-900 dark:text-white">
                Pemantauan Tindak Lanjut Rekomendasi LHP
              </span>
            </Navbar.Brand>
            {/* <Badge color="blue">Dashboard</Badge> */}
          </div>

          <div className="relative flex items-center gap-3" ref={dropdownRef}>
            <NotificationBell count={notifCount} onClick={handleNotifClick} />

            <NotificationDropdown
              isOpen={isNotifOpen}
              notifList={notifList}
              onClose={() => setIsNotifOpen(false)}
              onClickItem={handleClickNotifItem}
            />

            <Avatar rounded className="cursor-pointer ring-2 ring-gray-200 dark:ring-gray-700" onClick={handleAvatarClick} />

            {isDropdownOpen && (
              <DropdownMenu
                onSignOut={handleSignOut}
                name={name || "John Doe"}
                email={email || "doe@gmail.com"}
              />
            )}
          </div>
        </div>
      </div>
    </Navbar>
  );
};

export default DashboardNavbar;
