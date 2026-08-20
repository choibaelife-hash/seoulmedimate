# MediRoute — Product Requirements Document (PRD)

> **버전:** v1.1 | **최초 작성:** 2026-08-20 | **최종 업데이트:** 2026-08-20
> 한국 의료관광 통역 플랫폼 — 포털별 기능 명세서

---

## 1. 프로젝트 개요

MediRoute는 유럽·영미권 환자가 한국에서 의료 서비스를 받을 때 언어 장벽을 해결해주는 B2C/B2B SaaS 플랫폼이다.

**핵심 가치 제안**
- 환자(수요자): 한국 병원 방문 전 모국어로 의료 상담 → 안심하고 예약
- 통역사(공급자): 온라인 상담료 + 현장 동행료로 수익 창출
- 병원(파트너): 해외 환자 유입 증가, 사전 브리핑으로 진료 효율화
- 플랫폼: 상담료·예약료·SaaS 구독료로 수익 다변화

**지원 언어:** 영어(🇬🇧), 한국어(🇰🇷), 독일어(🇩🇪), 프랑스어(🇫🇷), 스페인어(🇪🇸), 이탈리아어(🇮🇹), 폴란드어(🇵🇱), 포르투갈어(🇵🇹)

---

## 2. 아키텍처 & 기술 스택

| 레이어 | 기술 |
|---|---|
| Frontend | Next.js 14 (App Router), TypeScript, Tailwind CSS |
| i18n | next-intl (`/messages/*.json`, 8개 언어) |
| Backend / DB | Supabase (PostgreSQL + RLS + Auth) |
| 결제 | Stripe (Payment Intents, Refunds) |
| AI 처리 | OpenAI Whisper (음성→텍스트), DeepL (번역) |
| 이메일 | Resend |
| 전화 | Twilio (통역사 가상번호) |
| 지도 | Leaflet + OpenStreetMap (CDN, API키 불필요) |

**포털 URL 구조**

```
/[locale]/              → 고객 공개 페이지 (홈, 병원 검색, 문의, 대시보드)
/interpreter/           → 통역사 포털 (공급자)
/hospital/              → 병원 어드민 포털
/admin/                 → 슈퍼 어드민 포털 (미구현)
```

---

## 3. 데이터 모델

### 핵심 테이블

**`users`** — 공통 사용자
```
id, email, role(patient|interpreter|hospital_admin), language, name, avatar_url
```

**`interpreters`** — 통역사 프로필
```
id, user_id, languages[], level(bronze|silver|gold),
rating, rating_count, completed_count, available,
hourly_rate, twilio_number, deposit_amount, deposit_paid,
bio, certifications[]
```

**`hospitals`** — 병원 정보
```
id, name, slug, specialties[], languages_supported[],
address, district, email, phone, website,
is_premium, is_verified, monthly_fee
```

**`inquiries`** — 고객 문의 (수익의 시작점)
```
id, patient_id, language, input_type(voice|text),
voice_url, raw_text, transcribed_text, translated_ko,
interpreter_id, hospital_id,
status: pending→processing→assigned→answered→briefed→completed,
consultation_fee, platform_fee,
stripe_payment_id, briefing_sent_at, completed_at
```

**`messages`** — 채팅 메시지
```
id, inquiry_id, sender_id, sender_type(patient|interpreter|ai|system),
type(text|voice_raw|voice_transcribed|voice_translated|interpreter_reply|call_requested|system),
content, audio_url, translated_text, needs_call, is_read
```

**`bookings`** — 병원 예약
```
id, inquiry_id, patient_id, hospital_id, interpreter_id,
visit_date, visit_time, duration_hours,
accompany_requested, accompany_payer(patient|hospital|both),
interpreter_fee, platform_fee, total_amount,
cancellation_policy(72h|48h|24h|noshow),
status: pending→confirmed→completed|cancelled|noshow
```

