# FAQ Agent - Hermaid

A sophisticated FAQ assistance system powered by OpenAI that intelligently matches user questions to FAQs in a multi-language environment. The system supports speech-to-text input, semantic question matching, and automatic German-to-English translation.

## 🎯 Overview

The FAQ Agent is designed to provide intelligent FAQ routing and customer support automation. It processes user questions in English, matches them to a comprehensive German FAQ database, and returns relevant answers with automatic translation.

### Key Features

- **🤖 Intelligent Matching**: Uses OpenAI's GPT models to semantically match user questions to the most relevant FAQ
- **🎤 Speech-to-Text**: Transcribe audio recordings to text using OpenAI's Whisper API
- **🌐 Multi-Language Support**: Handles English user questions, German FAQ database with automatic translation
- **⚡ Dual Processing Modes**: 
  - CLI-based interactive Q&A
  - Batch processing with audio transcription
- **📋 Formatted Output**: Intelligently formats answers with proper text alignment and emphasis
- **⏱️ Zero Temperature Inference**: Deterministic responses for consistent, reliable FAQ matching

## 📁 Project Structure

```
faq_agent/
├── src/                          # Main TypeScript source code
│   ├── index.ts                  # CLI application entry point
│   ├── faq/
│   │   ├── faqData.ts           # FAQ database with all Q&A pairs
│   │   └── types.ts             # TypeScript interfaces and types
│   └── prompts/
│       ├── faqPrompt.ts         # FAQ selection prompt builder
│       └── translationPrompt.ts # Translation prompt builder
├── stt/                         # Speech-to-Text module
│   ├── transcribe.ts            # Audio transcription logic
│   ├── transcribe.js            # Compiled JavaScript version
│   └── tsconfig.json            # TypeScript config for STT
├── dist/                        # Compiled JavaScript output
├── package.json                 # Project dependencies
├── tsconfig.json               # Main TypeScript configuration
├── .env                        # Environment variables (not in repo)
└── transcription_output.json   # Sample transcription output

```

## 🚀 Getting Started

### Prerequisites

- **Node.js** 16+ and npm
- **OpenAI API Key** (for GPT and Whisper APIs)
- TypeScript knowledge (optional, for development)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://gitlab.rrze.fau.de/gi60wedo/faq_agent_hermaid.git
   cd faq_agent
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables**:
   Create a `.env` file in the project root:
   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   OPENAI_MODEL=gpt-4o-mini
   ```
   
   Available models:
   - `gpt-4o-mini` (recommended - fast and cost-effective)
   - `gpt-4` (more powerful, higher cost)
   - `gpt-3.5-turbo` (legacy option)

4. **Build the TypeScript**:
   ```bash
   npm run build
   ```

## 📖 Usage

### Interactive CLI Mode

Start an interactive Q&A session:

```bash
npm run dev
```

Example interaction:
```
Ask a question in English (type 'exit' to quit): How do I reset my password?

Answer:
PASSWORD-RESET OVER THE APP OR THE WEBAPP

This works very easily - as you would typically know. If you don't receive an email,
please also check your **SPAM FOLDER**

Ask a question in English (type 'exit' to quit): exit
```

### Batch Processing with Transcription

For transcribing audio files and processing them:

```bash
npm run build
node stt/transcribe.js <path-to-audio-file>
```

Supported audio formats:
- MP3
- M4A
- WAV
- FLAC
- OGG
- WebM
- MPEG

### Production Build and Run

```bash
npm run build
npm start
```

## 🔧 Core Components

### 1. **FAQ Matching System** (`src/index.ts`)

The main application that:
- Accepts user questions in English
- Uses GPT to find the best matching FAQ based on semantic similarity
- Returns German answers from the FAQ database
- Translates answers to English
- Formats output for readability

**Key Functions**:
- `selectGermanAnswer()`: Finds the best matching FAQ
- `translateGermanToEnglish()`: Translates German answers
- `formatAnswer()`: Formats output text

### 2. **FAQ Database** (`src/faq/faqData.ts`)

Contains all FAQ entries with:
- **id**: Unique identifier
- **question_de**: Question in German
- **answer_de**: Answer in German
- **category**: FAQ category for organization

Current categories:
- Onboarding
- EXPERTS & APPOINTMENTS
- TREATMENT PLAN & RECOMMENDATIONS
- DOCUMENTS & DATA SHARING

### 3. **Speech-to-Text** (`stt/transcribe.ts`)

Processes audio files:
- Uses OpenAI Whisper API for transcription
- Implements fuzzy matching against FAQ questions
- Generates `transcription_output.json` with results
- Calculates similarity scores for FAQ matching

### 4. **Prompt Templates** (`src/prompts/`)

- **faqPrompt.ts**: Builds prompts for FAQ selection
- **translationPrompt.ts**: Constructs translation prompts for German→English

## 📊 API Integration

### OpenAI Models Used

1. **Chat Completions API**
   - Model: `gpt-4o-mini` (configurable)
   - Purpose: FAQ matching and translation
   - Temperature: 0 (deterministic responses)

2. **Whisper API**
   - Purpose: Audio transcription
   - Used by: `stt/transcribe.ts`

## 🔄 Workflow

```
User Input (English)
        ↓
