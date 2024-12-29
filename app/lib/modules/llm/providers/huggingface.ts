import axios from 'axios';
import { FormData } from 'formdata-node'; // Compatible avec ESM
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

  // Liste des modèles supportés
  staticModels: ModelInfo[] = [
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
      name: 'meta-llama/Llama-3.1-70B-Instruct',
      label: 'Llama-3.1-70B-Instruct (HuggingFace)',
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
      name: 'Salesforce/blip2-opt-2.7b',
      label: 'BLIP-2 (Texte + Image) (HuggingFace)',
      provider: 'HuggingFace',
      maxTokenAllowed: 5000,
    },
    {
      name: 'CompVis/stable-diffusion-v1-4',
      label: 'Stable Diffusion (Image Génération) (HuggingFace)',
      provider: 'HuggingFace',
      maxTokenAllowed: 0, // Pas applicable pour un modèle d’image
    },
  ];

  /**
   * Crée une instance d'un modèle sélectionné
   */
  getModelInstance(options: {
    model: string;
    serverEnv: Env;
    apiKeys?: Record<string, string>;
    providerSettings?: Record<string, IProviderSetting>;
  }): LanguageModelV1 {
    const { model, serverEnv, apiKeys, providerSettings } = options;

    // Vérifie si le modèle existe dans la liste des modèles statiques
    const modelInfo = this.staticModels.find((m) => m.name === model);
    if (!modelInfo) {
      throw new Error(`Modèle non supporté ou introuvable : ${model}`);
    }

    // Récupère la clé API
    const { apiKey } = this.getProviderBaseUrlAndKey({
      apiKeys,
      providerSettings: providerSettings?.[this.name],
      serverEnv: serverEnv as any,
      defaultBaseUrlKey: '',
      defaultApiTokenKey: 'HuggingFace_API_KEY',
    });

    if (!apiKey) {
      throw new Error(`Clé API manquante pour le fournisseur ${this.name}`);
    }

    // Crée une instance via le SDK OpenAI
    const openai = createOpenAI({
      baseURL: 'https://api-inference.huggingface.co/v1/',
      apiKey,
    });

    return openai(model);
  }

  /**
   * Génère une réponse à partir d’un modèle multimodal (texte + image)
   */
  async generateImageWithText(
    options: {
      model: string;
      prompt: string;
      imageFile?: Buffer;
    },
    apiKey: string,
  ): Promise<any> {
    const { model, prompt, imageFile } = options;

    if (!apiKey) {
      throw new Error('Clé API Hugging Face manquante.');
    }

    if (!model) {
      throw new Error('Le modèle Hugging Face n’a pas été spécifié.');
    }

    const formData = new FormData();
    formData.append('inputs', JSON.stringify({ text: prompt }));

    if (imageFile) {
      formData.append('image', imageFile, { filename: 'input.png' });
    }

    try {
      const response = await axios.post(`https://api-inference.huggingface.co/models/${model}`, formData, {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          ...formData.headers,
        },
      });

      if (response.status !== 200) {
        throw new Error(`Erreur de génération multimodale : ${response.status} - ${response.statusText}`);
      }

      return response.data;
    } catch (error: any) {
      console.error('Erreur lors de la requête vers Hugging Face :', error.message);
      throw new Error('Une erreur est survenue lors de l’appel à Hugging Face.');
    }
  }
}
