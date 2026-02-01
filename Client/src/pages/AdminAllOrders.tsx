import { useState, useEffect } from "react";

import {
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable,
  flexRender,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { MoreHorizontal, ArrowUpDown, ChevronDown, Phone, Download } from "lucide-react";
import AdminSidebarLayout from "@/components/AdminSidebarLayout";
import { useAuth } from "@/context/AuthContext";
import Api from "@/lib/Api";
import toast from "react-hot-toast";
import { ButtonLoading } from "@/components/ui/ButtonLoading";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import AdminDataTableSkeleton from "@/components/AdminDataTableSkeleton";




const mockOrders = [
  {
    id: 1001,
    user: {
      id: 1,
      name: "John Doe",
      phone : "0796528894",
      email: "john.doe@example.com"
    },
    totalPrice: 299.99,
    status: "pending",
    createdAt: "2026-01-28T10:30:00Z",
    orderItems: [
      {
        id: 1,
        quantity: 2,
        product: {
          id: 101,
          name: "Nike Air Max 2024",
          price: 149.99,
          image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400"
        }
      } ,
       {
        id: 2,
        quantity: 1,
        product: {
          id: 102,
          name: "Adidas Ultra Boost",
          price: 189.50,
          image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400"
        }
      },
       {
        id: 3,
        quantity: 1,
        product: {
          id: 103,
          name: "Puma RS-X Sneakers",
          price: 120.00,
          image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400"
        }
      },
     
    ]
  },

];

export default function AdminAllOrders() {
  const [data, setData] = useState(mockOrders);
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      // Uncomment to use real API
      // await Api.patch(`/order/${orderId}`, { status: newStatus });
      
      // Update mock data
      setData(prevData => 
        prevData.map(order => 
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
      toast.success("Order status updated successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update status");
    }
  };

  const deleteOrder = async (orderId) => {
    try {
      // Uncomment to use real API
      // await Api.delete(`/order/${orderId}`);
      
      // Update mock data
      setData(prevData => prevData.filter(order => order.id !== orderId));
      toast.success("Order deleted successfully");
      setDialogOpen(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete order");
    }
  }

  const exportToExcel = () => {
    try {
      // Prepare data for export
      const exportData = data.map(order => ({
        'Order ID': order.id,
        'Customer Name': order.user?.name || 'N/A',
        'Customer Email': order.user?.email || 'N/A',
        'Total Price': `$${order.totalPrice.toFixed(2)}`,
        'Status': order.status.charAt(0).toUpperCase() + order.status.slice(1),
        'Order Date': new Date(order.createdAt).toLocaleString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        'Items Count': order.orderItems?.length || 0,
        'Products': order.orderItems?.map(item => 
          `${item.product?.name || 'Unknown'} (x${item.quantity})`
        ).join(', ') || 'N/A'
      }));

      // Convert to CSV
      const headers = Object.keys(exportData[0]);
      const csvContent = [
        headers.join(','),
        ...exportData.map(row => 
          headers.map(header => {
            const value = row[header];
            // Escape commas and quotes
            return typeof value === 'string' && (value.includes(',') || value.includes('"'))
              ? `"${value.replace(/"/g, '""')}"`
              : value;
          }).join(',')
        )
      ].join('\n');

      // Create blob and download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `orders_export_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success('Orders exported successfully!');
    } catch (error) {
      toast.error('Failed to export orders');
      console.error('Export error:', error);
    }
  };

  const fetchOrders = async () => {
    setLoading(true);
    try {
      // Uncomment below to use real API
      // const { data } = await Api.get("/order/all");
      // setData(data.orders);
      
      // Simulate API delay with mock data
      setTimeout(() => {
        setData(mockOrders);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    // Using mock data directly, no need to fetch
    // fetchOrders();
  }, []);

  const { user } = useAuth();
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});

  const columns = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "id",
      header: "ID",
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("id")}</div>
      ),
    },
    {
      id: "userName",
      header: "User",
      accessorFn: (row) => row.user?.name,
      cell: ({ row }) => (
        <div className="font-medium">{row.original.user?.name}</div>
      ),
    },
    {
      accessorKey: "totalPrice",
      header: "Total",
      cell: ({ row }) => (
        <div className="font-medium">
          {row.getValue("totalPrice").toFixed(2)}
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const order = row.original;
        const status = order.status;
        
        const getStatusStyle = (status) => {
          switch(status) {
            case 'delivered':
              return 'bg-green-500/10 text-green-600 hover:bg-green-500/20 dark:bg-green-500/20 dark:text-green-400';
            case 'shipped':
              return 'bg-blue-500/10 text-blue-600 hover:bg-blue-500/20 dark:bg-blue-500/20 dark:text-blue-400';
            case 'processing':
              return 'bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500/20 dark:bg-yellow-500/20 dark:text-yellow-400';
            case 'cancelled':
              return 'bg-red-500/10 text-red-600 hover:bg-red-500/20 dark:bg-red-500/20 dark:text-red-400';
            case 'pending':
            default:
              return 'bg-gray-500/10 text-gray-600 hover:bg-gray-500/20 dark:bg-gray-500/20 dark:text-gray-400';
          }
        };

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 px-2">
                <span className={`cursor-pointer text-xs px-2 py-1 rounded-full ${getStatusStyle(status)}`}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Change Status</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleStatusChange(order.id, 'pending')}>
                <span className="text-xs px-2 py-1 rounded-full bg-gray-500/10 text-gray-600 dark:bg-gray-500/20 dark:text-gray-400">
                  Pending
                </span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleStatusChange(order.id, 'processing')}>
                <span className="text-xs px-2 py-1 rounded-full bg-yellow-500/10 text-yellow-600 dark:bg-yellow-500/20 dark:text-yellow-400">
                  Processing
                </span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleStatusChange(order.id, 'shipped')}>
                <span className="text-xs px-2 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400">
                  Shipped
                </span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleStatusChange(order.id, 'delivered')}>
                <span className="text-xs px-2 py-1 rounded-full bg-green-500/10 text-green-600 dark:bg-green-500/20 dark:text-green-400">
                  Delivered
                </span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleStatusChange(order.id, 'cancelled')}>
                <span className="text-xs px-2 py-1 rounded-full bg-red-500/10 text-red-600 dark:bg-red-500/20 dark:text-red-400">
                  Cancelled
                </span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "Date",
      cell: ({ row }) => (
        <div>{new Date(row.getValue("createdAt")).toLocaleDateString()}</div>
      ),
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const order = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  setSelectedOrder(order);
                  setDialogOpen(true);
                }}
              >
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-600 cursor-pointer"
                onClick={() => {
                  deleteOrder(order.id);                  
                }}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <AdminSidebarLayout breadcrumbTitle="Orders">
      <h1 className="text-2xl font-bold">Orders</h1>
      <p className="text-gray-700 dark:text-gray-400 mb-4">
        View & Track All User Orders.
      </p>
      <div className="w-full">
        <div className="flex items-center justify-between py-4">
          <Input
            placeholder="Search By Username.."
            value={table.getColumn("userName")?.getFilterValue() ?? ""}
            onChange={(event) =>
              table.getColumn("userName")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
          <div className="flex items-center justify-between gap-3">

          <Button 
            variant="primary" 
            size="sm"
            onClick={exportToExcel}
            className="ml-auto"
          >
            <Download className="mr-2 h-4 w-4" />
            Export to Excel
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Columns <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {loading ? (
                <AdminDataTableSkeleton />
              ) : table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
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

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Order #{selectedOrder?.id}</DialogTitle>
              <DialogDescription>
                Order placed on {selectedOrder?.createdAt && new Date(selectedOrder.createdAt).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </DialogDescription>
            </DialogHeader>

            {/* Customer Information */}
            <div className="bg-muted/50 rounded-lg p-4 space-y-2">
              <h3 className="font-semibold text-sm">Customer Information</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-muted-foreground">Name</p>
                  <p className="font-medium">{selectedOrder?.user?.name}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Email</p>
                  <p className="font-medium">{selectedOrder?.user?.email}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Email</p>
                  <p className="font-medium">{selectedOrder?.user?.email}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Phone</p>
                  <p className="font-medium">{selectedOrder?.user?.phone}</p>
                </div>
              </div>
              <div className="pt-2">
                <p className="text-muted-foreground text-sm">Status</p>
                <span className={`inline-block text-xs px-3 py-1 rounded-full mt-1 ${
                  selectedOrder?.status === 'delivered' 
                    ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                    : selectedOrder?.status === 'shipped'
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                    : selectedOrder?.status === 'processing'
                    ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
                    : selectedOrder?.status === 'cancelled'
                    ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                    : 'bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300'
                }`}>
                  {selectedOrder?.status?.toUpperCase()}
                </span>
              </div>
            </div>

            {/* Order Items */}
            <div className="mt-4">
              <h3 className="font-semibold text-sm mb-3">Order Items</h3>
              <div className="space-y-3">
                {selectedOrder?.orderItems?.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-4 border rounded-lg p-3"
                  >
                    {item.product ? (
                      <>
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div className="flex-1">
                          <p className="font-medium">{item.product.name}</p>
                          <p className="text-sm text-muted-foreground">
                            ${item.product.price.toFixed(2)} x {item.quantity}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">
                            ${(item.product.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </>
                    ) : (
                      <div className="text-sm text-muted-foreground">
                        Product information not available.
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Order Total */}
            <div className="border-t pt-4 mt-4">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-lg">Total Amount</span>
                <span className="font-bold text-2xl text-primary">
                  ${selectedOrder?.totalPrice?.toFixed(2)}
                </span>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <div className="flex items-center justify-end space-x-2 py-4">
          <div className="text-muted-foreground flex-1 text-sm">
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>
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
    </AdminSidebarLayout>
  );
}
