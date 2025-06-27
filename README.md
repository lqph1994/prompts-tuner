# Prompts Tuner

Prompts Tuner is a Next.js application designed to help users refine and improve their prompts for various large language models (LLMs). It allows you to input an initial prompt and receive three distinct variations: an improved version, a creative alternative, and a "red team" prompt designed to test the model's boundaries.

## Capabilities

- **Prompt Refinement:** Get expertly refined versions of your original prompts.
- **Creative Alternatives:** Explore different angles and creative interpretations of your prompt's intent.
- **Red Team Prompts:** Generate challenging prompts to test LLM biases, ethical boundaries, and unexpected behaviors.
- **Multi-Provider Support:** Seamlessly switch between different LLM providers (Gemini, OpenAI, Claude) and their available models.
- **Easy Copying:** Quickly copy refined prompts to your clipboard for immediate use.
- **Intuitive UI:** A clean and user-friendly interface for an efficient prompt tuning experience.

## Setup Instructions

Follow these steps to get the Prompts Tuner application up and running on your local machine.

### Prerequisites

- Node.js (version 18 or higher recommended)
- npm, yarn, pnpm, or bun

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/prompts-tuner.git
cd prompts-tuner
```

### 2. Install Dependencies

Choose your preferred package manager:

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

### 3. Configure API Keys

This application requires API keys for the LLM providers you wish to use. Create a `.env.local` file in the root of the project and add your API keys:

```
OPENAI_API_KEY=your_openai_api_key_here
GEMINI_API_KEY=your_gemini_api_key_here
CLAUDE_API_KEY=your_claude_api_key_here
```

Replace `your_openai_api_key_here`, `your_gemini_api_key_here`, and `your_claude_api_key_here` with your actual API keys.

### 4. Run the Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

The page auto-updates as you edit the file.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.