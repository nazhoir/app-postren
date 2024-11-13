import { z } from "zod";

export const AttendanceSchema = z.object({
  value: z.string(),
  provider: z.enum(["nfc", "qrcode", "barcode"]),
  activity: z.string(),
});
