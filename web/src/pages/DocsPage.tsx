import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";

const endpoints = [
  {
    method: "POST", path: "/v1/chat/completions", description: "Create a chat completion",
    body: `{
  "model": "gpt-4",
  "messages": [
    {"role": "user", "content": "Hello!"}
  ],
  "max_tokens": 1024
}`,
    response: `{
  "id": "chatcmpl-abc123",
  "object": "chat.completion",
  "model": "gpt-4",
  "choices": [{
    "message": {"role": "assistant", "content": "Hi there!"},
    "finish_reason": "stop"
  }]
}`,
  },
  {
    method: "GET", path: "/v1/models", description: "List available models",
    response: `{
  "object": "list",
  "data": [
    {"id": "gpt-4", "object": "model"},
    {"id": "gpt-3.5-turbo", "object": "model"}
  ]
}`,
  },
];

const examples = {
  curl: `curl https://api.yourplatform.com/v1/chat/completions \\
  -H "Authorization: Bearer sk-..." \\
  -H "Content-Type: application/json" \\
  -d '{"model":"gpt-4","messages":[{"role":"user","content":"Hello!"}]}'`,
  python: `import openai

client = openai.OpenAI(
    api_key="sk-...",
    base_url="https://api.yourplatform.com/v1"
)

response = client.chat.completions.create(
    model="gpt-4",
    messages=[{"role": "user", "content": "Hello!"}]
)
print(response.choices[0].message.content)`,
  node: `import OpenAI from "openai";

const client = new OpenAI({
  apiKey: "sk-...",
  baseURL: "https://api.yourplatform.com/v1",
});

const response = await client.chat.completions.create({
  model: "gpt-4",
  messages: [{ role: "user", content: "Hello!" }],
});
console.log(response.choices[0].message.content);`,
};

export default function DocsPage() {
  const [lang, setLang] = useState<keyof typeof examples>("curl");

  const methodColor = (m: string) => m === "GET" ? "success" : m === "POST" ? "default" : "warning";

  return (
    <div className="space-y-6 max-w-3xl">
      <h1 className="text-2xl font-bold">API Documentation</h1>
      <Card>
        <CardHeader><CardTitle>Quick Start</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">This API is fully compatible with the OpenAI API. Use your existing OpenAI SDK by changing the base URL.</p>
          <div className="flex gap-2">
            {(Object.keys(examples) as (keyof typeof examples)[]).map((l) => (
              <button key={l} onClick={() => setLang(l)} className={`px-3 py-1 rounded text-xs font-medium transition-colors ${lang === l ? "bg-brand text-white" : "bg-secondary text-muted-foreground"}`}>
                {l}
              </button>
            ))}
          </div>
          <pre className="bg-secondary rounded-md p-4 text-xs overflow-x-auto text-foreground">{examples[lang]}</pre>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Endpoints</CardTitle></CardHeader>
        <CardContent className="divide-y divide-border">
          {endpoints.map((ep) => (
            <div key={ep.path} className="py-4 space-y-3">
              <div className="flex items-center gap-3">
                <Badge variant={methodColor(ep.method) as any}>{ep.method}</Badge>
                <code className="text-sm font-mono">{ep.path}</code>
              </div>
              <p className="text-sm text-muted-foreground">{ep.description}</p>
              {ep.body && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">Request Body</p>
                  <pre className="bg-secondary rounded p-3 text-xs overflow-x-auto">{ep.body}</pre>
                </div>
              )}
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1">Response</p>
                <pre className="bg-secondary rounded p-3 text-xs overflow-x-auto">{ep.response}</pre>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
