import { createFileRoute } from "@tanstack/react-router";
import { Fragment, useState } from "react";
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
import { ConfirmDialog } from "@/components/confirm";
import { ChevronDown, ChevronRight } from "lucide-react";
import StatusBadge from "./-components/statusBadge";
import SearchBar from "../-components/searchBar";
import CreateExpertiseDialog from "./-components/createExpertiseDialog";
import ExpertiseSkillsCollapse from "./-components/skillsCollapse";
import UpdateExpertiseDialog from "./-components/updateExpertiseDialog";
import { useFetchExpertises } from "./-hooks/useFetchExperitses";
import type { Expertise } from "@/types";
import { useVerifyExpertise } from "./-hooks/useVerifyExpertise";

export const Route = createFileRoute("/admin/expertisemanagement/")({
  component: RouteComponent,	
});

function RouteComponent() {
	const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState<string>("");
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const { data, isLoading } = useFetchExpertises(page, rowsPerPage, search);
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

  const handleVerifyExpertise = (id: string) => {
    verifyExpertiseMuation.mutate(id);
  };
  return  <div className="flex-1 overflow-auto">
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
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : expertises.length === 0 ? (
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
                        <TableCell>{StatusBadge({ isVerified: item.isVerified })}</TableCell>
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
}
