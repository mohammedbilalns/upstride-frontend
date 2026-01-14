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
import { useFetchExpertiseAreas } from "@/features/authentication/hooks/onboarding.hooks";
import { ExpertiseSkills } from "@/features/userprofile/components/Expertises";
import { PersonalInfo } from "@/features/userprofile/components/PersonalInfo";
import { ProfileSidebar } from "@/features/userprofile/components/ProfileSideBar";
import { QuickStats } from "@/features/userprofile/components/QuickStats";
import { useUpdateProfile } from "@/features/userprofile/hooks/profile-mutataions.hooks";
import type { ProfileFormData } from "@/features/userprofile/schemas/profile.schema";
import { profileSchema } from "@/features/userprofile/schemas/profile.schema";
import { fetchProfile } from "@/features/userprofile/services/profile.service";
import { useDeleteMedia } from "@/shared/hooks/useDeleteMedia";
import { useUploadMedia } from "@/shared/hooks/useUploadMedia";
import type { CloudinaryResponse } from "@/shared/types/cloudinaryResponse";
import { authGuard } from "@/shared/guards/auth-gaurd";

export const Route = createFileRoute("/(authenticated)/profile")({
	component: RouteComponent,
  beforeLoad: authGuard(["user","mentor"]),
	loader: async ({ context }) => {
		const { user } = useAuthStore.getState();
		if (!user) return;
		return context.queryClient.fetchQuery({
			queryKey: ["profile",user.id],
			queryFn: () => fetchProfile(user?.id),
		});
	},
});

function RouteComponent() {
	const loaderData = Route.useLoaderData();
	const { user } = useAuthStore();

	const [isEditing, setIsEditing] = useState(false);
	const [showChangePassword, setShowChangePassword] = useState(false);
	const [uploadedImage, setUploadedImage] = useState<CloudinaryResponse | null>(
		null,
	);
	const [showCropper, setShowCropper] = useState(false);
	const [selectedImage, setSelectedImage] = useState<string>("");

	const expertiseIds =
		loaderData.interestedExpertises?.map((e: { _id: string }) => e._id) || [];
	const skillIds =
		loaderData.interestedSkills?.map((s: { _id: string }) => s._id) || [];

	const updateProfileMutation = useUpdateProfile();
	const { handleUpload, isUploading } = useUploadMedia();
	const deleteMediaMutation = useDeleteMedia();
	const { data: expertiseData } = useFetchExpertiseAreas();
	const expertiseOptions = expertiseData?.expertises || [];

	const form = useForm<ProfileFormData>({
		resolver: zodResolver(profileSchema),
		defaultValues: {
			id: loaderData.id || user?.id,
			name: loaderData.name || "",
			profilePicture: loaderData.profilePicture || "",
			profilePictureType: loaderData.profilePictureType || "",
			interestedExpertises: expertiseIds,
			interestedSkills: skillIds,
		},
	});

	const toggleEditMode = () => {
		if (isEditing) {
			form.reset();
			setUploadedImage(null);
		}
		setIsEditing(!isEditing);
	};

	const onSubmit = async (data: ProfileFormData) => {
		const payload: Partial<ProfileFormData> = {
			id: data.id,
			name: data.name,
			interestedExpertises: data.interestedExpertises,
			interestedSkills: data.interestedSkills,
		};

		if (uploadedImage) {
      //FIX: type error
			payload.profilePicture = {
				public_id: uploadedImage.public_id,
				original_filename: uploadedImage.original_filename,
				resource_type: uploadedImage.resource_type,
				secure_url: uploadedImage.secure_url,
				bytes: uploadedImage.bytes,
				asset_folder: uploadedImage.asset_folder,
			};

			if (loaderData.profilePictureId) {
				try {
					await deleteMediaMutation.mutateAsync({
						fileId: loaderData.profilePictureId,
						mediaType: loaderData.profilePictureType || "image",
					});
				} catch (error) {
					console.error("Failed to delete old profile picture:", error);
				}
			}
		}

		updateProfileMutation.mutate(payload as ProfileFormData);
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

			URL.revokeObjectURL(croppedImage);
		} catch (error) {
			console.error("Failed to upload profile picture", error);
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

	const profilePictureValue = form.watch("profilePicture");
	const profilePictureUrl =
		typeof profilePictureValue === "object"
			? profilePictureValue?.secure_url || ""
			: profilePictureValue || "";

	return (
		<div className=" min-h[calc(100vh-5rem)] container mx-auto p-4 md:p-6">
			<div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
				{/* Left Sidebar */}
				<div className="lg:col-span-1 space-y-6 lg:sticky lg:top-6 self-start h-fit">
					<ProfileSidebar
						profilePicture={profilePictureUrl}
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

				{/* Main Content */}
				<div className="lg:col-span-3">
					<Card>
						<CardHeader>
							<CardTitle>My Profile</CardTitle>
							<p className="text-sm text-muted-foreground">
								Manage your profile information and preferences.
							</p>
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

									<ExpertiseSkills
										isEditing={isEditing}
										expertiseOptions={expertiseOptions}
										onUpdateSkills={handleUpdateSkills}
										onRemoveExpertise={handleRemoveExpertise}
									/>

									{isEditing && (
										<div className="flex justify-end space-x-2 pt-4">
											<Button
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
								</form>
							</FormProvider>
						</CardContent>
					</Card>
				</div>
			</div>

			{/* Image Cropper Modal */}
			{showCropper && (
				<ImageCropper
					imageSrc={selectedImage}
					onCropComplete={handleCropComplete}
					onClose={() => {
						setShowCropper(false);
						setSelectedImage("");
					}}
					aspectRatio={1}
				/>
			)}
		</div>
	);
}
