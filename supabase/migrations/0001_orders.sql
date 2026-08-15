-- Extension
create extension if not exists pgcrypto;

-- Enum
create type order_status as enum ('pending','confirmed','processing','packed','dispatched','delivered','cancelled','failed');

-- Orders
create table orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  customer_name text not null,
  customer_email text not null,
  customer_phone text not null,
  customer_whatsapp text,
  shipping_address text not null,
  city text not null,
  postal_code text,
  notes text,
  payment_method text not null default 'cod',
  subtotal numeric(12,2) not null,
  discount numeric(12,2) not null default 0,
  shipping_fee numeric(12,2) not null default 0,
  tax numeric(12,2) not null default 0,
  total numeric(12,2) not null,
  status order_status not null default 'pending',
  notification_status text not null default 'pending' check (notification_status in ('pending','sent','failed')),
  idempotency_key text not null unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Order Items
create table order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete restrict,
  product_id text not null,
  product_name text not null,
  brand text,
  model text,
  quantity integer not null check (quantity >= 1),
  unit_price numeric(12,2) not null,
  discount numeric(12,2) not null default 0,
  subtotal numeric(12,2) not null,
  product_image text,
  created_at timestamptz not null default now()
);

-- Indexes
create index idx_order_items_order_id on order_items(order_id);
create index idx_orders_created_at on orders(created_at);
create index idx_orders_customer_email on orders(customer_email);
create index idx_orders_status on orders(status);

-- Updated_at trigger
drop function if exists set_updated_at() cascade;
create function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists trg_orders_set_updated_at on orders;
create trigger trg_orders_set_updated_at
before update on orders
for each row
execute function set_updated_at();

-- Order number sequence
create table order_number_sequences (
  order_date date primary key,
  seq integer not null default 0
);

-- Create order function
drop function if exists create_order(p_order jsonb);
create function create_order(p_order jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_seq integer;
  v_order_number text;
  v_order_id uuid;
  v_item jsonb;
begin
  insert into order_number_sequences (order_date, seq)
  values (current_date, 1)
  on conflict (order_date)
  do update set seq = order_number_sequences.seq + 1
  returning seq into v_seq;

  v_order_number := 'AE-' || to_char(current_date, 'YYYYMMDD') || '-' || lpad(v_seq::text, 4, '0');

  insert into orders (
    order_number,
    customer_name,
    customer_email,
    customer_phone,
    customer_whatsapp,
    shipping_address,
    city,
    postal_code,
    notes,
    payment_method,
    subtotal,
    discount,
    shipping_fee,
    tax,
    total,
    idempotency_key
  )
  values (
    v_order_number,
    p_order->>'customer_name',
    p_order->>'customer_email',
    p_order->>'customer_phone',
    p_order->>'customer_whatsapp',
    p_order->>'shipping_address',
    p_order->>'city',
    p_order->>'postal_code',
    p_order->>'notes',
    coalesce(p_order->>'payment_method', 'cod'),
    round((p_order->>'subtotal')::numeric, 2),
    round((p_order->>'discount')::numeric, 2),
    round((p_order->>'shipping_fee')::numeric, 2),
    round((p_order->>'tax')::numeric, 2),
    round((p_order->>'total')::numeric, 2),
    p_order->>'idempotency_key'
  )
  returning id into v_order_id;

  for v_item in select * from jsonb_array_elements(p_order->'items')
  loop
    insert into order_items (
      order_id,
      product_id,
      product_name,
      brand,
      model,
      quantity,
      unit_price,
      discount,
      subtotal,
      product_image
    )
    values (
      v_order_id,
      v_item->>'product_id',
      v_item->>'product_name',
      v_item->>'brand',
      v_item->>'model',
      (v_item->>'quantity')::integer,
      round((v_item->>'unit_price')::numeric, 2),
      round((v_item->>'discount')::numeric, 2),
      round((v_item->>'subtotal')::numeric, 2),
      v_item->>'product_image'
    );
  end loop;

  return jsonb_build_object('order_number', v_order_number);
end;
$$;

-- RLS
alter table orders enable row level security;
alter table order_items enable row level security;

-- Grants
grant usage on schema public to anon, authenticated;