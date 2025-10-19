import React, { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthStore } from "@/app/store/auth.store";
import { ProfileSidebar } from "@/features/profile/components/ProfileSideBar";
import { PersonalInfo } from "@/features/profile/components/PersonalInfo";
import { ExpertiseSkills } from "@/features/profile/components/Expertises";
import { QuickStats } from "@/features/profile/components/QuickStats";
import { ImageCropper } from "@/components/ui/cropper";
import type { ProfileFormData } from "@/features/profile/schemas/profile.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileSchema } from "@/features/profile/schemas/profile.schema";
import { Save } from "lucide-react";
import { useUpdateProfile } from "@/features/profile/hooks/useUpdateProfile";
import { useUploadMedia } from "@/shared/hooks/useUploadMedia";
import { useDeleteMedia } from "@/shared/hooks/useDeleteMedia";
import { toast } from "sonner";
import { queryClient } from "@/main";
import { fetchProfile } from "@/features/profile/services/profile.service";
import { createFileRoute } from "@tanstack/react-router";
import { useFetchExpertiseAreas } from "@/features/auth/hooks";
import type { CloudinaryResponse } from "@/shared/types/cloudinaryResponse";

export const Route = createFileRoute("/(authenticated)/profile")({
	component: RouteComponent,
	loader: async () => {
		const { user } = useAuthStore.getState();
		if (!user) return;
		return queryClient.fetchQuery({
			queryKey: ["profile"],
			queryFn: () => fetchProfile(user?.id)
		});
	}
});

function RouteComponent() {
	const loaderData = Route.useLoaderData();
	const { user } = useAuthStore();

	const [isEditing, setIsEditing] = useState(false);
	const [showChangePassword, setShowChangePassword] = useState(false);
	const [uploadedImage, setUploadedImage] = useState<CloudinaryResponse | null>(null);
	const [showCropper, setShowCropper] = useState(false);
	const [selectedImage, setSelectedImage] = useState<string>("");

	const expertiseIds = loaderData.interestedExpertises?.map((e: any) => e._id) || [];
	const skillIds = loaderData.interestedSkills?.map((s: any) => s._id) || [];

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
		const payload = {
			id: data.id,
			name: data.name,
			interestedExpertises: data.interestedExpertises,
			interestedSkills: data.interestedSkills,
		};

		if (uploadedImage) {
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

		updateProfileMutation.mutate(payload);
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
		form.setValue("interestedExpertises", currentExpertises.filter(id => id !== expertiseId));
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
						onTogglePasswordForm={() => setShowChangePassword(!showChangePassword)}
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
								<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
											<Button className="cursor-pointer" type="button" variant="outline" onClick={toggleEditMode}>
												Cancel
											</Button>
											<Button className="cursor-pointer" type="submit" disabled={updateProfileMutation.isPending}>
												<Save className="h-4 w-4 mr-2" />
												{updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
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
