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

  // ===== Agentic Architecture & Orchestration（追加 006–016） =====
  {
    id: "agentic-006",
    domain: "Agentic Architecture & Orchestration",
    question_en:
      "Your agent loop keeps calling tools and never terminates on one pathological input — the model requests a tool, gets a result, and requests another indefinitely. What is the most reliable safeguard?",
    question_ja:
      "ある異常な入力に対し、エージェントループがツールを呼び続けて終了しません。モデルがツールを要求→結果取得→また要求、を延々と繰り返します。最も確実な安全策は?",
    choices: [
      { key: "A", en: "Add a maximum-iteration cap (and/or no-progress detection) that breaks the loop", ja: "最大反復回数の上限（かつ/または進捗なし検知）を設けてループを止める" },
      { key: "B", en: "Lower the temperature", ja: "temperature を下げる" },
      { key: "C", en: "Increase max_tokens", ja: "max_tokens を増やす" },
      { key: "D", en: "Remove all tools", ja: "全ツールを削除する" },
    ],
    answer: "A",
    explanation_en:
      "An agent loop needs a hard termination guard: cap the number of iterations (and optionally detect when successive steps make no progress) so a pathological case can't run forever. Temperature/max_tokens don't bound the number of tool cycles, and removing tools breaks the agent.",
    explanation_ja:
      "エージェントループには明確な終了ガードが必要です。反復回数に上限を設け（必要なら連続ステップが進捗ゼロかを検知）、異常ケースが無限に走らないようにします。temperature/max_tokens はツール反復回数を制限せず、ツール削除はエージェント自体を壊します。",
    vocab: [
      { word: "safeguard", ja: "安全策／歯止め", example: "A max-iteration safeguard prevents infinite loops." },
      { word: "terminate", ja: "終了する／止まる", example: "The loop must terminate on a stop condition." },
      { word: "cap", ja: "上限（を設ける）", example: "Cap the number of iterations at 10." },
    ],
  },
  {
    id: "agentic-007",
    domain: "Agentic Architecture & Orchestration",
    question_en:
      "In one response, Claude returns three `tool_use` blocks (parallel tool calls). After you execute all three tools, how should the results be sent back?",
    question_ja:
      "ある1回の応答で、Claudeが3つの `tool_use` ブロック（並列ツール呼び出し）を返しました。3つのツールを実行した後、結果はどう返すべきですか?",
    choices: [
      { key: "A", en: "As three separate `user` messages, one per result", ja: "結果ごとに3つの別々の `user` メッセージとして" },
      { key: "B", en: "As a single `user` message containing all three `tool_result` blocks", ja: "3つの `tool_result` ブロックすべてを含む1つの `user` メッセージとして" },
      { key: "C", en: "As an `assistant` message", ja: "`assistant` メッセージとして" },
      { key: "D", en: "Only the first result; drop the others", ja: "最初の結果だけ返し、残りは捨てる" },
    ],
    answer: "B",
    explanation_en:
      "All `tool_result` blocks for a parallel batch go back in a SINGLE `user` message. Splitting them across multiple messages can silently train the model to stop making parallel calls, and dropping results leaves tool_use blocks unmatched (an error). Each result must carry the matching `tool_use_id`.",
    explanation_ja:
      "並列バッチの `tool_result` は、すべて1つの `user` メッセージにまとめて返します。複数メッセージに分けるとモデルが並列呼び出しをやめるよう暗に学習してしまい、結果を捨てると tool_use ブロックが対応先を失いエラーになります。各結果は対応する `tool_use_id` を持たせます。",
    vocab: [
      { word: "parallel tool calls", ja: "並列ツール呼び出し（1応答で複数ツールを要求）", example: "Claude may emit parallel tool calls in one response." },
      { word: "batch", ja: "バッチ／まとめ", example: "Return the whole batch of results together." },
    ],
  },
  {
    id: "agentic-008",
    domain: "Agentic Architecture & Orchestration",
    question_en:
      "A task is a simple, strictly sequential pipeline (fetch → validate → save) with no parallelizable work. A teammate proposes a multi-agent coordinator–subagent system for it. What is the best assessment?",
    question_ja:
      "あるタスクは、並列化できる作業のない単純な直列パイプライン（取得→検証→保存）です。同僚がこれにマルチエージェント（コーディネーター–サブエージェント）構成を提案しました。最も適切な評価は?",
    choices: [
      { key: "A", en: "Multi-agent adds cost/latency with no benefit here — a single agent (or plain workflow) is the right fit", ja: "ここではマルチエージェントはコスト/レイテンシを増やすだけで利点がない。単一エージェント（または素直なワークフロー）が適切" },
      { key: "B", en: "Always use multi-agent; it is strictly better", ja: "常にマルチエージェントを使うべきで、無条件に優れている" },
      { key: "C", en: "Multi-agent is required for any tool use", ja: "ツールを使うなら必ずマルチエージェントが必要" },
      { key: "D", en: "Multi-agent reduces token usage for sequential tasks", ja: "直列タスクではマルチエージェントがトークン使用を減らす" },
    ],
    answer: "A",
    explanation_en:
      "Multi-agent orchestration pays off when work is parallelizable or needs isolated contexts — it adds coordination overhead, latency, and tokens. For a simple sequential pipeline that overhead buys nothing; a single agent or a code-orchestrated workflow is the right altitude.",
    explanation_ja:
      "マルチエージェントは、作業が並列化可能、または独立コンテキストが必要なときに効きます。調整のオーバーヘッド・レイテンシ・トークンが増えるため、単純な直列パイプラインではその代償に見合いません。単一エージェント、またはコードで統括するワークフローが適切な粒度です。",
    vocab: [
      { word: "overhead", ja: "オーバーヘッド（余分なコスト）", example: "Multi-agent adds coordination overhead." },
      { word: "sequential", ja: "直列の／順次の", example: "A sequential pipeline runs steps one after another." },
      { word: "parallelizable", ja: "並列化できる", example: "Use subagents only for parallelizable work." },
    ],
  },
  {
    id: "agentic-009",
    domain: "Agentic Architecture & Orchestration",
    question_en:
      "During an agentic loop, a tool call fails (the API it wraps times out). To let Claude recover gracefully rather than crash the loop, how should you return the failure?",
    question_ja:
      "エージェントループ中、ツール呼び出しが失敗しました（内部で呼ぶAPIがタイムアウト）。ループをクラッシュさせず、Claudeが適切にリカバリできるよう、失敗はどう返すべきですか?",
    choices: [
      { key: "A", en: "Return a `tool_result` with `is_error: true` and an informative error message", ja: "`is_error: true` と分かりやすいエラーメッセージを付けた `tool_result` を返す" },
      { key: "B", en: "Throw an exception and abort the whole conversation", ja: "例外を投げて会話全体を中断する" },
      { key: "C", en: "Silently return an empty result", ja: "黙って空の結果を返す" },
      { key: "D", en: "Return the error as a new system prompt", ja: "エラーを新しいシステムプロンプトとして返す" },
    ],
    answer: "A",
    explanation_en:
      "Return the failure as a `tool_result` block with `is_error: true` and a clear message. Claude sees the error and can retry, try a different approach, or ask for clarification. Aborting or returning empty/silent results hides the failure and prevents recovery.",
    explanation_ja:
      "失敗は `is_error: true` と明確なメッセージを付けた `tool_result` ブロックとして返します。Claudeはそのエラーを見て、再試行・別手段・確認質問といったリカバリができます。中断や空/無言の結果は失敗を隠し、回復を妨げます。",
    vocab: [
      { word: "is_error", ja: "エラーフラグ（tool_result が失敗であることを示す）", example: "Set is_error: true so the model can recover." },
      { word: "gracefully", ja: "適切に／穏当に（破綻せずに）", example: "Handle failures gracefully, not by crashing." },
      { word: "recover", ja: "回復する／立て直す", example: "The agent can recover from a returned error." },
    ],
  },
  {
    id: "agentic-010",
    domain: "Agentic Architecture & Orchestration",
    question_en:
      "You build a multi-turn agent with the Claude API. Between turns, the model seems to 'forget' earlier messages. What is the underlying reason and fix?",
    question_ja:
      "Claude APIでマルチターンのエージェントを作っています。ターンをまたぐとモデルが以前のメッセージを『忘れる』ようです。根本原因と対処は?",
    choices: [
      { key: "A", en: "The API is stateless — you must resend the full conversation history on every request", ja: "APIはステートレス。毎リクエストで会話履歴の全体を送り直す必要がある" },
      { key: "B", en: "The model has a per-user database you forgot to enable", ja: "ユーザーごとのDBがあり、有効化を忘れている" },
      { key: "C", en: "You must call a `save_memory` endpoint after each turn", ja: "各ターンの後に `save_memory` エンドポイントを呼ぶ必要がある" },
      { key: "D", en: "Lower the temperature to retain memory", ja: "temperature を下げると記憶が保持される" },
    ],
    answer: "A",
    explanation_en:
      "The Messages API is stateless: it has no server-side memory of prior turns. You maintain the conversation by appending each turn and resending the full `messages` history on every request. There is no automatic per-user memory or `save_memory` call.",
    explanation_ja:
      "Messages APIはステートレスで、過去のターンをサーバー側で記憶しません。各ターンを追記し、毎リクエストで `messages` 履歴の全体を送り直すことで会話を維持します。自動のユーザー別メモリや `save_memory` 呼び出しはありません。",
    vocab: [
      { word: "stateless", ja: "ステートレス（状態を保持しない）", example: "The Messages API is stateless." },
      { word: "conversation history", ja: "会話履歴", example: "Resend the full conversation history each request." },
      { word: "maintain", ja: "維持する／保つ", example: "You maintain state client-side by resending history." },
    ],
  },
  {
    id: "agentic-011",
    domain: "Agentic Architecture & Orchestration",
    question_en:
      "Using server-side tools (like web search), a response comes back with `stop_reason: \"pause_turn\"`. What does this mean and what should you do?",
    question_ja:
      "サーバーサイドツール（Web検索など）の利用中、応答が `stop_reason: \"pause_turn\"` で返りました。これは何を意味し、どうすべきですか?",
    choices: [
      { key: "A", en: "The server-side loop paused (e.g. hit an iteration limit); re-send the conversation to let it resume", ja: "サーバー側のループが一時停止した（反復上限などで）。会話を送り直して再開させる" },
      { key: "B", en: "The model refused; stop and show an error", ja: "モデルが拒否した。停止してエラーを表示する" },
      { key: "C", en: "The request is complete; ignore it", ja: "リクエスト完了。無視してよい" },
      { key: "D", en: "You must add a user message saying 'Continue.'", ja: "『続けて』というuserメッセージを追加する必要がある" },
    ],
    answer: "A",
    explanation_en:
      "`pause_turn` means a long-running server-side tool loop paused (e.g. reached its default iteration limit). Re-send the user message plus the assistant response and make another request — the server resumes automatically. Don't add a 'Continue.' message; the trailing server_tool_use block signals resumption.",
    explanation_ja:
      "`pause_turn` は、長時間走るサーバーサイドのツールループが一時停止したこと（例：既定の反復上限に到達）を意味します。userメッセージとassistant応答を付けて再リクエストすれば、サーバーが自動で再開します。『続けて』は不要で、末尾の server_tool_use ブロックが再開の合図になります。",
    vocab: [
      { word: "pause_turn", ja: "一時停止（サーバー側ループが中断し再開可能な状態）", example: "Handle pause_turn by re-sending to resume." },
      { word: "resume", ja: "再開する", example: "The server resumes the loop automatically." },
      { word: "iteration limit", ja: "反復上限", example: "The server-side loop hit its iteration limit." },
    ],
  },
  {
    id: "agentic-012",
    domain: "Agentic Architecture & Orchestration",
    question_en:
      "For a specific step, you want to guarantee Claude calls the `lookup_order` tool rather than answering from memory. Which mechanism enforces this?",
    question_ja:
      "ある特定のステップで、Claudeが記憶から答えるのではなく必ず `lookup_order` ツールを呼ぶよう保証したいです。これを強制する仕組みは?",
    choices: [
      { key: "A", en: "Set `tool_choice` to `{\"type\": \"tool\", \"name\": \"lookup_order\"}`", ja: "`tool_choice` を `{\"type\": \"tool\", \"name\": \"lookup_order\"}` に設定する" },
      { key: "B", en: "Delete every other tool from the request", ja: "他のツールをすべてリクエストから削除する" },
      { key: "C", en: "Set temperature to 0", ja: "temperature を 0 にする" },
      { key: "D", en: "Add 'YOU MUST' to the system prompt and hope", ja: "システムプロンプトに『必ず』と書いて期待する" },
    ],
    answer: "A",
    explanation_en:
      "`tool_choice: {type: \"tool\", name: ...}` forces the model to call that specific tool. `{type: \"any\"}` forces some tool, `{type: \"auto\"}` lets the model decide, `{type: \"none\"}` forbids tools. Deleting other tools is heavy-handed and prompt-only pleading isn't a guarantee.",
    explanation_ja:
      "`tool_choice: {type: \"tool\", name: ...}` はその特定ツールの呼び出しを強制します。`{type: \"any\"}` は何らかのツールを強制、`{type: \"auto\"}` はモデル判断、`{type: \"none\"}` はツール禁止です。他ツール削除は乱暴で、プロンプトでの懇願は保証になりません。",
    vocab: [
      { word: "tool_choice", ja: "ツール選択の制御（auto/any/tool/none）", example: "Use tool_choice to force a specific tool." },
      { word: "enforce", ja: "強制する／担保する", example: "tool_choice enforces the tool call." },
      { word: "heavy-handed", ja: "乱暴な／強引な", example: "Deleting tools is a heavy-handed fix." },
    ],
  },
  {
    id: "agentic-013",
    domain: "Agentic Architecture & Orchestration",
    question_en:
      "Your agent can call a `delete_records` tool that permanently removes customer data. Which design best balances autonomy with safety?",
    question_ja:
      "あなたのエージェントは、顧客データを恒久的に削除する `delete_records` ツールを呼べます。自律性と安全性を最もよく両立する設計は?",
    choices: [
      { key: "A", en: "Require human-in-the-loop confirmation before the destructive tool executes", ja: "破壊的なツールを実行する前に、人間による確認（human-in-the-loop）を必須にする" },
      { key: "B", en: "Let the agent run it automatically with no checks", ja: "確認なしでエージェントに自動実行させる" },
      { key: "C", en: "Rename the tool so the model can't find it", ja: "モデルが見つけられないようツール名を変える" },
      { key: "D", en: "Raise the temperature to make deletions rarer", ja: "temperature を上げて削除を稀にする" },
    ],
    answer: "A",
    explanation_en:
      "Hard-to-reverse or destructive actions should be gated behind human confirmation (human-in-the-loop). The agent proposes the action; a person approves before it runs. Auto-executing risks irreversible mistakes; hiding or randomizing the tool is not real safety.",
    explanation_ja:
      "取り消しにくい/破壊的なアクションは、人間の確認（human-in-the-loop）で門を設けるべきです。エージェントが提案し、実行前に人が承認します。自動実行は不可逆な誤りのリスク、ツールの隠蔽やランダム化は本当の安全策ではありません。",
    vocab: [
      { word: "human-in-the-loop", ja: "人間参加（実行前に人の承認を挟む）", example: "Gate destructive tools behind human-in-the-loop approval." },
      { word: "destructive", ja: "破壊的な（元に戻せない）", example: "delete_records is a destructive action." },
      { word: "irreversible", ja: "不可逆な／取り返しのつかない", example: "Confirm before irreversible actions." },
    ],
  },
  {
    id: "agentic-014",
    domain: "Agentic Architecture & Orchestration",
    question_en:
      "In a multi-agent research system, several subagents each return their findings. What is the coordinator agent's primary job at that point?",
    question_ja:
      "マルチエージェント調査システムで、複数のサブエージェントがそれぞれ調査結果を返してきました。その時点でコーディネーターエージェントの主な仕事は?",
    choices: [
      { key: "A", en: "Synthesize the subagents' results into a single coherent answer", ja: "サブエージェントの結果を統合し、一貫した1つの回答にまとめる" },
      { key: "B", en: "Discard the subagents and redo all work itself", ja: "サブエージェントを破棄し、全作業を自分でやり直す" },
      { key: "C", en: "Forward each raw result to the user separately", ja: "各生の結果を別々にそのままユーザーへ転送する" },
      { key: "D", en: "Spawn the same subagents again indefinitely", ja: "同じサブエージェントを無限に再生成し続ける" },
    ],
    answer: "A",
    explanation_en:
      "The coordinator decomposes the task, delegates to subagents, then synthesizes their returned findings into one coherent result. Redoing the work defeats delegation; dumping raw results loses the value of orchestration; re-spawning endlessly wastes resources.",
    explanation_ja:
      "コーディネーターはタスクを分解してサブエージェントに委譲し、返ってきた結果を統合して一貫した1つの成果にまとめます。やり直しは委譲の意味を失い、生結果の垂れ流しはオーケストレーションの価値を失い、無限再生成は資源の浪費です。",
    vocab: [
      { word: "synthesize", ja: "統合する／総合する", example: "The coordinator synthesizes subagent findings." },
      { word: "coherent", ja: "一貫した／筋の通った", example: "Produce one coherent answer, not fragments." },
      { word: "findings", ja: "調査結果／所見", example: "Each subagent returns its findings." },
    ],
  },
  {
    id: "agentic-015",
    domain: "Agentic Architecture & Orchestration",
    question_en:
      "You are designing a Customer Support Resolution Agent. A user asks something outside the agent's scope, or the agent's confidence is low. What behavior best reflects a reliable design?",
    question_ja:
      "カスタマーサポート解決エージェントを設計しています。ユーザーがエージェントの守備範囲外を尋ねる、またはエージェントの確信度が低い場合。信頼できる設計を最もよく反映する挙動は?",
    choices: [
      { key: "A", en: "Escalate to a human (or a fallback path) instead of guessing", ja: "推測せず、人間（またはフォールバック経路）にエスカレーションする" },
      { key: "B", en: "Always fabricate a confident-sounding answer", ja: "常に自信ありげな答えをでっち上げる" },
      { key: "C", en: "Silently end the conversation", ja: "黙って会話を終える" },
      { key: "D", en: "Loop forever until the user gives up", ja: "ユーザーが諦めるまで無限にループする" },
    ],
    answer: "A",
    explanation_en:
      "A reliable support agent recognizes the limits of its scope/confidence and escalates to a human or a defined fallback rather than fabricating an answer. Confident hallucination erodes trust; silent exits and endless loops are poor user experiences.",
    explanation_ja:
      "信頼できるサポートエージェントは、守備範囲や確信度の限界を認識し、答えをでっち上げるのではなく人間や定義済みのフォールバックへエスカレーションします。自信満々の幻覚は信頼を損ない、無言終了や無限ループは劣悪なUXです。",
    vocab: [
      { word: "escalate", ja: "エスカレーションする（上位/人間へ引き継ぐ）", example: "Escalate to a human when out of scope." },
      { word: "scope", ja: "スコープ／守備範囲", example: "The request was outside the agent's scope." },
      { word: "fallback", ja: "フォールバック（代替経路）", example: "Route to a fallback path on low confidence." },
    ],
  },
  {
    id: "agentic-016",
    domain: "Agentic Architecture & Orchestration",
    question_en:
      "You want to bound what an autonomous agent can do so it can't take unintended actions. Which is the strongest structural guardrail?",
    question_ja:
      "自律エージェントが意図しない行動を取れないよう、できることを制限したいです。最も強い構造的ガードレールは?",
    choices: [
      { key: "A", en: "Expose only a minimal, least-privilege set of tools the task actually needs", ja: "タスクに本当に必要な最小限（最小権限）のツールだけを公開する" },
      { key: "B", en: "Give it every tool and ask it politely to be careful", ja: "全ツールを与え、注意するよう丁寧に頼む" },
      { key: "C", en: "Increase max_tokens", ja: "max_tokens を増やす" },
      { key: "D", en: "Use a longer system prompt only", ja: "システムプロンプトを長くするだけ" },
    ],
    answer: "A",
    explanation_en:
      "Least privilege — exposing only the tools the task requires — is a structural guardrail: the agent physically cannot perform actions it has no tool for. Prompt-only pleading, larger token budgets, and long prompts don't remove the capability. Combine the tool allow-list with system-prompt constraints.",
    explanation_ja:
      "最小権限（タスクに必要なツールだけを公開）は構造的なガードレールです。ツールが無い行動は物理的に取れません。プロンプトでの懇願・トークン増加・長いプロンプトは能力自体を取り除きません。ツールの許可リストとシステムプロンプトの制約を組み合わせます。",
    vocab: [
      { word: "least privilege", ja: "最小権限（必要最小限だけ与える）", example: "Apply least privilege to the agent's tool set." },
      { word: "guardrail", ja: "ガードレール（安全のための制約）", example: "The tool allow-list is a structural guardrail." },
      { word: "allow-list", ja: "許可リスト（許可したものだけ通す）", example: "Restrict actions with a tool allow-list." },
    ],
  },

  // ===== Prompt Engineering & Structured Output（追加 005–012） =====
  {
    id: "prompt-005",
    domain: "Prompt Engineering & Structured Output",
    question_en:
      "Your prompt mixes instructions, a long document, and a question in one blob, and Claude sometimes confuses which part is which. What is a recommended fix?",
    question_ja:
      "プロンプトに指示・長い文書・質問が1つの塊で混在し、Claudeがどれがどれか時々混同します。推奨される対処は?",
    choices: [
      { key: "A", en: "Separate the parts with clear delimiters / XML-style tags (e.g. <document>…</document>)", ja: "明確な区切り／XML風タグ（例 <document>…</document>）で各部分を分ける" },
      { key: "B", en: "Remove all whitespace to save tokens", ja: "トークン節約のため空白を全部消す" },
      { key: "C", en: "Write everything in uppercase", ja: "全部を大文字で書く" },
      { key: "D", en: "Set temperature to 1", ja: "temperature を 1 にする" },
    ],
    answer: "A",
    explanation_en:
      "Claude responds well to explicit structure: wrap distinct parts in clear delimiters or XML-style tags so it can tell instructions from data from the question. Removing whitespace, uppercasing, or raising temperature don't clarify structure.",
    explanation_ja:
      "Claudeは明示的な構造に強く反応します。各部分を明確な区切りやXML風タグで囲めば、指示・データ・質問を区別できます。空白削除・大文字化・temperature上昇は構造を明確にしません。",
    vocab: [
      { word: "delimiter", ja: "区切り文字／デリミタ", example: "Use delimiters to separate sections." },
      { word: "tag", ja: "タグ（<...> の目印）", example: "Wrap the document in <document> tags." },
      { word: "blob", ja: "（区切りのない）ひと塊", example: "Don't send instructions and data as one blob." },
    ],
  },
  {
    id: "prompt-006",
    domain: "Prompt Engineering & Structured Output",
    question_en:
      "You pass a very long reference document plus a short question to Claude. For best long-context performance, where should the question go relative to the document?",
    question_ja:
      "非常に長い参照文書と短い質問をClaudeに渡します。長文脈で最良の性能を出すには、質問は文書に対してどこに置くべきですか?",
    choices: [
      { key: "A", en: "Put the long document first, then the question at the end", ja: "長い文書を先に置き、質問を最後に置く" },
      { key: "B", en: "Put the question first, then the document", ja: "質問を先に、次に文書を置く" },
      { key: "C", en: "Interleave the question randomly inside the document", ja: "質問を文書内にランダムに散りばめる" },
      { key: "D", en: "Put the question in the tool schema", ja: "質問をツールスキーマに入れる" },
    ],
    answer: "A",
    explanation_en:
      "For long-context tasks, place the bulk of the reference material (the long document) near the top and the query/instruction at the end. This ordering consistently improves answer quality on long inputs. Interleaving or mislocating the question hurts focus.",
    explanation_ja:
      "長文脈タスクでは、参照資料の本体（長い文書）を上部に、問い/指示を末尾に置きます。この順序は長い入力での回答品質を安定して高めます。質問を散らしたり誤った位置に置くと焦点がぼけます。",
    vocab: [
      { word: "long-context", ja: "長文脈（長い入力を扱う）", example: "Long-context prompts put data first, query last." },
      { word: "reference material", ja: "参照資料", example: "Place the reference material before the query." },
      { word: "query", ja: "問い合わせ／質問", example: "Put the query at the end of the prompt." },
    ],
  },
  {
    id: "prompt-007",
    domain: "Prompt Engineering & Structured Output",
    question_en:
      "Your instruction 'summarize this' yields wildly different lengths and formats each run. What is the most effective single change?",
    question_ja:
      "『これを要約して』という指示が、実行ごとに長さも形式もばらばらになります。最も効果的な単一の変更は?",
    choices: [
      { key: "A", en: "Be specific: state length, format, audience, and what to include/exclude", ja: "具体化する：長さ・形式・読者・含める/除くものを明示する" },
      { key: "B", en: "Repeat the word 'summarize' three times", ja: "『要約』を3回繰り返す" },
      { key: "C", en: "Increase temperature for consistency", ja: "一貫性のため temperature を上げる" },
      { key: "D", en: "Remove the instruction entirely", ja: "指示を完全に削除する" },
    ],
    answer: "A",
    explanation_en:
      "Vague instructions produce variable output. Specificity — desired length, format, audience, and inclusion/exclusion rules — constrains the result and improves consistency. Repetition doesn't add information, higher temperature increases variance, and removing the instruction removes control.",
    explanation_ja:
      "曖昧な指示はばらつく出力を生みます。具体化（望む長さ・形式・読者・含める/除くルール）が結果を制約し、一貫性を高めます。繰り返しは情報を足さず、temperature上昇はばらつきを増やし、指示の削除は制御を失います。",
    vocab: [
      { word: "specific", ja: "具体的な／明確な", example: "Be specific about length and format." },
      { word: "vague", ja: "曖昧な", example: "A vague instruction yields variable output." },
      { word: "consistency", ja: "一貫性", example: "Specificity improves output consistency." },
    ],
  },
  {
    id: "prompt-008",
    domain: "Prompt Engineering & Structured Output",
    question_en:
      "A Q&A assistant occasionally invents plausible-but-false facts. Besides grounding it in retrieved sources, which prompt instruction most reduces confident hallucinations?",
    question_ja:
      "あるQ&Aアシスタントが、時々もっともらしいが誤った事実を作り出します。検索した情報源で根拠づける以外に、自信満々の幻覚を最も減らすプロンプト指示は?",
    choices: [
      { key: "A", en: "Tell it to answer only from the provided sources and to say 'I don't know' when unsupported", ja: "提供した情報源からのみ答え、根拠がなければ『分からない』と言うよう指示する" },
      { key: "B", en: "Tell it to always give an answer no matter what", ja: "何があっても必ず答えるよう指示する" },
      { key: "C", en: "Raise the temperature", ja: "temperature を上げる" },
      { key: "D", en: "Ask for longer answers", ja: "より長い回答を求める" },
    ],
    answer: "A",
    explanation_en:
      "Instructing the model to answer only from provided sources and to explicitly say 'I don't know' when the answer isn't supported curbs confident fabrication. Forcing an answer, raising temperature, or demanding length all increase the chance of hallucination.",
    explanation_ja:
      "『提供された情報源からのみ答え、根拠がなければ〈分からない〉と明言する』よう指示すると、自信ありげな捏造を抑えられます。無理に答えさせる・temperatureを上げる・長さを求める、はいずれも幻覚の可能性を高めます。",
    vocab: [
      { word: "grounding", ja: "グラウンディング（根拠づけ）", example: "Grounding answers in sources reduces hallucination." },
      { word: "hallucination", ja: "幻覚（もっともらしい誤情報）", example: "Instruct 'say I don't know' to cut hallucinations." },
      { word: "unsupported", ja: "根拠のない／裏付けのない", example: "Decline to answer when unsupported by sources." },
    ],
  },
  {
    id: "prompt-009",
    domain: "Prompt Engineering & Structured Output",
    question_en:
      "You are doing deterministic data extraction where the same input should map to the same labels every time. Which setting is most appropriate?",
    question_ja:
      "同じ入力が毎回同じラベルに対応すべき、決定的なデータ抽出をしています。最も適切な設定は?",
    choices: [
      { key: "A", en: "Low temperature (or low effort) for maximally deterministic output", ja: "最大限に決定的な出力のため、低い temperature（または低い effort）" },
      { key: "B", en: "High temperature for creativity", ja: "創造性のため高い temperature" },
      { key: "C", en: "Random temperature per request", ja: "リクエストごとにランダムな temperature" },
      { key: "D", en: "It makes no difference at all", ja: "全く差はない" },
    ],
    answer: "A",
    explanation_en:
      "For deterministic tasks like classification and extraction, use low temperature (or low effort on adaptive-thinking models) to minimize randomness and maximize repeatability. High or random temperature increases variance — the opposite of what extraction needs. (Note: low temperature reduces but never fully guarantees identical output.)",
    explanation_ja:
      "分類や抽出のような決定的タスクでは、低い temperature（アダプティブ思考モデルなら低い effort）で乱雑さを最小化し再現性を最大化します。高い/ランダムな temperature はばらつきを増やし、抽出の狙いと逆です（低温でも完全な同一出力までは保証しません）。",
    vocab: [
      { word: "deterministic", ja: "決定的な（同じ入力→同じ出力）", example: "Extraction wants deterministic output." },
      { word: "temperature", ja: "温度（出力の乱雑さを調整するパラメータ）", example: "Use low temperature for classification." },
      { word: "repeatability", ja: "再現性", example: "Low temperature maximizes repeatability." },
    ],
  },
  {
    id: "prompt-010",
    domain: "Prompt Engineering & Structured Output",
    question_en:
      "A Structured Data Extraction pipeline sometimes returns JSON your parser rejects (missing fields, wrong types). Select the practices that make the output reliably conform to your schema.",
    question_ja:
      "あるStructured Data Extractionのパイプラインが、時々パーサーが弾くJSON（欠損フィールド・型違い）を返します。出力をスキーマに確実に一致させるプラクティスをすべて選んでください。",
    choices: [
      { key: "A", en: "Constrain output with a strict JSON schema (structured output / strict tool)", ja: "厳密なJSONスキーマ（構造化出力／strictツール）で出力を制約する" },
      { key: "B", en: "Validate the response against the schema and retry on violations", ja: "応答をスキーマで検証し、違反時に再試行する" },
      { key: "C", en: "Parse the JSON string with a JSON parser, not regex", ja: "JSON文字列は正規表現でなくJSONパーサーでパースする" },
      { key: "D", en: "Ask for the data as free-form prose and eyeball it", ja: "データを自由記述の文章で求め、目視で確認する" },
    ],
    answer: ["A", "B", "C"],
    explanation_en:
      "Reliable extraction combines: (A) constraining the output with a strict schema, (B) validating and running a retry loop on violations, and (C) parsing with a real JSON parser (not brittle regex). Free-form prose (D) removes the very structure you need.",
    explanation_ja:
      "信頼できる抽出は、(A) 厳密なスキーマで出力を制約し、(B) 検証して違反時に再試行ループを回し、(C) 壊れやすい正規表現でなく本物のJSONパーサーでパースする、の組み合わせです。自由記述(D)は必要な構造をまさに失わせます。",
    vocab: [
      { word: "conform to", ja: "（規格・スキーマに）一致する・従う", example: "Make the output conform to your schema." },
      { word: "strict schema", ja: "厳密なスキーマ（追加項目を禁じる等）", example: "A strict schema guarantees valid fields." },
      { word: "validate and retry", ja: "検証して再試行する", example: "Validate the JSON and retry on violation." },
    ],
  },
  {
    id: "prompt-011",
    domain: "Prompt Engineering & Structured Output",
    question_en:
      "You want Claude to consistently behave as a meticulous financial analyst across a long multi-turn session. Where should you establish that persona?",
    question_ja:
      "長いマルチターンのセッション全体で、Claudeに几帳面な財務アナリストとして一貫してふるまわせたいです。その役割（ペルソナ）はどこで確立すべきですか?",
    choices: [
      { key: "A", en: "In the `system` prompt, which sets durable role and behavior for the whole conversation", ja: "会話全体の持続的な役割と挙動を定める `system` プロンプト" },
      { key: "B", en: "Repeated in every single user message", ja: "毎回すべての user メッセージに繰り返す" },
      { key: "C", en: "In a tool_result block", ja: "tool_result ブロックの中" },
      { key: "D", en: "It cannot be controlled", ja: "制御できない" },
    ],
    answer: "A",
    explanation_en:
      "Persona, tone, and standing rules belong in the `system` prompt — it applies across the whole conversation without being repeated. Restating it in every user turn is wasteful and error-prone; tool_result blocks carry tool output, not role definitions.",
    explanation_ja:
      "ペルソナ・トーン・恒常的なルールは `system` プロンプトに置きます。繰り返さなくても会話全体に適用されます。毎ターン書き直すのは無駄でミスも起きやすく、tool_result ブロックはツール出力を運ぶもので役割定義の場所ではありません。",
    vocab: [
      { word: "persona", ja: "ペルソナ（振る舞いの役割・人格）", example: "Set the persona in the system prompt." },
      { word: "durable", ja: "持続的な／長持ちする", example: "The system prompt sets durable behavior." },
      { word: "meticulous", ja: "几帳面な／細部まで丁寧な", example: "Behave as a meticulous analyst." },
    ],
  },
  {
    id: "prompt-012",
    domain: "Prompt Engineering & Structured Output",
    question_en:
      "A hard reasoning task benefits from step-by-step thinking, but you don't want the long reasoning cluttering the final user-facing answer. On adaptive-thinking Claude models, what is the intended approach?",
    question_ja:
      "難しい推論タスクは段階的思考が有効ですが、長い推論が最終的なユーザー向け回答を散らかすのは避けたいです。アダプティブ思考のClaudeモデルでは、意図された手法は?",
    choices: [
      { key: "A", en: "Enable adaptive thinking (with effort) so the model reasons internally, then returns a clean final answer", ja: "アダプティブ思考（effort付き）を有効にし、内部で推論させてから整った最終回答を返させる" },
      { key: "B", en: "Force it to print all reasoning in the answer every time", ja: "毎回すべての推論を回答に印字させる" },
      { key: "C", en: "Set max_tokens to 1", ja: "max_tokens を 1 にする" },
      { key: "D", en: "Forbid any reasoning at all", ja: "一切の推論を禁じる" },
    ],
    answer: "A",
    explanation_en:
      "Adaptive thinking lets the model reason internally (depth tuned by the effort setting) and return a clean final answer, so you get the accuracy of step-by-step reasoning without dumping it into the user reply. Forcing all reasoning into the answer clutters it; suppressing reasoning or truncating output removes the accuracy benefit.",
    explanation_ja:
      "アダプティブ思考は、モデルに内部で推論させ（深さは effort で調整）、整った最終回答を返させます。段階的推論の精度を得つつ、それをユーザー返信に垂れ流さずに済みます。全推論を回答に強制すると散らかり、推論の抑制や出力の切り詰めは精度の利点を失います。",
    vocab: [
      { word: "adaptive thinking", ja: "アダプティブ思考（モデルが思考量を自動調整）", example: "Enable adaptive thinking for hard reasoning." },
      { word: "effort", ja: "エフォート（思考の深さ/トークン量の設定）", example: "Tune reasoning depth with the effort setting." },
      { word: "clutter", ja: "散らかす／ごちゃつかせる", example: "Don't clutter the answer with raw reasoning." },
    ],
  },

  // ===== Claude Code Configuration & Workflows（追加 005–012） =====
  {
    id: "claudecode-005",
    domain: "Claude Code Configuration & Workflows",
    question_en:
      "You want to define a reusable `/deploy-check` custom slash command for a project so the whole team can invoke it. Where does its definition live?",
    question_ja:
      "プロジェクトに再利用可能なカスタムスラッシュコマンド `/deploy-check` を定義し、チーム全員が呼べるようにしたいです。その定義はどこに置きますか?",
    choices: [
      { key: "A", en: "A Markdown file under the project's `.claude/commands/` directory", ja: "プロジェクトの `.claude/commands/` ディレクトリ配下のMarkdownファイル" },
      { key: "B", en: "Inside a source code comment", ja: "ソースコードのコメント内" },
      { key: "C", en: "In the git commit message", ja: "gitのコミットメッセージ" },
      { key: "D", en: "In a random text file on your desktop", ja: "デスクトップの適当なテキストファイル" },
    ],
    answer: "A",
    explanation_en:
      "Custom slash commands are Markdown files in `.claude/commands/` (project) or `~/.claude/commands/` (user). Committing the project file shares the command with the whole team. Comments, commit messages, and stray files aren't discovered as commands.",
    explanation_ja:
      "カスタムスラッシュコマンドは `.claude/commands/`（プロジェクト）や `~/.claude/commands/`（ユーザー）のMarkdownファイルです。プロジェクト側をコミットすればチーム全員で共有できます。コメント・コミットメッセージ・散らばったファイルはコマンドとして認識されません。",
    vocab: [
      { word: "custom slash command", ja: "カスタムスラッシュコマンド（自作の /コマンド）", example: "Define a custom slash command in .claude/commands/." },
      { word: "directory", ja: "ディレクトリ（フォルダ）", example: "The command lives in the .claude/commands/ directory." },
      { word: "invoke", ja: "呼び出す", example: "The team can invoke /deploy-check." },
    ],
  },
  {
    id: "claudecode-006",
    domain: "Claude Code Configuration & Workflows",
    question_en:
      "For a repository, you want to pre-approve certain safe commands so Claude Code doesn't prompt for permission each time, while still blocking risky ones. Where do you configure this?",
    question_ja:
      "あるリポジトリで、安全な特定コマンドを事前承認してClaude Codeが毎回許可を求めないようにしつつ、危険なものはブロックしたいです。どこで設定しますか?",
    choices: [
      { key: "A", en: "Permission rules (allow/deny) in `.claude/settings.json`", ja: "`.claude/settings.json` の許可/拒否ルール" },
      { key: "B", en: "By deleting Claude Code", ja: "Claude Codeを削除して" },
      { key: "C", en: "In the README prose", ja: "READMEの本文で" },
      { key: "D", en: "It cannot be configured", ja: "設定できない" },
    ],
    answer: "A",
    explanation_en:
      "Claude Code permissions — allow/deny rules for tools and commands — are configured in `settings.json` (project `.claude/settings.json`, or user settings). This lets safe operations run without prompts while risky ones stay gated. README prose isn't executable configuration.",
    explanation_ja:
      "Claude Codeの権限（ツールやコマンドの許可/拒否ルール）は `settings.json`（プロジェクトの `.claude/settings.json` やユーザー設定）で構成します。安全な操作はプロンプトなしで走り、危険なものは門を維持できます。READMEの本文は実行可能な設定ではありません。",
    vocab: [
      { word: "permission", ja: "権限／許可", example: "Configure permissions in settings.json." },
      { word: "pre-approve", ja: "事前承認する", example: "Pre-approve safe commands to skip prompts." },
      { word: "settings.json", ja: "設定ファイル（Claude Codeの構成）", example: "Allow/deny rules go in settings.json." },
    ],
  },
  {
    id: "claudecode-007",
    domain: "Claude Code Configuration & Workflows",
    question_en:
      "You want Claude Code, when used in a specific repository, to have access to your team's internal MCP server (tools + data). What is the standard way to declare it for the project?",
    question_ja:
      "特定のリポジトリで使うとき、Claude Codeにチーム内部のMCPサーバー（ツール＋データ）へのアクセスを持たせたいです。プロジェクト用に宣言する標準的な方法は?",
    choices: [
      { key: "A", en: "Configure the MCP server in the project's `.mcp.json` (or Claude Code MCP settings)", ja: "プロジェクトの `.mcp.json`（またはClaude CodeのMCP設定）でMCPサーバーを構成する" },
      { key: "B", en: "Paste the server URL into every prompt", ja: "毎プロンプトにサーバーURLを貼り付ける" },
      { key: "C", en: "Rename the repository after the server", ja: "リポジトリ名をサーバー名に変える" },
      { key: "D", en: "MCP servers can't be used with Claude Code", ja: "Claude CodeではMCPサーバーは使えない" },
    ],
    answer: "A",
    explanation_en:
      "Project-scoped MCP servers are declared in an `.mcp.json` file (or Claude Code's MCP configuration), which Claude Code loads to connect and expose the server's tools/resources. Pasting URLs per prompt isn't persistent or shareable, and Claude Code fully supports MCP.",
    explanation_ja:
      "プロジェクト単位のMCPサーバーは `.mcp.json` ファイル（またはClaude CodeのMCP設定）で宣言し、Claude Codeがそれを読み込んで接続し、サーバーのツール/リソースを公開します。プロンプトごとのURL貼り付けは永続的でも共有可能でもなく、Claude CodeはMCPに完全対応しています。",
    vocab: [
      { word: ".mcp.json", ja: "プロジェクトのMCP設定ファイル", example: "Declare project MCP servers in .mcp.json." },
      { word: "declare", ja: "宣言する／定義する", example: "Declare the MCP server for the project." },
      { word: "internal", ja: "内部の／社内の", example: "Connect to the team's internal MCP server." },
    ],
  },
  {
    id: "claudecode-008",
    domain: "Claude Code Configuration & Workflows",
    question_en:
      "A large Claude Code task involves independent sub-tasks (search the codebase, review tests, check docs) that could run without shared state. Which Claude Code capability fits best?",
    question_ja:
      "大きなClaude Codeのタスクに、共有状態なしで走れる独立サブタスク（コードベース検索・テストのレビュー・ドキュメント確認）が含まれます。最も適したClaude Codeの機能は?",
    choices: [
      { key: "A", en: "Delegate to subagents (custom agent types), each with its own isolated context", ja: "サブエージェント（カスタムエージェントタイプ）に委譲し、各自が独立したコンテキストを持つ" },
      { key: "B", en: "Paste all files into one giant prompt", ja: "全ファイルを1つの巨大プロンプトに貼る" },
      { key: "C", en: "Disable all tools", ja: "全ツールを無効化する" },
      { key: "D", en: "Run everything as a single blocking step", ja: "すべてを単一のブロッキング処理として実行する" },
    ],
    answer: "A",
    explanation_en:
      "Subagents let Claude Code delegate independent sub-tasks, each running in its own isolated context so their token consumption and noise don't pollute the main thread. A single giant prompt loses that isolation and can blow the context window; disabling tools removes ability.",
    explanation_ja:
      "サブエージェントを使うと、Claude Codeは独立サブタスクを委譲でき、各自が独立コンテキストで動くためトークン消費やノイズが本流を汚しません。巨大な単一プロンプトはその隔離を失いコンテキストを溢れさせかねず、ツール無効化は能力を奪います。",
    vocab: [
      { word: "subagent", ja: "サブエージェント（委譲先の下位エージェント）", example: "Delegate independent work to subagents." },
      { word: "isolated context", ja: "独立したコンテキスト", example: "Each subagent runs in an isolated context." },
      { word: "pollute", ja: "汚染する（不要情報で埋める）", example: "Isolation keeps subagent noise from polluting the main thread." },
    ],
  },
  {
    id: "claudecode-009",
    domain: "Claude Code Configuration & Workflows",
    question_en:
      "Your team wants an action to run automatically every time — e.g. run a formatter after Claude Code edits a file — without asking the model to remember. Which Claude Code feature enforces this deterministically?",
    question_ja:
      "Claude Codeがファイルを編集するたびにフォーマッタを走らせる、といった処理を、モデルに覚えさせるのではなく毎回自動で走らせたいです。これを決定的に強制するClaude Codeの機能は?",
    choices: [
      { key: "A", en: "Hooks (e.g. PreToolUse / PostToolUse) configured to run commands on events", ja: "イベントでコマンドを走らせるフック（例 PreToolUse / PostToolUse）" },
      { key: "B", en: "Hoping the model remembers to do it", ja: "モデルが覚えていることを期待する" },
      { key: "C", en: "A code comment", ja: "コードコメント" },
      { key: "D", en: "Raising max_tokens", ja: "max_tokens を上げる" },
    ],
    answer: "A",
    explanation_en:
      "Hooks (such as PreToolUse / PostToolUse) run shell commands automatically on defined events — the harness executes them deterministically, independent of whether the model 'remembers.' Relying on the model, comments, or token budgets can't guarantee an automated step.",
    explanation_ja:
      "フック（PreToolUse / PostToolUse など）は、定義したイベントでシェルコマンドを自動実行します。ハーネスが決定的に実行するため、モデルが『覚えているか』に依存しません。モデル頼み・コメント・トークン量では自動ステップを保証できません。",
    vocab: [
      { word: "hook", ja: "フック（イベント時に自動実行される仕組み）", example: "Use a PostToolUse hook to run a formatter." },
      { word: "deterministically", ja: "決定的に（必ず同じように）", example: "Hooks run deterministically on each event." },
      { word: "event", ja: "イベント（きっかけとなる出来事）", example: "PreToolUse fires on a tool-call event." },
    ],
  },
  {
    id: "claudecode-010",
    domain: "Claude Code Configuration & Workflows",
    question_en:
      "Which content is appropriate to put in a committed project `CLAUDE.md`?",
    question_ja:
      "コミットするプロジェクトの `CLAUDE.md` に置くのが適切な内容はどれですか?",
    choices: [
      { key: "A", en: "Build/test commands, code conventions, and architectural notes", ja: "ビルド/テストのコマンド、コード規約、設計メモ" },
      { key: "B", en: "Production database passwords and API keys", ja: "本番DBのパスワードやAPIキー" },
      { key: "C", en: "Your personal to-do list unrelated to the project", ja: "プロジェクトと無関係な個人のToDo" },
      { key: "D", en: "Large binary blobs", ja: "大きなバイナリの塊" },
    ],
    answer: "A",
    explanation_en:
      "`CLAUDE.md` should carry durable, shareable project context: how to build and test, conventions, and architecture. Never put secrets (passwords, API keys) in it — it's committed and readable by everyone. Personal to-dos and binaries don't belong there.",
    explanation_ja:
      "`CLAUDE.md` には、持続的で共有可能なプロジェクト文脈（ビルド/テスト方法・規約・設計）を書きます。秘密情報（パスワード・APIキー）は絶対に入れないこと。コミットされ全員が読めます。個人ToDoやバイナリも場違いです。",
    vocab: [
      { word: "convention", ja: "規約／慣習", example: "Document code conventions in CLAUDE.md." },
      { word: "secret", ja: "機密情報（鍵・パスワード等）", example: "Never commit secrets to CLAUDE.md." },
      { word: "committed", ja: "コミットされた（リポジトリに記録済み）", example: "A committed file is visible to the whole team." },
    ],
  },
  {
    id: "claudecode-011",
    domain: "Claude Code Configuration & Workflows",
    question_en:
      "A new engineer keeps re-explaining the same build steps and conventions to Claude Code, and re-typing the same multi-step review prompt. Which combination fixes both?",
    question_ja:
      "新しいエンジニアが、同じビルド手順や規約をClaude Codeに毎回説明し直し、同じ多段のレビュー用プロンプトを打ち直しています。両方を解決する組み合わせは?",
    choices: [
      { key: "A", en: "Put conventions in `CLAUDE.md`, and save the review workflow as a custom slash command", ja: "規約を `CLAUDE.md` に置き、レビュー手順をカスタムスラッシュコマンドとして保存する" },
      { key: "B", en: "Ask everyone to memorize it", ja: "全員に暗記させる" },
      { key: "C", en: "Increase the temperature", ja: "temperature を上げる" },
      { key: "D", en: "Delete the repository history", ja: "リポジトリ履歴を削除する" },
    ],
    answer: "A",
    explanation_en:
      "`CLAUDE.md` gives every session the project's build steps and conventions automatically, and a custom slash command turns the repeated multi-step review into a one-word invocation shared across the team. Memorization, temperature, and deleting history solve neither problem.",
    explanation_ja:
      "`CLAUDE.md` は毎セッションにビルド手順や規約を自動で与え、カスタムスラッシュコマンドは繰り返しの多段レビューを一語の呼び出しにしてチームで共有します。暗記・temperature・履歴削除はどちらの問題も解決しません。",
    vocab: [
      { word: "onboarding", ja: "オンボーディング（新人の立ち上げ）", example: "CLAUDE.md speeds up onboarding." },
      { word: "reusable", ja: "再利用可能な", example: "A slash command makes the review reusable." },
      { word: "combination", ja: "組み合わせ", example: "The combination fixes both problems." },
    ],
  },
  {
    id: "claudecode-012",
    domain: "Claude Code Configuration & Workflows",
    question_en:
      "In a CI pipeline you run Claude Code non-interactively and need to parse its result programmatically to gate the build. Which invocation style fits?",
    question_ja:
      "CIパイプラインでClaude Codeを非対話的に実行し、その結果をプログラムでパースしてビルドをゲートしたいです。適した実行スタイルは?",
    choices: [
      { key: "A", en: "Headless/print mode with a prompt (e.g. `claude -p \"…\"`) and a machine-readable output format such as JSON", ja: "プロンプト付きのヘッドレス/print モード（例 `claude -p \"…\"`）と、JSONなど機械可読な出力形式" },
      { key: "B", en: "Open the interactive UI and type answers by hand during CI", ja: "対話UIを開き、CI中に手で回答を打ち込む" },
      { key: "C", en: "Screenshot the terminal and OCR it", ja: "ターミナルをスクショしてOCRする" },
      { key: "D", en: "It's impossible in CI", ja: "CIでは不可能" },
    ],
    answer: "A",
    explanation_en:
      "For CI, run Claude Code headless with a prompt (`-p`/print mode) and request a structured, machine-readable output format (e.g. JSON) so the pipeline can parse the result and gate the build. Interactive typing and OCR aren't automation-friendly.",
    explanation_ja:
      "CIでは、プロンプト付きのヘッドレス実行（`-p`/printモード）で動かし、構造化された機械可読な出力形式（例：JSON）を要求すれば、パイプラインが結果をパースしてビルドをゲートできます。手打ちやOCRは自動化に向きません。",
    vocab: [
      { word: "headless", ja: "ヘッドレス（対話UIなしで実行）", example: "Run Claude Code headless in CI." },
      { word: "machine-readable", ja: "機械可読な（プログラムが解析できる）", example: "Request machine-readable JSON output." },
      { word: "gate", ja: "ゲートする（条件で通す/止める）", example: "Parse the result to gate the build." },
    ],
  },

  // ===== Tool Design & MCP Integration（追加 004–011） =====
  {
    id: "mcp-004",
    domain: "Tool Design & MCP Integration",
    question_en:
      "You are connecting Claude to a local MCP server running on the same machine as the client, versus a shared MCP server hosted remotely. Which transports typically match these two cases?",
    question_ja:
      "クライアントと同じマシンで動くローカルMCPサーバーへ接続する場合と、リモートでホストされた共有MCPサーバーへ接続する場合。この2ケースに一般的に合うトランスポートは?",
    choices: [
      { key: "A", en: "Local → stdio; remote → HTTP-based (streamable HTTP / SSE)", ja: "ローカル → stdio、リモート → HTTPベース（streamable HTTP / SSE）" },
      { key: "B", en: "Both must use email", ja: "両方ともメールを使う" },
      { key: "C", en: "Local → FTP; remote → stdio", ja: "ローカル → FTP、リモート → stdio" },
      { key: "D", en: "MCP has no concept of transport", ja: "MCPにトランスポートの概念はない" },
    ],
    answer: "A",
    explanation_en:
      "MCP servers run over a transport: local servers commonly use stdio (the client launches the process and talks over standard in/out), while remote servers use an HTTP-based transport (streamable HTTP / SSE). Transport is a core part of how a client connects to a server.",
    explanation_ja:
      "MCPサーバーはトランスポート上で動きます。ローカルサーバーは一般に stdio（クライアントがプロセスを起動し標準入出力で通信）、リモートサーバーは HTTPベース（streamable HTTP / SSE）を使います。トランスポートは、クライアントがサーバーへ接続する方法の中核です。",
    vocab: [
      { word: "transport", ja: "トランスポート（通信の伝送方式）", example: "MCP supports stdio and HTTP transports." },
      { word: "stdio", ja: "標準入出力（ローカルプロセス間の通信）", example: "Local MCP servers often use stdio." },
      { word: "remote", ja: "リモート（別マシン上の）", example: "A remote MCP server uses an HTTP transport." },
    ],
  },
  {
    id: "mcp-005",
    domain: "Tool Design & MCP Integration",
    question_en:
      "An MCP tool your server exposes fails at runtime (the upstream service is down). How should the tool signal this so Claude can react appropriately?",
    question_ja:
      "サーバーが公開するMCPツールが実行時に失敗しました（上流サービスがダウン）。Claudeが適切に反応できるよう、ツールはこれをどう伝えるべきですか?",
    choices: [
      { key: "A", en: "Return a tool result marked as an error (is_error) with a clear message", ja: "エラーと分かる印（is_error）と明確なメッセージを付けたツール結果を返す" },
      { key: "B", en: "Return a success result containing garbage", ja: "ゴミを詰めた成功結果を返す" },
      { key: "C", en: "Crash the server process", ja: "サーバープロセスをクラッシュさせる" },
      { key: "D", en: "Return nothing and hang", ja: "何も返さず固まる" },
    ],
    answer: "A",
    explanation_en:
      "Signal tool failures as an error result (with is_error and an informative message) so Claude can see what went wrong and recover — retry, try another path, or ask the user. Returning garbage-as-success misleads the model, and crashing or hanging breaks the interaction.",
    explanation_ja:
      "ツール失敗はエラー結果（is_error と分かりやすいメッセージ付き）として伝え、Claudeが何が起きたか把握してリカバリ（再試行・別手段・ユーザーへの確認）できるようにします。ゴミを成功として返すとモデルを誤導し、クラッシュや固まりは対話を壊します。",
    vocab: [
      { word: "signal", ja: "（状態を）知らせる・示す", example: "Signal failures with an error result." },
      { word: "upstream", ja: "上流（依存先のサービス）", example: "The upstream service is down." },
      { word: "runtime", ja: "実行時", example: "The tool failed at runtime." },
    ],
  },
  {
    id: "mcp-006",
    domain: "Tool Design & MCP Integration",
    question_en:
      "You want to expose a curated, reusable prompt template (e.g. 'summarize this ticket in our format') that users can invoke by name through the MCP client. Which MCP primitive is this?",
    question_ja:
      "MCPクライアントを通じて、ユーザーが名前で呼び出せる、整えられた再利用可能なプロンプトテンプレート（例『このチケットを自社フォーマットで要約』）を公開したいです。これはどのMCPプリミティブ?",
    choices: [
      { key: "A", en: "Prompts", ja: "Prompts（プロンプト）" },
      { key: "B", en: "Tools", ja: "Tools（ツール）" },
      { key: "C", en: "Resources", ja: "Resources（リソース）" },
      { key: "D", en: "Transports", ja: "Transports（トランスポート）" },
    ],
    answer: "A",
    explanation_en:
      "The Prompts primitive exposes reusable prompt templates that users can invoke by name. Tools are executable functions the model calls; Resources are readable data/content; transport is the connection layer, not a primitive you expose.",
    explanation_ja:
      "Prompts プリミティブは、ユーザーが名前で呼び出せる再利用可能なプロンプトテンプレートを公開します。Tools はモデルが呼ぶ実行可能な関数、Resources は読めるデータ/コンテンツ、トランスポートは接続層であって公開するプリミティブではありません。",
    vocab: [
      { word: "prompt template", ja: "プロンプトテンプレート（再利用可能な雛形）", example: "Expose a prompt template via the Prompts primitive." },
      { word: "curated", ja: "整えられた／厳選された", example: "A curated prompt for the team's format." },
      { word: "invoke by name", ja: "名前で呼び出す", example: "Users invoke the prompt by name." },
    ],
  },
  {
    id: "mcp-007",
    domain: "Tool Design & MCP Integration",
    question_en:
      "You are designing an MCP tool that can send money. Which principle should most shape its design?",
    question_ja:
      "送金できるMCPツールを設計しています。その設計を最も左右すべき原則は?",
    choices: [
      { key: "A", en: "Least privilege plus explicit confirmation/gating before the irreversible action", ja: "最小権限に加え、不可逆なアクション前の明示的な確認/ゲート" },
      { key: "B", en: "Give it the broadest possible permissions for convenience", ja: "利便性のため可能な限り広い権限を与える" },
      { key: "C", en: "Hide it from logs to reduce noise", ja: "ノイズ低減のためログから隠す" },
      { key: "D", en: "Skip input validation to be faster", ja: "高速化のため入力検証を省く" },
    ],
    answer: "A",
    explanation_en:
      "A money-moving tool is high-risk and hard to reverse, so design it with least privilege and require explicit confirmation/gating before it executes. Broad permissions, hiding it from logs, and skipping validation all increase the blast radius of a mistake or misuse.",
    explanation_ja:
      "送金ツールは高リスクで取り消しにくいため、最小権限で設計し、実行前に明示的な確認/ゲートを必須にします。広い権限・ログからの隠蔽・入力検証の省略は、誤りや悪用の影響範囲を広げます。",
    vocab: [
      { word: "least privilege", ja: "最小権限", example: "Design money tools with least privilege." },
      { word: "confirmation", ja: "確認（承認）", example: "Require confirmation before sending money." },
      { word: "blast radius", ja: "影響範囲（被害の広がり）", example: "Least privilege limits the blast radius." },
    ],
  },
  {
    id: "mcp-008",
    domain: "Tool Design & MCP Integration",
    question_en:
      "Your MCP server exposes 60 tools, and the model sometimes picks the wrong one because names/descriptions overlap. Which approach most improves correct selection?",
    question_ja:
      "MCPサーバーが60個のツールを公開しており、名前や説明が重なるためモデルが時々間違ったツールを選びます。正しい選択を最も改善する手法は?",
    choices: [
      { key: "A", en: "Give each tool a clear, distinct name and a description stating exactly when to use it", ja: "各ツールに明確で区別できる名前と、いつ使うかを正確に述べた説明を与える" },
      { key: "B", en: "Name them all `tool1`, `tool2`, …", ja: "すべて `tool1`, `tool2`, … と命名する" },
      { key: "C", en: "Remove all descriptions to save tokens", ja: "トークン節約のため全説明を削除する" },
      { key: "D", en: "Set temperature to 0", ja: "temperature を 0 にする" },
    ],
    answer: "A",
    explanation_en:
      "The model selects tools from their names and descriptions, so distinct, descriptive names plus 'when to use this' guidance in each description dramatically reduces wrong-tool selection. Numeric names and missing descriptions leave the model guessing; temperature doesn't fix ambiguity.",
    explanation_ja:
      "モデルは名前と説明からツールを選ぶため、区別しやすい説明的な名前と、各説明の『いつ使うか』ガイドが誤選択を大きく減らします。番号名や説明欠如はモデルに推測を強い、temperature は曖昧さを解消しません。",
    vocab: [
      { word: "distinct", ja: "区別できる／明確に異なる", example: "Give each tool a distinct name." },
      { word: "overlap", ja: "重なる／かぶる", example: "Descriptions that overlap cause wrong selection." },
      { word: "select", ja: "選択する", example: "The model selects tools by description." },
    ],
  },
  {
    id: "mcp-009",
    domain: "Tool Design & MCP Integration",
    question_en:
      "An analytics agent needs Claude to read (but not modify) rows from an internal reporting database and cite figures. Which MCP design fits best?",
    question_ja:
      "分析エージェントで、Claudeが社内レポートDBの行を読み取り（変更はしない）、数値を引用できるようにしたいです。最も適したMCP設計は?",
    choices: [
      { key: "A", en: "Expose the data as a read-only Resource (or a strictly read-only tool)", ja: "データを読み取り専用のResource（または厳密に読み取り専用のツール）として公開する" },
      { key: "B", en: "Expose a tool that can also run DELETE/UPDATE", ja: "DELETE/UPDATEも実行できるツールを公開する" },
      { key: "C", en: "Give write access just in case", ja: "念のため書き込み権限も与える" },
      { key: "D", en: "Embed the database password in the system prompt", ja: "DBパスワードをシステムプロンプトに埋め込む" },
    ],
    answer: "A",
    explanation_en:
      "Read-only reporting data is a natural fit for a Resource (or a strictly read-only tool): the model can read and cite figures without any ability to mutate the database. Write-capable tools violate least privilege, and putting credentials in the prompt is a serious security mistake.",
    explanation_ja:
      "読み取り専用のレポートデータはResource（または厳密に読み取り専用のツール）に自然に合います。モデルは数値を読み・引用できる一方、DBを書き換える能力は一切持ちません。書き込み可能ツールは最小権限に反し、認証情報をプロンプトに置くのは重大な安全違反です。",
    vocab: [
      { word: "read-only", ja: "読み取り専用", example: "Expose the data as a read-only Resource." },
      { word: "cite", ja: "引用する", example: "The agent can cite figures from the resource." },
      { word: "mutate", ja: "変更する（書き換える）", example: "A read-only resource cannot mutate the database." },
    ],
  },
  {
    id: "mcp-010",
    domain: "Tool Design & MCP Integration",
    question_en:
      "A colleague argues you must rebuild your tool integrations separately for every AI app you use. How does MCP change this?",
    question_ja:
      "同僚が『使うAIアプリごとにツール連携を別々に作り直さなければならない』と主張します。MCPはこれをどう変えますか?",
    choices: [
      { key: "A", en: "MCP is an open standard, so one MCP server works across any MCP-compatible client — build once, reuse", ja: "MCPはオープン標準なので、1つのMCPサーバーはMCP対応クライアント全体で使える。一度作れば再利用できる" },
      { key: "B", en: "MCP servers only work with a single hard-coded app", ja: "MCPサーバーは1つのハードコードされたアプリでしか動かない" },
      { key: "C", en: "MCP requires rewriting the server per model version", ja: "MCPはモデルバージョンごとにサーバーの書き直しが必要" },
      { key: "D", en: "MCP replaces the need for any tools", ja: "MCPはあらゆるツールの必要をなくす" },
    ],
    answer: "A",
    explanation_en:
      "MCP is an open standard for connecting models to tools and data. Because clients and servers speak the same protocol, one MCP server can be reused across any MCP-compatible client — you don't rebuild the integration per app or per model version.",
    explanation_ja:
      "MCPは、モデルをツールやデータに接続するためのオープン標準です。クライアントとサーバーが同じプロトコルを話すため、1つのMCPサーバーはMCP対応の任意のクライアントで再利用できます。アプリごと・モデルバージョンごとに連携を作り直す必要はありません。",
    vocab: [
      { word: "open standard", ja: "オープン標準（公開された共通仕様）", example: "MCP is an open standard." },
      { word: "reuse", ja: "再利用する", example: "Build the server once and reuse it." },
      { word: "compatible", ja: "互換性のある／対応した", example: "It works across any MCP-compatible client." },
    ],
  },
  {
    id: "mcp-011",
    domain: "Tool Design & MCP Integration",
    question_en:
      "Match the MCP primitives to their roles. Which mapping is fully correct?",
    question_ja:
      "MCPプリミティブと役割を対応づけてください。完全に正しい対応はどれですか?",
    choices: [
      { key: "A", en: "Tools = executable actions; Resources = readable data/context; Prompts = reusable templates", ja: "Tools = 実行アクション、Resources = 読めるデータ/文脈、Prompts = 再利用テンプレート" },
      { key: "B", en: "Tools = data; Resources = templates; Prompts = actions", ja: "Tools = データ、Resources = テンプレート、Prompts = アクション" },
      { key: "C", en: "Tools = templates; Resources = actions; Prompts = data", ja: "Tools = テンプレート、Resources = アクション、Prompts = データ" },
      { key: "D", en: "All three are the same thing", ja: "3つとも同じもの" },
    ],
    answer: "A",
    explanation_en:
      "The correct mapping: Tools are executable functions the model can call (actions), Resources are data/content the model can read (context), and Prompts are reusable prompt templates. Keeping these roles straight is core to designing an MCP server well.",
    explanation_ja:
      "正しい対応：Tools はモデルが呼べる実行可能な関数（アクション）、Resources はモデルが読めるデータ/コンテンツ（文脈）、Prompts は再利用可能なプロンプトテンプレートです。この役割分担を正確に押さえることが、良いMCPサーバー設計の基礎です。",
    vocab: [
      { word: "primitive", ja: "プリミティブ（基本構成要素）", example: "MCP has three primitives." },
      { word: "map to", ja: "対応づける／割り当てる", example: "Map each primitive to its role." },
      { word: "executable", ja: "実行可能な", example: "Tools are executable functions." },
    ],
  },

  // ===== Context Management & Reliability（追加 003–009） =====
  {
    id: "context-003",
    domain: "Context Management & Reliability",
    question_en:
      "Your agent sends the same large, unchanging system prompt and tool set on every request, and cost/latency are high. Which technique most directly reduces the cost of that repeated prefix?",
    question_ja:
      "あなたのエージェントは、毎リクエストで同じ大きく変わらないシステムプロンプトとツールセットを送っており、コストとレイテンシが高いです。その繰り返しの前置き（prefix）のコストを最も直接的に下げる手法は?",
    choices: [
      { key: "A", en: "Prompt caching (cache the stable prefix so repeats are served far cheaper)", ja: "プロンプトキャッシュ（安定した前置きをキャッシュし、繰り返しをはるかに安く提供）" },
      { key: "B", en: "Raise the temperature", ja: "temperature を上げる" },
      { key: "C", en: "Send the prompt twice", ja: "プロンプトを2回送る" },
      { key: "D", en: "Remove the system prompt entirely", ja: "システムプロンプトを完全に削除する" },
    ],
    answer: "A",
    explanation_en:
      "Prompt caching stores a stable prefix (frozen system prompt + deterministic tools) so subsequent requests re-read it at a fraction of the cost and latency. It's a prefix match — keep the cached part byte-stable. Raising temperature, duplicating the prompt, or deleting the system prompt don't address repeated-prefix cost.",
    explanation_ja:
      "プロンプトキャッシュは、安定した前置き（凍結したシステムプロンプト＋決定的なツール）を保存し、以降のリクエストがそれをわずかなコスト/レイテンシで再読込します。前方一致なのでキャッシュ部分はバイト単位で安定させます。temperature上昇・二重送信・システムプロンプト削除は、繰り返し前置きのコストに効きません。",
    vocab: [
      { word: "prompt caching", ja: "プロンプトキャッシュ（安定部分を再利用してコスト削減）", example: "Prompt caching cuts the cost of a repeated prefix." },
      { word: "prefix", ja: "前置き（プロンプト先頭の共通部分）", example: "Cache the stable prefix." },
      { word: "byte-stable", ja: "バイト単位で不変（一文字も変えない）", example: "Keep the cached prefix byte-stable." },
    ],
  },
  {
    id: "context-004",
    domain: "Context Management & Reliability",
    question_en:
      "You have a huge knowledge base, far larger than the context window. The agent should answer questions using only the relevant parts. Which approach fits?",
    question_ja:
      "コンテキストウィンドウよりはるかに大きい巨大なナレッジベースがあります。エージェントは関連部分だけを使って質問に答えるべきです。適したアプローチは?",
    choices: [
      { key: "A", en: "Retrieval (RAG): fetch only the relevant chunks and put them in context", ja: "検索（RAG）：関連するチャンクだけを取得してコンテキストに入れる" },
      { key: "B", en: "Paste the entire knowledge base into every prompt", ja: "毎プロンプトにナレッジベース全体を貼り付ける" },
      { key: "C", en: "Increase temperature", ja: "temperature を上げる" },
      { key: "D", en: "Ignore the knowledge base and guess", ja: "ナレッジベースを無視して当てずっぽうで答える" },
    ],
    answer: "A",
    explanation_en:
      "Retrieval-augmented generation (RAG) fetches only the chunks relevant to the query and injects them into context, keeping the window focused and within limits. Pasting everything overflows the window; temperature doesn't manage context; guessing abandons the knowledge base.",
    explanation_ja:
      "検索拡張生成（RAG）は、問いに関連するチャンクだけを取得してコンテキストに注入し、ウィンドウを焦点化して上限内に収めます。全部貼り付けはウィンドウを溢れさせ、temperatureは文脈管理と無関係、当てずっぽうはナレッジベースを放棄します。",
    vocab: [
      { word: "retrieval", ja: "検索／取得（関連情報を引く）", example: "Use retrieval to fetch only relevant chunks." },
      { word: "RAG", ja: "検索拡張生成（Retrieval-Augmented Generation）", example: "RAG keeps only relevant context in the window." },
      { word: "chunk", ja: "チャンク（分割された情報の断片）", example: "Fetch the relevant chunks for the query." },
    ],
  },
  {
    id: "context-005",
    domain: "Context Management & Reliability",
    question_en:
      "A subtask requires scanning dozens of large files, which would flood the main agent's context with noise. How do you protect the main context?",
    question_ja:
      "あるサブタスクは数十の大きなファイルを走査する必要があり、そのままだと主エージェントのコンテキストがノイズで溢れます。主コンテキストをどう守りますか?",
    choices: [
      { key: "A", en: "Delegate the scan to a subagent whose token consumption stays isolated; it returns only a concise result", ja: "走査をサブエージェントに委譲し、トークン消費を隔離する。返るのは簡潔な結果だけ" },
      { key: "B", en: "Read all files inline into the main context", ja: "全ファイルを主コンテキストにそのまま読み込む" },
      { key: "C", en: "Increase max_tokens", ja: "max_tokens を増やす" },
      { key: "D", en: "Lower the temperature", ja: "temperature を下げる" },
    ],
    answer: "A",
    explanation_en:
      "Delegating (forking) the noisy scan to a subagent keeps its large intermediate reads out of the parent's window — the subagent burns its own tokens and returns only a distilled result, preserving the main context's quality. Reading inline pollutes it; token/temperature knobs don't isolate context.",
    explanation_ja:
      "ノイズの多い走査をサブエージェントに委譲（フォーク）すれば、その大きな中間読み込みは親のウィンドウに入らず、サブエージェントは自分のトークンを使って蒸留した結果だけを返し、主コンテキストの質を保てます。インライン読込は汚染し、トークン/温度の調整は文脈を隔離しません。",
    vocab: [
      { word: "isolate", ja: "隔離する／分離する", example: "Isolate the subagent's token consumption." },
      { word: "flood", ja: "溢れさせる／殺到させる", example: "Large files would flood the context." },
      { word: "distilled", ja: "蒸留された（要点だけの）", example: "The subagent returns a distilled result." },
    ],
  },
  {
    id: "context-006",
    domain: "Context Management & Reliability",
    question_en:
      "An agent must remember important facts across separate sessions (not just within one conversation). Which approach fits?",
    question_ja:
      "エージェントが、1つの会話内だけでなく、別々のセッションをまたいで重要な事実を記憶する必要があります。適したアプローチは?",
    choices: [
      { key: "A", en: "External/persistent memory (e.g. write key facts to a file/store and re-read them next session)", ja: "外部/永続メモリ（重要な事実をファイル/ストアに書き、次セッションで読み直す）" },
      { key: "B", en: "Rely on the model's built-in cross-session memory", ja: "モデル内蔵の『セッション横断メモリ』に頼る" },
      { key: "C", en: "Keep one giant never-ending conversation forever", ja: "終わらない巨大な会話を永遠に1本続ける" },
      { key: "D", en: "Raise the temperature", ja: "temperature を上げる" },
    ],
    answer: "A",
    explanation_en:
      "Cross-session persistence requires external memory: write the important facts to a file or store and re-read them at the start of the next session. The stateless API has no built-in cross-session memory, an endless conversation eventually blows the context window, and temperature is irrelevant.",
    explanation_ja:
      "セッション横断の永続化には外部メモリが必要です。重要な事実をファイルやストアに書き、次セッションの冒頭で読み直します。ステートレスなAPIにセッション横断の内蔵メモリはなく、終わらない会話はいずれコンテキストを溢れさせ、temperatureは無関係です。",
    vocab: [
      { word: "persistent memory", ja: "永続メモリ（セッションをまたいで残る記憶）", example: "Use persistent memory for cross-session facts." },
      { word: "across sessions", ja: "セッションをまたいで", example: "Remember facts across sessions via a store." },
      { word: "re-read", ja: "読み直す", example: "Re-read the memory file next session." },
    ],
  },
  {
    id: "context-007",
    domain: "Context Management & Reliability",
    question_en:
      "Under load, the Claude API sometimes returns 429 (rate limited) or 529 (overloaded). For a reliable agent, how should client code respond?",
    question_ja:
      "負荷時、Claude APIは時々 429（レート制限）や 529（過負荷）を返します。信頼できるエージェントのために、クライアントコードはどう対応すべきですか?",
    choices: [
      { key: "A", en: "Retry with exponential backoff (respecting retry-after) — these are transient, retryable errors", ja: "指数バックオフで再試行する（retry-after を尊重）。これらは一時的で再試行可能なエラー" },
      { key: "B", en: "Immediately give up and crash", ja: "即座に諦めてクラッシュする" },
      { key: "C", en: "Retry instantly in a tight loop with no delay", ja: "遅延なしのタイトループで即座に再試行し続ける" },
      { key: "D", en: "Switch to a fake response and pretend it succeeded", ja: "偽の応答に差し替えて成功したふりをする" },
    ],
    answer: "A",
    explanation_en:
      "429 and 529 are transient, retryable — retry with exponential backoff, honoring the retry-after header (the SDKs do this automatically by default). Crashing loses work, a no-delay tight loop worsens the overload, and faking success hides real failures.",
    explanation_ja:
      "429 と 529 は一時的で再試行可能です。指数バックオフで、retry-after ヘッダを尊重して再試行します（SDKは既定で自動対応）。クラッシュは作業を失い、遅延なしのタイトループは過負荷を悪化させ、成功の偽装は本当の失敗を隠します。",
    vocab: [
      { word: "exponential backoff", ja: "指数バックオフ（待ち時間を段階的に伸ばす再試行）", example: "Retry 429s with exponential backoff." },
      { word: "transient", ja: "一時的な（すぐ解消しうる）", example: "429 and 529 are transient errors." },
      { word: "retryable", ja: "再試行可能な", example: "Overload errors are retryable." },
    ],
  },
  {
    id: "context-008",
    domain: "Context Management & Reliability",
    question_en:
      "You want an agent's final output to be more trustworthy on a critical task. Which step most improves reliability?",
    question_ja:
      "重要なタスクで、エージェントの最終出力の信頼性を高めたいです。信頼性を最も高めるステップは?",
    choices: [
      { key: "A", en: "Add a verification step: check the result against the spec/sources before finalizing", ja: "検証ステップを追加：確定前に結果を仕様/情報源と照合する" },
      { key: "B", en: "Skip checking to save time", ja: "時間節約のため確認を飛ばす" },
      { key: "C", en: "Raise the temperature", ja: "temperature を上げる" },
      { key: "D", en: "Make the output longer", ja: "出力を長くする" },
    ],
    answer: "A",
    explanation_en:
      "A verification step — checking the result against the specification or grounding sources (often with a fresh-context verifier) before finalizing — catches errors and raises reliability. Skipping checks, raising temperature, or padding length do not improve correctness.",
    explanation_ja:
      "検証ステップ（確定前に、結果を仕様や根拠となる情報源と照合する。しばしば独立コンテキストの検証者を使う）は誤りを捕まえ、信頼性を高めます。確認の省略・temperature上昇・水増しは正しさを高めません。",
    vocab: [
      { word: "verification", ja: "検証（正しさの確認）", example: "Add a verification step before finalizing." },
      { word: "against the spec", ja: "仕様に照らして", example: "Check the result against the spec." },
      { word: "trustworthy", ja: "信頼できる", example: "Verification makes output more trustworthy." },
    ],
  },
  {
    id: "context-009",
    domain: "Context Management & Reliability",
    question_en:
      "A long-running agent is at risk of exceeding the context window. Select the techniques that help keep it within the window.",
    question_ja:
      "長時間動くエージェントが、コンテキストウィンドウを超えるリスクがあります。ウィンドウ内に収めるのに役立つ手法をすべて選んでください。",
    choices: [
      { key: "A", en: "Summarize/compact earlier context", ja: "以前の文脈を要約/圧縮する" },
      { key: "B", en: "Retrieve only the relevant information instead of everything", ja: "全部でなく関連情報だけを取得する" },
      { key: "C", en: "Delegate noisy subtasks to subagents with isolated context", ja: "ノイズの多いサブタスクを、独立コンテキストのサブエージェントに委譲する" },
      { key: "D", en: "Duplicate the full history on every turn to be safe", ja: "念のため毎ターン全履歴を複製する" },
    ],
    answer: ["A", "B", "C"],
    explanation_en:
      "Staying within the window means shrinking what you keep: (A) summarize/compact old turns, (B) retrieve only relevant info, and (C) offload noisy subtasks to isolated subagents. (D) duplicating the full history each turn makes the problem worse — it consumes more of the very space you're short on.",
    explanation_ja:
      "ウィンドウ内に収めるとは、保持量を減らすことです：(A) 古いターンを要約/圧縮、(B) 関連情報だけ取得、(C) ノイズの多いサブタスクを独立サブエージェントに退避。(D) 毎ターン全履歴を複製するのは逆効果で、不足しているスペースをさらに食います。",
    vocab: [
      { word: "compact", ja: "圧縮する（要約して短くする）", example: "Compact old context to save space." },
      { word: "offload", ja: "退避させる／肩代わりさせる", example: "Offload noisy subtasks to a subagent." },
      { word: "stay within", ja: "（範囲）内に収まる", example: "These techniques help you stay within the window." },
    ],
  },
];
