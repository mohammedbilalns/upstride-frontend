import { Card, CardContent } from "@/components/ui/card";
import UserAvatar from "@/components/common/UserAvatar";
import { Heart, MessageSquare, Bookmark, Eye } from "lucide-react";
import type { Article } from "@/shared/types/article";
import { formatRelativeTime } from "@/shared/utils/dateUtil";

export default function ArticleFeed({article}:{article: Article}) {

  return (
    <Card
      key={article.id}
      className="hover:shadow-md transition-shadow"
    >
      <CardContent className="p-6">
        <div className="flex items-center mb-4">
          <UserAvatar image={article.authorImage} name={article.authorName} size={10} />
          <div className="ml-3">
            <div className="flex items-center">
              <p className="text-sm font-medium">
                {article.authorName}
              </p>
            </div>
            <p className="text-xs text-muted-foreground">
              { formatRelativeTime(article.createdAt)}
            </p>
          </div>
        </div>

        <h3 className="text-lg font-semibold mb-2">
          {article.title}
        </h3>
        <p className="text-muted-foreground mb-4">
          {article.description}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex space-x-4 text-sm text-muted-foreground">
            <button className="flex items-center hover:text-primary transition-colors">
              <Heart className="h-4 w-4 mr-1" />
              <span>{article.likes}</span>
            </button>
            <button className="flex items-center hover:text-primary transition-colors">
              <MessageSquare className="h-4 w-4 mr-1" />
              <span>{article.comments}</span>
            </button>
            <button className="flex items-center hover:text-primary transition-colors">
              <Bookmark className="h-4 w-4 mr-1" />
            </button>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Eye className="h-4 w-4 mr-1" />
            <span>{article.views} views</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )

}
