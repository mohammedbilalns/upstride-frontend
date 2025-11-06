import {
  type InfiniteData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";
import type { ApiError } from "@/shared/types";
import type { NotificationsResponse } from "@/shared/types/notifications";
import {
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "../services/notification.service";

type NotificationsInfiniteData = InfiniteData<NotificationsResponse>;

// helper function to update notifications in cache
const updateNotificationsCache = (
  oldData: NotificationsInfiniteData | undefined,
  notificationId?: string, 
): NotificationsInfiniteData | undefined => {
  if (!oldData?.pages?.length) return oldData;

  const newPages = oldData.pages.map((page, index) => {
    const updatedNotifications = page.notifications.map((notif) => {
      // Mark specific notification or all notifications
      const shouldMarkAsRead = !notificationId || notif.id === notificationId;
      return shouldMarkAsRead ? { ...notif, isRead: true } : notif;
    });

    // Update unread count only on first page
    if (index === 0) {
      const unreadCount = notificationId
        ? Math.max(0, page.unreadCount - 1) // Decrement by 1
        : 0; // Reset to 0 for mark all

      return {
        ...page,
        notifications: updatedNotifications,
        unreadCount,
      };
    }

    return {
      ...page,
      notifications: updatedNotifications,
    };
  });

  return { ...oldData, pages: newPages };
};

export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => markNotificationAsRead(id),

    onMutate: async (id) => {
      // Cancel outgoing queries
      await queryClient.cancelQueries({ queryKey: ["notifications"] });

      // Snapshot previous value
      const previousNotifications = queryClient.getQueryData<NotificationsInfiniteData>(
        ["notifications"]
      );

      // Optimistically update
      queryClient.setQueryData<NotificationsInfiniteData>(
        ["notifications"],
        (oldData) => updateNotificationsCache(oldData, id)
      );

      return { previousNotifications };
    },

    onError: (error: ApiError, _id, context) => {
      // Rollback on error
      if (context?.previousNotifications) {
        queryClient.setQueryData(
          ["notifications"],
          context.previousNotifications
        );
      }

      const errorMessage =
        error?.response?.data?.message || "Failed to mark notification as read";
      toast.error(errorMessage);
      console.error("Mark notification as read error:", error);
    },
  });
};

export const useMarkAllNotificationsAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => markAllNotificationsAsRead(),

    onMutate: async () => {
      // Cancel outgoing queries
      await queryClient.cancelQueries({ queryKey: ["notifications"] });

      // Snapshot previous value
      const previousNotifications = queryClient.getQueryData<NotificationsInfiniteData>(
        ["notifications"]
      );

      // Optimistically update (no ID means mark all)
      queryClient.setQueryData<NotificationsInfiniteData>(
        ["notifications"],
        (oldData) => updateNotificationsCache(oldData)
      );

      return { previousNotifications };
    },

    onError: (error: ApiError, _variables, context) => {
      // Rollback on error
      if (context?.previousNotifications) {
        queryClient.setQueryData(
          ["notifications"],
          context.previousNotifications
        );
      }

      const errorMessage =
        error?.response?.data?.message ||
        "Failed to mark all notifications as read";
      toast.error(errorMessage);
      console.error("Mark all notifications as read error:", error);
    },

    onSuccess: () => {
      toast.success("All notifications marked as read");
    },
  });
};
