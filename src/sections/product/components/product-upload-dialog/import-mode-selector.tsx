import type { ImportMode } from 'src/interfaces/load/bulk-loading.interface';

import Stack from '@mui/material/Stack';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';

// ----------------------------------------------------------------------

export interface ImportModeOption {
  value: ImportMode;
  title: string;
  description: string;
}

interface ImportModeSelectorProps {
  value: ImportMode;
  onChange: (mode: ImportMode) => void;
  options: ImportModeOption[];
  disabled?: boolean;
}

export const ImportModeSelector = ({
  value,
  onChange,
  options,
  disabled,
}: Readonly<ImportModeSelectorProps>) => (
  <FormControl component="fieldset" disabled={disabled} sx={{ width: '100%' }}>
    <RadioGroup
      value={value}
      onChange={(_, next) => onChange(next as ImportMode)}
      sx={{ gap: 1 }}
    >
      {options.map((opt) => {
        const selected = value === opt.value;
        return (
          <Stack
            key={opt.value}
            component="label"
            direction="row"
            spacing={1.5}
            alignItems="flex-start"
            sx={{
              p: 1.5,
              borderRadius: 1,
              border: 1,
              borderColor: selected ? 'primary.main' : 'divider',
              cursor: disabled ? 'default' : 'pointer',
              transition: 'border-color .15s',
            }}
          >
            <Radio
              size="small"
              value={opt.value}
              checked={selected}
              onChange={() => onChange(opt.value)}
            />
            <Stack spacing={0.25}>
              <Typography variant="subtitle2">{opt.title}</Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                {opt.description}
              </Typography>
            </Stack>
          </Stack>
        );
      })}
    </RadioGroup>
  </FormControl>
);
