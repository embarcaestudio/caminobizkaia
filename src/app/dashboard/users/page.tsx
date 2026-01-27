import { getUsers } from "@/lib/data";
import { UsersTable } from "@/components/users/users-table";
import { AddUserButton } from "@/components/users/add-user-button";

export const dynamic = 'force-dynamic';

export default async function UsersPage() {
  const users = await getUsers();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-headline text-3xl">Gestión de Usuarios</h1>
        <AddUserButton />
      </div>
      <UsersTable data={users} />
    </div>
  );
}
