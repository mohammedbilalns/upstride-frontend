import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, FileText } from "lucide-react";
import { useId, useState } from "react";
import { Controller, type SubmitHandler, useForm } from "react-hook-form";
import type { z } from "zod";
import RichTextEditor from "@/components/rich-text-editor";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateArticle } from "@/features/articles/create-article/-hooks/useCreateArticle";
import { authGuard } from "@/shared/guards/auth-gaurd";
import type { CloudinaryResponse } from "@/shared/types/cloudinaryResponse";
import { FeaturedImageUpload } from "../../../../features/articles/create-article/components/featuredImage";
import PublishInfo from "../../../../features/articles/create-article/components/publishInfo";
import TagSelector from "../../../../features/articles/create-article/components/tagSelector";
import { articleUpdateSchema } from "../../../../features/articles/schemas/article.schema";

type ArticleFormData = z.infer<typeof articleUpdateSchema>;

export const Route = createFileRoute("/(authenticated)/articles/create/")({
	component: RouteComponent,
	beforeLoad: authGuard(["mentor"]),
});

function RouteComponent() {
	const [newTag, setNewTag] = useState("");
	const baseId = useId();
	const navigate = useNavigate();

	const handleCreateSuccess = () => {
		navigate({
			to: "/articles",
			search: { category: "", sortBy: "", tag: "" },
		});
	};

	const createArticleMutation = useCreateArticle({
		onCreateSuccess: handleCreateSuccess,
	});

	const form = useForm<ArticleFormData>({
		resolver: zodResolver(articleUpdateSchema),
		defaultValues: {
			title: "",
			content: "",
			tags: [],
			featuredImage: undefined,
		},
		mode: "onBlur",
	});

	const handleGoBack = () => {
		navigate({
			to: "/articles",
			search: { category: "", sortBy: "", tag: "" },
		});
	};

	const addTag = () => {
		const currentTags = form.getValues("tags");
		if (currentTags && currentTags?.length >= 5) {
			form.setError("tags", {
				message: "You can have a maximum of 5 tags",
			});
			return;
		}
		if (newTag.trim() && !currentTags?.includes(newTag.trim())) {
			form.clearErrors("tags");
			form.setValue("tags", [...currentTags, newTag.trim()], {
				shouldValidate: true,
			});
			setNewTag("");
		}
	};

	const removeTag = (tagToRemove: string) => {
		const currentTags = form.getValues("tags");

		form.setValue(
			"tags",
			currentTags.filter((tag) => tag !== tagToRemove),
			{ shouldValidate: true },
		);
	};

	const handleImageChange = (image: CloudinaryResponse | null) => {
		form.setValue("featuredImage", image || undefined, {
			shouldValidate: true,
		});
		form.clearErrors("featuredImage");
	};

	const onSubmit: SubmitHandler<ArticleFormData> = (data) => {
		const articleData = {
			title: data.title,
			content: data.content,
			tags: data.tags,
			featuredImage: data.featuredImage,
		};

		console.log("Article data to be saved:", articleData);
		createArticleMutation.mutate(articleData);
	};

	const handleSave = () => {
		form.handleSubmit(onSubmit)();
	};

	return (
		<div className="container mx-auto px-4 py-6 min-h-[calc(100vh-5rem)] flex flex-col">
			{/* Header */}
			<div className="flex items-center justify-between mb-6">
				<div className="flex items-center space-x-4">
					<Button
						className="cursor-pointer"
						variant="ghost"
						onClick={handleGoBack}
					>
						<ArrowLeft className="h-4 w-4 mr-2" />
						Back
					</Button>
					<h1 className="text-2xl font-bold">Create New Article</h1>
				</div>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 overflow-hidden">
				{/* Main Content */}
				<div className="lg:col-span-2">
					<Card className="h-full flex flex-col">
						<CardHeader>
							<CardTitle className="flex items-center">
								<FileText className="h-5 w-5 mr-2" />
								Article Content
							</CardTitle>
						</CardHeader>
						<CardContent className="flex-1 flex flex-col space-y-4">
							<div>
								<Label htmlFor={`${baseId}-title`}>Title</Label>
								<Input
									id={`${baseId}-title`}
									placeholder="Enter article title..."
									{...form.register("title")}
									className="text-lg mt-2"
								/>
								{form.formState.errors.title && (
									<p className="text-red-500 text-sm mt-1">
										{form.formState.errors.title.message}
									</p>
								)}
							</div>

							{/* Editor */}
							<div className="flex-1 min-h-[400px] border rounded-md overflow-hidden flex flex-col">
								<Controller
									name="content"
									control={form.control}
									render={({ field }) => (
										<RichTextEditor
											content={field.value}
											onChange={field.onChange}
										/>
									)}
								/>
							</div>
							{form.formState.errors.content && (
								<p className="text-red-500 text-sm mt-1">
									{form.formState.errors.content.message}
								</p>
							)}
						</CardContent>
					</Card>
				</div>

				{/* Sidebar */}
				<div className="flex flex-col space-y-6">
					<FeaturedImageUpload
						onImageChange={handleImageChange}
						error={form.formState.errors.featuredImage?.message}
					/>

					{/* Tags */}
					<TagSelector
						tags={form.watch("tags")}
						addTag={addTag}
						removeTag={removeTag}
						newTag={newTag}
						setNewTag={setNewTag}
						error={form.formState.errors.tags?.message}
					/>

					<PublishInfo
						handleSave={handleSave}
						isSaving={createArticleMutation.isPending}
					/>
				</div>
			</div>
		</div>
	);
}
