import { Injectable } from '@nestjs/common';

const REDACTION = '[DATO OMITIDO]';
const COMMON_GIVEN_NAME_PATTERN =
  /\b(?:juan|ana|maria|maría|jose|josé|luis|carlos|pedro|jorge|miguel|ariel|laura|sofia|sofía|gabriel|daniel|diego|andres|andrés|fernando|ricardo|roberto|sergio|paola|patricia|claudia|lucia|lucía|elena|rosa|carolina|valentina|david|alejandro|alberto|francisco|martin|martín|julio|raul|raúl|marta|silvia|beatriz|gloria|monica|mónica|cecilia|teresa|adriana|veronica|verónica|ximena)\s+[a-záéíóúñ]{2,}(?:\s+[a-záéíóúñ]{2,})?(?=$|[\s,.;:!?])/giu;

@Injectable()
export class FaqSuggestionSanitizer {
  sanitize(value: string): string {
    return (
      this.normalizeWhitespace(value.normalize('NFKC'))
        .replace(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi, REDACTION)
        .replace(
          /\b[a-z0-9._%+-]+\s+(?:arroba|\(arroba\)|at)\s+[a-z0-9.-]+\s+(?:punto|dot)\s+(?:com|net|org|edu|bo|io)\b/gi,
          REDACTION,
        )
        .replace(/\+\d[\d\s()./-]{6,}\d/g, REDACTION)
        .replace(/\(\d{1,4}\)\s*\d{3,4}[/.\s-]?\d{3,4}/g, REDACTION)
        .replace(/\b\d{7,15}\b/g, REDACTION)
        .replace(/\b\d{3,4}[/.\s-]\d{3,4}\b/g, REDACTION)
        .replace(/\b\d{2,4}[/.\s-]\d{3}[/.\s-]\d{3,4}\b/g, REDACTION)
        .replace(/\b\d{3}[/.\s-]\d{3}[/.\s-]\d{4}\b/g, REDACTION)
        .replace(
          /\bAPT[-_\s]?[A-Z0-9]{4,}\b|\b(?:CITA|TURNO)[-_][A-Z0-9]{4,}\b/gi,
          REDACTION,
        )
        .replace(
          /\b(?:CÓDIGO|CODIGO|COD)\s+(?:DE\s+)?(?:CITA|TURNO|RESERVA)\s*[:#-]?\s*[A-Z0-9-]{3,}\b/gi,
          REDACTION,
        )
        .replace(
          /\b(?:CI|DNI|CEDULA|CÉDULA|DOCUMENTO|PASAPORTE|CARNET)(?:\s+DE\s+IDENTIDAD)?\s*(?:N[°ºO]?\.?|ES|:)?\s*[A-Z0-9.-]{4,}\b/gi,
          REDACTION,
        )
        .replace(
          /\byo\s*,?\s*[a-záéíóúñ]{2,}(?:\s+[a-záéíóúñ]{2,}){1,3}(?=\s*[,.;:!?])/gi,
          REDACTION,
        )
        .replace(
          /\b(?:me\s+llamo|mi\s+nombre\s+es|soy)\s+[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+(?:\s+[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+){0,3}\b/gi,
          REDACTION,
        )
        .replace(
          /\b(?:(?:nombre|paciente|cliente|usuario)\s*:\s*|(?:el|la|un|una)\s+(?:paciente|cliente|usuario)\s+)[a-záéíóúñ]{2,}(?:\s+[a-záéíóúñ]{2,}){0,3}?(?=\s+(?:consulta|pregunta|dice|solicita|quiere|necesita)\b|[,.;:!?]|$)/gi,
          REDACTION,
        )
        // La detección de nombres es heurística: se limita a contextos de
        // atribución personal para no borrar entidades legítimas de una FAQ.
        .replace(
          /^(¿\s*)?(?!(?:la\s+pregunta|el\s+mensaje|la\s+consulta)\b)[a-záéíóúñ]{2,}(?:\s+[a-záéíóúñ]{2,}){1,3}(?=\s+(?:consulta|pregunta|dice|solicita|quiere|necesita)\b)/i,
          `$1${REDACTION}`,
        )
        .replace(
          /\b(?:[Cc]ontacta|[Cc]ontacte|[Pp]regunta|[Pp]regunte|[Ll]lama|[Ll]lame|[Ee]scribe|[Ee]scriba|[Aa]tiende|[Aa]tender|[Bb]uscar|[Bb]usque)\s+(?:a\s+)?[A-ZÁÉÍÓÚÑ][a-záéíóúñ]{1,}(?:\s+[A-ZÁÉÍÓÚÑ][a-záéíóúñ]{1,}){0,3}\b/g,
          REDACTION,
        )
        .replace(
          /\b(?:CONTACTA|CONTACTE|PREGUNTA|PREGUNTE|LLAMA|LLAME|ESCRIBE|ESCRIBA|ATIENDE|ATENDER|BUSCAR|BUSQUE)\s+(?:A\s+)?[A-ZÁÉÍÓÚÑ]{2,}(?:\s+[A-ZÁÉÍÓÚÑ]{2,}){0,3}\b/g,
          REDACTION,
        )
        .replace(
          /\b(?:cita|turno|reserva|consulta|registro)\s+de\s+[A-ZÁÉÍÓÚÑ][a-záéíóúñ]{1,}(?:\s+[A-ZÁÉÍÓÚÑ][a-záéíóúñ]{1,}){0,3}\b/g,
          REDACTION,
        )
        .replace(
          /\b(?:Sr\.?|Sra\.?|Señor|Señora|Dr\.?|Dra\.?|Doctor|Doctora|Paciente|Cliente|Usuario)\s+[A-ZÁÉÍÓÚÑ][a-záéíóúñ]{1,}(?:\s+[A-ZÁÉÍÓÚÑ][a-záéíóúñ]{1,}){0,3}\b/g,
          REDACTION,
        )
        .replace(
          /^(¿\s*)?(?!(?:La|El|Un|Una|Las|Los|Esta|Este|Estas|Estos)\s)[A-ZÁÉÍÓÚÑ][a-záéíóúñ]{1,}\s+(?=(?:consulta|pregunta|dice|solicita|quiere|necesita)\b)/,
          `$1${REDACTION} `,
        )
        .replace(COMMON_GIVEN_NAME_PATTERN, REDACTION)
        .replace(/(?:\s*\[DATO OMITIDO\]\s*){2,}/g, ` ${REDACTION} `)
        .replace(/\s+([,.;:!?])/g, '$1')
        .replace(/\s{2,}/g, ' ')
        .trim()
    );
  }

  containsSensitiveData(value: string): boolean {
    const normalized = this.normalizeWhitespace(value.normalize('NFKC'));
    return this.sanitize(normalized) !== normalized;
  }

  isExcludedQuestion(value: string, intent?: string | null): boolean {
    return this.containsProhibitedContent(value, intent);
  }

  containsProhibitedContent(value: string, intent?: string | null): boolean {
    const normalized = this.fold(value);
    const normalizedIntent = this.fold(intent ?? '');

    if (normalizedIntent === 'appointment-status') {
      return true;
    }

    const containsAppointmentCode =
      /\bapt[-_\s]?[a-z0-9]{4,}\b|\b(?:cita|turno)[-_][a-z0-9]{4,}\b/.test(
        normalized,
      ) ||
      /\b(?:codigo|cod)\s+(?:de\s+)?(?:cita|turno|reserva)\s*[:#-]?\s*[a-z0-9-]{3,}\b/.test(
        normalized,
      );
    const isAppointmentTransaction =
      /\b(?:estado|confirmar|confirmacion|cancelar|reprogramar|cambiar|modificar|consultar)\b.{0,45}\b(?:cita|turno|reserva)\b/.test(
        normalized,
      ) || /\b(?:mi|la)\s+(?:cita|turno|reserva)\b/.test(normalized);
    const containsIdentityDocument =
      /\b(?:ci|dni|cedula|documento\s+de\s+identidad|pasaporte|carnet\s+de\s+identidad)\b/.test(
        normalized,
      );

    if (
      containsAppointmentCode ||
      isAppointmentTransaction ||
      containsIdentityDocument
    ) {
      return true;
    }

    const hasAutonomousClinicalSymptom =
      /\b(?:dolor\s+ocular|vision\s+(?:borrosa|nublada|doble)|veo\s+borroso|no\s+puedo\s+ver|perdi(?:da)?\s+(?:de\s+)?(?:la\s+)?vision|destellos?|manchas?\s+flotantes?|moscas?\s+volantes?|flotadores?|ojo\s+rojo|lagrimeo|secrecion\s+ocular|picazon\s+ocular|fiebre|tos|sangr(?:a|ado)\s+(?:el\s+)?ojo)\b/.test(
        normalized,
      );
    const describesSymptoms =
      hasAutonomousClinicalSymptom ||
      /\b(?:tengo|siento|presento|padezco)\b.{0,35}\b(?:dolor|ardor|picazon|destellos?|manchas?|vision\s+borrosa|mareo)\b/.test(
        normalized,
      ) ||
      /\b(?:me\s+duele|me\s+arde)\b/.test(normalized);
    const requestsClinicalGuidance =
      /\b(?:diagnostico|diagnosticar|sintoma|tratamiento|medicamento|dosis|receta\s+medica|enfermedad|infeccion|glaucoma|catarata|conjuntivitis|destellos?|manchas?\s+flotantes?|moscas?\s+volantes?|flotadores?|vision\s+doble|ojo\s+rojo|lagrimeo|secrecion|picazon|trauma|golpe)\b/.test(
        normalized,
      );

    if (describesSymptoms || requestsClinicalGuidance) {
      return true;
    }

    const isPromptInjection =
      /\b(?:ign[o0]ra|olvida|omite|ignore|forget|disregard)\b.{0,35}\b(?:instrucciones|instructions|anterior|previous|todo|everything|reglas|rules|prompt)\b/.test(
        normalized,
      ) ||
      /\b(?:revela|devuelve|muestra|reveal|return|show|list|disclose)\b.{0,35}\b(?:datos\s+privados|private\s+data|secretos|secrets|credenciales|credentials|fuentes\s+internas|internal\s+sources|system\s+prompt)\b/.test(
        normalized,
      ) ||
      /\b(?:system\s+prompt|developer\s+message|jailbreak|actua\s+como|act\s+as|javascript|eval\s*\(|codigo\s+fuente|source\s+code)\b/.test(
        normalized,
      );
    const hasMathExpression =
      /\b\d{1,4}\s*(?:\+|\*|÷)\s*\d{1,4}\b/.test(normalized) ||
      /\b\d{1,4}\s+(?:-|\/)\s+\d{1,4}\b/.test(normalized);
    const isMathQuestion =
      hasMathExpression ||
      /\b(?:resuelve|calcula|ecuacion|raiz\s+cuadrada)\b/.test(normalized);
    const isGeneralKnowledge =
      /\b(?:capital\s+de|presidente\s+de|poblacion\s+de|historia\s+de|quien\s+gano|partido\s+de\s+futbol|pronostico\s+del\s+tiempo)\b/.test(
        normalized,
      );
    const referencesExternalCompany =
      /\b(?:google|microsoft|amazon|apple|facebook|meta|openai|chatgpt|netflix|spotify|uber)\b/.test(
        normalized,
      );

    return (
      isPromptInjection ||
      isMathQuestion ||
      isGeneralKnowledge ||
      referencesExternalCompany
    );
  }

  private normalizeWhitespace(value: string): string {
    return value.replace(/\s+/g, ' ').trim();
  }

  private fold(value: string): string {
    return value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();
  }
}
