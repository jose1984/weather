export async function http<T>(
  request: RequestInfo
): Promise<T> {
  return fetch(request)
    .then((response: any) => {
      if (!response.ok) {
          return Promise.reject(response.statusText)
      }
      return response
    })
    .then((response: Body) => response.json() as Promise<T>)
}