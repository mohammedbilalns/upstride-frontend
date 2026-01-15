import FollowedMentorsPage from '@/features/mentor-discovery/pages/FollowedMentorsPage'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(authenticated)/mentors/followed')({
  component: FollowedMentorsPage
})


