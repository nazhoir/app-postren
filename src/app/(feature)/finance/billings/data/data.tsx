export const billingItemStatuses = [
  {
    label: "Aktif",
    value: "active",
  },
  {
    label: "Tidak Aktif",
    value: "inactive",
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
    id: "amount",
    title: "Harga",
  },
  {
    id: "status",
    title: "Status",
  },
];

export const getViewOptionById = (id: string): ViewOption | undefined => {
  return viewOptions.find((option) => option.id === id);
};
