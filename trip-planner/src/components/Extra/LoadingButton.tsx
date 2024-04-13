import { ReloadIcon } from "@radix-ui/react-icons"
 
import { Button } from "@/components/ui/button"
 
export function CreateEditLoadingButton({ loading, text, size, className, onClick } : any) {
  return (
    loading ? (
      <Button type="submit" size={size || "default"} disabled className={className}>
        <ReloadIcon className="mr-2 animate-spin" />
        Please wait
      </Button>
    ) : (
      <Button type="submit" size={size || "default"} className={className} onClick={onClick}>
        {text}
      </Button>
    )
    
  )
}