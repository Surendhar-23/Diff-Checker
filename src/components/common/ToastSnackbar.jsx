import { Snackbar, Alert } from '@mui/material';

export function ToastSnackbar({ open, message, severity = 'info', onClose }) {
  return (
    <Snackbar
      open={open}
      autoHideDuration={2800}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    >
      <Alert
        onClose={onClose}
        severity={severity}
        variant="filled"
        sx={{
          width: '100%',
          boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
          borderRadius: 2,
          fontWeight: 500,
        }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
}
