import { Button } from "@/components/ui/button";
import { UserCheck, UserX } from "lucide-react";
import { ConfirmDialog } from "@/components/common/Confirm";
import type { User } from "@/shared/types";

interface UserActionButtonProps {
  user: User;
  onBlock: (id: string) => void;
  onUnblock: (id: string) => void;
  isPending: boolean;
}

export function UserActionButton({ user, onBlock, onUnblock, isPending }: UserActionButtonProps) {
  const handleBlock = () => {
    onBlock(user.id);
  };

  const handleUnblock = () => {
    onUnblock(user.id);
  };

  return (
    <>
      {user.isBlocked ? (
        <ConfirmDialog
          title="Unblock User"
          description={`Are you sure you want to unblock ${user.name}? This user will regain access to their account.`}
          confirmText="Unblock User"
          icon={<UserCheck className="h-5 w-5 text-green-500" />}
          onConfirm={handleUnblock}
          disabled={isPending}
        >
          <Button
            size="sm"
            variant="secondary"
            disabled={isPending}
            className="cursor-pointer w-20"
          >
            {isPending ? "Loading..." : "Unblock"}
          </Button>
        </ConfirmDialog>
      ) : (
        <ConfirmDialog
          title="Block User"
          description={`Are you sure you want to block ${user.name}? This user will no longer be able to access their account.`}
          confirmText="Block User"
          variant="destructive"
          icon={<UserX className="h-5 w-5 text-red-500" />}
          onConfirm={handleBlock}
          disabled={isPending}
        >
          <Button
            size="sm"
            variant="destructive"
            disabled={isPending}
            className="cursor-pointer w-20"
          >
            {isPending ? "Loading..." : "Block"}
          </Button>
        </ConfirmDialog>
      )}
    </>
  );
}
