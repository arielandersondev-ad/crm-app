import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const FAQs = [
  // HORARIOS
  { category: "HORARIOS" as const, question: "¿Cuál es el horario de atención?", answer: "Atención de lunes a viernes de 8:00 a 18:00 y sábados de 8:00 a 13:00." },
  { category: "HORARIOS" as const, question: "¿Atenen en feriados?", answer: "No, solo abrimos en días hábiles. En caso de emergencia, comuníquese con nuestra línea de emergencia." },
  { category: "HORARIOS" as const, question: "¿Cuál es el horario de emergencias?", answer: "Las emergencias se atienden las 24 horas llamando a nuestra línea de emergencia." },
  { category: "HORARIOS" as const, question: "¿A qué hora abren los sábados?", answer: "Los sábados abrimos de 8:00 a 13:00." },

  // SERVICIOS
  { category: "SERVICIOS" as const, question: "¿Qué servicios ofrecen?", answer: "Ofrecemos consultas oftalmológicas, exámenes de la vista, recetas de lentes, cirugías refractivas y seguimiento postoperatorio." },
  { category: "SERVICIOS" as const, question: "¿Realizan cirugías de catarata?", answer: "Sí, realizamos cirugías de catarata con tecnología moderna y atención personalizada." },
  { category: "SERVICIOS" as const, question: "¿Realizan cirugía LASIK?", answer: "Sí, realizamos cirugía refractiva LASIK. Solicite una evaluación para determinar si es candidato." },
  { category: "SERVICIOS" as const, question: "¿Venden lentes o solo recetan?", answer: "Realizamos recetas y contamos con un taller de lentes donde puede adquirir sus anteojos." },
  { category: "SERVICIOS" as const, question: "¿Ofrecen atención virtual?", answer: "Sí, ofrecemos teleconsultas para seguimiento y control. No para primera consulta." },
  { category: "SERVICIOS" as const, question: "¿Realizan exámenes de la vista?", answer: "Sí, realizamos exámenes completos: agudeza visual, refracción, presión ocular, fondo de ojo y más." },

  // PRECIOS
  { category: "PRECIOS" as const, question: "¿Cuánto cuesta una consulta?", answer: "El costo de la consulta varía según el tipo de atención. Contáctenos para conocer nuestros precios actualizados." },
  { category: "PRECIOS" as const, question: "¿Aceptan seguros médicos?", answer: "Sí, trabajamos con los principales seguros médicos. Consulte con su aseguradora si nuestra clínica está incluida en su plan." },
  { category: "PRECIOS" as const, question: "¿Cuáles son las formas de pago?", answer: "Aceptamos efectivo, tarjetas de crédito, débito y transferencias bancarias." },

  // CONTACTO
  { category: "CONTACTO" as const, question: "¿Cuál es su número de teléfono?", answer: "Puede contactarnos al (XXX) XXXX-XXXX en horario de atención." },
  { category: "CONTACTO" as const, question: "¿Cuál es su dirección?", answer: "Estamos ubicados en [Dirección de la clínica], [Ciudad]." },
  { category: "CONTACTO" as const, question: "¿Tienen WhatsApp?", answer: "Sí, puede escribirnos al (XXX) XXXX-XXXX por WhatsApp para consultas rápidas." },
  { category: "CONTACTO" as const, question: "¿Cómo puedo comunicarme con un médico?", answer: "Puede solicitar una cita y durante la consulta podrá hablar directamente con el especialista." },
  { category: "CONTACTO" as const, question: "¿Cuál es su correo electrónico?", answer: "Puede escribirnos a [correo@clinica.com] y le responderemos a la brevedad." },

  // EMERGENCIAS
  { category: "EMERGENCIAS" as const, question: "¿Qué hago en caso de emergencia ocular?", answer: "Acuda inmediatamente a nuestra clínica o llame a nuestra línea de emergencia. No se automedique." },
  { category: "EMERGENCIAS" as const, question: "¿Atenen emergencias después de hora?", answer: "Sí, contamos con un servicio de emergencia disponible las 24 horas." },
  { category: "EMERGENCIAS" as const, question: "¿Cuál es el número de emergencias?", answer: "Nuestro número de emergencias es (XXX) XXXX-XXXX, disponible las 24 horas." },

  // CITAS
  { category: "CITAS" as const, question: "¿Cómo agendo una cita?", answer: "Puede agendar una cita llamando al (XXX) XXXX-XXXX, por WhatsApp o a través de nuestro sistema en línea." },
  { category: "CITAS" as const, question: "¿Necesito orden médica para una consulta?", answer: "No es necesaria orden médica para una consulta de rutina. Puede agendar directamente." },
  { category: "CITAS" as const, question: "¿Puedo reprogramar mi cita?", answer: "Sí, puede reprogramar su cita con al menos 24 horas de anticipación." },
  { category: "CITAS" as const, question: "¿Puedo cancelar mi cita?", answer: "Sí, puede cancelar su cita sin costo con al menos 24 horas de anticipación." },
  { category: "CITAS" as const, question: "¿Qué debo traer a mi primera consulta?", answer: "Traiga su documento de identidad, anteojos o lentes actuales si usa, y cualquier examen previo que tenga." },

  // GENERAL
  { category: "GENERAL" as const, question: "¿Atienden niños?", answer: "Sí, atendemos pacientes de todas las edades, desde niños hasta adultos mayores." },
  { category: "GENERAL" as const, question: "¿Cuánto dura una consulta?", answer: "Una consulta de rutina dura aproximadamente 30 a 45 minutos." },
  { category: "GENERAL" as const, question: "¿Necesito ayuno para algún examen?", answer: "No, la mayoría de exámenes oftalmológicos no requieren preparación especial." },
  { category: "GENERAL" as const, question: "¿Cuándo debo realizarme un examen de la vista?", answer: "Se recomienda un examen anual, o antes si presenta cambios en la visión, dolor ocular o molestias." },
  { category: "GENERAL" as const, question: "¿Cómo sé si necesito lentes?", answer: "Si experimenta visión borrosa, dolores de cabeza frecuentes o fatiga visual, le recomendamos agendar una consulta." },
  { category: "GENERAL" as const, question: "¿Qué es la presión ocular?", answer: "Es la presión dentro del ojo. Un valor elevado puede ser señal de glaucoma. Se mide durante el examen de rutina." },
  { category: "GENERAL" as const, question: "¿Cada cuánto debo controlar mi vista si uso lentes?", answer: "Se recomienda un control anual para verificar si su graduación ha cambiado." },
  { category: "GENERAL" as const, question: "¿Cuánto tiempo tarda la recuperación de una cirugía LASIK?", answer: "La recuperación inicial es rápida; la mayoría de pacientes retoman sus actividades en 24 a 48 horas." },
];

async function main() {
  console.log("🌱 Iniciando seed de FAQs...");

  const tenants = await prisma.tenant.findMany();
  if (tenants.length === 0) {
    console.log("⚠️  No hay tenants registrados. Seed abortado.");
    return;
  }

  for (const tenant of tenants) {
    // Crear BotConfig default si no existe
    await prisma.botConfig.upsert({
      where: { tenantId: tenant.id },
      update: {},
      create: { tenantId: tenant.id },
    });

    // Insertar FAQs (solo si no hay ninguna para este tenant)
    const existingFAQs = await prisma.fAQ.count({ where: { tenantId: tenant.id } });
    if (existingFAQs > 0) {
      console.log(`⏭️  Tenant "${tenant.name}" ya tiene ${existingFAQs} FAQs. Omitiendo.`);
      continue;
    }

    for (const faq of FAQs) {
      await prisma.fAQ.create({
        data: {
          tenantId: tenant.id,
          question: faq.question,
          answer: faq.answer,
          category: faq.category,
        },
      });
    }

    console.log(`✅  ${FAQs.length} FAQs creadas para tenant "${tenant.name}"`);
  }

  console.log("🎉 Seed completado.");
}

main()
  .catch((e) => {
    console.error("❌ Error en seed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
