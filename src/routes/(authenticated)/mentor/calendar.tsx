import { createFileRoute } from "@tanstack/react-router";
import {
    Card,
    CardContent,
    CardHeader,
} from "@/components/ui/card";
import { authGuard } from "@/shared/guards/auth-gaurd";
import { getSelf } from "@/features/mentor/services/mentor.service";
import MentorSlots from "@/features/mentor/dashboard/components/MentorSlots";
import { useState } from "react";
import {
    Calendar,
    CalendarCurrentDate,
    CalendarMonthView,
    CalendarNextTrigger,
    CalendarPrevTrigger,
    CalendarTodayTrigger,
} from '@/components/ui/full-calendar';
import { ChevronLeft, ChevronRight } from "lucide-react";

export const Route = createFileRoute("/(authenticated)/mentor/calendar")({
    component: CalendarPage,
    beforeLoad: authGuard(["mentor"]),
    loader: async () => {
        return await getSelf();
    }
});

function CalendarPage() {
    const mentor = Route.useLoaderData();
    const [date, setDate] = useState<Date>(new Date());

    return (
        <div className="space-y-6 h-[calc(100vh-8rem)] flex flex-col">
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-3xl font-bold tracking-tight">Calendar & Schedule</h1>
            </div>

            <Calendar
                view="month"
                onDayClick={setDate}
            >
                <div className="flex flex-col md:flex-row gap-6 h-full flex-1 min-h-0">
                    {/* Left: Calendar View */}
                    <div className="md:w-[70%] flex-shrink-0">
                        <Card className="h-full flex flex-col hover:shadow-md transition-shadow">
                            <CardHeader className="pb-2">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <h2 className="text-xl font-semibold">Calendar</h2>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <CalendarPrevTrigger>
                                            <ChevronLeft className="h-4 w-4" />
                                        </CalendarPrevTrigger>
                                        <CalendarTodayTrigger>Today</CalendarTodayTrigger>
                                        <CalendarNextTrigger>
                                            <ChevronRight className="h-4 w-4" />
                                        </CalendarNextTrigger>
                                    </div>
                                </div>
                                <div className="pt-4 flex justify-center">
                                    <CalendarCurrentDate />
                                </div>
                            </CardHeader>
                            <CardContent className="flex-1 p-4 overflow-hidden">
                                <CalendarMonthView />
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right: Slots List */}
                    <div className="flex-1">
                        <MentorSlots mentorId={mentor.id} date={date} />
                    </div>
                </div>
            </Calendar>
        </div >
    );
}
