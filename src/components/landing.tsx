import { useRouter } from "@tanstack/react-router";
import {
	ArrowRight,
	BookOpen,
	Calendar,
	CheckCircle,
	ChevronRight,
	Heart,
	Star,
	Users,
	Video,
	Zap,
} from "lucide-react";
import { useId } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import ThemeToggle from "./common/theme-toggle";

export default function LandingPage() {
	const router = useRouter();
	const baseId = useId();
	const features = [
		{
			icon: <Users className="h-8 w-8" />,
			title: "Expert Mentors",
			description:
				"Connect with industry leaders and experienced professionals across various fields.",
		},
		{
			icon: <Video className="h-8 w-8" />,
			title: "1-on-1 Sessions",
			description:
				"Personalized video calls and mentoring sessions tailored to your goals.",
		},
		{
			icon: <BookOpen className="h-8 w-8" />,
			title: "Skill Development",
			description:
				"Learn new skills and advance your career with structured learning paths.",
		},
		{
			icon: <Calendar className="h-8 w-8" />,
			title: "Flexible Scheduling",
			description:
				"Book sessions at your convenience with our easy scheduling system.",
		},
	];

	const testimonials = [
		{
			name: "Sarah Chen",
			role: "Software Engineer",
			avatar: "SC",
			content:
				"Found an amazing mentor who helped me transition into tech. The guidance was invaluable!",
			rating: 5,
		},
		{
			name: "Michael Torres",
			role: "Marketing Manager",
			avatar: "MT",
			content:
				"As a mentor, I love sharing my expertise and helping others grow in their careers.",
			rating: 5,
		},
		{
			name: "Emily Johnson",
			role: "UX Designer",
			avatar: "EJ",
			content:
				"The platform made it so easy to find the right mentor for my design career goals.",
			rating: 5,
		},
	];

	const stats = [
		{ number: "10K+", label: "Active Learners" },
		{ number: "2K+", label: "Expert Mentors" },
		{ number: "50K+", label: "Sessions Completed" },
		{ number: "4.9★", label: "Average Rating" },
	];

	return (
		<div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-muted/30 relative overflow-hidden">
			{/* Background decorative elements */}
			<div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl opacity-30"></div>
			<div className="absolute bottom-0 right-1/4 w-80 h-80 bg-gradient-to-tl from-secondary/15 to-transparent rounded-full blur-3xl opacity-40"></div>

			{/* Header */}
			<header className="relative z-10 border-b border-border/50 bg-card/50 backdrop-blur-xl">
				<div className="container mx-auto px-6 py-4 flex justify-between items-center">
					<div className="flex items-center space-x-2">
						<div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center">
							<Zap className="h-5 w-5 text-primary-foreground" />
						</div>
						<h1 className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
							UpStride
						</h1>
					</div>
					<nav className="hidden md:flex items-center space-x-8">
						<a
							href="#features"
							className="text-muted-foreground hover:text-foreground transition-colors"
						>
							Features
						</a>
						<a
							href="#mentors"
							className="text-muted-foreground hover:text-foreground transition-colors"
						>
							Find Mentors
						</a>
						<a
							href="#testimonials"
							className="text-muted-foreground hover:text-foreground transition-colors"
						>
							Reviews
						</a>
					</nav>
					<div className="flex items-center space-x-4">
						<ThemeToggle />

						<Button
							onClick={() => router.navigate({ to: "/auth" })}
							className=" cursor-pointer bg-gradient-to-r from-primary to-primary/80"
						>
							Get Started
						</Button>
					</div>
				</div>
			</header>

			{/* Hero Section */}
			<section className="relative z-10 container mx-auto px-6 py-20 text-center">
				<Badge className="mb-6 bg-gradient-to-r from-primary/10 to-secondary/10 text-foreground border-primary/20">
					🚀 Join 10,000+ learners growing their skills
				</Badge>

				<h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground via-foreground/90 to-foreground/80 bg-clip-text text-transparent leading-tight">
					Connect with Expert
					<br />
					<span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
						Mentors & Grow
					</span>
				</h1>

				<p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
					Accelerate your career with personalized mentorship from industry
					experts. Learn, grow, and achieve your professional goals with
					guidance from those who've been there.
				</p>

				<div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
					<Button
						onClick={() => router.navigate({ to: "/home" })}
						size="lg"
						className=" cursor-pointer bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-lg px-8 py-6"
					>
						Find Your Mentor
						<ArrowRight className="ml-2 h-5 w-5" />
					</Button>

					<Button
						size="lg"
						variant="outline"
						onClick={() => router.navigate({ to: "/auth" })}
						className=" cursor-pointer border-2 border-primary/30 hover:bg-primary/10 text-lg px-8 py-6 bg-gradient-to-r from-card/80 to-card/60 backdrop-blur-sm"
					>
						<Users className="mr-2 h-5 w-5" />
						Become a Mentor
					</Button>
				</div>

				{/* Stats */}
				<div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto">
					{stats.map((stat, index) => (
						<div key={index} className="text-center">
							<div className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
								{stat.number}
							</div>
							<div className="text-sm text-muted-foreground">{stat.label}</div>
						</div>
					))}
				</div>
			</section>

			{/* Features Section */}
			<section
				id={`features-${baseId}`}
				className="relative z-10 container mx-auto px-6 py-20"
			>
				<div className="text-center mb-16">
					<h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
						Why Choose SkillShare?
					</h2>
					<p className="text-xl text-muted-foreground max-w-2xl mx-auto">
						Everything you need to connect with mentors and accelerate your
						professional growth.
					</p>
				</div>

				<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
					{features.map((feature, index) => (
						<Card
							key={index}
							className="bg-gradient-to-br from-card/80 to-card/60 backdrop-blur-sm border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
						>
							<CardHeader>
								<div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg flex items-center justify-center mb-4 text-primary">
									{feature.icon}
								</div>
								<CardTitle className="text-xl">{feature.title}</CardTitle>
							</CardHeader>
							<CardContent>
								<CardDescription className="text-base leading-relaxed">
									{feature.description}
								</CardDescription>
							</CardContent>
						</Card>
					))}
				</div>
			</section>

			{/* Mentor Registration CTA */}
			<section className="relative z-10 container mx-auto px-6 py-20">
				<Card className="bg-gradient-to-r from-primary/5 via-secondary/5 to-primary/5 border-primary/20 overflow-hidden relative">
					<div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10"></div>
					<CardContent className="relative z-10 p-12 text-center">
						<Heart className="h-12 w-12 text-primary mx-auto mb-6" />
						<h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
							Share Your Expertise
						</h2>
						<p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
							Join our community of expert mentors and make a meaningful impact
							by guiding the next generation of professionals.
						</p>

						<div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
							<div className="flex items-center text-muted-foreground">
								<CheckCircle className="h-5 w-5 text-green-500 mr-2" />
								Flexible scheduling
							</div>
							<div className="flex items-center text-muted-foreground">
								<CheckCircle className="h-5 w-5 text-green-500 mr-2" />
								Earn while helping others
							</div>
							<div className="flex items-center text-muted-foreground">
								<CheckCircle className="h-5 w-5 text-green-500 mr-2" />
								Build your reputation
							</div>
						</div>

						<Button
							onClick={() => router.navigate({ to: "/home" })}
							size="lg"
							className="cursor-pointer bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-lg px-8 py-6"
						>
							Register as a Mentor
							<ChevronRight className="ml-2 h-5 w-5" />
						</Button>
					</CardContent>
				</Card>
			</section>

			{/* Testimonials */}
			<section
				id={`testimonials-${baseId}`}
				className="relative z-10 container mx-auto px-6 py-20"
			>
				<div className="text-center mb-16">
					<h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
						What Our Community Says
					</h2>
					<p className="text-xl text-muted-foreground">
						Real stories from mentors and learners who've grown with SkillShare.
					</p>
				</div>

				<div className="grid md:grid-cols-3 gap-6">
					{testimonials.map((testimonial, index) => (
						<Card
							key={index}
							className="bg-gradient-to-br from-card/80 to-card/60 backdrop-blur-sm border-border/50"
						>
							<CardContent className="p-6">
								<div className="flex items-center mb-4">
									<Avatar className="mr-3">
										<AvatarFallback className="bg-gradient-to-br from-primary/20 to-secondary/20">
											{testimonial.avatar}
										</AvatarFallback>
									</Avatar>
									<div>
										<div className="font-semibold">{testimonial.name}</div>
										<div className="text-sm text-muted-foreground">
											{testimonial.role}
										</div>
									</div>
								</div>
								<p className="text-muted-foreground mb-4">
									{testimonial.content}
								</p>
								<div className="flex">
									{[...Array(testimonial.rating)].map((_, i) => (
										<Star
											key={i}
											className="h-4 w-4 text-yellow-500 fill-current"
										/>
									))}
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			</section>

			{/* Footer CTA */}
			<section className="relative z-10 container mx-auto px-6 py-20 text-center">
				<h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
					Ready to Start Your Journey?
				</h2>
				<p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
					Join thousands of learners and mentors who are already growing
					together on SkillShare.
				</p>
				<div className="flex flex-col sm:flex-row gap-4 justify-center">
					<Button
						onClick={() => router.navigate({ to: "/home" })}
						size="lg"
						className="cursor-pointer bg-gradient-to-r from-primary to-primary/80 text-lg px-8 py-6"
					>
						Get Started Today
					</Button>
					<Button
						onClick={() => router.navigate({ to: "/home" })}
						size="lg"
						variant="outline"
						className="cursor-pointer text-lg px-8 py-6"
					>
						Learn More
					</Button>
				</div>
			</section>

			{/* Simple Footer */}
			<footer className="relative z-10 border-t border-border/50 bg-card/50 backdrop-blur-xl">
				<div className="container mx-auto px-6 py-8 text-center text-muted-foreground">
					<p>
						&copy; 2025 SkillShare. All rights reserved. Connecting mentors and
						learners worldwide.
					</p>
				</div>
			</footer>
		</div>
	);
}
