import Box from '@mui/system/Box';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import CardHeader from '@mui/material/CardHeader';

export function ProfileTemplates() {
  const headerTemplate = () => (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <CardHeader
        title="Plantillas de respuesta"
      />
      <Button>Add</Button>
    </Box>
  );
  //TODO: Implementar tabla de plantillas, implementar graph's para el crud de plantillas.
  return (
    <Card sx={{ p: 3 }}>
      {headerTemplate()}
    </Card>
  );
}
