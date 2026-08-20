// ponytail: 임시 스텁. Supabase 로그인 후 아래 명령으로 실제 타입으로 교체할 것.
//   npx supabase login
//   npx supabase gen types typescript --project-id poevewfvuotwoczemcfc > types/database.ts
// 교체 전까지 supabase 쿼리 결과는 전부 any 이므로 컬럼 오타가 잡히지 않는다.
export type Database = any
