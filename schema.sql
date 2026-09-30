create table if not exists titik(
 id uuid primary key default gen_random_uuid(),
 created_at timestamptz default now(),
 nama text, kategori text, x numeric, y numeric,
 p numeric, l numeric, t numeric, pj text, keterangan text, catatan text, gambar text,
 kebutuhan jsonb default '[]'::jsonb);
alter table titik add column if not exists kebutuhan jsonb default '[]'::jsonb;
alter table titik enable row level security;
drop policy if exists "semua boleh lihat" on titik; drop policy if exists "admin tambah" on titik;
drop policy if exists "admin ubah" on titik; drop policy if exists "admin hapus" on titik;
create policy "semua boleh lihat" on titik for select using (true);
create policy "admin tambah" on titik for insert to authenticated with check (true);
create policy "admin ubah" on titik for update to authenticated using (true);
create policy "admin hapus" on titik for delete to authenticated using (true);
insert into storage.buckets(id,name,public) values('ref','ref',true) on conflict do nothing;
drop policy if exists "gambar publik" on storage.objects; drop policy if exists "admin upload" on storage.objects;
create policy "gambar publik" on storage.objects for select using (bucket_id='ref');
create policy "admin upload" on storage.objects for insert to authenticated with check (bucket_id='ref');