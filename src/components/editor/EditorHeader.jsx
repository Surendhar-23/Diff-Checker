import { Box, Typography, IconButton, Tooltip } from '@mui/material';
import ContentPasteRoundedIcon from '@mui/icons-material/ContentPasteRounded';
import UploadFileRoundedIcon from '@mui/icons-material/UploadFileRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import AutoFixHighRoundedIcon from '@mui/icons-material/AutoFixHighRounded';
import { useRef } from 'react';

export function EditorHeader({
  title,
  value,
  onChange,
  onClear,
  onFormatJson,
  onFileUpload,
}) {
  const fileInputRef = useRef(null);

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) onChange(text);
    } catch {
      // Fallback
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target.result;
      if (typeof text === 'string') {
        onFileUpload?.(text, file.name);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const lines = value ? value.split('\n').length : 0;
  const chars = value ? value.length : 0;

  return (
    <Box
      sx={{
        px: 2,
        py: 0.75,
        bgcolor: 'background.paper',
        borderBottom: '1px solid',
        borderColor: 'divider',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      {/* Title & Stats */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: '0.85rem' }}>
          {title}
        </Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary', bgcolor: 'action.hover', px: 1, py: 0.2, borderRadius: 1 }}>
          {lines} lines · {chars} chars
        </Typography>
      </Box>

      {/* Pane Tools */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        {onFormatJson && (
          <Tooltip title="Format as JSON">
            <IconButton size="small" onClick={onFormatJson} sx={{ p: 0.5 }}>
              <AutoFixHighRoundedIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </Tooltip>
        )}

        <Tooltip title="Paste from clipboard">
          <IconButton size="small" onClick={handlePaste} sx={{ p: 0.5 }}>
            <ContentPasteRoundedIcon sx={{ fontSize: 16 }} />
          </IconButton>
        </Tooltip>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />

        <Tooltip title="Upload file">
          <IconButton
            size="small"
            onClick={() => fileInputRef.current?.click()}
            sx={{ p: 0.5 }}
          >
            <UploadFileRoundedIcon sx={{ fontSize: 16 }} />
          </IconButton>
        </Tooltip>

        <Tooltip title="Clear pane">
          <IconButton size="small" onClick={onClear} sx={{ p: 0.5, color: 'text.secondary' }}>
            <DeleteOutlineRoundedIcon sx={{ fontSize: 16 }} />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
}
