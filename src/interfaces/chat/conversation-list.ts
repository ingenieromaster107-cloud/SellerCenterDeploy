
export interface ConversationListResponse {
    wolfsellersConversationMessages: WolfsellersMyConversations
}


export interface WolfsellersMyConversations {
  total_count: number
  items: Item[]
}

export interface Item {
  entity_id: number
  author_type: string
  content: string
  was_moderated: boolean
  created_at: string
}
