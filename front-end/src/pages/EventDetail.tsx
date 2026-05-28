import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Navbar from "../components/Navbar";
import { getEventById } from "../services/eventService";
import {
  createTransaction,
  uploadPaymentProof,
} from "../services/transactionService";
import type { Event } from "../types/event";

function EventDetail() {
  const { id } = useParams();
  const [event, setEvent] = useState<Event | null>(null);

  const [selectedTicket, setSelectedTicket] = useState<number | null>(null);
  const [quantity, setQuantity] = useState(1);

  const [transaction, setTransaction] = useState<any>(null);
  const [proof, setProof] = useState("");
  const [timeLeft, setTimeLeft] = useState(0);
  const [usePoints, setUsePoints] = useState(false);

  // 🔥 NEW: voucher state
  const [selectedVoucher, setSelectedVoucher] = useState<number | null>(null);

  useEffect(() => {
    if (!id) return;

    getEventById(id)
      .then(setEvent)
      .catch(() => setEvent(null));
  }, [id]);

  useEffect(() => {
    if (!transaction) return;

    const interval = setInterval(() => {
      const diff =
        new Date(transaction.expired_at).getTime() - Date.now();
      setTimeLeft(diff > 0 ? diff : 0);
    }, 1000);

    return () => clearInterval(interval);
  }, [transaction]);

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading event...
      </div>
    );
  }

  // 🔥 TEMP VOUCHERS (frontend only)
  const userVouchers = [
    { id: 1, name: "Discount 100K", amount: 100000 },
    { id: 2, name: "Discount 250K", amount: 250000 },
  ];

  const selectedTicketData = event.tickets?.find(
    (t) => t.id === selectedTicket
  );

  const basePrice =
    (selectedTicketData?.price || 0) * quantity;

  const voucherDiscount =
    userVouchers.find((v) => v.id === selectedVoucher)?.amount || 0;

  const pointsDiscount = usePoints
    ? Math.min(basePrice - voucherDiscount, 20000)
    : 0;

  const totalPrice = Math.max(
    basePrice - voucherDiscount - pointsDiscount,
    0
  );

  const totalQuota =
    event.tickets?.reduce((sum, t) => sum + (t.quota || 0), 0) || 0;

  const totalSold =
    event.tickets?.reduce((sum, t) => sum + (t.sold || 0), 0) || 0;

  const remaining = totalQuota - totalSold;
  const progress =
    totalQuota > 0 ? (totalSold / totalQuota) * 100 : 0;

  const isSoldOut = remaining <= 0;

  return (
    <div className="bg-[#f8f5ff] min-h-screen">
      <Navbar />

      <div className="pt-28 px-6 max-w-5xl mx-auto space-y-10">

        {/* HERO */}
        <div className="h-64 bg-gradient-to-r from-purple-400 to-purple-600 rounded-2xl shadow-lg" />

        {/* EVENT INFO */}
        <div className="bg-white p-6 rounded-2xl shadow-md space-y-4">
          <h1 className="text-3xl font-bold">{event.title}</h1>

          <p>{event.location}</p>

          <div className="w-full bg-gray-200 h-2 rounded-full">
            <div
              className="bg-purple-600 h-2 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>

          <p>{remaining} seats remaining</p>
        </div>

        {/* TICKETS */}
        <div className="bg-white p-6 rounded-2xl shadow-md space-y-4">
          <h2 className="font-semibold text-lg">Tickets</h2>

          {event.tickets?.map((ticket) => {
            const isFull =
              (ticket.sold || 0) >= (ticket.quota || 0);

            return (
              <div
                key={ticket.id}
                className="flex justify-between border p-4 rounded-xl"
              >
                <div>
                  <p>{ticket.name}</p>
                  <p>{ticket.quota} seats</p>
                </div>

                <div>
                  <p>Rp {ticket.price}</p>

                  {!isFull && (
                    <button
                      onClick={() => setSelectedTicket(ticket.id)}
                      className="bg-purple-600 text-white px-3 py-1 rounded"
                    >
                      Select
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* 🔥 VOUCHERS */}
        {selectedTicket && (
          <div className="bg-white p-6 rounded-2xl shadow-md space-y-4">
            <h2 className="font-semibold text-lg">Vouchers</h2>

            {userVouchers.map((v) => (
              <div
                key={v.id}
                className={`flex justify-between p-4 border rounded ${
                  selectedVoucher === v.id ? "bg-purple-100" : ""
                }`}
              >
                <div>
                  <p>{v.name}</p>
                  <p>Rp {v.amount}</p>
                </div>

                <button
                  onClick={() =>
                    setSelectedVoucher(
                      selectedVoucher === v.id ? null : v.id
                    )
                  }
                  className="bg-purple-600 text-white px-3 py-1 rounded"
                >
                  {selectedVoucher === v.id ? "Used" : "Use"}
                </button>
              </div>
            ))}
          </div>
        )}

        {/* PURCHASE */}
        {selectedTicket && (
          <div className="bg-white p-6 rounded-2xl shadow-md space-y-4">
            <h2>Purchase</h2>

            <input
              type="number"
              value={quantity}
              min={1}
              onChange={(e) => setQuantity(Number(e.target.value))}
            />

            <label>
              <input
                type="checkbox"
                checked={usePoints}
                onChange={(e) => setUsePoints(e.target.checked)}
              />
              Use Points
            </label>

            <p>Total: Rp {totalPrice}</p>
          </div>
        )}

        {/* PAYMENT */}
        {selectedTicket && (
          <div className="bg-white p-6 rounded-2xl shadow-md space-y-4">
            {!transaction && (
              <button
                onClick={async () => {
                  const res = await createTransaction({
                    ticket_id: selectedTicket!,
                    quantity,
                    use_points: usePoints,
                    voucher_id: selectedVoucher,
                  });

                  setTransaction(res.data);
                }}
                className="bg-purple-600 text-white w-full p-3 rounded"
              >
                Secure Your Spot
              </button>
            )}

            {transaction && (
              <>
                <p>
                  Time left: {Math.floor(timeLeft / 60000)}:
                  {Math.floor((timeLeft % 60000) / 1000)
                    .toString()
                    .padStart(2, "0")}
                </p>

                <input
                  placeholder="image url"
                  value={proof}
                  onChange={(e) => setProof(e.target.value)}
                />

                <button
                  onClick={() =>
                    uploadPaymentProof(transaction.id, proof)
                  }
                >
                  Upload
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default EventDetail;