
export interface ChatListResponse {
    interMyConversations: InterMyConversations
}


export interface InterMyConversations {
  total_count: number
  items: Item[]
}

export interface Item {
  entity_id: number
  buyer_id: number
  status: string
  last_message_at: any
}
