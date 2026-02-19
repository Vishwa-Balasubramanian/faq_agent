# FAQ Agent

An intelligent FAQ routing and translation agent that helps users find relevant answers to their questions. The system uses OpenAI's GPT models to match English user questions to German FAQ answers and translate them back to English.

## Tech Stack

- **TypeScript**: Full type-safe implementation
- **OpenAI API**: GPT-4o-mini for question matching and translation
- **Node.js**: Runtime environment
- **dotenv**: Environment configuration management

## Project Structure

```
faq_agent/
├── src/
│   ├── index.ts                 # Main CLI entry point
│   ├── faq/
│   │   ├── faqData.ts          # FAQ database with German Q&A pairs
│   │   └── types.ts            # TypeScript interfaces (FaqItem)
│   └── prompts/
│       ├── faqPrompt.ts        # Prompt for FAQ selection
│       └── translationPrompt.ts # Prompt for German-to-English translation
├── package.json                # Dependencies and scripts
├── tsconfig.json               # TypeScript configuration
└── README.md                   # This file
```

## Setup

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn
- OpenAI API key

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd faq_agent
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-5.1
```

## Usage

### Development Mode

Run the application in development with TypeScript compilation:
```bash
npm run dev
```

### Build

Compile TypeScript to JavaScript:
```bash
npm run build
```

### Production Mode

Run the compiled JavaScript:
```bash
npm start
```

## How It Works

1. **User Input**: User asks a question in English via the CLI
2. **FAQ Matching**: The system sends the question to OpenAI to find the best matching FAQ
3. **Answer Retrieval**: The German answer from the matched FAQ is extracted
4. **Translation**: If an answer is found, it's translated from German to English
5. **Formatting**: The translated answer is formatted for better readability
6. **Output**: The formatted answer is displayed to the user

**Last Updated**: February 2026
