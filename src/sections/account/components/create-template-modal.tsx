import * as z from 'zod';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/system/Box';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { useTranslate } from 'src/locales';
import { useCreateTemplate } from 'src/actions/chat-templates/use-create-template';

import { Form, Field } from 'src/components/hook-form';

type CreateTemplateModalProps = {
  modalState: boolean;
  onClose: () => void;
};

type FormTemplateDataValues = {
  title: string;
  content: string;
};

const defaultTemplateDataValues: FormTemplateDataValues = {
  title: '',
  content: '',
};

export const TemplateDataSchema = (t: (key: string) => string) =>
  z.object({
    title: z.string().min(1, { error: t('formErrorRequired.firstNameRequired') }),
    content: z.string().min(1, { error: t('formErrorRequired.lastNameRequired') }),
  });

export function CreateTemplateModal({ modalState, onClose }: CreateTemplateModalProps) {
  const { translate } = useTranslate();
  const schemaTemplateData = useMemo(() => TemplateDataSchema(translate), [translate]);

  const methodTemplateData = useForm({
    mode: 'all',
    resolver: zodResolver(schemaTemplateData),
    defaultValues: defaultTemplateDataValues,
  });

  const { mutate, isPending } = useCreateTemplate({
    onSuccess: () => {
      methodTemplateData.reset();
      onClose();
    },
    onError: (error) => {
      methodTemplateData.setError('title', { message: error.message });
    },
  });

  const onSubmit = methodTemplateData.handleSubmit(({ title, content }) => {
    mutate({ title, content, is_active: 1 });
  });

  return (
    <Dialog open={modalState} onClose={onClose} fullWidth maxWidth="sm">
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          {translate('responseTemplates.createModal.title')}
        </Typography>
        <Form methods={methodTemplateData} onSubmit={onSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <Field.Text name="title" label={translate('responseTemplates.form.titleField')} />
            <Field.Text name="content" label={translate('responseTemplates.form.contentField')} />
            <Button type="submit" variant="contained" loading={isPending}>
              {translate('responseTemplates.createModal.saveButton')}
            </Button>
          </Box>
        </Form>
      </Box>
    </Dialog>
  );
}
