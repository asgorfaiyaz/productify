import { useDeleteReview } from "@/hooks/useReviews";
import { Trash2Icon } from "lucide-react";

function ReviewCard({
  review,
  currentUserId,
  productId,
}: {
  review: {
    id: string;
    createdAt: string;
    content: string;
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

  return (
    <div className="chat chat-start">
      <div className="chat-image avatar">
        <div className="w-8 rounded-full">
          <img src={review.owner?.imageUrl} alt={review.owner?.name} />
        </div>
      </div>

      <div className="chat-header text-xs opacity-70 mb-2">
        {review.owner?.name}
        <time className="ml-2 text-xs opacity-50">
          {new Date(review.createdAt).toLocaleDateString()}
        </time>
      </div>

      <div className="chat-bubble chat-bubble-neutral text-sm">
        {review.content}
      </div>

      {currentUserId === review.owner.id && (
        <div className="chat-footer">
          <button
            onClick={() => {
              deleteReview.mutate({
                reviewId: review.id,
                productId,
              });
            }}
            className="btn btn-ghost btn-xs text-error"
            disabled={deleteReview.isPending}
          >
            {deleteReview.isPending ? (
              <span className="loading loading-spinner loading-xs" />
            ) : (
              <Trash2Icon className="size-3" />
            )}
          </button>
        </div>
      )}
    </div>
  );
}

export default ReviewCard;
