import { formatSmartDate } from "@/shared/utils/dateUtil";
import {
  MapPin,
  Briefcase,
  Calendar,
  Globe,
  Users,
  CheckCircle,
  BookOpen,
  ExternalLink,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import UserAvatar from "@/components/common/UserAvatar";
import GoToChat from "@/features/chats/components/GoToChat";
import { Separator } from "@/components/ui/separator";
import { useQuery } from "@tanstack/react-query";
import Loading from "@/components/common/Loading";
import ErrorState from "@/components/common/ErrorState";
import BookingCalendar from "../components/BookingCalendar";
import { Route } from "@/routes/(authenticated)/mentors/$mentorId"
import { getMentor } from "../services/mentor.service";
import FollowButton from "@/features/connnections/components/FollowButton";

export default function MentorDetailsPage() {
  const { mentorId } = Route.useParams();
  const {
    data: mentor,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["mentor", mentorId],
    queryFn: () => getMentor(mentorId),
  });

  if (isLoading) {
    return <Loading />;
  }

  if (isError || !mentor) {
    return <ErrorState />;
  }

  const {
    id,
    bio,
    currentRole,
    organisation,
    yearsOfExperience,
    educationalQualifications,
    personalWebsite,
    isVerified,
    followers,
    createdAt,
    isFollowing,
    user,
    expertise,
    skills,
  } = mentor;

  return (
    <div className="bg-muted/40 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="w-full lg:w-1/3 lg:sticky lg:top-8 lg:h-fit">
            <Card className="overflow-hidden shadow-lg">
              <CardContent className="p-6 text-center">
                <div className="flex justify-center mb-4">
                  <UserAvatar
                    image={user.profilePicture}
                    name={user.name}
                    size={24}
                  />
                </div>
                <h1 className="text-2xl font-bold flex items-center justify-center gap-2">
                  {user.name}
                  {isVerified && (
                    <CheckCircle
                      className="h-6 w-6 text-blue-500"
                    />
                  )}
                </h1>
                <p className="text-md text-muted-foreground mt-1">
                  {currentRole}
                </p>
                <p className="text-sm text-muted-foreground">{organisation}</p>

                <div className="flex flex-col gap-3 mt-6 w-full max-w-sm mx-auto">
                  <FollowButton isFollowing={isFollowing} mentorId={id} />
                  <GoToChat userId={user.id} isText={true} />
                </div>
              </CardContent>
              <Separator />
              <div className="p-6 grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Users className="h-5 w-5" />
                  <div>
                    <p className="font-semibold">{followers}</p>
                    <p>Followers</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-5 w-5" />
                  <div>
                    <p className="font-semibold">
                      {formatSmartDate(createdAt.toString())}
                    </p>
                    <p>Joined</p>
                  </div>
                </div>
              </div>
            </Card>
          </aside>

          {/* Main Content */}
          <main className="w-full lg:w-2/3 space-y-8">
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle>About</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-md leading-relaxed">
                  {bio}
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-md">
              <CardHeader>
                <CardTitle>Professional Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <InfoItem
                  icon={Briefcase}
                  label="Current Role"
                  value={currentRole}
                />
                <InfoItem
                  icon={MapPin}
                  label="Organization"
                  value={organisation}
                />
                <InfoItem
                  icon={Calendar}
                  label="Experience"
                  value={`${yearsOfExperience} years`}
                />
                {personalWebsite && <WebsiteLink link={personalWebsite} />}
              </CardContent>
            </Card>

            <Card className="shadow-md">
              <CardHeader>
                <CardTitle>Expertise & Skills</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3">
                    Primary Expertise
                  </h3>
                  <Badge variant="default" className="text-md">
                    {expertise.name}
                  </Badge>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-3">Skills</h3>
                  <div className="flex flex-wrap gap-3">
                    {skills.map((skill) => (
                      <Badge key={skill.id} variant="secondary">
                        {skill.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-6 w-6" />
                  Education
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {educationalQualifications.map((qualification, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-primary mt-2.5" />
                      <span className="text-muted-foreground flex-1">
                        {qualification}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <div className="mt-8">
              <h2 className="text-2xl font-bold mb-4">Availability</h2>
              <BookingCalendar mentorId={mentorId} />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

// Helper components for consistent styling

const InfoItem = ({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) => (
  <div className="flex items-center gap-4">
    <Icon className="h-6 w-6 text-muted-foreground" />
    <div>
      <p className="font-semibold text-md">{label}</p>
      <p className="text-muted-foreground">{value}</p>
    </div>
  </div>
);

const WebsiteLink = ({ link }: { link: string }) => (
  <div className="flex items-center gap-4">
    <Globe className="h-6 w-6 text-muted-foreground" />
    <div>
      <p className="font-semibold text-md">Website</p>
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:underline flex items-center gap-1.5"
      >
        <span className="truncate max-w-[250px]">{link}</span>
        <ExternalLink className="h-4 w-4 shrink-0" />
      </a>
    </div>
  </div>
);

