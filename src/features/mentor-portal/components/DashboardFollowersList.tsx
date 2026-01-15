import Pending from "@/components/common/Pending";
import UserAvatar from "@/components/common/UserAvatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import GoToChat from "@/features/chats/components/GoToChat";
import { useFetchFollowers } from "@/features/connnections/hooks/connections-queries.hooks";
import { Users } from "lucide-react";

export default function DashboardFollowersList() {

  const {
    data: followersData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: followersLoading
  } = useFetchFollowers();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Followers
        </CardTitle>
        <CardDescription>
          People who are following your mentor profile
        </CardDescription>
      </CardHeader>
      <CardContent>
        {followersLoading ? (
          <Pending resource="Followers" />
        ) : (
            <div className="space-y-4">
              {followersData?.pages.flatMap(page => page).map((follower) => (
                <div key={follower.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <UserAvatar
                      name={follower.followerId.name}
                      size={12}
                    />
                    <div>
                      <h3 className="font-medium">{follower.followerId.name}</h3>
                      <p className="text-sm text-muted-foreground">{follower.followerId.email}</p>
                    </div>
                  </div>
                  <GoToChat userId={follower.followerId._id} />
                </div>
              ))}
              {hasNextPage && (
                <div className="flex justify-center mt-4">
                  <Button
                    variant="outline"
                    onClick={() => fetchNextPage()}
                    disabled={isFetchingNextPage}
                  >
                    {isFetchingNextPage ? "Loading..." : "Load More"}
                  </Button>
                </div>
              )}
            </div>
          )}
      </CardContent>
    </Card>
  )
}
