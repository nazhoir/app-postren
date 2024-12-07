export interface PrintProps {
  id: string | undefined;
  type: "credit" | "debit";
  name: string;
  amount: string;
  createdAt: Date | undefined;
  balance: number;
  createdBy: {
    id: string;
    name: string;
  };
  user: {
    id: string;
    name: string;
  };
}

export const printContent = (data: PrintProps) => {
  return `
      <div style="
        width: 58mm; 
        max-width: 60mm; 
        font-family:  sans-serif; 
        font-size: 14px; 
        line-height: 1;
        padding: 3px;
        text-align: center;
      ">
        <h3 style="margin: 5px 0;">PP Nurul Jadid Sejati</h3>
        <h3 style="margin: 5px 0;">STRUK TRANSAKSI</h3>
        <hr style="border: 0; border-top: 2px dashed #000;"/>
        <div style="text-align: left;margin-top: 10px;">

        <p style="margin: 1px;padding: 1px;"><strong>Kode Transaksi:</strong> <br/>${data.id}</p>
        <p style="margin: 1px;padding: 1px;"><strong>Tanggal:</strong> <br/>${new Date().toLocaleString("id-ID")}</p>
        <p style="margin: 1px;padding: 1px;"><strong>ID:</strong> <br/>${data.user.id}</p>
        <p style="margin: 1px;padding: 1px;"><strong>Nama:</strong> <br/>${data.user.name.toUpperCase()}</p>
        <p style="margin: 1px;padding: 1px;"><strong>Petugas:</strong><br/> ${data.createdBy.name.toUpperCase()}</p>
        </div>
        <div style="text-align: left;margin-top: 10px;">
        <p style="margin: 1px;padding: 1px;"><strong>Nama Transaksi:</strong><br/> ${data.name}</p>
        <p style="margin: 1px;padding: 1px;"><strong>Jenis Transaksi:</strong><br/> ${data.type.toUpperCase()}</p>
        <p style="margin: 1px;padding: 1px;"><strong>Nominal:</strong><br/> Rp ${parseFloat(data.amount).toLocaleString("id-ID")}</p>
          <p style="margin: 1px;padding: 1px;"><strong>Saldo:</strong><br/> Rp ${data.balance.toLocaleString("id-ID")}</p>
        </div>
        <hr style="border: 0; border-top: 2px dashed #000;"/>
        <p style="font-size: 14px; margin-top: 5px;">Terima Kasih</p>

        <p style="font-size: 14px; margin-top: 10px;">
        Didukung oleh Postren
        www.postren.id
        </p>
      </div>
    `;
};
