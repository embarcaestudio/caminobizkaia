import { DbSettingsForm } from "./db-settings-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";

export default function SettingsPage() {
  const dbConfig = {
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    user: process.env.DB_USER,
  };
  
  return (
    <div className="space-y-6">
      <h1 className="font-headline text-3xl">Configuración de Base de Datos</h1>

      <Alert>
        <Terminal className="h-4 w-4" />
        <AlertTitle>¡Importante!</AlertTitle>
        <AlertDescription>
          <p>Para guardar la configuración de tu base de datos de forma segura, crea un archivo llamado <code>.env.local</code> en la raíz de tu proyecto y añade tus credenciales. La aplicación leerá estos valores automáticamente.</p>
          <pre className="mt-2 rounded-md bg-muted p-4 text-sm">
            {`DB_HOST=tu_host\nDB_DATABASE=tu_base_de_datos\nDB_USER=tu_usuario\nDB_PASSWORD=tu_contraseña`}
          </pre>
           <p className="mt-2">Después de crear o modificar el archivo <code>.env.local</code>, debes <strong>reiniciar el servidor</strong> de desarrollo para que los cambios surtan efecto.</p>
        </AlertDescription>
      </Alert>
      
      <Card>
        <CardHeader>
          <CardTitle>Probar Conexión a la Base de Datos</CardTitle>
          <CardDescription>
            Usa este formulario para verificar que los datos introducidos en tu archivo <code>.env.local</code> son correctos. Estos campos muestran los valores actuales (excepto la contraseña).
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DbSettingsForm currentConfig={dbConfig} />
        </CardContent>
      </Card>
    </div>
  );
}
