-- Create subscriptions table
create table if not exists public.subscriptions (
    id uuid default gen_random_uuid() primary key,
    user_email text not null,
    customer_id text not null,
    subscription_id text not null,
    plan_name text not null,
    status text not null,
    current_period_end timestamp with time zone,
    session_token text,
    created_at timestamp with time zone default timezone('utc'::text, now()),
    updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Add indexes
create index if not exists subscriptions_user_email_idx on public.subscriptions(user_email);
create index if not exists subscriptions_customer_id_idx on public.subscriptions(customer_id);
create index if not exists subscriptions_subscription_id_idx on public.subscriptions(subscription_id);

-- Add RLS policies
alter table public.subscriptions enable row level security;

create policy "Users can view their own subscriptions"
    on public.subscriptions for select
    using (auth.jwt() ->> 'email' = user_email);

-- Handle updated_at
create or replace function public.handle_updated_at()
returns trigger as $$
begin
    new.updated_at = timezone('utc'::text, now());
    return new;
end;
$$ language plpgsql;

create trigger handle_subscriptions_updated_at
    before update on public.subscriptions
    for each row
    execute function public.handle_updated_at();
