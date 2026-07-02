export const DEFAULT_HTTP_URL = "http://localhost:3000";

export interface CommandOptions {
  httpUrl?: string;
  token?: string;
}

export interface ResolvedConfig {
  httpUrl: string;
  token?: string;
}

/**
 * Resolves the backend URL and optional bearer token from explicit flags, then env
 * (`ELEMENTATION_HTTP_URL`, `ELEMENTATION_TOKEN`), falling back to localhost.
 */
export function resolveConfig(
  options: CommandOptions = {},
  env: Record<string, string | undefined> = process.env,
): ResolvedConfig {
  const httpUrl = (options.httpUrl ?? env.ELEMENTATION_HTTP_URL ?? DEFAULT_HTTP_URL).replace(
    /\/+$/,
    "",
  );
  const token = options.token ?? env.ELEMENTATION_TOKEN;
  return { httpUrl, token: token && token.length > 0 ? token : undefined };
}
