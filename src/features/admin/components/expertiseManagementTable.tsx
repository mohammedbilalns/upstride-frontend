import type { Expertise } from "@/types";
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
import { ConfirmDialog } from "@/components/confirm";
import { ChevronDown, ChevronRight, Check, X } from "lucide-react";
import SearchBar from "./searchBar";
import CreateExpertiseDialog from "./createExpertiseDialog";
import { useFetchExpertises } from "../hooks/useFetchExperitses";
import { useVerifyExpertise } from "../hooks/useVerifyExpertise";
import ExpertiseSkillsCollapse from "./skillsCollapse";

export default function ExpertiseManagementTable() {
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState<string>("");
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const { data, isLoading } = useFetchExpertises(page, rowsPerPage, search);
  const totalPages = data?.total ? Math.ceil(data.total / rowsPerPage) : 1;
  const expertises: Expertise[] = data?.data || [];
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

  const getStatusBadge = (isVerified: boolean) => {
    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
          isVerified
            ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
            : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
        }`}
      >
        {isVerified ? (
          <>
            <Check className="w-3 h-3" />
            Verified
          </>
        ) : (
          <>
            <X className="w-3 h-3" />
            Not Verified
          </>
        )}
      </span>
    );
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
                    <>
                      <TableRow key={item.id}>
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
                        <TableCell>{getStatusBadge(item.isVerified)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button size="sm" variant="outline">
                              Edit
                            </Button>
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
                    </>
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
