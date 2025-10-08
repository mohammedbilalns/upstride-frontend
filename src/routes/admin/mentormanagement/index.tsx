import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
	Building,
	Calendar,
	Check,
	ChevronDown,
	ChevronRight,
	Mail,
	User,
	X,
} from "lucide-react";
import { Fragment, useState } from "react";
import { ConfirmDialog } from "@/components/confirm";
import { Pagination } from "@/components/pagination";
import { Button } from "@/components/ui/button";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { queryClient } from "@/main";
import type { Mentor } from "@/types/mentor";
import SearchBar from "../-components/searchBar";
import type { RowsPerPage } from "../-validtations/searchParamsSchema";
import StatusBadge from "./-components/statusBadge";
import TableCollapse from "./-components/tableCollapse";
import { useApproveMentor } from "./-hooks/useApproveMentor";
import { useRejectMentor } from "./-hooks/useRejectMentor";
import { fetchMentors } from "./-services/mentormanagement.service";
import { paramsSchema } from "./validtions/-searchParamsSchema";

export const Route = createFileRoute("/admin/mentormanagement/")({
	component: RouteComponent,
	validateSearch: (input) => {
		const result = paramsSchema.safeParse(input);
		if (result.success) return result.data;
		return { page: 1, rowsPerPage: 10, search: "", filter: undefined };
	},
	loaderDeps: ({ search }) => ({
		page: search.page,
		rowsPerPage: search.rowsPerPage,
		search: search.search,
		filter: search.filter,
	}),
	loader: async ({ deps }) => {
		const { page, rowsPerPage, search: query, filter } = deps;
		return queryClient.fetchQuery({
			queryKey: ["mentors", page, rowsPerPage, query, filter],
			queryFn: () =>
				fetchMentors(String(page), String(rowsPerPage), query, filter),
		});
	},
});
type MentorStatus = "pending" | "approved" | "rejected";

