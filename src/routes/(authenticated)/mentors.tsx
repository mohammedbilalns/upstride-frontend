import { createFileRoute } from "@tanstack/react-router";
import {
	Clock,
	Filter,
	LayoutGrid,
	List,
	MessageCircle,
	Search,
	Star,
	StarHalf,
	UserCheck,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

// Define types for mentor data
interface Mentor {
	id: number;
	name: string;
	title: string;
	bio: string;
	expertise: string[];
	experience: string;
	imageUrl: string;
	rating: number;
	reviewsCount: number;
	isAvailable: boolean;
	tags: string[];
}

// Dummy data for mentors
const dummyMentors: Mentor[] = [
	{
		id: 1,
		name: "Sarah Williams",
		title: "Leadership Coach",
		bio: "Experienced leadership coach with 15+ years in executive roles. Specializing in remote team management and organizational development.",
		expertise: ["Leadership", "Remote Work", "Team Building"],
		experience: "15+ years",
		imageUrl: "https://randomuser.me/api/portraits/women/44.jpg",
		rating: 4.8,
		reviewsCount: 24,
		isAvailable: true,
		tags: ["Leadership", "Remote Work", "Team Building"],
	},
	{
		id: 2,
		name: "Michael Chen",
		title: "Tech Career Advisor",
		bio: "Former tech executive who has helped hundreds of professionals navigate career transitions in the technology industry.",
		expertise: ["Technology", "Career Growth", "Startups"],
		experience: "12 years",
		imageUrl: "https://randomuser.me/api/portraits/men/22.jpg",
		rating: 5.0,
		reviewsCount: 18,
		isAvailable: true,
		tags: ["Technology", "Career Growth", "Startups"],
	},
	{
		id: 3,
		name: "Emma Thompson",
		title: "Personal Branding Expert",
		bio: "Marketing professional specializing in personal branding for executives and entrepreneurs. Author of 'Brand You: Building Your Professional Identity.'",
		expertise: ["Personal Branding", "Marketing", "Social Media"],
		experience: "10 years",
		imageUrl: "https://randomuser.me/api/portraits/women/68.jpg",
		rating: 4.2,
		reviewsCount: 15,
		isAvailable: true,
		tags: ["Personal Branding", "Marketing", "Social Media"],
	},
	{
		id: 4,
		name: "David Wilson",
		title: "Communication Specialist",
		bio: "Corporate communication expert with a focus on presentation skills, public speaking, and interpersonal communication in professional settings.",
		expertise: ["Communication", "Public Speaking", "Presentation"],
		experience: "8 years",
		imageUrl: "https://randomuser.me/api/portraits/men/41.jpg",
		rating: 4.6,
		reviewsCount: 12,
		isAvailable: false,
		tags: ["Communication", "Public Speaking", "Presentation"],
	},
	{
		id: 5,
		name: "Lisa Anderson",
		title: "Career Development Coach",
		bio: "Helping professionals unlock their potential and achieve their career goals through personalized coaching and strategic planning.",
		expertise: ["Career Development", "Goal Setting", "Resume Building"],
		experience: "7 years",
		imageUrl: "https://randomuser.me/api/portraits/women/63.jpg",
		rating: 4.9,
		reviewsCount: 31,
		isAvailable: true,
		tags: ["Career Development", "Goal Setting", "Resume Building"],
	},
	{
		id: 6,
		name: "Robert Martinez",
		title: "Entrepreneurship Mentor",
		bio: "Serial entrepreneur and startup advisor with experience in building successful businesses from the ground up.",
		expertise: ["Entrepreneurship", "Business Strategy", "Funding"],
		experience: "20+ years",
		imageUrl: "https://randomuser.me/api/portraits/men/32.jpg",
		rating: 4.7,
		reviewsCount: 27,
		isAvailable: false,
		tags: ["Entrepreneurship", "Business Strategy", "Funding"],
	},
];

// Expertise options for filter
const expertiseOptions = [
	"All Expertise",
	"Leadership",
	"Technology",
	"Personal Branding",
	"Communication",
	"Career Development",
	"Entrepreneurship",
	"Marketing",
	"Public Speaking",
	"Business Strategy",
];

// Experience level options
const experienceOptions = [
	"Any Level",
	"5-10 years",
	"10-15 years",
	"15+ years",
];

// Component to render star ratings
const StarRating = ({ rating }: { rating: number }) => {
	const fullStars = Math.floor(rating);
	const hasHalfStar = rating % 1 !== 0;
	const emptyStars = 5 - Math.ceil(rating);

	return (
		<div className="flex text-yellow-400">
			{[...Array(fullStars)].map((_, i) => (
				<Star key={`full-${i}`} className="h-4 w-4 fill-current" />
			))}
			{hasHalfStar && <StarHalf className="h-4 w-4 fill-current" />}
			{[...Array(emptyStars)].map((_, i) => (
				<Star key={`empty-${i}`} className="h-4 w-4" />
			))}
		</div>
	);
};

export const Route = createFileRoute("/(authenticated)/mentors")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="container mx-auto px-4 py-6">
			<div className="mb-6">
				<h1 className="text-2xl font-bold mb-2">Find Mentors</h1>
				<p className="text-muted-foreground">
					Connect with experienced professionals who can guide you in your
					career journey.
				</p>
			</div>

			<div className="flex flex-col md:flex-row gap-6">
				{/* Filters Sidebar */}
				<div className="w-full md:w-1/4">
					<Card className="mb-6">
						<CardHeader>
							<h2 className="text-lg font-semibold flex items-center gap-2">
								<Filter className="h-5 w-5" />
								Filter Mentors
							</h2>
						</CardHeader>
						<CardContent className="space-y-4">
							<div>
								<label className="block text-sm font-medium mb-2">
									Expertise
								</label>
								<Select>
									<SelectTrigger>
										<SelectValue placeholder="All Expertise" />
									</SelectTrigger>
									<SelectContent>
										{expertiseOptions.map((expertise) => (
											<SelectItem
												key={expertise}
												value={expertise.toLowerCase()}
											>
												{expertise}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
							<div>
								<label className="block text-sm font-medium mb-2">
									Experience Level
								</label>
								<Select>
									<SelectTrigger>
										<SelectValue placeholder="Any Level" />
									</SelectTrigger>
									<SelectContent>
										{experienceOptions.map((level) => (
											<SelectItem key={level} value={level.toLowerCase()}>
												{level}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
							<Button className="w-full cursor-pointer">Apply Filters</Button>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<h2 className="text-lg font-semibold">My Saved Mentors</h2>
						</CardHeader>
						<CardContent>
							<div className="space-y-3">
								{dummyMentors.slice(0, 2).map((mentor) => (
									<div key={mentor.id} className="flex items-center">
										<img
											src={mentor.imageUrl}
											alt={mentor.name}
											className="h-8 w-8 rounded-full mr-3"
										/>
										<div>
											<p className="text-sm font-medium">{mentor.name}</p>
											<p className="text-xs text-muted-foreground">
												{mentor.title}
											</p>
										</div>
									</div>
								))}
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Mentors Grid */}
				<div className="w-full md:w-3/4">
					<div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
						<div className="relative w-full sm:max-w-md">
							<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
							<Input placeholder="Search mentors..." className="pl-10" />
						</div>
						<div className="flex space-x-2">
							<Button variant="outline" size="sm">
								<LayoutGrid className="h-4 w-4" />
							</Button>
							<Button variant="ghost" size="sm">
								<List className="h-4 w-4" />
							</Button>
						</div>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						{dummyMentors.map((mentor) => (
							<Card key={mentor.id} className="relative">
								<CardHeader className="pb-3">
									<div className="flex items-start justify-between">
										<div className="flex items-start space-x-3">
											<div className="relative">
												<img
													src={mentor.imageUrl}
													alt={mentor.name}
													className="h-16 w-16 rounded-full"
												/>
												{mentor.isAvailable && (
													<div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
												)}
											</div>
											<div>
												<h3 className="text-lg font-semibold">{mentor.name}</h3>
												<p className="text-sm text-muted-foreground">
													{mentor.title}
												</p>
												<div className="flex items-center mt-1">
													<StarRating rating={mentor.rating} />
													<span className="text-xs text-muted-foreground ml-2">
														{mentor.rating} ({mentor.reviewsCount} reviews)
													</span>
												</div>
											</div>
										</div>
										{!mentor.isAvailable && (
											<Badge variant="outline" className="text-xs">
												<Clock className="h-3 w-3 mr-1" />
												Busy
											</Badge>
										)}
									</div>
								</CardHeader>
								<CardContent className="pt-0">
									<p className="text-muted-foreground text-sm mb-4">
										{mentor.bio}
									</p>
									<div className="flex flex-wrap gap-2 mb-4">
										{mentor.tags.map((tag) => (
											<Badge key={tag} variant="secondary" className="text-xs">
												{tag}
											</Badge>
										))}
									</div>
								</CardContent>
								<CardFooter className="flex justify-between items-center pt-3">
									<div className="text-sm">
										<span className="text-muted-foreground">Experience:</span>
										<span className="font-medium ml-1">
											{mentor.experience}
										</span>
									</div>
									<div className="flex space-x-2">
										<Button
											variant="outline"
											size="sm"
											className="cursor-pointer"
										>
											<MessageCircle className="h-4 w-4 mr-1" />
											Message
										</Button>
										<Button size="sm" className="cursor-pointer">
											<UserCheck className="h-4 w-4 mr-1" />
											Connect
										</Button>
									</div>
								</CardFooter>
							</Card>
						))}
					</div>

					<div className="mt-6 flex justify-center">
						<Button className="cursor-pointer" variant="outline">
							Load More Mentors
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
