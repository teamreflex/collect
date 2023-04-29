import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="grid place-content-center">
      <Loader2 className="animate-spin h-24 w-24 text-slate-300" />
    </div>
  );
}
