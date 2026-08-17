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
} from '@mui/material';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import KeyboardRoundedIcon from '@mui/icons-material/KeyboardRounded';

const SHORTCUT_LIST = [
  { keyCombo: ['Alt', 'N'], desc: 'Jump to Next Difference' },
  { keyCombo: ['Alt', 'P'], desc: 'Jump to Previous Difference' },
  { keyCombo: ['Alt', 'S'], desc: 'Swap Left & Right Texts' },
  { keyCombo: ['Alt', '1'], desc: 'Switch to Split (Side-by-Side) View' },
  { keyCombo: ['Alt', '2'], desc: 'Switch to Unified (Inline) View' },
  { keyCombo: ['Alt', '3'], desc: 'Switch to Raw Text Editor' },
  { keyCombo: ['Alt', 'F'], desc: 'Focus In-Diff Search' },
  { keyCombo: ['Tab'], desc: 'Insert Indent Spaces in Editor' },
  { keyCombo: ['?'], desc: 'Open Keyboard Shortcuts Guide' },
  { keyCombo: ['Esc'], desc: 'Close open dialogs or clear search' },
];

export function ShortcutsDialog({ open, onClose }) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
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
          <KeyboardRoundedIcon color="primary" />
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Keyboard Shortcuts
          </Typography>
        </Box>
        <IconButton size="small" onClick={onClose}>
          <CloseRoundedIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
          Speed up your comparison workflows with standard power-user hotkeys:
        </Typography>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 1.5 }}>
          {SHORTCUT_LIST.map((item, idx) => (
            <Paper
              key={idx}
              elevation={0}
              sx={{
                p: 1.5,
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider',
                bgcolor: 'background.default',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {item.desc}
              </Typography>
              <Box sx={{ display: 'flex', gap: 0.5 }}>
                {item.keyCombo.map((k, kIdx) => (
                  <Box
                    key={kIdx}
                    sx={{
                      px: 0.8,
                      py: 0.3,
                      borderRadius: 1,
                      bgcolor: 'background.paper',
                      border: '1px solid',
                      borderColor: 'divider',
                      boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                    }}
                  >
                    {k}
                  </Box>
                ))}
              </Box>
            </Paper>
          ))}
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} variant="contained">
          Got it
        </Button>
      </DialogActions>
    </Dialog>
  );
}
