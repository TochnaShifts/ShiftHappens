const isServer = typeof window === "undefined";
const baseUrl = isServer
  ? process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
  : "";

export async function apiGet<T>(url: string): Promise<T> {
  const fullUrl = isServer ? `${baseUrl}${url}` : url;
  const res = await fetch(fullUrl);
  if (!res.ok) throw new Error((await res.json()).message);
  return res.json();
}

export async function apiPost<T>(
  url: string,
  action: string,
  data: any
): Promise<T> {
  const fullUrl = isServer ? `${baseUrl}${url}` : url;
  const res = await fetch(fullUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action, data }),
  });

  const responseBody = await getRevivedObject(res);
  if (!res.ok) {
    let errorMessage =
      responseBody.message ||
      JSON.stringify(responseBody) ||
      `Request failed with status ${res.status}`;
    throw new Error(errorMessage);
  }

  return responseBody;
}

export async function apiPut<T>(url: string, data: any): Promise<T> {
  const fullUrl = isServer ? `${baseUrl}${url}` : url;
  const res = await fetch(fullUrl, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error((await res.json()).message);
  return res.json();
}

export async function apiDelete<T>(url: string, data?: any): Promise<T> {
  const fullUrl = isServer ? `${baseUrl}${url}` : url;
  const res = await fetch(fullUrl, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: data ? JSON.stringify(data) : undefined,
  });
  if (!res.ok) throw new Error((await res.json()).message);
  return res.json();
}

const getRevivedObject = async (obj: Response) => {
  const text = await obj.text();
  const revivedObj = JSON.parse(text, reviveDates);
  return revivedObj;
};

function reviveDates(key: string, value: any) {
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}T/.test(value)) {
    const date = new Date(value);
    return isNaN(date.getTime()) ? value : date;
  }
  return value;
}
