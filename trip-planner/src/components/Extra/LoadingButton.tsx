import { ReloadIcon } from "@radix-ui/react-icons"
 
import { Button } from "@/components/ui/button"
 
export function CreateEditLoadingButton({ loading, text, className } : any) {
  return (
    loading ? (
      <Button disabled className={className}>
        <ReloadIcon className="mr-2 animate-spin" />
        Please wait
      </Button>
    ) : (
      <Button type="submit" size="default" className={className}>
        {text}
      </Button>
    )
    
  )
}