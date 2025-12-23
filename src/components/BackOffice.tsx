import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download, Upload, Trash2, Moon, Sun, Settings, BarChart3, HardDrive } from 'lucide-react';
import { storageService } from '../services/storage';
import { treeService } from '../services/tree';
import { themeService, type Theme } from '../services/theme';
import { ReminderSettings } from './ReminderSettings';
import { TreeActivityHistory } from './TreeActivityHistory';
import { StaggerContainer, StaggerItem, AnimatedCounter, FadeIn } from './AnimatedComponents';

export function BackOffice() {
  const [exportFormat, setExportFormat] = useState<'csv' | 'json'>('csv');
  const [theme, setTheme] = useState<Theme>(themeService.getTheme());

  useEffect(() => {
    themeService.applyTheme(theme);
  }, [theme]);

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    themeService.setTheme(newTheme);
  };

  const handleExport = () => {
    if (exportFormat === 'csv') {
      const csv = storageService.exportToCSV();
      if (!csv) {
        alert('エクスポートするデータがありません。');
        return;
      }

      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `beanlog_export_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      const activities = storageService.getAll();
      const trees = treeService.getAll();
      const data = {
        activities,
        trees,
        exportDate: new Date().toISOString(),
        version: '1.0.0',
      };

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `beanlog_backup_${new Date().toISOString().split('T')[0]}.json`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const data = JSON.parse(text);

        if (data.activities && Array.isArray(data.activities)) {
          data.activities.forEach((activity: any) => {
            storageService.save(activity);
          });
        }

        if (data.trees && Array.isArray(data.trees)) {
          data.trees.forEach((tree: any) => {
            treeService.save(tree);
          });
        }

        alert('データのインポートが完了しました。ページをリロードします。');
        window.location.reload();
      } catch (error) {
        console.error('Import error:', error);
        alert('データのインポートに失敗しました。ファイル形式を確認してください。');
      }
    };
    reader.readAsText(file);
  };

  const handleClearAll = () => {
    if (confirm('すべてのデータを削除しますか？この操作は取り消せません。')) {
      storageService.clearAll();
      treeService.getAll().forEach(tree => treeService.delete(tree.id));
      alert('すべてのデータを削除しました。ページをリロードします。');
      window.location.reload();
    }
  };

  const getStats = () => {
    const activities = storageService.getAll();
    const trees = treeService.getAll();
    return {
      totalActivities: activities.length,
      totalTrees: trees.length,
      dataSize: new Blob([JSON.stringify(activities)]).size + new Blob([JSON.stringify(trees)]).size,
    };
  };

  const stats = getStats();

  return (
    <div className="space-y-4 p-4">
      {/* Header */}
      <FadeIn>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-2xl bg-base-cream flex items-center justify-center">
            <Settings className="w-6 h-6 text-text-secondary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-text-primary">設定</h2>
            <p className="text-sm text-text-secondary">アプリの設定とデータ管理</p>
          </div>
        </div>
      </FadeIn>

      <StaggerContainer className="space-y-4">
        {/* Reminder Settings */}
        <StaggerItem>
          <ReminderSettings />
        </StaggerItem>

        {/* Tree Activity History */}
        <StaggerItem>
          <TreeActivityHistory />
        </StaggerItem>

        {/* Theme Settings */}
        <StaggerItem>
          <div className="card-natural p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-terracotta-100 flex items-center justify-center">
                {theme === 'dark' ? (
                  <Moon className="w-5 h-5 text-terracotta-500" />
                ) : (
                  <Sun className="w-5 h-5 text-terracotta-500" />
                )}
              </div>
              <div>
                <h3 className="text-lg font-bold text-text-primary">デザインテーマ</h3>
                <p className="text-sm text-text-secondary">お好みの表示モードを選択</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleThemeChange('light')}
                className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all ${
                  theme === 'light'
                    ? 'border-terracotta-500 bg-terracotta-50'
                    : 'border-gray-200 hover:border-terracotta-300'
                }`}
              >
                <Sun className={`w-8 h-8 mb-2 ${theme === 'light' ? 'text-terracotta-500' : 'text-text-muted'}`} />
                <span className={`font-medium ${theme === 'light' ? 'text-terracotta-500' : 'text-text-secondary'}`}>
                  ライトモード
                </span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleThemeChange('dark')}
                className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all ${
                  theme === 'dark'
                    ? 'border-terracotta-500 bg-terracotta-50'
                    : 'border-gray-200 hover:border-terracotta-300'
                }`}
              >
                <Moon className={`w-8 h-8 mb-2 ${theme === 'dark' ? 'text-terracotta-500' : 'text-text-muted'}`} />
                <span className={`font-medium ${theme === 'dark' ? 'text-terracotta-500' : 'text-text-secondary'}`}>
                  ダークモード
                </span>
              </motion.button>
            </div>
          </div>
        </StaggerItem>

        {/* Data Stats */}
        <StaggerItem>
          <div className="card-natural p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-forest-100 flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-forest-500" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-text-primary">データ統計</h3>
                <p className="text-sm text-text-secondary">保存されているデータの概要</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="p-4 rounded-2xl bg-base-cream">
                <p className="text-sm text-text-secondary mb-1">活動記録数</p>
                <AnimatedCounter 
                  value={stats.totalActivities}
                  className="text-2xl font-bold text-forest-500 font-data"
                />
              </div>
              <div className="p-4 rounded-2xl bg-base-cream">
                <p className="text-sm text-text-secondary mb-1">樹木登録数</p>
                <AnimatedCounter 
                  value={stats.totalTrees}
                  className="text-2xl font-bold text-terracotta-500 font-data"
                />
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-base-cream flex items-center gap-3">
              <HardDrive className="w-5 h-5 text-text-muted" />
              <div>
                <p className="text-sm text-text-secondary">データサイズ</p>
                <p className="text-lg font-semibold text-text-primary font-data">
                  {(stats.dataSize / 1024).toFixed(2)} KB
                </p>
              </div>
            </div>
          </div>
        </StaggerItem>

        {/* Export */}
        <StaggerItem>
          <div className="card-natural p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-sand-400/20 flex items-center justify-center">
                <Download className="w-5 h-5 text-sand-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-text-primary">データエクスポート</h3>
                <p className="text-sm text-text-secondary">データをファイルに書き出し</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  エクスポート形式
                </label>
                <select
                  value={exportFormat}
                  onChange={(e) => setExportFormat(e.target.value as 'csv' | 'json')}
                  className="input-natural"
                >
                  <option value="csv">CSV（表計算ソフト用）</option>
                  <option value="json">JSON（バックアップ用）</option>
                </select>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleExport}
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                <Download className="w-5 h-5" />
                エクスポート
              </motion.button>
            </div>
          </div>
        </StaggerItem>

        {/* Import */}
        <StaggerItem>
          <div className="card-natural p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-forest-100 flex items-center justify-center">
                <Upload className="w-5 h-5 text-forest-500" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-text-primary">データインポート</h3>
                <p className="text-sm text-text-secondary">バックアップからデータを復元</p>
              </div>
            </div>
            <div className="space-y-4">
              <p className="text-sm text-text-secondary">
                JSON形式のバックアップファイルを選択してインポートします。
              </p>
              <label className="block">
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImport}
                  className="hidden"
                />
                <motion.div 
                  whileHover={{ scale: 1.01, borderColor: 'rgba(194, 112, 62, 0.5)' }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-4 border-2 border-dashed border-gray-200 rounded-2xl hover:bg-base-cream transition-colors cursor-pointer"
                >
                  <Upload className="w-5 h-5 text-text-muted" />
                  <span className="text-text-secondary">ファイルを選択</span>
                </motion.div>
              </label>
            </div>
          </div>
        </StaggerItem>

        {/* Delete All */}
        <StaggerItem>
          <div className="card-natural p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-red-100 flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-coffee-red" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-text-primary">データ管理</h3>
                <p className="text-sm text-text-secondary">すべてのデータを削除</p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleClearAll}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-50 text-coffee-red rounded-2xl border border-red-200 hover:bg-red-100 transition-colors"
            >
              <Trash2 className="w-5 h-5" />
              すべてのデータを削除
            </motion.button>
            <p className="text-xs text-text-muted mt-3 text-center">
              注意: この操作は取り消せません。削除前に必ずバックアップを取ってください。
            </p>
          </div>
        </StaggerItem>
      </StaggerContainer>
    </div>
  );
}
