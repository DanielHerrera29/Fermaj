import twilio from "twilio"

const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN
const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER

interface SendWhatsAppParams {
  to: string
  message: string
}

interface SendWhatsAppResult {
  success: boolean
  sid: string | null
  error?: string
}

export async function sendWhatsAppMessage({ to, message }: SendWhatsAppParams): Promise<SendWhatsAppResult> {
  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_PHONE_NUMBER) {
    console.log("[WhatsApp MOCK] Enviando a:", to)
    console.log("[WhatsApp MOCK] Mensaje:", message)
    return { success: true, sid: "mock_sid_" + Date.now() }
  }

  try {
    const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)

    const result = await client.messages.create({
      body: message,
      from: TWILIO_PHONE_NUMBER,
      to: to,
    })

    console.log("[WhatsApp] Message sent:", result.sid)
    return { success: true, sid: result.sid }
  } catch (error: any) {
    console.error("[WhatsApp] Error:", error.message)
    return { success: false, sid: null, error: error.message }
  }
}

export function formatPhoneNumber(phone: string): string {
  const digits = phone.replace(/\D/g, "")
  
  if (digits.startsWith("57") && digits.length === 12) {
    return `+${digits}`
  }
  
  if (digits.length === 10) {
    return `+57${digits}`
  }
  
  if (digits.length === 12 && digits.startsWith("57")) {
    return `+${digits}`
  }
  
  if (digits.startsWith("0")) {
    return `+57${digits.slice(1)}`
  }
  
  return `+57${digits}`
}