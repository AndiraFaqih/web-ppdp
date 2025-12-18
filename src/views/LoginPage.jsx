import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Card, Toast, Label, TextInput } from "flowbite-react";
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { z } from "zod";
import { authService } from "../service/auth-service";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

// Login page
const LoginPage = () => {
  const navigate = useNavigate();

  const schema = z.object({
    email: z
      .string({
        required_error: "Email is required",
      })
      .nonempty("Email is required")
      .email({
        message: "Please enter a valid email address",
      }),
    password: z
      .string({
        required_error: "Password is required",
      })
      .nonempty("Password is required")
      .min(6, {
        message: "Password must be at least 6 characters",
      }),
  });

  const [showToast, setShowToast] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const response = await authService.login(data);
      const token = response.token;
      localStorage.setItem("jwtToken", token);

      const decodedToken = jwtDecode(token);
      const userRole = decodedToken.role;

      if (userRole === "admin") {
        navigate("/admin/employee");
      } else if (userRole === "employee") {
        navigate("/attendance-history");
      } else {
        console.error("Invalid role:", userRole);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      }
    } catch (error) {
      console.error("Login error:", error);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Log In</title>
      </Helmet>
      {showToast && (
        <div className="fixed right-4 top-4 z-50">
          <Toast className="bg-[#e13f25]/85">
            <div className="inline-flex size-8 shrink-0 items-center justify-center font-medium text-white">
              <HiOutlineExclamationCircle className="size-5" />
            </div>
            <div className="mx-5 text-sm font-medium text-white">
              Failed to sign in. Please check your credentials.
            </div>
            <Toast.Toggle
              className="bg-transparent text-white"
              onClick={() => setShowToast(false)}
            />
          </Toast>
        </div>
      )}
      <div className="flex flex-col items-center justify-center px-6 lg:h-screen lg:gap-y-4">
        <div className="my-6 flex items-center gap-x-1 lg:my-0">
          <span className="self-center whitespace-nowrap text-2xl font-semibold dark:text-white">
            {/* Dashboard */}
          </span>
        </div>
        <Card
          horizontal
          className="w-full md:max-w-screen-sm md:[&>*]:w-full md:[&>*]:p-16 [&>img]:hidden md:[&>img]:w-96 md:[&>img]:p-0"
        >
          <h1 className="mb-3 text-2xl font-bold dark:text-white md:text-3xl">
            Log in to WFH Attandence App
          </h1>
          <form>
            <div className="mb-4 flex flex-col gap-y-3">
              <Label htmlFor="email">Email</Label>
              <TextInput
                id="email"
                type="email"
                {...register("email")}
                color={errors.email ? "failure" : "default"}
                helperText={errors.email?.message}
              />
            </div>
            <div className="mb-6 flex flex-col gap-y-3">
              <Label htmlFor="password">Password</Label>
              <TextInput
                id="password"
                type="password"
                {...register("password")}
                color={errors.password ? "failure" : "default"}
                helperText={errors.password?.message}
              />
            </div>
            <div className="mb-6">
              <Button
                pill
                color="primary"
                size="sm"
                onClick={handleSubmit(onSubmit)}
                disabled={isLoading}
                className="w-full lg:w-auto"
              >
                {isLoading ? "Loading..." : "Sign in"}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </>
  );
};

export default LoginPage;
