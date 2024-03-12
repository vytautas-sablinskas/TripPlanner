import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { DatePickerWithRange } from "@/components/Extra/DatePickerWithRange";
import { useNavigate } from "react-router-dom";
import Paths from "@/routes/Paths";

const formSchema = z.object({
    tripTitle: z.string().min(1, {
        message: "Trip name must be at least 1 character.",
    }),
    destinationCountry: z.string().min(1, {
        message: "This field is required.",
    }),
    date: z.object({
        from: z.date(),
        to: z.date(),
    }).refine((date) => {
        const diffInDays = Math.floor((date.to.getTime() - date.from.getTime()) / (1000 * 60 * 60 * 24));
        return diffInDays <= 30;
    }, "Your trip is too long! For now trips are only supported up to 30 days."),
});

const CreateTrip = () => {
    const navigate = useNavigate();
    
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            tripTitle: "",
            destinationCountry: "",
            date: {
                from: new Date(),
                to: new Date(),
            },
        },
    });

    const onSubmit = (data: z.infer<typeof formSchema>) => {
        console.log(data);
    };

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-5 flex flex-col mt-10"
                style={{ width: "100%" }}
            >
                <h1>Add Trip</h1>
                <FormField
                    control={form.control}
                    name="tripTitle"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Trip Name</FormLabel>
                            <FormControl className="w-[600px]">
                                <Input placeholder="Enter trip name" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="destinationCountry"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Destination Country</FormLabel>
                            <FormControl className="w-[600px]">
                                <Input placeholder="Enter destination" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Date Range</FormLabel>
                            <FormControl>
                                <DatePickerWithRange field={field} className="w-[600px] justify-start text-left font-normal" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div>
                    <Button className="w-[100px]" onClick={() => navigate(Paths.TRIPS)}>Cancel</Button>
                    <Button type="submit" className="w-[100px] ml-4">Submit</Button>
                </div>
            </form>
        </Form>
    );
};

export default CreateTrip;
