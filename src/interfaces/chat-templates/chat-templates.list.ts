import type  { TemplateStatusVariant } from 'src/sections/account/components/template-table-toolbar';

export interface ChatTemplateResponse {
  interSellersMyResponseTemplates: InterSellersMyResponseTemplates;
}
export interface InterSellersMyResponseTemplates {
  total_count: number
  items: ChatTemplateList
}

export type ChatTemplateList = ChatTemplate[];

export interface ChatTemplate {
  content: string;
  created_at: string;
  entity_id: number;
  is_active: boolean;
  seller_id: number;
  sort_order: number;
  title: string;
  updated_at: string;
}

//Template table interfaces

export interface TemplateTableProps {
  tableHead: TableHead[];
  tableData: ChatTemplate[];
  table: any;
  searchValue: string;
  setSearchValue: (value: string) => void;
  statusTab: TemplateStatusVariant;
  setStatusTab: (value: TemplateStatusVariant) => void;
  paginationModel: { page: number; pageSize: number };
  setPaginationModel: (value: { page: number; pageSize: number } | ((prev: { page: number; pageSize: number }) => { page: number; pageSize: number })) => void;


}

export interface TableHead {
  id: string;
  label: string;
  alignRight: boolean;
}
