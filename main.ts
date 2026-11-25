// Tiny Bot: SOL-only EMA crossover, long only.
// Enters SOL when the fast EMA crosses above the slow EMA, exits on the
// cross back down, on a close under the fast EMA, or on the ROI/stoploss.

import { BPS, runBars, type Bar, type BarsState, type BuyInput, type SellInput } from './vendor/makefun-bars.ts';

const SYMBOL = 'SOL';
const FAST_BARS = 3;
const SLOW_BARS = 7;
const ROI = [3n, 2n] as const;
const STOP = [4n, 5n] as const;
const MAX_SLIPPAGE_BPS = 100;

interface Ema {
  span: number;
  warm: number[];
  value: number | null;
}

interface Series {
  fast: Ema;
  slow: Ema;
  gap: number | null;
  now: number | null;
  down: boolean;
}

function step(e: Ema, close: number): void {
  if (e.value !== null) {
    e.value += (2 / (e.span + 1)) * (close - e.value);
    return;
  }
  e.warm.push(close);
  if (e.warm.length === e.span) e.value = e.warm.reduce((a, x) => a + x, 0) / e.span;
}

const series: Series = {
  fast: { span: FAST_BARS, warm: [], value: null },
  slow: { span: SLOW_BARS, warm: [], value: null },
  gap: null,
  now: null,
  down: false,
};

function push(bar: Bar): void {
  const c = Number(bar.c);
  step(series.fast, c);
  step(series.slow, c);
  series.gap = series.now;
  series.now = series.fast.value !== null && series.slow.value !== null
    ? series.fast.value - series.slow.value
    : null;
  if (series.now === null || series.now >= 0) series.down = false;
}

// A position is closed for one of four reasons, whichever fires first:
// the slow EMA has crossed back above the fast one and stays there, the
// latest close has slipped under the fast EMA, the position has gained
// half its cost again, or it has lost a fifth of it. The close-under-fast
// rule exists because the fast EMA turns first: waiting for the slow cross
// to confirm a fade gives back too much of the move on hourly bars.
function exits(state: BarsState, held: { qty: bigint; cost: bigint }): boolean {
  if (series.down) return true;
  if (series.fast.value !== null && Number(state.close(SYMBOL)) < series.fast.value) return true;
  const value: bigint = state.value(SYMBOL, held.qty);
  return value * ROI[1] >= held.cost * ROI[0] || value * STOP[1] <= held.cost * STOP[0];
}

await runBars({
  onBatch(state, batch) {
    let crossUp = false;
    for (const bar of batch.bars) {
      if (bar.symbol !== SYMBOL) continue;
      push(bar);
      if (series.gap === null || series.now === null || bar.v === '0') continue;
      if (series.now > 0 && series.gap <= 0) crossUp = true;
      if (series.now < 0 && series.gap >= 0) series.down = true;
    }
    if (state.warmingUp) return [];
    const { caps, fees } = state.hello;
    const orders: (BuyInput | SellInput)[] = [];
    const held = state.positions.get(SYMBOL);
    if (held !== undefined && exits(state, held)) {
      orders.push({ side: 'sell', symbol: SYMBOL, qty: held.qty, max_slippage_bps: MAX_SLIPPAGE_BPS });
    }
    const stillHeld = held !== undefined && orders.length === 0;
    if (!stillHeld && crossUp) {
      let size = state.cash;
      const byWeight = (BigInt(caps.max_weight_bps) * state.equity) / BPS;
      if (byWeight < size) size = byWeight;
      if (size >= BigInt(fees.min_notional_quote_units)) {
        orders.push({ side: 'buy', symbol: SYMBOL, notional_quote_units: size, max_slippage_bps: MAX_SLIPPAGE_BPS });
      }
    }
    return orders;
  },
});
