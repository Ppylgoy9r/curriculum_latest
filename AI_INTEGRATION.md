# AI Integration

The AI analysis code is in:

```text
backend/curriculum_analyzer/ai_analyzer.py
```

## Current Local Setup

By default, the backend uses local Ollama:

```text
AI_PROVIDER=ollama
OLLAMA_API_URL=http://127.0.0.1:11434/api/chat
OLLAMA_MODEL=qwen2.5:3b
```

Make sure Ollama is running and the model exists:

```bash
ollama pull qwen2.5:3b
ollama serve
```

## Organization API Setup

If your organization gives you an OpenAI-compatible chat-completions API key, run Django with these environment variables:

```bash
export AI_PROVIDER=organization
export ORG_AI_API_URL="https://your-organization-api.example.com/v1/chat/completions"
export ORG_AI_API_KEY="your-api-key"
export ORG_AI_MODEL="your-model-name"

.venv/bin/python backend/manage.py runserver 127.0.0.1:8000
```

If your organization API is not OpenAI-compatible, update the `call_organization_ai()` function in:

```text
backend/curriculum_analyzer/ai_analyzer.py
```

Keep the return value as the model's text response containing a JSON object. The backend will parse and normalize that JSON into the report format used by the frontend.
