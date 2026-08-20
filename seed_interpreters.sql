-- ============================================================
-- SeoulMediMate 통역사 더미 데이터 시드
-- Supabase Dashboard > SQL Editor 에서 실행하세요
-- ============================================================

-- 1. ckm0228@naver.com 의 Auth user_id 조회 후 interpreters 삽입
-- (이미 Auth에 등록된 유저를 기준으로 연결)

INSERT INTO interpreters (
  user_id, name, email, level, rating,
  completed_count, available, languages,
  korean_level, phone, nationality, bio, created_at
)
SELECT
  au.id,
  '최경민',
  'ckm0228@naver.com',
  'senior',
  4.8,
  12,
  true,
  ARRAY['영어', '독일어'],
  '원어민 수준',
  '+82-010-0000-0001',
  '한국',
  '독일 의료 통역 전문. 내과·외과 경험 풍부.',
  NOW()
FROM auth.users au
WHERE au.email = 'ckm0228@naver.com'
ON CONFLICT (email) DO NOTHING;

-- 2. 더미 통역사 1 - 영어/일본어
INSERT INTO interpreters (
  user_id, name, email, level, rating,
  completed_count, available, languages,
  korean_level, phone, nationality, bio, created_at
)
VALUES (
  gen_random_uuid(),
  '박지수',
  'jisoo.park@seoulmedimate.com',
  'standard',
  4.5,
  7,
  true,
  ARRAY['영어', '일본어'],
  '상급 (비즈니스)',
  '+82-010-0000-0002',
  '한국',
  '영어·일본어 의료 통역. 서울대병원 협력 경력.',
  NOW() - INTERVAL '10 days'
)
ON CONFLICT (email) DO NOTHING;

-- 3. 더미 통역사 2 - 중국어/영어
INSERT INTO interpreters (
  user_id, name, email, level, rating,
  completed_count, available, languages,
  korean_level, phone, nationality, bio, created_at
)
VALUES (
  gen_random_uuid(),
  '왕웨이',
  'wang.wei@seoulmedimate.com',
  'standard',
  4.6,
  5,
  false,
  ARRAY['중국어', '영어'],
  '중급 (일상 가능)',
  '+82-010-0000-0003',
  '중국',
  '중국어 의료 통역 전문. 피부과·성형외과 경험.',
  NOW() - INTERVAL '5 days'
)
ON CONFLICT (email) DO NOTHING;

-- ============================================================
-- 확인 쿼리
-- ============================================================
SELECT id, name, email, level, rating, completed_count, available
FROM interpreters
ORDER BY created_at DESC;
