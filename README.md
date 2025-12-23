# BeanLog - コーヒー栽培管理アプリ

沖縄県大宜味村などの小規模コーヒー農家を対象とした、モバイルファーストの栽培管理・日誌アプリです。

## 機能

- 📝 **活動記録**: 収穫、施肥、剪定、加工、観察、防除、草刈り、植栽の記録
- 🤖 **AI診断**: Google Gemini APIを使用した病害虫診断と栽培アドバイス
- 📊 **ダッシュボード**: 収穫量KPI、週次グラフ、最近の活動表示
- 🌤️ **天気情報**: Open-Meteo APIによるリアルタイム天気表示
- 💾 **データ管理**: LocalStorageによるオフライン対応、CSVエクスポート機能
- 📊 **スプレッドシート連携**: Google Sheetsへの自動同期（利用者ごとに設定可能）

## セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. 環境変数の設定

`.env` ファイルを作成し、Gemini APIキーを設定してください：

```bash
cp .env.example .env
```

`.env` ファイルを編集：

```
VITE_GEMINI_API_KEY=your_gemini_api_key_here
VITE_GEMINI_MODEL=gemini-1.5-pro  # オプション: デフォルトは gemini-1.5-pro (v1beta APIで利用可能)
VITE_GOOGLE_APPS_SCRIPT_URL=your_google_apps_script_url  # オプション: スプレッドシート連携用
```

Gemini APIキーは [Google AI Studio](https://makersuite.google.com/app/apikey) から取得できます。
利用可能なモデル（v1beta API）: `gemini-1.5-pro`, `gemini-pro`, `gemini-1.5-flash-latest` など

### 2-1. スプレッドシート連携のセットアップ（オプション）

1. **Google Sheetsでスプレッドシートを作成**
   - 新しいスプレッドシートを作成
   - スプレッドシートのURLをコピー

2. **Google Apps Scriptの設定**
   - [Google Apps Script](https://script.google.com/) にアクセス
   - 新しいプロジェクトを作成
   - `google-apps-script.js` の内容をコピー＆ペースト
   - 「デプロイ」→「新しいデプロイ」を選択
   - 種類として「ウェブアプリ」を選択
   - 実行ユーザー: 「自分」
   - アクセス権限: 「全員」（または「自分」）
   - 「デプロイ」をクリック
   - 表示されたWebアプリのURLをコピー

3. **環境変数の設定**
   - `.env` ファイルに `VITE_GOOGLE_APPS_SCRIPT_URL` を追加
   - コピーしたWebアプリのURLを設定

4. **アプリ内での設定**
   - アプリのヘッダーにある設定アイコン（⚙️）をクリック
   - スプレッドシートのURLまたはIDを入力
   - シート名を指定（デフォルト: Sheet1）
   - 保存

### 2-2. データログの保存仕様

**保存タイミング:**
- 活動記録を保存するたびに、自動的にスプレッドシートに1行追加されます
- 初回保存時に自動的にヘッダー行が作成されます

**保存されるデータ列（18列）:**
1. ID - 活動記録の一意のID
2. タイプ - 活動タイプ（収穫、施肥、剪定、加工、観察、防除、草刈り、植栽）
3. 日付 - 活動日（YYYY/MM/DD形式）
4. 時刻 - 活動時刻（HH:MM:SS形式）
5. 木番号 - 対象の木の番号（任意）
6. 説明 - 活動の詳細説明
7. 数量 - 数値データ（収穫量、肥料量など）
8. 単位 - 数量の単位（kg、gなど）
9. 写真数 - 添付された写真の枚数
10. 天気 - 記録時の天気（晴れ、曇り、雨、嵐）
11. 気温 - 記録時の気温（℃）
12. 湿度 - 記録時の湿度（%）
13. AI診断-病気 - AIが検出した病気（あれば）
14. AI診断-害虫 - AIが検出した害虫（あれば）
15. AI診断-熟度 - AIが判定した実の熟度（あれば）
16. AI診断-アドバイス - AIからの栽培アドバイス
17. 作成日時 - 記録の作成日時（ISO 8601形式）
18. 更新日時 - 記録の最終更新日時（ISO 8601形式）

**複数利用者での利用:**
- 各利用者が自分のスプレッドシートを設定できます
- 同じスプレッドシートを複数の利用者が共有することも可能です
- 各利用者の設定はブラウザのLocalStorageに保存されます

### 3. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで `http://localhost:5173` を開いてください。

## ビルド

```bash
npm run build
```

ビルドされたファイルは `dist/` ディレクトリに出力されます。

## 技術スタック

- **Frontend**: React 19, Vite, TypeScript
- **Styling**: Tailwind CSS
- **AI**: Google Gemini API
- **Weather**: Open-Meteo API
- **Charts**: Recharts
- **Icons**: Lucide React

## プロジェクト構造

```
src/
├── components/      # UIコンポーネント
│   ├── ActivityForm.tsx
│   ├── ActivityList.tsx
│   ├── Dashboard.tsx
│   ├── WeatherCard.tsx
│   └── SheetsConfig.tsx
├── services/        # 外部API・データ管理
│   ├── gemini.ts
│   ├── storage.ts
│   ├── weather.ts
│   └── sheets.ts
├── types/          # TypeScript型定義
│   └── index.ts
├── utils/          # ユーティリティ関数
│   └── image.ts
├── App.tsx         # メインアプリケーション
├── main.tsx        # エントリーポイント
└── index.css       # グローバルスタイル
```

## ライセンス

MIT

