import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pagination } from "@/components/pagination";
import { useFetchUsers,useBlockUser, useUnBlockUser } from "../-hooks";
import type { User } from "@/types";
import SearchBar from "../../-components/searchBar";
import { ConfirmDialog } from "@/components/confirm";
import { UserCheck, UserX } from "lucide-react";

export default function UserManagementTable() {
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const { data, isLoading } = useFetchUsers(page, rowsPerPage, search);
  const users = data?.data ?? [];
  const totalPages = data?.total ? Math.ceil(data.total / rowsPerPage) : 1;
  const blockUserMutation = useBlockUser();
  const unblockUserMutation = useUnBlockUser();
  const isActionLoading =
    blockUserMutation.isPending || unblockUserMutation.isPending;

  const handleBlock = (id: string) => {
    blockUserMutation.mutate(id);
  };
  const handleUnblock = (id: string) => {
    unblockUserMutation.mutate(id);
  };

  return (
    <div className="flex-1 overflow-auto">
      <div className="p-4 sm:p-6">
        <div className="bg-card rounded-xl shadow-lg border border-border/50 backdrop-blur-sm p-4 sm:p-8">
          <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-foreground">
            User Management
          </h1>

          <SearchBar
            onSearch={setSearch}
            setPage={setPage}
            initialValue={search}
          />

          <div className="min-h-[68vh] overflow-x-auto rounded-lg border border-border/50 ">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead className="hidden md:table-cell">Role</TableHead>
                  <TableHead className="hidden sm:table-cell">Joined</TableHead>
                  <TableHead className="hidden sm:table-cell">Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : users.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center text-muted-foreground"
                    >
                      No users found
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((user: User) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        {user.role}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        {user.createdAt
                          ? new Date(user.createdAt).toLocaleDateString()
                          : "—"}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell w-24">
                        {user.isBlocked ? (
                          <span className="text-red-500 font-medium ">
                            Blocked
                          </span>
                        ) : (
                          <span className="text-green-600 font-medium">
                            Active
                          </span>
                        )}
                      </TableCell>

                      <TableCell className="text-right">
                        {user.isBlocked ? (
                          <ConfirmDialog
                            title="Unblock User"
                            description={`Are you sure you want to unblock ${user.name}? This user will regain access to their account.`}
                            confirmText="Unblock User"
                            icon={
                              <UserCheck className="h-5 w-5 text-green-500" />
                            }
                            onConfirm={() => handleUnblock(user.id)}
                            disabled={isActionLoading}
                          >
                            <Button
                              size="sm"
                              variant="secondary"
                              disabled={isActionLoading}
                              className="cursor-pointer w-20"
                            >
                              Unblock
                            </Button>
                          </ConfirmDialog>
                        ) : (
                          <ConfirmDialog
                            title="Block User"
                            description={`Are you sure you want to block ${user.name}? This user will no longer be able to access their account.`}
                            confirmText="Block User"
                            variant="destructive"
                            icon={<UserX className="h-5 w-5 text-red-500" />}
                            onConfirm={() => handleBlock(user.id)}
                            disabled={isActionLoading}
                          >
                            <Button
                              size="sm"
                              variant="destructive"
                              disabled={isActionLoading}
                              className="cursor-pointer w-20"
                            >
                              Block
                            </Button>
                          </ConfirmDialog>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <Pagination
            page={page}
            totalPages={totalPages}
            rowsPerPage={rowsPerPage}
            setPage={setPage}
            setRowsPerPage={setRowsPerPage}
          />
        </div>
      </div>
    </div>
  );
}

