import { Loader2 } from "lucide-react";

export default function Loader() {
  return (
    <div className="flex justify-center items-center">
      <Loader2 className="animate-spin h-24 w-24 text-background dark:text-foreground" />
    </div>
  );
}