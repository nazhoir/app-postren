import { getOrgUserProfile, type UserProfile } from "@/server/actions/users";
import { notFound, redirect } from "next/navigation";
import React, { Suspense } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { auth } from "@/server/auth";
import { Button } from "@/components/ui/button";
import { BadgeAlert, UserPen, Verified } from "lucide-react";
import { getOrgsIdByUserId } from "@/server/actions/organizations";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { id as IDN } from "date-fns/locale";
import { Skeleton } from "@/components/ui/skeleton";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session) return redirect("/auth/login");

  const { id } = await params;
  const orgID = await getOrgsIdByUserId(session.user.id);

  if (!orgID) return redirect("/auth/login");

  const data = await getOrgUserProfile(id, orgID);
  if (!data) return notFound();

  return (
    <div className="h-fit overflow-auto">
      <Header id={id} name={data.name} />
      <Suspense fallback={<ProfileLoadingSkeleton />}>
        <MainContent data={data} orgID={orgID} />
      </Suspense>
    </div>
  );
}

const Header = ({ name, id }: { name: string; id: string }) => (
  <header className="flex h-16 w-screen shrink-0 items-center gap-2 md:w-full">
    <div className="flex items-center gap-2 px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>{name.toUpperCase()}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </div>
    <div className="ml-auto mr-4 flex space-x-2">
      <Button size="sm" asChild>
        <Link href={`/users/${id}/edit`}>
          <UserPen className="h-4 w-4" />
          <span className="ml-1">Edit</span>
        </Link>
      </Button>
    </div>
  </header>
);