function RouteComponent() {
	const navigate = useNavigate({ from: Route.fullPath });
	const { page, rowsPerPage, search, filter } = Route.useSearch();
	const data = Route.useLoaderData();
	const approveMentorMutation = useApproveMentor();
	const rejectMentorMutation = useRejectMentor();

	const totalPages = data?.totalMentors
		? Math.ceil(data.totalMentors / rowsPerPage)
		: 1;
	const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

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

	const setFilter = (newFilter: MentorStatus | undefined) => {
		navigate({
			search: (prev) => ({
				...prev,
				filter: newFilter,
				page: 1,
			}),
		});
	};

	const toggleExpanded = (id: string) => {
		setExpandedRows((prev) => {
			const newSet = new Set(prev);
			if (newSet.has(id)) {
				newSet.delete(id);
			} else {
				newSet.add(id);
			}
			return newSet;
		});
	};

	const onApproveMentor = (id: string) => {
		approveMentorMutation.mutate(id);
	};

	const onRejectMentor = (id: string) => {
		rejectMentorMutation.mutate({ id, reason: "Rejected by admin" });
	};

	return (
		<div className="flex-1 overflow-auto">
			<div className="p-4 sm:p-6">
				<div className="bg-card rounded-xl shadow-lg border border-border/50 backdrop-blur-sm p-4 sm:p-8">
					<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
						<h1 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-0 text-foreground">
							Mentor Management
						</h1>

						{/* Status Summary */}
						<div className="flex gap-2 text-sm">
							<span className="px-2 py-1 bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400 rounded">
								{data?.totalPending} Pending
							</span>
							<span className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 rounded">
								{data?.totalApproved} Approved
							</span>
							<span className="px-2 py-1 bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400 rounded">
								{data?.totalRejected} Rejected
							</span>
						</div>
					</div>

					{/* Search and Filter */}
					<div className="flex flex-col sm:flex-row gap-4 mb-4">
						<SearchBar
							onSearch={setSearch}
							setPage={setPage}
							initialValue={search}
							placeholder="Search by name, email, skills"
						/>
						<div className="flex gap-2">
							<select
								value={filter ?? ""}
								onChange={(e) => {
									const val = e.target.value;
									setFilter(val === "" ? undefined : (val as MentorStatus));
									setPage(1);
								}}
								className="border border-border rounded px-3 py-2 text-sm bg-background"
							>
								<option value="">All Status</option>
								<option value="pending">Pending</option>
								<option value="approved">Approved</option>
								<option value="rejected">Rejected</option>
							</select>
						</div>
					</div>

					<div className="min-h-[66vh] overflow-x-auto rounded-lg border border-border/50">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead className="w-8"></TableHead>
									<TableHead>Applicant</TableHead>
									<TableHead>Role & Institution</TableHead>
									<TableHead>Expertise</TableHead>
									<TableHead>Skills</TableHead>
									<TableHead>Status</TableHead>
									<TableHead className="text-right">Actions</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{data?.mentors.length === 0 ? (
									<TableRow>
										<TableCell
											colSpan={7}
											className="text-center text-muted-foreground"
										>
											No mentors found
										</TableCell>
									</TableRow>
								) : (
									data.mentors.map((mentor: Mentor) => (
										<Fragment key={mentor.id}>
											<TableRow>
												<TableCell>
													<Button
														variant="ghost"
														size="sm"
														onClick={() => toggleExpanded(mentor.id)}
														className="p-0 h-6 w-6"
													>
														{expandedRows.has(mentor.id) ? (
															<ChevronDown className="w-4 h-4" />
														) : (
															<ChevronRight className="w-4 h-4" />
														)}
													</Button>
												</TableCell>
												<TableCell>
													<div className="flex items-center gap-2">
														<User className="w-4 h-4 text-muted-foreground" />
														<div>
															<div className="font-medium">
																{mentor?.user?.name ?? "name error"}
															</div>
															<div className="text-sm text-muted-foreground flex items-center gap-1">
																<Mail className="w-3 h-3" />
																{mentor?.user?.email ?? "email error"}
															</div>
														</div>
													</div>
												</TableCell>
												<TableCell>
													<div>
														<div className="font-medium">
															{mentor.currentRole}
														</div>
														<div className="text-sm text-muted-foreground flex items-center gap-1">
															<Building className="w-3 h-3" />
															{mentor.organisation}
														</div>
														<div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
															<Calendar className="w-3 h-3" />
															{mentor.yearsOfExperience} years exp.
														</div>
													</div>
												</TableCell>
												<TableCell>
													<span className="inline-block bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400 px-2 py-1 rounded-md text-sm font-medium">
														{mentor.expertise.name}
													</span>
												</TableCell>
												<TableCell>
													<div className="flex flex-wrap gap-1 max-w-[300px]">
														{mentor.skills.slice(0, 3).map((skill) => (
															<span
																key={skill.id}
																className="bg-muted text-muted-foreground px-2 py-1 rounded text-xs"
															>
																{skill.name}
															</span>
														))}
														{mentor.skills.length > 3 && (
															<span className="text-muted-foreground text-xs">
																+{mentor.skills.length - 3} more
															</span>
														)}
													</div>
												</TableCell>
												<TableCell>{StatusBadge(mentor)}</TableCell>
												<TableCell className="text-right">
													<div className="flex justify-end gap-2">
														{mentor.isPending && (
															<ConfirmDialog
																title="Approve Mentor Application"
																description={`Are you sure you want to approve ${mentor.user.name}'s application?`}
																confirmText="Approve"
																variant="default"
																onConfirm={() => onApproveMentor(mentor.id)}
															>
																<Button size="sm" variant="default">
																	<Check className="w-3 h-3 mr-1 cursor-pointer" />
																	Approve
																</Button>
															</ConfirmDialog>
														)}
														{mentor.isPending && (
															<ConfirmDialog
																title="Reject Mentor Application"
																description={`Are you sure you want to reject ${mentor.user.name}'s application?`}
																confirmText="Reject"
																variant="destructive"
																onConfirm={() => onRejectMentor(mentor.id)}
															>
																<Button size="sm" variant="destructive">
																	<X className="w-3 h-3 mr-1 cursor-pointer" />
																	Reject
																</Button>
															</ConfirmDialog>
														)}
													</div>
												</TableCell>
											</TableRow>

											{expandedRows.has(mentor.id) && (
												<TableCollapse mentor={mentor} />
											)}
										</Fragment>
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
