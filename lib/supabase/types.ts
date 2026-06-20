export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      projects: {
        Row: {
          id: string
          title: string
          slug: string
          short_description: string | null
          full_description: string | null
          images: string[] | null
          video_url: string | null
          github_url: string | null
          live_url: string | null
          tech_stack: string[] | null
          featured: boolean
          status: 'draft' | 'published'
          sort_order: number
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['projects']['Row'], 'id' | 'created_at' | 'updated_at'> & {
          id?: string
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['projects']['Insert']>
      }
      experiences: {
        Row: {
          id: string
          num: string
          role: string
          company: string
          period: string
          description: string | null
          tags: string[] | null
          is_current: boolean
          sort_order: number
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['experiences']['Row'], 'id' | 'created_at' | 'updated_at'> & {
          id?: string
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['experiences']['Insert']>
      }
      stack_items: {
        Row: {
          id: string
          name: string
          category: string | null
          icon: string | null
          proficiency: number | null
          sort_order: number
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['stack_items']['Row'], 'id' | 'created_at' | 'updated_at'> & {
          id?: string
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['stack_items']['Insert']>
      }
    }
  }
}

export type Project = Database['public']['Tables']['projects']['Row']
export type Experience = Database['public']['Tables']['experiences']['Row']
export type StackItem = Database['public']['Tables']['stack_items']['Row']