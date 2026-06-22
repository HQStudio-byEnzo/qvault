declare module '#auth-utils' {
  interface User {
    id: string
    name: string
    email: string
    created_at?: string
    sessionVersion?: number
  }
}

export {}
