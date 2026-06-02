import type { TemplatesResponse } from 'src/interfaces';

import { useBoolean } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Collapse from '@mui/material/Collapse';

import { Scrollbar } from 'src/components/scrollbar';

import { CollapseButton } from './styles';

// ----------------------------------------------------------------------

type Props = {
  templates: TemplatesResponse[];
  onSelectTemplate?: (content: string) => void;
};

export function ChatRoomTemplates({ templates, onSelectTemplate }: Props) {
  const collapse = useBoolean(true);

  const totalAttachments = templates.length;

  

  const renderList = () =>
    templates.map((template) => (
      <Scrollbar key={template.entity_id}>
        <Box sx={{ gap: 1.5, display: 'flex', alignItems: 'center' }}>
          <Button onClick={() => onSelectTemplate?.(template.content)}>{template.title}</Button>
        </Box>
      </Scrollbar>
    ));

  return (
    <>
      <CollapseButton
        selected={collapse.value}
        disabled={!totalAttachments}
        onClick={collapse.onToggle}
      >
        {`Templates (${totalAttachments})`}
      </CollapseButton>

      {!!totalAttachments && (
        <Collapse in={collapse.value}>
          <Stack spacing={2} sx={{ p: 2 }}>
            {renderList()}
          </Stack>
        </Collapse>
      )}
    </>
  );
}
