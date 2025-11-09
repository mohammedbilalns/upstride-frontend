import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export default function AuthCarousel() {
	const [currentImage, setCurrentImage] = useState(0);
	const carouselImages = [
		{
			src: "/modern-office-collaboration.png",
			alt: "Team collaboration",
			title: "Find the Right Mentor",
			description:
				"Connect with experienced professionals who can guide your journey.",
		},
		{
			src: "/dashboard-analytics-charts-and-graphs.png",
			alt: "Analytics dashboard",
			title: "Learn & Grow Faster",
			description:
				"Discover topics and skills tailored to your interests and career path.",
		},
		{
			src: "/secure-cloud-technology-illustration.png",
			alt: "Secure platform",
			title: "Join a Thriving Community",
			description:
				"Be part of a supportive network of learners, mentors, and professionals.",
		},
	];

	useEffect(() => {
		const timer = setInterval(() => {
			setCurrentImage((prev) => (prev + 1) % carouselImages.length);
		}, 5000);
		return () => clearInterval(timer);
	}, [carouselImages.length]);

	const nextImage = () => {
		setCurrentImage((prev) => (prev + 1) % carouselImages.length);
	};

	const prevImage = () => {
		setCurrentImage(
			(prev) => (prev - 1 + carouselImages.length) % carouselImages.length,
		);
	};

	return (
		<div className="hidden lg:flex items-center justify-center p-8 bg-linear-to-br bg-transparent">
			<div className="relative w-full max-w-2xl h-128 rounded-2xl overflow-hidden shadow-2xl bg-transparent">
				{/* Carousel Images */}
				<div className="relative w-full h-full rounded-2xl overflow-hidden">
					{carouselImages.map((image, index) => (
						<div
							key={image.alt}
							className={`absolute inset-0 transition-opacity duration-500 ${
								index === currentImage ? "opacity-100" : "opacity-0"
							}`}
						>
							<img
								src={image.src || "/placeholder.svg"}
								alt={image.alt}
								className="w-full h-full object-cover rounded-2xl"
							/>
							<div className="absolute inset-0 bg-black/40 rounded-2xl" />
						</div>
					))}
				</div>

				{/* Carousel Content */}
				<div className="absolute inset-0 flex items-center justify-center">
					<div className="text-center text-white px-8 max-w-lg">
						<h2 className="text-3xl font-bold mb-4 tracking-tight">
							{carouselImages[currentImage].title}
						</h2>
						<p className="text-lg opacity-90 leading-relaxed">
							{carouselImages[currentImage].description}
						</p>
						<div className="mt-8 text-base opacity-75">
							<span className="font-semibold">Upstride</span> helps you find the
							right mentors and share your expertise with a community eager to
							learn.
						</div>
					</div>
				</div>

				{/* Carousel Controls */}
				<Button
					variant="ghost"
					size="icon"
					className="absolute left-3 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
					onClick={prevImage}
					type="button"
				>
					<ChevronLeft className="h-5 w-5" />
				</Button>
				<Button
					type="button"
					variant="ghost"
					size="icon"
					className="absolute right-3 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
					onClick={nextImage}
				>
					<ChevronRight className="h-5 w-5" />
				</Button>

				{/* Carousel Indicators */}
				<div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2">
					{carouselImages.map((image, index) => (
						<button
							type="button"
							key={image.alt}
							className={`w-2.5 h-2.5 rounded-full transition-colors ${
								index === currentImage ? "bg-white" : "bg-white/50"
							}`}
							onClick={() => setCurrentImage(index)}
						/>
					))}
				</div>
			</div>
		</div>
	);
}
