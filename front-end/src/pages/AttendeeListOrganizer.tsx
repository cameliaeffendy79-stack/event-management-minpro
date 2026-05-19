import { useEffect, useState } from "react";

import {
  getAllAttendees,
  Transaction,
} from "../services/transactionService";

export default function AttendeeListOrganizer() {
  const [attendees, setAttendees] =
    useState<Transaction[]>([]);

  const [loading, setLoading] =
    useState(true);

  ///////////////////////////////////////////////////////
  // LOAD ATTENDEES
  ///////////////////////////////////////////////////////

  const loadAttendees = async () => {
    try {
      setLoading(true);

      const data =
        await getAllAttendees();

      setAttendees(data);
    } catch (error) {
      console.error(error);

      alert(
        "Failed to load attendees"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAttendees();
  }, []);

  ///////////////////////////////////////////////////////
  // TOTAL ATTENDEES
  ///////////////////////////////////////////////////////

  const totalAttendees =
    attendees.reduce((sum, trx) => {
      const qty =
        trx.transaction_items?.reduce(
          (itemSum, item) =>
            itemSum +
            (item.quantity || 0),
          0
        ) || 0;

      return sum + qty;
    }, 0);

  ///////////////////////////////////////////////////////
  // LOADING
  ///////////////////////////////////////////////////////

  if (loading) {
    return (
      <div className="p-8">
        Loading attendees...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {/* HEADER */}

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">
          All Attendees
        </h2>

        <div className="bg-white px-4 py-2 rounded-xl shadow">
          <span className="font-semibold">
            Total Attendees:
          </span>{" "}
          {totalAttendees}
        </div>
      </div>

      {/* EMPTY STATE */}

      {attendees.length === 0 && (
        <p className="text-gray-600">
          No attendees yet.
        </p>
      )}

      {/* TABLE */}

      {attendees.length > 0 && (
        <div className="bg-white rounded-2xl shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr className="text-left">
                <th className="p-4">
                  Transaction ID
                </th>

                <th className="p-4">
                  Event
                </th>

                <th className="p-4">
                  Ticket Quantity
                </th>

                <th className="p-4">
                  Total Price
                </th>

                <th className="p-4">
                  Status
                </th>
              </tr>
            </thead>

            <tbody>
              {attendees.map((a) => {
                const quantity =
                  a.transaction_items?.reduce(
                    (sum, item) =>
                      sum +
                      (item.quantity || 0),
                    0
                  ) || 0;

                return (
                  <tr
                    key={a.id}
                    className="border-t"
                  >
                    <td className="p-4">
                      #{a.id}
                    </td>

                    <td className="p-4">
                      {a.events?.title ||
                        "-"}
                    </td>

                    <td className="p-4">
                      {quantity}
                    </td>

                    <td className="p-4">
                      Rp{" "}
                      {(
                        a.final_price ||
                        a.total_price ||
                        0
                      ).toLocaleString(
                        "id-ID"
                      )}
                    </td>

                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm ${
                          a.status ===
                          "ACCEPTED"
                            ? "bg-green-100 text-green-700"
                            : a.status ===
                              "REJECTED"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {a.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}