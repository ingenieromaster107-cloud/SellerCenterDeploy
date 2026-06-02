
export interface ConversationListResponse {
    interConversationMessages: InterConversationMessages
}


export interface InterConversationMessages {
  total_count: number
  items: Item[]
}

export interface Item {
  entity_id: number
  product_context_id: number
  author_type: string
  content: string
  was_moderated: boolean
  created_at: string
}
