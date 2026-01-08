import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useState } from "react";
import {
  FormProvider,
  type UseFormReturn,
  useFieldArray,
  useForm,
} from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useFetchExpertises } from "@/shared/hooks/useFetchExperitses";
import type { Expertise } from "@/shared/types";
import { useUploadMedia } from "../../../../shared/hooks/useUploadMedia";
import { useRegisterAsMentor } from "../hooks/mentor-registration.hooks";
import {
  type mentorRegistrationFormValues,
  mentorRegistrationSchema,
} from "../schemas/mentor-registration.schema";
import FilePreview from "./filePreview";
import FileUpload from "./fileUpload";
import SkillSelection from "./skillSelection";
import UploadingIndicator from "./uploadingIndicator";

export default function MentorRegisterForm() {
  const [selectedExpertise, setSelectedExpertise] = useState<string>("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [newSkills, setNewSkills] = useState<string[]>([]);
  const registerMentorMuation = useRegisterAsMentor();

  const { data } = useFetchExpertises("1", "10", "");
  const expertiseOptions = data?.expertises || [];

  const form: UseFormReturn<mentorRegistrationFormValues> =
    useForm<mentorRegistrationFormValues>({
      resolver: zodResolver(mentorRegistrationSchema),
      defaultValues: {
        bio: "",
        currentRole: "",
        organisation: "",
        yearsOfExperience: 0,
        educationalQualifications: [{ value: "" }],
        personalWebsite: "",
        expertise: "",
        skills: [],
        resume: null as unknown as File,
        termsAccepted: false,
      },
    });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "educationalQualifications",
  });

  const {
    handleUpload,
    handleDelete,
    uploadProgress,
    isUploading,
    fileDetails,
    resetUpload,
    isDeleting,
  } = useUploadMedia();

  const handleExpertiseChange = (value: string) => {
    setSelectedExpertise(value);
    form.setValue("expertise", value);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    if (e?.dataTransfer?.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type === "application/pdf") {
        setResumeFile(file);
        resetUpload();
        form.setValue("resume", file);
        handleUpload(file).catch((error) => {
          console.error("Upload failed:", error);
          toast.error("Failed to upload file");
        });
      } else {
        toast.error("Invalid file type");
      }
    }
  };
  const MAX_FILE_SIZE = 2 * 1024 * 1024;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e?.target?.files[0]) {
      const file = e.target.files[0];

      if (file.type !== "application/pdf") {
        toast.error("Invalid file type. Only PDF allowed.");
        e.target.value = "";
        return;
      }

      if (file.size > MAX_FILE_SIZE) {
        toast.error("File size must not exceed 2MB.");
        e.target.value = "";
        return;
      }

      setResumeFile(file);
      resetUpload();
      form.setValue("resume", file);

      handleUpload(file).catch((error) => {
        console.error("Upload failed:", error);
        toast.error("Failed to upload file");
      });
    }
  };

  const removeResume = async () => {
    if (fileDetails) {
      await handleDelete();
    }
    setResumeFile(null);
    resetUpload();
    form.setValue("resume", null as unknown as File);
  };

  const onSubmit = async (values: mentorRegistrationFormValues) => {
    try {
      registerMentorMuation.mutate({
        bio: values.bio,
        currentRole: values.currentRole,
        organisation: values.organisation,
        yearsOfExperience: values.yearsOfExperience,
        educationalQualifications: values.educationalQualifications.map(
          (field) => field.value,
        ),
        personalWebsite: values.personalWebsite,
        expertise: values.expertise,
        skills: values.skills,
        resume: fileDetails,
        termsAccepted: values.termsAccepted,
        newSkills: newSkills,
      });
    } catch (error) {
      toast.error("Failed to submit registration");
      console.error("Submission error:", error);
    }
  };

  return (
    <FormProvider {...form}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Bio */}
          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bio</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Tell us about yourself, your experience, and your mentoring approach..."
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  This will be displayed on your mentor profile
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Current Role */}
          <FormField
            control={form.control}
            name="currentRole"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Current Role</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g. Senior Software Engineer"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Organisation */}
          <FormField
            control={form.control}
            name="organisation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Organisation</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Tech Solutions Inc." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Years of Experience */}
          <FormField
            control={form.control}
            name="yearsOfExperience"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Years of Experience</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) =>
                      field.onChange(parseInt(e.target.value, 10))
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Educational Qualifications */}
          <div>
            <FormLabel>Educational Qualifications</FormLabel>
            <FormDescription className="mb-3">
              Add up to 7 qualifications (degrees, certifications, etc.)
            </FormDescription>

            {fields.map((field, index) => (
              <div key={field.id} className="flex items-center gap-2 mb-2">
                <FormField
                  control={form.control}
                  name={`educationalQualifications.${index}.value`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="e.g. BSc in Computer Science"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {fields.length > 1 && (
                  <Button type="button" onClick={() => remove(index)}>
                    Remove
                  </Button>
                )}
              </div>
            ))}

            {form.formState.errors.educationalQualifications && (
              <p className="text-sm font-medium text-destructive mt-2">
                {
                  form.formState.errors.educationalQualifications
                    .message as string
                }
              </p>
            )}

            {fields.length < 7 && (
              <Button
                type="button"
                variant="outline"
                onClick={() => append({ value: "" })}
                className="mt-2"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Qualification
              </Button>
            )}
          </div>
          {/* Personal Website */}
          <FormField
            control={form.control}
            name="personalWebsite"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Personal Website (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="https://yourwebsite.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Expertise */}
          <FormField
            control={form.control}
            name="expertise"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Area of Expertise</FormLabel>
                <Select
                  onValueChange={handleExpertiseChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your area of expertise" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {expertiseOptions.map((option: Expertise) => (
                      <SelectItem key={option.id} value={option.id}>
                        {option.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Removed the stray "W" character */}
          {selectedExpertise && (
            <SkillSelection mode="register" setNewSkills={setNewSkills} newSkills={newSkills} expertiseId={selectedExpertise} />
          )}
          <div>
            <FormLabel>Resume (PDF only)</FormLabel>
            <FormDescription className="mb-3">
              Upload your resume (max 5MB)
            </FormDescription>

            <div
              role="button"
              tabIndex={0}
              aria-label="Upload resume file"
              className={`w-full border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${isDragging
                  ? "border-primary bg-primary/5"
                  : "border-muted-foreground/25"
                }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {isUploading ? (
                <UploadingIndicator uploadProgress={uploadProgress} />
              ) : fileDetails && resumeFile ? (
                <FilePreview
                  resumeFile={resumeFile}
                  fileDetails={fileDetails}
                  handleUpload={handleUpload}
                  removeResume={removeResume}
                  isDeleting={isDeleting}
                  isUploading={isUploading}
                />
              ) : resumeFile ? (
                <FilePreview
                  resumeFile={resumeFile}
                  fileDetails={fileDetails}
                  handleUpload={handleUpload}
                  removeResume={removeResume}
                  isUploading={isUploading}
                  isDeleting={isDeleting}
                />
              ) : (
                <FileUpload handleFileChange={handleFileChange} />
              )}
            </div>

            {form.formState.errors.resume && (
              <p className="text-sm font-medium text-destructive mt-2">
                {form.formState.errors.resume.message}
              </p>
            )}
          </div>
          {/* Terms and Conditions */}
          <FormField
            control={form.control}
            name="termsAccepted"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>I accept the terms and conditions</FormLabel>
                  <FormDescription>
                    By checking this box, you agree to our Terms of Service and
                    Privacy Policy
                  </FormDescription>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full"
            disabled={isUploading}
          >
            {isUploading ? "Uploading..." : "Submit Registration"}
          </Button>
        </form>
      </Form>
    </FormProvider>
  );
}
