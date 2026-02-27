const callLLM = async (messages) => {
  const res = await fetch("http://localhost:11434/api/chat", {
    method: "POST",
    body: JSON.stringify({
      "model": "llama3.1",
      "stream": false,
      messages,
      tools: [
        {
          "type": "function",
          "function": {
            "name": "adder",
            "description": "Adds two number",
            "parameters": {
              "type": "object",
              "required": ["a", "b"],
              "properties": {
                "a": {
                  "type": "number",
                  "description": "First number",
                },
                "b": {
                  "type": "number",
                  "description": "Second number",
                },
              },
            },
          },
        },
        {
          "type": "function",
          "function": {
            "name": "getStepInternDetails",
            "description": "Get the details about a STEP intern",
            "parameters": {
              "type": "object",
              "required": ["name"],
              "properties": {
                "name": {
                  "type": "string",
                  "description": "Name of the step intern",
                },
              },
            },
          },
        },
      ],
    }),
    headers: {
      "content-type": "application/json",
    },
  });
  return res.json();
};

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
    console.log("Calling LLM");
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
