"use client";

import React, { useState, useRef, useCallback } from "react";
import readXlsxFile, { type Schema } from "read-excel-file";
import * as XLSX from "xlsx";
import { type z } from "zod";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  FileSpreadsheet,
  Upload,
  X,
  RefreshCw,
  CheckCircle,
  Download,
} from "lucide-react";
import {
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { type CreateMemberSchema } from "@/schema/members";
import { createMemberAction } from "@/server/actions/members";

// Define Excel schema compatible with read-excel-file
const excelSchema: Schema = {
  nama: {
    prop: "nama",
    type: String,
    required: true,
  },
  nik: {
    prop: "nik",
    type: String,
  },
  nkk: {
    prop: "nkk",
    type: String,
  },
  kelamin: {
    prop: "kelamin",
    validate: (value: string): "L" | "P" | null => {
      return ["L", "P"].includes(value) ? (value as "L" | "P") : null;
    },
    required: true,
  },
  tempat_lahir: {
    prop: "tempat_lahir",
    type: String,
    required: true,
  },
  tanggal_lahir: {
    prop: "tanggal_lahir",
    type: String,
    required: true,
  },
  role: {
    prop: "role",
    type: String,
    required: true,
    validate: (value: string) => ["1", "2"].includes(value),
  },
  nisn: {
    prop: "nisn",
    type: String,
  },
  kewarganegaraan: {
    prop: "kewarganegaraan",
    validate: (value: string): "WNI" | "WNA" | null => {
      return ["WNI", "WNA"].includes(value) ? (value as "WNI" | "WNA") : null;
    },
    required: true,
  },
  passpor: {
    prop: "passpor",
    type: String,
  },
};

// Type for parsed Excel data
interface ExcelEntry {
  nama: string;
  kewarganegaraan: "WNA" | "WNI";
  negara?: string;
  tempat_lahir: string;
  tanggal_lahir: string;
  kelamin: "L" | "P";
  nik?: string;
  nkk?: string;
  passpor?: string;
  role: "1" | "2";
  nisn?: string;
}

type Data = z.infer<typeof CreateMemberSchema>;

interface ValidationError {
  row: number;
  column: string;
  error: string;
}

const ROLES_MAP = {
  "1": "student",
  "2": "guardian",
} as const;
import { parse, format } from "date-fns";
const ACCEPTED_FILE_TYPES = [".xlsx", ".xls", ".csv"];

export function CreateBulkMemberForm({ createdBy }: { createdBy: string }) {
  const [file, setFile] = useState<File | null>(null);
  const [data, setData] = useState<Data[]>([]);
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const downloadTemplate = useCallback(() => {
    const templateData = [
      [
        "nama",
        "nik",
        "nkk",
        "kelamin",
        "tempat_lahir",
        "tanggal_lahir",
        "role",
        "nisn",
      ],
      ["John Doe", "", "", "L", "", "01/01/1999", "1", ""],
    ];

    const ws = XLSX.utils.aoa_to_sheet(templateData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Template");

    XLSX.writeFile(wb, "template_member.xlsx");
    toast.success("Template berhasil diunduh!");
  }, []);

  const validateFileType = useCallback((fileName: string): boolean => {
    return ACCEPTED_FILE_TYPES.some((type) =>
      fileName.toLowerCase().endsWith(type),
    );
  }, []);

  const transformExcelData = useCallback(
    (entry: ExcelEntry): Data => {
      return {
        role: ROLES_MAP[entry.role],
        nisn: entry.nisn ?? "",
        name: entry.nama,
        birthPlace: entry.tempat_lahir,
        birthDate: format(
          parse(entry.tanggal_lahir, "dd/MM/yyyy", new Date()),
          "yyyy-MM-dd",
        ),
        gender: entry.kelamin,
        address: "",
        createdBy,
        identity: {
          nationality: entry.kewarganegaraan,
          country: entry.negara!,
          passport: entry.passpor ? entry.passpor : "",
          nik: entry.nik ? entry.nik : "",
          nkk: entry.nkk ? entry.nkk : "",
        },
      };
    },
    [createdBy],
  );

  const processExcelFile = async () => {
    if (!file) {
      toast.error("Silakan unggah file terlebih dahulu.");
      return;
    }

    setIsLoading(true);
    setProgress(0);
    setErrors([]);
    setData([]);

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-redundant-type-constituents
      const { rows, errors: rowErrors } = await readXlsxFile<ExcelEntry | any>(
        file,
        {
          schema: excelSchema,
          transformData: (data) => {
            // Additional data transformation if needed
            return data;
          },
        },
      );

      const validationErrors: ValidationError[] = rowErrors.map((error) => ({
        row: error.row ?? 0,
        column: error.column ?? "Unknown",
        error: error.error ?? "Nilai tidak valid",
      }));

      const validData = rows.map(transformExcelData);

      setErrors(validationErrors);
      setData(validData);
      setProgress(100);

      if (validationErrors.length === 0) {
        toast.success(`Berhasil memproses ${rows.length} baris data.`);
      } else {
        toast.warning(`Ditemukan ${validationErrors.length} kesalahan.`);
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal memproses file");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const uploadedFile = event.target.files?.[0];
      if (uploadedFile && validateFileType(uploadedFile.name)) {
        setFile(uploadedFile);
        toast.success(
          "File berhasil diunggah. Tekan tombol proses untuk melanjutkan.",
        );
      } else {
        setFile(null);
        toast.error(
          `Silakan pilih file dengan format: ${ACCEPTED_FILE_TYPES.join(", ")}`,
        );
      }
    },
    [validateFileType],
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile && validateFileType(droppedFile.name)) {
        setFile(droppedFile);
        toast.success(
          "File berhasil diunggah. Tekan tombol proses untuk melanjutkan.",
        );
      } else {
        toast.error(
          `Silakan pilih file dengan format: ${ACCEPTED_FILE_TYPES.join(", ")}`,
        );
      }
    },
    [validateFileType],
  );

  const handleClearData = useCallback(() => {
    setData([]);
    setErrors([]);
    setProgress(0);
    toast.info("Data hasil parsing telah dihapus.");
  }, []);

  const handleResetInput = useCallback(() => {
    setFile(null);
    setData([]);
    setErrors([]);
    setProgress(0);
    if (fileInputRef.current) fileInputRef.current.value = "";
    toast.info("Input file berhasil direset.");
  }, []);

  const submitData = async () => {
    try {
      for (const value of data) {
        const req = await createMemberAction(value);
        if (req.error) throw new Error(req.error);
        toast.success(`User ${value.name} berhasil di input`);
      }
    } catch (error) {
      toast.error(`Gagal menginput User: ${error as string}`);
      // Looping berhenti ketika error terjadi
    }
  };

  return (
    <>
      <CardHeader>
        <div className="flex items-center gap-2">
          <FileSpreadsheet className="h-6 w-6 text-primary" />
          <CardTitle>Excel Parser dengan Validasi</CardTitle>
        </div>
        <CardDescription>
          Unggah file Excel (.xlsx, .xls) atau CSV untuk memproses data anggota
          secara massal
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex justify-end">
          <Button
            variant="outline"
            onClick={downloadTemplate}
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            Download Template
          </Button>
        </div>

        <div
          className={`rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
            isDragging
              ? "border-primary bg-primary/5"
              : "border-gray-200 hover:border-primary/50"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={ACCEPTED_FILE_TYPES.join(",")}
            onChange={handleFileUpload}
            className="hidden"
          />
          <div className="flex flex-col items-center gap-2">
            <Upload className="h-8 w-8 text-gray-400" />
            <div className="text-sm text-gray-600">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="text-primary hover:underline"
                disabled={isLoading}
                type="button"
              >
                Pilih file
              </button>{" "}
              atau drag and drop
            </div>
            {file && (
              <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
                <CheckCircle className="h-4 w-4 text-green-500" />
                {file.name}
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={processExcelFile}
            disabled={!file || isLoading}
            className="flex-1"
          >
            {isLoading ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Memproses...
              </>
            ) : (
              "Proses Data"
            )}
          </Button>
          <Button
            onClick={handleClearData}
            disabled={!data.length && !errors.length}
            variant="outline"
            className="gap-2"
          >
            <X className="h-4 w-4" />
            Clear Data
          </Button>
          <Button
            onClick={handleResetInput}
            variant="destructive"
            className="gap-2"
            disabled={!file}
          >
            <X className="h-4 w-4" />
            Reset Input
          </Button>
        </div>

        {isLoading && (
          <div className="mt-4">
            <Progress value={progress} />
          </div>
        )}

        {errors.length > 0 && (
          <div className="space-y-2">
            {errors.map((error, index) => (
              <Alert key={index} variant="destructive">
                <AlertDescription className="text-sm">
                  Row {error.row} - {error.column}: {error.error}
                </AlertDescription>
              </Alert>
            ))}
          </div>
        )}

        {data.length > 0 && !errors.length && (
          <div className="mt-6">
            <h2 className="text-lg font-semibold">Data Berhasil Diproses</h2>
            <Button onClick={submitData}>Proses simpan</Button>
            <div className="mt-2 space-y-1">
              {data.map((item, idx) => (
                <div key={idx} className="text-sm">
                  {item.name} - {item.role}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </>
  );
}
