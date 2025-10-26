import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { dummyQuickActions } from "@/routes/(authenticated)/home/-dummyData";
import { Button } from "@/components/ui/button";

export default function QuickActions(){
  // TODO: add real data
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {dummyQuickActions.map((action) => {
          const Icon = action.icon;
          return (
            <Button
              key={action.id}
              variant="ghost"
              className="cursor-pointer w-full justify-start"
            >
              <div className="bg-muted p-2 rounded-lg mr-3">
                <Icon className="h-4 w-4 text-primary" />
              </div>
              <span>{action.title}</span>
            </Button>
          );
        })}
      </CardContent>
    </Card>

  )
}
