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
      users: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      subscriptions: {
        Row: {
          id: string
          user_id: string
          status: string
          plan: string
          price_id: string | null
          quantity: number
          cancel_at_period_end: boolean
          current_period_start: string
          current_period_end: string
          created_at: string
          ended_at: string | null
          trial_start: string | null
          trial_end: string | null
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
        }
        Insert: {
          id?: string
          user_id: string
          status: string
          plan: string
          price_id?: string | null
          quantity?: number
          cancel_at_period_end?: boolean
          current_period_start: string
          current_period_end: string
          created_at?: string
          ended_at?: string | null
          trial_start?: string | null
          trial_end?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          status?: string
          plan?: string
          price_id?: string | null
          quantity?: number
          cancel_at_period_end?: boolean
          current_period_start?: string
          current_period_end?: string
          created_at?: string
          ended_at?: string | null
          trial_start?: string | null
          trial_end?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
        }
      }
      user_preferences: {
        Row: {
          id: string
          user_id: string
          theme: string
          notifications_enabled: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          theme?: string
          notifications_enabled?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          theme?: string
          notifications_enabled?: boolean
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}