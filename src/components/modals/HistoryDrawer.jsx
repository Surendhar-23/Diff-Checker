import { useState, useMemo } from 'react';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  TextField,
  InputAdornment,
  List,
  ListItem,
  ListItemButton,
  Chip,
  Tooltip,
  Button,
} from '@mui/material';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import PushPinRoundedIcon from '@mui/icons-material/PushPinRounded';
import PushPinOutlinedIcon from '@mui/icons-material/PushPinOutlined';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import HistoryRoundedIcon from '@mui/icons-material/HistoryRounded';

import { useHistory, useDiff } from '../../hooks';

export function HistoryDrawer({ open, onClose }) {
  const { history, removeHistoryItem, togglePinItem, clearHistory } = useHistory();
  const { restoreFromHistory } = useDiff();
  const [search, setSearch] = useState('');

  const filteredHistory = useMemo(() => {
    if (!search.trim()) return history;
    const q = search.toLowerCase();
    return history.filter(
      (item) =>
        item.title?.toLowerCase().includes(q) ||
        item.original?.toLowerCase().includes(q) ||
        item.modified?.toLowerCase().includes(q)
    );
  }, [history, search]);

  const handleRestore = (item) => {
    restoreFromHistory(item);
    onClose();
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: '100%', sm: 380 },
          bgcolor: 'background.paper',
          p: 0,
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <HistoryRoundedIcon color="primary" />
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            Comparison History
          </Typography>
          <Chip label={history.length} size="small" sx={{ height: 20, fontSize: '0.7rem' }} />
        </Box>
        <IconButton size="small" onClick={onClose}>
          <CloseRoundedIcon fontSize="small" />
        </IconButton>
      </Box>

      {/* Search & Actions */}
      <Box sx={{ p: 2, pb: 1, borderBottom: '1px solid', borderColor: 'divider' }}>
        <TextField
          size="small"
          fullWidth
          placeholder="Search history..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchRoundedIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
              </InputAdornment>
            ),
          }}
          sx={{ mb: 1.5 }}
        />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            Auto-saves your recent edits
          </Typography>
          {history.length > 0 && (
            <Button
              size="small"
              color="error"
              onClick={clearHistory}
              sx={{ fontSize: '0.75rem', py: 0.2 }}
            >
              Clear Unpinned
            </Button>
          )}
        </Box>
      </Box>

      {/* History Items List */}
      <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 1 }}>
        {filteredHistory.length === 0 ? (
          <Box sx={{ p: 4, textAlign: 'center', color: 'text.secondary' }}>
            <HistoryRoundedIcon sx={{ fontSize: 48, opacity: 0.3, mb: 1 }} />
            <Typography variant="body2">No comparisons in history yet.</Typography>
          </Box>
        ) : (
          <List disablePadding>
            {filteredHistory.map((item) => {
              const dateStr = item.timestamp
                ? new Date(item.timestamp).toLocaleDateString([], {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                : 'Recent';

              return (
                <ListItem
                  key={item.id}
                  disablePadding
                  sx={{
                    mb: 1,
                    borderRadius: 1.5,
                    border: '1px solid',
                    borderColor: item.isPinned ? 'primary.main' : 'divider',
                    bgcolor: 'background.default',
                    overflow: 'hidden',
                  }}
                  secondaryAction={
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Tooltip title={item.isPinned ? 'Unpin' : 'Pin'}>
                        <IconButton
                          size="small"
                          onClick={() => togglePinItem(item.id)}
                          sx={{ p: 0.5, color: item.isPinned ? 'primary.main' : 'text.disabled' }}
                        >
                          {item.isPinned ? (
                            <PushPinRoundedIcon sx={{ fontSize: 16 }} />
                          ) : (
                            <PushPinOutlinedIcon sx={{ fontSize: 16 }} />
                          )}
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete item">
                        <IconButton
                          size="small"
                          onClick={() => removeHistoryItem(item.id)}
                          sx={{ p: 0.5, color: 'text.disabled', '&:hover': { color: 'error.main' } }}
                        >
                          <DeleteOutlineRoundedIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  }
                >
                  <ListItemButton
                    onClick={() => handleRestore(item)}
                    sx={{ p: 1.5, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 0.5 }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', pr: 6 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600, noWrap: true, maxWidth: 180 }}>
                        {item.title || 'Untitled Diff'}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'text.disabled', fontSize: '0.7rem' }}>
                        {dateStr}
                      </Typography>
                    </Box>

                    {/* Stats */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                      <Chip
                        label={`${item.stats?.similarityScore ?? 0}% match`}
                        size="small"
                        sx={{ height: 18, fontSize: '0.65rem', fontWeight: 700 }}
                      />
                      <Typography variant="caption" sx={{ color: 'diff.addedText', fontWeight: 600 }}>
                        +{item.stats?.additions ?? 0}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'diff.deletedText', fontWeight: 600 }}>
                        -{item.stats?.deletions ?? 0}
                      </Typography>
                    </Box>
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
        )}
      </Box>
    </Drawer>
  );
}
