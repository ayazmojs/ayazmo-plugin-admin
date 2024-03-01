"use client";

import { DataTable } from "ayazmo-plugin-admin/components/ui/data-table";
import { Heading } from "ayazmo-plugin-admin/components/ui/heading";
import { Button } from "ayazmo-plugin-admin/components/ui/button";
import { Separator } from "ayazmo-plugin-admin/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "ayazmo-plugin-admin/components/ui/dialog"
import { Input } from "ayazmo-plugin-admin/components/ui/input"
import { Label } from "ayazmo-plugin-admin/components/ui/label"
import { Plus } from "lucide-react";
import { columns, Admin } from "./columns";

interface AdminsClientProps {
  data: Admin[];
}

export function InviteAdminDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          className="text-xs md:text-sm"
        >
          <Plus className="mr-2 h-4 w-4" /> Invite Admin
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-center">Invite admin</DialogTitle>
          <DialogDescription className="text-center">
            This action will send an invite email with instructions how to create admin profile. Use with care
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Email
            </Label>
            <Input id="email" placeholder="email" className="col-span-3" />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Create Invite</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export const AdminClient: React.FC<AdminsClientProps> = ({ data }) => {
  return (
    <>
      <div className="flex items-start justify-between">
        <Heading
          title=""
          description=""
        />
        <InviteAdminDialog />
      </div>
      <Separator />
      <DataTable searchKey="email" columns={columns} data={data} />
    </>
  );
};