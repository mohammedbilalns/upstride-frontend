import { createFileRoute } from "@tanstack/react-router";
import {
	BookOpen,
	Edit,
	Lock,
	Plus,
	Save,
	Upload,
	User,
	X,
} from "lucide-react";
import React, { useId } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

// Updated profile data structure
interface ProfileData {
	name: string;
	email: string;
	phone: string;
	profilePicture?: string;
	expertises: {
		name: string;
		skills: string[];
	}[];
	// Mentor-only fields
	bio?: string;
	currentRole?: string;
	institution?: string;
	yearsOfExperience?: number;
	educationalQualifications?: string[];
	personalWebsite?: string;
	resumePdf?: string;
}

// Dummy profile data
const dummyProfile: ProfileData = {
	name: "Alex Johnson",
	email: "alex.johnson@example.com",
	phone: "+1 (555) 123-4567",
	profilePicture: "",
	expertises: [
		{
			name: "Web Development",
			skills: ["React", "Node.js", "TypeScript"],
		},
		{
			name: "Leadership",
			skills: ["Team Management", "Project Planning"],
		},
	],
	bio: "Passionate software developer with 5 years of experience in web development. Currently focusing on React and Node.js technologies.",
	currentRole: "Senior Software Developer",
	institution: "Tech University",
	yearsOfExperience: 5,
	educationalQualifications: [
		"BSc in Computer Science",
		"MSc in Software Engineering",
	],
	personalWebsite: "https://alexjohnson.dev",
	resumePdf: "/path/to/resume.pdf",
};

// Expertise options
const expertiseOptions = [
	"Web Development",
	"Mobile Development",
	"Data Science",
	"Machine Learning",
	"DevOps",
	"Cloud Computing",
	"Cybersecurity",
	"UI/UX Design",
	"Product Management",
	"Leadership",
	"Marketing",
	"Sales",
	"Other",
];

// Skill options mapped to expertise
const skillOptions: Record<string, string[]> = {
	"Web Development": [
		"HTML",
		"CSS",
		"JavaScript",
		"React",
		"Angular",
		"Vue",
		"Node.js",
		"Express",
		"Django",
		"Flask",
	],
	"Mobile Development": [
		"iOS",
		"Android",
		"React Native",
		"Flutter",
		"Xamarin",
	],
	"Data Science": ["Python", "R", "SQL", "Tableau", "Power BI", "Excel"],
	"Machine Learning": [
		"TensorFlow",
		"PyTorch",
		"Scikit-learn",
		"Keras",
		"Pandas",
		"NumPy",
	],
	DevOps: [
		"Docker",
		"Kubernetes",
		"Jenkins",
		"Git",
		"AWS",
		"Azure",
		"Google Cloud",
	],
	"Cloud Computing": ["AWS", "Azure", "Google Cloud", "Heroku", "DigitalOcean"],
	Cybersecurity: [
		"Network Security",
		"Ethical Hacking",
		"Cryptography",
		"Firewalls",
		"VPN",
	],
	"UI/UX Design": ["Figma", "Sketch", "Adobe XD", "InVision", "Principle"],
	"Product Management": [
		"Agile",
		"Scrum",
		"JIRA",
		"Trello",
		"Product Strategy",
	],
	Leadership: [
		"Team Management",
		"Project Management",
		"Strategic Planning",
		"Communication",
	],
	Marketing: [
		"Digital Marketing",
		"Content Marketing",
		"SEO",
		"SEM",
		"Social Media",
	],
	Sales: ["Sales Strategy", "Negotiation", "CRM", "Lead Generation", "Closing"],
	Other: [],
};

// Account settings options (only two items)
const accountSettings = [
	{ id: "security", label: "Change Password", icon: Lock },
	{ id: "articles", label: "My Articles", icon: BookOpen },
];

export const Route = createFileRoute("/(authenticated)/profile")({
	component: RouteComponent,
});

