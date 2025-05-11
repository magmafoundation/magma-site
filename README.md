# Magma Website

Website for Magma

## Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Icons**: [Lucide React](https://lucide.dev/), [Simple Icons](https://simpleicons.org/)
- **Theme**: [next-themes](https://github.com/pacocoursey/next-themes)

## Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm (recommended)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd magma-website
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Run the development server:
   ```bash
   pnpm dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the website.

## Available Scripts

- `pnpm dev` - Start the development server
- `pnpm build` - Build the application for production
- `pnpm start` - Start the production server
- `pnpm lint` - Run ESLint to check code quality

## Project Structure

```
magmaneo-website/
├── app/                  # Next.js app directory
│   ├── globals.css       # Global CSS styles
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Home page with Magma Server features and download section
├── components/           # Reusable UI components
│   ├── mobile-nav.tsx    # Mobile navigation
│   ├── theme-provider.tsx # Theme provider
│   ├── theme-toggle.tsx  # Theme toggle button
│   └── ui/               # UI components from shadcn/ui
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions
├── public/               # Static assets including Magma logo and icons
└── ...config files       # Various configuration files
```

## Customization

### Theming

The website supports both light and dark themes out of the box, powered by the `next-themes` package. The theme toggle in the header allows users to switch between themes.

### Components

The UI is built using shadcn/ui components, which are fully customizable. You can modify or extend these components by editing the files in the `components/ui` directory.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

[MIT License](LICENSE)

## Acknowledgements

- [shadcn/ui](https://ui.shadcn.com/) for the beautiful UI components
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Next.js](https://nextjs.org/) for the React framework
- [Magma Foundation](https://github.com/magmafoundation/Magma-Neo) for the Minecraft server software that combines NeoForge and Bukkit
