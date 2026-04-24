import type { SNSPost, SNSPlatform, DiaryEntry } from '../types';

const getGeminiApiKey = (): string => {
  return import.meta.env.VITE_GEMINI_API_KEY || '';
};

const getGeminiModel = (): string => {
  return import.meta.env.VITE_GEMINI_MODEL || 'gemini-2.0-flash';
};

const getGeminiApiUrl = (): string => {
  const model = getGeminiModel();
  return `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
};

const getImagenApiUrl = (): string => {
  return `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict`;
};

const ACTIVITY_LABELS: Record<string, string> = {
  harvest: '収穫',
  fertilize: '施肥',
  prune: '剪定',
  process: '加工',
  observe: '観察',
  pestControl: '防除',
  mowing: '草刈り',
  planting: '植栽',
};

const DEFAULT_HASHTAGS = [
  '#大宜味村コーヒー',
  '#沖縄コーヒー',
  '#無農薬栽培',
  '#コーヒー農園',
  '#OkinawaCoffee',
  '#CoffeeFarm',
  '#BeanLog',
];

const PLATFORM_INSTRUCTIONS: Record<SNSPlatform, string> = {
  instagram: `Instagramの投稿向けに書いてください。
- 絵文字を適度に使う
- ストーリー性を持たせ、ファンが応援したくなるような内容
- 3-5行程度
- 最後にハッシュタグを別行にまとめる
- コーヒーの最新トレンドや豆知識を1つ自然に盛り込む`,
  x: `X（Twitter）の投稿向けに書いてください。
- 280文字以内に収める
- 短く印象的な文章
- ハッシュタグは2-3個まで
- 絵文字は控えめに
- コーヒーに関する豆知識やトレンドを一言添える`,
  note: `noteの記事向けに書いてください。
- 少し長めの文章（5-8行）
- 丁寧な語り口
- 栽培の学びや気づきを含める
- 読者に語りかけるように
- コーヒー業界の最新動向や栽培知識を自然に織り交ぜる`,
};

/** 活動タイプの配列をラベル文字列に変換 */
function getActivityLabels(entry: DiaryEntry): string {
  const types = entry.activityTypes ?? [entry.activityType];
  return types.map(t => ACTIVITY_LABELS[t] || t).join('・');
}

export const snsService = {
  /** SNS投稿文を生成（コーヒーニュース・トレンド込み） */
  async generatePost(entry: DiaryEntry, platform: SNSPlatform): Promise<SNSPost> {
    const apiKey = getGeminiApiKey();
    if (!apiKey) {
      return this.generateFallbackPost(entry, platform);
    }

    try {
      const activityLabels = getActivityLabels(entry);
      const prompt = `あなたは沖縄県大宜味村でコーヒー農園「ogimi.blue coffee farm」を営む農家です。
日々の農作業をSNSで発信してファンを獲得しています。

以下の作業日誌をもとに、魅力的なSNS投稿文を生成してください。

${PLATFORM_INSTRUCTIONS[platform]}

【重要な追加要素】
- コーヒーに関する最新のトレンド、豆知識、業界ニュースを1つ自然に盛り込んでください
  例: スペシャルティコーヒーの動向、サステナブル栽培、フェアトレード、
      コーヒーの健康効果、日本産コーヒーの注目度、沖縄コーヒーの特徴など
- 読者がフォローしたくなるような、親近感と専門性のバランスを取ってください
- 農園の成長ストーリーとして連続性を持たせてください

【作業日誌】
- 日付: ${entry.date}
- 活動タイプ: ${activityLabels}
- タイトル: ${entry.title}
- 内容: ${entry.description}

投稿文のみを出力してください。ハッシュタグも含めてください。
以下のハッシュタグを必ず含めてください: #大宜味村コーヒー #沖縄コーヒー #ogimiblue`;

      const apiUrl = getGeminiApiUrl();
      const response = await fetch(`${apiUrl}?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.85,
            maxOutputTokens: 1024,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status}`);
      }

      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

      if (!text) {
        return this.generateFallbackPost(entry, platform);
      }

      // ハッシュタグを抽出
      const hashtagRegex = /#[\w\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF]+/g;
      const foundHashtags = text.match(hashtagRegex) || [];
      const hashtags = Array.from(new Set([...foundHashtags, '#ogimiblue']));

      return {
        text,
        hashtags,
        platform,
        generatedAt: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Failed to generate SNS post:', error);
      return this.generateFallbackPost(entry, platform);
    }
  },

  /** AI画像を生成（Imagen 3） */
  async generateImage(entry: DiaryEntry): Promise<string | null> {
    const apiKey = getGeminiApiKey();
    if (!apiKey) return null;

    try {
      const activityLabels = getActivityLabels(entry);

      // Geminiで画像生成プロンプトを作成
      const promptGenUrl = getGeminiApiUrl();
      const promptRes = await fetch(`${promptGenUrl}?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Generate a short English image prompt (1-2 sentences) for an Instagram-worthy photo of a coffee farm scene.
Context: A ${activityLabels} activity at a coffee farm in Ogimi village, Okinawa, Japan. ${entry.title}. ${entry.description.slice(0, 100)}.
Style: Beautiful, warm, natural photography style. Lush green coffee plants, subtropical setting.
Output ONLY the image prompt, nothing else.`
            }]
          }],
          generationConfig: { temperature: 0.9, maxOutputTokens: 128 },
        }),
      });

      if (!promptRes.ok) return null;

      const promptData = await promptRes.json();
      const imagePrompt = promptData.candidates?.[0]?.content?.parts?.[0]?.text || '';
      if (!imagePrompt) return null;

      // Imagen 3で画像生成
      const imagenUrl = getImagenApiUrl();
      const imagenRes = await fetch(`${imagenUrl}?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          instances: [{ prompt: imagePrompt }],
          parameters: {
            sampleCount: 1,
            aspectRatio: '1:1',
            safetyFilterLevel: 'block_few',
          },
        }),
      });

      if (!imagenRes.ok) {
        console.warn('Imagen API not available, skipping image generation');
        return null;
      }

      const imagenData = await imagenRes.json();
      const imageBytes = imagenData.predictions?.[0]?.bytesBase64Encoded;
      if (!imageBytes) return null;

      return `data:image/png;base64,${imageBytes}`;
    } catch (error) {
      console.error('Failed to generate image:', error);
      return null;
    }
  },

  /** Web Share APIでシェア */
  async sharePost(post: SNSPost, imageUrl?: string | null): Promise<boolean> {
    if (!navigator.share) {
      return false;
    }

    try {
      const shareData: ShareData = {
        title: 'ogimi.blue coffee farm',
        text: post.text,
      };

      // 画像がある場合はファイルとしてシェア
      if (imageUrl && navigator.canShare) {
        try {
          const response = await fetch(imageUrl);
          const blob = await response.blob();
          const file = new File([blob], 'coffee-farm.png', { type: 'image/png' });
          const withFile = { ...shareData, files: [file] };
          if (navigator.canShare(withFile)) {
            await navigator.share(withFile);
            return true;
          }
        } catch {
          // ファイルシェアに失敗した場合はテキストのみ
        }
      }

      await navigator.share(shareData);
      return true;
    } catch (error) {
      if ((error as Error).name !== 'AbortError') {
        console.error('Share failed:', error);
      }
      return false;
    }
  },

  /** X (Twitter) APIで投稿 */
  async postToX(post: SNSPost): Promise<{ success: boolean; tweetUrl?: string; error?: string }> {
    const bearerToken = import.meta.env.VITE_X_BEARER_TOKEN || '';
    const apiKey = import.meta.env.VITE_X_API_KEY || '';
    const apiSecret = import.meta.env.VITE_X_API_SECRET || '';
    const accessToken = import.meta.env.VITE_X_ACCESS_TOKEN || '';
    const accessTokenSecret = import.meta.env.VITE_X_ACCESS_TOKEN_SECRET || '';

    if (!accessToken || !apiKey) {
      return {
        success: false,
        error: 'X API認証情報が設定されていません。.envファイルにVITE_X_API_KEY等を設定してください。',
      };
    }

    try {
      // ブラウザからは直接X API v2を叩けない（CORS制約）ので、
      // Supabase Edge Function等のバックエンドを経由する必要がある
      const proxyUrl = import.meta.env.VITE_X_POST_PROXY_URL;

      if (!proxyUrl) {
        // プロキシURLがない場合はIntentリンクを開く
        const tweetText = encodeURIComponent(post.text);
        window.open(`https://twitter.com/intent/tweet?text=${tweetText}`, '_blank');
        return { success: true };
      }

      const response = await fetch(proxyUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${bearerToken}`,
        },
        body: JSON.stringify({
          text: post.text,
          apiKey,
          apiSecret,
          accessToken,
          accessTokenSecret,
        }),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error || `X API error: ${response.status}`);
      }

      const result = await response.json();
      return {
        success: true,
        tweetUrl: result.data?.id ? `https://x.com/i/web/status/${result.data.id}` : undefined,
      };
    } catch (error) {
      console.error('X post failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'X投稿に失敗しました',
      };
    }
  },

  generateFallbackPost(entry: DiaryEntry, platform: SNSPlatform): SNSPost {
    const activityLabels = getActivityLabels(entry);
    const date = new Date(entry.date);
    const monthDay = `${date.getMonth() + 1}/${date.getDate()}`;

    // コーヒー豆知識のローテーション
    const coffeeTrivia = [
      '☕ 沖縄は日本で唯一のコーヒー栽培適地。亜熱帯気候がアラビカ種に最適です',
      '🌏 世界のコーヒー消費量は年々増加中。特にスペシャルティコーヒーの需要が伸びています',
      '🇯🇵 国産コーヒーは希少価値が高く、海外のバイヤーからも注目されています',
      '🌱 無農薬栽培のコーヒーは、土壌の微生物と共生し独特の風味を生みます',
      '💚 サステナブルなコーヒー栽培が世界的なトレンドに。環境に優しい農法が評価されています',
    ];
    const trivia = coffeeTrivia[Math.floor(Math.random() * coffeeTrivia.length)];

    let text = '';
    if (platform === 'x') {
      text = `${monthDay} ${activityLabels}の記録☕\n${entry.title}\n${entry.description.slice(0, 80)}\n\n${trivia}\n\n#大宜味村コーヒー #沖縄コーヒー #ogimiblue`;
    } else if (platform === 'instagram') {
      text = `☕ ${monthDay} 今日の農園から\n\n${entry.title}\n\n${entry.description}\n\n${trivia}\n\n#大宜味村コーヒー #沖縄コーヒー #無農薬栽培 #コーヒー農園 #ogimiblue #OkinawaCoffee #スペシャルティコーヒー`;
    } else {
      text = `【${monthDay} ${activityLabels}の記録】\n\n${entry.title}\n\n${entry.description}\n\n${trivia}\n\n大宜味村のコーヒー農園「ogimi.blue coffee farm」より。\n\n#大宜味村コーヒー #沖縄コーヒー #無農薬栽培 #ogimiblue`;
    }

    return {
      text,
      hashtags: ['#大宜味村コーヒー', '#沖縄コーヒー', '#ogimiblue', ...DEFAULT_HASHTAGS.slice(2, platform === 'x' ? 3 : 6)],
      platform,
      generatedAt: new Date().toISOString(),
    };
  },
};
