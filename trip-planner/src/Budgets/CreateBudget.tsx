import { CardTitle, CardDescription, CardHeader, CardContent, CardFooter, Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

export default function Component() {
  return (
    <Card className="w-full max-w-3xl">
      <CardHeader className="pb-0">
        <CardTitle className="text-2xl">Budget Creation</CardTitle>
        <CardDescription>Create a new budget and assign members.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" placeholder="Budget name" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" placeholder="Budget description" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="members">Members</Label>
          <div className="flex flex-row items-start space-x-2">
            <Input id="members" placeholder="Email" required type="email" />
            <Button size="sm">Add</Button>
          </div>
        </div>
        <div className="border rounded-lg p-4 flex flex-row items-start space-x-4">
          <img
            alt="Avatar"
            className="rounded-lg"
            height="40"
            src="/placeholder.svg"
            style={{
              aspectRatio: "40/40",
              objectFit: "cover",
            }}
            width="40"
          />
          <div className="space-y-1 w-full">
            <h3 className="font-semibold">alice@example.com</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Alice Johnson</p>
          </div>
          <Button className="ml-auto" size="sm">
            Remove
          </Button>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-2">
        <Button size="lg">Create</Button>
      </CardFooter>
    </Card>
  )
}

