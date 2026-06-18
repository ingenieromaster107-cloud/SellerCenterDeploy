import type { ChatTemplate, TemplateTableProps } from 'src/interfaces/chat-templates/chat-templates.list';

import { useMemo } from 'react';
import { useBoolean } from 'minimal-shared/hooks';

import Box from '@mui/system/Box';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';

import { useTranslate } from 'src/locales';
import { TableHeadCustom, TablePaginationCustom } from 'src/components';
import { useDeleteTemplate } from 'src/actions/chat-templates/use-delete-template';
import { useUpdateTemplate } from 'src/actions/chat-templates/use-update-template';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { ConfirmDialog } from 'src/components/custom-dialog';

import { EditTemplateModal } from './edit-template-modal';
import { TemplateTableToolbar } from './template-table-toolbar';

// ----------------------------------------------------------------------

function TemplateTableRow({ row }: { row: ChatTemplate }) {
  const { translate } = useTranslate();
  const editDialog = useBoolean();
  const deleteDialog = useBoolean();

  const { mutate: updateTemplate, isPending: isToggling } = useUpdateTemplate();
  const { mutate: deleteTemplate, isPending: isDeleting } = useDeleteTemplate({
    onSuccess: deleteDialog.onFalse,
  });

  const handleToggleActive = () => {
    updateTemplate({
      entity_id: row.entity_id,
      is_active: row.is_active ? 0 : 1,
      title: row.title,
      content: row.content,
    });
  };

  return (
    <>
      <TableRow>
        <TableCell>{row.title}</TableCell>
        <TableCell>{row.content}</TableCell>
        <TableCell>{row.created_at}</TableCell>
        <TableCell>
          {row.is_active
            ? translate('responseTemplates.statusCell.active')
            : translate('responseTemplates.statusCell.inactive')}
        </TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          <Tooltip title={translate('responseTemplates.actions.edit')}>
            <IconButton size="small" color="info" onClick={editDialog.onTrue}>
              <Iconify icon="solar:pen-bold" width={18} />
            </IconButton>
          </Tooltip>

          <Tooltip
            title={
              row.is_active
                ? translate('responseTemplates.actions.deactivate')
                : translate('responseTemplates.actions.activate')
            }
          >
            <IconButton size="small" onClick={handleToggleActive} disabled={isToggling}>
              <Iconify
                icon={row.is_active ? 'solar:stop-circle-bold' : 'solar:play-circle-bold'}
                width={18}
              />
            </IconButton>
          </Tooltip>

          <Tooltip title={translate('responseTemplates.actions.delete')}>
            <IconButton size="small" color="error" onClick={deleteDialog.onTrue}>
              <Iconify icon="solar:trash-bin-trash-bold" width={18} />
            </IconButton>
          </Tooltip>
        </TableCell>
      </TableRow>

      <EditTemplateModal open={editDialog.value} onClose={editDialog.onFalse} template={row} />

      <ConfirmDialog
        open={deleteDialog.value}
        onClose={deleteDialog.onFalse}
        title={translate('responseTemplates.deleteConfirm.title')}
        content={`${translate('responseTemplates.deleteConfirm.content')} "${row.title}"?`}
        action={
          <Button
            variant="contained"
            color="error"
            loading={isDeleting}
            onClick={() => deleteTemplate(row.entity_id)}
          >
            {translate('responseTemplates.deleteConfirm.confirmButton')}
          </Button>
        }
      />
    </>
  );
}

// ----------------------------------------------------------------------

export function TemplateTable(props: TemplateTableProps) {
  const { tableData, searchValue, statusTab, paginationModel } = props;

  const filteredData = useMemo(() => {
    const search = searchValue.trim().toLowerCase();

    return tableData
      .filter((row) => {
        if (statusTab === 'ACTIVE') return row.is_active;
        if (statusTab === 'INACTIVE') return !row.is_active;
        return true;
      })
      .filter((row) => {
        if (!search) return true;
        return row.title.toLowerCase().includes(search) || row.content.toLowerCase().includes(search);
      });
  }, [tableData, searchValue, statusTab]);

  const paginatedData = useMemo(() => {
    const start = paginationModel.page * paginationModel.pageSize;
    return filteredData.slice(start, start + paginationModel.pageSize);
  }, [filteredData, paginationModel]);

  return (
    <Box>
      <TemplateTableToolbar
        searchValue={props.searchValue}
        onSearchChange={props.setSearchValue}
        statusFilter={props.statusTab}
        onStatusChange={(value) => {
          props.setStatusTab(value);
          props.setPaginationModel((p) => ({ ...p, page: 0 }));
        }}
      />
      <Scrollbar>
        <Table>
          <TableHeadCustom
            sx={{}}
            orderBy={props.table.orderBy}
            order={props.table.order}
            headCells={props.tableHead}
            onSort={props.table.onSort}
          />
          <TableBody>
            {paginatedData.map((row) => (
              <TemplateTableRow key={row.entity_id} row={row} />
            ))}
          </TableBody>
        </Table>
      </Scrollbar>

      <TablePaginationCustom
        count={filteredData.length}
        page={paginationModel.page}
        rowsPerPage={paginationModel.pageSize}
        onPageChange={(_, page) => props.setPaginationModel((p) => ({ ...p, page }))}
        onRowsPerPageChange={(e) =>
          props.setPaginationModel({ page: 0, pageSize: parseInt(e.target.value, 10) })
        }
        onChangeDense={props.table.onChangeDense}
      />
    </Box>
  );
}
