import { Box, Button } from '@mui/material';
import UnfoldMoreRoundedIcon from '@mui/icons-material/UnfoldMoreRounded';

export function CollapsedLines({ count, onExpand }) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 0.75,
        bgcolor: 'action.hover',
        borderTop: '1px dashed',
        borderBottom: '1px dashed',
        borderColor: 'divider',
        cursor: 'pointer',
        '&:hover': {
          bgcolor: 'action.selected',
        },
      }}
      onClick={onExpand}
    >
      <Button
        size="small"
        startIcon={<UnfoldMoreRoundedIcon sx={{ fontSize: 16 }} />}
        sx={{
          fontSize: '0.75rem',
          color: 'text.secondary',
          fontWeight: 600,
          textTransform: 'none',
          py: 0.2,
        }}
      >
        Expand {count} unchanged lines
      </Button>
    </Box>
  );
}
