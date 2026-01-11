import Spinner from "@/assets/spinner.svg?react";

export const Loader = () => {
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center dark:bg-black/60">
      <Spinner className="h-32 w-32 animate-spin" />
    </div>
  );
};
