// 一括登録用スクリプト
// ブラウザのコンソールで実行してください

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

// ブラウザのコンソールで実行するための関数
function batchImportTrees() {
  const STORAGE_KEY = 'beanlog_trees';
  const existingTrees = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  const now = new Date().toISOString();
  let addedCount = 0;
  let skippedCount = 0;

  treeData.forEach((data) => {
    const treeId = data.no.toString();
    // 既存の樹木番号と重複チェック
    const existing = existingTrees.find(t => t.treeId === treeId);
    if (!existing) {
      const tree = {
        id: `tree_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        treeId: treeId,
        variety: data.variety,
        plantedDate: data.plantedDate,
        createdAt: now,
        updatedAt: now,
      };
      existingTrees.push(tree);
      addedCount++;
    } else {
      skippedCount++;
    }
  });

  existingTrees.sort((a, b) => {
    const numA = parseInt(a.treeId) || 0;
    const numB = parseInt(b.treeId) || 0;
    return numA - numB;
  });

  localStorage.setItem(STORAGE_KEY, JSON.stringify(existingTrees));
  
  console.log(`✅ 登録完了: ${addedCount}本の樹木を追加しました`);
  if (skippedCount > 0) {
    console.log(`⚠️ ${skippedCount}本の樹木は既に登録されているためスキップしました`);
  }
  console.log(`📊 合計: ${existingTrees.length}本の樹木を管理中`);
  
  // ページをリロードして反映
  window.location.reload();
}

// 実行
batchImportTrees();
