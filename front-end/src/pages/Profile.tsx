import { useEffect, useState } from "react";
import axios from "axios";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  profile_picture?: string;
}

export default function Profile() {
  const [user, setUser] = useState<User | null>(null);

  const [newPassword, setNewPassword] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const token =
    localStorage.getItem("token");

  // ✅ GET CURRENT USER
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/auth/me",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setUser(res.data.data);
      } catch (error) {
        console.error(error);
        alert("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // ✅ UPDATE PROFILE
  const handleSave = async () => {
    try {
      await axios.patch(
        "http://localhost:5000/auth/profile",
        {
          name: user?.name,
          profile_picture:
            user?.profile_picture,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Profile updated");
    } catch (error) {
      console.error(error);
      alert("Failed to update profile");
    }
  };

  // ✅ CHANGE PASSWORD
  const handlePasswordChange =
    async () => {
      if (!newPassword) {
        alert("Enter new password");
        return;
      }

      try {
        await axios.patch(
          "http://localhost:5000/auth/change-password",
          {
            password: newPassword,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        alert("Password changed");

        setNewPassword("");
      } catch (error) {
        console.error(error);
        alert("Failed to change password");
      }
    };

  // ✅ IMAGE UPLOAD
  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      if (user) {
        setUser({
          ...user,
          profile_picture:
            reader.result as string,
        });
      }
    };

    reader.readAsDataURL(file);
  };

  if (loading) {
    return (
      <div className="p-10">
        Loading...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-10">
        User not found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div
        className="
          max-w-xl
          mx-auto
          bg-white
          rounded-2xl
          shadow
          p-6
        "
      >
        <h2 className="text-2xl font-bold mb-6">
          My Profile
        </h2>

        {/* PROFILE IMAGE */}
        <div className="mb-6">
          {user.profile_picture ? (
            <img
              src={user.profile_picture}
              alt="profile"
              className="
                w-32
                h-32
                rounded-full
                object-cover
                mb-4
              "
            />
          ) : (
            <div
              className="
                w-32
                h-32
                rounded-full
                bg-gray-300
                mb-4
              "
            />
          )}

          <input
            type="file"
            onChange={handleImageUpload}
          />
        </div>

        {/* NAME */}
        <div className="mb-4">
          <label className="block mb-2 font-medium">
            Full Name
          </label>

          <input
            type="text"
            value={user.name}
            onChange={(e) =>
              setUser({
                ...user,
                name: e.target.value,
              })
            }
            className="
              w-full
              border
              rounded-lg
              p-3
            "
          />
        </div>

        {/* EMAIL */}
        <div className="mb-4">
          <label className="block mb-2 font-medium">
            Email
          </label>

          <input
            type="text"
            value={user.email}
            disabled
            className="
              w-full
              border
              rounded-lg
              p-3
              bg-gray-100
            "
          />
        </div>

        {/* ROLE */}
        <div className="mb-6">
          <label className="block mb-2 font-medium">
            Role
          </label>

          <input
            type="text"
            value={user.role}
            disabled
            className="
              w-full
              border
              rounded-lg
              p-3
              bg-gray-100
            "
          />
        </div>

        <button
          onClick={handleSave}
          className="
            bg-blue-600
            hover:bg-blue-700
            text-white
            px-5
            py-3
            rounded-lg
            w-full
            font-semibold
          "
        >
          Save Profile
        </button>

        {/* PASSWORD */}
        <div className="mt-10">
          <h3 className="text-xl font-semibold mb-4">
            Change Password
          </h3>

          <input
            type="password"
            placeholder="New password"
            value={newPassword}
            onChange={(e) =>
              setNewPassword(
                e.target.value
              )
            }
            className="
              w-full
              border
              rounded-lg
              p-3
              mb-4
            "
          />

          <button
            onClick={
              handlePasswordChange
            }
            className="
              bg-green-600
              hover:bg-green-700
              text-white
              px-5
              py-3
              rounded-lg
              w-full
              font-semibold
            "
          >
            Change Password
          </button>
        </div>
      </div>
    </div>
  );
}