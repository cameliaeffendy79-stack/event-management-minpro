import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 w-full bg-white shadow-sm z-50">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
        
        {/* LOGO */}
        <div
          onClick={() => navigate("/")}
          className="text-xl font-bold text-purple-600 cursor-pointer"
        >
          EventHub
        </div>

        {/* DESKTOP NAV */}
        <div className="hidden md:flex items-center gap-6 text-gray-600">
          
          {/* HOME */}
          <button
            onClick={() => navigate("/")}
            className={`${
              isActive("/") ? "font-bold text-purple-600" : "hover:text-purple-600"
            }`}
          >
            Home
          </button>

          {/* EVENTS */}
          <button
            onClick={() => navigate("/events")}
            className={`${
              isActive("/events") ? "font-bold text-purple-600" : "hover:text-purple-600"
            }`}
          >
            Events
          </button>

          {/* NEWS */}
          <button
            onClick={() => navigate("/news")}
            className={`${
              isActive("/news") ? "font-bold text-purple-600" : "hover:text-purple-600"
            }`}
          >
            News
          </button>
        </div>

        {/* DESKTOP CREATE BUTTON */}
        <button
          onClick={() => navigate("/create")}
          className="hidden md:block bg-purple-600 text-white px-5 py-2 rounded-full font-semibold"
        >
          + Create Event
        </button>

        {/* MOBILE MENU BUTTON */}
        <button
          className="md:hidden text-2xl"
          onClick={() => setOpen(!open)}
        >
          ☰
        </button>
      </div>

      {/* MOBILE DROPDOWN */}
      {open && (
        <div className="md:hidden px-6 pb-4 space-y-3 bg-white shadow">
          
          <button
            onClick={() => {
              navigate("/");
              setOpen(false);
            }}
            className={`block w-full text-left ${
              isActive("/") ? "font-bold text-purple-600" : ""
            }`}
          >
            Home
          </button>

          <button
            onClick={() => {
              navigate("/events");
              setOpen(false);
            }}
            className={`block w-full text-left ${
              isActive("/events") ? "font-bold text-purple-600" : ""
            }`}
          >
            Events
          </button>

          <button
            onClick={() => {
              navigate("/news");
              setOpen(false);
            }}
            className={`block w-full text-left ${
              isActive("/news") ? "font-bold text-purple-600" : ""
            }`}
          >
            News
          </button>

          <button
            onClick={() => {
              navigate("/create");
              setOpen(false);
            }}
            className="w-full bg-purple-600 text-white py-2 rounded-full mt-2"
          >
            + Create Event
          </button>
        </div>
      )}
    </nav>
  );
}

export default Navbar;