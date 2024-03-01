"use client";
import { ColumnDef } from "ayazmo-plugin-admin/components/react-table";
import { CellAction } from "./cell-action";
import { Checkbox } from "ayazmo-plugin-admin/components/ui/checkbox";
import { Badge } from "ayazmo-plugin-admin/components/ui/badge";

export type Admin = {
  id: number;
  first_name: string;
  last_name: string;
  email_verified: boolean;
  status: string;
  email: string;
};

export const columns: ColumnDef<Admin>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
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
    id: 'name',
    header: 'Name',
    accessorKey: 'name',
    cell: ({ row }) => (
      <div>{row.original.first_name} {row.original.last_name}</div>
    ),
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    id: 'status',
    header: 'Status',
    accessorKey: 'status',
    cell: ({ row }) => (
      <Badge variant="outline">{row.original.status}</Badge>
    ),
  },
  {
    id: 'email_verified',
    header: 'Verified?',
    accessorKey: 'email_verified',
    cell: ({ row }) => (
      <Badge variant={row.original.email_verified ? "default" : "destructive"}>
        {`${row.original.email_verified ? "Verified" : "Not Verified"}`}
      </Badge>
    ),
  },
  {
    id: "actions",
    header: 'Actions',
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];