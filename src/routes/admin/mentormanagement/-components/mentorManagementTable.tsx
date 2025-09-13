import { useState, useMemo } from "react";
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
  ChevronDown,
  ChevronRight,
  Check,
  X,
  ExternalLink,
  FileText,
  Mail,
  User,
  Building,
  Calendar,
  GraduationCap,
  Globe,
} from "lucide-react";

// Types remain the same
type User = {
  id: string;
  name: string;
  email: string;
};
type Skill = {
  id: string;
  name: string;
};

type Expertise = {
  id: string;
  name: string;
};

type Mentor = {
  id: string;
  userId: User;
  bio: string;
  currentRole: string;
  institution: string;
  yearsOfExperience: number;
  educationalQualifications: string[];
  personalWebsite: string;
  expertiseId: Expertise;
  skillIds: Skill[];
  resumeUrl: string;
  termsAccepted: boolean;
  isApproved: boolean;
  isRejected: boolean;
  createdAt: string;
};
import { Pagination } from "@/components/pagination";
import { ConfirmDialog } from "@/components/confirm";
import SearchBar from "../../-components/searchBar";

const generateDummyData = (): Mentor[] => {
  const expertises: Expertise[] = [
    { id: "exp-1", name: "Software Engineering" },
    { id: "exp-2", name: "Data Science" },
    { id: "exp-3", name: "Product Management" },
    { id: "exp-4", name: "UI/UX Design" },
    { id: "exp-5", name: "Digital Marketing" },
  ];

  const skills: Skill[] = [
    { id: "skill-1", name: "JavaScript" },
    { id: "skill-2", name: "Python" },
    { id: "skill-3", name: "React" },
    { id: "skill-4", name: "Machine Learning" },
    { id: "skill-5", name: "SQL" },
    { id: "skill-6", name: "Node.js" },
    { id: "skill-7", name: "AWS" },
    { id: "skill-8", name: "Docker" },
    { id: "skill-9", name: "Figma" },
    { id: "skill-10", name: "Analytics" },
  ];

  return Array.from({ length: 25 }).map((_, idx) => {
    const randomSkills = skills
      .sort(() => 0.5 - Math.random())
      .slice(0, Math.floor(Math.random() * 8) + 3);

    const status = Math.random();
    const isApproved = status > 0.7;
    const isRejected = status < 0.2;

    return {
      id: `mentor-${idx + 1}`,
      userId: {
        id: `user-${idx + 1}`,
        name: `John Doe ${idx + 1}`,
        email: `john.doe${idx + 1}@example.com`,
      },
      bio: `Experienced professional with ${Math.floor(Math.random() * 10) + 5} years in the industry. Passionate about mentoring and helping others grow.`,
      currentRole: [
        "Senior Software Engineer",
        "Data Scientist",
        "Product Manager",
        "UX Designer",
        "Marketing Director",
      ][Math.floor(Math.random() * 5)],
      institution: [
        "Google",
        "Microsoft",
        "Amazon",
        "Meta",
        "Apple",
        "Netflix",
        "Spotify",
      ][Math.floor(Math.random() * 7)],
      yearsOfExperience: Math.floor(Math.random() * 15) + 2,
      educationalQualifications: [
        "Bachelor's in Computer Science",
        "Master's in Data Science",
        "MBA",
      ].slice(0, Math.floor(Math.random() * 3) + 1),
      personalWebsite: `https://johndoe${idx + 1}.dev`,
      expertiseId: expertises[Math.floor(Math.random() * expertises.length)],
      skillIds: randomSkills,
      resumeUrl: `https://example.com/resume-${idx + 1}.pdf`,
      termsAccepted: true,
      isApproved,
      isRejected,
      createdAt: new Date(
        2024,
        Math.floor(Math.random() * 12),
        Math.floor(Math.random() * 28) + 1,
      ).toISOString(),
    };
  });
};

const dummyData = generateDummyData();

