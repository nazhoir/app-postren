import { Banknote, Landmark, ArrowLeft, ArrowRight } from "lucide-react";

export const paymentMethod = [
  {
    label: "Tunai",
    value: "cash",
    icon: Banknote,
  },
  {
    label: "Bank",
    value: "bank_transfer",
    icon: Landmark,
  },
];

export const cashflowType = [
  {
    label: "Credit",
    value: "credit",
    icon: ArrowLeft,
  },
  {
    label: "Debit",
    value: "debit",
    icon: ArrowRight,
  },
];

interface ViewOption {
  id: string;
  title: string;
}
const viewOptions: ViewOption[] = [
 
  {
    id: "name",
    title: "Nama",
  },
  {
    id: "type",
    title: "Jenis",
  },
  {
    id: "amount",
    title: "Total",
  },
  {
    id: "createdAt",
    title: "Waktu",
  },

  {
    id: "paymentMethod",
    title: "Pembayaran",
  },
  {
    id: "user",
    title: "Pengguna",
  },
];

export const getViewOptionById = (id: string): ViewOption | undefined => {
  return viewOptions.find((option) => option.id === id);
};
