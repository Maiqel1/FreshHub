export function formatNaira(amount: number): string {
  return "₦" + Number(amount).toLocaleString("en-NG");
}

export function photoLabel(name: string): string {
  return name.split("—")[0].split("(")[0].trim();
}

export function categorySlug(name: string): string {
  return (
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "category"
  );
}
