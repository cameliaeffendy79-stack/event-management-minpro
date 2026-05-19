export interface TransactionCustomer {
  id: number;

  eventTitle: string;

  quantity: number;

  price: number;

  totalPrice: number;

  status:
    | "PENDING"
    | "ACCEPTED"
    | "REJECTED";

  createdAt: string;

  paymentProof?: string;
}