import { callLLM } from "./olama.js";
import { executeToolCall } from "./tools.js";
import { tools } from "./tools_list.js";

export const logger = (msgs) => {
  console.log(msgs);
};

export const runAgent = async (messages) => {
  while (true) {
    logger(["CALLING LLM...."]);
    const res = await callLLM(messages, tools);
    messages.push(res.message);

    const toolCalls = res.message.tool_calls || [];
    logger(["TOOLS CALL", toolCalls]);

    if (toolCalls.length === 0) {
      logger(["NO TOOL CALL....", toolCalls]);
      break;
    }

    const toolCall = toolCalls.at(-1);
    logger(["Calling", toolCall.function.name]);

    await executeToolCall(toolCall, messages);
  }

  return messages.at(-1).content;
};
