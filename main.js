import { runAgent } from "./src/agent.js";
import { createMessage } from "./src/olama.js";

const logger = (msg) => {
  console.log({ msg });
};

const main = async () => {
  const messages = createMessage(Deno.args);
  try {
    const result = await runAgent(messages);
    console.log("FINAL OUTPUT", result);
  } catch (err) {
    logger(["AGENT ERROR", err.message]);
  }
};

main();
