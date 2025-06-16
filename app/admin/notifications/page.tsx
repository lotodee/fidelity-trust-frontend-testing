"use client";

import { AdminLayout } from "@/components/admin-layout";
import { motion } from "framer-motion";

export default function AdminNotifications() {
  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold mb-2">Notifications</h1>
          <p className="text-gray-500">
            Notifications are managed through the notification dropdown in the header.
          </p>
        </motion.div>
      </div>
    </AdminLayout>
  );
}
