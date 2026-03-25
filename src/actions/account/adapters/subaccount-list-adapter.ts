import type { SubAccountInterface, SubAccountResponseInterface } from "src/interfaces";

import { parsePermissions } from "src/utils/parse-permissions";

import { capitalizeFirstLetter } from "src/utils";


export function subaccountListAdapter(subAccounts: SubAccountResponseInterface[]): SubAccountInterface[] {
  return subAccounts.map((subAccount) => ({
    id: subAccount.entity_id,
    firstname: capitalizeFirstLetter(subAccount.firstname),
    lastname: capitalizeFirstLetter(subAccount.lastname),
    email: subAccount.email,
    status: subAccount.status === 1 ? 'ACTIVE' : 'INACTIVE',
    createdAt: subAccount.created_at,
    permissions: parsePermissions(subAccount.permission_type)
  }));
};
