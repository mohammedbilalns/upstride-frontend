import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Fragment, useState } from "react";
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
import SearchBar from "@/features/admin/components/SearchBar";
import { CreateExpertiseDialog } from "@/features/admin/expertise-mangement/components/createExpertiseDialog";
import ExpertiseSkillsCollapse from "@/features/admin/expertise-mangement/components/skillsCollapse";
import { UpdateExpertiseDialog } from "@/features/admin/expertise-mangement/components/updateExpertiseDialog";
import { useVerifyExpertise } from "@/features/admin/expertise-mangement/hooks";
import { fetchExpertises } from "@/features/admin/expertise-mangement/services/expertise-management.service";
import StatusBadge from "@/features/admin/mentor-management/components/statusBadge";
import {
	paramsSchema,
	type RowsPerPage,
} from "@/features/admin/schemas/searchParamsSchema";
import type { Expertise } from "@/shared/types";

export const Route = createFileRoute("/(admin)/admin/expertisemanagement/")({
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
			queryKey: ["expertises", page, rowsPerPage, query],
			queryFn: () => fetchExpertises(String(page), String(rowsPerPage), query),
		});
	},
});

function RouteComponent() {
	const navigate = useNavigate({ from: Route.fullPath });
	const { page, rowsPerPage, search } = Route.useSearch();
	const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
	const data = Route.useLoaderData();
	const totalPages = data?.total ? Math.ceil(data.total / rowsPerPage) : 1;
	const expertises: Expertise[] = data?.expertises || [];
	const verifyExpertiseMuation = useVerifyExpertise();

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

	const handleVerifyExpertise = (id: string) => {
		verifyExpertiseMuation.mutate(id);
	};
	return (
		<div className="flex-1 overflow-auto">
			<div className="p-4 sm:p-6">
				<div className="bg-card rounded-xl shadow-lg border border-border/50 backdrop-blur-sm p-4 sm:p-8">
					<h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-foreground">
						Expertise Management
					</h1>

					<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
						<SearchBar
							onSearch={setSearch}
							setPage={setPage}
							initialValue={search}
							placeholder="Search by name"
						/>
						<CreateExpertiseDialog />
					</div>

					<div className="min-h-[66vh] overflow-x-auto rounded-lg border border-border/50 ">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead className="w-8"></TableHead>
									<TableHead>Name</TableHead>
									<TableHead>Description</TableHead>
									<TableHead>Status</TableHead>
									<TableHead className="text-right">Actions</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{expertises.length === 0 ? (
									<TableRow>
										<TableCell
											colSpan={5}
											className="text-center text-muted-foreground"
										>
											No expertise found
										</TableCell>
									</TableRow>
								) : (
									expertises.map((item) => (
										<Fragment key={item.id}>
											<TableRow>
												<TableCell>
													<Button
														variant="ghost"
														size="sm"
														onClick={() => toggleExpanded(item.id)}
														className="p-0 h-6 w-6"
													>
														{expandedRows.has(item.id) ? (
															<ChevronDown className="w-4 h-4" />
														) : (
															<ChevronRight className="w-4 h-4" />
														)}
													</Button>
												</TableCell>
												<TableCell className="font-medium">
													{item.name}
												</TableCell>
												<TableCell>{item.description || "—"}</TableCell>
												<TableCell>
													<StatusBadge
														id={item.id}
														isVerified={item.isVerified}
														isPending={false}
														isRejected={false}
													/>
												</TableCell>
												<TableCell className="text-right">
													<div className="flex justify-end gap-2">
														<UpdateExpertiseDialog
															name={item.name}
															description={item.description}
															expertiseId={item.id}
														/>
														{!item.isVerified && (
															<ConfirmDialog
																title="Verify Expertise"
																description="Are you sure you want to verify this expertise?"
																confirmText="Verify"
																variant="default"
																onConfirm={() => handleVerifyExpertise(item.id)}
															>
																<Button size="sm" variant="default">
																	Verify
																</Button>
															</ConfirmDialog>
														)}{" "}
													</div>
												</TableCell>
											</TableRow>

											{expandedRows.has(item.id) && (
												<TableRow>
													<TableCell colSpan={5} className="p-0">
														<ExpertiseSkillsCollapse expertiseId={item.id} />
													</TableCell>
												</TableRow>
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
