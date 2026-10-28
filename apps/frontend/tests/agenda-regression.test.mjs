import assert from "node:assert/strict";
import test from "node:test";
import { resolve } from "node:path";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { QueryClient } from "@tanstack/react-query";
import { createTypeScriptLoader } from "./load-typescript.mjs";

const src = resolve(import.meta.dirname, "../src");
const load = createTypeScriptLoader();
const { toDateTimeInput } = load(`${src}/shared/utils/date-time.ts`);
const { buildAgendaCalendar } = load(`${src}/features/agenda/utils/agenda-calendar.ts`);
const { AgendaDiaView } = load(`${src}/features/agenda/components/agenda-dia-view.tsx`);
const { getScheduleWarning } = load(`${src}/features/agenda/utils/agenda-schedule.ts`);
const appointment = (id, scheduledAt, hora) => ({ id, scheduledAt, hora, clientId: id, clientFullName: `Paciente ${id}`, status: "PENDING" });

test("el próximo control vuelve a abrirse a las 15:00 y no a las 19:00", () => {
  assert.equal(toDateTimeInput("2026-10-29T19:00:00.000Z", "America/La_Paz"), "2026-10-29T15:00");
  assert.equal(toDateTimeInput("2026-10-29T02:00:00.000Z", "America/La_Paz"), "2026-10-28T22:00");
});

test("las tres vistas contienen el mismo control del 29/10 a las 15:00", () => {
  const control = appointment("control", "2026-10-29T19:00:00Z", "15:00");
  const calendar = buildAgendaCalendar([control], new Date(2026, 9, 29, 12), "America/La_Paz");
  assert.deepEqual(calendar.dayAppointments, [control]);
  assert.deepEqual(calendar.week.flatMap((day) => day.citas), [control]);
  assert.deepEqual(calendar.month.flatMap((week) => week.citas), [control]);
});

test("la vista diaria renderiza citas a las 03:30, 15:00, 19:00 y 23:30", () => {
  const appointments = [
    appointment("temprano", "2026-10-29T07:30:00Z", "03:30"),
    appointment("control", "2026-10-29T19:00:00Z", "15:00"),
    appointment("tarde", "2026-10-29T23:00:00Z", "19:00"),
    appointment("noche", "2026-10-30T03:30:00Z", "23:30"),
  ];
  const html = renderToStaticMarkup(React.createElement(AgendaDiaView, { appointments, onSelected() {} }));
  for (const item of appointments) {
    assert.ok(html.includes(item.clientFullName));
    assert.ok(html.includes(item.hora));
  }
});

test("la semana incluye viernes, sábado y domingo", () => {
  const appointments = [
    appointment("viernes", "2026-10-30T19:00:00Z", "15:00"),
    appointment("sabado", "2026-10-31T19:00:00Z", "15:00"),
    appointment("domingo", "2026-11-01T19:00:00Z", "15:00"),
  ];
  const calendar = buildAgendaCalendar(appointments, new Date(2026, 9, 29, 12), "America/La_Paz");
  assert.equal(calendar.week.length, 7);
  assert.equal(calendar.week[0].fecha.getDay(), 1);
  assert.deepEqual(calendar.week.flatMap((day) => day.citas), appointments);
});

test("el tablero completo renderiza el control en día, semana y mes", () => {
  const control = appointment("control", "2026-10-29T19:00:00Z", "15:00");
  for (const vista of ["Día", "Semana", "Mes"]) {
    const loadBoard = createTypeScriptLoader({
      react: { ...React, useState: (initial) => [typeof initial === "function" ? new Date(2026, 9, 29, 12) : vista, () => {}] },
    });
    const { AgendaBoard } = loadBoard(`${src}/features/agenda/components/agenda-board.tsx`);
    const html = renderToStaticMarkup(React.createElement(AgendaBoard, {
      data: { timezone: "America/La_Paz", appointments: [control] }, onSelected() {},
    }));
    assert.ok(html.includes("Paciente control"), vista);
    assert.ok(html.includes("15:00"), vista);
  }
});

test("el mes incluye la última noche y excluye el primer día del siguiente mes", () => {
  const lastNight = appointment("ultimo", "2026-11-01T03:30:00Z", "23:30");
  const nextMonth = appointment("siguiente", "2026-11-01T04:30:00Z", "00:30");
  const calendar = buildAgendaCalendar([lastNight, nextMonth], new Date(2026, 9, 31, 12), "America/La_Paz");
  assert.deepEqual(calendar.dayAppointments, [lastNight]);
  assert.deepEqual(calendar.month.flatMap((week) => week.citas), [lastNight]);
});

