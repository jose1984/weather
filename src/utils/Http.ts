export async function get<T>(
  request: RequestInfo
): Promise<T> {
  const response: Response = await fetch(request)
  if (!response.ok) {
    return Promise.reject(response.statusText)
  }
  const data: T = await response.json()
  return data
}