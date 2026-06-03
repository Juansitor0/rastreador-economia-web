import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Upload } from "lucide-react";
import { toast } from "sonner";

interface DataBackupManagerProps {
  userData: any;
  onDataImported?: (data: any) => void;
}

export default function DataBackupManager({
  userData,
  onDataImported,
}: DataBackupManagerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExportData = () => {
    try {
      const dataToExport = {
        exportDate: new Date().toISOString(),
        version: "1.0",
        data: userData,
      };

      const jsonString = JSON.stringify(dataToExport, null, 2);
      const blob = new Blob([jsonString], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `rastreador-economia-backup-${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success("Dados exportados com sucesso!");
    } catch (error) {
      toast.error("Erro ao exportar dados");
      console.error("Export error:", error);
    }
  };

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const importedData = JSON.parse(content);

        if (!importedData.data) {
          throw new Error("Formato de arquivo inválido");
        }

        // Validate the imported data structure
        if (
          !importedData.data.profile ||
          !Array.isArray(importedData.data.transactions)
        ) {
          throw new Error(
            "Estrutura de dados inválida. Certifique-se de usar um arquivo exportado válido."
          );
        }

        onDataImported?.(importedData.data);
        toast.success("Dados importados com sucesso!");

        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Erro ao importar dados";
        toast.error(errorMessage);
        console.error("Import error:", error);
      }
    };

    reader.readAsText(file);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Backup e Portabilidade de Dados</CardTitle>
        <CardDescription>
          Exporte seus dados para um arquivo seguro ou importe dados anteriormente salvos
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-900">
            💡 <strong>Dica:</strong> Faça backup regularmente de seus dados para
            não perder seu progresso. Você pode importar os dados em qualquer
            momento.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Export Button */}
          <Button
            onClick={handleExportData}
            className="gap-2 bg-green-600 hover:bg-green-700"
          >
            <Download className="w-4 h-4" />
            Exportar Dados
          </Button>

          {/* Import Button */}
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleImportData}
              className="hidden"
            />
            <Button
              onClick={() => fileInputRef.current?.click()}
              variant="outline"
              className="w-full gap-2"
            >
              <Upload className="w-4 h-4" />
              Importar Dados
            </Button>
          </div>
        </div>

        <div className="text-xs text-gray-500 space-y-1">
          <p>
            <strong>Exportar:</strong> Cria um arquivo JSON com todos os seus
            dados. Guarde em local seguro.
          </p>
          <p>
            <strong>Importar:</strong> Restaura dados de um arquivo exportado
            anteriormente.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
