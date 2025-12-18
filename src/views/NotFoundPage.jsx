import { Helmet } from "react-helmet-async";
import { jwtDecode } from "jwt-decode";

// 404 Page Not Found
const NotFoundPage= () => {

    const token = localStorage.getItem("jwtToken");
    const decodedToken = jwtDecode(token);
    const role = decodedToken.role;

    const href = role === "admin" ? "/admin/employee" : "/attendance-history";

  return (
    <>
      <Helmet>
        <title>Page not found</title>
      </Helmet>
      <div className="mx-auto -mt-16 flex h-screen flex-col items-center justify-center px-6 dark:bg-gray-900 xl:px-0">
        <div className="block md:max-w-lg">
          <img src="/404.png" alt="404 image" />
        </div>
        <div className="text-center xl:max-w-4xl">
          <h1 className="mb-3 text-2xl font-bold leading-tight text-gray-900 dark:text-white sm:text-4xl lg:text-5xl">
            Page not found
          </h1>
          <p className="mb-5 text-base font-normal text-gray-500 dark:text-gray-400 md:text-lg">
            Oops! Looks like you followed a bad link. If you think this is a
            problem with us, please tell us.
          </p>
          <a
            href={href}
            className="mr-3 inline-flex items-center rounded-lg bg-primary-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
          >
            Go back
          </a>
        </div>
      </div>
    </>
  );
};

export default NotFoundPage;