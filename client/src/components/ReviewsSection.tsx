import { useState } from "react";
import { useAuth, SignInButton } from "@clerk/clerk-react";
import { SendIcon, MessageSquareIcon, LogInIcon, StarIcon } from "lucide-react";
import { useCreateReview } from "@/hooks/useReviews";
import ReviewCard from "./ReviewCard";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const RATING_LABELS = ["Terrible", "Bad", "Okay", "Good", "Excellent"];

function StarRating({
  value,
  onChange,
  disabled,
}: {
  value: number;
  onChange: (rating: number) => void;
  disabled?: boolean;
}) {
  const [hovered, setHovered] = useState(0);

  return (
    <TooltipProvider delayDuration={100}>
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => {
          const filled = star <= (hovered || value);
          return (
            <Tooltip key={star}>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  disabled={disabled}
                  onClick={() => onChange(star)}
                  onMouseEnter={() => setHovered(star)}
                  onMouseLeave={() => setHovered(0)}
                  className={cn(
                    "transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm disabled:cursor-not-allowed disabled:opacity-50",
                    filled
                      ? "scale-110 text-amber-400"
                      : "text-muted-foreground hover:text-amber-300",
                  )}
                >
                  <StarIcon
                    className="size-5"
                    fill={filled ? "currentColor" : "none"}
                    strokeWidth={filled ? 0 : 1.5}
                  />
                </button>
              </TooltipTrigger>
              <TooltipContent side="top" className="text-xs">
                {RATING_LABELS[star - 1]}
              </TooltipContent>
            </Tooltip>
          );
        })}
        {(hovered || value) > 0 && (
          <span className="ml-1.5 text-xs text-muted-foreground transition-opacity">
            {RATING_LABELS[(hovered || value) - 1]}
          </span>
        )}
      </div>
    </TooltipProvider>
  );
}

function ReviewsSection({
  productId,
  reviews,
  currentUserId,
}: {
  productId: string;
  reviews: {
    id: string;
    createdAt: string;
    content: string;
    rating: number;
    owner: { id: string; name: string; imageUrl: string };
  }[];
  currentUserId: string;
}) {
  const { isSignedIn } = useAuth();
  const [content, setContent] = useState("");
  const [rating, setRating] = useState(0);
  const createReview = useCreateReview();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!content.trim() || rating === 0) return;
    createReview.mutate(
      { productId, content, rating },
      {
        onSuccess: () => {
          setContent("");
          setRating(0);
        },
      },
    );
  };

  const avgRating =
    reviews.length > 0
      ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
      : null;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquareIcon className="size-4 text-primary" />
          <h3 className="font-semibold text-sm">Reviews</h3>
          <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full">
            {reviews.length}
          </span>
        </div>
        {avgRating !== null && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <StarIcon className="size-3.5 fill-amber-400 text-amber-400" />
            <span className="font-medium text-foreground">
              {avgRating.toFixed(1)}
            </span>
            <span>avg</span>
          </div>
        )}
      </div>

      {/* Form */}
      {isSignedIn ? (
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="rounded-lg border p-3 space-y-3 shadow-sm">
            {/* Star Rating */}
            <div className="flex flex-col gap-5">
              <label className=" text-xs font-medium text-muted-foreground">
                Your rating <span className="text-destructive">*</span>
              </label>
              <StarRating
                value={rating}
                onChange={setRating}
                disabled={createReview.isPending}
              />
            </div>

            {/* Divider */}
            <div className="border-t" />

            {/* Text + Submit */}
            <div className="flex gap-2 items-end">
              <Textarea
                placeholder="Share your experience..."
                className="min-h-15 max-h-30 resize-none text-sm flex-1 focus-visible:ring-1"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                disabled={createReview.isPending}
              />
              <Button
                type="submit"
                size="icon"
                className="shrink-0 self-end"
                disabled={
                  createReview.isPending || !content.trim() || rating === 0
                }
              >
                {createReview.isPending ? (
                  <span className="animate-spin size-4 border-2 border-current border-t-transparent rounded-full" />
                ) : (
                  <SendIcon className="size-4" />
                )}
              </Button>
            </div>

            {/* Validation hint */}
            {content.trim() && rating === 0 && (
              <p className="text-xs text-amber-500">
                Please select a star rating before submitting.
              </p>
            )}
          </div>
        </form>
      ) : (
        <div className="flex items-center justify-between rounded-lg border bg-muted/40 p-3">
          <span className="text-sm text-muted-foreground">
            Sign in to leave a review
          </span>
          <SignInButton mode="modal">
            <Button size="sm" variant="default" className="gap-1.5">
              <LogInIcon className="size-3.5" />
              Sign In
            </Button>
          </SignInButton>
        </div>
      )}

      {/* Reviews list */}
      <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
        {reviews.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground">
            <MessageSquareIcon className="size-7 mx-auto mb-2 opacity-25" />
            <p className="text-sm">No reviews yet. Be the first!</p>
          </div>
        ) : (
          reviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              currentUserId={currentUserId}
              productId={productId}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default ReviewsSection;
