"use client";

import { useMemo, useState } from "react";
import { ArrowLeftRight } from "lucide-react";
import { Reveal } from "@/components/reveal";

/*
 * Conversor multi-categoria. Cada categoria tem uma unidade-base e cada unidade
 * declara um `factor` que a converte em base. A conversão entre quaisquer duas
 * unidades fica: `(valor * factorFrom) / factorTo`.
 */

type Unit = { id: string; label: string; factor: number };

const CATEGORIES: Record<string, { name: string; baseLabel: string; units: Unit[] }> = {
  area: {
    name: "Área",
    baseLabel: "m² (metro quadrado)",
    units: [
      { id: "m2", label: "m² (metro quadrado)", factor: 1 },
      { id: "km2", label: "km² (quilômetro quadrado)", factor: 1_000_000 },
      { id: "ha", label: "hectare (ha)", factor: 10_000 },
      { id: "alqueire-paulista", label: "alqueire paulista (24.200 m²)", factor: 24_200 },
      { id: "alqueire-mineiro", label: "alqueire mineiro/goiano (48.400 m²)", factor: 48_400 },
      { id: "alqueire-norte", label: "alqueire do norte (27.225 m²)", factor: 27_225 },
      { id: "acre", label: "acre", factor: 4_046.8564224 },
      { id: "ft2", label: "ft² (pé quadrado)", factor: 0.09290304 },
    ],
  },
  mass: {
    name: "Massa",
    baseLabel: "kg (quilograma)",
    units: [
      { id: "kg", label: "kg (quilograma)", factor: 1 },
      { id: "g", label: "g (grama)", factor: 0.001 },
      { id: "t", label: "t (tonelada)", factor: 1_000 },
      { id: "saca-60", label: "saca de 60 kg", factor: 60 },
      { id: "arroba", label: "@ (arroba — 15 kg)", factor: 15 },
      { id: "lb", label: "lb (libra)", factor: 0.45359237 },
      { id: "oz", label: "oz (onça)", factor: 0.0283495 },
      { id: "short-ton", label: "short ton (EUA — 907,185 kg)", factor: 907.18474 },
    ],
  },
  volume: {
    name: "Volume",
    baseLabel: "m³ (metro cúbico)",
    units: [
      { id: "m3", label: "m³ (metro cúbico)", factor: 1 },
      { id: "l", label: "L (litro)", factor: 0.001 },
      { id: "st", label: "st (estéreo — madeira empilhada)", factor: 1 },
      { id: "bbl", label: "barril (159 L)", factor: 0.158987 },
      { id: "ft3", label: "ft³ (pé cúbico)", factor: 0.0283168 },
      { id: "gal-us", label: "gal (galão US)", factor: 0.00378541 },
      { id: "bdmt", label: "BDMT (toneladas secas — base p/ biomassa, ≈1 m³)", factor: 1 },
    ],
  },
  energy: {
    name: "Energia",
    baseLabel: "MJ (megajoule)",
    units: [
      { id: "mj", label: "MJ (megajoule)", factor: 1 },
      { id: "gj", label: "GJ (gigajoule)", factor: 1_000 },
      { id: "kwh", label: "kWh (quilowatt-hora)", factor: 3.6 },
      { id: "mwh", label: "MWh (megawatt-hora)", factor: 3_600 },
      { id: "gwh", label: "GWh (gigawatt-hora)", factor: 3_600_000 },
      { id: "kcal", label: "kcal (quilocaloria)", factor: 0.0041868 },
      { id: "boe", label: "BOE (barril de óleo equivalente)", factor: 6_117.86 },
    ],
  },
};

type CatKey = keyof typeof CATEGORIES;

export function Converter() {
  const [cat, setCat] = useState<CatKey>("area");
  const [from, setFrom] = useState<string>("ha");
  const [to, setTo] = useState<string>("alqueire-paulista");
  const [value, setValue] = useState<string>("1");

  const units = CATEGORIES[cat].units;

  const result = useMemo(() => {
    const v = parseFloat(value.replace(",", "."));
    if (!Number.isFinite(v)) return "";
    const u1 = units.find((u) => u.id === from);
    const u2 = units.find((u) => u.id === to);
    if (!u1 || !u2) return "";
    const out = (v * u1.factor) / u2.factor;
    // Formatação pt-BR com até 6 casas decimais.
    return out.toLocaleString("pt-BR", {
      maximumFractionDigits: 6,
      minimumFractionDigits: 0,
    });
  }, [value, from, to, units]);

  const swap = () => {
    setFrom(to);
    setTo(from);
  };

  // Quando troca de categoria, reseta unidades para as 2 primeiras válidas.
  const onCatChange = (k: CatKey) => {
    setCat(k);
    setFrom(CATEGORIES[k].units[0].id);
    setTo(CATEGORIES[k].units[1]?.id ?? CATEGORIES[k].units[0].id);
    setValue("1");
  };

  return (
    <Reveal>
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] p-5 lg:p-7">
        {/* Categorias */}
        <div className="flex flex-wrap gap-2">
          {(Object.keys(CATEGORIES) as CatKey[]).map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => onCatChange(k)}
              className={
                "rounded-full border px-4 py-2 text-sm font-medium transition " +
                (cat === k
                  ? "border-brand-500 bg-brand-500 text-white"
                  : "border-[var(--border)] text-[var(--content-soft)] hover:bg-[var(--surface)]")
              }
            >
              {CATEGORIES[k].name}
            </button>
          ))}
        </div>

        {/* Formulário */}
        <div className="mt-6 grid gap-4 sm:grid-cols-[1fr_auto_1fr] sm:items-end">
          <div>
            <label className="mb-1.5 block text-sm font-medium">De</label>
            <input
              type="text"
              inputMode="decimal"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3.5 py-2.5 text-base outline-none transition focus:border-brand-500"
            />
            <select
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="mt-2 w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 text-sm"
            >
              {units.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.label}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={swap}
            aria-label="Inverter unidades"
            className="grid h-11 w-11 place-items-center self-center rounded-full border border-[var(--border)] bg-[var(--surface)] transition hover:bg-brand-500 hover:text-white"
          >
            <ArrowLeftRight className="h-4 w-4" />
          </button>

          <div>
            <label className="mb-1.5 block text-sm font-medium">Para</label>
            <div className="w-full rounded-lg border border-brand-500 bg-brand-500/5 px-3.5 py-2.5 text-base font-semibold text-brand-700 dark:text-brand-200">
              {result || "—"}
            </div>
            <select
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="mt-2 w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 text-sm"
            >
              {units.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <p className="mt-5 text-xs text-[var(--content-soft)]">
          Base de cálculo: {CATEGORIES[cat].baseLabel}. Conversões usam fatores
          padrão; para uso financeiro/contratual, verifique a unidade
          aplicável.
        </p>
      </div>
    </Reveal>
  );
}
