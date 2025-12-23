import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, TreePine, MapPin, Calendar, Leaf, X } from 'lucide-react';
import type { Tree } from '../types/tree';
import { treeService } from '../services/tree';
import { StaggerContainer, StaggerItem, AnimatedModal, IconButton, FadeIn } from './AnimatedComponents';

export function TreeMaster() {
  const [trees, setTrees] = useState<Tree[]>([]);
  const [editingTree, setEditingTree] = useState<Tree | undefined>();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    treeId: '',
    name: '',
    location: '',
    plantedDate: '',
    variety: '',
    notes: '',
  });

  useEffect(() => {
    loadTrees();
  }, []);

  const loadTrees = () => {
    const loaded = treeService.getAll();
    setTrees(loaded);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const tree: Tree = {
      id: editingTree?.id || `tree_${Date.now()}`,
      treeId: formData.treeId,
      name: formData.name || undefined,
      location: formData.location || undefined,
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

  const resetForm = () => {
    setFormData({
      treeId: '',
      name: '',
      location: '',
      plantedDate: '',
      variety: '',
      notes: '',
    });
    setEditingTree(undefined);
    setShowForm(false);
  };

  const handleEdit = (tree: Tree) => {
    setEditingTree(tree);
    setFormData({
      treeId: tree.treeId,
      name: tree.name || '',
      location: tree.location || '',
      plantedDate: tree.plantedDate || '',
      variety: tree.variety || '',
      notes: tree.notes || '',
    });
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('この樹木を削除しますか？')) {
      treeService.delete(id);
      loadTrees();
    }
  };

  return (
    <div className="space-y-4 p-4">
      {/* Header */}
      <FadeIn>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-forest-100 flex items-center justify-center">
              <TreePine className="w-6 h-6 text-forest-500" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-text-primary">樹木マスタ</h2>
              <p className="text-sm text-text-secondary">{trees.length}本の樹木を管理中</p>
            </div>
          </div>
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
      </FadeIn>

      {/* Form Modal */}
      <AnimatedModal isOpen={showForm} onClose={resetForm}>
        <div className="bg-white rounded-3xl shadow-soft-lg max-h-[90vh] overflow-hidden">
          <div className="p-4 border-b border-gray-100 sticky top-0 bg-white rounded-t-3xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-forest-100 flex items-center justify-center">
                  <TreePine className="w-5 h-5 text-forest-500" />
                </div>
                <h3 className="text-xl font-bold text-text-primary">
                  {editingTree ? '樹木を編集' : '新しい樹木を登録'}
                </h3>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={resetForm}
                className="w-8 h-8 rounded-full bg-base-cream hover:bg-gray-200 flex items-center justify-center text-text-secondary"
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
          
          <form onSubmit={handleSave} className="p-4 space-y-4 overflow-y-auto max-h-[calc(90vh-80px)] custom-scrollbar">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                木番号 <span className="text-coffee-red">*</span>
              </label>
              <input
                type="text"
                value={formData.treeId}
                onChange={(e) => setFormData({ ...formData, treeId: e.target.value })}
                placeholder="例: No.042"
                className="input-natural"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                名前（任意）
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="例: メインエリア1号"
                className="input-natural"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                位置情報（任意）
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="例: エリアA、東側"
                className="input-natural"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  植栽日（任意）
                </label>
                <input
                  type="date"
                  value={formData.plantedDate}
                  onChange={(e) => setFormData({ ...formData, plantedDate: e.target.value })}
                  className="input-natural"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  品種（任意）
                </label>
                <input
                  type="text"
                  value={formData.variety}
                  onChange={(e) => setFormData({ ...formData, variety: e.target.value })}
                  placeholder="例: ティピカ"
                  className="input-natural"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                メモ（任意）
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
                className="input-natural resize-none"
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

      {/* Trees List */}
      {trees.length === 0 ? (
        <FadeIn delay={0.2}>
          <div className="card-natural text-center py-16">
            <div className="w-20 h-20 mx-auto mb-4 rounded-3xl bg-base-cream flex items-center justify-center">
              <TreePine className="w-10 h-10 text-text-muted" />
            </div>
            <p className="text-text-secondary font-medium">登録されている樹木がありません</p>
            <p className="text-sm text-text-muted mt-2">「新規登録」ボタンから樹木を追加してください</p>
          </div>
        </FadeIn>
      ) : (
        <StaggerContainer className="space-y-3">
          {trees.map((tree) => (
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
                      {tree.location && (
                        <div className="flex items-center gap-2 text-sm text-text-secondary">
                          <MapPin className="w-4 h-4 text-terracotta-400" />
                          {tree.location}
                        </div>
                      )}
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
      )}
    </div>
  );
}
