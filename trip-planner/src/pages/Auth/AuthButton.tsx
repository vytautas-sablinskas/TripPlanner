import { ReloadIcon } from "@radix-ui/react-icons"
 
import { Button } from "@/components/ui/button"
 
export function AuthButton({ loading, onClick, text } : any) {
  return (
    loading ? (
      <Button disabled className="mt-5 container md:mx-auto max-w-[300px]">
        <ReloadIcon className="mr-2 animate-spin" />
        Please wait
      </Button>
    ) : (
      <Button type="submit" size="default" onClick={onClick} className="container md:mx-auto mr-2 mt-5 max-w-[300px] ">
        {text}
      </Button>
    )
    
  )
}