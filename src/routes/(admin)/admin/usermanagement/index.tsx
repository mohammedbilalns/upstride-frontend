import { createFileRoute } from "@tanstack/react-router"
import { useState } from "react";
import SearchBar from "@/features/admin/components/SearchBar";
import {
  paramsSchema,
  type RowsPerPage,
} from "@/features/admin/schemas/searchParamsSchema";
import { Pagination } from "@/components/common/Pagination";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useBlockUser, useUnBlockUser } from "@/features/admin/user-management/hooks/user-mangement.hooks";
import { fetchUsers } from "@/features/admin/user-management/services/user-mangement.service";
import { UserActionButton } from "@/features/admin/user-management/components/UserActionButton";
import { useNavigate } from "@tanstack/react-router";
import type { User } from "@/shared/types";

export const Route = createFileRoute("/(admin)/admin/usermanagement/")({
  component: RouteComponent,
  validateSearch: paramsSchema,
  loaderDeps: ({ search }) => ({
    page: search.page,
    rowsPerPage: search.rowsPerPage,
    search: search.search,
  }),

  loader: async ({ deps, context }) => {
    const { page, rowsPerPage, search: query } = deps;
    return context.queryClient.fetchQuery({
      queryKey: ["users", page, rowsPerPage, query],
      queryFn: () => fetchUsers(String(page), String(rowsPerPage), query),
    });
  },
});

function RouteComponent() {
  const navigate = useNavigate({ from: Route.fullPath });
  const { page, rowsPerPage, search } = Route.useSearch();
  const data = Route.useLoaderData();
  const users = data?.data ?? [];
  const totalPages = data?.total ? Math.ceil(data.total / rowsPerPage) : 1;
  const blockUserMutation = useBlockUser();
  const unblockUserMutation = useUnBlockUser();
  
  const [pendingUserId, setPendingUserId] = useState<string | null>(null);

  const setSearch = (newSearch: string) => {
    navigate({
      search: (prev) => ({
        ...prev,
        search: newSearch,
        page: prev.search === newSearch ? prev.page : 1,
      }),
    });
  };

  const setPage = (newPage: number) => {
    navigate({
      search: (prev) => ({
        ...prev,
        page: newPage,
      }),
    });
  };

  const setRowsPerPage = (newRowsPerPage: RowsPerPage) => {
    navigate({
      search: (prev) => ({
        ...prev,
        rowsPerPage: newRowsPerPage,
        page: 1,
      }),
    });
  };

  const handleBlock = (id: string) => {
    setPendingUserId(id);
    blockUserMutation.mutate(id, {
      onSettled: () => {
        setPendingUserId(null);
      }
    });
  };
  
  const handleUnblock = (id: string) => {
    setPendingUserId(id);
    unblockUserMutation.mutate(id, {
      onSettled: () => {
        setPendingUserId(null);
      }
    });
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
            placeholder="Search by name, email"
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
                {users.length === 0 ? (
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
                        <UserActionButton
                          user={user}
                          onBlock={handleBlock}
                          onUnblock={handleUnblock}
                          isPending={pendingUserId === user.id}
                        />
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
