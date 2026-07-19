import { getMenu } from "@/lib/menu";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const { categories } = await getMenu();
  const allItems = categories.flatMap((c) => c.items);
  const soldOut = allItems.filter((i) => !i.available).length;

  const stats = [
    { k: "Menu items", v: allItems.length },
    { k: "Categories", v: categories.length },
    { k: "Sold out", v: soldOut },
    // { k: "Orders today (demo)", v: 27 },
  ];

  const bestSellers = allItems.slice(0, 5).map((it, i) => ({
    name: it.name,
    units: Math.max(1, 40 - i * 6),
  }));

  return (
    <>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-[24px]">Dashboard</h2>
      </div>
      <p className="fh-note mb-6">
        Order counts and best sellers below are illustrative demo data — connect a POS
        or order log to populate this live.
      </p>

      <div className="mb-8 grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(190px,1fr))]">
        {stats.map((s) => (
          <div key={s.k} className="fh-stat">
            <div className="fh-stat-k">{s.k}</div>
            <div className="fh-stat-v">{s.v}</div>
          </div>
        ))}
      </div>

      <div className="fh-panel">
        <div className="fh-panel-head">
          <h3 className="text-[15px]">Best sellers (demo)</h3>
        </div>
        <table className="fh-table">
          <thead>
            <tr>
              <th>Item</th>
              <th>Category</th>
              {/* <th>Units sold (demo)</th> */}
            </tr>
          </thead>
          <tbody>
            {bestSellers.map((b) => (
              <tr key={b.name}>
                <td>{b.name}</td>
                <td>—</td>
                <td>{b.units}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
