import { BaseProvider } from '~/lib/modules/llm/base-provider';
import type { ModelInfo } from '~/lib/modules/llm/types';
import type { IProviderSetting } from '~/types/model';
import type { LanguageModelV1 } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';

export default class HuggingFaceProvider extends BaseProvider {
  name = 'HuggingFace';
  getApiKeyLink = 'https://huggingface.co/settings/tokens';

  config = {
    apiTokenKey: 'HuggingFace_API_KEY',
  };

  staticModels: ModelInfo[] = [
    // Code Models
    {
      name: 'Qwen/Qwen2.5-Coder-32B-Instruct',
      label: 'Qwen2.5-Coder-32B-Instruct (HuggingFace)',
      provider: 'HuggingFace',
      maxTokenAllowed: 8000,
    },
    {
      name: '01-ai/Yi-1.5-34B-Chat',
      label: 'Yi-1.5-34B-Chat (HuggingFace)',
      provider: 'HuggingFace',
      maxTokenAllowed: 8000,
    },
    {
      name: 'bigcode/starcoder2-15b-instruct-v0.1',
      label: 'Starcoder2-15B-Instruct-v0.1 (HuggingFace)',
      provider: 'HuggingFace',
      maxTokenAllowed: 8000,
    },
    {
      name: 'Qwen/QVQ-72B-Preview',
      label: 'QVQ-72B-Preview (HuggingFace)',
      provider: 'HuggingFace',
      maxTokenAllowed: 8000,
    },
    {
      name: 'distributed/optimized-gpt2-2b',
      label: 'Optimized-GPT2-2B (HuggingFace)',
      provider: 'HuggingFace',
      maxTokenAllowed: 8000,
    },

    // Instruction Models
    {
      name: 'meta-llama/Llama-3.1-70B-Instruct',
      label: 'Llama-3.1-70B-Instruct (HuggingFace)',
      provider: 'HuggingFace',
      maxTokenAllowed: 8000,
    },
    {
      name: 'meta-llama/Llama-3.1-405B',
      label: 'Llama-3.1-405B (HuggingFace)',
      provider: 'HuggingFace',
      maxTokenAllowed: 8000,
    },
    {
      name: 'meta-llama/Llama-3.3-70B-Instruct',
      label: 'Llama-3.3-70B-Instruct (HuggingFace)',
      provider: 'HuggingFace',
      maxTokenAllowed: 8000,
    },
    {
      name: 'abacusai/Smaug-Qwen2-72B-Instruct',
      label: 'Smaug-Qwen2-72B-Instruct (HuggingFace)',
      provider: 'HuggingFace',
      maxTokenAllowed: 8000,
    },
    {
      name: 'Qwen/Qwen2-VL-7B-Instruct',
      label: 'Qwen2-VL-7B-Instruct (HuggingFace)',
      provider: 'HuggingFace',
      maxTokenAllowed: 8000,
    },
    {
      name: 'Qwen/Qwen2-Audio-7B-Instruct',
      label: 'Qwen2-Audio-7B-Instruct (HuggingFace)',
      provider: 'HuggingFace',
      maxTokenAllowed: 8000,
    },

    // Multimodal Models
    {
      name: 'multimodal/gpt-4-vision',
      label: 'GPT-4 Vision (HuggingFace)',
      provider: 'HuggingFace',
      maxTokenAllowed: 8000,
    },
    {
      name: 'reaction/gpt-4-reaction',
      label: 'GPT-4 Reaction (HuggingFace)',
      provider: 'HuggingFace',
      maxTokenAllowed: 8000,
    },
    {
      name: 'vision/gpt-4-vision',
      label: 'GPT-4 Vision (HuggingFace)',
      provider: 'HuggingFace',
      maxTokenAllowed: 8000,
    },
    {
      name: 'stable-diffusion-v1-5/stable-diffusion-v1-5',
      label: 'Stable-Diffusion-v1-5 (HuggingFace)',
      provider: 'HuggingFace',
      maxTokenAllowed: 8000,
    },
    {
      name: 'stabilityai/stable-video-diffusion-img2vid-xt',
      label: 'Stable-Video-Diffusion-Img2Vid-XT (HuggingFace)',
      provider: 'HuggingFace',
      maxTokenAllowed: 8000,
    },
    {
      name: 'ByteDance/AnimateDiff-Lightning',
      label: 'AnimateDiff-Lightning (HuggingFace)',
      provider: 'HuggingFace',
      maxTokenAllowed: 8000,
    },

    // QA Models
    {
      name: 'deepset/roberta-base-squad2',
      label: 'Roberta-Base-Squad2 (HuggingFace)',
      provider: 'HuggingFace',
      maxTokenAllowed: 8000,
    },
  ];

  getModelInstance(options: {
    model: string;
    serverEnv: Env;
    apiKeys?: Record<string, string>;
    providerSettings?: Record<string, IProviderSetting>;
  }): LanguageModelV1 {
    const { model, serverEnv, apiKeys, providerSettings } = options;

    const { apiKey } = this.getProviderBaseUrlAndKey({
      apiKeys,
      providerSettings: providerSettings?.[this.name],
      serverEnv: serverEnv as any,
      defaultBaseUrlKey: '',
      defaultApiTokenKey: 'HuggingFace_API_KEY',
    });

    if (!apiKey) {
      throw new Error(`Missing API key for ${this.name} provider`);
    }

    const openai = createOpenAI({
      baseURL: 'https://api-inference.huggingface.co/models/',
      apiKey,
    });

    return openai(model);
  }
}
