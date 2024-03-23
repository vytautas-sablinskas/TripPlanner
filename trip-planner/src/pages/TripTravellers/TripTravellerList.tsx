import * as React from "react"
import {
  CaretSortIcon,
  ChevronDownIcon,
  DotsHorizontalIcon,
} from "@radix-ui/react-icons"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
 
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { CirclePlus, CircleX, Pencil } from "lucide-react"
import { useLocation, useNavigate } from "react-router-dom"
import Paths from "@/routes/Paths"
 
export type Payment = {
  permissions: number
  status: number
  fullName: string
  email: string
}

const getPermissionName = (permission : number) => {
    switch(permission) {
        case 0:
            return "View Only";
        case 1:
            return "View and Edit Plans";
        case 2:
            return "Trip Administrator";
        default:
            return "Unknown Permission";
    }
}

const getStatusName = (status : number) => {
    switch(status) {
        case 0:
            return "Joined";
        case 1:
            return "Invited";
        default:
            return "Unknown Permission";
    }
}
 
const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: "fullName",
    header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="p-0"
          >
            Traveller Full Name
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        )
      },
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("fullName")}</div>
    ),
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="p-0"
        >
          Email
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className="lowercase">{row.getValue("email")}</div>,
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
        return (
        <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="p-0"
          >
          Status
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
        )
      },
    cell: ({ row }) => {
      return <div className="text-left font-medium">{getStatusName(row.getValue("status"))}</div>
    },
  },
  {
    accessorKey: "permissions",
    header: ({ column }) => {
        return (
        <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="p-0"
          >
          Permissions
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
        )
      },
    cell: ({ row }) => {
      return <div className="text-left font-medium">{getPermissionName(row.getValue("permissions"))}</div>
    },
  },
  {
    id: "actions",
    header: () => "Actions",
    cell: () => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <DotsHorizontalIcon className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
                <Pencil className="w-4 h-4 mr-2" />
                Edit Permissions
            </DropdownMenuItem>
            <DropdownMenuItem>
                <CircleX className="w-4 h-4 mr-2"/>
                Remove Traveller
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
 
export function TripTravellerList({ data } : any) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([
    { id: 'fullName', value: '' },
    { id: 'email', value: '' },
  ]);

  const location = useLocation();
  const navigate = useNavigate();

  const getTripId = () => {
    const path = location.pathname.split("/");
    return path[path.length - 2];
  };
  
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
 
  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })
 
  function formatColumn(column : string) {
    var words = column.split(/(?=[A-Z])/);
    
    var formattedColumn = words.map(function(word, index) {
        if (index === 0) {
            return word;
        }

        return word.charAt(0).toUpperCase() + word.slice(1);
    }).join(' ');
    
    return formattedColumn;
  }

  const [combinedFilterValue, setCombinedFilterValue] = React.useState<string>("");

  const handleCombinedFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setCombinedFilterValue(value);
      const updatedFilters = [
          { id: 'fullName', value },
          { id: 'email', value },
      ];
      setColumnFilters(updatedFilters);
  };

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
            placeholder="Filter emails or full names..."
            value={combinedFilterValue}
            onChange={handleCombinedFilterChange}
            className="max-w-sm"
        />
        <div className="ml-auto flex items-end">
            <Button variant="outline" className="mr-4" onClick={() => navigate(Paths.TRIP_TRAVELLERS_CREATE.replace(":tripId", getTripId()))}>
                <CirclePlus className="w-4 h-4 mr-2"/>
                Add Traveller
            </Button>
            <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline">
                Columns <ChevronDownIcon className="ml-2 h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                    return (
                    <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                        }
                    >
                        {formatColumn(column.id)}
                    </DropdownMenuCheckboxItem>
                    )
                })}
            </DropdownMenuContent>
            </DropdownMenu>
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}