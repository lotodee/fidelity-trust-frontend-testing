"use client";

import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin-layout";
import { EditUserForm } from "../id/edit-user-form";
import { useSelectedIdsStore } from "@/lib/store/selected-ids";
import { useRouter } from "next/navigation";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export default function EditUserPage() {
  const { selectedUserId } = useSelectedIdsStore();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // If no user ID is selected, redirect back to users list
    if (!selectedUserId) {
      router.push("/admin/users");
      return;
    }
    setIsLoading(false);
  }, [selectedUserId, router]);

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-[calc(100vh-200px)]">
          <LoadingSpinner size="lg" />
        </div>
      </AdminLayout>
    );
  }

  return <EditUserForm />;
}
