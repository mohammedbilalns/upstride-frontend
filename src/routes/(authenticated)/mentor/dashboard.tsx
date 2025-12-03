import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Calendar, 
  Edit, 
  Users, 
  X 
} from "lucide-react";
import Pending from "@/components/common/Pending";
import UserAvatar from "@/components/common/UserAvatar";
import { fetchFolowers } from "@/features/connnections/services/connection.service";
import { 
  getSelf, 
} from "@/features/mentor/services/mentor.service";
import { authGuard } from "@/shared/guards/auth-gaurd";
import { useFetchFollowers } from "@/features/connnections/hooks/connections-queries.hooks";
import CreateRuleDialog from "@/features/mentor/dashboard/components/CreateRuleDialog";
import MentorRules from "@/features/mentor/dashboard/components/MentorRules";
import { useUpdateMentorProfile } from "@/features/mentor/dashboard/hooks/mentor-dashboard-mutations.hooks";
import GoToChat from "@/features/chats/components/GoToChat";

export const Route = createFileRoute("/(authenticated)/mentor/dashboard")({
  component: RouteComponent,
  beforeLoad: authGuard(["mentor"]),
  loader: async () => {
    return await Promise.all([
      getSelf(),
      fetchFolowers(1, 10)
    ]);
  }
});

