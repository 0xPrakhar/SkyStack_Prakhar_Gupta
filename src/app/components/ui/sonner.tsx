import { useTheme } from "next-themes";
import { Toaster as Sonner, type ToasterProps } from "sonner";

export function Toaster(props: ToasterProps) {
  const { resolvedTheme } = useTheme();

  return (
    <Sonner
      theme={resolvedTheme === "light" ? "light" : "dark"}
      richColors
      closeButton
      position="top-right"
      className="toaster"
      toastOptions={{
        classNames: {
          toast: "border border-white/10 bg-zinc-950 text-slate-100",
          description: "text-slate-400",
          actionButton: "bg-white text-black",
          cancelButton: "bg-white/10 text-slate-100",
        },
      }}
      {...props}
    />
  );
}
