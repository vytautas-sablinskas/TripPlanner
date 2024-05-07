import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";
  import "./styles/CreateEditBudget.css";
  import { Label } from "@/components/ui/label";
  import BudgetTypes from "./BudgetTypes";
  import { Input } from "@/components/ui/input";
  import { Textarea } from "@/components/ui/textarea";
  import { useEffect, useState } from "react";
  import { CurrencySelector } from "./CurrencySelector";
  import { Checkbox } from "@/components/ui/checkbox";
  import CurrencyInput from "react-currency-input-field";
  import { Button } from "@/components/ui/button";
  import MultipleSelector from "@/components/ui/multiple-selector";
  import { useForm } from "react-hook-form";
  import { z } from "zod";
  import { zodResolver } from "@hookform/resolvers/zod";
  import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "@/components/ui/form";
  import { editTripBudget, getTripBudgetEditInfo } from "@/services/TripBudgetsService";
  import { checkTokenValidity } from "@/utils/jwtUtils";
  import { refreshAccessToken } from "@/services/AuthenticationService";
  import { toast } from "sonner";
  import { useUser } from "@/providers/user-provider/UserContext";
  import { useNavigate } from "react-router-dom";
  import Paths from "@/routes/Paths";
  import { CreateEditLoadingButton } from "@/components/Extra/LoadingButton";
  
  const formSchema = z.object({
    type: z.string().optional(),
    name: z.string().min(1, {
      message: "Budget name is required.",
    }),
    description: z.string().optional(),
    unlimitedBudget: z.boolean().optional(),
    mainCurrency: z.string().optional(),
    budgetAmount: z.string().optional(),
    members: z.array(z.string()).optional(),
  });
  
  const EditBudget = () => {
    const [selectedType, setSelectedType] = useState("0");
    const [value, setValue] = useState("EUR");
    const [searchTerm, setSearchTerm] = useState("");
    const [totalBudget, setTotalBudget] = useState<any>(0);
    const [isUnlimitedBudget, setIsUnlimitedBudget] = useState(false);
    const [selectedMembers, setSelectedMembers] = useState<any>([]);
    const [selectedMemberBudgets, setSelectedMemberBudgets] = useState<any>([]);
    const [loading, setLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { changeUserInformationToLoggedIn, changeUserInformationToLoggedOut, isAuthenticated } =
      useUser();
    const navigate = useNavigate();
    const [travellers, setTravellers] = useState<any>([]);
  
    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        type: "0",
        name: "",
        description: "",
        unlimitedBudget: false,
        mainCurrency: "EUR",
        budgetAmount: "0",
        members: [],
      },
    });
  
    const getTripId = () => {
      const paths = location.pathname.split("/");
      return paths[paths.length - 4];
    };

    const getBudgetId = () => {
        const paths = location.pathname.split("/");
        return paths[paths.length - 2];
      };
  
    useEffect(() => {
      const fetchTravellers = async () => {
        setLoading(true);
        const accessToken = localStorage.getItem("accessToken");
  
        if (!checkTokenValidity(accessToken || "")) {
          const result = await refreshAccessToken();
          if (!result.success) {
            toast.error("Session has expired. Login again!", {
              position: "top-center",
            });
  
            changeUserInformationToLoggedOut();
            navigate(Paths.LOGIN);
            return;
          }
  
          changeUserInformationToLoggedIn(
            result.data.accessToken,
            result.data.refreshToken,
            result.data.id
          );
        }
  
        const response = await getTripBudgetEditInfo(getTripId(), getBudgetId());
        if (!response.ok) {
          toast.error("Unexpected error. Try refreshing page", {
            position: "top-center",
          });
          return;
        }
  
        const data = await response.json();
        setSelectedType(data.type.toString());
        form.setValue("name", data.name);
        form.setValue("description", data.description);
        form.setValue("unlimitedBudget", data.unlimitedBudget);
        form.setValue("mainCurrency", data.mainCurrency);
        setTotalBudget(data.amount);
        setIsUnlimitedBudget(data.unlimitedBudget);
        setValue(data.mainCurrency);
        setTravellers(data.tripTravellers);
        const memberBudgets = data.budgetMembers.reduce((acc : any, member : any) => {
          acc[member.email] = member.amount.toString();
          return acc;
        }, {});
        setSelectedMemberBudgets(memberBudgets);
        setSelectedMembers(data.budgetMembers.map((member: any) => ({
          label: `${member.fullName} - ${member.email}`,
          value: member.email,
        })));

        setLoading(false);
      };

      if (!isAuthenticated) {
        navigate(Paths.LOGIN);
        return;
      }
  
      fetchTravellers();
    }, []);
  
    useEffect(() => {
      if (selectedType !== "2") {
        return;
      }
  
      let sum = 0;
      Object.keys(selectedMemberBudgets).forEach((key: any) => {
        if (selectedMembers.find((member: any) => member.value === key)) {
          const value = selectedMemberBudgets[key];
          sum += value ? Number(value) : 0;
        }
      });
  
      setTotalBudget(sum.toFixed(2));
    }, [selectedMemberBudgets, selectedMembers]);
  
    const getSelectedTypeInputs = () => {
      const SHARED_TYPE = "1";
      const INDIVIDUAL_FIXED_AMOUNTS_TYPE = "2";
  
      const travellerElements = selectedMembers.map(
        (member: any, index: number) => {
          const traveller = travellers.find(
            (traveller: any) => traveller.email === member.value
          );
          if (traveller) {
            return (
              <div
                key={traveller.id + "-traveller-" + index}
                className="flex items-center space-x-4 w-full"
              >
                <img
                  alt="Avatar"
                  className="rounded-lg traveller-element-image"
                  height="40"
                  src={traveller.photo || "/avatar-placeholder.png"}
                  style={{
                    aspectRatio: "40/40",
                    objectFit: "cover",
                  }}
                  width="40"
                />
                <div className="space-y-1 w-full flex-grow">
                  <h3 className="font-semibold">{traveller.email}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {traveller.fullName}
                  </p>
                </div>
                {selectedType === INDIVIDUAL_FIXED_AMOUNTS_TYPE && (
                  <CurrencyInput
                    className="create-edit-budget-currency-input"
                    decimalSeparator="."
                    placeholder="Please enter a number"
                    step={1}
                    prefix={`${value} `}
                    value={selectedMemberBudgets[traveller.email]}
                    allowNegativeValue={false}
                    allowDecimals={true}
                    onValueChange={(value, _name, _values) => {
                      console.log(selectedMemberBudgets[traveller.email]);
                      const updatedBudgets = {
                        ...selectedMemberBudgets,
                        [traveller.email]: value && Number(value) > 100000 ? 100000 : value,
                      };
  
                      setSelectedMemberBudgets(updatedBudgets);
                    }}
                  />
                )}
                <Button
                  className="ml-auto trip-element-remove-button"
                  size="sm"
                  onClick={() =>
                    setSelectedMembers((prev: any) =>
                      prev.filter((prevMember: any) => prevMember !== member)
                    )
                  }
                >
                  Remove
                </Button>
              </div>
            );
          }
  
          return null;
        }
      );
  
      if (
        selectedType === SHARED_TYPE ||
        selectedType === INDIVIDUAL_FIXED_AMOUNTS_TYPE
      ) {
        return (
          <div className="mt-2">
            <Label htmlFor="members">Assign Members To Budget</Label>
            <MultipleSelector
              value={selectedMembers}
              onChange={setSelectedMembers}
              defaultOptions={travellers.map((traveller: any) => ({
                label: `${traveller.fullName} - ${traveller.email}`,
                value: traveller.email,
              }))}
              placeholder="Select members to add"
            />
            {travellerElements?.length > 0 && (
              <div className="border rounded-lg p-4 flex flex-col items-between space-y-4 overflow-y-auto max-h-40 mt-2">
                {travellerElements}
              </div>
            )}
          </div>
        );
      }
  
      return null;
    };
  
    const onSubmit = async (formValues: any) => {
      const newBudget = isUnlimitedBudget ? 0 : Number(totalBudget);
      
      const actualValues = {
        type: Number(selectedType),
        name: formValues.name,
        description: formValues.description,
        mainCurrency: value,
        budget: newBudget,
        unlimitedAmount: isUnlimitedBudget,
        members: selectedMembers.map((member: any) => {
          return {
            email: member.value,
            amount: Number(selectedMemberBudgets[member.value]) || 0,
          };
        }),
      };

      console.log(actualValues);
  
      if (actualValues.budget === 0 && !isUnlimitedBudget) {
        form.setError("budgetAmount", {
          message: "Budget amount must be greater than 0",
        });
        return;
      }
  
      if (
        actualValues.type === 2 &&
        actualValues.members.find((member: any) => member.amount === 0)
      ) {
        toast.error(
          "Remove members with budget equal to 0 or change budget amount",
          {
            position: "top-center",
          }
        );
        return;
      }
  
      setIsSubmitting(true);
      const accessToken = localStorage.getItem("accessToken");
  
      if (!checkTokenValidity(accessToken || "")) {
        const result = await refreshAccessToken();
        if (!result.success) {
          toast.error("Session has expired. Login again!", {
            position: "top-center",
          });
  
          changeUserInformationToLoggedOut();
          navigate(Paths.LOGIN);
          return;
        }
  
        changeUserInformationToLoggedIn(
          result.data.accessToken,
          result.data.refreshToken,
          result.data.id
        );
      }
  
      const response = await editTripBudget(getTripId(), getBudgetId(), actualValues);
      if (!response.ok) {
        toast.error("Failed to edit budget. Try again later", {
          position: "top-center",
        });
        setIsSubmitting(false);
        return;
      }
  
      toast.success("Budget edited successfully!", {
        position: "top-center",
      });
      navigate(Paths.BUDGETS.replace(":tripId", getTripId()));
    };
  
    if (loading) {
      return <div>Loading</div>;
    }
  
    return (
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="create-edit-budget-main-container"
        >
          <Card>
            <CardHeader className="pb-0">
              <CardTitle className="text-2xl">Budget Edit</CardTitle>
              <CardDescription>
                Create a new budget and assign members.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="type"
                render={() => (
                  <FormItem className="mt-4">
                    <FormLabel>Type</FormLabel>
                    <FormControl className="create-edit-select">
                      <Input disabled value={Object.values(BudgetTypes)[Number(selectedType)].value} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="mt-2">
                    <FormLabel required>Name</FormLabel>
                    <FormControl>
                      <Input id="name" placeholder=" dget name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="mt-2">
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        id="description"
                        placeholder="Budget description"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              {selectedType !== "2" && (
                <div className="items-top flex space-x-2">
                  <div className="mt-4 mb-4">
                    <div className="grid grid-cols-auto-1 gap-3 items-center leading-none">
                      <div className="flex items-center">
                        <label
                          htmlFor="unlimitedBudget"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center"
                        >
                          <Checkbox
                            id="unlimitedBudget"
                            className="mr-2"
                            checked={isUnlimitedBudget}
                            onCheckedChange={(checked) =>
                              setIsUnlimitedBudget(Boolean(checked))
                            }
                          />
                          <span>Unlimited Budget</span>
                        </label>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Budget will not have a set amount.
                      </p>
                    </div>
                  </div>
                </div>
              )}
  
              <div className="mt-2">
                <Label>Main Currency</Label>
                <CurrencySelector
                  value={value}
                  setValue={setValue}
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                />
              </div>
              {(!isUnlimitedBudget || selectedType === "2") && (
                <FormField
                  name="budgetAmount"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="mt-2">
                      <FormLabel required>Budget Amount</FormLabel>
                      <CurrencyInput
                        disabled={selectedType === "2"}
                        className="create-edit-budget-currency-input"
                        id="input-example"
                        name="input-name"
                        placeholder="Please enter a number"
                        prefix={`${value} `}
                        value={totalBudget}
                        allowNegativeValue={false}
                        decimalsLimit={2}
                        onValueChange={(value, _name, _values) =>
                          setTotalBudget(
                            value && Number(value) > 100000 ? 100000 : value ?? 0
                          )
                        }
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              {getSelectedTypeInputs()}
              <CreateEditLoadingButton className="mt-4 w-full" text="Edit Budget" loading={isSubmitting}/>
            </CardContent>
          </Card>
        </form>
      </Form>
    );
  };
  
  export default EditBudget;
  