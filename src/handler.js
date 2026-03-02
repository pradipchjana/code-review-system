import { logger } from "./agent.js";
import {
  cloneRepo,
  getDirectoryStructure,
  readFile,
  testCoverage,
  writeFile,
} from "./tools.js";

const generateMsg = (msg, toolCall) => ({
  role: "tool",
  content: msg,
  tool_call_id: toolCall.id,
});

const toolRegistry = {
  cloneRepo,
  getDirectoryStructure,
  readFile,
  testCoverage,
  writeFile,
};

export const executeToolCall = async (toolCall, messages) => {
  logger(["INSIDE EXECUTE TOOL CALL"]);

  const toolName = toolCall.function.name;
  const tool = toolRegistry[toolName];

  logger(["TOOL:", tool]);

  if (!tool) {
    messages.push({
      role: "tool",
      content: `Error: Unknown tool ${toolName}`,
      tool_call_id: toolCall.id,
    });
    return;
  }

  const args = typeof toolCall.function.arguments === "string"
    ? JSON.parse(toolCall.function.arguments)
    : toolCall.function.arguments;

  logger(["ARGS", args]);
  const msg = await tool(args);
  const toolMsg = generateMsg(msg, toolCall);
  messages.push(toolMsg);
};
