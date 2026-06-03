import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Plus } from "lucide-react";

interface Equipment {
  id: string;
  name: string;
  price: number;
  selected: boolean;
}

interface AcquisitionCostsManagerProps {
  onCostsUpdate: (costs: {
    registrationFee: number;
    transferFee: number;
    insurancePercentage: number;
    equipment: { name: string; price: number }[];
  }) => void;
}

const PRESET_EQUIPMENT = [
  { name: "Capacete", price: 200 },
  { name: "Jaqueta de Couro", price: 300 },
  { name: "Cadeado/Corrente", price: 150 },
  { name: "Luvas", price: 100 },
  { name: "Bota de Moto", price: 250 },
  { name: "Protetor de Tanque", price: 120 },
];

export default function AcquisitionCostsManager({
  onCostsUpdate,
}: AcquisitionCostsManagerProps) {
  const [registrationFee, setRegistrationFee] = useState("200");
  const [transferFee, setTransferFee] = useState("150");
  const [insurancePercentage, setInsurancePercentage] = useState("10");
  const [equipment, setEquipment] = useState<Equipment[]>(
    PRESET_EQUIPMENT.map((item, idx) => ({
      id: idx.toString(),
      ...item,
      selected: false,
    }))
  );
  const [customEquipment, setCustomEquipment] = useState("");
  const [customPrice, setCustomPrice] = useState("");

  const handleEquipmentToggle = (id: string) => {
    setEquipment((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, selected: !item.selected } : item
      )
    );
  };

  const handleAddCustomEquipment = () => {
    if (customEquipment && customPrice) {
      const newItem: Equipment = {
        id: Date.now().toString(),
        name: customEquipment,
        price: parseFloat(customPrice),
        selected: true,
      };
      setEquipment([...equipment, newItem]);
      setCustomEquipment("");
      setCustomPrice("");
    }
  };

  const handleRemoveEquipment = (id: string) => {
    setEquipment((prev) => prev.filter((item) => item.id !== id));
  };

  const handleUpdate = () => {
    const selectedEquipment = equipment
      .filter((item) => item.selected)
      .map((item) => ({
        name: item.name,
        price: item.price,
      }));

    onCostsUpdate({
      registrationFee: parseFloat(registrationFee) || 0,
      transferFee: parseFloat(transferFee) || 0,
      insurancePercentage: parseFloat(insurancePercentage) || 10,
      equipment: selectedEquipment,
    });
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const totalEquipmentCost = equipment
    .filter((item) => item.selected)
    .reduce((sum, item) => sum + item.price, 0);

  const totalAdditionalCosts =
    parseFloat(registrationFee) + parseFloat(transferFee) + totalEquipmentCost;

  return (
    <div className="space-y-6">
      {/* Taxes and Fees */}
      <Card>
        <CardHeader>
          <CardTitle>Taxas Estaduais e Seguro</CardTitle>
          <CardDescription>
            Custos obrigatórios para aquisição do veículo
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="registration">Emplacamento (DETRAN) - R$</Label>
              <Input
                id="registration"
                type="number"
                value={registrationFee}
                onChange={(e) => setRegistrationFee(e.target.value)}
                placeholder="200"
              />
            </div>
            <div>
              <Label htmlFor="transfer">Transferência (DETRAN) - R$</Label>
              <Input
                id="transfer"
                type="number"
                value={transferFee}
                onChange={(e) => setTransferFee(e.target.value)}
                placeholder="150"
              />
            </div>
            <div>
              <Label htmlFor="insurance">Seguro Inicial - %</Label>
              <Input
                id="insurance"
                type="number"
                value={insurancePercentage}
                onChange={(e) => setInsurancePercentage(e.target.value)}
                placeholder="10"
              />
              <p className="text-xs text-gray-500 mt-1">
                Percentual do valor da moto
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Equipment Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Equipamentos Essenciais</CardTitle>
          <CardDescription>
            Selecione os itens de segurança que pretende adquirir
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Preset Equipment */}
          <div className="space-y-3">
            <p className="text-sm font-medium text-gray-700">
              Equipamentos Sugeridos
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {equipment
                .filter((item) => PRESET_EQUIPMENT.some((p) => p.name === item.name))
                .map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                  >
                    <Checkbox
                      id={`equipment-${item.id}`}
                      checked={item.selected}
                      onCheckedChange={() => handleEquipmentToggle(item.id)}
                    />
                    <label
                      htmlFor={`equipment-${item.id}`}
                      className="flex-1 cursor-pointer"
                    >
                      <p className="text-sm font-medium text-gray-900">
                        {item.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatCurrency(item.price)}
                      </p>
                    </label>
                  </div>
                ))}
            </div>
          </div>

          {/* Custom Equipment */}
          <div className="border-t pt-4 space-y-3">
            <p className="text-sm font-medium text-gray-700">
              Adicionar Equipamento Customizado
            </p>
            <div className="flex gap-2">
              <Input
                placeholder="Nome do item"
                value={customEquipment}
                onChange={(e) => setCustomEquipment(e.target.value)}
              />
              <Input
                placeholder="Preço"
                type="number"
                value={customPrice}
                onChange={(e) => setCustomPrice(e.target.value)}
                className="w-24"
              />
              <Button
                onClick={handleAddCustomEquipment}
                size="sm"
                className="gap-2"
              >
                <Plus className="w-4 h-4" />
                Adicionar
              </Button>
            </div>
          </div>

          {/* Custom Equipment List */}
          {equipment.filter((item) => !PRESET_EQUIPMENT.some((p) => p.name === item.name)).length > 0 && (
            <div className="border-t pt-4 space-y-2">
              <p className="text-sm font-medium text-gray-700">
                Equipamentos Customizados
              </p>
              <div className="space-y-2">
                {equipment
                  .filter((item) => !PRESET_EQUIPMENT.some((p) => p.name === item.name))
                  .map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <Checkbox
                          checked={item.selected}
                          onCheckedChange={() => handleEquipmentToggle(item.id)}
                        />
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {item.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatCurrency(item.price)}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveEquipment(item.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Summary */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="pt-6 space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Emplacamento</span>
            <span className="font-semibold">
              {formatCurrency(parseFloat(registrationFee) || 0)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Transferência</span>
            <span className="font-semibold">
              {formatCurrency(parseFloat(transferFee) || 0)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Equipamentos</span>
            <span className="font-semibold">
              {formatCurrency(totalEquipmentCost)}
            </span>
          </div>
          <div className="border-t pt-2 flex justify-between">
            <span className="font-semibold text-blue-900">Total Adicional</span>
            <span className="font-bold text-lg text-blue-900">
              {formatCurrency(totalAdditionalCosts)}
            </span>
          </div>
        </CardContent>
      </Card>

      <Button onClick={handleUpdate} className="w-full">
        Atualizar Custos
      </Button>
    </div>
  );
}
