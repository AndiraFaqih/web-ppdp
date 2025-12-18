/* eslint-disable react/prop-types */
import Navbar from "../../../components/DashboardNavbar";
import DashboardSidebar from "../../../components/DashboardSidebar";

// NavbarSidebar component
const NavbarSidebar = function ({ children, isFooter = true }) {
  return (
    <>
      <Navbar />
      <div className="flex items-start pt-16">
        <DashboardSidebar />
        <MainContent isFooter={isFooter}>{children}</MainContent>
      </div>
    </>
  );
};

// MainContent component
const MainContent = function ({ children, isFooter }) {
  return (
    <main className="relative -mt-3 size-full overflow-y-auto bg-gray-50 dark:bg-gray-900 lg:ml-64">
      {children}
      {isFooter && (
        <div className="mx-4 mt-2">
          <MainContentFooter />
        </div>
      )}
    </main>
  );
};

// MainContentFooter component
const MainContentFooter = () => {
  const currentYear = new Date().getFullYear();
  return (
    <>
      <p className="my-8 text-center text-sm text-gray-500 dark:text-gray-300">
        &copy; {currentYear} WFH Attendances App by Andira Faqih Muhammad. All
        rights reserved.
      </p>
    </>
  );
};

export default NavbarSidebar;
