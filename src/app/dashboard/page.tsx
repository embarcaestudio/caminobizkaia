import { getHospitaleros } from "@/lib/data";
import { HospitalerosTable } from "@/components/hospitaleros/hospitaleros-table";
import { AddHospitaleroButton } from "@/components/hospitaleros/add-hospitalero-button";

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const hospitaleros = await getHospitaleros();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-headline text-3xl">Gestión de Hospitaleros</h1>
        <AddHospitaleroButton />
      </div>
      <HospitalerosTable data={hospitaleros} />
    </div>
  );
}
