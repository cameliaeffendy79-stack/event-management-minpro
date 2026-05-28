import { useState } from "react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] =
    useState("");

  const handleReset = async () => {
    try {
      if (!email || !newPassword) {
        alert("Please fill all fields");
        return;
      }

      const response = await fetch(
        "http://localhost:5000/auth/reset-password",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            newPassword,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        alert(result.message);
        return;
      }

      alert("Password reset success");

      setEmail("");
      setNewPassword("");
    } catch (error) {
      console.error(error);

      alert("Failed to reset password");
    }
  };

  return (
    <div
      className="
        min-h-screen
        flex
        items-center
        justify-center
        bg-gray-100
        p-6
      "
    >
      <div
        className="
          bg-white
          p-8
          rounded-2xl
          shadow-lg
          w-full
          max-w-md
        "
      >
        <h2
          className="
            text-2xl
            font-bold
            mb-6
            text-center
          "
        >
          Reset Password
        </h2>

        <div className="space-y-4">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            className="
              w-full
              border
              rounded-lg
              px-4
              py-3
              outline-none
              focus:ring-2
              focus:ring-blue-500
            "
          />

          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) =>
              setNewPassword(e.target.value)
            }
            className="
              w-full
              border
              rounded-lg
              px-4
              py-3
              outline-none
              focus:ring-2
              focus:ring-blue-500
            "
          />

          <button
            onClick={handleReset}
            className="
              w-full
              bg-blue-600
              hover:bg-blue-700
              text-white
              py-3
              rounded-lg
              font-semibold
              transition
            "
          >
            Reset Password
          </button>
        </div>
      </div>
    </div>
  );
}