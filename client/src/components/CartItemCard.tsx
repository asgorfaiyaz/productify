import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CartItemCardProps {
  id: string;
  title: string;
  description: string;
  price: number;
  quantity: number;
  onAdd: (item: {
    id: string;
    title: string;
    description: string;
    price: number;
    quantity: number;
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
  onAdd,
  onRemove,
  onDelete,
}) => {
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg p-5">
      <div className="flex flex-col gap-1">
        <span className="font-medium">{title}</span>
        <span className="text-sm text-muted-foreground">{description}</span>
        <span className="text-sm font-semibold">${price}</span>
      </div>

      <div className="flex items-center gap-2">
        <Button
          size="icon"
          variant="outline"
          onClick={() => onRemove(id)}
          disabled={quantity <= 1}
        >
          <Minus size={14} />
        </Button>

        <span className="w-6 text-center">{quantity}</span>

        <Button
          size="icon"
          variant="outline"
          onClick={() =>
            onAdd({
              id,
              title,
              description,
              price,
              quantity: 1,
            })
          }
        >
          <Plus size={14} />
        </Button>

        <Button size="icon" variant="ghost" onClick={() => onDelete(id)}>
          <Trash2 size={16} className="text-red-500" />
        </Button>
      </div>
    </div>
  );
};

export default CartItemCard;
