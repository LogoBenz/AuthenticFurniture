-- Enable client reads/writes needed by the app UI
-- Adjust auth.role() conditions if you want authenticated-only writes.

-- TABLE POLICIES -----------------------------------------------------------
-- PRODUCTS
alter table if exists public.products enable row level security;

create policy if not exists "products read"
on public.products for select
using (true);

create policy if not exists "products write"
on public.products for insert
with check (true);

create policy if not exists "products update"
on public.products for update
using (true)
with check (true);

-- WAREHOUSES
alter table if exists public.warehouses enable row level security;

create policy if not exists "warehouses read"
on public.warehouses for select
using (true);

create policy if not exists "warehouses delete"
on public.warehouses for delete
using (true);

-- WAREHOUSE PRODUCTS (stock by warehouse)
alter table if exists public.warehouse_products enable row level security;

create policy if not exists "warehouse_products read"
on public.warehouse_products for select
using (true);

create policy if not exists "warehouse_products upsert"
on public.warehouse_products for insert
with check (true);

create policy if not exists "warehouse_products update"
on public.warehouse_products for update
using (true)
with check (true);

-- STOCK ADJUSTMENTS (audit trail)
alter table if exists public.stock_adjustments enable row level security;

create policy if not exists "stock_adjustments read"
on public.stock_adjustments for select
using (true);

create policy if not exists "stock_adjustments insert"
on public.stock_adjustments for insert
with check (true);

-- SPACES & SUBCATEGORIES (read-only)
alter table if exists public.spaces enable row level security;
alter table if exists public.subcategories enable row level security;

create policy if not exists "spaces read"
on public.spaces for select
using (true);

create policy if not exists "subcategories read"
on public.subcategories for select
using (true);

-- Force a schema reload for PostgREST
notify pgrst, 'reload schema';


