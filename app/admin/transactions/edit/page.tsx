"use client";

import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin-layout";
import { EditTransactionForm } from "../id/edit-transaction-form";
import { useSelectedIdsStore } from "@/lib/store/selected-ids";
import { useRouter } from "next/navigation";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export default function EditTransactionPage() {
  const { selectedTransactionId } = useSelectedIdsStore();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // If no transaction ID is selected, redirect back to transactions list
    if (!selectedTransactionId) {
      router.push("/admin/transactions");
      return;
    }
    setIsLoading(false);
  }, [selectedTransactionId, router]);

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-[calc(100vh-200px)]">
          <LoadingSpinner size="lg" />
        </div>
      </AdminLayout>
    );
  }

  return <EditTransactionForm />;
}
