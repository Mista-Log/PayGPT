import { apiFetch } from "./client";

export interface Invoice {
  id: number;
  customer_name: string;
  customer_email: string;
  amount: number;
  description: string;
  due_date: string;
  status: string;
  payment_link: string;
}

export const getInvoices = () => {
  return apiFetch("/api/invoice/");
};