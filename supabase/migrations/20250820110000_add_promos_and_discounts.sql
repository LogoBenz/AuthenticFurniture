-- Add promotional and discount fields to products

alter table if exists public.products
  add column if not exists original_price numeric(10,2),
  add column if not exists discount_percent numeric(5,2) default 0,
  add column if not exists is_promo boolean default false,
  add column if not exists is_best_seller boolean default false;

-- Backfill original_price where missing
update public.products
set original_price = price
where original_price is null;


