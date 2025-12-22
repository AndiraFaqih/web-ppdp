import { Navbar, Avatar } from "flowbite-react";
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
    <Navbar fluid>
      <div className="w-full p-3 lg:px-5 lg:pl-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Navbar.Brand>
              <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
                WFH Attendance App
              </span>
            </Navbar.Brand>
          </div>

          <div className="relative flex items-center gap-3" ref={dropdownRef}>
            <NotificationBell count={notifCount} onClick={handleNotifClick} />

            <NotificationDropdown
              isOpen={isNotifOpen}
              notifList={notifList}
              onClose={() => setIsNotifOpen(false)}
              onClickItem={handleClickNotifItem}
            />

            <Avatar rounded className="cursor-pointer" onClick={handleAvatarClick} />

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
