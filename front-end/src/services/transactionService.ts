import api from "../lib/api";

/////////////////////////////////////////////////////
// TYPES
/////////////////////////////////////////////////////

export type TransactionStatus =
  | "PENDING"
  | "ACCEPTED"
  | "REJECTED";

export interface Transaction {
  id: number;

  user_id: number;
  event_id: number;

  status: TransactionStatus;

  total_price?: number;
  final_price?: number;

  payment_proof?: string;

  created_at: string;

  events?: {
    id: number;
    title?: string;
  };

  transaction_items?: {
    id: number;

    quantity?: number;
    subtotal?: number;

    tickets?: {
      id: number;
      name?: string;
      price?: number;
    };
  }[];
}

/////////////////////////////////////////////////////
// ✅ CREATE TRANSACTION
/////////////////////////////////////////////////////

export async function createTransaction(
  data: {
    event_id: number;
    ticket_id: number;
    quantity: number;
  }
) {
  const response = await api.post(
    "/transactions",
    data
  );

  return response.data;
}

/////////////////////////////////////////////////////
// ✅ GET MY TRANSACTIONS
/////////////////////////////////////////////////////

export async function getMyTransactions() {
  const response = await api.get(
    "/transactions/my-transactions"
  );

  return response.data.data;
}

/////////////////////////////////////////////////////
// ✅ ORGANIZER GET TRANSACTIONS
/////////////////////////////////////////////////////

export async function getOrganizerTransactions() {
  const response = await api.get(
    "/transactions/organizer"
  );

  return response.data.data;
}

/////////////////////////////////////////////////////
// ✅ ACCEPT TRANSACTION
/////////////////////////////////////////////////////

export async function acceptTransaction(
  id: number
) {
  const response = await api.patch(
    `/transactions/${id}/accept`
  );

  return response.data;
}

/////////////////////////////////////////////////////
// ✅ REJECT TRANSACTION
/////////////////////////////////////////////////////

export async function rejectTransaction(
  id: number
) {
  const response = await api.patch(
    `/transactions/${id}/reject`
  );

  return response.data;
}

/////////////////////////////////////////////////////
// ✅ GET ALL ATTENDEES (ORGANIZER)
/////////////////////////////////////////////////////

export async function getAllAttendees() {
  const response = await api.get(
    "/transactions/organizer"
  );

  return response.data.data;
}

/////////////////////////////////////////////////////
// ✅ UPLOAD PAYMENT PROOF
/////////////////////////////////////////////////////

export async function uploadPaymentProof(
  id: number,
  formData: FormData
) {
  const response = await api.patch(
    `/transactions/${id}/payment-proof`,
    formData,
    {
      headers: {
        "Content-Type":
          "multipart/form-data",
      },
    }
  );

  return response.data;
}