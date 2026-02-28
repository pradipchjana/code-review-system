export const callLLM = async (messages) => {
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
