const CONFIRMATION_KEYWORDS = [
  "si",
  "sí",
  "ok",
  "dale",
  "confirmo",
  "si claro",
  "por supuesto",
  "si quiero",
  "si por favor",
  "pueden venir",
  "agendar",
  "si, agendar",
  "quiero",
  "si, quiero",
  "perfecto",
  "de acuerdo",
  "claro",
  "si, claro",
  "esta bien",
  "está bien",
  "proceder",
  "si proceder",
  "adelante",
  "si adelante",
  "ya",
  "ya confirmado",
  "confirmado",
  "afirmativo",
  "bien",
  "ok si",
]

const CANCELLATION_KEYWORDS = [
  "no",
  "cancelar",
  "no quiero",
  "no me interesa",
  "otro dia",
  "despues",
  "después",
  "luego",
  "ahora no",
  "en otro momento",
  "mejor no",
  "no por ahora",
  "eliminar",
  "borrar",
]

export interface DetectionResult {
  isConfirmation: boolean
  isCancellation: boolean
  confidence: number
  matchedKeyword?: string
}

export function detectIntention(message: string): DetectionResult {
  const normalized = message.toLowerCase().trim()

  for (const keyword of CONFIRMATION_KEYWORDS) {
    if (normalized.includes(keyword)) {
      return {
        isConfirmation: true,
        isCancellation: false,
        confidence: 0.9,
        matchedKeyword: keyword,
      }
    }
  }

  for (const keyword of CANCELLATION_KEYWORDS) {
    if (normalized.includes(keyword)) {
      return {
        isConfirmation: false,
        isCancellation: true,
        confidence: 0.8,
        matchedKeyword: keyword,
      }
    }
  }

  return {
    isConfirmation: false,
    isCancellation: false,
    confidence: 0,
  }
}

export function buildInitialMessage(params: {
  nombre_cliente: string
  empresa: string
  tipo_servicio: string
}): string {
  const { nombre_cliente, empresa, tipo_servicio } = params

  const defaultMessage = `Hola ${nombre_cliente}, te contactamos de ${empresa}. Tenemos tu solicitud de ${tipo_servicio}. ¿Deseas agendar tu instalación?`

  return defaultMessage
}