**`payouts`** — 통역사 정산
```
id, interpreter_id, booking_id, inquiry_id,
type(online_consultation|field_accompany),
amount, status(pending|paid), paid_at
```

---

## 4. 핵심 비즈니스 워크플로우

```
[고객] 문의 제출 (음성/텍스트) + 상담료 결제
    ↓
[AI] Whisper 음성 변환 → DeepL 한국어 번역
    ↓
[통역사] 문의 배정 → 한국어 내용 검토 → 고객 모국어로 답변
    ↓
[고객] 병원 선택 → 예약 + 동행 여부 선택 + 결제
    ↓
[통역사] 병원에 브리핑 문서 발송 (환자 정보 한국어 요약)
    ↓
[병원] 브리핑 수신 → 방문 준비 → 당일 진료
    ↓
완료 → 통역사 정산 처리
```

---

## 5. 포털별 기능 명세

---

### 5-A. 고객 포털 (수요자) — `/[locale]/`

**대상:** 한국 의료를 원하는 해외 환자

#### 공개 페이지 (비로그인)
| 페이지 | 경로 | 기능 |
|---|---|---|
| 홈 | `/[locale]/` | 브랜드 소개, How it Works, 신뢰 신호 |
| 병원 검색 | `/[locale]/hospitals` | 검색·필터(전문과/언어/지역), 리스트/지도 뷰, 상세 페이지 |
| 병원 상세 | `/[locale]/hospitals/[slug]` | 소개·리뷰·예약 버튼, 플로팅 예약 카드 |
| 문의 작성 | `/[locale]/inquiry/new` | 음성 녹음 또는 텍스트 입력, Stripe 결제 |
| 로그인 | `/[locale]/auth/login` | Email/PW + Google OAuth |
| 회원가입 | `/[locale]/auth/signup` | Email/PW 회원가입 |

#### 로그인 후 대시보드
| 페이지 | 경로 | 기능 |
|---|---|---|
| 내 계정 | `/[locale]/dashboard` | 내 문의 목록, 내 예약 목록, 상태 표시 |
| 채팅 | `/[locale]/dashboard/inquiries/[id]` | 통역사와 실시간 채팅, 전화 요청 |
| 예약 상세 | `/[locale]/dashboard/bookings/[id]` | 예약 내역, 취소 정책 |

#### 문의 상태 흐름
```
pending → processing → assigned → answered → briefed → completed
(접수)    (AI처리중)   (통역사배정)  (답변완료)  (병원브리핑됨)  (완료)
```

#### 미구현 / 개선 필요 항목
- [ ] 결제 완료 후 리디렉션 페이지
- [ ] 예약 취소 UI (환불 정책 적용)
- [ ] 리뷰 작성 기능 (완료 후)
- [ ] 알림 (이메일/인앱): 문의 답변 완료, 예약 확정

---

### 5-B. 통역사 포털 (공급자) — `/interpreter/`

**대상:** MediRoute 등록 의료 통역사

#### 현재 구현된 페이지
| 페이지 | 경로 | 기능 |
|---|---|---|
| 대시보드 | `/interpreter/` | 통계(활성문의수, 완료수, 수익€, 미정산€), 최근 문의·예약 |
| 문의 목록 | `/interpreter/inquiries` | 배정된 문의 목록 |
| 문의 상세 | `/interpreter/inquiries/[id]` | 고객 문의 내용(AI 번역 포함), 답변 작성 |
| 예약 관리 | `/interpreter/bookings` | 예약 목록 |
| 예약 상세 | `/interpreter/bookings/[id]` | 예약 상세, 동행 확인 |
| 내 프로필 | `/interpreter/profile` | 언어·레벨·시간당요금·소개·자격증 관리 |

#### 사이드바 메뉴 (현재)
- 대시보드
- 문의 목록
- 예약 관리
- 내 프로필

