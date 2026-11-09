
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  
  "graphql_public": {
          Tables: {
            [_ in never]: never
          }
          Views: {
            [_ in never]: never
          }
          Functions: {
            "graphql":
{ Args: { "extensions"?: Json,"operationName"?: string,"query"?: string,"variables"?: Json }; Returns: Json
                           }
          }
          Enums: {
            [_ in never]: never
          }
          CompositeTypes: {
            [_ in never]: never
          }
        },"public": {
          Tables: {
            "audit_events": {
                  Row: {
                    "action": string,"actor_id": string | null,"details": NonNullable<Json>,"entity_id": string,"entity_type": string,"id": string,"timestamp": string
                  }
                  ComputedFields: never
                  Insert: {
                    "action": string,"actor_id"?: string | null,"details"?: NonNullable<Json>,"entity_id": string,"entity_type": string,"id"?: string,"timestamp"?: string
                  }
                  Update: {
                    "action"?: string,"actor_id"?: string | null,"details"?: NonNullable<Json>,"entity_id"?: string,"entity_type"?: string,"id"?: string,"timestamp"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "audit_events_actor_id_fkey"
      columns: ["actor_id"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    }
                  ]
                },"enquiries": {
                  Row: {
                    "budget_range": string | null,"category_id": string,"created_at": string,"desired_outcome": string,"id": string,"idempotency_key": string,"organisation": string,"problem_description": string,"public_reference": string,"requester_email": string,"requester_id": string | null,"requester_name": string,"status": string,"updated_at": string,"urgency": string
                  }
                  ComputedFields: never
                  Insert: {
                    "budget_range"?: string | null,"category_id": string,"created_at"?: string,"desired_outcome": string,"id"?: string,"idempotency_key": string,"organisation": string,"problem_description": string,"public_reference"?: string,"requester_email": string,"requester_id"?: string | null,"requester_name": string,"status"?: string,"updated_at"?: string,"urgency": string
                  }
                  Update: {
                    "budget_range"?: string | null,"category_id"?: string,"created_at"?: string,"desired_outcome"?: string,"id"?: string,"idempotency_key"?: string,"organisation"?: string,"problem_description"?: string,"public_reference"?: string,"requester_email"?: string,"requester_id"?: string | null,"requester_name"?: string,"status"?: string,"updated_at"?: string,"urgency"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "enquiries_category_id_fkey"
      columns: ["category_id"]
isOneToOne: false
      referencedRelation: "service_categories"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "enquiries_requester_id_fkey"
      columns: ["requester_id"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    }
                  ]
                },"milestones": {
                  Row: {
                    "created_at": string,"description": string | null,"enquiry_id": string,"id": string,"name": string,"status": string,"target_date": string,"updated_at": string
                  }
                  ComputedFields: never
                  Insert: {
                    "created_at"?: string,"description"?: string | null,"enquiry_id": string,"id"?: string,"name": string,"status"?: string,"target_date": string,"updated_at"?: string
                  }
                  Update: {
                    "created_at"?: string,"description"?: string | null,"enquiry_id"?: string,"id"?: string,"name"?: string,"status"?: string,"target_date"?: string,"updated_at"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "milestones_enquiry_id_fkey"
      columns: ["enquiry_id"]
isOneToOne: false
      referencedRelation: "client_enquiry_view"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "milestones_enquiry_id_fkey"
      columns: ["enquiry_id"]
isOneToOne: false
      referencedRelation: "enquiries"
      referencedColumns: ["id"]
    }
                  ]
                },"profiles": {
                  Row: {
                    "created_at": string,"email": string,"id": string,"name": string | null,"organisation": string | null,"role": string
                  }
                  ComputedFields: never
                  Insert: {
                    "created_at"?: string,"email": string,"id": string,"name"?: string | null,"organisation"?: string | null,"role"?: string
                  }
                  Update: {
                    "created_at"?: string,"email"?: string,"id"?: string,"name"?: string | null,"organisation"?: string | null,"role"?: string
                  }
                  Relationships: [
                    
                  ]
                },"proposals": {
                  Row: {
                    "assumptions": string,"created_at": string,"decision_status": string,"deliverables": string,"enquiry_id": string,"estimated_timeline": string,"exclusions": string,"id": string,"scope": string,"title": string,"updated_at": string
                  }
                  ComputedFields: never
                  Insert: {
                    "assumptions": string,"created_at"?: string,"decision_status"?: string,"deliverables": string,"enquiry_id": string,"estimated_timeline": string,"exclusions": string,"id"?: string,"scope": string,"title": string,"updated_at"?: string
                  }
                  Update: {
                    "assumptions"?: string,"created_at"?: string,"decision_status"?: string,"deliverables"?: string,"enquiry_id"?: string,"estimated_timeline"?: string,"exclusions"?: string,"id"?: string,"scope"?: string,"title"?: string,"updated_at"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "proposals_enquiry_id_fkey"
      columns: ["enquiry_id"]
isOneToOne: true
      referencedRelation: "client_enquiry_view"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "proposals_enquiry_id_fkey"
      columns: ["enquiry_id"]
isOneToOne: true
      referencedRelation: "enquiries"
      referencedColumns: ["id"]
    }
                  ]
                },"service_categories": {
                  Row: {
                    "created_at": string,"description": string,"id": string,"is_active": boolean,"slug": string,"sort_order": number,"title": string
                  }
                  ComputedFields: never
                  Insert: {
                    "created_at"?: string,"description": string,"id"?: string,"is_active"?: boolean,"slug": string,"sort_order"?: number,"title": string
                  }
                  Update: {
                    "created_at"?: string,"description"?: string,"id"?: string,"is_active"?: boolean,"slug"?: string,"sort_order"?: number,"title"?: string
                  }
                  Relationships: [
                    
                  ]
                },"updates": {
                  Row: {
                    "author_id": string,"body": string,"created_at": string,"enquiry_id": string,"id": string,"visibility": string
                  }
                  ComputedFields: never
                  Insert: {
                    "author_id"?: string,"body": string,"created_at"?: string,"enquiry_id": string,"id"?: string,"visibility": string
                  }
                  Update: {
                    "author_id"?: string,"body"?: string,"created_at"?: string,"enquiry_id"?: string,"id"?: string,"visibility"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "updates_author_id_fkey"
      columns: ["author_id"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "updates_enquiry_id_fkey"
      columns: ["enquiry_id"]
isOneToOne: false
      referencedRelation: "client_enquiry_view"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "updates_enquiry_id_fkey"
      columns: ["enquiry_id"]
isOneToOne: false
      referencedRelation: "enquiries"
      referencedColumns: ["id"]
    }
                  ]
                }
          }
          Views: {
            "client_enquiry_view": {
                  Row: {
                    "budget_range": string | null,"category_title": string | null,"created_at": string,"desired_outcome": string,"id": string,"latest_update": string | null,"latest_update_at": string | null,"problem_description": string,"public_reference": string,"status": string,"updated_at": string,"urgency": string
                  }
                  ComputedFields: never
                  Relationships: [
                    
                  ]
                }
          }
          Functions: {
            "category_title":
{ Args: { "p_category_id": string }; Returns: string
                           },
"change_enquiry_status":
{ Args: { "p_reference": string,"p_to": string }; Returns: string
                           },
"changed_fields":
{ Args: { "p_new": Json,"p_old": Json }; Returns: Json
                           },
"generate_public_reference":
{ Args: Record<PropertyKey, never>; Returns: string
                           },
"is_admin":
{ Args: Record<PropertyKey, never>; Returns: boolean
                           },
"is_staff":
{ Args: Record<PropertyKey, never>; Returns: boolean
                           },
"set_user_role":
{ Args: { "p_role": string,"p_user": string }; Returns: string
                           },
"submit_enquiry":
{ Args: { "p": Json }; Returns: string
                           }
          }
          Enums: {
            [_ in never]: never
          }
          CompositeTypes: {
            [_ in never]: never
          }
        }
}

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
  ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
      Row: infer R
    }
    ? R
    : never
  : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
      Insert: infer I
    }
    ? I
    : never
  : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
      Update: infer U
    }
    ? U
    : never
  : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
  ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
  : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never
> = PublicCompositeTypeNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
  ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never

export const Constants = {
  "graphql_public": {
          Enums: {
            
          }
        },"public": {
          Enums: {
            
          }
        }
} as const
