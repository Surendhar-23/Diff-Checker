import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Paper,
  IconButton,
  Chip,
} from '@mui/material';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import MenuBookRoundedIcon from '@mui/icons-material/MenuBookRounded';
import CodeRoundedIcon from '@mui/icons-material/CodeRounded';

import { DIFF_SAMPLES } from '../../core/samples';
import { useDiff } from '../../hooks';

export function SamplePickerModal({ open, onClose }) {
  const { loadSample } = useDiff();

  const handleSelect = (sample) => {
    loadSample(sample);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          p: 1,
          boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          pb: 1,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <MenuBookRoundedIcon color="primary" />
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Curated Diff Samples & Test Suites
          </Typography>
        </Box>
        <IconButton size="small" onClick={onClose}>
          <CloseRoundedIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
          Choose a preset scenario to test how SNDDiffX handles JSON schema migrations, code refactors, SQL queries, and changelogs.
        </Typography>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
            gap: 2,
          }}
        >
          {DIFF_SAMPLES.map((sample) => (
            <Paper
              key={sample.id}
              elevation={0}
              onClick={() => handleSelect(sample)}
              sx={{
                p: 2.5,
                borderRadius: 2.5,
                border: '1px solid',
                borderColor: 'divider',
                bgcolor: 'background.paper',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: 1.5,
                '&:hover': {
                  borderColor: 'primary.main',
                  bgcolor: 'action.hover',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 20px rgba(0,0,0,0.1)',
                },
              }}
            >
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CodeRoundedIcon color="primary" fontSize="small" />
                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                      {sample.name}
                    </Typography>
                  </Box>
                  <Chip
                    label={sample.language.toUpperCase()}
                    size="small"
                    sx={{ height: 20, fontSize: '0.65rem', fontWeight: 700 }}
                  />
                </Box>
                <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.8rem', lineHeight: 1.5 }}>
                  {sample.description}
                </Typography>
              </Box>

              <Button
                variant="outlined"
                size="small"
                fullWidth
                sx={{ mt: 1, textTransform: 'none', fontWeight: 600 }}
              >
                Load Sample
              </Button>
            </Paper>
          ))}
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} variant="text" color="inherit">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
