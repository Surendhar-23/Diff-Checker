import { Box, Typography, Link } from '@mui/material';
import KeyboardRoundedIcon from '@mui/icons-material/KeyboardRounded';
import { useDiff } from '../../hooks';

export function AppFooter({ onOpenShortcuts }) {
  const { originalText, modifiedText } = useDiff();

  const origLines = originalText ? originalText.split('\n').length : 0;
  const modLines = modifiedText ? modifiedText.split('\n').length : 0;
  const origChars = originalText ? originalText.length : 0;
  const modChars = modifiedText ? modifiedText.length : 0;

  return (
    <Box
      sx={{
        px: { xs: 1.5, md: 2.5 },
        py: 0.5,
        bgcolor: 'background.paper',
        borderTop: '1px solid',
        borderColor: 'divider',
        display: { xs: 'none', sm: 'flex' },
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        fontSize: '0.75rem',
        color: 'text.secondary',
        userSelect: 'none',
        minHeight: 28,
        flexShrink: 0,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Typography variant="caption" sx={{ fontSize: '0.72rem' }}>
          Original: <strong>{origLines}</strong> lines ({origChars} chars)
        </Typography>
        <Typography variant="caption" sx={{ fontSize: '0.72rem' }}>
          Modified: <strong>{modLines}</strong> lines ({modChars} chars)
        </Typography>
        <Typography variant="caption" sx={{ fontSize: '0.72rem', display: { xs: 'none', sm: 'inline' } }}>
          Encoding: UTF-8
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Link
          component="button"
          onClick={onOpenShortcuts}
          underline="hover"
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            color: 'text.secondary',
            fontSize: '0.72rem',
            cursor: 'pointer',
          }}
        >
          <KeyboardRoundedIcon sx={{ fontSize: 13 }} />
          Press <strong>?</strong> for shortcuts
        </Link>
      </Box>
    </Box>
  );
}
