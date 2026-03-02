import { callLLM } from "./olama.js";
import { executeToolCall } from "./handler.js";
import { tools } from "./tools_list.js";

export const logger = (msgs) => {
  console.log(msgs);
};

export const runAgent = async (messages) => {
  let steps = 0;
  while (steps < 20) {
    logger(["CALLING LLM...."]);
    const res = await callLLM(messages, tools);
    messages.push(res.message);

    const toolCalls = res.message.tool_calls || [];
    logger(["TOOLS CALL", toolCalls]);

    if (toolCalls.length === 0) {
      logger(["NO TOOL CALL....", toolCalls]);
      break;
    }

    const toolCall = toolCalls[0];
    logger(["Calling", toolCall.function.name]);

    await executeToolCall(toolCall, messages);
    steps++;
  }

  return messages.at(-1)?.content;
};
