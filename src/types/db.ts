export const TOOLS = ["ugc-scripts", "outreach", "copy-optimizer"] as const;
export type Tool = (typeof TOOLS)[number];

export const TOOL_LABELS: Record<Tool, string> = {
  "ugc-scripts": "UGC Script Generator",
  outreach: "Affiliate Outreach",
  "copy-optimizer": "Copy Optimizer",
};

export type Generation = {
  id: string;
  user_id: string;
  tool: Tool;
  input: Record<string, unknown>;
  output: string;
  is_favorite: boolean;
  created_at: string;
  updated_at: string;
};
