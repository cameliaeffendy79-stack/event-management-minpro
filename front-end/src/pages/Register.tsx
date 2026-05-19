import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [role, setRole] = useState<
    "CUSTOMER" | "ORGANIZER"
  >("CUSTOMER");

  const [referral, setReferral] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const handleRegister = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!name || !email || !password) {
      alert("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        "http://localhost:5000/auth/register",
        {
          name,
          email,
          password,
          role,
          referral_code: referral,
        }
      );

      // ✅ SAVE TOKEN
      localStorage.setItem(
        "token",
        res.data.token
      );

      // ✅ SAVE USER
      localStorage.setItem(
        "user",
        JSON.stringify(res.data.user)
      );

      alert("Register success");

      // ✅ REDIRECT
      if (role === "ORGANIZER") {
        navigate("/dashboard-organizer");
      } else {
        navigate("/dashboard-customer");
      }
    } catch (error: any) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          "Register failed"
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
        flex-col
        justify-center
        items-center
        bg-gray-100
        p-5
      "
    >
      {/* HEADER */}
      <div className="text-center mb-8">
        <h1
          className="
            text-4xl
            font-bold
            mb-3
          "
        >
          Begin your journey
        </h1>

        <p className="text-sm text-gray-500">
          Enter your details to create
          an account
        </p>
      </div>

      {/* CARD */}
      <form
        onSubmit={handleRegister}
        className="
          bg-white
          p-8
          rounded-2xl
          shadow-md
          w-full
          max-w-md
          flex
          flex-col
          gap-4
        "
      >
        {/* NAME */}
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) =>
            setName(e.target.value)
          }
          className="
            border
            rounded-lg
            p-3
          "
        />

        {/* EMAIL */}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
          className="
            border
            rounded-lg
            p-3
          "
        />

        {/* PASSWORD */}
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(
              e.target.value
            )
          }
          className="
            border
            rounded-lg
            p-3
          "
        />

        {/* REFERRAL */}
        <div>
          <label className="block mb-2 text-sm font-medium">
            Referral Code (optional)
          </label>

          <input
            type="text"
            value={referral}
            onChange={(e) =>
              setReferral(
                e.target.value
              )
            }
            placeholder="Enter referral code"
            className="
              w-full
              border
              rounded-lg
              p-3
            "
          />
        </div>

        {/* ROLE */}
        <div>
          <label className="font-semibold">
            Register As:
          </label>

          <div className="mt-2 space-y-2">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="CUSTOMER"
                checked={
                  role === "CUSTOMER"
                }
                onChange={() =>
                  setRole("CUSTOMER")
                }
              />

              Customer
            </label>

            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="ORGANIZER"
                checked={
                  role === "ORGANIZER"
                }
                onChange={() =>
                  setRole("ORGANIZER")
                }
              />

              Organizer
            </label>
          </div>
        </div>

        {/* BUTTON */}
        <button
          type="submit"
          disabled={loading}
          className="
            bg-blue-600
            hover:bg-blue-700
            text-white
            font-bold
            py-3
            rounded-lg
            transition
          "
        >
          {loading
            ? "Loading..."
            : "Register"}
        </button>

        {/* LOGIN */}
        <p className="text-center text-sm">
          Already have an account?{" "}
          <span
            onClick={() =>
              navigate("/login")
            }
            className="
              text-blue-600
              cursor-pointer
              font-medium
            "
          >
            Login
          </span>
        </p>
      </form>
    </div>
  );
}