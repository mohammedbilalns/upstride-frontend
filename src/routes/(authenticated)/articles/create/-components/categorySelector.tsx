import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tag } from 'lucide-react'

const categories = [
	"Leadership",
	"Career Growth",
	"Personal Branding",
	"Communication",
	"Technology",
	"Networking",
	"Entrepreneurship",
	"Productivity",
	"Work-Life Balance",
	"Innovation"
]
interface CategorySelectorProps {
	category: string
	setCategory: any
}

export default function CategorySelector( { category, setCategory }: CategorySelectorProps ) {
	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center">
					<Tag className="h-5 w-5 mr-2" />
					Category
				</CardTitle>
			</CardHeader>
			<CardContent>
				<Select value={category} onValueChange={setCategory}>
					<SelectTrigger>
						<SelectValue placeholder="Select category" />
					</SelectTrigger>
					<SelectContent>
						{categories.map((cat) => (
							<SelectItem key={cat} value={cat}>
								{cat}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</CardContent>
		</Card>
	)
}