export default function MentorManagementTable() {
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [data, setData] = useState<Mentor[]>(dummyData);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState<string>("");
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [filter, setFilter] = useState<
    "all" | "pending" | "approved" | "rejected"
  >("all");

  const filteredData = useMemo(() => {
    let filtered = data;

    // Filter by status
    if (filter === "pending") {
      filtered = filtered.filter(
        (item) => !item.isApproved && !item.isRejected,
      );
    } else if (filter === "approved") {
      filtered = filtered.filter((item) => item.isApproved);
    } else if (filter === "rejected") {
      filtered = filtered.filter((item) => item.isRejected);
    }

    // Filter by search
    if (search.trim()) {
      const lowerSearch = search.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.userId.name.toLowerCase().includes(lowerSearch) ||
          item.userId.email.toLowerCase().includes(lowerSearch) ||
          item.currentRole.toLowerCase().includes(lowerSearch) ||
          item.institution.toLowerCase().includes(lowerSearch) ||
          item.expertiseId.name.toLowerCase().includes(lowerSearch) ||
          item.skillIds.some((skill) =>
            skill.name.toLowerCase().includes(lowerSearch),
          ),
      );
    }

    return filtered;
  }, [search, data, filter]);

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const displayedData = filteredData.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage,
  );

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
    setData((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, isApproved: true, isRejected: false }
          : item,
      ),
    );
  };

  const onRejectMentor = (id: string) => {
    setData((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, isRejected: true, isApproved: false }
          : item,
      ),
    );
  };

  const getStatusBadge = (mentor: Mentor) => {
    if (mentor.isApproved) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
          <Check className="w-3 h-3" />
          Approved
        </span>
      );
    }
    if (mentor.isRejected) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400">
          <X className="w-3 h-3" />
          Rejected
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400">
        <Calendar className="w-3 h-3" />
        Pending
      </span>
    );
  };

  const pendingCount = data.filter(
    (item) => !item.isApproved && !item.isRejected,
  ).length;
  const approvedCount = data.filter((item) => item.isApproved).length;
  const rejectedCount = data.filter((item) => item.isRejected).length;

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
                {pendingCount} Pending
              </span>
              <span className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 rounded">
                {approvedCount} Approved
              </span>
              <span className="px-2 py-1 bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400 rounded">
                {rejectedCount} Rejected
              </span>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <SearchBar
              onSearch={setSearch}
              setPage={setPage}
              initialValue={search}
            />
            <div className="flex gap-2">
              <select
                value={filter}
                onChange={(e) => {
                  setFilter(e.target.value as any);
                  setPage(1);
                }}
                className="border border-border rounded px-3 py-2 text-sm bg-background"
              >
                <option value="all">All Status</option>
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
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : displayedData.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center text-muted-foreground"
                    >
                      No mentors found
                    </TableCell>
                  </TableRow>
                ) : (
                  displayedData.map((mentor) => (
                    <>
                      <TableRow key={mentor.id}>
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
                                {mentor.userId.name}
                              </div>
                              <div className="text-sm text-muted-foreground flex items-center gap-1">
                                <Mail className="w-3 h-3" />
                                {mentor.userId.email}
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
                              {mentor.institution}
                            </div>
                            <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                              <Calendar className="w-3 h-3" />
                              {mentor.yearsOfExperience} years exp.
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="inline-block bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400 px-2 py-1 rounded-md text-sm font-medium">
                            {mentor.expertiseId.name}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1 max-w-[300px]">
                            {mentor.skillIds.slice(0, 3).map((skill) => (
                              <span
                                key={skill.id}
                                className="bg-muted text-muted-foreground px-2 py-1 rounded text-xs"
                              >
                                {skill.name}
                              </span>
                            ))}
                            {mentor.skillIds.length > 3 && (
                              <span className="text-muted-foreground text-xs">
                                +{mentor.skillIds.length - 3} more
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(mentor)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            {!mentor.isApproved && !mentor.isRejected && (
                              <>
                                <ConfirmDialog
                                  title="Approve Mentor Application"
                                  description={`Are you sure you want to approve ${mentor.userId.name}'s application?`}
                                  confirmText="Approve"
                                  variant="default"
                                  onConfirm={() => onApproveMentor(mentor.id)}
                                >
                                  <Button size="sm" variant="default">
                                    <Check className="w-3 h-3 mr-1" />
                                    Approve
                                  </Button>
                                </ConfirmDialog>

                                <ConfirmDialog
                                  title="Reject Mentor Application"
                                  description={`Are you sure you want to reject ${mentor.userId.name}'s application?`}
                                  confirmText="Reject"
                                  variant="destructive"
                                  onConfirm={() => onRejectMentor(mentor.id)}
                                >
                                  <Button size="sm" variant="destructive">
                                    <X className="w-3 h-3 mr-1" />
                                    Reject
                                  </Button>
                                </ConfirmDialog>
                              </>
                            )}
                            {mentor.isApproved && (
                              <span className="text-sm text-green-600 dark:text-green-400 font-medium">
                                ✓ Approved
                              </span>
                            )}
                            {mentor.isRejected && (
                              <span className="text-sm text-red-600 dark:text-red-400 font-medium">
                                ✗ Rejected
                              </span>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>

                      {expandedRows.has(mentor.id) && (
                        <TableRow>
                          <TableCell colSpan={7} className="p-0">
                            <div className="bg-muted/30 p-6 border-t border-border/50">
                              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Left Column */}
                                <div className="space-y-4">
                                  <div>
                                    <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                                      <FileText className="w-4 h-4" />
                                      Bio
                                    </h4>
                                    <p className="text-sm text-muted-foreground bg-background p-3 rounded border border-border/50">
                                      {mentor.bio}
                                    </p>
                                  </div>

                                  <div>
                                    <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                                      <GraduationCap className="w-4 h-4" />
                                      Education
                                    </h4>
                                    <div className="space-y-1">
                                      {mentor.educationalQualifications.map(
                                        (qual, idx) => (
                                          <span
                                            key={idx}
                                            className="block bg-background px-3 py-2 rounded border border-border/50 text-sm"
                                          >
                                            {qual}
                                          </span>
                                        ),
                                      )}
                                    </div>
                                  </div>

                                  <div>
                                    <h4 className="font-semibold text-sm mb-2">
                                      Links
                                    </h4>
                                    <div className="flex gap-2">
                                      <a
                                        href={mentor.personalWebsite}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm"
                                      >
                                        <Globe className="w-3 h-3" />
                                        Website
                                        <ExternalLink className="w-3 h-3" />
                                      </a>
                                      <a
                                        href={mentor.resumeUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm"
                                      >
                                        <FileText className="w-3 h-3" />
                                        Resume
                                        <ExternalLink className="w-3 h-3" />
                                      </a>
                                    </div>
                                  </div>
                                </div>

                                {/* Right Column */}
                                <div className="space-y-4">
                                  <div>
                                    <h4 className="font-semibold text-sm mb-2">
                                      All Skills ({mentor.skillIds.length})
                                    </h4>
                                    <div className="grid grid-cols-2 gap-2">
                                      {mentor.skillIds.map((skill) => (
                                        <span
                                          key={skill.id}
                                          className="bg-background px-3 py-2 rounded border border-border/50 text-sm text-center"
                                        >
                                          {skill.name}
                                        </span>
                                      ))}
                                    </div>
                                  </div>

                                  <div>
                                    <h4 className="font-semibold text-sm mb-2">
                                      Application Details
                                    </h4>
                                    <div className="bg-background p-3 rounded border border-border/50 space-y-2 text-sm">
                                      <div className="flex justify-between">
                                        <span className="text-muted-foreground">
                                          Applied:
                                        </span>
                                        <span>
                                          {new Date(
                                            mentor.createdAt,
                                          ).toLocaleDateString()}
                                        </span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-muted-foreground">
                                          Terms Accepted:
                                        </span>
                                        <span className="text-green-600 dark:text-green-400">
                                          {mentor.termsAccepted ? "Yes" : "No"}
                                        </span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-muted-foreground">
                                          Experience:
                                        </span>
                                        <span>
                                          {mentor.yearsOfExperience} years
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
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
