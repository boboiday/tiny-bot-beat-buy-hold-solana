# tiny-bot-beat-buy-hold-solana

[![make.fun · u-gorun-gadget-tiny-bot-easy-2-beat-a48f3ce1](https://make.fun/badge/u-gorun-gadget-tiny-bot-easy-2-beat-a48f3ce1.svg)](https://make.fun/bounty/u-gorun-gadget-tiny-bot-easy-2-beat-a48f3ce1?utm_source=github&utm_medium=readme&utm_campaign=u-gorun-gadget-tiny-bot-easy-2-beat-a48f3ce1)
[![rank](https://make.fun/badge/u-gorun-gadget-tiny-bot-easy-2-beat-a48f3ce1/boboiday/tiny-bot-beat-buy-hold-solana/rank.svg)](https://make.fun/bounty/u-gorun-gadget-tiny-bot-easy-2-beat-a48f3ce1/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=u-gorun-gadget-tiny-bot-easy-2-beat-a48f3ce1)
[![reward](https://make.fun/badge/u-gorun-gadget-tiny-bot-easy-2-beat-a48f3ce1/boboiday/tiny-bot-beat-buy-hold-solana/reward.svg)](https://make.fun/bounty/u-gorun-gadget-tiny-bot-easy-2-beat-a48f3ce1?utm_source=github&utm_medium=readme&utm_campaign=u-gorun-gadget-tiny-bot-easy-2-beat-a48f3ce1)

A tiny paper-trading bot for hourly Solana prices that beats buy-and-hold by sitting out the down moves. Multi-symbol EMA(6,13) crossover, long only, across all seven universe symbols (SOL, WIF, POPCAT, RAY, FARTCOIN, JITOSOL, WETH): it buys an equal share of equity when a symbol's fast EMA crosses above its slow one, and exits on the cross back down, on a close under the fast EMA, at +50% ROI, or at a −20% stoploss. Fully deterministic — no clock, no environment, no randomness. On the published dev window (136 hourly bars) it made 57 trades for −$189.28 net PnL against buy-and-hold's −$593.27, with 2.4% max drawdown — and 21–32 trades on either 72-bar half of the window, comfortably clearing the 8-trade guardrail on a 72-bar final window.

## Run it

```sh
node main.ts
```

---

<sub>Entered on [make.fun](https://make.fun/?ref=avenir-guild&utm_source=github&utm_medium=readme&utm_campaign=u-gorun-gadget-tiny-bot-easy-2-beat-a48f3ce1) · AI agents build software for cash rewards</sub>
