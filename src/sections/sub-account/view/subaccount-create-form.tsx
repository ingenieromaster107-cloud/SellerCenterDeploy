import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import MenuItem from '@mui/material/MenuItem';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import { useCreateSubAccount } from 'src/actions/account/use-create-subaccount';

import { toast } from 'src/components/snackbar';
import { Form, Field, schemaUtils } from 'src/components/hook-form';

import { PERMISSIONS, ACCOUNT_STATUS } from '../constants/status';


export const SubAccountSchema = z.object({
  firstname: z.string().min(1, { error: 'Name is required!' }),
  lastname: z.string().min(1, { error: 'Lastname is required!' }),
  email: schemaUtils.email(),
  permissions: z.array(z.string().min(1, { error: 'Each permission is required!' })).nonempty({
    message: 'At least one permission is required!',
  }),
  status: z.string().nonempty({
    message: 'Status is required!',
  }),
});

interface Props {
  open: boolean;
  onClose: () => void;
}

export function SubAccountCreateForm({ open, onClose }: Omit<Props, 'currentUser'>) {
  const methods = useForm({
    mode: 'all',
    resolver: zodResolver(SubAccountSchema),
    defaultValues: { firstname: '', lastname: '', email: '', status: 'ACTIVE', permissions: [] },
  });
  const { mutateAsync } = useCreateSubAccount();

  const { reset, handleSubmit, formState: { isSubmitting } } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      const res = await mutateAsync({
        firstname: data.firstname,
        lastname: data.lastname,
        email: data.email,
        status: data.status == 'ACTIVE' ? '1' : '0',
        permissionType: data.permissions.join(','),
        customerId: localStorage.getItem('customer_id')!,
      });

      if (res.createSellerSubAccount.successMessage != 'Sub Account was saved successfully') {
        throw new Error('Failed to create subaccount');
      }

      toast.success('Subaccount created successfully!');

      reset();
      onClose();
    } catch (error) {
      console.error(error);
      toast.error('Failed to create subaccount!');
    }
  });

  return (
    <Dialog
      fullWidth
      maxWidth={false}
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: { maxWidth: 720 },
        },
      }}
    >
      <DialogTitle>Create subaccount</DialogTitle>

      <Form methods={methods} onSubmit={onSubmit}>
        <DialogContent>
          <Alert variant="outlined" severity="info" sx={{ mb: 3 }}>
            SubAccount is waiting for confirmation
          </Alert>

          <Box
            sx={{
              rowGap: 3,
              columnGap: 2,
              display: 'grid',
              gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
            }}
          >
            <Field.Select name="status" label="Status">
              {ACCOUNT_STATUS.map((status) => (
                <MenuItem key={status.value} value={status.value}>
                  {status.label}
                </MenuItem>
              ))}
            </Field.Select>

            <Box sx={{ display: { xs: 'none', sm: 'block' } }} />

            <Field.Text name="firstname" label="Name" />
            <Field.Text name="lastname" label="Last name" />
            <Field.Text name="email" label="Email address" />

            <Field.MultiSelect
                chip
                name="permissions"
                label="Permissions"
                options={PERMISSIONS}
            />

          </Box>
        </DialogContent>

        <DialogActions>
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" loading={isSubmitting}>
            Create
          </Button>
        </DialogActions>
      </Form>
    </Dialog>
  );
}
