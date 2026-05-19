import { useState } from "react";

import { useNavigate, Link } from "react-router-dom";

import Card from "../components/UI/Card";
import Input from "../components/UI/Input";
import Button from "../components/UI/Button";

import { loginUser } from "../services/authService";

import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();

  const { login } = useAuth();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  /////////////////////////////////////////////////////
  // HANDLE LOGIN
  /////////////////////////////////////////////////////

  const handleLogin = async () => {
    try {
      setLoading(true);

      const result =
        await loginUser({
          email,
          password,
        });

      /////////////////////////////////////////////////////
      // BACKEND RESPONSE
      /////////////////////////////////////////////////////

      const token =
        result.data.data.token;

      const user =
        result.data.data.user;

      /////////////////////////////////////////////////////
      // SAVE AUTH
      /////////////////////////////////////////////////////

      login(token, user);

      /////////////////////////////////////////////////////
      // REDIRECT BASED ON ROLE
      /////////////////////////////////////////////////////

      if (
        user.role === "ORGANIZER"
      ) {
        navigate(
          "/dashboard-organizer"
        );
      } else {
        navigate(
          "/dashboard-customer"
        );
      }
    } catch (error: any) {
      console.error(error);

      alert(
        error.response?.data
          ?.message ||
          "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

return (
  <div
    className="
      min-h-screen
      flex
      items-center
      justify-center
      bg-gradient-to-br
      from-gray-50
      via-white
      to-gray-100
      px-4
    "
  >
    <Card className="w-full max-w-md">
      {/* HEADER */}
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-semibold text-gray-800">
          Welcome Back
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Please login to your account
        </p>
      </div>



      {/* FORM */}
      <div className="space-y-4">
        <Input
          label="Email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Input
          label="Password"
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* FORGOT PASSWORD */}
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => navigate("/forgot-password")}
            className="
              text-sm
              text-blue-600
              hover:text-blue-700
              hover:underline
              transition
            "
          >
            Forgot Password?
          </button>
        </div>

        {/* BUTTON */}
        <Button
          variant="primary"
          className="
            w-full
            py-2.5
            rounded-xl
            font-medium
            shadow-md
            hover:shadow-lg
            transition-all
          "
          onClick={handleLogin}
        >
          {loading ? "Loading..." : "Login"}
        </Button>

        {/* FOOTER */}
        <p className="text-sm text-center text-gray-600 pt-2">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="
              text-blue-600
              font-medium
              hover:text-blue-700
              hover:underline
              transition
            "
          >
            Register
          </Link>
        </p>
      </div>
    </Card>
  </div>
);
}