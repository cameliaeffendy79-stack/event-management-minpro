import { Routes, Route } from "react-router-dom";

/* Pages */
import Login from "./pages/Login";
import Register from "./pages/Register";

import DashboardCustomer from "./pages/DashboardCustomer";
import DashboardOrganizers from "./pages/DashboardOrganizers";

import EventListOrganizer from "./pages/EventListOrganizer";
import EditEvent from "./pages/EditEvent";

import TransactionListOrganizer from "./pages/TransactionListOrganizer";

import OrganizerAnalytics from "./pages/OrganizerAnalytics";

import Unauthorized from "./pages/Unauthorized";

import AttendeeListOrganizer from "./pages/AttendeeListOrganizer";

import TransactionListCustomer from "./pages/TransactionListCustomer";

import EventListCustomer from "./pages/EventListCustomer";

import MyEventCustomer from "./pages/MyEventCustomer";

import ForgotPassword from "./pages/ForgotPassword";

/* Components */
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <Routes>
      {/* ================= PUBLIC ROUTES ================= */}

      <Route
        path="/"
        element={<Login />}
      />

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/register"
        element={<Register />}
      />

      {/* ================= CUSTOMER ROUTES ================= */}

      <Route
        path="/dashboard-customer"
        element={
          <ProtectedRoute
            allowedRoles={[
              "CUSTOMER",
            ]}
          >
            <DashboardCustomer />
          </ProtectedRoute>
        }
      />

      <Route
        path="/customer/transactions"
        element={
          <ProtectedRoute
            allowedRoles={[
              "CUSTOMER",
            ]}
          >
            <TransactionListCustomer />
          </ProtectedRoute>
        }
      />

      <Route
        path="/my-events-customer"
        element={
          <ProtectedRoute
            allowedRoles={[
              "CUSTOMER",
            ]}
          >
            <MyEventCustomer />
          </ProtectedRoute>
        }
      />

      <Route
        path="/events"
        element={
          <ProtectedRoute
            allowedRoles={[
              "CUSTOMER",
            ]}
          >
            <EventListCustomer />
          </ProtectedRoute>
        }
      />

            <Route
        path="/forgot-password"
        element={<ForgotPassword />}
      />

      {/* ================= ORGANIZER ROUTES ================= */}

      <Route
        path="/dashboard-organizer"
        element={
          <ProtectedRoute
            allowedRoles={[
              "ORGANIZER",
            ]}
          >
            <DashboardOrganizers />
          </ProtectedRoute>
        }
      />

      <Route
        path="/my-events"
        element={
          <ProtectedRoute
            allowedRoles={[
              "ORGANIZER",
            ]}
          >
            <EventListOrganizer />
          </ProtectedRoute>
        }
      />

      <Route
        path="/edit-event/:id"
        element={
          <ProtectedRoute
            allowedRoles={[
              "ORGANIZER",
            ]}
          >
            <EditEvent />
          </ProtectedRoute>
        }
      />

      <Route
        path="/organizer/transactions"
        element={
          <ProtectedRoute
            allowedRoles={[
              "ORGANIZER",
            ]}
          >
            <TransactionListOrganizer />
          </ProtectedRoute>
        }
      />

      <Route
        path="/organizer/analytics"
        element={
          <ProtectedRoute
            allowedRoles={[
              "ORGANIZER",
            ]}
          >
            <OrganizerAnalytics />
          </ProtectedRoute>
        }
      />

      <Route
        path="/organizer/attendees"
        element={
          <ProtectedRoute
            allowedRoles={[
              "ORGANIZER",
            ]}
          >
            <AttendeeListOrganizer />
          </ProtectedRoute>
        }
      />

      {/* ================= UNAUTHORIZED ================= */}

      <Route
        path="/unauthorized"
        element={<Unauthorized />}
      />
    </Routes>
  );
}