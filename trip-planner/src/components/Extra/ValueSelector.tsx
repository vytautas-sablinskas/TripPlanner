import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function ValueSelector({
  value,
  setValue,
  placeholder,
  label,
  items,
  className,
}: any) {
  return (
    <Select defaultValue={value} onValueChange={setValue}>
      <SelectTrigger className={className || "w-full"}>
        <SelectValue placeholder={placeholder || "Select Value"} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>{label}</SelectLabel>
          {items.map((item: any, index: any) => (
            <SelectItem key={index} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
