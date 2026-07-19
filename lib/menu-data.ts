import type { SeedCategory } from "./types";

export const DEFAULT_CATEGORIES: SeedCategory[] = [
  {
    id: "sandwiches",
    name: "Sandwiches",
    items: [
      { id: "s1", n: "Chicken & egg (Mayo sandwich)", p: 4500, avail: true },
      { id: "s2", n: "Chicken club sandwich", p: 4000, avail: true },
      { id: "s3", n: "Chicken melt sandwich", p: 4500, avail: true },
      { id: "s4", n: "Beef melt sandwich", p: 4500, avail: true },
    ],
  },
  {
    id: "paninis",
    name: "Paninis",
    items: [
      { id: "p1", n: "Chicken and cheese panini", p: 4000, avail: true },
      { id: "p2", n: "Beef and cheese panini", p: 4000, avail: true },
    ],
  },
  {
    id: "rice",
    name: "Rice",
    items: [
      { id: "r1", n: "Fried rice", p: 2500, avail: true },
      { id: "r2", n: "Jollof rice", p: 3000, avail: true },
      { id: "r3", n: "Chicken rice", p: 4500, avail: true },
    ],
  },
  {
    id: "spaghetti",
    name: "Spaghetti",
    items: [
      { id: "sp1", n: "Jollof spaghetti", p: 3000, avail: true },
      { id: "sp2", n: "Chicken stir-fry spaghetti", p: 5000, avail: true },
      { id: "sp3", n: "Chicken spaghetti", p: 4500, avail: true },
    ],
  },
  {
    id: "sides",
    name: "Sides",
    items: [
      { id: "sd1", n: "Chicken wings", p: 5000, avail: true },
      { id: "sd2", n: "Spicy chicken", p: 4000, avail: true },
      { id: "sd3", n: "Spicy beef", p: 4000, avail: true },
      { id: "sd4", n: "French fries", p: 3000, avail: true },
      { id: "sd5", n: "Sweet potato (boiled/fried) + egg sauce", p: 4000, avail: true },
      { id: "sd6", n: "Fried/boiled yam + egg sauce", p: 4500, avail: true },
      { id: "sd7", n: "Fried plantain + egg sauce", p: 4500, avail: true },
      {
        id: "sd8",
        n: "Special loaded fries — fries, cheese, chicken, chef's cream sauce",
        p: 7000,
        avail: false,
      },
    ],
  },
  {
    id: "shawarma",
    name: "Shawarma",
    items: [
      { id: "sh1", n: "Chicken/beef shawarma", p: 3500, avail: true },
      { id: "sh2", n: "Chicken/beef shawarma (single sausage)", p: 4000, avail: true },
      { id: "sh3", n: "Chicken/beef shawarma (double sausage)", p: 5000, avail: true },
      { id: "sh4", n: "Extra cheese, any shawarma", p: 1000, avail: true },
    ],
  },
  {
    id: "burgers",
    name: "Burgers",
    items: [
      { id: "b1", n: "Beef burger", p: 5000, avail: true },
      { id: "b2", n: "Chicken burger", p: 5000, avail: true },
    ],
  },
  {
    id: "combos",
    name: "Combos",
    items: [
      { id: "c1", n: "Panini, spicy chicken, fries & smoothie", p: 14000, avail: true },
      { id: "c2", n: "Burger, fries, spicy chicken & juice/smoothie", p: 15000, avail: true },
      { id: "c3", n: "Club sandwich, chicken wings, loaded fries & shawarma", p: 15000, avail: true },
    ],
  },
  {
    id: "smoothies",
    name: "Smoothies",
    items: [
      { id: "sm1", n: "Keep Me Fit — tigernut, pineapple, banana, date", p: 3000, avail: true },
      { id: "sm2", n: "Sunshine — watermelon, banana, strawberry", p: 3000, avail: true },
      { id: "sm3", n: "Heartlen Blues — tigernut, avocado, banana, date", p: 3000, avail: true },
      { id: "sm4", n: "Alliance Arena — pineapple, banana, grapes", p: 3000, avail: true },
      { id: "sm5", n: "Sweet Dreams — pineapple, apple, grapes", p: 3000, avail: true },
      { id: "sm6", n: "Kiss Me Twice — watermelon, pineapple, banana", p: 3000, avail: true },
    ],
  },
  {
    id: "juice",
    name: "Fresh Juice",
    items: [
      { id: "j1", n: "Zobo", p: 1500, avail: true },
      { id: "j2", n: "Tigernut drink", p: 2000, avail: true },
      { id: "j3", n: "Pineapple juice", p: 2500, avail: true },
      { id: "j4", n: "Sugar cane juice", p: 2500, avail: true },
      { id: "j5", n: "Beetroot, pineapple, ginger", p: 2500, avail: true },
      { id: "j6", n: "Sugar cane + pineapple", p: 2500, avail: true },
    ],
  },
  {
    id: "milkshakes",
    name: "Milkshakes",
    items: [
      { id: "m1", n: "Creamy banana milkshake", p: 4000, avail: true },
      { id: "m2", n: "Banana & chocolate milkshake", p: 4500, avail: true },
      { id: "m3", n: "Strawberry & banana milkshake", p: 4500, avail: true },
      { id: "m4", n: "Caramel & banana milkshake", p: 4500, avail: true },
    ],
  },
];
