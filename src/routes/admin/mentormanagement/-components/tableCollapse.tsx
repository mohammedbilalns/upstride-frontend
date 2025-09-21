import { useEffect, useState } from "react";
import { TableRow, TableCell } from "@/components/ui";
import { FileText, GraduationCap, ExternalLink, Globe } from "lucide-react";
import type { Mentor } from "@/types/mentor";
import { useFetchMedia } from "@/hooks/useFetchMedia";

interface TableCollapseProps {
  mentor: Mentor;
}

export default function TableCollapse({ mentor }: TableCollapseProps) {
  const fetchResumeQuery = useFetchMedia({
    publicId: mentor.resumeId,
    mediaType: "raw",
  });

  const [resumeUrl, setResumeUrl] = useState<string | null>(null);

  useEffect(() => {
    if (fetchResumeQuery.data?.blob) {
      const url = URL.createObjectURL(fetchResumeQuery.data.blob);
      setResumeUrl(url);

      return () => {
        URL.revokeObjectURL(url);
      };
    }
  }, [fetchResumeQuery.data]);

  return (
    <TableRow>
      <TableCell colSpan={7} className="p-0">
        <div className="bg-muted/30 p-6 border-t border-border/50">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              {/* Bio */}
              <div>
                <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Bio
                </h4>
                <p className="text-sm text-muted-foreground bg-background p-3 rounded border border-border/50">
                  {mentor.bio}
                </p>
              </div>

              {/* Education */}
              <div>
                <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                  <GraduationCap className="w-4 h-4" />
                  Education
                </h4>
                <div className="space-y-1">
                  {mentor.educationalQualifications.map((qual, idx) => (
                    <span
                      key={idx}
                      className="block bg-background px-3 py-2 rounded border border-border/50 text-sm"
                    >
                      {qual}
                    </span>
                  ))}
                </div>
              </div>

              {/* Links */}
              <div>
                <h4 className="font-semibold text-sm mb-2">Links</h4>
                <div className="flex gap-2">
                  {mentor.personalWebsite && (
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
                  )}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              {/* Skills */}
              <div>
                <h4 className="font-semibold text-sm mb-2">
                  All Skills ({mentor.skills.length})
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {mentor.skills.map((skill) => (
                    <span
                      key={skill.id}
                      className="bg-background px-3 py-2 rounded border border-border/50 text-sm text-center"
                    >
                      {skill.name}
                    </span>
                  ))}
                </div>
              </div>

              {/* Application Details */}
              <div>
                <h4 className="font-semibold text-sm mb-2">
                  Application Details
                </h4>
                <div className="bg-background p-3 rounded border border-border/50 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Applied:</span>
                    <span>
                      {new Date(mentor.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Experience:</span>
                    <span>{mentor.yearsOfExperience} years</span>
                  </div>
                </div>
              </div>

              {/* Resume Preview */}
              <div>
                <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Resume Preview
                </h4>
                {fetchResumeQuery.isLoading && <p>Loading resume...</p>}
                {resumeUrl && (
                  <a
                    href={resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm"
                  >
                    <FileText className="w-3 h-3" />
                    View Resume
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}

                {fetchResumeQuery.isError && (
                  <p className="text-red-500">Failed to load resume link.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </TableCell>
    </TableRow>
  );
}
