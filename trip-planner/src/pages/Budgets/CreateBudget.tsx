import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import "./styles/CreateEditBudget.css";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import BudgetTypes from "./BudgetTypes";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
import { CurrencySelector } from "./CurrencySelector";
import { Checkbox } from "@/components/ui/checkbox";
import CurrencyInput from "react-currency-input-field";
import { Button } from "@/components/ui/button";
import MultipleSelector from "@/components/ui/multiple-selector";

const CreateBudget = () => {
  const [selectedType, setSelectedType] = useState("0");
  const [value, setValue] = useState("EUR");
  const [searchTerm, setSearchTerm] = useState("");
  const [totalBudget, setTotalBudget] = useState<any>(0);
  const [isUnlimitedBudget, setIsUnlimitedBudget] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState<any>([]);
  const [selectedMemberBudgets, setSelectedMemberBudgets] = useState<any>([]);

  useEffect(() => {
    let sum = 0;
    Object.keys(selectedMemberBudgets).forEach((key: any) => {
      if (selectedMembers.find((member: any) => member.value === key)) {
        sum += Number(selectedMemberBudgets[key]);
      }
    });

    setTotalBudget(sum.toFixed(2));
  }, [selectedMemberBudgets, selectedMembers]);

  useEffect(() => {
    setSelectedMemberBudgets([]);
    setSelectedMembers([]);
    setTotalBudget(0);
  }, [selectedType]);

  const getSelectedTypeInputs = () => {
    const SHARED_TYPE = "1";
    const INDIVIDUAL_FIXED_AMOUNTS_TYPE = "2";

    const travellers = [
      {
        id: "1",
        fullName: "Alice Johnson",
        email: 'alice@example.com'
      },
      {
        id: "2",
        fullName: "Bob Smith",
        email: 'bob@example.com'
      },
      {
        id: "3",
        fullName: "Charlie Brown",
        email: 'charlie@example.com'
      }
    ]

  const travellerElements = selectedMembers.map((member: any, index: number) => {
  const traveller = travellers.find(traveller => traveller.email === member.value);
  if (traveller) {
        return (
          <div key={traveller.id + "-traveller-" + index} className="flex items-center space-x-4 w-full">
            <img
              alt="Avatar"
              className="rounded-lg traveller-element-image"
              height="40"
              src="/avatar-placeholder.png"
              style={{
                aspectRatio: "40/40",
                objectFit: "cover",
              }}
              width="40"
            />
            <div className="space-y-1 w-full flex-grow">
              <h3 className="font-semibold">{traveller.email}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{traveller.fullName}</p>
            </div>
            {selectedType === INDIVIDUAL_FIXED_AMOUNTS_TYPE && (
              <CurrencyInput
                className="create-edit-budget-currency-input"
                decimalSeparator="."
                placeholder="Please enter a number"
                suffix={` ${value}`}
                step={1}
                value={selectedMemberBudgets[traveller.email] || 0}
                allowNegativeValue={false}
                allowDecimals={true}
                onValueChange={(value, _name, _values) => {
                  const updatedBudgets = {
                    ...selectedMemberBudgets,
                    [traveller.email]: value
                  };

                  setSelectedMemberBudgets(updatedBudgets);
                }}
              />
            )}
            <Button className="ml-auto trip-element-remove-button" size="sm" onClick={() => setSelectedMembers((prev : any) => prev.filter((prevMember : any) => prevMember !== member))}>
              Remove
            </Button>
          </div>
        );
      } 

      return null;
    });

    if (selectedType === SHARED_TYPE || selectedType === INDIVIDUAL_FIXED_AMOUNTS_TYPE) {
      return (
        <div className="mt-2">
          <Label htmlFor="members">Assign Members To Budget</Label>
          <MultipleSelector 
            value={selectedMembers}
            onChange={setSelectedMembers}
            defaultOptions = {travellers.map(traveller => ({
              label: `${traveller.fullName} - ${traveller.email}`,
              value: traveller.email
            }))}
            placeholder="Select members to add"
          />
          {travellerElements?.length > 0 && (
            <div className="border rounded-lg p-4 flex flex-col items-between space-y-4 overflow-y-auto max-h-40 mt-2 overflow-x-scroll">
              {travellerElements}
            </div>
          )}
        </div>
      );
    }

    return null;
  };

  return (
    <Card className="create-edit-budget-main-container">
      <CardHeader className="pb-0">
        <CardTitle className="text-2xl">Budget Creation</CardTitle>
        <CardDescription>
          Create a new budget and assign members.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="create-edit-select">
          <Label htmlFor="type">Type</Label>
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger>
              <SelectValue placeholder="Select budget type" />
            </SelectTrigger>
            <SelectContent>
              {BudgetTypes.map((type) => (
                <SelectItem key={type.key} value={String(type.key)}>
                  {type.value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="mt-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" placeholder="Budget name" required />
        </div>
        <div className="mt-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            placeholder="Budget description"
            required
          />
        </div>
        { selectedType !== "2" && (
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
          <div className="mt-2">
            <Label>Budget Amount</Label>
            <CurrencyInput
              disabled={selectedType === "2"}
              className="create-edit-budget-currency-input"
              id="input-example"
              name="input-name"
              placeholder="Please enter a number"
              suffix={` ${value}`}
              value={totalBudget}
              allowNegativeValue={false}
              decimalsLimit={2}
              onValueChange={(value, _name, _values) =>
                setTotalBudget(value)
              }
            />
          </div>
        )}
        {getSelectedTypeInputs()}
        <Button className="mt-4 w-full">Create Budget</Button>
      </CardContent>
    </Card>
  );
};

export default CreateBudget;
