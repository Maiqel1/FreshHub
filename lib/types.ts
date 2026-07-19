export type MenuItem = {
  id: string;
  name: string;
  price: number;
  available: boolean;
  photoUrl: string | null;
};

export type MenuCategory = {
  id: string;
  name: string;
  items: MenuItem[];
};

export type SeedItem = { id: string; n: string; p: number; avail: boolean };
export type SeedCategory = { id: string; name: string; items: SeedItem[] };
