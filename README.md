# Base Creator Connect

A Base MiniApp that enables creators to easily accept tips, engage fans with interactive features, and build a direct monetization channel with their audience.

![Base Creator Connect](https://placehold.co/600x400?text=Base+Creator+Connect)

## Features

- **One-Click Tipping Button**: A simple, embeddable widget or Farcaster in-frame action that allows fans to send tips to creators using their Base wallet.
- **Customizable Tip Messages & Reactions**: Fans can attach personalized text messages, GIFs, or pre-defined reactions to their tips.
- **Creator Goal Tipping Drive**: Creators can set specific goals and display a visual progress bar. Fans can contribute towards these goals.
- **Tiered Fan Recognition**: Creators can define different 'ranks' or 'shout-out' tiers associated with specific tip amounts.

## Tech Stack

- **Frontend**: Next.js, React, Tailwind CSS
- **Backend**: Next.js API Routes, Supabase
- **Authentication**: Privy
- **Blockchain**: Base (Ethereum L2), Wagmi, Viem
- **AI**: OpenAI/OpenRouter for personalized thank-you notes
- **Farcaster Integration**: Farcaster Frames

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- A Supabase account
- A Privy account
- An OpenAI or OpenRouter API key

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-org/base-creator-connect.git
   cd base-creator-connect
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Copy the example environment variables file:
   ```bash
   cp .env.example .env.local
   ```

4. Update the environment variables in `.env.local` with your own values.

5. Set up the database:
   - Create a new Supabase project
   - Run the SQL scripts from `lib/schema.ts` to create the necessary tables

6. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

7. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### For Creators

1. Connect your wallet to create a creator profile
2. Set up your profile with a username, bio, and profile image
3. Create tipping tiers to offer special perks to your supporters
4. Set up funding goals to motivate your community
5. Embed the tipping widget on your website or use the Farcaster frame

### For Fans

1. Connect your wallet to tip a creator
2. Choose a tip amount and optional message
3. Select a goal to contribute towards (optional)
4. Send the tip and receive a personalized thank-you note

## API Documentation

See [API Documentation](docs/api.md) for details on the available API endpoints.

## Deployment

See [Deployment Guide](docs/deployment.md) for instructions on deploying the application to production.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [Base](https://base.org/) - The Ethereum L2 powering this application
- [Privy](https://privy.io/) - For wallet authentication
- [Supabase](https://supabase.com/) - For database and backend services
- [Farcaster](https://farcaster.xyz/) - For frames integration
- [OpenAI](https://openai.com/) - For AI-powered thank-you notes
- [shadcn/ui](https://ui.shadcn.com/) - For UI components

