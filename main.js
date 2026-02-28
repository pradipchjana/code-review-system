import { callLLM } from "./src/olama.js";

const main = async () => {
  const messages = [
    {
      "role": "system",
      "content": "You are a helpful software engineer",
    },
    {
      "role": "user",
      "content": Deno.args[0],
    },
  ];
  while (true) {
    const res = await callLLM(messages);
    const toolCalls = res.message.tool_calls || [];
    messages.push(res.message);

    if (toolCalls.length === 0) {
      console.log("No Tool Call...");
      break;
    }

    const toolCall = toolCalls.at(-1);
    console.log(`Calling ${toolCall.function.name}`);

    if (toolCall.function.name === "adder") {
      const { a, b } = toolCall.function.arguments;
      const toolMessage = {
        "role": "tool",
        "content": `Sum of a and b is ${a + b}`,
        "tool_call_id": toolCall.id,
      };
      messages.push(toolMessage);
    } else {
      const { name } = toolCall.function.arguments;
      const toolMessage = {
        "role": "tool",
        "content": `${name} is currently part of step 11 batch.`,
        "tool_call_id": toolCall.id,
      };
      messages.push(toolMessage);
    }
  }
  console.log(messages.at(-1).content);
};

main();
