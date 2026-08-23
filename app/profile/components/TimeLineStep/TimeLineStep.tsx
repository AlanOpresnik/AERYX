import { CheckCircle2 } from "lucide-react";

export type TimelineState = "done" | "current" | "upcoming";

export interface TimelineStepData {
  title: string;
  time: string;
  state: TimelineState;
  note?: string;
}

interface TimelineStepProps {
  step: TimelineStepData;
  isLast: boolean;
}

function TimelineStep({
  step,
  isLast,
}: TimelineStepProps) {
  const connectorStyles =
    step.state === "done"
      ? "border-emerald-600"
      : "border-neutral-300 border-dashed";

  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        {step.state === "done" ? (
          <CheckCircle2
            className="w-5 h-5 text-emerald-600 fill-emerald-50 flex-shrink-0"
            strokeWidth={2}
          />
        ) : step.state === "current" ? (
          <span className="relative w-5 h-5 flex items-center justify-center flex-shrink-0">
            <span className="absolute w-5 h-5 rounded-full bg-orange-200 animate-ping" />
            <span className="relative w-3 h-3 rounded-full bg-orange-500" />
          </span>
        ) : (
          <span className="w-5 h-5 rounded-full border-2 border-neutral-300 bg-white flex-shrink-0" />
        )}

        {!isLast && (
          <span
            className={`flex-1 w-0 border-l-2 my-1 ${connectorStyles}`}
          />
        )}
      </div>

      <div className={isLast ? "pb-0" : "pb-6"}>
        <p
          className={`text-sm font-semibold ${
            step.state === "upcoming"
              ? "text-neutral-400"
              : "text-neutral-900"
          }`}
        >
          {step.title}
        </p>

        <p
          className={`text-xs mt-0.5 ${
            step.state === "current"
              ? "font-plex text-orange-600 font-medium"
              : "font-plex text-neutral-400"
          }`}
        >
          {step.time}
        </p>

        {step.note && (
          <p className="mt-2 text-xs leading-relaxed text-neutral-600 bg-amber-50 rounded-lg px-3 py-2.5 max-w-sm">
            {step.note}
          </p>
        )}
      </div>
    </div>
  );
}

export default TimelineStep;