-- 통역사 신청 테이블
create table if not exists interpreter_applications (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text not null,
  residence_country text not null,
  languages text[] not null,
  korean_level text not null, -- 기초 | 중급 | 고급 | 원어민
  has_beauty_experience boolean default false,
  experience_years text not null,
  has_medical_experience boolean default false,
  availability text,
  self_introduction text not null,
  status text default 'pending', -- pending | approved | rejected
  admin_note text,
  created_at timestamptz default now(),
  reviewed_at timestamptz
);

-- 병원 신청 테이블
create table if not exists hospital_applications (
  id uuid primary key default gen_random_uuid(),
  hospital_name text not null,
  address text not null,
  website_url text,
  naver_map_url text,
  contact_name text not null,
  contact_position text,
  contact_phone text not null,
  contact_email text not null,
  languages text[] not null,
  specialties text,
  has_foreign_patient_experience boolean default false,
  description text,
  status text default 'pending', -- pending | approved | rejected
  admin_note text,
  created_at timestamptz default now(),
  reviewed_at timestamptz
);

-- RLS: 관리자만 읽기/수정 가능 (service role key 사용)
alter table interpreter_applications enable row level security;
alter table hospital_applications enable row level security;

-- 누구나 insert 가능 (신청)
create policy "anyone can apply as interpreter"
  on interpreter_applications for insert with check (true);

create policy "anyone can apply as hospital"
  on hospital_applications for insert with check (true);
