export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      calculations: {
        Row: {
          id: string
          created_at: string
          user_id: string
          input: string
          result: string
          steps: Json[]
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          input: string
          result: string
          steps: Json[]
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          input?: string
          result?: string
          steps?: Json[]
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
} 