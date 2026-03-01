export const tools = [
  {
    type: "function",
    function: {
      name: "prepareRepo",
      description: "Clone github repo if not present locally",
      parameters: {
        type: "object",
        required: ["repo", "username"],
        properties: {
          repo: {
            type: "string",
            description: "The git repository name that will be cloned",
          },
          username: {
            type: "string",
            description:
              "The github username of the owner of targetted git repo provided",
          },
        },
      },
    },
  },
  {
    type: "function",
    function: {
      name: "getDirectoryStructure",
      description: "Get directory tree (structure) using the tree command",
      parameters: {
        type: "object",
        required: ["repo"],
        properties: {
          repo: {
            type: "string",
            description: "The directory name",
          },
        },
      },
    },
  },
];
