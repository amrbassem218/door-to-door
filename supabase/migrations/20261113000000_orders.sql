create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id),
  status text not null default 'pending' check (status in ('pending','paid','failed')),
  amount_cents integer not null,
  currency text not null default 'EGP',
  items jsonb not null,
  paymob_intention_id text,
  paymob_transaction_id text,
  created_at timestamptz not null default now(),
  paid_at timestamptz
);

alter table public.orders enable row level security;

-- Users can read their own orders; all writes go through the service role (API routes).
create policy "users read own orders" on public.orders
  for select using (auth.uid() = user_id);
