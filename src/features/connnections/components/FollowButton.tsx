import { Button } from "@/components/ui/button";
import { UserCheck, UserMinus } from "lucide-react";
import { useFollowMentor } from "../hooks/useFollowMentor";
import { useUnfollowMentor } from "../hooks/useUnfollowMentor";

interface FollowButtonProps {
  isFollowing: boolean;
  mentorId: string;
}

export default function FollowButton({ isFollowing, mentorId }: FollowButtonProps) {
  const followMentorMutation = useFollowMentor();
  const unfollowMentorMutation = useUnfollowMentor();

  const handleFollowClick = () => {
    if (isFollowing) {
      unfollowMentorMutation.mutate(mentorId);
    } else {
      followMentorMutation.mutate(mentorId);
    }
  };

  const isLoading = followMentorMutation.isPending || unfollowMentorMutation.isPending;

  return (
    <Button
      size="sm"
      className="cursor-pointer"
      variant={isFollowing ? "outline" : "default"}
      onClick={handleFollowClick}
      disabled={isLoading}
    >
      {isLoading ? (
        <div className="flex items-center">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-1"></div>
          {isFollowing ? "Unfollowing..." : "Following..."}
        </div>
      ) : (
        <>
          {isFollowing ? (
            <>
              <UserMinus className="h-4 w-4 mr-1" />
              Unfollow
            </>
          ) : (
            <>
              <UserCheck className="h-4 w-4 mr-1" />
              Follow
            </>
          )}
        </>
      )}
    </Button>
  );
}
