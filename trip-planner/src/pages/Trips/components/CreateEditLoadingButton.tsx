import { ReloadIcon } from "@radix-ui/react-icons"
 
import { Button } from "@/components/ui/button"
 
export function CreateEditLoadingButton({ loading, text } : any) {
  return (
    loading ? (
      <Button disabled>
        <ReloadIcon className="mr-2 animate-spin" />
        Please wait
      </Button>
    ) : (
      <Button type="submit" size="default">
        {text}
      </Button>
    )
    
  )
}