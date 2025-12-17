# <img src="public/icons/icon_48.png" width="45" align="left"> AI Agent for Overleaf

[![Chrome Web Store](https://img.shields.io/chrome-web-store/v/pcmffklbilmgckfkbncpoffmicdpfkmm?label=Chrome)](https://chrome.google.com/webstore/detail/overleaf-copilot/pcmffklbilmgckfkbncpoffmicdpfkmm)
[![Edge Add-on](https://img.shields.io/badge/Edge-Add--on-blue)](https://microsoftedge.microsoft.com/addons/detail/overleaf-copilot/dgbgphmgphkibogcjhjhdmkjphejcead)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

**AI-powered code completion and text enhancement for the [Overleaf](https://www.overleaf.com) LaTeX editor.**

Transform your academic writing experience with intelligent LaTeX suggestions, text improvements, and research discovery—all powered by OpenAI's GPT models or any compatible API provider.

---

## ✨ Features

### 🤖 Auto-Completion
Get real-time, context-aware LaTeX suggestions as you write. The AI understands your document structure and continues your content with semantic continuity.

### ✏️ Text Enhancement
Select any text and instantly improve it with AI-powered rewriting, grammar fixing, or style adjustments using the floating toolbar.

### 🔍 Find Similar Papers
Discover related research on arXiv based on your selected text. Great for literature reviews and finding citations.

---

## 📦 Installation

### From Web Stores (Recommended)

| Browser | Link |
|---------|------|
| **Google Chrome** | [Chrome Web Store](https://chrome.google.com/webstore/detail/overleaf-copilot/pcmffklbilmgckfkbncpoffmicdpfkmm) |
| **Microsoft Edge** | [Edge Add-ons](https://microsoftedge.microsoft.com/addons/detail/overleaf-copilot/dgbgphmgphkibogcjhjhdmkjphejcead) |

### Manual Installation (Development)

1. Clone or download this repository
2. Run `npm install` to install dependencies
3. Run `npm run build` to create the production build
4. Open `chrome://extensions/` (or `edge://extensions/`)
5. Enable **Developer mode**
6. Click **Load unpacked** and select the `build/` folder

---

## ⚙️ Setup

After installing the extension:

1. **Open Options**: Click the extension icon in your browser toolbar, then click **Options** (or right-click the icon → Options)

2. **Enter your API Key**: 
   - Get an API key from [OpenAI](https://platform.openai.com/api-keys)
   - Or use any OpenAI-compatible provider (Azure, Anthropic, local models, etc.)

3. **Configure Settings** (optional):
   | Setting | Default | Description |
   |---------|---------|-------------|
   | API Base URL | `https://api.openai.com/v1` | Change for custom providers |
   | Model | `gpt-3.5-turbo` | GPT model to use |
   | Max Output Tokens | `500` | Maximum length of suggestions |
   | Custom Prompt | (built-in) | Your own prompt template |

4. **Test Connection**: Click "Test Connection" to verify your API key works

---

## 📖 Usage Guide

### Auto-Completion

The extension automatically provides inline suggestions as you write LaTeX:

#### When Suggestions Appear

| Condition | Requirement |
|-----------|-------------|
| **Trigger position** | After typing a space at the end of a line, OR on a new/empty line |
| **Minimum content** | At least 50 characters of content before cursor |
| **Delay** | Suggestions appear after ~800ms of inactivity (to avoid interrupting typing) |
| **Excluded lines** | Lines starting with `%` (LaTeX comments) are ignored |

#### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Tab` | **Accept** the entire suggestion |
| `Ctrl + →` (Windows/Linux) | Accept **one word** at a time |
| `Cmd + →` (macOS) | Accept **one word** at a time |
| `Escape` or click elsewhere | **Dismiss** the suggestion |

#### Visual Indicators

| Indicator | Meaning |
|-----------|---------|
| `...` (animated/flashing) | AI is generating a suggestion |
| Grey overlay text | Suggestion is ready—press Tab to accept |
| Red text | An error occurred (check console for details) |

---

### Text Enhancement Toolbar

When you **select text** in the Overleaf editor, a floating toolbar appears:

1. **Edit Icon** (✏️): Opens an inline editor to rewrite or improve the selected text with AI assistance
2. **Search Icon** (🔍): Find similar papers on arXiv based on the selected content

The toolbar actions use your configured API key and model.

---

### Find Similar Papers

Discover related research based on your document content:

1. Select relevant text (abstract, paragraph, or keywords)
2. Click the **search icon** in the toolbar
3. View matching papers from arXiv with titles, authors, and abstracts
4. Click any result to open the paper

---

## 🔧 Configuration Reference

### Options Page Settings

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `API Key` | string | — | Your OpenAI API key (required) |
| `API Base URL` | string | `https://api.openai.com/v1` | Base URL for API requests |
| `Model` | string | `gpt-3.5-turbo` | Model ID to use for completions |
| `Max Output Tokens` | number | `500` | Maximum tokens in AI response |
| `Suggestion Prompt` | string | (built-in) | Custom prompt template |
| `Disable Suggestions` | boolean | `false` | Turn off auto-completion |
| `Disable Toolbar` | boolean | `false` | Turn off selection toolbar |
| `Disable Search` | boolean | `false` | Turn off arXiv search in toolbar |

### Custom Prompt Templates

You can define your own suggestion prompt using these placeholders:

| Placeholder | Description | Example |
|-------------|-------------|---------|
| `{{before}}` | All text before the cursor | Full document up to cursor |
| `{{after}}` | All text after the cursor | Rest of document |
| `{{selection}}` | Currently selected text | (For toolbar actions) |
| `{{before[-1000:]}}` | Last 1000 characters before cursor | Slice syntax |
| `{{after[:500]}}` | First 500 characters after cursor | Slice syntax |

**Example custom prompt:**
```
You are a LaTeX expert. Continue the following academic paper naturally:

{{before[-2000:]}}

Provide only the LaTeX code continuation, no explanations.
```

---

## 🔒 Privacy & Security

This extension prioritizes your privacy:

| Aspect | Details |
|--------|---------|
| **Data Collection** | None. We do not collect, store, or transmit any user data. |
| **API Communication** | Direct browser-to-API communication only. No intermediary servers. |
| **API Key Storage** | Stored locally in `chrome.storage.local`, encrypted (obfuscated) with AES. |
| **Analytics** | None. No tracking, no cookies, no telemetry. |
| **Fallback Services** | None. The extension only works with your configured API. |

---

## 🐛 Troubleshooting

### Suggestions Not Appearing

1. **Check API Key**: Ensure your API key is correctly entered in Options
2. **Test Connection**: Use the "Test Connection" button in Options
3. **Check Content Length**: You need at least 50 characters before the cursor
4. **Check Position**: Cursor must be at end of line (after space) or on empty line
5. **Check Console**: Open DevTools (F12) → Console for error messages

### Too Many API Requests

The extension has built-in throttling (800ms debounce), but if you notice excessive requests:
1. Ensure you're using the latest version
2. Reload the extension in `chrome://extensions/`
3. Refresh the Overleaf page

### Suggestion Disappears Before I Can Accept

- Wait for the grey text to appear (indicates completion)
- Avoid typing while the `...` animation is showing
- Press Tab immediately when you see the suggestion

### "API Key Required" Error

The extension no longer supports fallback services. You must provide your own OpenAI API key or use a compatible provider.

---

## ❓ FAQ

<details>
<summary><strong>Does this work with GPT-4?</strong></summary>

Yes! Select `gpt-4`, `gpt-4-turbo`, or `gpt-4o` from the model dropdown in Options. Note that GPT-4 models are more expensive and may have different rate limits.
</details>

<details>
<summary><strong>Can I use a local LLM or self-hosted model?</strong></summary>

Yes, if your local model exposes an OpenAI-compatible API (like Ollama, LM Studio, or vLLM). Set the **API Base URL** to your local endpoint (e.g., `http://localhost:11434/v1`).
</details>

<details>
<summary><strong>Why does it need my API key?</strong></summary>

The extension communicates directly with OpenAI's API (or your configured provider). Your key never leaves your browser except to authenticate with the API.
</details>

<details>
<summary><strong>Does it work on ShareLaTeX or other LaTeX editors?</strong></summary>

Currently, it's designed specifically for Overleaf's CodeMirror 6 editor. Other editors may work but are not officially supported.
</details>

<details>
<summary><strong>How do I reduce API costs?</strong></summary>

- Use `gpt-3.5-turbo` instead of GPT-4 (much cheaper)
- Reduce **Max Output Tokens** to limit response length
- Disable suggestions when not needed
</details>

---

## 🛠️ Development

### Prerequisites

- Node.js 18+
- npm 9+

### Commands

```bash
# Install dependencies
npm install

# Development build (with watch mode)
npm run watch

# Production build
npm run build

# Create release zip
npm run pack

# Build + pack combined
npm run repack

# Format code
npm run format
```

### Project Structure

```
overleaf-copilot/
├── src/
│   ├── main/           # Main world content script (CodeMirror access)
│   ├── iso/            # Isolated world content script (API calls)
│   ├── common/         # Shared utilities (Suggestion class)
│   ├── components/     # Preact UI components
│   ├── utils/          # Helper functions
│   ├── background.ts   # Service worker
│   └── types.ts        # TypeScript interfaces
├── public/             # Static assets (manifest, icons)
├── config/             # Webpack configuration
└── build/              # Output directory (git-ignored)
```

### Architecture

The extension uses a **dual content script pattern**:

1. **Main World** (`contentMainScript.js`): Runs with page privileges to access Overleaf's CodeMirror editor instance
2. **Isolated World** (`contentIsoScript.js`): Runs in extension context for secure API calls

Communication between worlds happens via custom DOM events.

---

## 🤝 Contributing

Contributions are welcome! Here's how to get started:

1. **Fork** the repository
2. **Create a branch**: `git checkout -b feature/my-feature`
3. **Make your changes** and test thoroughly
4. **Run formatting**: `npm run format`
5. **Commit**: `git commit -m "Add my feature"`
6. **Push**: `git push origin feature/my-feature`
7. **Open a Pull Request**

### Areas for Contribution

- [ ] Add support for other LaTeX editors
- [ ] Improve suggestion quality with better prompts
- [ ] Add more toolbar actions
- [ ] Localization/translations
- [ ] Unit tests

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- Built with [Preact](https://preactjs.com/) for lightweight UI
- Bootstrapped with [Chrome Extension CLI](https://github.com/dutiyesh/chrome-extension-cli)
- Icons from [Lucide](https://lucide.dev/)
- Diff functionality powered by [jsdiff](https://github.com/kpdecker/jsdiff)

---

<p align="center">
  Made with ❤️ for the academic community
</p>
