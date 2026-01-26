import { DbSettingsForm } from "./db-settings-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <h1 className="font-headline text-3xl">Configuración de Base de Datos</h1>
      <Card>
        <CardHeader>
          <CardTitle>Detalles de Conexión</CardTitle>
          <CardDescription>
            Introduce los datos de conexión a tu base de datos SQL. Estos datos se guardarán de forma segura.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DbSettingsForm />
        </CardContent>
      </Card>
    </div>
  );
}
