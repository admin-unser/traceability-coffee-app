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

  async generateCultivationInsights(activities: any[]): Promise<{
    summary: string;
    trends: string[];
    warnings: string[];
    recommendations: string[];
  }> {
    const apiKey = getGeminiApiKey();
    if (!apiKey) {
      throw new Error('GEMINI_API_KEYが設定されていません。.envファイルに設定してください。');
    }

    const activityTypeLabels: Record<string, string> = {
      harvest: '収穫',
      fertilize: '施肥',
      prune: '剪定',
      process: '加工',
      observe: '観察',
      pestControl: '防除',
      mowing: '草刈り',
      planting: '植栽',
    };

    const formattedActivities = activities.slice(0, 30).map(a => ({
      日付: a.date,
      活動タイプ: activityTypeLabels[a.type] || a.type,
      説明: a.description,
      数値: a.numericValue ? `${a.numericValue}${a.numericUnit || ''}` : undefined,
      AI診断: a.aiDiagnosis?.advice,
    }));

    const prompt = `あなたは沖縄県のコーヒー栽培の専門家（アグロノミスト）です。以下の活動記録を分析し、栽培プロセス全体に関するインサイトを提供してください。

活動記録:
${JSON.stringify(formattedActivities, null, 2)}

以下の形式でJSON形式で回答してください（必ず有効なJSONで回答）:
{
  "summary": "全体的なサマリー（2-3文）",
  "trends": ["傾向1", "傾向2", "傾向3"],
  "warnings": ["注意点1", "注意点2"],
  "recommendations": ["推奨事項1", "推奨事項2", "推奨事項3"]
}

沖縄の気候（高温多湿、台風の影響など）を考慮し、具体的で実用的なインサイトを提供してください。`;

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
            maxOutputTokens: 2048,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Gemini API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
    try {
      // JSONをパース（コードブロックがある場合は除去）
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      throw new Error('JSONの解析に失敗しました');
    } catch (e) {
      // パースに失敗した場合はデフォルト形式で返す
      return {
        summary: text,
        trends: [],
        warnings: [],
        recommendations: [],
      };
    }
  },

  async generateBestPractices(activities: any[]): Promise<{
    fertilization: string;
    pruning: string;
    pestControl: string;
    general: string;
  }> {
    const apiKey = getGeminiApiKey();
    if (!apiKey) {
      throw new Error('GEMINI_API_KEYが設定されていません。.envファイルに設定してください。');
    }

    const activityTypeLabels: Record<string, string> = {
      harvest: '収穫',
      fertilize: '施肥',
      prune: '剪定',
      process: '加工',
      observe: '観察',
      pestControl: '防除',
      mowing: '草刈り',
      planting: '植栽',
    };

    // 活動の統計を計算
    const stats = activities.reduce((acc, a) => {
      acc[a.type] = (acc[a.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const formattedActivities = activities.slice(0, 20).map(a => ({
      日付: a.date,
      活動タイプ: activityTypeLabels[a.type] || a.type,
      説明: a.description,
    }));

    const prompt = `あなたは沖縄県のコーヒー栽培の専門家（アグロノミスト）です。以下の活動記録と統計を分析し、最適な栽培実践方法を提案してください。

活動統計:
${Object.entries(stats).map(([type, count]) => `- ${activityTypeLabels[type] || type}: ${count}回`).join('\n')}

最近の活動記録:
${JSON.stringify(formattedActivities, null, 2)}

以下の形式でJSON形式で回答してください（必ず有効なJSONで回答）:
{
  "fertilization": "施肥に関する具体的なアドバイス（時期、量、種類など）",
  "pruning": "剪定に関する具体的なアドバイス（時期、方法など）",
  "pestControl": "病害虫対策に関する具体的なアドバイス",
  "general": "その他の一般的な栽培のヒントや推奨事項"
}

沖縄の気候（高温多湿、台風の影響など）を考慮し、具体的で実用的なアドバイスを提供してください。各項目は2-4文程度で簡潔に。`;

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
            maxOutputTokens: 2048,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Gemini API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
    try {
      // JSONをパース（コードブロックがある場合は除去）
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      throw new Error('JSONの解析に失敗しました');
    } catch (e) {
      // パースに失敗した場合はデフォルト形式で返す
      return {
        fertilization: text,
        pruning: '剪定のアドバイスを取得できませんでした。',
        pestControl: '病害虫対策のアドバイスを取得できませんでした。',
        general: '',
      };
    }
  },
};

