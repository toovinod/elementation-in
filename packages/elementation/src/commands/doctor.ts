import { HttpElementationClient } from "@elementation/mcp";
import { resolveConfig, type CommandOptions } from "../config";

function nodeMajor(version: string): number {
  return Number.parseInt(version.replace(/^v/, "").split(".")[0] ?? "0", 10);
}

/** Prints a readable health report and returns whether every check passed. */
export async function runDoctor(options: CommandOptions = {}): Promise<boolean> {
  const config = resolveConfig(options);
  const out = (line: string): void => void process.stdout.write(`${line}\n`);

  const nodeOk = nodeMajor(process.version) >= 20;
  out("Elementation doctor");
  out(`  ${nodeOk ? "PASS" : "FAIL"}  Node >= 20 (${process.version})`);
  out(`  ....  Backend: ${config.httpUrl}`);
  out(`  ....  Auth: ${config.token ? "bearer token set" : "none (local mode)"}`);

  const client = new HttpElementationClient({ baseUrl: config.httpUrl, token: config.token });
  let reachable = false;
  try {
    const health = await client.getHealth();
    reachable = health.ok;
    out(`  ${reachable ? "PASS" : "FAIL"}  Reached ${health.service}`);
    const status = await client.getStatus();
    const { sessions, annotations, pending, webhooks } = status.counts;
    out(
      `  ....  ${sessions} session(s), ${annotations} annotation(s), ${pending} pending, ${webhooks} webhook(s)`,
    );
  } catch (error) {
    out(
      `  FAIL  Could not reach backend: ${error instanceof Error ? error.message : String(error)}`,
    );
  }

  const allOk = nodeOk && reachable;
  out(allOk ? "\nAll checks passed." : "\nSome checks failed.");
  if (!allOk) process.exitCode = 1;
  return allOk;
}
