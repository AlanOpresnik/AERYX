import React from "react";
import { InfoRow } from "../InfoRow/InfoRow";

export default function BankData() {
  return (
    <div className="border border-black/10 bg-black/[0.02] p-5">
      <div className="mb-5">
        <h3 className="text-sm font-medium text-black">
          Transferencia bancaria
        </h3>

        <p className="mt-1 text-xs leading-relaxed text-black/50">
          Realizá la transferencia con los siguientes datos. Luego, deberás
          subir el comprobante para que podamos verificar tu pago.
        </p>
      </div>

      <div className="space-y-3">
        <InfoRow label="Titular" value="NOMBRE DEL TITULAR" />

        <InfoRow label="Banco" value="BANCO GALICIA" />

        <InfoRow label="CBU" value="0000000000000000000000" mono />

        <InfoRow label="Alias" value="AERYX.PAGOS" mono />

        <InfoRow label="CUIT" value="20-00000000-0" />
      </div>

      <div className="mt-5 border border-black/10 bg-white p-4">
        <p className="text-xs font-medium text-black">Importante</p>

        <p className="mt-1 text-xs leading-relaxed text-black/50">
          Una vez realizada la transferencia, subí el comprobante desde tu
          cuenta para que podamos verificar el pago.
        </p>
      </div>
    </div>
  );
}
