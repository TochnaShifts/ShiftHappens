export async function apiGet<T>(url: string): Promise<T> {
    const res = await fetch(url)
    if (!res.ok) throw new Error((await res.json()).message)
    return res.json()
  }
  
  export async function apiPost<T>(url: string, action: string, data: any): Promise<T> {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, data }),
    })
    if (!res.ok) throw new Error((await res.json()).message)
    return res.json()
  }
  
  export async function apiPut<T>(url: string, data: any): Promise<T> {
    const res = await fetch(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error((await res.json()).message)
      return res.json()
  }
  
  export async function apiDelete<T>(url: string, data?: any): Promise<T> {
    const res = await fetch(url, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: data ? JSON.stringify(data) : undefined,
    })
    if (!res.ok) throw new Error((await res.json()).message)
    return res.json()
  }