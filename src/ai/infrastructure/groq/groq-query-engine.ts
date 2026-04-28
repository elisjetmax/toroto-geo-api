import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Groq from 'groq-sdk';
import { Intent } from '../../domain/intent';
import { SYSTEM_PROMPT } from './system.prompt';

@Injectable()
export class GroqQueryEngine {
  private readonly groqClient: Groq;
  private readonly groqModel: string;
  private readonly groqModelContentMessage: string;
  private readonly conversationHistory: Map<
    string,
    Array<{ role: 'user' | 'assistant' | 'system'; content: string }>
  > = new Map();

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.getOrThrow<string>('GROQ_API_KEY');
    this.groqModel = this.configService.getOrThrow<string>('GROQ_MODEL');
    this.groqModelContentMessage = this.configService.getOrThrow<string>(
      'GROQ_MODEL_NATURAL_LANGUAGE_MESSAGE',
    );
    this.groqClient = new Groq({ apiKey });
  }

  async extractIntent(
    userQuestion: string,
    sessionId?: string,
  ): Promise<Intent> {
    const history = sessionId
      ? (this.conversationHistory.get(sessionId) ?? [])
      : [];

    const completion = await this.groqClient.chat.completions.create({
      model: this.groqModel,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...history,
        { role: 'user', content: `Pregunta: ${userQuestion}` },
      ],
      temperature: 0.0,
      max_tokens: 150,
    });

    let response = completion.choices[0].message.content?.trim() ?? '';
    if (response.startsWith('```')) {
      response = response.split('```')[1] || '';
      if (response.startsWith('json')) response = response.slice(4).trim();
    }
    return JSON.parse(response) as Intent;
  }

  async generateNaturalLanguageResponse(
    question: string,
    queryType: string,
    data: unknown,
    sessionId?: string,
  ): Promise<string> {
    const history = sessionId
      ? (this.conversationHistory.get(sessionId) ?? [])
      : [];

    const messages: Array<{
      role: 'system' | 'user' | 'assistant';
      content: string;
    }> = [
      { role: 'system', content: this.groqModelContentMessage },
      ...history,
      {
        role: 'user',
        content: `Pregunta: ${question}\n\nResultados (${queryType}):\n${JSON.stringify(data)}`,
      },
    ];

    const completion = await this.groqClient.chat.completions.create({
      model: this.groqModel,
      messages,
      temperature: 0.3,
      max_tokens: 512,
    });

    const answer = completion.choices[0].message.content ?? 'Sin respuesta';

    if (sessionId) {
      history.push({ role: 'user', content: question });
      history.push({ role: 'assistant', content: answer });
      history.splice(0, history.length - 5);
      this.conversationHistory.set(sessionId, history);
    }

    return answer;
  }
}
