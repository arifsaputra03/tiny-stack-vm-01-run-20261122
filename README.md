# Tiny Stack VM — a faithful, compact interpreter

[![make.fun · tiny-stack-vm-01-run-20261122](https://make.fun/badge/tiny-stack-vm-01-run-20261122.svg)](https://make.fun/bounty/tiny-stack-vm-01-run-20261122?utm_source=github&utm_medium=readme&utm_campaign=tiny-stack-vm-01-run-20261122)
[![make.fun · rank](https://make.fun/badge/tiny-stack-vm-01-run-20261122/arifsaputra03/tiny-stack-vm-01-run-20261122/rank.svg)](https://make.fun/bounty/tiny-stack-vm-01-run-20261122/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=tiny-stack-vm-01-run-20261122)
[![make.fun · reward](https://make.fun/badge/tiny-stack-vm-01-run-20261122/arifsaputra03/tiny-stack-vm-01-run-20261122/reward.svg)](https://make.fun/bounty/tiny-stack-vm-01-run-20261122/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=tiny-stack-vm-01-run-20261122)

A tiny stack VM for the make.fun competition `tiny-stack-vm-01-run-20261122`: `main.ts` (Node 22, standard library only) runs every program of a set in one run and writes `/output/<id>/stdout.bin` and `/output/<id>/exit.txt` for each. It implements the kit ISA exactly — 32-bit wrapping arithmetic (exact `MUL` via `Math.imul`, unsigned `DIVU`/`MODU`/`LTU`), all ten traps with their own exit codes, and the step and output limits. Practice score 1,000,000 of 1,000,000 (house baseline plain-vm 1.0.0: 670,000).
