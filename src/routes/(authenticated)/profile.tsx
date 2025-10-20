import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute } from "@tanstack/react-router";
import { Save } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";
import { useAuthStore } from "@/app/store/auth.store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ImageCropper } from "@/components/ui/cropper";
import { useFetchExpertiseAreas } from "@/features/auth/hooks";
import { ExpertiseSkills } from "@/features/profile/components/Expertises";
import { PersonalInfo } from "@/features/profile/components/PersonalInfo";
import { ProfileSidebar } from "@/features/profile/components/ProfileSideBar";
import { QuickStats } from "@/features/profile/components/QuickStats";
import { useUpdateProfile } from "@/features/profile/hooks/useUpdateProfile";
import type { ProfileFormData } from "@/features/profile/schemas/profile.schema";
import { profileSchema } from "@/features/profile/schemas/profile.schema";
import { fetchProfile } from "@/features/profile/services/profile.service";
import { queryClient } from "@/main";
import { useDeleteMedia } from "@/shared/hooks/useDeleteMedia";
import { useUploadMedia } from "@/shared/hooks/useUploadMedia";
import type { CloudinaryResponse } from "@/shared/types/cloudinaryResponse";

export const Route = createFileRoute("/(authenticated)/profile")({
	component: RouteComponent,
	loader: async () => {
		const { user } = useAuthStore.getState();
		if (!user) return;
		return queryClient.fetchQuery({
			queryKey: ["profile"],
			queryFn: () => fetchProfile(user?.id),
		});
	},
});

