import { useRouter } from "@tanstack/react-router";
import { CheckCircle, ChevronRight, Heart, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import FeaturesSection from "@/features/landing/components/FeaturesSection";
import FooterCTA from "@/features/landing/components/FooterCTA";
import HeroSection from "@/features/landing/components/HeroSection";
import TestimonialsSection from "@/features/landing/components/TestimonialsSection";
import ThemeToggle from "./common/theme-toggle";

export default function LandingPage() {
	const router = useRouter();

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
			<HeroSection />
			{/* Features Section */}
			<FeaturesSection />

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
			<TestimonialsSection />
			{/* Footer CTA */}
			<FooterCTA />

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
