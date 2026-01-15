import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { followersQueryOptions } from "@/features/connnections/services/connection.service";
import UserAvatar from "@/components/common/UserAvatar";
import GoToChat from "@/features/chats/components/GoToChat";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";

export default function MentorNetworkPage() {
    const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
        useSuspenseInfiniteQuery(followersQueryOptions());

    const followers = data.pages.flat();

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">My Network</h1>
                <p className="text-muted-foreground">
                    View and manage your followers and connections.
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Followers ({followers.length})</CardTitle>
                </CardHeader>
                <CardContent>
                    {followers.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            No followers yet.
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {followers.map((follower) => (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    key={follower.id}
                                    className="flex items-center justify-between p-3 border rounded-lg bg-card hover:bg-accent/50 transition-colors"
                                >
                                    <div className="flex items-center">
                                        <UserAvatar
                                            image={follower.followerId?.profilePicture}
                                            name={follower.followerId.name}
                                            size={10}
                                        />
                                        <div className="ml-3">
                                            <h3 className="font-medium">{follower.followerId?.name}</h3>

                                        </div>
                                    </div>
                                    <div className="flex space-x-2">
                                        <GoToChat userId={follower.followerId._id} isText={true} />
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}

                    {hasNextPage && (
                        <div className="mt-6 flex justify-center">
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
