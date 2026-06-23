-- PlateMatch Database Schema
-- Run this in your Supabase SQL editor

-- Profiles (extends Supabase auth.users)
create table public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  username text unique not null,
  avatar_url text,
  created_at timestamptz default now() not null
);

alter table public.profiles enable row level security;

create policy "Profiles are viewable by everyone"
  on public.profiles for select using (true);

create policy "Users can update their own profile"
  on public.profiles for update using (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, username)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1))
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- License plates
create table public.license_plates (
  id uuid default gen_random_uuid() primary key,
  plate_number text not null,
  state text not null,       -- 2-letter state code
  country text default 'US' not null,
  claimed_by uuid references public.profiles(id),
  claim_verified boolean default false not null,
  avg_rating numeric(3,2) default 0 not null,
  review_count integer default 0 not null,
  created_at timestamptz default now() not null,
  unique(plate_number, state, country)
);

alter table public.license_plates enable row level security;

create policy "Plates are viewable by everyone"
  on public.license_plates for select using (true);

create policy "Authenticated users can insert plates"
  on public.license_plates for insert with check (auth.role() = 'authenticated');

-- Reviews
create table public.reviews (
  id uuid default gen_random_uuid() primary key,
  plate_id uuid references public.license_plates(id) on delete cascade not null,
  reviewer_id uuid references public.profiles(id) on delete cascade not null,
  rating smallint not null check (rating between 0 and 5),
  tags text[] default '{}' not null,
  note text check (length(note) <= 500),
  is_anonymous boolean default false not null,
  created_at timestamptz default now() not null
);

alter table public.reviews enable row level security;

create policy "Reviews are viewable by everyone"
  on public.reviews for select using (true);

create policy "Authenticated users can submit reviews"
  on public.reviews for insert with check (auth.uid() = reviewer_id);

create policy "Users can delete their own reviews"
  on public.reviews for delete using (auth.uid() = reviewer_id);

-- Keep avg_rating and review_count up to date automatically
create or replace function public.update_plate_stats()
returns trigger language plpgsql security definer as $$
begin
  update public.license_plates
  set
    avg_rating = (select avg(rating) from public.reviews where plate_id = coalesce(new.plate_id, old.plate_id)),
    review_count = (select count(*) from public.reviews where plate_id = coalesce(new.plate_id, old.plate_id))
  where id = coalesce(new.plate_id, old.plate_id);
  return coalesce(new, old);
end;
$$;

create trigger on_review_change
  after insert or update or delete on public.reviews
  for each row execute procedure public.update_plate_stats();

-- Plate claims (ownership)
create table public.plate_claims (
  id uuid default gen_random_uuid() primary key,
  plate_id uuid references public.license_plates(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  -- pending: awaiting review  approved: owner  conflicted: disputed  rejected: denied
  status text default 'pending' not null check (status in ('pending', 'approved', 'rejected', 'conflicted')),
  created_at timestamptz default now() not null,
  unique(plate_id, user_id)
);

alter table public.plate_claims enable row level security;

create policy "Users can view their own claims"
  on public.plate_claims for select using (auth.uid() = user_id);

create policy "Authenticated users can submit claims"
  on public.plate_claims for insert with check (auth.uid() = user_id);

-- Update license_plates.claimed_by when a claim is approved
create or replace function public.handle_claim_approval()
returns trigger language plpgsql security definer as $$
begin
  if new.status = 'approved' then
    update public.license_plates
    set claimed_by = new.user_id, claim_verified = false
    where id = new.plate_id;
  end if;
  return new;
end;
$$;

create trigger on_claim_approved
  after update on public.plate_claims
  for each row execute procedure public.handle_claim_approval();

-- Indexes for common queries
create index on public.license_plates(plate_number, state);
create index on public.reviews(plate_id, created_at desc);
create index on public.reviews(reviewer_id);
create index on public.plate_claims(user_id);
create index on public.plate_claims(plate_id);
