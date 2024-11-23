import { Icons } from "@/components/icons";

export const genders = [
  {
    label: "Laki-laki",
    value: "L",
    icon: Icons.male,
  },
  {
    label: "Perempuan",
    value: "P",
    icon: Icons.female,
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
    id: "gender",
    title: "Kelamin",
  },
  {
    id: "nisn",
    title: "NISN",
  },
  {
    id: "nik",
    title: "NIK",
  },
  {
    id: "nkk",
    title: "NKK",
  },

  {
    id: "birthPlace",
    title: "Tempat lahir",
  },
  {
    id: "birthDate",
    title: "Tanggal lahir",
  },
];

export const getViewOptionById = (id: string): ViewOption | undefined => {
  return viewOptions.find((option) => option.id === id);
};
