import type { TemplateStatusVariant } from 'src/sections/account/components/template-table-toolbar';

import { useState } from 'react';

import { useTable } from 'src/components';
import { useTranslate } from 'src/locales';
import { useGetTemplates } from 'src/actions/chat-templates/use-get-templates';

export interface TableHead {
  id: string;
  label: string;
  alignRight: boolean;
}
export function useChatTemplate() {
  const table = useTable({ defaultOrderBy: 'from_date', defaultOrder: 'desc' });
  const { data } = useGetTemplates();
  const { translate: t } = useTranslate();
  const [searchValue, setSearchValue] = useState('');
  const [statusTab, setStatusTab] = useState<TemplateStatusVariant>('all');
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });

  const TABLE_HEAD: TableHead[] = [
    { id: 'title', label: t('responseTemplates.tableHeaders.title'), alignRight: false },
    { id: 'content', label: t('responseTemplates.tableHeaders.content'), alignRight: false },
    { id: 'created_at', label: t('responseTemplates.tableHeaders.createdAt'), alignRight: false },
    { id: 'status', label: t('responseTemplates.tableHeaders.status'), alignRight: true },
    { id: 'actions', label: t('responseTemplates.tableHeaders.actions'), alignRight: true },
  ];

  return {
    TABLE_HEAD,
    table,
    searchValue,
    setSearchValue,
    statusTab,
    setStatusTab,
    paginationModel,
    setPaginationModel,
    data,
  };
}