function RouteComponent() {
	const [isMentor, setIsMentor] = React.useState(true);

	const [isEditing, setIsEditing] = useState(false);
	const [showChangePassword, setShowChangePassword] = useState(false);
	const [uploadedImage, setUploadedImage] = useState<CloudinaryResponse | null>(
		null,
	);
	const [showCropper, setShowCropper] = useState(false);
	const [selectedImage, setSelectedImage] = useState<string>("");

	const expertiseIds =
		loaderData.interestedExpertises?.map((e: any) => e._id) || [];
	const skillIds = loaderData.interestedSkills?.map((s: any) => s._id) || [];

	const [newExpertise, setNewExpertise] = React.useState("");

	const [newSkills, setNewSkills] = React.useState<Record<number, string[]>>(
		{},
	);

	// Handle input changes
	const handleInputChange = (
		field: keyof ProfileData,
		value: string | number,
	) => {
		setProfileData((prev) => ({ ...prev, [field]: value }));
	};

	// Handle expertise changes
	const handleExpertiseChange = (index: number, value: string) => {
		const updatedExpertises = [...profileData.expertises];
		updatedExpertises[index].name = value;
		setProfileData((prev) => ({ ...prev, expertises: updatedExpertises }));
	};

	// Add new expertise
	const addExpertise = () => {
		if (
			newExpertise &&
			!profileData.expertises.some((e) => e.name === newExpertise)
		) {
			setProfileData((prev) => ({
				...prev,
				expertises: [...prev.expertises, { name: newExpertise, skills: [] }],
			}));
			setNewExpertise("");
		}
	};

	// Remove expertise
	const removeExpertise = (index: number) => {
		const updatedExpertises = [...profileData.expertises];
		updatedExpertises.splice(index, 1);
		setProfileData((prev) => ({ ...prev, expertises: updatedExpertises }));
	};

	// Add new skill to expertise
	const addSkill = (expertiseIndex: number) => {
		const skill = newSkills[expertiseIndex]?.[0];
		if (
			skill &&
			!profileData.expertises[expertiseIndex].skills.includes(skill)
		) {
			const updatedExpertises = [...profileData.expertises];
			updatedExpertises[expertiseIndex].skills.push(skill);
			setProfileData((prev) => ({ ...prev, expertises: updatedExpertises }));

			// Clear the selected skill
			setNewSkills((prev) => ({ ...prev, [expertiseIndex]: [] }));
		}
	};

	// Remove skill from expertise
	const removeSkill = (expertiseIndex: number, skillIndex: number) => {
		const updatedExpertises = [...profileData.expertises];
		updatedExpertises[expertiseIndex].skills.splice(skillIndex, 1);
		setProfileData((prev) => ({ ...prev, expertises: updatedExpertises }));
	};

	// Handle qualification changes
	const handleQualificationChange = (index: number, value: string) => {
		const updatedQualifications = [
			...(profileData.educationalQualifications || []),
		];
		updatedQualifications[index] = value;
		setProfileData((prev) => ({
			...prev,
			educationalQualifications: updatedQualifications,
		}));
	};

	// Add new qualification
	const addQualification = () => {
		setProfileData((prev) => ({
			...prev,
			educationalQualifications: [
				...(prev.educationalQualifications || []),
				"",
			],
		}));
	};

	// Remove qualification
	const removeQualification = (index: number) => {
		const updatedQualifications = [
			...(profileData.educationalQualifications || []),
		];
		updatedQualifications.splice(index, 1);
		setProfileData((prev) => ({
			...prev,
			educationalQualifications: updatedQualifications,
		}));
	};

	// Toggle edit mode
	const toggleEditMode = () => {
		setIsEditing(!isEditing);
	};

	// Save profile
	const saveProfile = () => {
		// Here you would typically send the data to your backend
		console.log("Saving profile:", profileData);
		setIsEditing(false);
		setUploadedImage(null);
	};

	const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files[0]) {
			const file = e.target.files[0];
			const reader = new FileReader();

			reader.onload = (event) => {
				if (event.target?.result) {
					setSelectedImage(event.target.result as string);
					setShowCropper(true);
				}
			};

			reader.readAsDataURL(file);
		}
	};

	const handleCropComplete = async (croppedImage: string) => {
		try {
			const response = await fetch(croppedImage);
			const blob = await response.blob();
			const file = new File([blob], "profile.jpg", { type: "image/jpeg" });

			const result = await handleUpload(file);
			form.setValue("profilePicture", result.secure_url);
			form.setValue("profilePictureType", result.resource_type);
			setUploadedImage(result);
			toast.success("Profile picture uploaded successfully");

			URL.revokeObjectURL(croppedImage);
		} catch (error) {
			toast.error("Failed to upload profile picture");
		}

		setShowCropper(false);
		setSelectedImage("");
	};

	const handleRemoveExpertise = (expertiseId: string) => {
		const currentExpertises = form.getValues("interestedExpertises") || [];
		form.setValue(
			"interestedExpertises",
			currentExpertises.filter((id) => id !== expertiseId),
		);
	};

	const handleUpdateSkills = (skills: string[]) => {
		form.setValue("interestedSkills", skills);
	};

	return (
		<div className="container mx-auto p-4 md:p-6">
			<div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
				{/* Left Sidebar */}
				<div className="lg:col-span-1 space-y-6">
					<ProfileSidebar
						profilePicture={form.watch("profilePicture")}
						name={form.watch("name")}
						role={loaderData.role}
						isEditing={isEditing}
						isUploading={isUploading}
						showChangePassword={showChangePassword}
						onImageSelect={handleImageSelect}
						onToggleEdit={toggleEditMode}
						onSave={form.handleSubmit(onSubmit)}
						onTogglePasswordForm={() =>
							setShowChangePassword(!showChangePassword)
						}
					/>

					<QuickStats
						expertiseCount={form.watch("interestedExpertises")?.length || 0}
						skillsCount={form.watch("interestedSkills")?.length || 0}
						role={loaderData.role}
					/>
				</div>

					<Card>
						<CardHeader>
							<CardTitle className="text-lg">Account Settings</CardTitle>
						</CardHeader>
						<CardContent>
							<FormProvider {...form}>
								<form
									onSubmit={form.handleSubmit(onSubmit)}
									className="space-y-6"
								>
									<PersonalInfo
										email={loaderData.email}
										phone={loaderData.phone}
										isEditing={isEditing}
									/>

				{/* Profile Content */}
				<div className="w-full md:w-2/3 space-y-6">
					{/* Personal Information */}
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<User className="h-5 w-5" />
								Personal Information
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div>
								<Label htmlFor="name">Name</Label>
								<Input
									id="name"
									value={profileData.name}
									onChange={(e) => handleInputChange("name", e.target.value)}
									disabled={!isEditing}
								/>
							</div>

									{isEditing && (
										<div className="flex justify-end space-x-2 pt-4">
											<Button
												className="cursor-pointer"
												type="button"
												variant="outline"
												onClick={toggleEditMode}
											>
												Cancel
											</Button>
											<Button
												className="cursor-pointer"
												type="submit"
												disabled={updateProfileMutation.isPending}
											>
												<Save className="h-4 w-4 mr-2" />
												{updateProfileMutation.isPending
													? "Saving..."
													: "Save Changes"}
											</Button>
										</div>
									)}
								</div>
								<div className="space-y-4">
									{profileData.expertises.map((expertise, expertiseIndex) => (
										<div key={expertiseIndex} className="border rounded-lg p-4">
											<div className="flex items-center justify-between mb-2">
												<div className="flex items-center gap-2">
													{isEditing ? (
														<Select
															value={expertise.name}
															onValueChange={(value) =>
																handleExpertiseChange(expertiseIndex, value)
															}
														>
															<SelectTrigger className="w-48">
																<SelectValue />
															</SelectTrigger>
															<SelectContent>
																{expertiseOptions.map((option) => (
																	<SelectItem key={option} value={option}>
																		{option}
																	</SelectItem>
																))}
															</SelectContent>
														</Select>
													) : (
														<Badge variant="secondary">{expertise.name}</Badge>
													)}
												</div>
												{isEditing && (
													<Button
														variant="ghost"
														size="sm"
														onClick={() => removeExpertise(expertiseIndex)}
													>
														<X className="h-4 w-4" />
													</Button>
												)}
											</div>

											<div className="mb-2">
												<div className="flex items-center justify-between mb-2">
													<Label className="text-sm">Skills</Label>
													{isEditing && (
														<div className="flex items-center gap-2">
															<Select
																value={newSkills[expertiseIndex]?.[0] || ""}
																onValueChange={(value) =>
																	setNewSkills((prev) => ({
																		...prev,
																		[expertiseIndex]: [value],
																	}))
																}
															>
																<SelectTrigger className="w-48">
																	<SelectValue placeholder="Select skill" />
																</SelectTrigger>
																<SelectContent>
																	{skillOptions[expertise.name]?.map(
																		(skill) => (
																			<SelectItem key={skill} value={skill}>
																				{skill}
																			</SelectItem>
																		),
																	)}
																</SelectContent>
															</Select>
															<Button
																variant="outline"
																size="sm"
																onClick={() => addSkill(expertiseIndex)}
																disabled={!newSkills[expertiseIndex]?.[0]}
															>
																<Plus className="h-4 w-4 mr-1" />
																Add
															</Button>
														</div>
													)}
												</div>
												<div className="flex flex-wrap gap-2 mt-2">
													{expertise.skills.map((skill, skillIndex) => (
														<Badge
															key={skillIndex}
															variant="outline"
															className="flex items-center"
														>
															{skill}
															{isEditing && (
																<button
																	className="ml-2 hover:text-foreground"
																	onClick={() =>
																		removeSkill(expertiseIndex, skillIndex)
																	}
																>
																	<X className="h-3 w-3" />
																</button>
															)}
														</Badge>
													))}
												</div>
											</div>
										</div>
									))}
								</div>
							</div>

							{isEditing && (
								<div className="flex justify-end space-x-2">
									<Button variant="outline" onClick={toggleEditMode}>
										Cancel
									</Button>
									<Button onClick={saveProfile}>
										<Save className="h-4 w-4 mr-2" />
										Save Changes
									</Button>
								</div>
							)}
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
