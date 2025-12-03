"use client";

import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useTranslations } from "next-intl";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

interface DeleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  itemName?: string;
  isLoading?: boolean;
}

export function DeleteDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  itemName = "item",
  isLoading = false,
}: DeleteDialogProps) {
  const t = useTranslations("instructor");

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="[&>div]:!animate-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          <AlertDialogHeader>
            <AlertDialogTitle>{title || t("confirmDeleteLesson")}</AlertDialogTitle>
            <AlertDialogDescription>{description || t("confirmDeleteLessonDesc")}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>{t("cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                e.preventDefault();
                onConfirm();
              }}
              disabled={isLoading}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t("delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </motion.div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
