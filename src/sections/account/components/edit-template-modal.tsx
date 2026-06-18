'use client';

import type { ChatTemplate } from 'src/interfaces/chat-templates/chat-templates.list';

import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/system/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Typography from '@mui/material/Typography';

import { useTranslate } from 'src/locales';
import { useUpdateTemplate } from 'src/actions/chat-templates/use-update-template';

import { Form, Field } from 'src/components/hook-form';

import { TemplateDataSchema } from './create-template-modal';

type Props = {
  open: boolean;
  onClose: () => void;
  template: ChatTemplate;
};

type FormValues = {
  title: string;
  content: string;
};

export function EditTemplateModal({ open, onClose, template }: Props) {
  const { translate } = useTranslate();
  const schema = useMemo(() => TemplateDataSchema(translate), [translate]);

  const methods = useForm<FormValues>({
    mode: 'all',
    resolver: zodResolver(schema),
    values: {
      title: template.title,
      content: template.content,
    },
  });

  const { mutate, isPending } = useUpdateTemplate({
    onSuccess: () => onClose(),
    onError: () => {
      methods.setError('title', { message: 'Hubo un error al actualizar la plantilla. Por favor, intenta nuevamente.' });
    },
  });

  const onSubmit = methods.handleSubmit(({ title, content }) => {
    mutate({
      entity_id: template.entity_id,
      is_active: template.is_active ? 1 : 0,
      title,
      content,
    });
  });

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          {translate('responseTemplates.editModal.title')}
        </Typography>
        <Form methods={methods} onSubmit={onSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <Field.Text name="title" label={translate('responseTemplates.form.titleField')} />
            <Field.Text name="content" label={translate('responseTemplates.form.contentField')} />
            <Button type="submit" variant="contained" loading={isPending}>
              {translate('responseTemplates.editModal.saveButton')}
            </Button>
          </Box>
        </Form>
      </Box>
    </Dialog>
  );
}
