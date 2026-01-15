import { Link } from "@tanstack/react-router";
import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { followingQueryOptions } from "@/features/connnections/services/connection.service";
import GoToChat from "@/features/chats/components/GoToChat";
import UserAvatar from "@/components/common/UserAvatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";

export default function FollowedMentorsPage() {
    const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
        useSuspenseInfiniteQuery(followingQueryOptions());

    const mentors = data.pages.flat();

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Followed Mentors</h1>
                <p className="text-muted-foreground">
                    Mentors you are following and their expertise.
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Mentors ({mentors.length})</CardTitle>
                </CardHeader>
                <CardContent>
                    {mentors.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            You are not following any mentors yet.
                        </div>
                    ) : (
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {mentors.map((mentor) => (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    key={mentor.id}
                                    className="rounded-lg border bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow"
                                >
                                    <Link
                                        to="/mentors/$mentorId"
                                        params={{ mentorId: mentor?.mentorId?._id }}
                                        className="block p-4"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-center gap-3">
                                                <UserAvatar
                                                    image={mentor.mentorId?.userId?.profilePicture}
                                                    name={mentor.mentorId?.userId?.name}
                                                    size={12}
                                                />
                                                <div>
                                                    <h3 className="font-semibold hover:text-primary transition-colors">
                                                        {mentor.mentorId?.userId?.name}
                                                    </h3>
                                                    <p className="text-sm text-muted-foreground">
                                                        {mentor.mentorId?.expertiseId?.name}
                                                    </p>
                                                </div>
                                            </div>
                                            <div onClick={(e) => e.preventDefault()}>
                                                <GoToChat userId={mentor.mentorId?.userId?._id} isText={false} />
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    )}

                    {hasNextPage && (
                        <div className="mt-8 flex justify-center">
                            <Button
                                onClick={() => fetchNextPage()}
                                disabled={isFetchingNextPage}
                                variant="outline"
                                className="min-w-[150px]"
                            >
                                {isFetchingNextPage ? (
                                    <div className="flex items-center gap-2">
                                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                                        <span>Loading...</span>
                                    </div>
                                ) : (
                                    "View More"
                                )}
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
