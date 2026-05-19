import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ShieldAlert } from "lucide-react";

export default function Unauthorized() {
  const navigate = useNavigate();

  const handleGoBack = () => {
    const role = localStorage.getItem("role");

    if (role === "organizer") {
      navigate("/dashboard-organizer");
    } else if (role === "customer") {
      navigate("/dashboard-customer");
    } else {
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-white shadow-xl rounded-2xl p-10 max-w-md w-full text-center"
      >
        <div className="flex justify-center mb-4">
          <ShieldAlert className="w-14 h-14 text-red-500" />
        </div>

        <h1 className="text-2xl font-bold mb-2">Access Denied</h1>

        <p className="text-gray-600 mb-6">
          You do not have permission to access this page. Please return to your
          dashboard or login again.
        </p>

        <button
          onClick={handleGoBack}
          className="w-full bg-black text-white py-2 px-4 rounded-xl hover:bg-gray-800 transition"
        >
          Go Back
        </button>
      </motion.div>
    </div>
  );
}
