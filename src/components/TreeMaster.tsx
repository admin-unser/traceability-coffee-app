import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, TreePine, Calendar, Leaf, X, Upload, Grid3x3, Filter } from 'lucide-react';
import type { Tree, Plot } from '../types/tree';
import { treeService, plotService } from '../services/tree';
import { StaggerContainer, StaggerItem, AnimatedModal, IconButton, FadeIn } from './AnimatedComponents';

export function TreeMaster() {
  const [trees, setTrees] = useState<Tree[]>([]);
  const [plots, setPlots] = useState<Plot[]>([]);
  const [editingTree, setEditingTree] = useState<Tree | undefined>();
  const [editingPlot, setEditingPlot] = useState<Plot | undefined>();
  const [showForm, setShowForm] = useState(false);
  const [showBatchForm, setShowBatchForm] = useState(false);
  const [showPlotForm, setShowPlotForm] = useState(false);
  const [selectedPlotId, setSelectedPlotId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    treeId: '',
    plotId: '',
    name: '',
    plantedDate: '',
    variety: '',
    notes: '',
  });
  const [plotFormData, setPlotFormData] = useState({
    name: '',
    description: '',
    location: '',
  });
  const [batchInput, setBatchInput] = useState('');

  useEffect(() => {
    loadTrees();
    loadPlots();
    // 初回のみ一括登録を実行（開発用）
    const hasImported = localStorage.getItem('beanlog_batch_imported');
    if (!hasImported) {
      importBatchData();
      localStorage.setItem('beanlog_batch_imported', 'true');
    }
  }, []);

  const importBatchData = () => {
    const treeData = [
      { no: 1, variety: 'ブルボン', plantedDate: '2025-12-09' },
      { no: 2, variety: 'ブルボン', plantedDate: '2025-12-09' },
      { no: 3, variety: 'ブルボン', plantedDate: '2025-12-09' },
      { no: 4, variety: 'ブルボン', plantedDate: '2025-12-09' },
      { no: 5, variety: 'ブルボン', plantedDate: '2025-12-09' },
      { no: 6, variety: 'ブルボン', plantedDate: '2025-12-09' },
      { no: 7, variety: 'ブルボン', plantedDate: '2025-12-09' },
      { no: 8, variety: 'ブルボン', plantedDate: '2025-12-09' },
      { no: 9, variety: 'ブルボン', plantedDate: '2025-12-09' },
      { no: 10, variety: 'ブルボン', plantedDate: '2025-12-09' },
      { no: 11, variety: 'ブルボン', plantedDate: '2025-12-09' },
      { no: 12, variety: 'ブルボン', plantedDate: '2025-12-09' },
      { no: 13, variety: 'ブルボン', plantedDate: '2025-12-09' },
      { no: 14, variety: 'ブルボン', plantedDate: '2025-12-09' },
      { no: 15, variety: 'ブルボン', plantedDate: '2025-12-09' },
      { no: 16, variety: 'ブルボン', plantedDate: '2025-12-09' },
      { no: 17, variety: 'ブルボン', plantedDate: '2025-12-09' },
      { no: 18, variety: 'ブルボン', plantedDate: '2025-12-09' },
      { no: 19, variety: 'ブルボン', plantedDate: '2025-12-09' },
      { no: 20, variety: 'ブルボン', plantedDate: '2025-12-09' },
      { no: 21, variety: 'ブルボン', plantedDate: '2025-12-09' },
      { no: 22, variety: 'ブルボン', plantedDate: '2025-12-09' },
      { no: 23, variety: 'ブルボン', plantedDate: '2025-12-09' },
      { no: 24, variety: 'ブルボン', plantedDate: '2025-12-09' },
      { no: 25, variety: 'ブルボン', plantedDate: '2025-12-09' },
      { no: 26, variety: 'ブルボン', plantedDate: '2025-12-09' },
      { no: 27, variety: 'ブルボン', plantedDate: '2025-12-09' },
      { no: 28, variety: 'ブルボン', plantedDate: '2025-12-09' },
      { no: 29, variety: 'ブルボン', plantedDate: '2025-12-09' },
      { no: 30, variety: 'ブルボン', plantedDate: '2025-12-10' },
      { no: 31, variety: 'ブルボン', plantedDate: '2025-12-10' },
      { no: 32, variety: 'ブルボン', plantedDate: '2025-12-10' },
      { no: 33, variety: 'ブルボン', plantedDate: '2025-12-10' },
      { no: 34, variety: 'ブルボン', plantedDate: '2025-12-10' },
      { no: 35, variety: 'ブルボン', plantedDate: '2025-12-10' },
      { no: 36, variety: 'ブルボン', plantedDate: '2025-12-10' },
      { no: 37, variety: 'ブルボン', plantedDate: '2025-12-10' },
      { no: 38, variety: 'ブルボン', plantedDate: '2025-12-10' },
      { no: 39, variety: 'ブルボン', plantedDate: '2025-12-10' },
      { no: 40, variety: 'ブルボン', plantedDate: '2025-12-10' },
      { no: 41, variety: 'ブルボン', plantedDate: '2025-12-10' },
      { no: 42, variety: 'ブルボン', plantedDate: '2025-12-10' },
      { no: 43, variety: 'ブルボン', plantedDate: '2025-12-10' },
      { no: 44, variety: 'ブルボン', plantedDate: '2025-12-10' },
      { no: 45, variety: 'ブルボン', plantedDate: '2025-12-10' },
      { no: 46, variety: 'ブルボン', plantedDate: '2025-12-10' },
      { no: 47, variety: 'ブルボン', plantedDate: '2025-12-10' },
      { no: 48, variety: 'ブルボン', plantedDate: '2025-12-10' },
      { no: 49, variety: 'ブルボン', plantedDate: '2025-12-10' },
      { no: 50, variety: 'ブルボン', plantedDate: '2025-12-10' },
      { no: 51, variety: 'ブルボン', plantedDate: '2025-12-10' },
      { no: 52, variety: 'ブルボン', plantedDate: '2025-12-10' },
      { no: 53, variety: 'ブルボン', plantedDate: '2025-12-10' },
      { no: 54, variety: 'ブルボン', plantedDate: '2025-12-10' },
      { no: 55, variety: 'ブルボン', plantedDate: '2025-12-10' },
      { no: 56, variety: 'ブルボン', plantedDate: '2025-12-10' },
      { no: 57, variety: 'ブルボン', plantedDate: '2025-12-10' },
      { no: 58, variety: 'ブルボン', plantedDate: '2025-12-10' },
      { no: 59, variety: 'ブルボン', plantedDate: '2025-12-10' },
      { no: 60, variety: 'ブルボン', plantedDate: '2025-12-10' },
      { no: 61, variety: 'ブルボン', plantedDate: '2025-12-10' },
      { no: 62, variety: 'ブルボン', plantedDate: '2025-12-10' },
      { no: 63, variety: 'ブルボン', plantedDate: '2025-12-10' },
      { no: 64, variety: 'ブルボン', plantedDate: '2025-12-10' },
      { no: 65, variety: 'ブルボン', plantedDate: '2025-12-10' },
      { no: 66, variety: 'ブルボン', plantedDate: '2025-12-10' },
      { no: 67, variety: 'ブルボン', plantedDate: '2025-12-10' },
      { no: 68, variety: 'ブルボン', plantedDate: '2025-12-10' },
      { no: 69, variety: 'ブルボン', plantedDate: '2025-12-10' },
      { no: 70, variety: 'ブルボン', plantedDate: '2025-12-10' },
      { no: 71, variety: 'ブルボン', plantedDate: '2025-12-10' },
      { no: 72, variety: 'ブルボン', plantedDate: '2025-12-10' },
      { no: 73, variety: 'ブルボン', plantedDate: '2025-12-10' },
      { no: 74, variety: 'ブルボン', plantedDate: '2025-12-10' },
      { no: 75, variety: 'ブルボン', plantedDate: '2025-12-10' },
      { no: 76, variety: 'ブルボン', plantedDate: '2025-12-10' },
      { no: 77, variety: 'ブルボン', plantedDate: '2025-12-10' },
      { no: 78, variety: 'ブルボン', plantedDate: '2025-12-10' },
      { no: 79, variety: 'ブルボン', plantedDate: '2025-12-10' },
      { no: 80, variety: 'ブルボン', plantedDate: '2025-12-10' },
      { no: 81, variety: 'ブルボン', plantedDate: '2025-12-10' },
      { no: 82, variety: 'ブルボン', plantedDate: '2025-12-10' },
      { no: 83, variety: 'ブルボン', plantedDate: '2025-12-10' },
      { no: 84, variety: 'ブルボン', plantedDate: '2025-12-10' },
      { no: 85, variety: 'ブルボン', plantedDate: '2025-12-10' },
      { no: 86, variety: 'ブルボン', plantedDate: '2025-12-10' },
      { no: 87, variety: 'ブルボン', plantedDate: '2025-12-10' },
      { no: 88, variety: 'ブルボン', plantedDate: '2025-12-10' },
      { no: 89, variety: 'ブルボン', plantedDate: '2025-12-10' },
      { no: 90, variety: 'ブルボン', plantedDate: '2025-12-10' },
      { no: 91, variety: 'ブルボン', plantedDate: '2025-12-10' },
      { no: 92, variety: 'ブルボン', plantedDate: '2025-12-10' },
      { no: 93, variety: 'ブルボン', plantedDate: '2025-12-10' },
      { no: 94, variety: 'ブルボン', plantedDate: '2025-12-10' },
      { no: 95, variety: 'ブルボン', plantedDate: '2025-12-10' },
      { no: 96, variety: 'ブルボン', plantedDate: '2025-12-11' },
      { no: 97, variety: 'ブルボン', plantedDate: '2025-12-11' },
      { no: 98, variety: 'ブルボン', plantedDate: '2025-12-11' },
      { no: 99, variety: 'ブルボン', plantedDate: '2025-12-11' },
      { no: 100, variety: 'ブルボン', plantedDate: '2025-12-11' },
      { no: 101, variety: 'ブルボン', plantedDate: '2025-12-11' },
      { no: 102, variety: 'ブルボン', plantedDate: '2025-12-11' },
      { no: 103, variety: 'ブルボン', plantedDate: '2025-12-11' },
      { no: 104, variety: 'ブルボン', plantedDate: '2025-12-11' },
      { no: 105, variety: 'ブルボン', plantedDate: '2025-12-11' },
      { no: 106, variety: 'ブルボン', plantedDate: '2025-12-11' },
    ];

    const treesToSave = treeData.map(data => ({
      treeId: data.no.toString(),
      variety: data.variety,
      plantedDate: data.plantedDate,
    }));

    try {
      const result = treeService.saveBatchWithIndividualData(treesToSave);
      loadTrees();
      console.log(`✅ 登録完了: ${result.added}本の樹木を追加しました`);
      if (result.skipped > 0) {
        console.log(`⚠️ ${result.skipped}本の樹木は既に登録されているためスキップしました`);
      }
    } catch (error) {
      console.error('登録中にエラーが発生しました:', error);
    }
  };

  const loadTrees = () => {
    const loaded = treeService.getAll();
    setTrees(loaded);
  };

  const loadPlots = () => {
    const loaded = plotService.getAll();
    setPlots(loaded);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const tree: Tree = {
      id: editingTree?.id || `tree_${Date.now()}`,
      treeId: formData.treeId,
      plotId: formData.plotId || undefined,
      name: formData.name || undefined,
      plantedDate: formData.plantedDate || undefined,
      variety: formData.variety || undefined,
      notes: formData.notes || undefined,
      createdAt: editingTree?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    treeService.save(tree);
    loadTrees();
    resetForm();
  };

  const handleBatchSave = () => {
    // 改行、カンマ、タブ、スペースで分割
    const lines = batchInput
      .split(/[\n,\t]/)
      .map(line => line.trim())
      .filter(line => line.length > 0);

    if (lines.length === 0) {
      alert('樹木番号を入力してください');
      return;
    }

    const treesToSave = lines.map(treeId => ({
      treeId,
      plotId: formData.plotId || undefined,
      plantedDate: formData.plantedDate || undefined,
      variety: formData.variety || undefined,
    }));

    try {
      treeService.saveBatch(treesToSave);
      loadTrees();
      setBatchInput('');
      setShowBatchForm(false);
      alert(`${treesToSave.length}本の樹木を登録しました`);
    } catch (error) {
      alert('登録中にエラーが発生しました');
      console.error(error);
    }
  };

  const handlePlotSave = (e: React.FormEvent) => {
    e.preventDefault();
    const plot: Plot = {
      id: editingPlot?.id || `plot_${Date.now()}`,
      name: plotFormData.name,
      description: plotFormData.description || undefined,
      location: plotFormData.location || undefined,
      createdAt: editingPlot?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    plotService.save(plot);
    loadPlots();
    resetPlotForm();
  };

  const resetForm = () => {
    setFormData({
      treeId: '',
      plotId: '',
      name: '',
      plantedDate: '',
      variety: '',
      notes: '',
    });
    setEditingTree(undefined);
    setShowForm(false);
  };

  const resetPlotForm = () => {
    setPlotFormData({
      name: '',
      description: '',
      location: '',
    });
    setEditingPlot(undefined);
    setShowPlotForm(false);
  };

  const handleEdit = (tree: Tree) => {
    setEditingTree(tree);
    setFormData({
      treeId: tree.treeId,
      plotId: tree.plotId || '',
      name: tree.name || '',
      plantedDate: tree.plantedDate || '',
      variety: tree.variety || '',
      notes: tree.notes || '',
    });
    setShowForm(true);
  };

  const handleEditPlot = (plot: Plot) => {
    setEditingPlot(plot);
    setPlotFormData({
      name: plot.name,
      description: plot.description || '',
      location: plot.location || '',
    });
    setShowPlotForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('この樹木を削除しますか？')) {
      treeService.delete(id);
      loadTrees();
    }
  };

  const handleDeletePlot = (id: string) => {
    if (confirm('この区画を削除しますか？区画に属する樹木の区画情報も削除されます。')) {
      // 区画に属する樹木の区画情報をクリア
      const treesInPlot = treeService.getByPlotId(id);
      treesInPlot.forEach(tree => {
        tree.plotId = undefined;
        treeService.save(tree);
      });
      plotService.delete(id);
      loadPlots();
      loadTrees();
    }
  };

  const filteredTrees = selectedPlotId
    ? trees.filter(t => t.plotId === selectedPlotId)
    : trees;

  // 区画ごとに樹木をグループ化
  const treesByPlot = plots.map(plot => ({
    plot,
    trees: trees.filter(t => t.plotId === plot.id),
  }));

  const treesWithoutPlot = trees.filter(t => !t.plotId);

  return (
    <div className="space-y-4 p-4">
      {/* Header */}
      <FadeIn>
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-forest-100 flex items-center justify-center">
              <TreePine className="w-6 h-6 text-forest-500" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-text-primary">樹木マスタ</h2>
              <p className="text-sm text-text-secondary">
                {filteredTrees.length}本の樹木を管理中
                {selectedPlotId && ` (${trees.length}本中)`}
              </p>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                resetPlotForm();
                setShowPlotForm(true);
              }}
              className="btn-secondary flex items-center gap-2"
            >
              <Grid3x3 className="w-4 h-4" />
              区画管理
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                resetForm();
                setShowBatchForm(true);
              }}
              className="btn-secondary flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              一括登録
            </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            新規登録
          </motion.button>
          </div>
        </div>
      </FadeIn>

      {/* Filter by Plot */}
      {plots.length > 0 && (
        <FadeIn delay={0.1}>
          <div className="flex items-center gap-2 flex-wrap">
            <Filter className="w-4 h-4 text-text-secondary" />
            <button
              onClick={() => setSelectedPlotId(null)}
              className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                selectedPlotId === null
                  ? 'bg-terracotta-500 text-white'
                  : 'bg-base-cream dark:bg-gray-700 text-text-secondary hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              すべて
            </button>
            {plots.map((plot) => (
              <button
                key={plot.id}
                onClick={() => setSelectedPlotId(plot.id)}
                className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                  selectedPlotId === plot.id
                    ? 'bg-terracotta-500 text-white'
                    : 'bg-base-cream dark:bg-gray-700 text-text-secondary hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {plot.name}
              </button>
            ))}
          </div>
        </FadeIn>
      )}

      {/* Batch Registration Modal */}
      <AnimatedModal isOpen={showBatchForm} onClose={() => setShowBatchForm(false)}>
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-soft-lg max-h-[90vh] overflow-hidden">
          <div className="p-4 border-b border-gray-100 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800 rounded-t-3xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-forest-100 dark:bg-forest-900/30 flex items-center justify-center">
                  <Upload className="w-5 h-5 text-forest-500" />
                </div>
                <h3 className="text-xl font-bold text-text-primary dark:text-white">樹木一括登録</h3>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowBatchForm(false)}
                className="w-8 h-8 rounded-full bg-base-cream dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center justify-center text-text-secondary dark:text-gray-300"
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
          
          <div className="p-4 space-y-4 overflow-y-auto max-h-[calc(90vh-80px)] custom-scrollbar">
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-3">
              <p className="text-sm text-blue-800 dark:text-blue-300">
                <strong>使い方:</strong> 樹木番号を改行、カンマ、タブで区切って入力してください。
                <br />
                例: No.001, No.002, No.003 または 1行に1つずつ入力
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary dark:text-white mb-2">
                樹木番号一覧 <span className="text-coffee-red">*</span>
              </label>
              <textarea
                value={batchInput}
                onChange={(e) => setBatchInput(e.target.value)}
                placeholder="No.001&#10;No.002&#10;No.003&#10;または&#10;No.001, No.002, No.003"
                rows={8}
                className="input-natural resize-none font-mono text-sm dark:bg-gray-700 dark:text-white dark:border-gray-600"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary dark:text-white mb-2">
                区画（一括設定）
              </label>
              <select
                value={formData.plotId}
                onChange={(e) => setFormData({ ...formData, plotId: e.target.value })}
                className="input-natural dark:bg-gray-700 dark:text-white dark:border-gray-600"
              >
                <option value="">区画を選択しない</option>
                {plots.map((plot) => (
                  <option key={plot.id} value={plot.id}>
                    {plot.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-primary dark:text-white mb-2">
                  植栽日（一括設定）
                </label>
                <input
                  type="date"
                  value={formData.plantedDate}
                  onChange={(e) => setFormData({ ...formData, plantedDate: e.target.value })}
                  className="input-natural dark:bg-gray-700 dark:text-white dark:border-gray-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary dark:text-white mb-2">
                  品種（一括設定）
                </label>
                <input
                  type="text"
                  value={formData.variety}
                  onChange={(e) => setFormData({ ...formData, variety: e.target.value })}
                  placeholder="例: ティピカ"
                  className="input-natural dark:bg-gray-700 dark:text-white dark:border-gray-600"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => setShowBatchForm(false)}
                className="btn-secondary flex-1"
              >
                キャンセル
              </button>
              <button
                type="button"
                onClick={handleBatchSave}
                className="btn-primary flex-1"
              >
                一括登録
              </button>
            </div>
          </div>
        </div>
      </AnimatedModal>

      {/* Plot Management Modal */}
      <AnimatedModal isOpen={showPlotForm} onClose={resetPlotForm}>
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-soft-lg max-h-[90vh] overflow-hidden">
          <div className="p-4 border-b border-gray-100 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800 rounded-t-3xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-forest-100 dark:bg-forest-900/30 flex items-center justify-center">
                  <Grid3x3 className="w-5 h-5 text-forest-500" />
                </div>
                <h3 className="text-xl font-bold text-text-primary dark:text-white">
                  {editingPlot ? '区画を編集' : '新しい区画を登録'}
                </h3>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={resetPlotForm}
                className="w-8 h-8 rounded-full bg-base-cream dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center justify-center text-text-secondary dark:text-gray-300"
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
          
          <form onSubmit={handlePlotSave} className="p-4 space-y-4 overflow-y-auto max-h-[calc(90vh-80px)] custom-scrollbar">
            <div>
              <label className="block text-sm font-medium text-text-primary dark:text-white mb-2">
                区画名 <span className="text-coffee-red">*</span>
              </label>
              <input
                type="text"
                value={plotFormData.name}
                onChange={(e) => setPlotFormData({ ...plotFormData, name: e.target.value })}
                placeholder="例: エリアA、区画1"
                className="input-natural dark:bg-gray-700 dark:text-white dark:border-gray-600"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary dark:text-white mb-2">
                説明（任意）
              </label>
              <textarea
                value={plotFormData.description}
                onChange={(e) => setPlotFormData({ ...plotFormData, description: e.target.value })}
                rows={3}
                className="input-natural resize-none dark:bg-gray-700 dark:text-white dark:border-gray-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary dark:text-white mb-2">
                位置情報（任意）
              </label>
              <input
                type="text"
                value={plotFormData.location}
                onChange={(e) => setPlotFormData({ ...plotFormData, location: e.target.value })}
                placeholder="例: 農場の東側"
                className="input-natural dark:bg-gray-700 dark:text-white dark:border-gray-600"
              />
            </div>
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={resetPlotForm}
                className="btn-secondary flex-1"
              >
                キャンセル
              </button>
              <button
                type="submit"
                className="btn-primary flex-1"
              >
                保存
              </button>
            </div>
          </form>

          {/* Plot List */}
          {plots.length > 0 && (
            <div className="p-4 border-t border-gray-100 dark:border-gray-700">
              <h4 className="text-sm font-medium text-text-primary dark:text-white mb-3">登録済み区画</h4>
              <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar">
                {plots.map((plot) => {
                  const treesInPlot = treeService.getByPlotId(plot.id);
                  return (
                    <div
                      key={plot.id}
                      className="flex items-center justify-between p-3 bg-base-cream dark:bg-gray-700 rounded-xl"
                    >
                      <div className="flex-1">
                        <div className="font-medium text-text-primary dark:text-white">{plot.name}</div>
                        {plot.description && (
                          <div className="text-sm text-text-secondary dark:text-gray-400">{plot.description}</div>
                        )}
                        <div className="text-xs text-text-muted dark:text-gray-500 mt-1">
                          {treesInPlot.length}本の樹木
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <IconButton
                          onClick={() => handleEditPlot(plot)}
                          className="!p-2 hover:!bg-terracotta-100 hover:text-terracotta-600"
                        >
                          <Edit className="w-4 h-4" />
                        </IconButton>
                        <IconButton
                          onClick={() => handleDeletePlot(plot.id)}
                          className="!p-2 hover:!bg-red-100 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </IconButton>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </AnimatedModal>

      {/* Tree Form Modal */}
      <AnimatedModal isOpen={showForm} onClose={resetForm}>
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-soft-lg max-h-[90vh] overflow-hidden">
          <div className="p-4 border-b border-gray-100 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800 rounded-t-3xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-forest-100 dark:bg-forest-900/30 flex items-center justify-center">
                  <TreePine className="w-5 h-5 text-forest-500" />
                </div>
                <h3 className="text-xl font-bold text-text-primary dark:text-white">
                  {editingTree ? '樹木を編集' : '新しい樹木を登録'}
                </h3>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={resetForm}
                className="w-8 h-8 rounded-full bg-base-cream dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center justify-center text-text-secondary dark:text-gray-300"
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
          
          <form onSubmit={handleSave} className="p-4 space-y-4 overflow-y-auto max-h-[calc(90vh-80px)] custom-scrollbar">
            <div>
              <label className="block text-sm font-medium text-text-primary dark:text-white mb-2">
                木番号 <span className="text-coffee-red">*</span>
              </label>
              <input
                type="text"
                value={formData.treeId}
                onChange={(e) => setFormData({ ...formData, treeId: e.target.value })}
                placeholder="例: No.042"
                className="input-natural dark:bg-gray-700 dark:text-white dark:border-gray-600"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary dark:text-white mb-2">
                区画
              </label>
              <select
                value={formData.plotId}
                onChange={(e) => setFormData({ ...formData, plotId: e.target.value })}
                className="input-natural dark:bg-gray-700 dark:text-white dark:border-gray-600"
              >
                <option value="">区画を選択しない</option>
                {plots.map((plot) => (
                  <option key={plot.id} value={plot.id}>
                    {plot.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary dark:text-white mb-2">
                名前（任意）
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="例: メインエリア1号"
                className="input-natural dark:bg-gray-700 dark:text-white dark:border-gray-600"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-primary dark:text-white mb-2">
                  植栽日（任意）
                </label>
                <input
                  type="date"
                  value={formData.plantedDate}
                  onChange={(e) => setFormData({ ...formData, plantedDate: e.target.value })}
                  className="input-natural dark:bg-gray-700 dark:text-white dark:border-gray-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary dark:text-white mb-2">
                  品種（任意）
                </label>
                <input
                  type="text"
                  value={formData.variety}
                  onChange={(e) => setFormData({ ...formData, variety: e.target.value })}
                  placeholder="例: ティピカ"
                  className="input-natural dark:bg-gray-700 dark:text-white dark:border-gray-600"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary dark:text-white mb-2">
                メモ（任意）
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
                className="input-natural resize-none dark:bg-gray-700 dark:text-white dark:border-gray-600"
              />
            </div>
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={resetForm}
                className="btn-secondary flex-1"
              >
                キャンセル
              </button>
              <button
                type="submit"
                className="btn-primary flex-1"
              >
                保存
              </button>
            </div>
          </form>
        </div>
      </AnimatedModal>

      {/* Trees List - Grouped by Plot */}
      {filteredTrees.length === 0 ? (
        <FadeIn delay={0.2}>
          <div className="card-natural text-center py-16">
            <div className="w-20 h-20 mx-auto mb-4 rounded-3xl bg-base-cream flex items-center justify-center">
              <TreePine className="w-10 h-10 text-text-muted" />
            </div>
            <p className="text-text-secondary font-medium">
              {selectedPlotId ? 'この区画に登録されている樹木がありません' : '登録されている樹木がありません'}
            </p>
            <p className="text-sm text-text-muted mt-2">「新規登録」または「一括登録」ボタンから樹木を追加してください</p>
          </div>
        </FadeIn>
      ) : selectedPlotId ? (
        // 特定の区画が選択されている場合は通常のリスト表示
        <StaggerContainer className="space-y-3">
          {filteredTrees.map((tree) => (
            <StaggerItem key={tree.id}>
              <motion.div
                whileHover={{ y: -2 }}
                transition={{ duration: 0.2 }}
                className="card-natural p-4 hover:shadow-soft-lg transition-all group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-2xl bg-forest-100 flex items-center justify-center">
                        <TreePine className="w-5 h-5 text-forest-500" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-text-primary">{tree.treeId}</h3>
                        {tree.name && (
                          <span className="text-sm text-text-secondary">({tree.name})</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex flex-wrap gap-3 text-sm">
                        {tree.plantedDate && (
                          <div className="flex items-center gap-1.5 text-text-secondary">
                            <Calendar className="w-3.5 h-3.5" />
                            <span className="font-data">{new Date(tree.plantedDate).toLocaleDateString('ja-JP')}</span>
                          </div>
                        )}
                        {tree.variety && (
                          <div className="flex items-center gap-1.5 text-text-secondary">
                            <Leaf className="w-3.5 h-3.5" />
                            {tree.variety}
                          </div>
                        )}
                      </div>
                      {tree.notes && (
                        <p className="text-sm text-text-muted mt-2 pl-1 border-l-2 border-base-cream">{tree.notes}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <IconButton
                      onClick={() => handleEdit(tree)}
                      className="!p-2 hover:!bg-terracotta-100 hover:text-terracotta-600"
                    >
                      <Edit className="w-4 h-4" />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDelete(tree.id)}
                      className="!p-2 hover:!bg-red-100 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </IconButton>
                  </div>
                </div>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      ) : (
        // 区画ごとにグループ化して表示
        <StaggerContainer className="space-y-4">
          {/* 区画ごとのグループ */}
          {treesByPlot.map(({ plot, trees: plotTrees }) => (
            plotTrees.length > 0 && (
              <StaggerItem key={plot.id}>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 px-2">
                    <Grid3x3 className="w-5 h-5 text-terracotta-500" />
                    <h3 className="text-lg font-bold text-text-primary">{plot.name}</h3>
                    <span className="text-sm text-text-secondary">({plotTrees.length}本)</span>
                    {plot.description && (
                      <span className="text-sm text-text-muted">- {plot.description}</span>
                    )}
                  </div>
                  <div className="space-y-2">
                    {plotTrees.map((tree) => (
                      <motion.div
                        key={tree.id}
                        whileHover={{ y: -2 }}
                        transition={{ duration: 0.2 }}
                        className="card-natural p-4 hover:shadow-soft-lg transition-all group ml-4"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              <div className="w-10 h-10 rounded-2xl bg-forest-100 flex items-center justify-center">
                                <TreePine className="w-5 h-5 text-forest-500" />
                              </div>
                              <div>
                                <h3 className="text-lg font-bold text-text-primary">{tree.treeId}</h3>
                                {tree.name && (
                                  <span className="text-sm text-text-secondary">({tree.name})</span>
                                )}
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              <div className="flex flex-wrap gap-3 text-sm">
                                {tree.plantedDate && (
                                  <div className="flex items-center gap-1.5 text-text-secondary">
                                    <Calendar className="w-3.5 h-3.5" />
                                    <span className="font-data">{new Date(tree.plantedDate).toLocaleDateString('ja-JP')}</span>
                                  </div>
                                )}
                                {tree.variety && (
                                  <div className="flex items-center gap-1.5 text-text-secondary">
                                    <Leaf className="w-3.5 h-3.5" />
                                    {tree.variety}
                                  </div>
                                )}
                              </div>
                              {tree.notes && (
                                <p className="text-sm text-text-muted mt-2 pl-1 border-l-2 border-base-cream">{tree.notes}</p>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <IconButton
                              onClick={() => handleEdit(tree)}
                              className="!p-2 hover:!bg-terracotta-100 hover:text-terracotta-600"
                            >
                              <Edit className="w-4 h-4" />
                            </IconButton>
                            <IconButton
                              onClick={() => handleDelete(tree.id)}
                              className="!p-2 hover:!bg-red-100 hover:text-red-600"
                            >
                              <Trash2 className="w-4 h-4" />
                            </IconButton>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </StaggerItem>
            )
          ))}
          
          {/* 区画未設定の樹木 */}
          {treesWithoutPlot.length > 0 && (
            <StaggerItem>
              <div className="space-y-2">
                <div className="flex items-center gap-2 px-2">
                  <TreePine className="w-5 h-5 text-text-muted" />
                  <h3 className="text-lg font-bold text-text-primary">区画未設定</h3>
                  <span className="text-sm text-text-secondary">({treesWithoutPlot.length}本)</span>
                </div>
                <div className="space-y-2">
                  {treesWithoutPlot.map((tree) => (
                    <motion.div
                      key={tree.id}
                      whileHover={{ y: -2 }}
                      transition={{ duration: 0.2 }}
                      className="card-natural p-4 hover:shadow-soft-lg transition-all group ml-4"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-2xl bg-forest-100 flex items-center justify-center">
                              <TreePine className="w-5 h-5 text-forest-500" />
                            </div>
                            <div>
                              <h3 className="text-lg font-bold text-text-primary">{tree.treeId}</h3>
                              {tree.name && (
                                <span className="text-sm text-text-secondary">({tree.name})</span>
                              )}
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex flex-wrap gap-3 text-sm">
                              {tree.plantedDate && (
                                <div className="flex items-center gap-1.5 text-text-secondary">
                                  <Calendar className="w-3.5 h-3.5" />
                                  <span className="font-data">{new Date(tree.plantedDate).toLocaleDateString('ja-JP')}</span>
                                </div>
                              )}
                              {tree.variety && (
                                <div className="flex items-center gap-1.5 text-text-secondary">
                                  <Leaf className="w-3.5 h-3.5" />
                                  {tree.variety}
                                </div>
                              )}
                            </div>
                            {tree.notes && (
                              <p className="text-sm text-text-muted mt-2 pl-1 border-l-2 border-base-cream">{tree.notes}</p>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <IconButton
                            onClick={() => handleEdit(tree)}
                            className="!p-2 hover:!bg-terracotta-100 hover:text-terracotta-600"
                          >
                            <Edit className="w-4 h-4" />
                          </IconButton>
                          <IconButton
                            onClick={() => handleDelete(tree.id)}
                            className="!p-2 hover:!bg-red-100 hover:text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </IconButton>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </StaggerItem>
          )}
        </StaggerContainer>
      )}
    </div>
  );
}
