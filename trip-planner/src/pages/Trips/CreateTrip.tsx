import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
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
import "./styles/create-trip.css";
import { toast } from "sonner";

const MAX_FILE_SIZE = 2000000;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const formSchema = z.object({
  tripTitle: z.string().min(1, {
    message: "Trip name must be at least 1 character.",
  }),
  destinationCountry: z.string().min(1, {
    message: "This field is required.",
  }),
  date: z
    .object({
      from: z.date().nullable(),
      to: z.date().nullable(),
    })
    .refine((date) => {
        return date.from && date.to
    }, "Please select a date range.")
    .refine((date) => {
      if (!date.from || !date.to) return false;

      const diffInDays = Math.floor(
        (date.to.getTime() - date.from.getTime()) / (1000 * 60 * 60 * 24)
      );
      return diffInDays <= 30;
    }, "Your trip is too long! For now trips are only supported up to 30 days."),
  image: z.any(),
});

const CreateTrip = () => {
  const navigate = useNavigate();
  const [uploadedImage, setUploadedImage] = useState<any>('/default.jpg');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tripTitle: "",
      destinationCountry: "",
      date: {
        from: new Date(),
        to: new Date(),
      },
      image: undefined,
    },
  });

  const handleFileUpload = (event: any) => {
    const file = event.target.files[0];
    if (!file) {
        return;
    }

    console.log(uploadedImage);

    if (file.size > MAX_FILE_SIZE) {
        toast.error("File is too large! 2MB Max.", { position: "bottom-right" });
        return;
    }

    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
        toast.error("Invalid file type!", { position: "bottom-right" })
        return;
    }
        
    form.setValue("image", file);
    setUploadedImage(URL.createObjectURL(file));
  }

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    console.log(data);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="main-form-container"
      >
        <h1 className="page-title">Add New Trip</h1>
        <div className="main-info-container">
          <div className="left-side-container">
            <FormField
              control={form.control}
              name="tripTitle"
              render={({ field }) => (
                <FormItem className="inputs">
                  <FormLabel>Trip Name</FormLabel>
                  <FormControl className="w-full mb-4">
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
                <FormItem className="inputs">
                  <FormLabel>Destination Country</FormLabel>
                  <FormControl className="w-full mb-4">
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
                <FormItem className="inputs">
                  <FormLabel>Trip Date Range</FormLabel>
                  <FormControl className="mb-4">
                    <DatePickerWithRange
                      field={field}
                      className="text-left font-normal"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="right-side-container">
            <div>
              <img
                src={uploadedImage}
                height={200}
                className="image"
                width={225}
              />
              <FormField
                control={form.control}
                name="image"
                render={() => {
                  return (
                    <FormItem className="upload-image-button">
                      <FormLabel>Change To New Image</FormLabel>
                      <FormControl>
                        <Input type="file" onChange={handleFileUpload} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
            </div>
          </div>
        </div>
        <div className="submit-buttons-container">
          <Button onClick={() => navigate(Paths.TRIPS)}>Cancel</Button>
          <Button type="submit">Submit</Button>
        </div>
      </form>
    </Form>
  );
};

export default CreateTrip;
