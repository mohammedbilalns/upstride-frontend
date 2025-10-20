import { Edit, Lock, Save, Upload, User } from "lucide-react";
import type React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ChangePasswordForm } from "./ChangePasswordForm";

interface ProfileSidebarProps {
	profilePicture: string;
	name: string;
	role: string;
	isEditing: boolean;
	isUploading: boolean;
	showChangePassword: boolean;
	onImageSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
	onToggleEdit: () => void;
	onSave: () => void;
	onTogglePasswordForm: () => void;
}

export function ProfileSidebar({
	profilePicture,
	name,
	role,
	isEditing,
	isUploading,
	showChangePassword,
	onImageSelect,
	onToggleEdit,
	onSave,
	onTogglePasswordForm,
}: ProfileSidebarProps) {
	return (
		<Card className="lg:col-span-1 h-fit">
			<CardContent className="pt-6">
				<div className="flex flex-col items-center">
					{profilePicture ? (
						<img
							src={profilePicture}
							alt="Profile"
							className="w-24 h-24 rounded-full object-cover mb-4"
						/>
					) : (
						<div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mb-4">
							<User className="w-12 h-12 text-muted-foreground" />
						</div>
					)}
					{isEditing && (
						<div className="mb-4">
							<Input
								type="file"
								accept="image/*"
								onChange={onImageSelect}
								disabled={isUploading}
								className="hidden"
								id="profile-picture-upload"
							/>
							<Button
								variant="outline"
								size="sm"
								className="cursor-pointer"
								onClick={() =>
									document.getElementById("profile-picture-upload")?.click()
								}
								disabled={isUploading}
							>
								<Upload className="h-4 w-4 mr-1" />
								Upload Photo
							</Button>
						</div>
					)}
					<h2 className="text-xl font-semibold mb-2">{name}</h2>
					<Badge
						variant={role === "mentor" ? "default" : "secondary"}
						className="mb-4"
					>
						{role === "mentor" ? "Mentor" : "User"}
					</Badge>
					{isEditing ? (
						<div className="flex space-x-2 mb-4">
							<Button
								variant="outline"
								size="sm"
								className="cursor-pointer"
								onClick={onToggleEdit}
							>
								Cancel
							</Button>
							<Button className="cursor-pointer" size="sm" onClick={onSave}>
								<Save className="h-4 w-4 mr-1" />
								Save
							</Button>
						</div>
					) : (
						<Button
							variant="outline"
							size="sm"
							onClick={onToggleEdit}
							className="mb-4 cursor-pointer"
						>
							<Edit className="h-4 w-4 mr-1" />
							Edit Profile
						</Button>
					)}
					<div className="w-full">
						<h3 className="font-medium mb-2">Account Settings</h3>
						<Button
							variant="ghost"
							className="w-full justify-start mb-1"
							onClick={onTogglePasswordForm}
						>
							<Lock className="h-4 w-4 mr-2" />
							Change Password
						</Button>

						{showChangePassword && (
							<div className="mt-2 w-full">
								<ChangePasswordForm onSuccess={() => onTogglePasswordForm()} />
							</div>
						)}
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
