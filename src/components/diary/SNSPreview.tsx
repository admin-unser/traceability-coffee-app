import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Copy, Check, Loader2, Share2, Send, Image as ImageIcon } from 'lucide-react';
import { snsService } from '../../services/sns';
import type { DiaryEntry, SNSPlatform, SNSPost } from '../../types';

interface SNSPreviewProps {
  entry: DiaryEntry;
  onPostGenerated: (post: SNSPost) => void;
}

const platformTabs: { id: SNSPlatform; label: string; color: string }[] = [
  { id: 'instagram', label: 'Instagram', color: 'bg-gradient-to-r from-purple-500 to-pink-500' },
  { id: 'x', label: 'X', color: 'bg-black' },
  { id: 'note', label: 'note', color: 'bg-green-600' },
];

export function SNSPreview({ entry, onPostGenerated }: SNSPreviewProps) {
  const [platform, setPlatform] = useState<SNSPlatform>('instagram');
  const [post, setPost] = useState<SNSPost | null>(entry.snsPost || null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(entry.snsPost?.generatedImageUrl || null);
  const [copied, setCopied] = useState(false);
  const [shareMessage, setShareMessage] = useState('');

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const generated = await snsService.generatePost(entry, platform);
      setPost(generated);
      onPostGenerated(generated);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateImage = async () => {
    setIsGeneratingImage(true);
    try {
      const imageUrl = await snsService.generateImage(entry);
      if (imageUrl) {
        setGeneratedImageUrl(imageUrl);
        if (post) {
          const updated = { ...post, generatedImageUrl: imageUrl };
          setPost(updated);
          onPostGenerated(updated);
        }
      } else {
        setShareMessage('画像生成に対応していないか、APIキーが未設定です');
        setTimeout(() => setShareMessage(''), 3000);
      }
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleCopy = async () => {
    if (!post) return;
    try {
      await navigator.clipboard.writeText(post.text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = post.text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShare = async () => {
    if (!post) return;
    const success = await snsService.sharePost(post, generatedImageUrl);
    if (!success) {
      // Web Share API非対応 → コピーにフォールバック
      await handleCopy();
      setShareMessage('クリップボードにコピーしました');
      setTimeout(() => setShareMessage(''), 2000);
    }
  };

  const handlePostToX = async () => {
    if (!post) return;
    setShareMessage('Xに投稿中...');
    const result = await snsService.postToX(post);
    if (result.success) {
      setShareMessage('Xに投稿しました！');
    } else {
      setShareMessage(result.error || 'X投稿に失敗しました');
    }
    setTimeout(() => setShareMessage(''), 3000);
  };

  return (
    <div className="bg-white rounded-2xl p-4 shadow-soft space-y-3">
      <div className="flex items-center gap-2">
        <Sparkles size={16} className="text-purple-500" />
        <h4 className="text-sm font-semibold text-text-primary">SNS投稿を生成</h4>
      </div>

      {/* Platform tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
        {platformTabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => {
              setPlatform(tab.id);
              setPost(null);
              setGeneratedImageUrl(null);
            }}
            className={`flex-1 py-2 rounded-lg text-xs font-medium transition-colors ${
              platform === tab.id
                ? 'bg-white text-text-primary shadow-sm'
                : 'text-text-secondary'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Generate buttons */}
      <div className="flex gap-2">
        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="flex-1 py-3 bg-purple-600 text-white rounded-xl font-medium text-sm hover:bg-purple-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isGenerating ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              生成中...
            </>
          ) : (
            <>
              <Sparkles size={16} />
              投稿文を生成
            </>
          )}
        </button>

        {post && (
          <button
            onClick={handleGenerateImage}
            disabled={isGeneratingImage}
            className="py-3 px-4 bg-terracotta-500 text-white rounded-xl font-medium text-sm hover:bg-terracotta-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5"
          >
            {isGeneratingImage ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <ImageIcon size={16} />
            )}
          </button>
        )}
      </div>

      {/* Preview */}
      <AnimatePresence>
        {post && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-gray-50 rounded-xl p-4 space-y-3">
              {/* Generated image */}
              {generatedImageUrl && (
                <div className="rounded-lg overflow-hidden">
                  <img
                    src={generatedImageUrl}
                    alt="AI生成画像"
                    className="w-full aspect-square object-cover"
                  />
                  <p className="text-[10px] text-text-muted mt-1 text-center">AI生成イメージ</p>
                </div>
              )}

              {/* Post text */}
              <p className="text-sm text-text-primary whitespace-pre-wrap leading-relaxed">
                {post.text}
              </p>

              {/* Hashtags */}
              {post.hashtags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {post.hashtags.map(tag => (
                    <span key={tag} className="text-xs text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Action buttons */}
              <div className="flex gap-2">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-3 py-2 bg-white rounded-lg text-xs font-medium text-text-primary border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  {copied ? (
                    <>
                      <Check size={13} className="text-forest-600" />
                      コピー済
                    </>
                  ) : (
                    <>
                      <Copy size={13} />
                      コピー
                    </>
                  )}
                </button>

                <button
                  onClick={handleShare}
                  className="flex items-center gap-1.5 px-3 py-2 bg-white rounded-lg text-xs font-medium text-text-primary border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <Share2 size={13} />
                  シェア
                </button>

                {platform === 'x' && (
                  <button
                    onClick={handlePostToX}
                    className="flex items-center gap-1.5 px-3 py-2 bg-black text-white rounded-lg text-xs font-medium hover:bg-gray-800 transition-colors"
                  >
                    <Send size={13} />
                    Xに投稿
                  </button>
                )}
              </div>

              {/* Status message */}
              {shareMessage && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-xs text-forest-600 font-medium"
                >
                  {shareMessage}
                </motion.p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
