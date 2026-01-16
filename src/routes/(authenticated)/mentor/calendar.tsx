import { createFileRoute } from "@tanstack/react-router";
import {
    Card,
    CardContent,
    CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { authGuard } from "@/shared/guards/auth-gaurd";
import { getSelf } from "@/features/mentor-discovery/services/mentor.service";
import MentorSlots from "@/features/mentor-portal/components/MentorSlots";
import { useState } from "react";
import {
    Calendar,
    CalendarCurrentDate,
    CalendarMonthView,
    CalendarNextTrigger,
    CalendarPrevTrigger,
} from '@/components/ui/full-calendar';
import { ChevronLeft, ChevronRight } from "lucide-react";

import { useQuery } from "@tanstack/react-query";
import { getSlots } from "@/features/sessions/services/session.service";

export const Route = createFileRoute("/(authenticated)/mentor/calendar")({
    component: CalendarPage,
    beforeLoad: authGuard(["mentor"]),
    loader: async () => {
        return await getSelf();
    }
});

function CalendarPage() {
    const mentor = Route.useLoaderData();
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [viewDate, setViewDate] = useState<Date>(new Date());

    const { data: slots = [], isLoading } = useQuery({
        queryKey: ['slots', mentor.id, viewDate.getMonth(), viewDate.getFullYear()],
        queryFn: () => getSlots(mentor.id, viewDate.getMonth(), viewDate.getFullYear()),
        enabled: !!mentor.id,
    });

    const events = slots.map((slot) => ({
        id: slot.id,
        start: new Date(slot.startAt),
        end: new Date(slot.endAt),
        title: "",
        color: (slot.status === "OPEN" ? "green" : slot.status === "RESERVED" ? "orange" : "blue") as "green" | "blue" | "orange"
    }));

    return (
        <div className="space-y-4 h-[calc(100vh-6rem)] flex flex-col overflow-hidden">
            <div className="flex items-center justify-between shrink-0">
                <h1 className="text-2xl font-bold tracking-tight">Calendar & Schedule</h1>
            </div>

            <Calendar
                view="month"
                onDayClick={setSelectedDate}
                onDateChange={setViewDate}
                events={events}
                hideEventTime={true}
            >
                <div className="flex flex-col md:flex-row gap-4 h-full flex-1 min-h-0">
                    {/* Left: Calendar View */}
                    <div className="md:w-[60%] shrink-0">
                        <Card className="h-full flex flex-col hover:shadow-md transition-shadow">
                            <CardHeader className="pb-2">
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                    <div className="flex items-center gap-2">
                                        <h2 className="text-xl font-semibold">Calendar</h2>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-sm text-muted-foreground font-medium">Change Month</span>
                                        <div className="flex items-center gap-1">
                                            <CalendarPrevTrigger>
                                                <Button variant="outline" size="icon" className="h-8 w-8">
                                                    <ChevronLeft className="h-4 w-4" />
                                                </Button>
                                            </CalendarPrevTrigger>
                                            <CalendarNextTrigger>
                                                <Button variant="outline" size="icon" className="h-8 w-8">
                                                    <ChevronRight className="h-4 w-4" />
                                                </Button>
                                            </CalendarNextTrigger>
                                        </div>
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
                        <MentorSlots
                            mentorId={mentor.id}
                            date={selectedDate}
                            slots={slots}
                            isLoading={isLoading}
                        />
                    </div>
                </div>
            </Calendar>
        </div >
    );
}
