import { logger } from "./agent.js";
import { walk } from "@std/fs/walk";

const decoder = (msg) => new TextDecoder().decode(msg);

const createOuputMsg = (output) => {
  if (output.code !== 0) return decoder(output.stderr);
  return decoder(output.stdout);
};

export const cloneRepo = async ({ repo, username }) => {
  const repoName = `${repo}-${username}`;
  const repoPath = `git-clones/${repoName}`;

  logger("INSIDE CLONE REPO");
  logger(["ARGS:", repo, username, repoPath]);

  try {
    const stat = await Deno.stat(repoPath);
    if (stat.isDirectory) {
      return "Directory already present";
    }
  } catch (err) {
    if (err instanceof Deno.errors.NotFound) {
      const token = Deno.env.get("GITHUB_TOKEN");
      const url =
        `https://${token}@github.com/step-batch-11/${repo}-${username}.git`;

      logger(["ATTEMPTING TO CLONE URL:", url]);
      const gitCloneCommand = new Deno.Command("git", {
        args: ["clone", url, repoPath],
        stdout: "piped",
        stderr: "piped",
        env: {
          GIT_TERMINAL_PROMPT: "0", //Fails don't ask for credientials
        },
      });

      const output = await gitCloneCommand.output();
      return createOuputMsg(output);
    }
    return err.message;
  }
};

export const getDirectoryStructure = async ({ repo, username }) => {
  logger(["INSIDE DIRECTORY STRUCTURE"]);
  const repoName = `${repo}-${username}`;
  const repoPath = `git-clones/${repoName}`;
  logger(["REPO", repoName, repoPath]);
  const entries = await Array.fromAsync(walk(repoPath, { skip: [/\.git/] }));

  logger(["ENTRIES", entries]);
  const filePaths = entries.map((entry) => entry.path);
  logger(["FILEPATHS", filePaths]);
  return filePaths.join("\n");
};

export const readFile = async ({ repo, username, fileName }) => {
  logger(["INSIDE READFILE TOOL"]);
  const repoName = `${repo}-${username}`;
  const filePath = `git-clones/${repoName}/${fileName}`;

  try {
    const content = await Deno.readTextFile(filePath);
    return content;
  } catch (error) {
    return `Failed to read file: ${error.message}`;
  }
};

export const writeFile = async ({ repo, username, fileName, content }) => {
  logger(["INSIDE WRITE FILE"]);
  const repoName = `${repo}-${username}`;
  const filePath = `git-clones/${repoName}/${fileName}`;
  try {
    await Deno.writeTextFile(filePath, content);
    logger(["FILE WRITTEN"]);
    return `Successfully wrote the ${fileName} at ${filePath}`;
  } catch (error) {
    logger(["THREW ERROR"]);
    return `Failed to write the file: ${error.message}`;
  }
};

export const testCoverage = async ({ repo, username }) => {
  logger(["INSIDE TEST COVERAGE FILE"]);
  const repoName = `${repo}-${username}`;
  const filePath = `git-clones/${repoName}`;

  try {
    const command = new Deno.Command("deno", {
      args: ["test", "--coverage"],
      cwd: filePath,
      stdout: "piped",
      stderr: "piped",
    });

    const output = await command.output();
    return createOuputMsg(output);
  } catch (error) {
    return `Failed to run the test: ${error.message}`;
  }
};
