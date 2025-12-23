import type { AIDiagnosis } from '../types';

const getGeminiApiKey = (): string => {
  return import.meta.env.VITE_GEMINI_API_KEY || '';
};

const getGeminiModel = (): string => {
  // v1beta APIで利用可能なモデル: gemini-pro, gemini-1.5-pro, gemini-1.5-flash-latest
  return import.meta.env.VITE_GEMINI_MODEL || 'gemini-1.5-pro';
};

const getGeminiApiUrl = (): string => {
  const model = getGeminiModel();
  // v1beta APIで利用可能なモデルを使用
  return `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
};

export const geminiService = {
  async diagnoseImage(imageBase64: string, description?: string): Promise<AIDiagnosis> {
    const apiKey = getGeminiApiKey();
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not set. Please set it in your .env file.');
    }

    try {
      const prompt = `あなたは沖縄県のコーヒー栽培の専門家（アグロノミスト）です。提供された画像を分析し、以下の点を評価してください：

1. 病気の有無と種類（さび病、炭疽病、葉枯れ病など）
2. 害虫の有無と種類
3. 実の熟度（未熟、適熟、過熟）
4. その他の異常や注意点

${description ? `観察者のメモ: ${description}` : ''}

沖縄の気候（高温多湿、台風の影響など）を考慮した具体的な対策を提案してください。
回答は日本語で、簡潔かつ実用的に記述してください。

回答形式:
- 病気: [検出された病気、なければ「なし」]
- 害虫: [検出された害虫、なければ「なし」]
- 熟度: [実の熟度評価]
- アドバイス: [具体的な対策と推奨事項]`;

      // Base64データの前処理
      let imageData = imageBase64;
      if (imageData.startsWith('data:')) {
        // data:image/jpeg;base64, の形式から base64 部分のみを抽出
        imageData = imageData.replace(/^data:image\/\w+;base64,/, '');
      }

      // 画像データの検証
      if (!imageData || imageData.length === 0) {
        throw new Error('画像データが無効です。');
      }

      const apiUrl = getGeminiApiUrl();
      const requestBody = {
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
              {
                inline_data: {
                  mime_type: 'image/jpeg',
                  data: imageData,
                },
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.4,
          topK: 32,
          topP: 1,
          maxOutputTokens: 1024,
        },
      };

      const response = await fetch(
        `${apiUrl}?key=${apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}: `;
        try {
          const errorData = await response.json();
          if (errorData.error) {
            errorMessage += errorData.error.message || JSON.stringify(errorData.error);
          } else {
            errorMessage += JSON.stringify(errorData);
          }
        } catch (e) {
          errorMessage += await response.text().catch(() => 'Unknown error');
        }
        throw new Error(`Gemini API error: ${errorMessage}`);
      }

      const data = await response.json();
      
      // レスポンスの検証
      if (!data.candidates || data.candidates.length === 0) {
        throw new Error('APIからの応答が空です。');
      }

      const candidate = data.candidates[0];
      if (!candidate.content || !candidate.content.parts || candidate.content.parts.length === 0) {
        throw new Error('APIからの応答形式が不正です。');
      }

      const text = candidate.content.parts[0].text || '';
      
      if (!text) {
        throw new Error('診断結果が空です。');
      }

      // テキストをパースして構造化
      return this.parseDiagnosis(text);
    } catch (error) {
      console.error('Gemini API error:', error);
      // エラーをそのまま再スロー（呼び出し元で処理）
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(`予期しないエラーが発生しました: ${String(error)}`);
    }
  },

  parseDiagnosis(text: string): AIDiagnosis {
    const lines = text.split('\n').map(l => l.trim()).filter(l => l);
    
    let disease: string | undefined;
    let pest: string | undefined;
    let ripeness: string | undefined;
    let advice = '';

    for (const line of lines) {
      if (line.includes('病気:') || line.includes('病気：')) {
        disease = line.split(/[:：]/)[1]?.trim();
      } else if (line.includes('害虫:') || line.includes('害虫：')) {
        pest = line.split(/[:：]/)[1]?.trim();
      } else if (line.includes('熟度:') || line.includes('熟度：')) {
        ripeness = line.split(/[:：]/)[1]?.trim();
      } else if (line.includes('アドバイス:') || line.includes('アドバイス：')) {
        advice = line.split(/[:：]/)[1]?.trim();
      } else if (line.length > 20 && !advice) {
        // アドバイスが見つからない場合、長い行をアドバイスとして扱う
        advice = line;
      }
    }

    // アドバイスが空の場合、全文をアドバイスとして使用
    if (!advice && text) {
      advice = text;
    }

    return {
      disease,
      pest,
      ripeness,
      advice: advice || '診断結果を取得できませんでした。',
    };
  },

  async generateWeeklySummary(activities: any[]): Promise<string> {
    const apiKey = getGeminiApiKey();
    if (!apiKey) {
      return 'GEMINI_API_KEYが設定されていません。';
    }

    try {
      const recentActivities = activities
        .filter(a => a.type === 'observe' || a.type === 'harvest')
        .slice(0, 10)
        .map(a => ({
          date: a.date,
          type: a.type,
          description: a.description,
          diagnosis: a.aiDiagnosis?.advice,
        }));

      const prompt = `あなたは沖縄県のコーヒー栽培の専門家です。以下の最近の活動記録を分析し、農園全体の傾向と次週のアクションプランを提案してください。

活動記録:
${JSON.stringify(recentActivities, null, 2)}

沖縄の気候を考慮し、具体的で実用的なアドバイスを日本語で提供してください。`;

      const apiUrl = getGeminiApiUrl();
      const response = await fetch(
        `${apiUrl}?key=${apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [{ text: prompt }],
              },
            ],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 1024,
            },
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status}`);
      }

      const data = await response.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text || 'サマリーを生成できませんでした。';
    } catch (error) {
      console.error('Failed to generate weekly summary:', error);
      return '週次サマリーの生成に失敗しました。';
    }
  },
};

