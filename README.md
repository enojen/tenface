# Tenface

The panel of [tenyard](https://github.com/enojen/tenyard), the Kubernetes-native runtime of
coding agents. It shows, per project, the lanes of the babysitter sessions, the step of each
task and what the agents ask you. The planner of each project changes the lanes; the panel only
shows them.

[`PRODUCT.md`](PRODUCT.md) holds what the product is, and [`DESIGN.md`](DESIGN.md) how it looks.
[`web/`](web) holds the panel. It runs on made-up data until the server exists.

```sh
cd web
corepack pnpm install
corepack pnpm dev        # the panel on localhost; add ?mock=offline to see the offline strip
corepack pnpm check      # types
corepack pnpm test       # unit tests
corepack pnpm test:e2e   # browser tests: the phone in WebKit, the desktop in Chrome
```

## License

[FSL-1.1-ALv2](LICENSE).
