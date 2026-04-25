export interface FormularioData {
  id?: string
  nombre: string
  email: string
  mensaje: string
  fecha?: string
}

const mensajes: FormularioData[] = []

export async function getFormMessages(): Promise<FormularioData[]> {
  return mensajes
}

export function addFormMessage(data: Omit<FormularioData, "id" | "fecha">): FormularioData {
  const newMessage: FormularioData = {
    id: Date.now().toString(),
    ...data,
    fecha: new Date().toISOString(),
  }
  mensajes.push(newMessage)
  return newMessage
}

export function updateFormMessages(data: Partial<FormularioData>[]): FormularioData[] {
  return mensajes
}

export function deleteFormMessages(): void {
  mensajes.length = 0
}