#### 비즈니스 로직
- 통역사 레벨: `bronze` → `silver` → `gold` (완료 건수·평점 기반)
- 정산: `payouts` 테이블, 온라인 상담 + 현장 동행 별도 집계
- 가용 상태 토글: `available` 필드 (대시보드 우측 상단 표시)
- Twilio 가상번호: 고객 전화 요청 시 사용

#### 미구현 / 개선 필요 항목
- [ ] 문의 답변 전송 기능 (채팅 인터페이스)
- [ ] 병원 브리핑 문서 생성·발송 기능
- [ ] 통역사 온보딩 플로우 (보증금 납부, 자격 인증)
- [ ] 가용 상태 토글 UI
- [ ] 정산 내역 상세 페이지
- [ ] 평점·리뷰 조회
- [ ] 실시간 알림 (새 문의 배정)

---

### 5-C. 병원 어드민 포털 — `/hospital/`

**대상:** MediRoute 파트너 병원 어드민 담당자

#### 현재 구현된 페이지
| 페이지 | 경로 | 기능 |
|---|---|---|
| 대시보드 | `/hospital/` | 신규 브리핑 수, 예정 방문 수, 총 예약 수, 최근 브리핑·예정 방문 목록 |
| 브리핑 수신함 | `/hospital/briefings` | 통역사가 보낸 환자 브리핑 목록 |
| 브리핑 상세 | `/hospital/briefings/[id]` | 환자 요약 정보, 요청 치료, 예약 연결 |
| 예약 현황 | `/hospital/bookings` | 예약 목록 (상태별 필터) |
| 예약 상세 | `/hospital/bookings/[id]` | 예약 상세, 확정/취소 처리 |
| 병원 정보 | `/hospital/profile` | 병원 소개·전문과·연락처·언어 설정 |

#### 사이드바 메뉴 (현재)
- 대시보드
- 브리핑 수신함
- 예약 현황
- 병원 정보

#### 비즈니스 로직
- 인증: `hospitals.email` = `auth.users.email` 로 매핑
- 브리핑: `inquiries` 테이블의 `briefing_sent_at IS NOT NULL` 항목
- 예약 확정: `bookings.status` = `confirmed` 처리
- 병원 구분: `is_premium`(유료 플랜), `is_verified`(인증 뱃지)

#### 미구현 / 개선 필요 항목
- [ ] 예약 확정/취소 액션 UI
- [ ] 브리핑 PDF 다운로드
- [ ] 병원 정보 편집 저장 기능
- [ ] 월간 통계 대시보드 (방문자 수, 국가별 분포)
- [ ] 병원 구독 플랜 관리 (premium 업그레이드)
- [ ] 리뷰 목록 조회

---

### 5-D. 슈퍼 어드민 포털 — `/admin/` (미구현)

**대상:** MediRoute 운영팀

#### 구현 필요 기능

**사용자 관리**
- [ ] 전체 사용자 목록 (환자/통역사/병원)
- [ ] 역할 변경, 계정 정지
- [ ] 통역사 승인/반려 (보증금 확인, 자격증 검토)
- [ ] 병원 파트너 등록 심사

**문의·예약 관리**
- [ ] 전체 문의 목록 및 상태 관리
- [ ] 수동 통역사 배정
- [ ] 결제 이슈 처리 (환불 강제 실행)

**정산 관리**
- [ ] 통역사 정산 대기 목록
- [ ] 일괄 정산 처리 (`payouts.status` → `paid`)
- [ ] 정산 내역 엑스포트 (CSV)

**병원 관리**
- [ ] 병원 등록·수정·삭제
- [ ] premium/verified 뱃지 설정
- [ ] 월 구독료 현황

**통계 대시보드**
- [ ] 총 매출 (consultation_fee 합산)
- [ ] 활성 통역사 수, 파트너 병원 수
- [ ] 언어별·국가별 문의 분포
- [ ] 월간 신규 가입자 추이

---

## 6. 결제 흐름

