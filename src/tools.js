import { logger } from "./agent.js";

const decoder = new TextDecoder();

export const prepareRepo = async ({ repo, username }) => {
  const repoPath = `./${repo}`;
  logger("INSIDE PREPARE REPO");
  logger(["ARGS:", repo, username]);
  try {
    const fileInfo = await Deno.stat(repoPath);
    if (fileInfo.isDirectory) {
      return "Directory is already present";
    }
  } catch {
    const url = `https://github.com/step-batch-11/${repo}-${username}.git`;
    const cmd = new Deno.Command("git", {
      args: ["clone", url],
      stdout: "piped",
      stderr: "piped",
    });

    const output = await cmd.output();
    if (output.code !== 0) {
      return decoder.decode(output.stderr);
    }
    return decoder.decode(output.stdout);
  }
};

export const getDirectoryStructure = () => {
  logger("INSIDE DIRECTORY STRUCTURE");
};

const generateMsg = (toolMessage, toolCall) => ({
  role: "tool",
  content: toolMessage,
  tool_call_id: toolCall.id,
});

const toolRegistry = {
  prepareRepo,
  getDirectoryStructure,
};

export const executeToolCall = async (toolCall, messages) => {
  logger(["INSIDE EXECUTE TOOL CALL"]);

  const toolName = toolCall.function.name;
  const tool = toolRegistry[toolName];

  logger(["TOOL:", tool]);

  if (!tool) {
    return messages.push(`Unknown tool: ${toolName}`);
  }

  const result = await tool(toolCall.function.arguments);

  const toolMsg = generateMsg(result, toolCall);
  messages.push(toolMsg);
};
