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
import { CirclePlus, CircleX } from "lucide-react"
import { useNavigate } from "react-router-dom"
import Paths from "@/routes/Paths"
import DeleteDialog from "@/components/Extra/DeleteDialog"
import { checkTokenValidity } from "@/utils/jwtUtils"
import { refreshAccessToken } from "@/services/AuthenticationService"
import { toast } from "sonner"
import { useUser } from "@/providers/user-provider/UserContext"
import "../Notifications/styles/notification-list.css";
import { addTripToTripDetail, deleteTripDetail } from "@/services/TripDetailService"
import AddUnselectedDetailToTripDialog from "./AddUnselectedDetailToTripDialog"
 
export type Notification = {
  id: string
  name: string
  address: string,
  website: string,
  phoneNumber: string,
}
 
export function UnselectedTripDetailsList({ data, availableTrips, onPlanChange } : any) {
  const columns: ColumnDef<Notification>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              className="p-0"
            >
              Name
              <CaretSortIcon className="ml-2 h-4 w-4" />
            </Button>
          )
        },
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("name")}</div>
      ),
    },
    {
      accessorKey: "address",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="p-0"
          >
            Address
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => <div className="break-words overflow-auto max-w-[600px]">{row.getValue("address")}</div>,
    },
    {
      accessorKey: "website",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="p-0"
          >
            Website
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => <div className="break-words overflow-auto max-w-[600px]">{row.getValue("website")}</div>,
    },
    {
      accessorKey: "phoneNumber",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="p-0"
          >
            Phone Number
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => <div className="break-words overflow-auto max-w-[600px]">{row.getValue("phoneNumber")}</div>,
    },
    {
      id: "actions",
      header: () => "Actions",
      cell: ({ row }) => {
        const [isMenuOpen, setIsMenuOpen] = React.useState(false);
        const [isLoading, setIsLoading] = React.useState(false);
        const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
        const [isAddToTripDialogOpen, setIsAddToTripDialogOpen] = React.useState(false);
        const [isAddSubmitting, setIsAddSubmitting] = React.useState(false);
        const { changeUserInformationToLoggedIn, changeUserInformationToLoggedOut } = useUser();
        const navigate = useNavigate();
  
        const handleAccessToken = async () => {
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
        }

        const handleAccept = async (newDate : any, tripId : any) => {
            await handleAccessToken();

            const dtoToSend = {
              id: data[row.index].id,
              tripId,
              startDate: newDate
            }

            const response = await addTripToTripDetail(dtoToSend);
            if (!response.ok) {
              toast.error(`Failed to add plan to trip`, {
                position: 'top-center'
              });
              setIsAddSubmitting(false);
              return;
            }

            toast.success(`Plan was successfully added to trip`, {
              position: 'top-center'
            });
            onPlanChange(row.index);
        }

        const handleReject = async () => {
          setIsLoading(true);

          await handleAccessToken();
          const response = await deleteTripDetail(data[row.index].id);
          if (!response.ok) {
            toast.error(`Failed to delete plan`, {
              position: 'top-center'
            });
            setIsLoading(false);
            return;
          }

          toast.success(`Plan was successfully deleted`, {
            position: 'top-center'
          });
          setIsLoading(false);
          onPlanChange(row.index);
        }
  
        const onDeleteDialogClose = () => {
          setIsMenuOpen(false);
          setIsDeleteDialogOpen(false);
        };
  
        return (
            <DropdownMenu
            open={isMenuOpen}
            onOpenChange={(isOpen) => setIsMenuOpen(isOpen)}
            modal={false}
          >
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <DotsHorizontalIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer"
                onSelect={(e) => e.preventDefault()}
                onClick={() => setIsAddToTripDialogOpen(true)}
              >
                <CirclePlus className="w-4 h-4 mr-2"/>
                Add To Trip
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={(e) => e.preventDefault()}
                onClick={() => setIsDeleteDialogOpen(true)}
                className="cursor-pointer"
              >
                <CircleX className="w-4 h-4 mr-2"/>
                Delete Plan
              </DropdownMenuItem>
              <DeleteDialog
                title="Delete Plan"
                description={`Are you sure you want to delete plan? This will permanently delete this plan.`}
                dialogButtonText="Delete"
                onDelete={handleReject}
                isLoading={isLoading}
                open={isDeleteDialogOpen}
                setOpen={onDeleteDialogClose}
              />
              <AddUnselectedDetailToTripDialog
                open={isAddToTripDialogOpen}
                setOpen={setIsAddToTripDialogOpen}
                trips={availableTrips}
                onSubmit={handleAccept}
                isLoading={isAddSubmitting}
              />
            </DropdownMenuContent>
          </DropdownMenu>
        );
      }
    },
  ]

  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([
    { id: 'name', value: '' },
  ]);

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
          { id: 'name', value },
      ];
      setColumnFilters(updatedFilters);
  };

  return (
    <div className="w-full">
      <h1 className="my-4 font-bold text-4xl">Your Plans</h1>
      <div className="flex items-center py-4">
        <Input
            placeholder="Filter by Name"
            value={combinedFilterValue}
            onChange={handleCombinedFilterChange}
            className="max-w-sm mr-2"
        />
        <div className="ml-auto flex items-end">
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
                  No plans found.
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