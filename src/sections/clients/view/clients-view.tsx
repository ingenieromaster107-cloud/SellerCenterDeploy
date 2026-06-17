'use client';

import type { ClientListDataTable } from 'src/interfaces/clients/client-list';

import { useCallback } from 'react';

import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';

import { paths } from 'src/routes/paths';

import { useClientList } from 'src/hooks/clients/use-client-list';
import { useSellerLoyalty } from 'src/hooks/clients/use-seller-loyalty';

import { useTranslate } from 'src/locales';
import { HomeContent } from 'src/layouts/home';

import { Label } from 'src/components/label';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { CommonTable } from 'src/sections/common';

import { LOYALTY_CLASSIFICATION } from '../constants';
import { LoyaltySummaryCards } from '../components/loyalty-summary-cards';

export default function ClientsView() {
  const { clientList, tableHead } = useClientList();
  const { summary, loyaltyByEmail, isLoading } = useSellerLoyalty();
  const { translate } = useTranslate();

  const renderClientRow = useCallback(
    (client: ClientListDataTable, index: number) => {
      const loyalty = loyaltyByEmail.get(client.email.trim().toLowerCase());
      const { labelKey, color } = LOYALTY_CLASSIFICATION[loyalty?.classification ?? 'NEW'];

      return (
        <TableRow key={index}>
          <TableCell align="left">{client.full_name}</TableCell>
          <TableCell align="left">{client.email}</TableCell>
          <TableCell align="left">{client.location}</TableCell>
          <TableCell align="left">{client.customer_since}</TableCell>
          <TableCell align="left">{loyalty?.ordersCount ?? 0}</TableCell>
          <TableCell align="left">
            <Label color={color} variant="soft">
              {translate(labelKey)}
            </Label>
          </TableCell>
        </TableRow>
      );
    },
    [loyaltyByEmail, translate]
  );

  return (
    <HomeContent className="clients-view">
      <CustomBreadcrumbs
        heading={translate('clientsModule.title')}
        links={[
          { name: translate('breadcrumbs.home'), href: paths.home.root },
          { name: translate('clientsModule.title') },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <LoyaltySummaryCards summary={summary} isLoading={isLoading} />

      <CommonTable
        tableHeadCell={tableHead}
        contentTable={clientList}
        renderCell={renderClientRow}
        filterKeys={['full_name', 'email']}
        minWidth={800}
        searchPlaceholder={`${translate('clientsModule.table.searchFilter')}`}
      />
    </HomeContent>
  );
}
