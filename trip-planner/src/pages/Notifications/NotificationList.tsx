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
import { refreshAccessToken } from "@/api/AuthenticationService"
import { toast } from "sonner"
import { useUser } from "@/providers/user-provider/UserContext"
import { changeInvitationStatus } from "@/api/NotificationService"
import "./styles/notification-list.css";
 
export type Notification = {
  id: string
  title: string
  message: string
  status: number
}
 
export function NotificationList({ data, onStatusChange } : any) {
  const columns: ColumnDef<Notification>[] = [
    {
      accessorKey: "title",
      header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              className="p-0"
            >
              Information
              <CaretSortIcon className="ml-2 h-4 w-4" />
            </Button>
          )
        },
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("title")}</div>
      ),
    },
    {
      accessorKey: "message",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="p-0"
          >
            Message
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => <div className="break-words overflow-auto max-w-[600px]">{row.getValue("message")}</div>,
    },
    {
      id: "actions",
      header: () => "Actions",
      cell: ({ row }) => {
        const [isMenuOpen, setIsMenuOpen] = React.useState(false);
        const [isLoading, setIsLoading] = React.useState(false);
        const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
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
                  result.data.refreshToken
              );
          }
        }

        const handleAccept = async () => {
            await handleAccessToken();

            console.log(data[row.index])
            console.log({ status: 1 });
            const response = await changeInvitationStatus(data[row.index].id, { status: 0 })
            if (!response.ok) {
               toast.error("Unexpected error. Try refreshing page!");
               setIsLoading(false)
               return;
            }

            navigate(Paths.TRIPS);
            onStatusChange(row.index);
        }

        const handleReject = async () => {
          setIsLoading(true);
          await handleAccessToken();

          console.log(data[row.index].id)
          console.log({ status: 1 });
          const response = await changeInvitationStatus(data[row.index].id, { status: 1 })
          if (!response.ok) {
            toast.error("Unexpected error. Try refreshing page!");
            setIsLoading(false)
            return;
          }
          console.log(response);

          toast.success(`Notification was successfully deleted`, {
            position: 'top-center'
          });

          setIsLoading(false);
          onStatusChange(row.index);
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
                onClick={handleAccept}
              >
                <CirclePlus className="w-4 h-4 mr-2"/>
                Accept Invitation
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={(e) => e.preventDefault()}
                onClick={() => setIsDeleteDialogOpen(true)}
                className="cursor-pointer"
              >
                <CircleX className="w-4 h-4 mr-2"/>
                Reject Invitation
              </DropdownMenuItem>
              <DeleteDialog
                title="Delete Trip Invitation"
                description={`Are you sure you want to reject this trip invitation? This will permanently delete this notification and its contents.`}
                dialogButtonText="Delete"
                onDelete={handleReject}
                isLoading={isLoading}
                open={isDeleteDialogOpen}
                setOpen={onDeleteDialogClose}
              />
            </DropdownMenuContent>
          </DropdownMenu>
        );
      }
    },
  ]

  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([
    { id: 'title', value: '' },
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
          { id: 'title', value },
      ];
      setColumnFilters(updatedFilters);
  };

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
            placeholder="Filter by Information"
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
                  No notifications.
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