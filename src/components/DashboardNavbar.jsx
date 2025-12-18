import { Navbar, Avatar } from "flowbite-react";
import { useRef, useState, useEffect } from "react";
import DropdownMenu from "./DropdownMenu";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

// Dashboard Navbar
const DashboardNavbar = () => {
  const token = localStorage.getItem("jwtToken");

  const decodedToken = jwtDecode(token);
  const name = decodedToken.name;
  const email = decodedToken.email;

  const navigate = useNavigate();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleAvatarClick = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const handleSignOut = () => {
    localStorage.removeItem("jwtToken");

    navigate("/login");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

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
          <div className="relative flex items-center gap-3">
            <Avatar
              rounded
              className="cursor-pointer"
              onClick={handleAvatarClick}
            />
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
