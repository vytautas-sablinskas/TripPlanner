import MultipleSelector from "@/components/ui/multiple-selector";
import "./styles/trip-add-traveller.css";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ArrowLeft } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import Paths from "@/routes/Paths";

const formSchema = z.object({
    invites: z.array(z.any()).nonempty({
        message: "At least one invite must be provided.",
    }),
    message: z.string().optional()
});

const TripAddTraveller = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          invites: [],
          message: "",
        },
    });

    const onSubmit = (values : any) => {
        console.log(values);
    }

    const getTripId = () => {
        const path = location.pathname.split("/");
        return path[path.length - 3];
    };

    return (
        <Form {...form}>
            <form 
                className="trip-add-traveller-main-container"
                onSubmit={form.handleSubmit(onSubmit)}
            >
                      <span
                        className="back-to-travellers-list"
                        onClick={() => navigate(Paths.TRIP_TRAVELLERS_VIEW.replace(":tripId", getTripId()))}
                    >
                        <ArrowLeft className="mr-2" />
                        <p>Back To Trip Travellers</p>
                    </span>
                <Card className="trip-add-traveller-information-container">
                    <CardContent>
                        <h1 className="font-bold text-2xl text-center mb-4 pt-6">Invite Travellers To Trip</h1>
                        <FormField
                            control={form.control}
                            name="invites"
                            render={({ field }) => (
                                <FormItem className="mb-6">
                                  <FormControl>
                                  <MultipleSelector
                                        defaultOptions={field.value}
                                        onChange={field.onChange}
                                        placeholder="Enter email of traveller"
                                        creatable
                                        isEmail
                                        createErrorMessage="Email is already selected."
                                    />
                                  </FormControl>
                                  <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="message"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Message</FormLabel>
                                <FormControl className="w-full mb-4">
                                    <Textarea
                                        placeholder="Type your message here."
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        <Button className="w-full my-6">
                            Send Invites
                        </Button>
                    </CardContent>
                </Card>
            </form>
        </Form>
        )
}

export default TripAddTraveller;