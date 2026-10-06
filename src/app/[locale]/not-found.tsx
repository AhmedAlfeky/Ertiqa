import { useTranslations } from "next-intl";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  const t = useTranslations("notFound");

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      <h1 className="text-4xl font-bold tracking-tight text-foreground">{t("title")}</h1>
      <p className="text-muted-foreground mt-3 max-w-md">{t("description")}</p>
      <div className="mt-6">
        <Button asChild>
          <Link href="/">{t("backHome")}</Link>
        </Button>
      </div>
    </div>
  );
}