function RouteComponent() {
  const [mentor, initialFollowers] = Route.useLoaderData();
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editedMentor, setEditedMentor] = useState(mentor);
  const updateMentorProfileMuation = useUpdateMentorProfile()
  console.log(initialFollowers)

  // Fetch followers with pagination
  const {
    data: followersData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: followersLoading
  } = useFetchFollowers();

  const handleSaveProfile = () => {
    console.table(editedMentor)
    const saveProfilePayload = {
      bio : editedMentor.bio,
      currentRole: editedMentor.currentRole,
      educationalQualifications: editedMentor.educationalQualifications,
      skills: editedMentor.skills.map(skill => skill.name),
      personalWebsite: editedMentor.personalWebsite
    }
    updateMentorProfileMuation.mutate(saveProfilePayload);
  };

  const handleCancelEdit = () => {
    setEditedMentor(mentor);
    setIsEditingProfile(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Mentor Dashboard</h1>
        <p className="text-muted-foreground">Manage your profile, followers, and session rules</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3  ">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="followers">Followers</TabsTrigger>
          <TabsTrigger value="rules">Session Rules</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Mentor Profile</CardTitle>
                <Button 
                  variant="outline" 
                  onClick={() => setIsEditingProfile(!isEditingProfile)}
                  disabled={updateMentorProfileMuation.isPending}
                >
                  {isEditingProfile ? <X className="h-4 w-4 mr-2" /> : <Edit className="h-4 w-4 mr-2" />}
                  {isEditingProfile ? "Cancel" : "Edit Profile"}
                </Button>
              </div>
              <CardDescription>
                {isEditingProfile ? "Update your profile information" : "Your mentor profile information"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-4">
                <UserAvatar
                  image={mentor?.user?.profilePicture}
                  name={mentor?.user?.name}
                  size={12}
                />
                <div>
                  <h2 className="text-2xl font-bold">{mentor?.user?.name}</h2>
                  <p className="text-muted-foreground">{mentor?.currentRole}</p>
                  <p className="text-muted-foreground">{mentor?.organisation}</p>
                </div>
              </div>

              {isEditingProfile ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="organisation" className="block text-sm font-medium mb-2">Organization</label>
                      <Input
                        id="organisation"
                        value={editedMentor.organisation}
                        onChange={(e) => setEditedMentor({
                          ...editedMentor,
                          organisation: e.target.value
                        })}
                      />
                    </div>
                    <div>
                      <label htmlFor="personalWebsite" className="block text-sm font-medium mb-2">Personal Website</label>
                      <Input
                        id="personalWebsite"
                        value={editedMentor.personalWebsite || ""}
                        onChange={(e) => setEditedMentor({
                          ...editedMentor,
                          personalWebsite: e.target.value
                        })}
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="bio" className="block text-sm font-medium mb-2">Bio</label>
                    <Textarea
                      id="bio"
                      rows={4}
                      value={editedMentor.bio}
                      onChange={(e) => setEditedMentor({
                        ...editedMentor,
                        bio: e.target.value
                      })}
                    />
                  </div>
                  <div>
                    <label htmlFor="skills" className="block text-sm font-medium mb-2">Skills (comma separated)</label>
                    <Input
                      id="skills"
                      value={editedMentor.skills.map(skill => skill.name).join(", ")}
                      onChange={(e) => setEditedMentor({
                        ...editedMentor,
                        skills: e.target.value.split(",").map(name => ({ 
                          id: Math.random().toString(36).substring(2, 9), 
                          name: name.trim() 
                        }))
                      })}
                    />
                  </div>
                  <div>
                    <label htmlFor="educationalQualifications" className="block text-sm font-medium mb-2">Educational Qualifications (one per line)</label>
                    <Textarea
                      id="educationalQualifications"
                      rows={4}
                      value={editedMentor.educationalQualifications.join("\n")}
                      onChange={(e) => setEditedMentor({
                        ...editedMentor,
                        educationalQualifications: e.target.value.split("\n").filter(q => q.trim())
                      })}
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={handleCancelEdit}>
                      Cancel
                    </Button>
                    <Button onClick={handleSaveProfile} disabled={updateMentorProfileMuation.isPending}>
                      {updateMentorProfileMuation.isPending ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-lg font-semibold">Contact Information</h3>
                      <p className="text-muted-foreground">Email: {mentor?.user?.email}</p>
                      {mentor.personalWebsite && (
                        <p className="text-muted-foreground">
                          Website: <a href={mentor.personalWebsite} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{mentor.personalWebsite}</a>
                        </p>
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">Professional Information</h3>
                      <p className="text-muted-foreground">Role: {mentor.currentRole}</p>
                      <p className="text-muted-foreground">Organization: {mentor.organisation}</p>
                      <p className="text-muted-foreground">Experience: {mentor.yearsOfExperience} years</p>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Bio</h3>
                    <p className="text-muted-foreground">{mentor.bio}</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Expertise</h3>
                    <Badge variant="default" className="text-md">
                      {mentor.expertise.name}
                    </Badge>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {mentor.skills.map((skill) => (
                        <Badge key={skill.id} variant="secondary">
                          {skill.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Educational Qualifications</h3>
                    <ul className="space-y-2">
                      {mentor.educationalQualifications.map((qualification, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                          <span className="text-muted-foreground">{qualification}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="followers" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Followers
              </CardTitle>
              <CardDescription>
                People who are following your mentor profile
              </CardDescription>
            </CardHeader>
            <CardContent>
              {followersLoading ? (
                <Pending resource="Followers" />
              ) : (
                <div className="space-y-4">
                  {followersData?.pages.flatMap(page => page).map((follower) => (
                    <div key={follower.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <UserAvatar
                          name={follower.followerId.name}
                          size={12}
                        />
                        <div>
                          <h3 className="font-medium">{follower.followerId.name}</h3>
                          <p className="text-sm text-muted-foreground">{follower.followerId.email}</p>
                        </div>
                      </div>
                        <GoToChat userId={follower.followerId._id} />
                    </div>
                  ))}
                  {hasNextPage && (
                    <div className="flex justify-center mt-4">
                      <Button
                        variant="outline"
                        onClick={() => fetchNextPage()}
                        disabled={isFetchingNextPage}
                      >
                        {isFetchingNextPage ? "Loading..." : "Load More"}
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rules" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Session Rules
                </CardTitle>
                <CreateRuleDialog mentorId={mentor.id} />
              </div>
              <CardDescription>
                Manage your session availability rules
              </CardDescription>
            </CardHeader>
            <CardContent>
              <MentorRules mentorId={mentor.id} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
