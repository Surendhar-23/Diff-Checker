import { useState } from 'react';
import { Box, Paper, Typography, Button } from '@mui/material';
import CloudUploadRoundedIcon from '@mui/icons-material/CloudUploadRounded';
import CompareArrowsRoundedIcon from '@mui/icons-material/CompareArrowsRounded';
import { useDiff, useSettings } from '../../hooks';
import { VIEW_MODES } from '../../core/constants';
import { EditorHeader } from './EditorHeader';

export function TextEditorPane() {
  const {
    originalText,
    setOriginalText,
    modifiedText,
    setModifiedText,
    originalTitle,
    setOriginalTitle,
    modifiedTitle,
    setModifiedTitle,
    beautifyOriginal,
    beautifyModified,
    setViewMode,
  } = useDiff();

  const { settings } = useSettings();

  const [leftDragOver, setLeftDragOver] = useState(false);
  const [rightDragOver, setRightDragOver] = useState(false);

  // Tab key handler to insert spaces
  const handleKeyDown = (e, setter) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const target = e.target;
      const start = target.selectionStart;
      const end = target.selectionEnd;
      const spaces = ' '.repeat(settings.tabSize || 2);
      const val = target.value;
      const updated = val.substring(0, start) + spaces + val.substring(end);
      setter(updated);
      setTimeout(() => {
        target.selectionStart = target.selectionEnd = start + spaces.length;
      }, 0);
    }
  };

  // Drag and drop handlers
  const handleDrop = (e, setter, titleSetter, setDragOver) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target.result;
      if (typeof text === 'string') {
        setter(text);
        titleSetter(file.name);
      }
    };
    reader.readAsText(file);
  };

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
        height: '100%',
        width: '100%',
        bgcolor: 'background.default',
        overflow: 'hidden',
      }}
    >
      {/* Left Pane (Original) */}
      <Paper
        elevation={0}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          borderRight: { xs: 'none', md: '1px solid' },
          borderBottom: { xs: '1px solid', md: 'none' },
          borderColor: 'divider',
          bgcolor: 'background.paper',
          position: 'relative',
          borderRadius: 0,
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setLeftDragOver(true);
        }}
        onDragLeave={() => setLeftDragOver(false)}
        onDrop={(e) => handleDrop(e, setOriginalText, setOriginalTitle, setLeftDragOver)}
      >
        <EditorHeader
          title={originalTitle || 'Original Text'}
          value={originalText}
          onChange={setOriginalText}
          onClear={() => setOriginalText('')}
          onFormatJson={beautifyOriginal}
          onFileUpload={(text, name) => {
            setOriginalText(text);
            setOriginalTitle(name);
          }}
        />

        <Box sx={{ flexGrow: 1, position: 'relative', overflow: 'hidden' }}>
          <textarea
            value={originalText}
            onChange={(e) => setOriginalText(e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, setOriginalText)}
            placeholder="Paste or type original text here, or drag & drop a file..."
            spellCheck={false}
            style={{
              width: '100%',
              height: '100%',
              padding: '16px',
              border: 'none',
              outline: 'none',
              resize: 'none',
              fontFamily: 'var(--font-mono)',
              fontSize: `${settings.fontSize}px`,
              lineHeight: 1.6,
              background: 'transparent',
              color: 'inherit',
              whiteSpace: settings.wrapLines ? 'pre-wrap' : 'pre',
              tabSize: settings.tabSize,
            }}
          />

          {leftDragOver && (
            <Box
              sx={{
                position: 'absolute',
                inset: 8,
                borderRadius: 2,
                border: '2px dashed',
                borderColor: 'primary.main',
                bgcolor: 'action.hover',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1,
                zIndex: 10,
                pointerEvents: 'none',
              }}
            >
              <CloudUploadRoundedIcon sx={{ fontSize: 40, color: 'primary.main' }} />
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                Drop original file here
              </Typography>
            </Box>
          )}
        </Box>
      </Paper>

      {/* Right Pane (Modified) */}
      <Paper
        elevation={0}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          bgcolor: 'background.paper',
          position: 'relative',
          borderRadius: 0,
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setRightDragOver(true);
        }}
        onDragLeave={() => setRightDragOver(false)}
        onDrop={(e) => handleDrop(e, setModifiedText, setModifiedTitle, setRightDragOver)}
      >
        <EditorHeader
          title={modifiedTitle || 'Modified Text'}
          value={modifiedText}
          onChange={setModifiedText}
          onClear={() => setModifiedText('')}
          onFormatJson={beautifyModified}
          onFileUpload={(text, name) => {
            setModifiedText(text);
            setModifiedTitle(name);
          }}
        />

        <Box sx={{ flexGrow: 1, position: 'relative', overflow: 'hidden' }}>
          <textarea
            value={modifiedText}
            onChange={(e) => setModifiedText(e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, setModifiedText)}
            placeholder="Paste or type modified text here, or drag & drop a file..."
            spellCheck={false}
            style={{
              width: '100%',
              height: '100%',
              padding: '16px',
              border: 'none',
              outline: 'none',
              resize: 'none',
              fontFamily: 'var(--font-mono)',
              fontSize: `${settings.fontSize}px`,
              lineHeight: 1.6,
              background: 'transparent',
              color: 'inherit',
              whiteSpace: settings.wrapLines ? 'pre-wrap' : 'pre',
              tabSize: settings.tabSize,
            }}
          />

          {rightDragOver && (
            <Box
              sx={{
                position: 'absolute',
                inset: 8,
                borderRadius: 2,
                border: '2px dashed',
                borderColor: 'primary.main',
                bgcolor: 'action.hover',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1,
                zIndex: 10,
                pointerEvents: 'none',
              }}
            >
              <CloudUploadRoundedIcon sx={{ fontSize: 40, color: 'primary.main' }} />
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                Drop modified file here
              </Typography>
            </Box>
          )}
        </Box>
      </Paper>

      {/* Floating Compare Button when text is present */}
      {(originalText || modifiedText) && (
        <Box
          sx={{
            position: 'absolute',
            bottom: 24,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 20,
          }}
        >
          <Button
            variant="contained"
            color="primary"
            size="medium"
            startIcon={<CompareArrowsRoundedIcon />}
            onClick={() => setViewMode(VIEW_MODES.SPLIT)}
            sx={{
              fontWeight: 700,
              fontSize: '0.875rem',
              px: 3,
              py: 1,
              borderRadius: '24px',
              boxShadow: '0 8px 24px rgba(37,99,235,0.45)',
            }}
          >
            Compare Differences (Split View)
          </Button>
        </Box>
      )}
    </Box>
  );
}
