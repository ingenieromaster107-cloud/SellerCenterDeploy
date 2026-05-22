
export interface ChatListResponse {
    wolfsellersMyConversations: WolfsellersMyConversations
}


export interface WolfsellersMyConversations {
  total_count: number
  items: Item[]
}

export interface Item {
  entity_id: number
  buyer_id: number
  status: string
  last_message_at: any
}
