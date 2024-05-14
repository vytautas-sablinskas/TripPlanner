import { ReloadIcon } from "@radix-ui/react-icons";

import { Button } from "@/components/ui/button";

export function AuthButton({ loading, onClick, text }: any) {
  return loading ? (
    <Button type="submit" disabled className="container mt-1 md:mx-auto">
      <ReloadIcon className="mr-2 animate-spin" />
      Please wait
    </Button>
  ) : (
    <Button
      type="submit"
      size="default"
      onClick={onClick}
      className="container mt-1 md:mx-auto mr-2"
    >
      {text}
    </Button>
  );
}
