import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { UserCheck, UserX } from "lucide-react";
import { ConfirmDialog } from "@/components/common/confirm";
import { Pagination } from "@/components/common/pagination";
import { Button } from "@/components/ui/button";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	useBlockUser,
	useUnBlockUser,
} from "@/features/admin/user-management/hooks";
import { queryClient } from "@/main";
import type { User } from "@/shared/types";
import SearchBar from "../../../features/admin/components/SearchBar";
import {
	paramsSchema,
	type RowsPerPage,
} from "../../../features/admin/schemas/searchParamsSchema";
import { fetchUsers } from "../../../features/admin/user-management/services/user-mangement.service";

export const Route = createFileRoute("/admin/usermanagement/")({
	component: RouteComponent,
	validateSearch: paramsSchema,
	loaderDeps: ({ search }) => ({
		page: search.page,
		rowsPerPage: search.rowsPerPage,
		search: search.search,
	}),

	loader: async ({ deps }) => {
		const { page, rowsPerPage, search: query } = deps;
		return queryClient.fetchQuery({
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
	const isActionLoading =
		blockUserMutation.isPending || unblockUserMutation.isPending;

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
