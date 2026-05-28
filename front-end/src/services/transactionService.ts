const API_URL = "http://localhost:5000/transactions";

/* CREATE TRANSACTION */
export const createTransaction = async (data: {
  ticket_id: number;
  quantity: number;
  voucher_id?: number;
  use_points?: boolean;
}) => {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Transaction failed");
  }

  return res.json();
};

/* UPLOAD PAYMENT PROOF */
export const uploadPaymentProof = async (
  transactionId: number,
  payment_proof: string
) => {
  const res = await fetch(`${API_URL}/${transactionId}/payment-proof`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ payment_proof }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Upload failed");
  }

  return res.json();
};