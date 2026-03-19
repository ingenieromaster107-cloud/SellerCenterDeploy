'use client';

import * as z from 'zod';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from 'react-hook-form';
import { useBoolean } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';

import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';
import { Iconify } from 'src/components/iconify';
import { useState } from 'react';



export const UpdateUserPasswordSchema = z.object({
    oldPassword: z
      .string()
      .min(1, { error: 'Password is required!' })
      .min(6, { error: 'Password must be at least 6 characters!' }),
    newPassword: z.string().min(1, { error: 'New password is required!' }),
    confirmNewPassword: z.string().min(1, { error: 'Confirm password is required!' }),
})
.refine((val) => val.oldPassword !== val.newPassword, {
    error: 'New password must be different than old password',
    path: ['newPassword'],
})
.refine((val) => val.newPassword === val.confirmNewPassword, {
    error: 'Passwords do not match!',
    path: ['confirmNewPassword'],
});


const defaultValues: FormPassValue = {
  oldPassword: '',
  newPassword: '',
  confirmNewPassword: '',
};

type FormPassValue = z.infer<typeof UpdateUserPasswordSchema>;

export function ProfileChangePassword() {
  
  const methods = useForm({
    mode: 'all',
    resolver: zodResolver(UpdateUserPasswordSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      reset();
      toast.success('Update success!');
      console.info('DATA', data);
    } catch (error) {
      console.error(error);
    }
  });

  const [showPassword, setShowPassword] = useState({
    oldPassword: false,
    newPassword: false,
    confirmNewPassword: false,
  });

  const togglePassword = (field: keyof typeof showPassword) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  return (
    <Box sx={{ mt: 3 }}>
      <Form methods={methods} onSubmit={onSubmit}>
        <Card
          sx={{
            p: 3,
            gap: 3,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Field.Text
            name="oldPassword"
            type={showPassword.oldPassword ? 'text' : 'password'}
            label="Old password"
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => togglePassword('oldPassword')} edge="end">
                      <Iconify
                        icon={showPassword.oldPassword ? 'solar:eye-bold' : 'solar:eye-closed-bold'}
                      />
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />

          <Field.Text
            name="newPassword"
            label="New password"
            type={showPassword.newPassword ? 'text' : 'password'}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => togglePassword('newPassword')} edge="end">
                      <Iconify
                        icon={showPassword.newPassword ? 'solar:eye-bold' : 'solar:eye-closed-bold'}
                      />
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
            helperText={
              <Box component="span" sx={{ gap: 0.5, display: 'flex', alignItems: 'center' }}>
                <Iconify icon="solar:info-circle-bold" width={16} /> Password must be minimum 6+
              </Box>
            }
          />

          <Field.Text
            name="confirmNewPassword"
            type={showPassword.confirmNewPassword ? 'text' : 'password'}
            label="Confirm new password"
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => togglePassword('confirmNewPassword')} edge="end">
                      <Iconify
                        icon={showPassword.confirmNewPassword ? 'solar:eye-bold' : 'solar:eye-closed-bold'}
                      />
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />

          <Button type="submit" variant="contained" loading={isSubmitting} sx={{ ml: 'auto' }}>
            Save changes
          </Button>
        </Card>
      </Form>
    </Box>
  );
}