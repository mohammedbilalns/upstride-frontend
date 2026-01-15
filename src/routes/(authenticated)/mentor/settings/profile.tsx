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
import { Edit, X } from "lucide-react";
import UserAvatar from "@/components/common/UserAvatar";
import { getSelf } from "@/features/mentor-discovery/services/mentor.service";
import { authGuard } from "@/shared/guards/auth-gaurd";
import { useUpdateMentorProfile } from "@/features/mentor-portal/hooks/mentor-dashboard-mutations.hooks";
import { FormProvider, useForm } from "react-hook-form";
import SkillSelection from "@/features/mentor-discovery/registration/components/skillSelection";
import { router } from "@/app/router/routerConfig";
import type { ProfileFormPayload } from "@/shared/types/profile";

export const Route = createFileRoute("/(authenticated)/mentor/settings/profile")({
    component: ProfileSettingsPage,
    beforeLoad: authGuard(["mentor"]),
    loader: async () => {
        return await getSelf();
    }
});

function ProfileSettingsPage() {
    const mentor = Route.useLoaderData();
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [newSkills, setNewSkills] = useState<string[]>([]);
    const updateMentorProfileMuation = useUpdateMentorProfile();

    const form = useForm({
        defaultValues: {
            bio: mentor.bio,
            currentRole: mentor.currentRole,
            organisation: mentor.organisation,
            personalWebsite: mentor.personalWebsite,
            educationalQualificationsText: mentor.educationalQualifications.join("\n"),
            skills: mentor.skills.map((s) => s.id)
        }
    });

    const handleSaveProfile = (values: ProfileFormPayload) => {
        const saveProfilePayload = {
            bio: values.bio,
            currentRole: values.currentRole,
            organisation: values.organisation,
            educationalQualifications: values?.educationalQualificationsText.split("\n").filter(q => q.trim()),
            skills: values.skills,
            personalWebsite: values.personalWebsite,
            newSkills: newSkills
        }
        updateMentorProfileMuation.mutate(saveProfilePayload, {
            onSuccess: async () => {
                setIsEditingProfile(false)
                setNewSkills([])
                await router.invalidate({ sync: true })
            }
        });
    };

    const handleCancelEdit = () => {
        form.reset()
        setNewSkills([])
        setIsEditingProfile(false);
    };

    return (
        <div className="space-y-6">
            <Card className="hover:shadow-md transition-shadow">
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle>Profile Information</CardTitle>
                            <CardDescription>
                                Update your mentor profile details visible to students.
                            </CardDescription>
                        </div>
                        <Button
                            variant="outline"
                            onClick={() => setIsEditingProfile(!isEditingProfile)}
                            disabled={updateMentorProfileMuation.isPending}
                        >
                            {isEditingProfile ? <X className="h-4 w-4 mr-2" /> : <Edit className="h-4 w-4 mr-2" />}
                            {isEditingProfile ? "Cancel" : "Edit Profile"}
                        </Button>
                    </div>
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
                        <FormProvider {...form}>
                            <form className="space-y-4" onSubmit={form.handleSubmit(handleSaveProfile)}>

                                {/* Organisation */}
                                <div>
                                    <label className="block text-sm font-medium mb-2">Organization</label>
                                    <Input {...form.register("organisation")} />
                                </div>
                                {/* Role */}
                                <div>
                                    <label className="block text-sm font-medium mb-2">Current Role</label>
                                    <Input {...form.register("currentRole")} />
                                </div>

                                {/* Personal Website */}
                                <div>
                                    <label className="block text-sm font-medium mb-2">Personal Website</label>
                                    <Input {...form.register("personalWebsite")} />
                                </div>

                                {/* Bio */}
                                <div>
                                    <label className="block text-sm font-medium mb-2">Bio</label>
                                    <Textarea rows={4} {...form.register("bio")} />
                                </div>

                                {/* Skills */}
                                <SkillSelection
                                    expertiseId={mentor.expertise.id}
                                    newSkills={newSkills}
                                    setNewSkills={setNewSkills}
                                    mode="update"
                                />

                                {/* Educational Qualifications */}
                                <div>
                                    <label className="block text-sm font-medium mb-2">Educational Qualifications (one per line)</label>
                                    <Textarea
                                        rows={4}
                                        {...form.register("educationalQualificationsText")}
                                    />
                                </div>

                                {/* Buttons */}
                                <div className="flex justify-end space-x-2">
                                    <Button type="button" variant="outline" onClick={handleCancelEdit}>
                                        Cancel
                                    </Button>
                                    <Button type="submit" disabled={updateMentorProfileMuation.isPending}>
                                        {updateMentorProfileMuation.isPending ? "Saving..." : "Save Changes"}
                                    </Button>
                                </div>
                            </form>
                        </FormProvider>

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
        </div>
    );
}
