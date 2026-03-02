export const tools = [
  {
    type: "function",
    function: {
      name: "cloneRepo",
      description:
        "Ensures the specified GitHub repository exists locally under the 'git-clones' directory. \
        If the repository does not exist locally, it clones it from GitHub. Returns a message indicating \
        whether the repository was cloned or already exists.",
      parameters: {
        type: "object",
        required: ["repo", "username"],
        properties: {
          repo: {
            type: "string",
            description: "Name of the repository",
          },
          username: {
            type: "string",
            description: "GitHub username of the repository owner",
          },
        },
      },
    },
  },
  {
    type: "function",
    function: {
      name: "getDirectoryStructure",
      description:
        "Returns the complete directory structure of the specified repository as text, exactly as shown by the 'tree' command. \
        The repository is assumed to be located under 'git-clones/' .",
      parameters: {
        type: "object",
        required: ["repo", "username"],
        properties: {
          repo: {
            type: "string",
            description: "Name of the repository",
          },
          username: {
            type: "string",
            description: "GitHub username of the repository owner",
          },
        },
      },
    },
  },
  {
    type: "function",
    function: {
      name: "readFile",
      description:
        "Reads the content of a single file. You must provide the exact file path from the directory structure. Do not use wildcards. Do not request multiple files at once",
      parameters: {
        type: "object",
        required: ["repo", "username", "fileName"],
        properties: {
          repo: {
            type: "string",
            description: "Name of the repository, e.g., 'html-semantics'",
          },
          username: {
            type: "string",
            description: "GitHub username of the repository owner",
          },
          fileName: {
            type: "string",
            description: "Path of the file relative to the repository root",
          },
        },
      },
    },
  },
  {
    type: "function",
    function: {
      name: "writeFile",
      description:
        "Writes data to a file. Use this tool to save your final generated code review. You must provide the exact file name (e.g., REVIEW.md) and pass the entire Markdown review into the content parameter.",
      parameters: {
        type: "object",
        required: ["repo", "username", "content", "fileName"],
        properties: {
          repo: {
            type: "string",
            description: "Name of the repository, e.g., 'html-semantics'",
          },
          username: {
            type: "string",
            description: "GitHub username of the repository owner",
          },
          content: {
            type: "string",
            description: "Data to be written into the file, e.g., review",
          },
          fileName: {
            type: "string",
            description:
              "Path of the file relative to the repository root .e.g. REVIEW.md",
          },
        },
      },
    },
  },
  {
    type: "function",
    function: {
      name: "testCoverage",
      description:
        "Runs deno test --coverage inside the repository and returns the full coverage output. Only use this tool when the user asks for test results or coverage metrics.",
      parameters: {
        type: "object",
        required: ["repo", "username"],
        properties: {
          repo: {
            type: "string",
            description: "Name of the repository, e.g., 'html-semantics'",
          },
          username: {
            type: "string",
            description: "GitHub username of the repository owner",
          },
        },
      },
    },
  },
];
