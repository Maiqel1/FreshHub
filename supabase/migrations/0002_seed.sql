-- FreshHub — seed the real menu (11 categories, 45 items) from the design handoff.
-- Idempotent guard: only seeds when the categories table is empty, so re-running
-- migrations won't duplicate rows. Photos start empty (added later via admin).

do $$
begin
  if exists (select 1 from public.categories limit 1) then
    raise notice 'categories already seeded — skipping';
    return;
  end if;

  -- Categories, in menu order ---------------------------------------------------
  insert into public.categories (name, sort_order) values
    ('Sandwiches', 1),
    ('Paninis',    2),
    ('Rice',       3),
    ('Spaghetti',  4),
    ('Sides',      5),
    ('Shawarma',   6),
    ('Burgers',    7),
    ('Combos',     8),
    ('Smoothies',  9),
    ('Fresh Juice', 10),
    ('Milkshakes', 11);

  -- Items, joined to their category by name ------------------------------------
  insert into public.items (category_id, name, price, available, sort_order)
  select c.id, v.name, v.price, v.available, v.sort_order
  from (values
    ('Sandwiches', 'Chicken & egg (Mayo sandwich)', 4500, true, 1),
    ('Sandwiches', 'Chicken club sandwich', 4000, true, 2),
    ('Sandwiches', 'Chicken melt sandwich', 4500, true, 3),
    ('Sandwiches', 'Beef melt sandwich', 4500, true, 4),

    ('Paninis', 'Chicken and cheese panini', 4000, true, 1),
    ('Paninis', 'Beef and cheese panini', 4000, true, 2),

    ('Rice', 'Fried rice', 2500, true, 1),
    ('Rice', 'Jollof rice', 3000, true, 2),
    ('Rice', 'Chicken rice', 4500, true, 3),

    ('Spaghetti', 'Jollof spaghetti', 3000, true, 1),
    ('Spaghetti', 'Chicken stir-fry spaghetti', 5000, true, 2),
    ('Spaghetti', 'Chicken spaghetti', 4500, true, 3),

    ('Sides', 'Chicken wings', 5000, true, 1),
    ('Sides', 'Spicy chicken', 4000, true, 2),
    ('Sides', 'Spicy beef', 4000, true, 3),
    ('Sides', 'French fries', 3000, true, 4),
    ('Sides', 'Sweet potato (boiled/fried) + egg sauce', 4000, true, 5),
    ('Sides', 'Fried/boiled yam + egg sauce', 4500, true, 6),
    ('Sides', 'Fried plantain + egg sauce', 4500, true, 7),
    ('Sides', 'Special loaded fries — fries, cheese, chicken, chef''s cream sauce', 7000, false, 8),

    ('Shawarma', 'Chicken/beef shawarma', 3500, true, 1),
    ('Shawarma', 'Chicken/beef shawarma (single sausage)', 4000, true, 2),
    ('Shawarma', 'Chicken/beef shawarma (double sausage)', 5000, true, 3),
    ('Shawarma', 'Extra cheese, any shawarma', 1000, true, 4),

    ('Burgers', 'Beef burger', 5000, true, 1),
    ('Burgers', 'Chicken burger', 5000, true, 2),

    ('Combos', 'Panini, spicy chicken, fries & smoothie', 14000, true, 1),
    ('Combos', 'Burger, fries, spicy chicken & juice/smoothie', 15000, true, 2),
    ('Combos', 'Club sandwich, chicken wings, loaded fries & shawarma', 15000, true, 3),

    ('Smoothies', 'Keep Me Fit — tigernut, pineapple, banana, date', 3000, true, 1),
    ('Smoothies', 'Sunshine — watermelon, banana, strawberry', 3000, true, 2),
    ('Smoothies', 'Heartlen Blues — tigernut, avocado, banana, date', 3000, true, 3),
    ('Smoothies', 'Alliance Arena — pineapple, banana, grapes', 3000, true, 4),
    ('Smoothies', 'Sweet Dreams — pineapple, apple, grapes', 3000, true, 5),
    ('Smoothies', 'Kiss Me Twice — watermelon, pineapple, banana', 3000, true, 6),

    ('Fresh Juice', 'Zobo', 1500, true, 1),
    ('Fresh Juice', 'Tigernut drink', 2000, true, 2),
    ('Fresh Juice', 'Pineapple juice', 2500, true, 3),
    ('Fresh Juice', 'Sugar cane juice', 2500, true, 4),
    ('Fresh Juice', 'Beetroot, pineapple, ginger', 2500, true, 5),
    ('Fresh Juice', 'Sugar cane + pineapple', 2500, true, 6),

    ('Milkshakes', 'Creamy banana milkshake', 4000, true, 1),
    ('Milkshakes', 'Banana & chocolate milkshake', 4500, true, 2),
    ('Milkshakes', 'Strawberry & banana milkshake', 4500, true, 3),
    ('Milkshakes', 'Caramel & banana milkshake', 4500, true, 4)
  ) as v(cat, name, price, available, sort_order)
  join public.categories c on c.name = v.cat;
end $$;
