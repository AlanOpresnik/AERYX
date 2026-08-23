import "server-only";

import { auth } from "@clerk/nextjs/server";
import { request } from "./api";

export async function serverRequest<T>(
  endpoint: string,
  options?: RequestInit,
) {
  const { getToken } = await auth();

  const token = await getToken();

  return request<T>(
    endpoint,
    options,
    token,
  );
}