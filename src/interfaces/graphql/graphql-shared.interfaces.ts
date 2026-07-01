// Request variables: GraphQL pagination args are camelCase ($pageSize, $currentPage).
export interface PageListInfo {
  pageSize:    number,
  currentPage: number,
  totalPages?: number,
}

// Response payload: the API returns page_info in snake_case.
export interface PageInfoResponse {
  current_page: number,
  page_size:    number,
  total_pages:  number,
}