const ProfileLoadingSkeleton = () => (
  <main className="flex flex-1 flex-col gap-4 overflow-auto rounded-b-lg border-t px-4 pb-6 lg:h-[85vh]">
    <div className="pt-6 lg:w-full">
      <div className="md:grid md:grid-cols-7">
        <Skeleton className="mx-auto h-32 w-32 rounded-lg" />
        <div className="mt-4 md:col-span-6 md:mt-0 md:px-2">
          <Skeleton className="mx-auto mb-4 h-8 w-1/2 md:mx-0" />
          {[Array(8)].map((_, index) => (
            <div key={index} className="mb-2 flex items-center space-x-2">
              <Skeleton className="h-4 w-36" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      </div>
    </div>
  </main>
);

const MainContent = ({ data, orgID }: { data: UserProfile; orgID: string }) => (
  <main className="flex flex-1 flex-col gap-4 overflow-auto rounded-b-lg border-t px-4 pb-6 text-sm lg:h-[85vh]">
    <div className="pt-6 lg:w-full">
      <div className="md:grid md:grid-cols-7">
        <Avatar className="mx-auto h-32 w-32 rounded-lg border md:sticky md:top-8">
          <AvatarImage src={data.image!} alt={data.name} />
          <AvatarFallback className="rounded-lg">
            {`${data.name?.split(" ")[0]?.slice(0, 1)}${data.name?.split(" ")[1]?.slice(0, 1)}`.toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <UserDetails data={data} orgID={orgID} />
      </div>
    </div>
  </main>
);

const UserDetails = ({ data, orgID }: { data: UserProfile; orgID: string }) => {
  const getGuardianType = () => {
    if (!data.guardianId) return undefined;

    if (data.guardianId === data.fatherId) {
      return "AYAH";
    }
    if (data.guardianId === data.motherId) {
      return "IBU";
    }
    return data.guardianType?.replaceAll("_", " ");
  };
  return (
    <div className="mt-4 md:col-span-6 md:mt-0 md:px-2">
      <h1 className="mb-8 text-center text-2xl font-bold md:mb-4 md:text-left">
        {data.name}
      </h1>
      <DetailRow label="Nomor Induk" value={data.registrationNumber} />
      {data.nisn && <DetailRow label="NISN" value={data.nisn} />}
      <DetailRow label="NIK" value={data.nik} />
      <DetailRow label="NKK" value={data.nkk} />
      <DetailRow
        label="Kelamin"
        value={
          data.gender === "L"
            ? "Laki-laki"
            : data.gender === "P"
              ? "Perempuan"
              : null
        }
      />
      <DetailRow label="Tempat lahir" value={data.birthPlace} />
      <DetailRow
        label="Tanggal lahir"
        value={
          data.birthDate
            ? format(new Date(data.birthDate), "dd MMMM yyyy", { locale: IDN })
            : "-"
        }
      />
      <DetailRow label="Kewarganegaraan" value={data.nationality} />
      <DetailRow label="Negara" value={data.country} />
      <EmailDetails email={data.email} emailVerified={data.emailVerified} />

      <div className="mt-4">
        <h2 className="font-bold">Alamat</h2>
        <DetailRow label="Alamat lengkap" value={data.address?.fullAddress} />
        <DetailRow label="RT" value={data.address?.rt} />
        <DetailRow label="RW" value={data.address?.rw} />
        <DetailRow label="Desa" value={data.address?.village} />
        <DetailRow label="Kecamatan" value={data.address?.district} />
        <DetailRow label="Kabupaten" value={data.address?.regency} />
        <DetailRow label="Provinsi" value={data.address?.province} />
        <DetailRow label="Kode pos" value={data.address?.postalCode} />
      </div>
      {data.nisn ? (
        <>
          <DetailRow label="Wali" value={getGuardianType()} />
          <div className="mt-4 grid gap-8 border-t py-4 md:mt-8">
            <Suspense fallback={<Skeleton className="h-20 w-full" />}>
              <ParentProfile
                label="AYAH KANDUNG"
                userID={data.fatherId!}
                orgID={orgID}
              />
            </Suspense>
            <Suspense fallback={<Skeleton className="h-20 w-full" />}>
              <ParentProfile
                label="IBU KANDUNG"
                userID={data.motherId!}
                orgID={orgID}
              />
            </Suspense>

            {data.guardianType ? (
              <ParentProfile
                label={"WALI"}
                userID={data.guardianId!}
                orgID={orgID}
              />
            ) : null}
          </div>
        </>
      ) : null}
    </div>
  );
};

async function ParentProfile({
  userID,
  orgID,
  label,
}: {
  label: string;
  userID: string;
  orgID: string;
}) {
  let data: UserProfile = {
    id: "",
    name: "",
    username: null,
    email: null,
    nationality: "WNI",
    country: null,
    nik: null,
    nkk: null,
    passport: null,
    birthPlace: null,
    birthDate: null,
    gender: null,
    emailVerified: null,
    image: null,
    registrationNumber: null,
    fatherId: null,
    motherId: null,
    guardianId: null,
    guardianType: null,
    domicileSameAsAddress: null,
  };
  const req = await getOrgUserProfile(userID, orgID);

  if (req) data = req;
  return (
    <div>
      <h2 className="text-center text-lg font-bold md:mb-0 md:text-left">
        {label}
      </h2>
      <DetailRow label="Nama" value={data.name} />
      <DetailRow label="NIK" value={data.nik} />
      <DetailRow label="NKK" value={data.nkk} />
      <DetailRow label="Tempat lahir" value={data.birthPlace} />
      <DetailRow
        label="Tanggal lahir"
        value={
          data.birthDate
            ? format(new Date(data.birthDate), "dd MMMM yyyy", { locale: IDN })
            : "-"
        }
      />
    </div>
  );
}

type DetailRow = React.HTMLAttributes<HTMLParagraphElement> & {
  label: string;
  value?: string | null;
};
const DetailRow = ({ label, value, className, ...props }: DetailRow) => (
  <p {...props} className={cn("flex items-start space-x-1", className)}>
    <span className="w-36">{label} </span>:{" "}
    <span className="w-1/2 text-pretty">{value ?? "-"} </span>
  </p>
);

const EmailDetails = ({
  email,
  emailVerified,
}: {
  email: string | null;
  emailVerified: Date | null;
}) => (
  <p className="flex space-x-1">
    <span className="w-36">Email</span>:{" "}
    <span className="flex flex-col md:flex-row md:items-center">
      {email ? (
        <>
          <span className="break-all">{email}</span>
          {emailVerified ? (
            <span className="flex items-center space-x-2 md:ml-2">
              <Verified className="h-4 w-4 text-green-700" />
              <span className="text-xs font-bold text-green-700 underline">
                Terverifikasi
              </span>
            </span>
          ) : (
            <span className="flex items-center space-x-2 md:ml-2">
              <BadgeAlert className="h-4 w-4 text-red-700" />
              <a href="#" className="text-xs font-bold text-red-700 underline">
                Tidak Terverifikasi
              </a>
            </span>
          )}
        </>
      ) : (
        "-"
      )}
    </span>
  </p>
);
