-- 006 에서 RLS 를 켜면서 insert 정책만 만들고 select 정책을 누락했음.
-- 그 결과 로그인 시 승인 여부 조회(anon 키)가 항상 0건을 반환해
-- 승인된 통역사/병원도 "승인되지 않았습니다" 로 로그인이 차단됨.
-- 본인 행만 읽도록 select 정책을 추가한다.

create policy "read own interpreter application"
  on interpreter_applications for select
  using (auth.jwt() ->> 'email' = email);

-- 병원 신청 테이블은 컬럼명이 email 이 아니라 contact_email
create policy "read own hospital application"
  on hospital_applications for select
  using (auth.jwt() ->> 'email' = contact_email);
