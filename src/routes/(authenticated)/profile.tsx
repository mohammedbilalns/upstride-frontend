import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/app/store/auth.store";
import { ExpertiseWithSkills } from "@/features/profile/components/ExpertiseWithSkills";
import { ChangePasswordForm } from "@/features/profile/components/ChangePasswordForm";
import { ImageCropper } from "@/components/ui/cropper";
import { type ProfileFormData } from "@/features/profile/schemas/profile.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { profileSchema } from "@/features/profile/schemas/profile.schema";
import { authGuard } from "@/app/guards/auth-gaurd";
import { Edit, Lock, Save, Upload, User, Plus } from "lucide-react";
import { useUpdateProfile } from "@/features/profile/hooks/useUpdateProfile";
import { useUploadMedia } from "@/shared/hooks/useUploadMedia";
import { useDeleteMedia } from "@/shared/hooks/useDeleteMedia";
import { toast } from "sonner";
import { queryClient } from "@/main";
import { fetchProfile } from "@/features/profile/services/profile.service";
import { createFileRoute } from "@tanstack/react-router";
import { useFetchExpertiseAreas } from "@/features/auth/hooks";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { CloudinaryResponse } from "@/shared/types/cloudinaryResponse";

export const Route = createFileRoute("/(authenticated)/profile")({
  component: RouteComponent,
  beforeLoad: authGuard(),
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
  const [newExpertiseId, setNewExpertiseId] = useState("");
  const [uploadedImage, setUploadedImage] = useState<CloudinaryResponse | null>(null);
  const [showCropper, setShowCropper] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string>("");
  
  const expertiseIds = loaderData.interestedExpertises?.map((e: any) => e._id) || [];
  const skillIds = loaderData.interestedSkills?.map((s: any) => s._id) || [];
  
  const updateProfileMutation = useUpdateProfile();
  const { handleUpload, isUploading, uploadProgress } = useUploadMedia();
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
      // Convert the cropped image blob to a File
      const response = await fetch(croppedImage);
      const blob = await response.blob();
      const file = new File([blob], "profile.jpg", { type: "image/jpeg" });
      
      // Upload the cropped image
      const result = await handleUpload(file);
      form.setValue("profilePicture", result.secure_url);
      form.setValue("profilePictureType", result.resource_type);
      setUploadedImage(result);
      toast.success("Profile picture uploaded successfully");
      
      // Clean up the blob URL
      URL.revokeObjectURL(croppedImage);
    } catch (error) {
      toast.error("Failed to upload profile picture");
    }
    
    setShowCropper(false);
    setSelectedImage("");
  };

  const handleAddExpertise = () => {
    if (newExpertiseId && !form.getValues("interestedExpertises")?.includes(newExpertiseId)) {
      const currentExpertises = form.getValues("interestedExpertises") || [];
      form.setValue("interestedExpertises", [...currentExpertises, newExpertiseId]);
      setNewExpertiseId("");
    }
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Sidebar */}
        <Card className="lg:col-span-1">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center">
              {form.watch("profilePicture") ? (
                <img
                  src={form.watch("profilePicture")}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover mb-4"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center mb-4">
                  <User className="w-12 h-12 text-gray-400" />
                </div>
              )}
              {isEditing && (
                <div className="mb-4">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    disabled={isUploading}
                    className="hidden"
                    id="profile-picture-upload"
                  />
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="cursor-pointer"
                    onClick={() => document.getElementById('profile-picture-upload')?.click()}
                    disabled={isUploading}
                  >
                    <Upload className="h-4 w-4 mr-1" />
                    Upload Photo
                  </Button>
                </div>
              )}
              <h2 className="text-xl font-semibold mb-2">{form.watch("name")}</h2>
              <Badge variant="default" className="mb-4">
                {loaderData.role === "mentor" ? "Mentor" : "User"}
              </Badge>
              {isEditing ? (
                <div className="flex space-x-2 mb-4">
                  <Button variant="outline" className="cursor-pointer" size="sm" onClick={toggleEditMode}>
                    Cancel
                  </Button>
                  <Button size="sm" className="cursor-pointer" onClick={form.handleSubmit(onSubmit)}>
                    <Save className="h-4 w-4 mr-1" />
                    Save
                  </Button>
                </div>
              ) : (
                <Button variant="outline" size="sm" onClick={toggleEditMode} className="mb-4 cursor-pointer">
                  <Edit className="h-4 w-4 mr-1" />
                  Edit Profile
                </Button>
              )}
              <div className="w-full">
                <h3 className="font-medium mb-2">Account Settings</h3>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start mb-1 cursor-pointer"
                  onClick={() => setShowChangePassword(!showChangePassword)}
                >
                  <Lock className="h-4 w-4 mr-2" />
                  Change Password
                </Button>
                
                {showChangePassword && (
                  <div className="mt-2 w-full">
                    <ChangePasswordForm 
                      onSuccess={() => setShowChangePassword(false)} 
                    />
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Content */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>My Profile</CardTitle>
            <p className="text-sm text-muted-foreground">
              Manage your profile information and preferences.
            </p>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Personal Information */}
                <div>
                  <h3 className="text-lg font-medium mb-4">Personal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input {...field} disabled={!isEditing} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div>
                      <FormLabel>Email</FormLabel>
                      <Input 
												className="mt-2"
                        value={loaderData.email || ""} 
                        type="email" 
                        disabled={true} 
                      />
                    </div>
                    <div>
                      <FormLabel>Phone</FormLabel>
                      <Input 
												className="mt-2"
                        value={loaderData.phone || ""} 
                        disabled={true} 
                      />
                    </div>
                  </div>
                </div>

                {/* Expertises and Skills */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium">Interested Areas & Skills</h3>
                    {isEditing && (
                      <div className="flex items-center gap-2">
                        <Select value={newExpertiseId} onValueChange={setNewExpertiseId}>
                          <SelectTrigger className="w-48">
                            <SelectValue placeholder="Select expertise" />
                          </SelectTrigger>
                          <SelectContent>
                            {expertiseOptions
                              .filter((option: any) => !form.getValues("interestedExpertises")?.includes(option.id))
                              .map((option: any) => (
                                <SelectItem key={option.id} value={option.id}>
                                  {option.name}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={handleAddExpertise}
                          disabled={!newExpertiseId}
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Add
                        </Button>
                      </div>
                    )}
                  </div>

                  {form.watch("interestedExpertises")?.map((expertiseId) => (
                    <ExpertiseWithSkills
                      key={expertiseId}
                      expertiseId={expertiseId}
                      isEditing={isEditing}
                      selectedSkills={form.watch("interestedSkills") || []}
                      onUpdateSkills={handleUpdateSkills}
                      onRemoveExpertise={() => handleRemoveExpertise(expertiseId)}
                    />
                  ))}
                </div>

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
            </Form>
          </CardContent>
        </Card>
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
          aspectRatio={1} // Square aspect ratio for profile picture
        />
      )}
    </div>
  );
}
