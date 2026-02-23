import { useDeleteReview } from "@/hooks/useReviews";
import { Trash2Icon, StarIcon } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

function StarDisplay({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <StarIcon
          key={star}
          className={cn(
            "size-3",
            star <= rating
              ? "fill-amber-400 text-amber-400"
              : "fill-none text-muted-foreground/30",
          )}
          strokeWidth={star <= rating ? 0 : 1.5}
        />
      ))}
    </div>
  );
}

function ReviewCard({
  review,
  currentUserId,
  productId,
}: {
  review: {
    id: string;
    createdAt: string;
    content: string;
    rating: number;
    owner: {
      id: string;
      name: string;
      imageUrl: string;
    };
  };
  currentUserId: string;
  productId: string;
}) {
  const deleteReview = useDeleteReview();
  const isOwner = currentUserId === review.owner.id;
  const initials = review.owner.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div
      className={cn(
        "group relative flex gap-3 rounded-lg border bg-card p-3 shadow-sm transition-colors",
        isOwner && "border-primary/20 bg-primary/2",
      )}
    >
      {/* Avatar */}
      <Avatar className="size-8 shrink-0 mt-0.5">
        <AvatarImage src={review.owner.imageUrl} alt={review.owner.name} />
        <AvatarFallback className="text-xs font-medium">
          {initials}
        </AvatarFallback>
      </Avatar>

      {/* Content */}
      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-medium leading-none truncate">
              {review.owner.name}
            </span>
            {isOwner && (
              <span className="text-[10px] font-medium text-primary bg-primary/10 px-1.5 py-0.5 rounded-full leading-none">
                You
              </span>
            )}
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <time className="text-xs text-muted-foreground">
              {new Date(review.createdAt).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </time>

            {isOwner && (
              <TooltipProvider delayDuration={200}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-6 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                      disabled={deleteReview.isPending}
                      onClick={() =>
                        deleteReview.mutate({
                          reviewId: review.id,
                          productId,
                        })
                      }
                    >
                      {deleteReview.isPending ? (
                        <span className="size-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Trash2Icon className="size-3" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="text-xs">
                    Delete review
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        </div>

        {/* Stars */}
        <StarDisplay rating={review.rating} />

        {/* Review text */}
        <p className="text-sm text-muted-foreground leading-relaxed">
          {review.content}
        </p>
      </div>
    </div>
  );
}

export default ReviewCard;
