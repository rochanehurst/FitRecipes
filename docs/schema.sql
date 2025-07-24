-- Users table handled by Supabase Auth

create table recipes (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  ingredients text[],
  instructions text,
  image_url text,
  protein numeric,
  calories numeric,
  carbs numeric,
  fat numeric,
  tags text[]
);

create table favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  recipe_id uuid references recipes(id),
  created_at timestamp default now()
);

-- Optional index for fast lookup
create index on favorites (user_id);
