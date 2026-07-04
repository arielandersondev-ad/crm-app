export class GeneralConfiguration {
  constructor(
    public id: string,
    public tenantId: string,
    public botName: string = 'Asistente Virtual',
    public welcomeMessage: string = '¡Hola! Soy el asistente virtual. ¿En qué puedo ayudarte?',
    public fallbackMessage: string = 'No encontré una respuesta exacta. Por favor, contáctanos al teléfono o correo de la clínica.',
    public disclaimer: string = '⚠️ Este asistente no realiza diagnósticos médicos ni reemplaza la consulta con un profesional de la salud.',
  ) {}
}
