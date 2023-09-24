
export const storage = {
    get: (key:string) => localStorage.getItem(key),
    setToken: (key: string, value:string) => localStorage.setItem(key, value),
    setUser: (key: string, value:string) => localStorage.setItem(key, value),
    clear: (key:string) => localStorage.removeItem(key),
  };
  