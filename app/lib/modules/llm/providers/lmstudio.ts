import { BaseProvider } from '~/lib/modules/llm/base-provider';
import type { ModelInfo } from '~/lib/modules/llm/types';
import type { IProviderSetting } from '~/types/model';
import type { LanguageModelV1 } from 'ai';

export default class LMStudioProvider extends BaseProvider {
  name = 'LMStudio';
  getApiKeyLink = 'http://127.0.0.1:1234/settings/tokens';
  labelForGetApiKey = 'Get LMStudio';
  icon = 'i-ph:cloud-arrow-down';

  config = {
    apiTokenKey: 'LMSTUDIO_API_KEY',
  };

  staticModels: ModelInfo[] = [
    {
      name: 'Qwen/Qwen2.5-Coder-32B-Instruct',
      label: 'Qwen2.5-Coder-32B-Instruct (LMStudio)',
      provider: 'LMStudio',
      maxTokenAllowed: 8000,
    },
  ];

  async getDynamicModels(
    apiKeys?: Record<string, string>,
    settings?: IProviderSetting,
    serverEnv: Record<string, string> = {},
  ): Promise<ModelInfo[]> {
    try {
      const { baseUrl } = this.getProviderBaseUrlAndKey({
        apiKeys,
        providerSettings: settings,
        serverEnv,
        defaultBaseUrlKey: 'LMSTUDIO_API_BASE_URL',
        defaultApiTokenKey: '',
      });

      if (!baseUrl) {
        return [];
      }

      const response = await fetch(`${baseUrl}/v1/models`);
      const data = (await response.json()) as { data: Array<{ id: string }> };

      return data.data.map((model) => ({
        name: model.id,
        label: model.id,
        provider: this.name,
        maxTokenAllowed: 8000,
      }));
    } catch (error: any) {
      console.log('Error getting LMStudio models:', error.message);

      return [];
    }
  }

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
      defaultBaseUrlKey: 'LMSTUDIO_API_BASE_URL',
      defaultApiTokenKey: 'LMSTUDIO_API_KEY',
    });

    if (!apiKey) {
      throw new Error(`Missing API key for ${this.name} provider`);
    }

    // Utilisez une approche alternative pour créer une instance de modèle
    const lmstudio = {
      baseURL: 'http://127.0.0.1:1234/v1/',
      apiKey,
      headers: {
        'Access-Control-Allow-Origin': 'http://localhost:5173',
      },
      model,
    };

    return lmstudio as unknown as LanguageModelV1;
  }
}
