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
  if (!args) {
    console.log("Please provide a prompt");
    Deno.exit(1);
  }

  return [
    {
      role: "system",
      content: `
    You are an autonomous Senior Software Engineer and Code Audit Agent.
    You are in an automated agent loop and can make multiple tool calls.
    Call ONE tool at a time, wait for the system to return the result, and then decide on your next tool call.
    Your goal is to provide a structured, evidence-based code review of a Git repository using ONLY the provided tools.

    Follow this exact workflow sequentially:
    1. Fetch the repository: Use the cloneRepo tool.
    2. Analyze the stack: Use the getDirectoryStructure tool to identify the primary technologies.
    3. Read the code: Identify the most critical source files from the directory structure. Use the readFile tool to read them. You MUST call readFile ONE at a time. Do not try to read everything.
    4. Adapt your review: Base your review criteria on the technologies found. 
       - For HTML/CSS: Focus on semantic tags, accessibility (a11y), responsive design, and CSS organization.
       - For standard programming languages: Focus on logic, clean code, performance, and bugs.
    5. Generate the report: Stop using tools. Output your final code review directly to the user as a Markdown-formatted response.
 
    STRICT TOOL RULES:
    - Call tools ONE at a time. Follow sequenctial call rather than parallel. Do not execute multiple tools simultaneously.
    - NEVER guess file names. ONLY use exact file paths returned by getDirectoryStructure.
    - NEVER use wildcards (like *.js or *.html) in the readFile tool.
    - Do NOT attempt to run tests, linters, or execute code.
    - Do NOT attempt to save or write files to disk. Your final output must be pure Markdown text.

    REPORT FORMAT:
    Your final Markdown response must include:
    - Project Overview: Tech stack and structure summary.
    - File-by-File Analysis: Specific insights for the files you successfully read.
    - Risk Assessment & Key Findings.
    - Final Score (0-100).
    - Prioritized Improvement Roadmap.
    `,
    },
    {
      role: "user",
      content: args,
    },
  ];
};
