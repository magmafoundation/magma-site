# Magma Website

Documentation and downloads site for [Magma](https://github.com/magmafoundation/Magma-Neo), the Minecraft server software that combines NeoForge and Bukkit.

## Tech Stack

- [Next.js 16](https://nextjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS 4](https://tailwindcss.com/)
- [Fumadocs](https://www.fumadocs.dev/) for docs
- [shadcn/ui](https://ui.shadcn.com/) components
- [Biome](https://biomejs.dev/) for linting and formatting
- [Vitest](https://vitest.dev/) for testing

## Getting Started

Requires Node.js 20+ and pnpm.

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start dev server |
| `pnpm build` | Production build |
| `pnpm start` | Start production server |
| `pnpm test` | Run tests |
| `pnpm lint` | Lint with Biome |
| `pnpm format` | Format with Biome |
| `pnpm check` | Lint + format with Biome |

## License

[MIT License](LICENSE)
