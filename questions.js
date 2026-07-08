// CCA-F 模擬問題データ（パイロット版 18問）
// 本物の試験問題は非公開。これは公式ドメイン比率＋公開情報（Anthropic Academy教材・
// 公式ドキュメント・MCP/Claude Code/Agent SDK仕様）に基づく「模擬問題」です。
// 本番はシナリオベース（「壊れている、どう直す?」）なので、暗記ではなく実務判断を問う形にしています。
//
// answer は単一選択なら "B"、複数選択なら ["B","D"]（choices の key と一致）。
// データを追加するときは、この配列の末尾に同じ形のオブジェクトを足すだけでOK。

window.QUESTIONS = [
  // ===== Agentic Architecture & Orchestration (27% → 5問) =====
  {
    id: "agentic-001",
    domain: "Agentic Architecture & Orchestration",
    question_en:
      "You are building an agent that calls tools in a loop. After each Claude API response, which field should your code inspect first to decide whether to execute a tool call or return the final answer to the user?",
    question_ja:
      "ツールをループで呼び出すエージェントを作っています。Claude APIの各応答の後、ツールを実行すべきか、最終回答をユーザーに返すべきかを判断するために、コードが最初に確認すべきフィールドはどれですか?",
    choices: [
      { key: "A", en: "The `role` field of the message", ja: "メッセージの `role` フィールド" },
      { key: "B", en: "The `stop_reason` field of the response", ja: "応答の `stop_reason` フィールド" },
      { key: "C", en: "The `usage.output_tokens` count", ja: "`usage.output_tokens`（出力トークン数）" },
      { key: "D", en: "The `id` of the response", ja: "応答の `id`" },
    ],
    answer: "B",
    explanation_en:
      "The agentic loop is: send request → check `stop_reason` → execute tool → return result → repeat. When `stop_reason` is `tool_use`, the model wants you to run a tool and feed the result back. When it is `end_turn`, the model is done and you return the answer. `role` is always `assistant` for responses, and token counts don't tell you the control flow.",
    explanation_ja:
      "エージェントループの基本は『send request → stop_reason を確認 → ツール実行 → 結果を返す → 繰り返す』です。`stop_reason` が `tool_use` ならツールを実行して結果を戻し、`end_turn` なら完了なので回答を返します。`role` は応答では常に `assistant` で、トークン数は制御フローを示しません。",
    vocab: [
      { word: "agentic loop", ja: "エージェントループ（モデル応答→ツール実行→結果返却を繰り返す制御構造）", example: "The agentic loop continues until stop_reason is end_turn." },
      { word: "stop_reason", ja: "停止理由（応答がなぜ終わったかを示すフィールド。tool_use / end_turn など）", example: "Check stop_reason to branch the control flow." },
      { word: "inspect", ja: "検査する／中身を確認する", example: "Inspect the response before executing a tool." },
    ],
  },
  {
    id: "agentic-002",
    domain: "Agentic Architecture & Orchestration",
    question_en:
      "A multi-agent research system uses one lead agent that spawns several subagents to search different sources in parallel. Which orchestration pattern best describes this design?",
    question_ja:
      "あるマルチエージェント調査システムでは、1つのリードエージェントが複数のサブエージェントを起動し、異なる情報源を並列で調べます。この設計を最もよく表すオーケストレーションのパターンはどれですか?",
    choices: [
      { key: "A", en: "Hub-and-spoke (coordinator–subagent)", ja: "ハブ&スポーク（コーディネーター–サブエージェント）" },
      { key: "B", en: "A single monolithic prompt", ja: "単一の巨大プロンプト" },
      { key: "C", en: "Peer-to-peer mesh with no coordinator", ja: "コーディネーター無しのピアツーピア・メッシュ" },
      { key: "D", en: "A fixed linear pipeline with no delegation", ja: "委譲のない固定的な直線パイプライン" },
    ],
    answer: "A",
    explanation_en:
      "A lead/coordinator agent that decomposes a task and delegates to subagents which report back is the hub-and-spoke (coordinator–subagent) pattern. Each subagent runs in its own isolated context, and the coordinator synthesizes their results. This is the canonical shape of a multi-agent research system.",
    explanation_ja:
      "タスクを分解してサブエージェントに委譲し、結果を集約するリード/コーディネーター型は『ハブ&スポーク（コーディネーター–サブエージェント）』パターンです。各サブエージェントは独立したコンテキストで動き、コーディネーターが結果を統合します。マルチエージェント調査システムの典型形です。",
    vocab: [
      { word: "hub-and-spoke", ja: "ハブ&スポーク（中心のコーディネーターが周辺のサブエージェントを統括する構造）", example: "The hub-and-spoke pattern centralizes coordination in the lead agent." },
      { word: "coordinator", ja: "コーディネーター（全体を統括し委譲する主エージェント）", example: "The coordinator delegates subtasks and synthesizes results." },
      { word: "spawn", ja: "（サブエージェント/プロセスを）生成する・起動する", example: "The lead agent spawns three subagents in parallel." },
      { word: "delegate", ja: "委譲する", example: "Delegate the search to a subagent to isolate its context." },
    ],
  },
  {
    id: "agentic-003",
    domain: "Agentic Architecture & Orchestration",
    question_en:
      "Your single agent's context window is filling up because one subtask requires reading many large files, and that noise is degrading the agent's later reasoning. What is the most appropriate technique?",
    question_ja:
      "あるサブタスクが多数の大きなファイルを読む必要があり、そのノイズで後続の推論の質が落ちています。単一エージェントのコンテキストウィンドウが埋まりつつあります。最も適切な手法はどれですか?",
    choices: [
      { key: "A", en: "Increase max_tokens on every request", ja: "毎回の max_tokens を増やす" },
      { key: "B", en: "Delegate that subtask to a subagent so its token consumption stays isolated", ja: "そのサブタスクをサブエージェントに委譲し、トークン消費を隔離する" },
      { key: "C", en: "Lower the temperature to 0", ja: "temperature を 0 に下げる" },
      { key: "D", en: "Switch to a smaller, faster model", ja: "より小さく速いモデルに切り替える" },
    ],
    answer: "B",
    explanation_en:
      "Forking the noisy subtask into a subagent keeps its large intermediate reads out of the parent's context — the subagent burns its own tokens and returns only a concise result. This preserves the parent agent's reasoning quality. Raising max_tokens or changing temperature/model does not address context pollution.",
    explanation_ja:
      "ノイズの多いサブタスクをサブエージェントに切り出す（フォークする）と、大きな中間読み込みは親のコンテキストに入らず、サブエージェントは自分のトークンを消費して簡潔な結果だけを返します。これで親エージェントの推論品質を保てます。max_tokens 増加や temperature/モデル変更ではコンテキスト汚染は解決しません。",
    vocab: [
      { word: "fork context", ja: "コンテキストをフォークする（サブエージェントに別コンテキストで処理させる）", example: "Fork context to a subagent when a subtask is token-heavy." },
      { word: "isolate", ja: "隔離する／分離する", example: "Isolate the subagent's token consumption from the parent." },
      { word: "context pollution", ja: "コンテキスト汚染（不要な情報でコンテキストが埋まり質が落ちること）", example: "Reading large files inline causes context pollution." },
      { word: "degrade", ja: "劣化させる／質を下げる", example: "Noise in context can degrade later reasoning." },
    ],
  },
  {
    id: "agentic-004",
    domain: "Agentic Architecture & Orchestration",
    question_en:
      "In an agentic loop, after the model returns a `tool_use` block and your code runs the tool, how must the tool's output be sent back to Claude in the next request?",
    question_ja:
      "エージェントループで、モデルが `tool_use` ブロックを返し、コードがツールを実行した後、ツールの出力を次のリクエストでClaudeにどう返さなければなりませんか?",
    choices: [
      { key: "A", en: "As a new `system` prompt", ja: "新しい `system` プロンプトとして" },
      { key: "B", en: "As a `user` message containing a `tool_result` block whose `tool_use_id` matches the call", ja: "呼び出しと一致する `tool_use_id` を持つ `tool_result` ブロックを含む `user` メッセージとして" },
      { key: "C", en: "As an `assistant` message with plain text", ja: "プレーンテキストの `assistant` メッセージとして" },
      { key: "D", en: "By editing the previous assistant message in place", ja: "直前の assistant メッセージをその場で書き換えて" },
    ],
    answer: "B",
    explanation_en:
      "Tool results are returned as a `user`-role message containing a `tool_result` content block, and its `tool_use_id` must match the `id` of the `tool_use` block the model emitted. This pairing lets Claude associate the result with the correct call. You append to the conversation; you never edit prior messages in place.",
    explanation_ja:
      "ツール結果は `tool_result` コンテンツブロックを含む `user` ロールのメッセージとして返し、その `tool_use_id` はモデルが出した `tool_use` ブロックの `id` と一致させる必要があります。この対応付けにより、Claudeは結果を正しい呼び出しに紐づけます。会話には追記していき、過去メッセージをその場で書き換えることはありません。",
    vocab: [
      { word: "tool_result", ja: "ツール結果ブロック（実行したツールの出力をモデルに返す content ブロック）", example: "Return the output in a tool_result block." },
      { word: "tool_use_id", ja: "ツール呼び出しID（tool_use と tool_result を対応づける識別子）", example: "The tool_use_id must match the original tool_use block." },
      { word: "append", ja: "末尾に追加する", example: "Append the tool result to the messages array." },
    ],
  },
  {
    id: "agentic-005",
    domain: "Agentic Architecture & Orchestration",
    question_en:
      "A task requires: (1) fetching data, (2) analyzing it, then (3) writing a report. You want the agent to plan these steps before acting. Which approach best reflects sound task decomposition?",
    question_ja:
      "あるタスクは (1) データ取得 → (2) 分析 → (3) レポート作成 を必要とします。エージェントに、行動前にこれらのステップを計画させたいです。健全なタスク分解を最もよく反映するアプローチはどれですか?",
    choices: [
      { key: "A", en: "Break the goal into ordered subtasks, then execute and verify each before moving on", ja: "ゴールを順序づけたサブタスクに分解し、各ステップを実行・検証してから次へ進む" },
      { key: "B", en: "Send one giant prompt asking for everything at once with no intermediate checks", ja: "中間チェック無しで全部を一度に求める1つの巨大プロンプトを送る" },
      { key: "C", en: "Randomly retry the whole task until it succeeds", ja: "成功するまでタスク全体をランダムに再試行する" },
      { key: "D", en: "Skip planning and let the model output the report first", ja: "計画を飛ばし、まずレポートを出力させる" },
    ],
    answer: "A",
    explanation_en:
      "Good task decomposition means breaking a goal into ordered, verifiable subtasks and checking each result before proceeding — this catches errors early and keeps the loop grounded. A single monolithic prompt gives no checkpoints; blind retries waste tokens; outputting the report first inverts the dependency order.",
    explanation_ja:
      "良いタスク分解とは、ゴールを順序づけられた検証可能なサブタスクに分け、各結果を確認してから次に進むことです。これでエラーを早期に捕まえ、ループを地に足のついた状態に保てます。巨大な単一プロンプトにはチェックポイントが無く、闇雲な再試行はトークンの浪費、レポートを先に出すのは依存順序の逆転です。",
    vocab: [
      { word: "task decomposition", ja: "タスク分解（大きな目標を小さなサブタスクに分けること）", example: "Task decomposition breaks a goal into ordered subtasks." },
      { word: "subtask", ja: "サブタスク（分解された小さな作業単位）", example: "Verify each subtask before moving on." },
      { word: "verify", ja: "検証する／確かめる", example: "Verify each result before proceeding to the next step." },
      { word: "monolithic", ja: "一枚岩の／巨大で分割されていない", example: "Avoid a monolithic prompt that does everything at once." },
    ],
  },

  // ===== Prompt Engineering & Structured Output (20% → 4問) =====
  {
    id: "prompt-001",
    domain: "Prompt Engineering & Structured Output",
    question_en:
      "You need Claude to return data that your downstream code can parse reliably as JSON matching a fixed shape. Which combination most reliably enforces the structure?",
    question_ja:
      "後続のコードがJSONとして確実にパースでき、固定の形に一致するデータをClaudeに返させたいです。構造を最も確実に強制する組み合わせはどれですか?",
    choices: [
      { key: "A", en: "Define a tool/schema for the output and validate the response, retrying on schema violations", ja: "出力用のツール/スキーマを定義し、応答を検証してスキーマ違反時に再試行する" },
      { key: "B", en: "Politely ask for JSON in the prompt and hope it complies", ja: "プロンプトで丁寧にJSONを頼み、従うことを期待する" },
      { key: "C", en: "Raise temperature to increase creativity", ja: "temperature を上げて創造性を高める" },
      { key: "D", en: "Ask for the answer in Markdown and parse it with regex", ja: "回答をMarkdownで求め、正規表現でパースする" },
    ],
    answer: "A",
    explanation_en:
      "The reliable pattern is: constrain the output with a JSON schema (often via a tool definition / structured output), then validate the returned object against that schema and run a retry loop if it violates. Prompt-only requests are best-effort; higher temperature reduces determinism; regex-parsing free text is brittle.",
    explanation_ja:
      "信頼できるパターンは、JSONスキーマ（ツール定義／構造化出力）で出力を制約し、返ってきたオブジェクトをスキーマで検証し、違反時は再試行ループを回すことです。プロンプトだけの依頼はベストエフォート、temperature上昇は決定性を下げ、自由文の正規表現パースは壊れやすいです。",
    vocab: [
      { word: "JSON schema", ja: "JSONスキーマ（出力の形・型を定義する仕様）", example: "Constrain the output with a JSON schema." },
      { word: "validate", ja: "検証する（スキーマに合っているか確かめる）", example: "Validate the response against the schema before using it." },
      { word: "retry loop", ja: "リトライループ（失敗時に再試行する仕組み）", example: "Run a validation retry loop on schema violations." },
      { word: "brittle", ja: "脆い／壊れやすい", example: "Regex-parsing free text is brittle." },
    ],
  },
  {
    id: "prompt-002",
    domain: "Prompt Engineering & Structured Output",
    question_en:
      "A classification prompt is inconsistent on edge cases. You add three carefully chosen input→label examples directly in the prompt and accuracy improves. What is this technique called?",
    question_ja:
      "ある分類プロンプトが、境界的なケースで一貫しません。慎重に選んだ入力→ラベルの例を3つプロンプトに直接加えると精度が向上しました。この手法は何と呼ばれますか?",
    choices: [
      { key: "A", en: "Few-shot prompting", ja: "Few-shot（少数事例）プロンプティング" },
      { key: "B", en: "Fine-tuning", ja: "ファインチューニング" },
      { key: "C", en: "Retrieval-augmented generation", ja: "検索拡張生成（RAG）" },
      { key: "D", en: "Temperature scaling", ja: "temperature スケーリング" },
    ],
    answer: "A",
    explanation_en:
      "Providing a handful of input→output examples in the prompt to steer behavior is few-shot prompting (as opposed to zero-shot). It needs no training. Fine-tuning changes model weights via training; RAG injects retrieved documents; temperature only affects randomness.",
    explanation_ja:
      "プロンプト内に入力→出力の例をいくつか与えて挙動を誘導するのがFew-shot（少数事例）プロンプティングです（zero-shotの対義）。学習は不要。ファインチューニングは学習でモデルの重みを変え、RAGは検索した文書を注入し、temperatureは乱雑さだけに影響します。",
    vocab: [
      { word: "few-shot", ja: "Few-shot（プロンプトに少数の例を示して誘導する手法）", example: "Few-shot examples improve accuracy on edge cases." },
      { word: "zero-shot", ja: "Zero-shot（例を示さず指示だけで解かせる手法）", example: "Zero-shot works when the task is simple and well-specified." },
      { word: "edge case", ja: "エッジケース／境界的なケース", example: "The prompt was inconsistent on edge cases." },
      { word: "steer", ja: "（挙動を）誘導する・方向づける", example: "Use examples to steer the model's behavior." },
    ],
  },
  {
    id: "prompt-003",
    domain: "Prompt Engineering & Structured Output",
    question_en:
      "You want Claude to reason through a hard multi-step math word problem before committing to a final answer, to reduce errors. Which prompting strategy directly supports this?",
    question_ja:
      "難しい多段階の文章題で、誤りを減らすために、最終回答を出す前にClaudeに段階的に推論させたいです。これを直接支えるプロンプト戦略はどれですか?",
    choices: [
      { key: "A", en: "Chain-of-thought: ask it to reason step by step before the final answer", ja: "Chain-of-thought：最終回答の前に段階的に推論させる" },
      { key: "B", en: "Demand only the final number with no reasoning", ja: "推論なしで最終的な数値だけを要求する" },
      { key: "C", en: "Set max_tokens to 1", ja: "max_tokens を 1 に設定する" },
      { key: "D", en: "Forbid the model from using any working steps", ja: "モデルに一切の途中計算を禁じる" },
    ],
    answer: "A",
    explanation_en:
      "Chain-of-thought prompting asks the model to work through intermediate reasoning steps before the final answer, which improves accuracy on multi-step problems. Suppressing reasoning or truncating output removes exactly the scratch space that reduces errors.",
    explanation_ja:
      "Chain-of-thought（思考の連鎖）プロンプティングは、最終回答の前に中間の推論ステップを踏ませる手法で、多段階問題の精度を上げます。推論を抑制したり出力を切り詰めたりすると、誤りを減らすための『下書きスペース』をまさに奪ってしまいます。",
    vocab: [
      { word: "chain-of-thought", ja: "思考の連鎖（段階的推論を明示させる手法）", example: "Chain-of-thought prompting improves multi-step accuracy." },
      { word: "reason step by step", ja: "段階的に推論する", example: "Ask the model to reason step by step." },
      { word: "commit to", ja: "（答えなどに）確定する・決める", example: "Reason before committing to a final answer." },
    ],
  },
  {
    id: "prompt-004",
    domain: "Prompt Engineering & Structured Output",
    question_en:
      "In the Claude API, what is the primary role of the `system` prompt compared to a `user` message?",
    question_ja:
      "Claude APIにおいて、`user` メッセージと比べたときの `system` プロンプトの主な役割は何ですか?",
    choices: [
      { key: "A", en: "It sets high-level role, rules, and persistent behavior for the whole conversation", ja: "会話全体にわたる高レベルな役割・ルール・恒常的な振る舞いを設定する" },
      { key: "B", en: "It is the only place tool results can be returned", ja: "ツール結果を返せる唯一の場所である" },
      { key: "C", en: "It stores the model's private chain-of-thought", ja: "モデルの内部的な思考の連鎖を保存する場所である" },
      { key: "D", en: "It is required on every single request or the API errors", ja: "毎リクエストに必須で、無いとAPIがエラーになる" },
    ],
    answer: "A",
    explanation_en:
      "The `system` prompt sets durable, high-level context — the model's role, tone, constraints, and rules — that applies across the whole conversation, while `user` messages carry the turn-by-turn requests. It is optional, does not carry tool_results (those go in user messages), and is not a store for hidden reasoning.",
    explanation_ja:
      "`system` プロンプトは、モデルの役割・トーン・制約・ルールといった持続的で高レベルな文脈を設定し、会話全体に適用されます。一方 `user` メッセージは各ターンの具体的な要求を運びます。system は任意で、tool_result は運ばず（それは user メッセージ）、隠れた推論の保管場所でもありません。",
    vocab: [
      { word: "system prompt", ja: "システムプロンプト（会話全体の役割・ルールを定める指示）", example: "The system prompt sets the model's role and rules." },
      { word: "persistent", ja: "持続的な／恒常的な", example: "System instructions have a persistent effect across turns." },
      { word: "constraint", ja: "制約", example: "Put behavioral constraints in the system prompt." },
    ],
  },

  // ===== Claude Code Configuration & Workflows (20% → 4問) =====
  {
    id: "claudecode-001",
    domain: "Claude Code Configuration & Workflows",
    question_en:
      "Your team wants project-specific conventions (build commands, code style, architectural notes) to be automatically available to Claude Code in every session for a repository. Where should these go?",
    question_ja:
      "チームは、あるリポジトリのプロジェクト固有の規約（ビルドコマンド、コードスタイル、設計メモ）を、Claude Codeの毎セッションで自動的に利用可能にしたいです。これらはどこに置くべきですか?",
    choices: [
      { key: "A", en: "A `CLAUDE.md` file committed to the repository", ja: "リポジトリにコミットした `CLAUDE.md` ファイル" },
      { key: "B", en: "A comment at the top of one random source file", ja: "適当な1つのソースファイルの先頭コメント" },
      { key: "C", en: "The commit message of the latest commit", ja: "最新コミットのコミットメッセージ" },
      { key: "D", en: "An environment variable set only on your laptop", ja: "自分のノートPCだけに設定した環境変数" },
    ],
    answer: "A",
    explanation_en:
      "`CLAUDE.md` is the memory file Claude Code loads automatically to learn project conventions, commands, and constraints. Committing it to the repo shares that context with the whole team and every session. The other options are neither discovered automatically nor shared.",
    explanation_ja:
      "`CLAUDE.md` は、Claude Codeがプロジェクトの規約・コマンド・制約を学ぶために自動で読み込むメモリファイルです。リポジトリにコミットすれば、その文脈がチーム全員・毎セッションで共有されます。他の選択肢は自動的に発見されず、共有もされません。",
    vocab: [
      { word: "convention", ja: "規約／慣習（コーディングやビルドの約束事）", example: "Document project conventions in CLAUDE.md." },
      { word: "repository", ja: "リポジトリ（コードを管理する保管場所）", example: "Commit CLAUDE.md to the repository so the team shares it." },
      { word: "commit", ja: "コミットする（変更をバージョン管理に記録する）", example: "Commit the file so every session picks it up." },
    ],
  },
  {
    id: "claudecode-002",
    domain: "Claude Code Configuration & Workflows",
    question_en:
      "You have both a `~/.claude/CLAUDE.md` (user-level) and a project `./CLAUDE.md`. How does Claude Code use these two files?",
    question_ja:
      "`~/.claude/CLAUDE.md`（ユーザーレベル）とプロジェクトの `./CLAUDE.md` の両方があります。Claude Codeはこの2つのファイルをどう扱いますか?",
    choices: [
      { key: "A", en: "Only the user-level file is ever read", ja: "ユーザーレベルのファイルだけが読まれる" },
      { key: "B", en: "They combine hierarchically: user-level plus project-level context both apply", ja: "階層的に統合され、ユーザーレベルとプロジェクトレベルの文脈が両方適用される" },
      { key: "C", en: "The project file is ignored unless the user file is deleted", ja: "ユーザーファイルを削除しない限りプロジェクトファイルは無視される" },
      { key: "D", en: "Only whichever file was edited most recently is read", ja: "最後に編集された方のファイルだけが読まれる" },
    ],
    answer: "B",
    explanation_en:
      "CLAUDE.md files form a hierarchy: user-level (global preferences that apply everywhere) combines with project-level (repo-specific conventions), and more specific/nested files add further context. They stack rather than override wholesale, giving Claude both your personal defaults and the project's rules.",
    explanation_ja:
      "CLAUDE.md は階層構造を作ります。ユーザーレベル（どこでも効く全体設定）とプロジェクトレベル（リポジトリ固有の規約）が統合され、さらにネストした個別ファイルが文脈を追加します。丸ごと上書きするのではなく積み重なるため、Claudeは個人の既定値とプロジェクトのルールの両方を得ます。",
    vocab: [
      { word: "hierarchy", ja: "階層（上位・下位が重なる構造）", example: "CLAUDE.md files form a hierarchy." },
      { word: "user-level", ja: "ユーザーレベル（そのユーザー全体に効く設定）", example: "User-level settings apply across all projects." },
      { word: "combine", ja: "統合する／組み合わせる", example: "The files combine rather than override each other." },
      { word: "nested", ja: "入れ子の／ネストした", example: "Nested CLAUDE.md files add more specific context." },
    ],
  },
  {
    id: "claudecode-003",
    domain: "Claude Code Configuration & Workflows",
    question_en:
      "Your team repeats the same multi-step prompt ('review the diff, run tests, summarize risks') many times a day in Claude Code. What is the cleanest way to make it a reusable, named shortcut?",
    question_ja:
      "チームは同じ多段プロンプト（『差分をレビューし、テストを実行し、リスクを要約』）をClaude Codeで1日に何度も繰り返しています。これを再利用可能な名前付きショートカットにする最もきれいな方法は?",
    choices: [
      { key: "A", en: "Define a custom slash command", ja: "カスタムスラッシュコマンドを定義する" },
      { key: "B", en: "Paste the full prompt from a text file each time", ja: "毎回テキストファイルから全文を貼り付ける" },
      { key: "C", en: "Memorize it and retype it", ja: "暗記して毎回打ち直す" },
      { key: "D", en: "Put it in a code comment", ja: "コードのコメントに書いておく" },
    ],
    answer: "A",
    explanation_en:
      "Custom slash commands let you save a reusable prompt/workflow under a name (e.g. `/review`) so the whole team can invoke it consistently in one keystroke. Re-pasting or retyping is error-prone and not shareable; a code comment isn't executable.",
    explanation_ja:
      "カスタムスラッシュコマンドを使うと、再利用可能なプロンプト/ワークフローを名前（例 `/review`）で保存でき、チーム全員が一発で一貫して呼び出せます。貼り直しや打ち直しはミスが起きやすく共有もできず、コードコメントは実行できません。",
    vocab: [
      { word: "slash command", ja: "スラッシュコマンド（/名前 で呼び出す再利用可能な操作）", example: "Define a custom slash command like /review." },
      { word: "reusable", ja: "再利用可能な", example: "A slash command makes the workflow reusable." },
      { word: "invoke", ja: "呼び出す／起動する", example: "The team can invoke /review in one keystroke." },
    ],
  },
  {
    id: "claudecode-004",
    domain: "Claude Code Configuration & Workflows",
    question_en:
      "You want Claude Code to run non-interactively in a CI pipeline to review each pull request and post findings. Which capability makes this possible?",
    question_ja:
      "各プルリクエストをレビューして所見を投稿させるため、Claude CodeをCIパイプラインで非対話的に実行したいです。これを可能にする機能はどれですか?",
    choices: [
      { key: "A", en: "Headless / non-interactive execution driven by a command with a prompt", ja: "プロンプト付きコマンドで駆動するヘッドレス／非対話実行" },
      { key: "B", en: "It is impossible; Claude Code only runs interactively", ja: "不可能。Claude Codeは対話モードでしか動かない" },
      { key: "C", en: "Manually typing answers into the CI console during the run", ja: "実行中にCIコンソールへ手で回答を打ち込む" },
      { key: "D", en: "Disabling all tools so nothing can run", ja: "全ツールを無効化して何も動かないようにする" },
    ],
    answer: "A",
    explanation_en:
      "Claude Code supports headless / non-interactive runs where you pass a prompt to a command and it executes without a human at the keyboard — ideal for CI/CD steps like automated PR review or CI gating. Interactive-only would defeat automation; manual typing isn't automation; disabling tools removes the ability to act.",
    explanation_ja:
      "Claude Codeは、コマンドにプロンプトを渡して人の操作なしで実行するヘッドレス／非対話実行に対応しており、自動PRレビューやCIゲートのようなCI/CDステップに最適です。対話専用では自動化の意味がなく、手打ちは自動化ではなく、ツール無効化は行動能力を奪います。",
    vocab: [
      { word: "headless", ja: "ヘッドレス（GUI/対話なしで実行するモード）", example: "Run Claude Code headless in CI." },
      { word: "non-interactive", ja: "非対話的な（人の入力を待たない）", example: "A non-interactive run needs the prompt up front." },
      { word: "CI/CD pipeline", ja: "CI/CDパイプライン（継続的インテグレーション/デリバリの自動処理列）", example: "Add a PR-review step to the CI/CD pipeline." },
      { word: "pull request", ja: "プルリクエスト（変更のマージ提案）", example: "Review each pull request automatically." },
    ],
  },

  // ===== Tool Design & MCP Integration (18% → 3問) =====
  {
    id: "mcp-001",
    domain: "Tool Design & MCP Integration",
    question_en:
      "The Model Context Protocol (MCP) defines three core primitives a server can expose. Which set is correct?",
    question_ja:
      "Model Context Protocol（MCP）は、サーバーが公開できる3つのコアプリミティブを定義します。正しい組み合わせはどれですか?",
    choices: [
      { key: "A", en: "Tools (executable functions), Resources (data), and Prompts (templates)", ja: "Tools（実行可能な関数）、Resources（データ）、Prompts（テンプレート）" },
      { key: "B", en: "Models, Weights, and Tokens", ja: "Models、Weights、Tokens" },
      { key: "C", en: "GET, POST, and DELETE", ja: "GET、POST、DELETE" },
      { key: "D", en: "Frontend, Backend, and Database", ja: "Frontend、Backend、Database" },
    ],
    answer: "A",
    explanation_en:
      "MCP is an open standard for connecting Claude to external systems. A server exposes three primitives: Tools (executable functions the model can call), Resources (data/content the model can read), and Prompts (reusable prompt templates). The other options are HTTP verbs or generic architecture terms, not MCP primitives.",
    explanation_ja:
      "MCPはClaudeを外部システムに接続するためのオープン標準です。サーバーは3つのプリミティブを公開します：Tools（モデルが呼べる実行可能な関数）、Resources（モデルが読めるデータ/コンテンツ）、Prompts（再利用可能なプロンプトテンプレート）。他はHTTPメソッドや一般的な構成用語で、MCPのプリミティブではありません。",
    vocab: [
      { word: "primitive", ja: "プリミティブ（プロトコルが定義する基本構成要素）", example: "MCP defines three core primitives." },
      { word: "expose", ja: "公開する／外部に提供する", example: "An MCP server exposes tools and resources." },
      { word: "open standard", ja: "オープン標準（誰でも実装できる公開仕様）", example: "MCP is an open standard for tool integration." },
      { word: "template", ja: "テンプレート（雛形）", example: "Prompts are reusable templates in MCP." },
    ],
  },
  {
    id: "mcp-002",
    domain: "Tool Design & MCP Integration",
    question_en:
      "You are designing a tool definition for Claude. Which practice most improves the model's ability to call the tool correctly?",
    question_ja:
      "Claude向けのツール定義を設計しています。モデルがそのツールを正しく呼び出せる能力を最も高めるプラクティスはどれですか?",
    choices: [
      { key: "A", en: "Write a clear description and a precise input JSON schema with typed, well-named parameters", ja: "明確な説明と、型付き・命名の良いパラメータを持つ厳密な入力JSONスキーマを書く" },
      { key: "B", en: "Leave the description blank to save tokens", ja: "トークン節約のため説明を空にする" },
      { key: "C", en: "Give every parameter the name `arg` and type `any`", ja: "全パラメータを名前 `arg`・型 `any` にする" },
      { key: "D", en: "Rely on the tool name alone with no schema", ja: "スキーマ無しでツール名だけに頼る" },
    ],
    answer: "A",
    explanation_en:
      "The model chooses and fills tools based on their descriptions and input schemas, so a clear description (what it does, when to use it) plus a precise, well-typed, well-named parameter schema dramatically improves correct usage. Blank descriptions, `any` types, and missing schemas leave the model guessing.",
    explanation_ja:
      "モデルはツールの説明と入力スキーマを手がかりに、どのツールをどう埋めて呼ぶかを決めます。したがって明確な説明（何をする/いつ使う）と、型が厳密で命名の良いパラメータスキーマは、正しい利用を劇的に高めます。空の説明・`any` 型・スキーマ欠如はモデルに推測を強います。",
    vocab: [
      { word: "tool definition", ja: "ツール定義（名前・説明・入力スキーマの仕様）", example: "A good tool definition has a clear description." },
      { word: "parameter", ja: "パラメータ（引数）", example: "Give each parameter a precise type and name." },
      { word: "typed", ja: "型付きの（型が明示された）", example: "Use a typed schema, not `any`." },
      { word: "precise", ja: "厳密な／正確な", example: "A precise schema reduces malformed calls." },
    ],
  },
  {
    id: "mcp-003",
    domain: "Tool Design & MCP Integration",
    question_en:
      "An agent connected via MCP needs read-only access to a set of company policy documents so Claude can cite them, but should NOT be able to execute actions against them. Which MCP primitive fits best?",
    question_ja:
      "MCP経由で接続したエージェントが、Claudeが引用できるよう社内ポリシー文書群への読み取り専用アクセスを必要としますが、それらに対してアクションを実行できてはいけません。最も適したMCPプリミティブは?",
    choices: [
      { key: "A", en: "Resources", ja: "Resources（リソース）" },
      { key: "B", en: "Tools", ja: "Tools（ツール）" },
      { key: "C", en: "Prompts", ja: "Prompts（プロンプト）" },
      { key: "D", en: "Webhooks", ja: "Webhooks（ウェブフック）" },
    ],
    answer: "A",
    explanation_en:
      "Resources expose data/content for the model to read (e.g. documents to cite) without granting execution. Tools are for executable actions — the opposite of what's wanted here. Prompts are reusable templates, and webhooks aren't an MCP primitive.",
    explanation_ja:
      "Resources は、モデルが読むためのデータ/コンテンツ（例：引用する文書）を、実行権限を与えずに公開します。Tools は実行アクション用で、ここで求められるものの逆です。Prompts は再利用テンプレート、webhooks はMCPのプリミティブではありません。",
    vocab: [
      { word: "read-only", ja: "読み取り専用（書き込み/実行不可）", example: "The agent needs read-only access to the docs." },
      { word: "cite", ja: "引用する／出典として示す", example: "Claude can cite the policy documents." },
      { word: "execute", ja: "実行する", example: "Resources let the model read but not execute." },
    ],
  },

  // ===== Context Management & Reliability (15% → 2問) =====
  {
    id: "context-001",
    domain: "Context Management & Reliability",
    question_en:
      "A long-running agent conversation is approaching the context window limit. You want to continue without losing the important decisions made so far. Which technique is most appropriate?",
    question_ja:
      "長時間動いているエージェントの会話がコンテキストウィンドウの上限に近づいています。これまでの重要な決定を失わずに続けたいです。最も適切な手法はどれですか?",
    choices: [
      { key: "A", en: "Summarize/compact the earlier context and hand off the distilled state into the continued session", ja: "以前の文脈を要約/圧縮し、蒸留した状態を継続セッションに引き継ぐ" },
      { key: "B", en: "Do nothing and let the oldest messages silently fall out", ja: "何もせず、古いメッセージが黙って落ちるに任せる" },
      { key: "C", en: "Restart from scratch with no memory of prior decisions", ja: "過去の決定の記憶なしでゼロからやり直す" },
      { key: "D", en: "Duplicate the entire history twice to be safe", ja: "念のため全履歴を2回複製する" },
    ],
    answer: "A",
    explanation_en:
      "Compaction/summarization plus a handoff preserves the important state (decisions, constraints, open threads) in a compact form so work continues coherently within the window. Letting messages fall out loses key context silently; restarting discards it; duplicating history wastes the very space you're short on.",
    explanation_ja:
      "圧縮/要約とハンドオフにより、重要な状態（決定・制約・未解決事項）を簡潔な形で保ち、ウィンドウ内で作業を一貫して継続できます。メッセージを落とすに任せると重要文脈を黙って失い、やり直しは破棄、履歴の複製は不足しているスペースをさらに浪費します。",
    vocab: [
      { word: "context window", ja: "コンテキストウィンドウ（モデルが一度に扱えるトークンの上限枠）", example: "The conversation is nearing the context window limit." },
      { word: "compaction", ja: "コンパクション（文脈を要約して圧縮すること）", example: "Compaction shrinks history while keeping key state." },
      { word: "handoff", ja: "ハンドオフ（状態を次のセッション/エージェントへ引き継ぐこと）", example: "Hand off the distilled state to the next session." },
      { word: "distilled", ja: "蒸留された／要点だけに絞った", example: "Carry the distilled state forward." },
    ],
  },
  {
    id: "context-002",
    domain: "Context Management & Reliability",
    question_en:
      "You want an agent to avoid asserting facts it is unsure about, and instead flag low-confidence answers or defer to a human. This design goal is best described as improving what?",
    question_ja:
      "エージェントが自信のない事実を断定するのを避け、代わりに確信度の低い回答にフラグを立てるか人間に委ねるようにしたいです。この設計目標は、何を高めるものと最もよく表現できますか?",
    choices: [
      { key: "A", en: "Confidence calibration / reliability", ja: "確信度のキャリブレーション／信頼性" },
      { key: "B", en: "Raw latency", ja: "生のレイテンシ（応答速度）" },
      { key: "C", en: "Token throughput", ja: "トークンスループット" },
      { key: "D", en: "Model parameter count", ja: "モデルのパラメータ数" },
    ],
    answer: "A",
    explanation_en:
      "Making the agent express appropriate uncertainty — flagging low-confidence outputs, deferring to humans, avoiding overconfident hallucinations — is confidence calibration, a core reliability concern. Latency, throughput, and parameter count are performance/scale attributes, not correctness/trust attributes.",
    explanation_ja:
      "エージェントに適切な不確実性を表現させること（確信度の低い出力にフラグを立てる、人間に委ねる、過信した幻覚を避ける）は確信度のキャリブレーションであり、信頼性の中核的関心事です。レイテンシ・スループット・パラメータ数は性能/規模の属性で、正しさ/信頼の属性ではありません。",
    vocab: [
      { word: "confidence calibration", ja: "確信度キャリブレーション（自信の度合いを実際の正しさに合わせること）", example: "Confidence calibration prevents overconfident answers." },
      { word: "defer to", ja: "（判断を）委ねる・任せる", example: "Defer to a human on low-confidence answers." },
      { word: "hallucination", ja: "幻覚（もっともらしい誤情報の生成）", example: "Calibration reduces overconfident hallucinations." },
      { word: "flag", ja: "フラグを立てる／印をつけて知らせる", example: "Flag low-confidence outputs for review." },
    ],
  },
];
