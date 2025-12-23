import { useState, useEffect } from 'react';
import { Save, X } from 'lucide-react';
import { sheetsService, type SheetsConfig } from '../services/sheets';

interface SheetsConfigProps {
  onClose: () => void;
  onConfigSaved?: () => void;
}

export function SheetsConfig({ onClose, onConfigSaved }: SheetsConfigProps) {
  const [spreadsheetId, setSpreadsheetId] = useState('');
  const [sheetName, setSheetName] = useState('Sheet1');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const config = sheetsService.getConfig();
    if (config) {
      setSpreadsheetId(config.spreadsheetId);
      setSheetName(config.sheetName);
    }
  }, []);

  const handleSave = () => {
    if (!spreadsheetId.trim()) {
      setError('スプレッドシートIDを入力してください。');
      return;
    }

    if (!sheetName.trim()) {
      setError('シート名を入力してください。');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      sheetsService.saveConfig({
        spreadsheetId: spreadsheetId.trim(),
        sheetName: sheetName.trim(),
      });
      onConfigSaved?.();
      onClose();
    } catch (err) {
      setError('設定の保存に失敗しました。');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const extractSpreadsheetId = (url: string) => {
    // Google Sheets URLからIDを抽出
    // https://docs.google.com/spreadsheets/d/{SPREADSHEET_ID}/edit
    const match = url.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
    return match ? match[1] : '';
  };

  const handleUrlPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pastedText = e.clipboardData.getData('text');
    const extractedId = extractSpreadsheetId(pastedText);
    if (extractedId) {
      setSpreadsheetId(extractedId);
      e.preventDefault();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">スプレッドシート設定</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                スプレッドシートID または URL
              </label>
              <input
                type="text"
                value={spreadsheetId}
                onChange={(e) => setSpreadsheetId(e.target.value)}
                onPaste={handleUrlPaste}
                placeholder="スプレッドシートのURLを貼り付けるか、IDを入力"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coffee-brown focus:border-transparent"
              />
              <p className="mt-1 text-xs text-gray-500">
                Google SheetsのURLを貼り付けると、自動的にIDが抽出されます
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                シート名
              </label>
              <input
                type="text"
                value={sheetName}
                onChange={(e) => setSheetName(e.target.value)}
                placeholder="Sheet1"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coffee-brown focus:border-transparent"
              />
              <p className="mt-1 text-xs text-gray-500">
                データを保存するシートの名前（デフォルト: Sheet1）
              </p>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800 space-y-3">
              <div>
                <p className="font-semibold mb-2">データログの保存方法:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>活動記録を保存するたびに、自動的にスプレッドシートに1行追加されます</li>
                  <li>各活動記録は以下の18列のデータとして保存されます：
                    <ul className="list-disc list-inside ml-4 mt-1 text-xs">
                      <li>ID, タイプ, 日付, 時刻, 木番号, 説明, 数量, 単位, 写真数</li>
                      <li>天気, 気温, 湿度, AI診断-病気, AI診断-害虫, AI診断-熟度, AI診断-アドバイス</li>
                      <li>作成日時, 更新日時</li>
                    </ul>
                  </li>
                  <li>初回保存時に自動的にヘッダー行が作成されます</li>
                  <li>同じスプレッドシートを複数の利用者が共有することも可能です</li>
                </ul>
              </div>
              <div>
                <p className="font-semibold mb-2">セットアップ手順:</p>
                <ol className="list-decimal list-inside space-y-1 ml-2">
                  <li>Google Sheetsで新しいスプレッドシートを作成</li>
                  <li>スプレッドシートのURLをコピー</li>
                  <li>上記のフィールドにURLを貼り付け</li>
                  <li>Google Apps ScriptでWeb Appを設定（詳細はREADME参照）</li>
                </ol>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                キャンセル
              </button>
              <button
                onClick={handleSave}
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-coffee-brown text-white rounded-lg hover:bg-coffee-green transition-colors disabled:opacity-50"
              >
                <Save className="w-5 h-5" />
                {loading ? '保存中...' : '保存'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

