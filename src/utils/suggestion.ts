'use strict';

import OpenAI, { APIUserAbortError } from 'openai';
import {
  DEFAULT_SUGGESTION_MAX_OUTPUT_TOKEN,
  DEFAULT_MODEL,
} from '../constants';
import { postProcessToken, renderPrompt } from './helper';
import { Options, StreamChunk, TextContent } from '../types';


export async function* getSuggestion(content: TextContent, signal: AbortSignal, options: Options):
  AsyncGenerator<StreamChunk, void, unknown> {

  if (!options.apiKey) {
    yield {
      kind: "error",
      content: "Please set your OpenAI API key in the extension options."
    };
    return;
  } else {
    console.log('[Copilot Debug] Suggestion request:', {
      baseURL: options.apiBaseUrl,
      model: options.model,
      apiKeyPrefix: options.apiKey?.substring(0, 15) + '...',
    });

    const openai = new OpenAI({
      apiKey: options.apiKey,
      baseURL: options.apiBaseUrl,
      dangerouslyAllowBrowser: true,
    });

    try {
      const promptContent = buildSuggestionPrompt(content, options.suggestionPrompt);
      console.log('[Copilot Debug] Suggestion prompt (first 200 chars):', promptContent.substring(0, 200));

      const stream = await openai.chat.completions.create(
        {
          messages: [
            {
              role: 'user',
              content: promptContent,
            },
          ],
          model: options.model ?? DEFAULT_MODEL,
          max_tokens: options.suggestionMaxOutputToken ?? DEFAULT_SUGGESTION_MAX_OUTPUT_TOKEN,
          stream: true,
        },
        { signal: signal }
      );

      console.log('[Copilot Debug] Suggestion stream started successfully');

      let chunkCount = 0;
      for await (const chunk of stream) {
        chunkCount++;
        if (chunkCount <= 3) {
          console.log(`[Copilot Debug] Suggestion chunk ${chunkCount}:`, chunk.choices[0]?.delta?.content?.substring(0, 50) || '');
        }
        yield { kind: "token", content: chunk.choices[0]?.delta?.content || '' };
      }
      console.log(`[Copilot Debug] Suggestion stream completed with ${chunkCount} chunks`);
    } catch (error) {
      console.error('[Copilot Debug] Error in suggestion stream:', error);
      if (error instanceof APIUserAbortError) {
        console.log('[Copilot Debug] Suggestion request was aborted');
        return;
      }
      yield { kind: "error", content: "An error occurred while generating the content.\n" + error };
    }
  }
}

function buildSuggestionPrompt(content: TextContent, template: string | undefined) {
  if (!!template) {
    if (template.indexOf('<input>') >= 0)
      return template.replace('<input>', content.before.slice(-1000));

    return renderPrompt(template, content);
  }

  return (
    `Continue ${content.before.endsWith('\n') ? '' : 'the last paragraph of '}the academic paper in LaTeX below, ` +
    `making sure to maintain semantic continuity.\n\n` +
    `### Beginning of the paper ###\n` +
    `${content.before.slice(-1000)}\n` +
    `### End of the paper ###`
  );
}