[GPT] Semantic Matching Against FAQ Database
        ↓
German Answer Retrieved
        ↓
[GPT] Translate to English
        ↓
Format & Display Answer
```

## 🎮 Development

### Run in Development Mode

```bash
npm run dev
```

This uses `ts-node` to run TypeScript directly without compilation.

### Build for Production

```bash
npm run build
```

Outputs compiled JavaScript to `dist/` directory.

### Project Scripts

| Script | Purpose |
|--------|---------|
| `npm run dev` | Run in development mode (direct TypeScript) |
| `npm run build` | Compile TypeScript to JavaScript |
| `npm start` | Run compiled production build |

## 📦 Dependencies

### Runtime
- **openai** (^6.25.0): OpenAI API client
- **dotenv** (^17.3.1): Environment variable management
- **string-similarity** (^4.0.4): Fuzzy string matching
- **wrap-ansi** (^9.0.2): ANSI text wrapping

### Development
- **typescript** (^5.9.3): TypeScript compiler
- **ts-node** (^10.9.2): TypeScript execution engine
- **@types/node** (^25.3.3): Node.js type definitions

## 🔐 Environment Setup

### Required Variables
```env
OPENAI_API_KEY=sk-...    # Your OpenAI API key
OPENAI_MODEL=gpt-4o-mini # Model choice (optional, defaults to gpt-4o-mini)
```

### Obtaining OpenAI API Key

1. Visit [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in
3. Navigate to API Keys section
4. Create a new API key
5. Copy and add to `.env` file

**⚠️ Security**: Never commit `.env` file to version control. It's already in `.gitignore`.

## 📝 Adding FAQs

To add new FAQs, edit `src/faq/faqData.ts`:

```typescript
{
  id: "FAQ_009",
  question_de: "Your German question here",
  answer_de: "Your German answer here",
  category: "CATEGORY_NAME"
}
```

After adding FAQs, rebuild:
```bash
npm run build
```

## 🚨 Troubleshooting

### "API Key not found" Error
- Check `.env` file exists in root directory
- Verify `OPENAI_API_KEY` is set correctly
- Restart the application after updating `.env`

### No matching FAQ found
- The system will return "NOT_FOUND"
- Consider adding the question to the FAQ database
- Verify question phrasing and semantic similarity

### Audio transcription fails
- Ensure audio file format is supported (MP3, M4A, WAV, FLAC, OGG, WebM, MPEG)
- Check file is not corrupted
- Verify file path is correct

### TypeScript compilation errors
- Run `npm install` to ensure all dependencies are installed
- Delete `dist/` folder and rebuild: `npm run build`
- Check Node.js version: `node --version` (should be 16+)

## 📊 Performance Considerations

- **FAQ Selection**: Uses semantic matching with temperature=0 for consistency
- **Translation**: Cached between requests if same text
- **API Costs**: Depends on OpenAI pricing for your API tier
- **Response Time**: Typically 1-3 seconds per question

## 🔜 Roadmap

- [ ] Add support for more languages
- [ ] Implement FAQ caching and indexing
- [ ] Add confidence scores for matches
- [ ] Support for FAQ categories/filtering
- [ ] Analytics and usage tracking
- [ ] Web API endpoint (REST/GraphQL)
- [ ] Improved formatting for special characters

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a merge request

### Code Style
- Use TypeScript for all code
- Follow existing naming conventions
- Add JSDoc comments for public functions
- Run builds before committing

## 📄 License

ISC License - See LICENSE file for details

## 👥 Authors

**Original Author**: Hermaid FAQ Agent Team  
**GitLab**: [gi60wedo](https://gitlab.rrze.fau.de/gi60wedo)

## 🆘 Support

For issues, questions, or suggestions:
- Open an issue on GitLab
- Check existing documentation
- Review FAQ database for common questions

## 📞 Contact

For technical support, please contact the development team through GitLab issues.

---

**Last Updated**: May 2026  
**Status**: Active Development
