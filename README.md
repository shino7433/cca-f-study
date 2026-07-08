# CCA-F 演習アプリ

**Claude Certified Architect – Foundations (CCA-F)** 対策の、演習主役ローカル学習アプリ。
英文問題 →（和訳トグル）→ 選択式で自動採点 → 英日解説 → その問題の頻出単語、をワンループで学び、進捗（弱点ドメイン・間違えた問題）をブラウザに記録します。

## 使い方

`index.html` をブラウザで開くだけ（ビルド・インストール不要）。
- **Mac:** Finder で `index.html` をダブルクリック、または右クリック →「このアプリケーションで開く」→ ブラウザ
- **スマホ最適化**：下部タブバー・セーフエリア対応の1カラム・ダッシュボードUI
- 進捗はブラウザの `localStorage` に保存されるので、同じブラウザで開けば続きから復習できます

> 見出しフォントに Google Fonts の Nunito を使用（オンライン時）。オフラインでは端末標準フォントに自動フォールバックします。

## デザイン

参考にしたe-learningダッシュボードの色調に準拠：ソフトブルー背景＋白カード、5ドメインに固有色（Agentic=青 / Prompt=橙 / Claude Code=緑 / MCP=琥珀 / Context=紫）を割り当て、マスタリーカード・棒グラフ・バッジで色を一貫。下部タブバー（ホーム/演習/単語）でネイティブアプリのような操作感。

## 3つのタブ

| タブ | 内容 |
|---|---|
| **ホーム** | 挨拶＋ダッシュボード。ドメイン別マスタリー（カラフルカード＋白い進捗リング、タップでそのドメインの演習へ）、「演習をはじめる」CTA、Statisticsタイル（総合正答率・回答済み・累計回答・復習リスト）、ドメイン別正答率の棒グラフ。進捗リセットもここ |
| **演習** | ドメイン別 / 未回答だけ / 間違えた問題だけ で絞り込み、ランダム or 順番で出題。選択肢タップで即採点し、英日解説と頻出単語を表示 |
| **単語** | 全問題の頻出英単語を集約した一覧（ドメイン色チップ・意味・例文つき） |

## 試験の前提（2026年時点の公開情報）

- 60問 / 120分 / **720点以上で合格**（1000点満点のスケール式）
- **選択式＋複数選択**、オンライン監視・クローズドブック
- 本番は**シナリオベース**（「システムが壊れている、どう直す?」）で、単なる用語暗記ではない
- 対象技術: Claude Code / Claude Agent SDK / Claude API / MCP
- 出題比率: Agentic 27% / Prompt 20% / Claude Code 20% / Tool・MCP 18% / Context 15%

> ⚠️ 本アプリの問題は**模擬問題**です。本物の試験問題は非公開のため、公式ドメイン比率と公開情報（Anthropic Academy教材・公式ドキュメント・MCP/Claude Code/Agent SDK仕様）に基づき、同じ知識を問う練習問題として作成しています。

## 問題を追加するには

`questions.js` の `window.QUESTIONS` 配列の末尾に、同じ形のオブジェクトを追加するだけです。

```js
{
  id: "agentic-006",                       // 一意なID
  domain: "Agentic Architecture & Orchestration", // 下記5つのいずれか（表記を一致させる）
  question_en: "英語の問題文",
  question_ja: "その和訳",
  choices: [
    { key: "A", en: "選択肢A（英語）", ja: "和訳" },
    { key: "B", en: "...", ja: "..." },
    { key: "C", en: "...", ja: "..." },
    { key: "D", en: "...", ja: "..." }
  ],
  answer: "B",              // 単一選択は "B"、複数選択は ["B","D"]
  explanation_en: "英語の解説",
  explanation_ja: "和訳の解説",
  vocab: [
    { word: "英単語", ja: "意味", example: "例文（任意）" }
  ]
}
```

`domain` に使える値（このいずれかと文字列一致させること）:
- `Agentic Architecture & Orchestration`
- `Prompt Engineering & Structured Output`
- `Claude Code Configuration & Workflows`
- `Tool Design & MCP Integration`
- `Context Management & Reliability`

## ファイル構成

| ファイル | 役割 |
|---|---|
| `index.html` | 画面の骨格・タブ |
| `styles.css` | スタイル（ライト/ダーク・レスポンシブ） |
| `questions.js` | 問題データ（`window.QUESTIONS`） |
| `app.js` | 出題・採点・進捗・単語・タブ切替のロジック |

## 今後の拡張（未実装）

- SRS（間隔反復）：間違えた問題・弱い単語を忘れる頃に自動再出題
- 問題の量産（本番想定の60問規模へ）
- 模試モード（時間制限つき通し受験）
