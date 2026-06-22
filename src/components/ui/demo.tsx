import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useId } from "react";

function Component() {
  const id = useId();
  return (
    <div className="space-y-2 min-w-[300px]">
      <Label htmlFor={id}>
        Required input <span className="text-destructive">*</span>
      </Label>
      <Input id={id} placeholder="Email" type="email" required />
    </div>
  );
}

export { Component };
