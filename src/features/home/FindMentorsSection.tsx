import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {Filter, Search} from "lucide-react";
import { Input } from "@/components/ui/input";
import UserAvatar from "@/components/common/UserAvatar";
import { dummyMentors } from "@/routes/(authenticated)/home/-dummyData";

export default function FindMentorsSection() {

  // TODO: add logic to fetch mentors based on search query
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Find Mentors</span>
          <Button
            className="cursor-pointer"
            variant="ghost"
            size="icon"
          >
            <Filter className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search by expertise..."
            className="pl-10"
          />
        </div>

        <div className="space-y-3">
          {dummyMentors.map((mentor) => (
            <div
              key={mentor.id}
              className="flex items-center justify-between p-3 border rounded-lg"
            >
              <div className="flex items-center">
                <div className="relative">
                  <UserAvatar image={mentor.imageUrl} name={mentor.name} size={10} />

                  {mentor.isOnline && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background"></div>
                  )}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium">{mentor.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {mentor.title}
                  </p>
                </div>
              </div>
              <Button className="cursor-pointer" size="sm">
                Connect
              </Button>
            </div>
          ))}
        </div>

        <Button variant="link" className="w-full cursor-pointer">
          View All Mentors
        </Button>
      </CardContent>
    </Card>

  )
}
