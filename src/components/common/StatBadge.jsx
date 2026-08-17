import { Box, Typography } from '@mui/material';

export function StatBadge({ icon: Icon, label, value, color, bg, border }) {
  return (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 0.75,
        px: 1.25,
        py: 0.4,
        borderRadius: '6px',
        bgcolor: bg || 'action.hover',
        border: '1px solid',
        borderColor: border || 'divider',
        fontSize: '0.8125rem',
      }}
    >
      {Icon && <Icon sx={{ fontSize: 16, color }} />}
      <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
        {label}:
      </Typography>
      <Typography variant="caption" sx={{ color, fontWeight: 700 }}>
        {value}
      </Typography>
    </Box>
  );
}
