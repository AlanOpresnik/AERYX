import React from "react";
import { StepDot } from "./StepDots";

interface Props {
  step: "comprador" | "envio" | "pago" | "confirmacion";
}

export default function Steps({ step }: Props) {
  const isBuyerDone =
    step === "envio" ||
    step === "pago" ||
    step === "confirmacion";

  const isShippingDone =
    step === "pago" ||
    step === "confirmacion";

  const isPaymentDone = step === "confirmacion";

  return (
    <div className="mb-12 flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.16em] sm:gap-5">
      {/* 01 — Comprador */}
      <StepDot
        active={step === "comprador"}
        done={isBuyerDone}
        label="01 — Información"
      />

      {/* Línea 01 → 02 */}
      <div
        className={`h-px flex-1 ${
          isBuyerDone ? "bg-black" : "bg-black/20"
        }`}
      />

      {/* 02 — Envío */}
      <StepDot
        active={step === "envio"}
        done={isShippingDone}
        label="02 — Envío"
      />

      {/* Línea 02 → 03 */}
      <div
        className={`h-px flex-1 ${
          isShippingDone ? "bg-black" : "bg-black/20"
        }`}
      />

      {/* 03 — Pago */}
      <StepDot
        active={step === "pago"}
        done={isPaymentDone}
        label="03 — Pago"
      />

      {/* Línea 03 → 04 */}
      <div
        className={`h-px flex-1 ${
          step === "confirmacion" ? "bg-black" : "bg-black/20"
        }`}
      />

      {/* 04 — Confirmación */}
      <StepDot
        active={step === "confirmacion"}
        done={false}
        label="04 — Confirmación"
      />
    </div>
  );
}