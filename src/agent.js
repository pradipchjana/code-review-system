import { callLLM } from "./olama.js";
import { executeToolCall } from "./handler.js";
import { tools } from "./tools_list.js";

export const logger = (msgs) => {
  console.log(msgs);
};

export const runAgent = async (messages) => {
  while (true) {
    logger(["CALLING LLM...."]);
    const res = await callLLM(messages, tools);
    const toolCalls = res.tool_calls || [];

    logger(["MESSAGE", messages]);
    logger(["RESPONSE", res]);

    logger(["TOOLS CALL", toolCalls]);
    messages.push(res.message);

    if (toolCalls.length === 0) {
      logger(["NO TOOL CALL....", toolCalls]);
      break;
    }

    const toolCall = toolCalls[0];
    logger(["Calling", toolCall.function.name]);

    await executeToolCall(toolCall, messages);
  }

  return messages.at(-1).content;
};
