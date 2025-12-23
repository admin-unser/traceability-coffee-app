import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, RefreshCw, Newspaper, AlertCircle } from 'lucide-react';
import { StaggerContainer, StaggerItem, IconButton } from './AnimatedComponents';

interface NewsItem {
  title: string;
  link: string;
  snippet: string;
  date?: string;
  source?: string;
}

// 検索キーワード（固定）
const SEARCH_KEYWORDS = [
  'コーヒー 栽培',
  '沖縄 コーヒー',
  'コーヒー農園',
];

// Google News RSSフィードからニュースを取得
async function fetchGoogleNews(keyword: string): Promise<NewsItem[]> {
  try {
    // Google News RSS URL
    const rssUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(keyword)}&hl=ja&gl=JP&ceid=JP:ja`;
    
    // CORSプロキシを使用
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(rssUrl)}`;
    
    const response = await fetch(proxyUrl);
    if (!response.ok) {
      throw new Error('Failed to fetch news');
    }
    
    const data = await response.json();
    const xmlText = data.contents;
    
    // XMLをパース
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
    
    const items = xmlDoc.querySelectorAll('item');
    const newsItems: NewsItem[] = [];
    
    items.forEach((item, index) => {
      if (index >= 5) return; // 最大5件
      
      const title = item.querySelector('title')?.textContent || '';
      const link = item.querySelector('link')?.textContent || '';
      const pubDate = item.querySelector('pubDate')?.textContent || '';
      const description = item.querySelector('description')?.textContent || '';
      
      // HTMLタグを除去してスニペットを生成
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = description;
      const snippet = tempDiv.textContent?.trim() || '';
      
      // ソース名を抽出（タイトルから）
      const sourceMatch = title.match(/ - ([^-]+)$/);
      const source = sourceMatch ? sourceMatch[1].trim() : '';
      const cleanTitle = sourceMatch ? title.replace(/ - [^-]+$/, '').trim() : title;
      
      newsItems.push({
        title: cleanTitle,
        link,
        snippet: snippet.slice(0, 150) + (snippet.length > 150 ? '...' : ''),
        date: pubDate ? new Date(pubDate).toISOString() : undefined,
        source,
      });
    });
    
    return newsItems;
  } catch (error) {
    console.error(`Failed to fetch news for "${keyword}":`, error);
    return [];
  }
}

export function CoffeeNews() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchNews = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // 各キーワードでニュースを取得
      const allNewsPromises = SEARCH_KEYWORDS.map(keyword => fetchGoogleNews(keyword));
      const allNewsResults = await Promise.all(allNewsPromises);
      
      // 結果を統合し、重複を除去
      const allNews = allNewsResults.flat();
      const uniqueNews = allNews.reduce((acc: NewsItem[], item) => {
        const isDuplicate = acc.some(
          existing => existing.title === item.title || existing.link === item.link
        );
        if (!isDuplicate) {
          acc.push(item);
        }
        return acc;
      }, []);
      
      // 日付でソート（新しい順）
      uniqueNews.sort((a, b) => {
        if (!a.date || !b.date) return 0;
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });
      
      // 最大10件に制限
      setNews(uniqueNews.slice(0, 10));
      setLastUpdated(new Date());
      
      if (uniqueNews.length === 0) {
        setError('ニュースが見つかりませんでした');
      }
    } catch (err) {
      console.error('Failed to fetch news:', err);
      setError('ニュースの取得に失敗しました。しばらく経ってから再試行してください。');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (hours < 1) return '1時間以内';
    if (hours < 24) return `${hours}時間前`;
    if (days < 7) return `${days}日前`;
    return date.toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="card-natural p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-sand-400/20 flex items-center justify-center">
            <Newspaper className="w-5 h-5 text-sand-600" />
          </div>
          <div>
            <h3 className="text-base font-bold text-text-primary">コーヒー最新ニュース</h3>
            <p className="text-sm text-text-secondary">
              {lastUpdated 
                ? `最終更新: ${lastUpdated.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })}`
                : '業界の最新情報'
              }
            </p>
          </div>
        </div>
        <IconButton
          onClick={fetchNews}
          className={loading ? 'animate-spin' : ''}
        >
          <RefreshCw className="w-5 h-5" />
        </IconButton>
      </div>

      {loading && news.length === 0 ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-base-cream rounded w-3/4 mb-2" />
              <div className="h-3 bg-base-cream/70 rounded w-full mb-1" />
              <div className="h-3 bg-base-cream/70 rounded w-2/3" />
            </div>
          ))}
        </div>
      ) : error && news.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-8"
        >
          <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-red-50 flex items-center justify-center">
            <AlertCircle className="w-6 h-6 text-coffee-red" />
          </div>
          <p className="text-coffee-red text-sm">{error}</p>
          <button 
            onClick={fetchNews}
            className="mt-3 text-sm text-terracotta-500 hover:text-terracotta-600 font-medium"
          >
            再試行
          </button>
        </motion.div>
      ) : news.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-8"
        >
          <p className="text-text-secondary">ニュースがありません</p>
        </motion.div>
      ) : (
        <StaggerContainer className="space-y-3">
          {news.map((item, index) => (
            <StaggerItem key={index}>
              <motion.a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ x: 4, backgroundColor: 'rgba(194, 112, 62, 0.05)' }}
                className="block p-3 rounded-xl border border-gray-100 hover:border-terracotta-200 transition-all group"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-text-primary mb-1.5 line-clamp-2 group-hover:text-terracotta-500 transition-colors">
                      {item.title}
                    </h4>
                    {item.snippet && (
                      <p className="text-sm text-text-secondary line-clamp-2 leading-relaxed">
                        {item.snippet}
                      </p>
                    )}
                    <div className="flex items-center gap-2 mt-2">
                      {item.date && (
                        <span className="text-xs text-text-muted font-data">
                          {formatDate(item.date)}
                        </span>
                      )}
                      {item.source && (
                        <>
                          <span className="text-xs text-text-muted">•</span>
                          <span className="text-xs text-text-muted">{item.source}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-text-muted group-hover:text-terracotta-500 transition-colors flex-shrink-0 mt-1" />
                </div>
              </motion.a>
            </StaggerItem>
          ))}
        </StaggerContainer>
      )}
      
      {/* キーワード表示 */}
      <div className="mt-4 pt-3 border-t border-gray-100">
        <p className="text-xs text-text-muted">
          検索キーワード: {SEARCH_KEYWORDS.join('、')}
        </p>
      </div>
    </div>
  );
}
