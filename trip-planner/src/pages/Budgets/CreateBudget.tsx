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

const CreateBudget = () => {
  const [selectedType, setSelectedType] = useState("0");
  const [value, setValue] = useState("EUR");
  const [searchTerm, setSearchTerm] = useState("");
  const [totalBudget, setTotalBudget] = useState<any>(0);
  const [isUnlimitedBudget, setIsUnlimitedBudget] = useState(false);

  useEffect(() => {
    console.log(isUnlimitedBudget);
  }, [isUnlimitedBudget]);

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
        id: "1",
        fullName: "Charlie Brown",
        email: 'charlie@example.com'
      }
    ]

    const travellerElements = travellers.map(traveller => (
      <div key={traveller.id} className="flex items-center space-x-4">
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
          <h3 className="font-semibold">{traveller.email}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">{traveller.fullName}</p>
        </div>
        <Input className="w-full" placeholder="Budget" type="number" />
        <Button className="ml-auto" size="sm">
          Remove
        </Button>
      </div>
    ));

    if (selectedType === SHARED_TYPE) {
      return (
        <div className="mt-2">
          <Label htmlFor="members">Assigned Members To Budget</Label>
          <div className="border rounded-lg p-4 flex flex-col items-between space-y-4 overflow-y-auto max-h-40 mt-2">
            {travellerElements}
          </div>
        </div>
      );
    } else if (selectedType === INDIVIDUAL_FIXED_AMOUNTS_TYPE) {
      return (
        <div>
          <Label htmlFor="amount">Amount</Label>
          <Input
            id="amount"
            type="number"
            placeholder="Budget amount"
            required
          />
          <Label htmlFor="members">Members</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select members" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Member 1</SelectItem>
              <SelectItem value="2">Member 2</SelectItem>
              <SelectItem value="3">Member 3</SelectItem>
            </SelectContent>
          </Select>
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
        <div className="mt-2">
          <Label>Main Currency</Label>
          <CurrencySelector
            value={value}
            setValue={setValue}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
        </div>
        {!isUnlimitedBudget && (
          <div className="mt-2">
            <Label>Budget Amount</Label>
            <CurrencyInput
              className="create-edit-budget-currency-input"
              id="input-example"
              name="input-name"
              placeholder="Please enter a number"
              suffix={` ${value}`}
              value={totalBudget}
              allowNegativeValue={false}
              decimalsLimit={2}
              onValueChange={(value, name, values) =>
                setTotalBudget(values?.float)
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