function RouteComponent() {
	const [isMentor, setIsMentor] = React.useState(true);
	const [profileData, setProfileData] =
		React.useState<ProfileData>(dummyProfile);
	const [isEditing, setIsEditing] = React.useState(false);
	const [newExpertise, setNewExpertise] = React.useState("");
	const [newSkills, setNewSkills] = React.useState<Record<number, string[]>>(
		{},
	);
	const baseId = useId();

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
	};

	return (
		<div className="container mx-auto px-4 py-6">
			<div className="mb-6">
				<h1 className="text-2xl font-bold mb-2">My Profile</h1>
				<p className="text-muted-foreground">
					Manage your profile information and preferences.
				</p>
			</div>

			<div className="flex flex-col md:flex-row gap-6">
				{/* Profile Sidebar */}
				<div className="w-full md:w-1/3">
					<Card className="mb-6">
						<CardContent className="p-6 text-center">
							<div className="relative inline-block mb-4">
								{profileData.profilePicture ? (
									<img
										src={profileData.profilePicture}
										alt="Profile"
										className="w-24 h-24 rounded-full object-cover mx-auto"
									/>
								) : (
									<div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
										<User className="h-12 w-12 text-primary" />
									</div>
								)}
								{isEditing && (
									<Button
										size="sm"
										variant="outline"
										className="absolute bottom-0 right-0 rounded-full p-2"
									>
										<Upload className="h-3 w-3" />
									</Button>
								)}
							</div>
							<h2 className="text-xl font-semibold mb-1">{profileData.name}</h2>
							<p className="text-muted-foreground mb-6">
								{isMentor ? "Mentor" : "Mentee"}
							</p>

							<Button
								onClick={toggleEditMode}
								className="w-full"
								variant={isEditing ? "outline" : "default"}
							>
								{isEditing ? (
									<>
										<X className="h-4 w-4 mr-2" />
										Cancel
									</>
								) : (
									<>
										<Edit className="h-4 w-4 mr-2" />
										Edit Profile
									</>
								)}
							</Button>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle className="text-lg">Account Settings</CardTitle>
						</CardHeader>
						<CardContent className="space-y-3">
							{accountSettings.map((setting) => {
								const Icon = setting.icon;
								return (
									<button
										key={setting.id}
										className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-muted transition-colors"
									>
										<div className="flex items-center">
											<Icon className="h-4 w-4 mr-3 text-muted-foreground" />
											<span>{setting.label}</span>
										</div>
										<div className="text-muted-foreground">
											<svg
												className="h-4 w-4"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M9 5l7 7-7 7"
												/>
											</svg>
										</div>
									</button>
								);
							})}
						</CardContent>
					</Card>
				</div>

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
								<Label htmlFor={`${baseId}-name`}>Name</Label>
								<Input
									id={`${baseId}-name`}
									value={profileData.name}
									onChange={(e) => handleInputChange("name", e.target.value)}
									disabled={!isEditing}
								/>
							</div>

							<div>
								<Label htmlFor={`${baseId}-email`}>Email</Label>
								<Input
									id={`${baseId}-email`}
									type="email"
									value={profileData.email}
									disabled // Non-editable
								/>
							</div>

							<div>
								<Label htmlFor={`${baseId}-phone`}>Phone</Label>
								<Input
									id={`${baseId}-phone`}
									value={profileData.phone}
									disabled // Non-editable
								/>
							</div>

							{/* Mentor-only fields */}
							{isMentor && (
								<>
									<div>
										<Label htmlFor={`${baseId}-bio`}>Bio</Label>
										<Textarea
											id={`${baseId}-bio`}
											rows={3}
											value={profileData.bio}
											onChange={(e) => handleInputChange("bio", e.target.value)}
											disabled={!isEditing}
										/>
									</div>

									<div>
										<Label htmlFor={`${baseId}-currentRole`}></Label>
										<Input
											id={`${baseId}-currentRole`}
											value={profileData.currentRole}
											onChange={(e) =>
												handleInputChange("currentRole", e.target.value)
											}
											disabled={!isEditing}
										/>
									</div>

									<div>
										<Label htmlFor={`${baseId}-institution`}>Institution</Label>
										<Input
											id={`${baseId}-institution`}
											value={profileData.institution}
											onChange={(e) =>
												handleInputChange("institution", e.target.value)
											}
											disabled={!isEditing}
										/>
									</div>

									<div>
										<Label htmlFor={`${baseId}-yearsOfExperience`}>
											Years of Experience
										</Label>
										<Input
											id={`${baseId}-yearsOfExperience`}
											type="number"
											value={profileData.yearsOfExperience}
											onChange={(e) =>
												handleInputChange(
													"yearsOfExperience",
													parseInt(e.target.value) || 0,
												)
											}
											disabled={!isEditing}
										/>
									</div>

									<div>
										<Label htmlFor={`${baseId}-personalWebsite`}>
											Personal Website
										</Label>
										<Input
											id={`${baseId}-personalWebsite`}
											value={profileData.personalWebsite}
											onChange={(e) =>
												handleInputChange("personalWebsite", e.target.value)
											}
											disabled={!isEditing}
										/>
									</div>

									<div>
										<Label htmlFor={`${baseId}-resumePdf`}>Resume PDF</Label>
										<div className="flex items-center gap-2">
											<Input
												id={`${baseId}-resumePdf`}
												value={profileData.resumePdf}
												onChange={(e) =>
													handleInputChange("resumePdf", e.target.value)
												}
												disabled={!isEditing}
											/>
											{isEditing && (
												<Button variant="outline" size="sm">
													<Upload className="h-4 w-4 mr-1" />
													Upload
												</Button>
											)}
										</div>
									</div>
								</>
							)}

							{/* Educational Qualifications (mentor-only) */}
							{isMentor && (
								<div>
									<div className="flex items-center justify-between mb-2">
										<Label>Educational Qualifications</Label>
										{isEditing && (
											<Button
												variant="ghost"
												size="sm"
												onClick={addQualification}
											>
												<Plus className="h-4 w-4 mr-1" />
												Add
											</Button>
										)}
									</div>
									<div className="space-y-2">
										{profileData.educationalQualifications?.map(
											(qualification, index) => (
												<div key={index} className="flex items-center gap-2">
													<Input
														value={qualification}
														onChange={(e) =>
															handleQualificationChange(index, e.target.value)
														}
														disabled={!isEditing}
													/>
													{isEditing && (
														<Button
															variant="ghost"
															size="sm"
															onClick={() => removeQualification(index)}
														>
															<X className="h-4 w-4" />
														</Button>
													)}
												</div>
											),
										)}
									</div>
								</div>
							)}

							{/* Expertises and Skills */}
							<div>
								<div className="flex items-center justify-between mb-2">
									<Label>Expertises</Label>
									{isEditing && (
										<div className="flex items-center gap-2">
											<Select
												value={newExpertise}
												onValueChange={setNewExpertise}
											>
												<SelectTrigger className="w-48">
													<SelectValue placeholder="Select expertise" />
												</SelectTrigger>
												<SelectContent>
													{expertiseOptions.map((option) => (
														<SelectItem key={option} value={option}>
															{option}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
											<Button
												variant="outline"
												size="sm"
												onClick={addExpertise}
												disabled={!newExpertise}
											>
												<Plus className="h-4 w-4 mr-1" />
												Add
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
