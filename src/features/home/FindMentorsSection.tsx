import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import UserAvatar from "@/components/common/UserAvatar";
import type { Mentor } from "@/shared/types/mentor";
import { useFetchSuggestedMentors } from "../articles/hooks/useFetchSuggestedMentors";
import Pending from "@/components/common/pending";
import { Link } from "@tanstack/react-router";
import { Activity } from "react";

export default function FindMentorsSection() {
  const {data, isPending} = useFetchSuggestedMentors();
  const mentors = data?.mentors.slice(0, 3)

  // TODO: add logic to fetch mentors based on search query

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Find Mentors</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {isPending ? (
          <Pending resource="mentors" />
        ): mentors.length ==0 ? (
            <p className="text-center text-muted-foreground">No mentors in the Platform yet.</p>
          ): (
              <div className="space-y-3">
                {mentors.map((mentor: Mentor) => (
                  <div
                    key={mentor.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center">
                      <div className="relative">
                        <UserAvatar image={mentor.user.profilePicture} name={mentor.user.name} size={10} />

                        {/* {mentor.isOnline && ( */}
                        {/*   <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background"></div> */}
                        {/* )} */}
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium">{mentor.user.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {mentor.expertise.name}
                        </p>
                      </div>
                    </div>
                    <Button className="cursor-pointer" size="sm">
                      Connect
                    </Button>
                  </div>
                ))}
              </div>
            )} 
        <Activity mode={mentors?.length >0 ? "visible": "hidden"}>
          <Button variant="link" asChild className="w-full cursor-pointer">
            <Link to="/mentors" > Discover More Mentors</Link>
          </Button>
        </Activity>

      </CardContent>
    </Card>

  )
}
