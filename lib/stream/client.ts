import { StreamChat } from 'stream-chat'

// 서버 전용 (토큰 생성)
export function getServerStreamClient() {
  return StreamChat.getInstance(
    process.env.NEXT_PUBLIC_STREAM_API_KEY!,
    process.env.STREAM_API_SECRET!
  )
}

// 브라우저용 (싱글톤)
let clientInstance: StreamChat | null = null

export function getStreamClient() {
  if (!clientInstance) {
    clientInstance = StreamChat.getInstance(
      process.env.NEXT_PUBLIC_STREAM_API_KEY!
    )
  }
  return clientInstance
}

// 채널 ID 생성 (문의 ID 기반)
export function getInquiryChannelId(inquiryId: string) {
  return `inquiry-${inquiryId}`
}

// 사용자 토큰 생성 (서버에서만 호출)
export function generateUserToken(userId: string) {
  const client = getServerStreamClient()
  return client.createToken(userId)
}
