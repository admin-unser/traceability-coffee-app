import type { CoffeeLearningContent } from '../types/coffee';

const STORAGE_KEY = 'beanlog_coffee_learning';
const LAST_LEARNING_DATE_KEY = 'beanlog_last_learning_date';

// 学習コンテンツのデータベース
const LEARNING_CONTENTS: Omit<CoffeeLearningContent, 'id' | 'read' | 'createdAt'>[] = [
  {
    date: '2026-02-01',
    title: 'コーヒーの起源',
    content: 'コーヒーは9世紀頃、エチオピアの高原で発見されたと言われています。ヤギ飼いの少年が、コーヒーの実を食べたヤギが興奮しているのを発見したという伝説があります。',
    category: 'history',
  },
  {
    date: '2026-02-02',
    title: 'コーヒーの木の育て方',
    content: 'コーヒーの木は、標高1000-2000mの高地で、年間降水量1500-2000mm、平均気温15-24℃の環境が最適です。日陰を好むため、シェードツリー（日陰樹）を植えることが重要です。',
    category: 'cultivation',
  },
  {
    date: '2026-02-03',
    title: 'コーヒーの精製方法',
    content: 'コーヒーの精製方法には、水洗式（ウォッシュド）、非水洗式（ナチュラル）、半水洗式（セミウォッシュド）があります。それぞれ異なる味の特徴を持ちます。',
    category: 'processing',
  },
  {
    date: '2026-02-04',
    title: '抽出方法の種類',
    content: 'コーヒーの抽出方法には、ドリップ、エスプレッソ、フレンチプレス、エアロプレスなどがあります。それぞれ異なる味わいと特徴があります。',
    category: 'brewing',
  },
  {
    date: '2026-02-05',
    title: 'テイスティングの基本',
    content: 'コーヒーのテイスティングでは、香り、酸味、甘み、苦味、コクを評価します。スラリー（すする音）を立てて空気と一緒に味わうことで、より多くの風味を感じることができます。',
    category: 'tasting',
  },
];

export const coffeeLearningService = {
  getTodayContent(): CoffeeLearningContent | null {
    const today = new Date().toISOString().split('T')[0];
    const lastDate = localStorage.getItem(LAST_LEARNING_DATE_KEY);
    
    // 今日のコンテンツを取得
    const todayContent = LEARNING_CONTENTS.find(c => c.date === today);
    if (!todayContent) {
      // 今日のコンテンツがない場合、最後に読んだ日から次のコンテンツを取得
      const lastIndex = lastDate 
        ? LEARNING_CONTENTS.findIndex(c => c.date === lastDate)
        : -1;
      const nextIndex = lastIndex + 1;
      if (nextIndex < LEARNING_CONTENTS.length) {
        return {
          ...LEARNING_CONTENTS[nextIndex],
          id: `learning-${LEARNING_CONTENTS[nextIndex].date}`,
          read: false,
          createdAt: new Date().toISOString(),
        };
      }
      // すべて読み終わった場合、最初に戻る
      return {
        ...LEARNING_CONTENTS[0],
        id: `learning-${LEARNING_CONTENTS[0].date}`,
        read: false,
        createdAt: new Date().toISOString(),
      };
    }

    return {
      ...todayContent,
      id: `learning-${todayContent.date}`,
      read: this.isRead(`learning-${todayContent.date}`),
      createdAt: new Date().toISOString(),
    };
  },

  markAsRead(id: string): void {
    try {
      const readItems = this.getReadItems();
      if (!readItems.includes(id)) {
        readItems.push(id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(readItems));
        
        // 最後に読んだ日を更新
        const content = LEARNING_CONTENTS.find(c => `learning-${c.date}` === id);
        if (content) {
          localStorage.setItem(LAST_LEARNING_DATE_KEY, content.date);
        }
      }
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  },

  isRead(id: string): boolean {
    return this.getReadItems().includes(id);
  },

  getReadItems(): string[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Failed to load read items:', error);
      return [];
    }
  },

  getAllContents(): CoffeeLearningContent[] {
    return LEARNING_CONTENTS.map(content => ({
      ...content,
      id: `learning-${content.date}`,
      read: this.isRead(`learning-${content.date}`),
      createdAt: new Date(content.date).toISOString(),
    }));
  },
};
