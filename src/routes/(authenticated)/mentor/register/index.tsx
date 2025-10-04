import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import {  
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button
} from '@/components/ui'
import MentorRegisterForm from './-components/MentorRegisterForm'
import { useCurrentUser } from '@/hooks/useCurrentUser';
import Loading from '@/components/loading';
import { CheckCircle, XCircle } from 'lucide-react';

export const Route = createFileRoute('/(authenticated)/mentor/register/')({
  component: RouteComponent,
})

function RouteComponent() { 
  const {data:user, isPending}  = useCurrentUser();
  const [showForm, setShowForm] = useState(false);
  
  const isSubmitted = user?.isRequestedForMentoring === "pending";
  const isRejected = user?.isRequestedForMentoring === "rejected";

  if (isPending) return <Loading />;

  if (isSubmitted && !showForm) {
    return (
      <div className="flex items-center justify-center p-4" style={{ minHeight: 'calc(100vh - 5rem)' }}>
        <Card className="border-green-200 bg-green-50 w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <CardTitle className="text-2xl text-green-800">Application Submitted</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-green-700">
              Thank you for applying to become a mentor! Your application has been submitted and is currently under review.
            </p>
            <p className="text-green-600">
              We'll notify you via email once a decision has been made. This typically takes 3-5 business days.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isRejected && !showForm) {
    return (
      <div className="flex items-center justify-center p-4" style={{ minHeight: 'calc(100vh - 5rem)' }}>
        <Card className="border-red-200 bg-red-50 w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <XCircle className="h-16 w-16 text-red-500" />
            </div>
            <CardTitle className="text-2xl text-red-800">Application Not Approved</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <div className="space-y-2">
              <p className="text-red-700">
                We're sorry, but your mentor application wasn't approved at this time.
              </p>
              <p className="text-red-600">
               Thank you for your interest in becoming a mentor! Our program has specific requirements that change as our community's needs evolve. We hope you'll consider applying again in the future when your expertise better matches what our mentees are seeking. 
              </p>
            </div>
            <Button 
              onClick={() => setShowForm(true)}
              className="bg-red-600 hover:bg-red-700 cursor-pointer"
            >
              Register Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

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
          <MentorRegisterForm />   
        </CardContent>
      </Card>
    </div>
  );
}
