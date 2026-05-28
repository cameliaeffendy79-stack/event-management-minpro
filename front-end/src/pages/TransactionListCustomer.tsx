import { useEffect, useState } from "react";
import axios from "axios";

interface Transaction {
  id: number;

  quantity: number;

  total_price: number;

  status: string;

  created_at: string;

  events?: {
    title: string;
  };
}

export default function TransactionListCustomer() {
  const [transactions, setTransactions] =
    useState<Transaction[]>([]);

  const [loading, setLoading] =
    useState(true);

  const token =
    localStorage.getItem("token");

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/transactions/my-transactions",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTransactions(res.data.data);
    } catch (error) {
      console.error(error);
      alert("Failed to fetch transactions");
    } finally {
      setLoading(false);
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
          My Transactions
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
                  Event
                </th>

                <th className="p-4">
                  Quantity
                </th>

                <th className="p-4">
                  Total
                </th>

                <th className="p-4">
                  Status
                </th>

                <th className="p-4">
                  Date
                </th>
              </tr>
            </thead>

            <tbody>
              {transactions.map((t) => (
                <tr
                  key={t.id}
                  className="border-t"
                >
                  <td className="p-4">
                    {t.events?.title}
                  </td>

                  <td className="p-4">
                    {t.quantity}
                  </td>

                  <td className="p-4">
                    Rp{" "}
                    {t.total_price.toLocaleString(
                      "id-ID"
                    )}
                  </td>

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

                  <td className="p-4">
                    {new Date(
                      t.created_at
                    ).toLocaleDateString(
                      "id-ID"
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