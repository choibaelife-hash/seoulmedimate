const DEEPL_API_URL = 'https://api-free.deepl.com/v2/translate'

export async function translateText(text: string, sourceLang: string, targetLang: string): Promise<string> {
  const res = await fetch(DEEPL_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `DeepL-Auth-Key ${process.env.DEEPL_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text: [text],
      source_lang: sourceLang.toUpperCase(),
      target_lang: targetLang.toUpperCase(),
    }),
  })

  if (!res.ok) throw new Error(`DeepL API error: ${res.status}`)
  const data = await res.json()
  return data.translations?.[0]?.text ?? text
}

export async function translateToKorean(text: string, sourceLang: string): Promise<string> {
  return translateText(text, sourceLang.toUpperCase(), 'KO')
}

export async function translateFromKorean(text: string, targetLang: string): Promise<string> {
  return translateText(text, 'KO', targetLang.toUpperCase())
}
