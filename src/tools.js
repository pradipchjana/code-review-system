import { walk } from "@std/fs/walk";

const decoder = (msg) => new TextDecoder().decode(msg);

const createOutputMsg = (output) => {
  if (output.code !== 0) return decoder(output.stderr);
  return decoder(output.stdout);
};

export const cloneRepo = async ({ repo, username }) => {
  const repoName = `${repo}-${username}`;
  const repoPath = `git-clones/${repoName}`;

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

      const gitCloneCommand = new Deno.Command("git", {
        args: ["clone", url, repoPath],
        stdout: "piped",
        stderr: "piped",
        env: {
          GIT_TERMINAL_PROMPT: "0", //Fails don't ask for credientials
        },
      });

      const output = await gitCloneCommand.output();
      return createOutputMsg(output);
    }
    return err.message;
  }
};

export const getDirectoryStructure = async ({ repo, username }) => {
  const repoName = `${repo}-${username}`;
  const repoPath = `git-clones/${repoName}`;
  const entries = await Array.fromAsync(walk(repoPath, { skip: [/\.git/] }));

  const filePaths = entries.map((entry) => entry.path);
  return filePaths.join("\n");
};

// console.log(await getDirectoryStructure({repo:"html-semantic",username:"pradipchjana"}));


export const readFile = async ({ repo, username, fileName }) => {
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
  const repoName = `${repo}-${username}`;
  const filePath = `git-clones/${repoName}/${fileName}`;
  try {
    await Deno.writeTextFile(filePath, content);
    return `Successfully wrote the ${fileName} at ${filePath}`;
  } catch (error) {
    return `Failed to write the file: ${error.message}`;
  }
};

export const testCoverage = async ({ repo, username }) => {
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
    return createOutputMsg(output);
  } catch (error) {
    return `Failed to run the test: ${error.message}`;
  }
};
