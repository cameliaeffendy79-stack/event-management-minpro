import { useEffect, useState } from "react";
import axios from "axios";

interface Transaction {
  id: number;

  quantity: number;

  total_price: number;

  payment_proof?: string;

  status: string;

  users?: {
    name: string;
    email: string;
  };

  events?: {
    title: string;
  };
}

export default function TransactionListOrganizer() {
  const [transactions, setTransactions] =
    useState<Transaction[]>([]);

  const [loading, setLoading] =
    useState(true);

  const token =
    localStorage.getItem("token");

  useEffect(() => {
    fetchTransactions();
  }, []);

  // ✅ GET ORGANIZER TRANSACTIONS
  const fetchTransactions =
    async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/transactions/organizer",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setTransactions(res.data.data);
      } catch (error) {
        console.error(error);
        alert(
          "Failed to fetch transactions"
        );
      } finally {
        setLoading(false);
      }
    };

  // ✅ ACCEPT
  const handleAccept = async (
    id: number
  ) => {
    try {
      await axios.patch(
        `http://localhost:5000/transactions/${id}/accept`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Transaction accepted");

      fetchTransactions();
    } catch (error) {
      console.error(error);

      alert(
        "Failed to accept transaction"
      );
    }
  };

  // ✅ REJECT
  const handleReject = async (
    id: number
  ) => {
    try {
      await axios.patch(
        `http://localhost:5000/transactions/${id}/reject`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Transaction rejected");

      fetchTransactions();
    } catch (error) {
      console.error(error);

      alert(
        "Failed to reject transaction"
      );
    }
  };

  if (loading) {
    return (
      <div className="p-10">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">
          Transaction List
        </h2>
      </div>

      {/* EMPTY */}
      {transactions.length === 0 && (
        <div
          className="
            bg-white
            rounded-2xl
            shadow
            p-6
          "
        >
          <p className="text-gray-600">
            No transactions available.
          </p>
        </div>
      )}

      {/* TABLE */}
      {transactions.length > 0 && (
        <div
          className="
            bg-white
            rounded-2xl
            shadow
            overflow-hidden
          "
        >
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr className="text-left">
                <th className="p-4">
                  Buyer
                </th>

                <th className="p-4">
                  Event
                </th>

                <th className="p-4">
                  Qty
                </th>

                <th className="p-4">
                  Total
                </th>

                <th className="p-4">
                  Payment Proof
                </th>

                <th className="p-4">
                  Status
                </th>

                <th className="p-4">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {transactions.map((t) => (
                <tr
                  key={t.id}
                  className="border-t"
                >
                  {/* BUYER */}
                  <td className="p-4">
                    <div>
                      <p className="font-medium">
                        {t.users?.name}
                      </p>

                      <p className="text-sm text-gray-500">
                        {t.users?.email}
                      </p>
                    </div>
                  </td>

                  {/* EVENT */}
                  <td className="p-4">
                    {t.events?.title}
                  </td>

                  {/* QTY */}
                  <td className="p-4">
                    {t.quantity}
                  </td>

                  {/* TOTAL */}
                  <td className="p-4">
                    Rp{" "}
                    {t.total_price.toLocaleString(
                      "id-ID"
                    )}
                  </td>

                  {/* PAYMENT PROOF */}
                  <td className="p-4">
                    {t.payment_proof ? (
                      <img
                        src={
                          t.payment_proof
                        }
                        alt="payment"
                        className="
                          w-20
                          h-20
                          object-cover
                          rounded-lg
                        "
                      />
                    ) : (
                      <span className="text-gray-400">
                        No proof
                      </span>
                    )}
                  </td>

                  {/* STATUS */}
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        t.status ===
                        "ACCEPTED"
                          ? "bg-green-100 text-green-700"
                          : t.status ===
                            "REJECTED"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {t.status}
                    </span>
                  </td>

                  {/* ACTION */}
                  <td className="p-4">
                    {t.status ===
                    "PENDING" ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() =>
                            handleAccept(
                              t.id
                            )
                          }
                          className="
                            bg-green-500
                            hover:bg-green-600
                            text-white
                            px-3
                            py-1
                            rounded-lg
                          "
                        >
                          Accept
                        </button>

                        <button
                          onClick={() =>
                            handleReject(
                              t.id
                            )
                          }
                          className="
                            bg-red-500
                            hover:bg-red-600
                            text-white
                            px-3
                            py-1
                            rounded-lg
                          "
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span className="text-gray-400 text-sm">
                        Completed
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}