import { useState } from 'react';

import Box from '@mui/system/Box';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import CardHeader from '@mui/material/CardHeader';

import { useChatTemplate } from 'src/hooks/profile/use-chat-template';

import { useTranslate } from 'src/locales';

import { TemplateTable } from './template-table';
import { CreateTemplateModal } from './create-template-modal';

type Props = {
  className?: string;
};

export function ProfileTemplates({ className }: Props) {
  const { translate } = useTranslate();
  const {
    TABLE_HEAD,
    table,
    searchValue,
    setSearchValue,
    statusTab,
    setStatusTab,
    paginationModel,
    setPaginationModel,
    data,
  } = useChatTemplate();

  const [modalOpen, setModalOpen] = useState(false);
  const onCloseModal = () => setModalOpen(false);

  const headerTemplate = () => (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <CardHeader title={translate('responseTemplates.title')} />
      <Button onClick={() => setModalOpen(true)}>{translate('responseTemplates.addButton')}</Button>
    </Box>
  );
  return (
    <Card sx={{ p: 3 }} className={className}>
      {modalOpen && <CreateTemplateModal modalState={modalOpen} onClose={onCloseModal} />}
      {headerTemplate()}
      <TemplateTable
        tableHead={TABLE_HEAD}
        tableData={data?.interSellersMyResponseTemplates.items || []}
        table={table}
        searchValue={searchValue}
        setSearchValue={setSearchValue}
        statusTab={statusTab}
        setStatusTab={setStatusTab}
        paginationModel={paginationModel}
        setPaginationModel={setPaginationModel}
      />
    </Card>
  );
}
