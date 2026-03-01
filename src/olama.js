export const callLLM = async (messages, tools) => {
  const res = await fetch("http://localhost:11434/api/chat", {
    method: "POST",
    body: JSON.stringify({
      model: "llama3.1",
      stream: false,
      messages,
      tools,
    }),
    headers: {
      "content-type": "application/json",
    },
  });
  return res.json();
};

export const createMessage = (args) => {
  const content = args.join(" ");
  if (!content) {
    console.log("Please provide a prompt");
    Deno.exit(1);
  }

  return [
    {
      role: "system",
      content: `You are an expert Senior Software Engineer reviewing code.
        When asked to review a repository, use your tools to read the necessary files.
        Analyze the code for bugs, performance issues, and clean code practices, and then provide a structured review`,
    },
    {
      role: "user",
      content,
    },
  ];
};
