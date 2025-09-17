import { createFileRoute } from '@tanstack/react-router'
import {  
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui'
import MentorRegisterForm from './-components/MentorRegisterForm'

export const Route = createFileRoute('/(authenticated)/mentor/register/')({
  component: RouteComponent,
})

function RouteComponent() { 
  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">Become a Mentor</h1>
        <p className="text-muted-foreground">
          Share your expertise and help others grow in their careers
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Mentor Registration Form</CardTitle>
        </CardHeader>
        <CardContent>
       	<MentorRegisterForm/>   
				</CardContent>
      </Card>
    </div>
  )
}