### 6-A. 상담 결제 (고객 → 플랫폼)
```
고객 문의 제출 → Stripe Payment Intent 생성
→ 결제 성공 → inquiries.stripe_payment_status = 'succeeded'
→ 통역사 답변 완료 → payouts 생성 (type: online_consultation)
→ 운영팀 정산 처리 → payouts.status = 'paid'
```

### 6-B. 예약 결제 (고객 → 플랫폼)
```
예약 확정 → Stripe Payment Intent (interpreter_fee + platform_fee)
→ 결제 성공 → bookings.status = 'confirmed'
→ 방문 완료 → payouts 생성 (type: field_accompany)
```

### 6-C. 취소·환불 정책
| 조건 | 환불율 |
|---|---|
| 72시간 이전 취소 | 100% |
| 48시간 이전 취소 | 50% |
| 24시간 이내 취소 | 0% |
| 노쇼 | 0% (noshow_compensation 적용) |

---

## 7. 미구현 기능 우선순위

| 우선순위 | 기능 | 포털 | 복잡도 |
|---|---|---|---|
| 🔴 High | 통역사 채팅 답변 전송 | 통역사 | 중 |
| 🔴 High | 병원 브리핑 생성·발송 | 통역사 | 중 |
| 🔴 High | 예약 확정/취소 처리 | 병원 | 하 |
| 🟠 Mid | 슈퍼 어드민 포털 기본 구조 | 어드민 | 고 |
| 🟠 Mid | 통역사 정산 관리 | 어드민 | 중 |
| 🟠 Mid | 고객 리뷰 작성 | 고객 | 하 |
| 🟡 Low | 통계 대시보드 (어드민) | 어드민 | 중 |
| 🟡 Low | 브리핑 PDF 다운로드 | 병원 | 중 |
| 🟡 Low | 실시간 알림 | 전체 | 고 |

---

## 8. 파일 구조 요약

```
medroute/
├── app/
│   ├── [locale]/           # 고객 공개 + 대시보드
│   │   ├── page.tsx        # 홈
│   │   ├── hospitals/      # 병원 검색
│   │   ├── inquiry/        # 문의 제출
│   │   ├── dashboard/      # 고객 계정
│   │   └── auth/           # 로그인/회원가입
│   ├── interpreter/        # 통역사 포털
│   │   ├── layout.tsx      # 사이드바 (대시보드/문의/예약/프로필)
│   │   ├── page.tsx        # 대시보드
│   │   ├── inquiries/      # 문의 목록·상세
│   │   ├── bookings/       # 예약 관리
│   │   └── profile/        # 프로필
│   ├── hospital/           # 병원 어드민 포털
│   │   ├── layout.tsx      # 사이드바 (대시보드/브리핑/예약/정보)
│   │   ├── page.tsx        # 대시보드
│   │   ├── briefings/      # 브리핑 수신함
│   │   ├── bookings/       # 예약 현황
│   │   └── profile/        # 병원 정보
│   └── admin/              # 슈퍼 어드민 (미구현)
├── components/
│   ├── nav/Navbar.tsx      # 글로벌 네비게이션
│   └── HospitalMap.tsx     # Leaflet 지도
├── messages/               # i18n 번역 파일 (8개 언어)
├── types/index.ts          # TypeScript 타입 정의
├── lib/                    # 외부 서비스 클라이언트
│   ├── supabase/           # Supabase 클라이언트
│   ├── whisper.ts          # OpenAI Whisper
│   ├── deepl.ts            # DeepL 번역
│   ├── resend.ts           # 이메일
│   └── twilio.ts           # 전화
└── supabase/migrations/    # DB 마이그레이션
```

---

*이 PRD는 현재 코드베이스 분석을 바탕으로 작성되었습니다. 별도의 PRD 문서가 프로젝트에 존재하지 않아 코드에서 역설계(reverse-engineering)하였습니다.*
