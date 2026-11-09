import { Alert } from "@/components/Alert";
import { messages } from "@/lib/copy/messages";

type CategoryNoticeProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function CategoryNotice({ searchParams }: CategoryNoticeProps) {
  const { notice } = await searchParams;
  if (notice !== "category-unavailable") return null;

  return <Alert type="warning">{messages["category.unavailable"]}</Alert>;
}
