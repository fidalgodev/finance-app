import { TriangleAlert } from "lucide-react";

import { useEditTransactionSheet } from "@/features/transactions/hooks/useEditTransactionSheet";

type Props = {
  transactionId: string;
  category: string | null;
};

export const CategoryColumn = ({ transactionId, category }: Props) => {
  const { onOpen } = useEditTransactionSheet();

  const handleEditTransaction = () => {
    onOpen(transactionId);
  };

  if (category) {
    return <div className="flex items-center">{category}</div>;
  } else {
    return (
      <button
        onClick={handleEditTransaction}
        className="flex items-center text-rose-500"
      >
        <TriangleAlert className="size-4 mr-2 shrink-0" />
        Uncategorized
      </button>
    );
  }
};
