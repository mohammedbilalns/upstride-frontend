import type { Activity } from "@/shared/types/connection";

export function getActivityDisplay(activity: Activity) {
  switch (activity.activityType) {
    case "followed_user":
      return {
        message: (
          <>
            You started following{" "}
            <span className="font-medium">{activity.userName}</span>
          </>
        ),
        color: "bg-blue-500",
      };
    case "followed_you":
      return {
        message: (
          <>
            <span className="font-medium">{activity.userName}</span> started
            following you
          </>
        ),
        color: "bg-green-500",
      };
    default:
      return {
        message: "Unknown activity",
        color: "bg-gray-400",
      };
  }
}
