import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CartItemCardProps {
  id: string;
  title: string;
  description: string;
  price: number;
  quantity: number;
  imageUrl: string;
  onAdd: (item: {
    id: string;
    title: string;
    description: string;
    price: number;
    quantity: number;
    imageUrl: string;
  }) => void;
  onRemove: (id: string) => void;
  onDelete: (id: string) => void;
}

const CartItemCard: React.FC<CartItemCardProps> = ({
  id,
  title,
  description,
  price,
  quantity,
  imageUrl,
  onAdd,
  onRemove,
  onDelete,
}) => {
  return (
    <div className="flex items-start gap-4 rounded-lg bg-base-200 p-3">
      {/* Image */}
      <div className="h-16 w-16 shrink-0 overflow-hidden rounded-md bg-muted">
        <img
          src={imageUrl}
          alt={title}
          className="h-full w-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-2">
        {/* Title + Delete */}
        <div className="flex items-start justify-between gap-2">
          <div>
            <h4 className="text-sm font-medium leading-tight">{title}</h4>
            <p className="text-xs text-muted-foreground line-clamp-1">
              {description}
            </p>
          </div>

          <Button
            size="icon"
            variant="ghost"
            className="h-7 w-7 text-muted-foreground hover:text-red-500"
            onClick={() => onDelete(id)}
          >
            <Trash2 size={14} />
          </Button>
        </div>

        {/* Price + Quantity */}
        <div className="flex items-center justify-between">
          {/* Quantity */}
          <div className="flex items-center gap-2">
            <Button
              size="icon"
              variant="outline"
              className="h-7 w-7"
              onClick={() => onRemove(id)}
              disabled={quantity <= 1}
            >
              <Minus size={12} />
            </Button>

            <span className="w-4 text-center text-sm font-medium">
              {quantity}
            </span>

            <Button
              size="icon"
              variant="outline"
              className="h-7 w-7"
              onClick={() =>
                onAdd({
                  id,
                  title,
                  description,
                  price,
                  quantity: 1,
                  imageUrl,
                })
              }
            >
              <Plus size={12} />
            </Button>
          </div>

          {/* Prices */}
          <div className="text-right">
            <p className="text-xs text-muted-foreground">
              ${price.toFixed(2)} each
            </p>
            <p className="text-sm font-semibold">
              ${(price * quantity).toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItemCard;
