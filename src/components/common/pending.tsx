import { Loader2 } from "lucide-react";

interface  PendingProps {
  resource: string
}
export default function Pending({resource}:PendingProps) {
  return (
    <div className="flex justify-center items-center py-8">
      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      <span className="ml-2 text-sm text-muted-foreground">Loading {resource}...</span>
    </div>
  )

}
