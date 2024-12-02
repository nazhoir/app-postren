import React from "react";
import { Button } from "@/components/ui/button";

export const useThermalPrint = () => {
  const printThermal = React.useCallback((data: string) => {
    // Fungsi untuk membuat struktur struk termal dengan lebar 58mm

    // Buat window baru untuk pencetakan
    const printWindow = window.open("", "", "width=580,height=400");

    if (printWindow) {
      printWindow.document.open();
      printWindow.document.write(`
        <html>
          <head>
            <title>Cetak Struk Thermal</title>
            <style>
              @media print {
                body { margin: 0; padding: 0; }
                div { margin: 0; padding: 0; }
              }
            </style>
          </head>
          <body>
            ${data}
            <script>
              window.onload = function() {
                window.print();
                window.close();
              }
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    } else {
      console.error("Tidak dapat membuka jendela cetak");
      alert(
        "Gagal membuka jendela cetak. Periksa pengaturan popup browser Anda.",
      );
    }
  }, []);

  return { printThermal };
};

// Contoh komponen untuk menggunakan hook cetak thermal
export const ThermalPrintButton = ({ data }: { data: string }) => {
  const { printThermal } = useThermalPrint();

  return (
    <Button
      type="button"
      variant="outline"
      onClick={() => printThermal(data)}
      className="mt-2 w-full"
    >
      Cetak Struk
    </Button>
  );
};