test("guardar una consulta actualiza agenda, ficha, listado e indicadores almacenados", async () => {
  const queryClient = new QueryClient();
  const keys = [["agenda", "sucursal-1"], ["patient-appointments", "paciente-1"], ["consultations"], ["patient-consultations", "paciente-1"], ["dashboard", "stats"]];
  for (const key of keys) queryClient.setQueryData(key, []);
  const loadHooks = createTypeScriptLoader({
    "@tanstack/react-query": { useQueryClient: () => queryClient, useMutation: (options) => options },
    "../services/consultation.service": { consultationService: {} },
  });
  const hooks = loadHooks(`${src}/features/consultation/hooks/use-consultation.ts`);
  for (const hook of [hooks.useCreateConsultation, hooks.useUpdateConsultation]) {
    for (const key of keys) queryClient.setQueryData(key, []);
    await hook().onSuccess({ clientId: "paciente-1" });
    for (const key of keys) assert.equal(queryClient.getQueryState(key).isInvalidated, true, JSON.stringify(key));
  }
  queryClient.clear();
});

test("el resaltado compara apertura, cierre y día en la zona de la sucursal", () => {
  const schedules = [
    { dayOfWeek: "THURSDAY", isOpen: true, openTime: "08:00", closeTime: "18:00" },
    { dayOfWeek: "SUNDAY", isOpen: false, openTime: null, closeTime: null },
  ];
  assert.equal(getScheduleWarning("2026-10-29T12:00:00Z", "America/La_Paz", schedules), null);
  assert.equal(getScheduleWarning("2026-10-29T11:59:00Z", "America/La_Paz", schedules), "Fuera del horario de atención");
  assert.equal(getScheduleWarning("2026-10-29T21:59:00Z", "America/La_Paz", schedules), null);
  assert.equal(getScheduleWarning("2026-10-29T22:00:00Z", "America/La_Paz", schedules), "Fuera del horario de atención");
  assert.equal(getScheduleWarning("2026-10-30T01:00:00Z", "America/La_Paz", schedules), "Fuera del horario de atención");
  assert.equal(getScheduleWarning("2026-11-01T19:00:00Z", "America/La_Paz", schedules), "Día sin atención configurada");
  assert.equal(getScheduleWarning("2026-10-30T19:00:00Z", "America/La_Paz", schedules), "Día sin atención configurada");
  assert.equal(getScheduleWarning("2026-11-01T19:00:00Z", "America/La_Paz", []), null);
});

test("los turnos nocturnos pueden continuar en el día siguiente", () => {
  const schedules = [{ dayOfWeek: "THURSDAY", isOpen: true, openTime: "22:00", closeTime: "06:00" }];
  assert.equal(getScheduleWarning("2026-10-30T03:00:00Z", "America/La_Paz", schedules), null);
  assert.equal(getScheduleWarning("2026-10-30T09:59:00Z", "America/La_Paz", schedules), null);
  assert.equal(getScheduleWarning("2026-10-30T10:00:00Z", "America/La_Paz", schedules), "Día sin atención configurada");
});

test("las tres vistas muestran en amarillo las citas fuera de horario y conservan las demás", () => {
  const appointments = [
    appointment("normal", "2026-10-29T19:00:00Z", "15:00"),
    appointment("fuera", "2026-10-29T23:00:00Z", "19:00"),
  ];
  const schedules = [{ dayOfWeek: "THURSDAY", isOpen: true, openTime: "08:00", closeTime: "18:00" }];
  for (const vista of ["Día", "Semana", "Mes"]) {
    const loadBoard = createTypeScriptLoader({
      react: { ...React, useState: (initial) => [typeof initial === "function" ? new Date(2026, 9, 29, 12) : vista, () => {}] },
    });
    const { AgendaBoard } = loadBoard(`${src}/features/agenda/components/agenda-board.tsx`);
    const html = renderToStaticMarkup(React.createElement(AgendaBoard, {
      data: { timezone: "America/La_Paz", appointments }, schedules, onSelected() {},
    }));
    assert.ok(html.includes("Paciente normal"), vista);
    assert.ok(html.includes("Paciente fuera"), vista);
    const highlighted = html.match(/<div[^>]*title="Fuera del horario de atención"[^>]*>/g) ?? [];
    assert.equal(highlighted.length, 1, vista);
    assert.ok(highlighted[0].includes("bg-yellow-100"), vista);
  }
});
