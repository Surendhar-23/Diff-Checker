import { useEffect, useState, useMemo } from 'react';
import { Box, Typography, IconButton, Tooltip, Button, ToggleButtonGroup, ToggleButton } from '@mui/material';
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import EditNoteRoundedIcon from '@mui/icons-material/EditNoteRounded';
import MenuBookRoundedIcon from '@mui/icons-material/MenuBookRounded';

import { useDiff, useSettings, useSyncScroll, useClipboard } from '../../hooks';
import { LINE_STATUS, VIEW_MODES } from '../../core/constants';
import { DIFF_SAMPLES } from '../../core/samples';
import { CollapsedLines } from './CollapsedLines';

export function SplitDiffView() {
  const { originalText, modifiedText, diffResult, currentChangeIndex, originalTitle, modifiedTitle, searchQuery, setViewMode, loadSample } = useDiff();
  const { settings } = useSettings();
  const { leftRef, rightRef } = useSyncScroll(settings.syncScroll);
  const { copy } = useClipboard();

  const [copiedLineId, setCopiedLineId] = useState(null);
  const [expandedHunks, setExpandedHunks] = useState({});
  const [mobileTab, setMobileTab] = useState('left');

  // Group rows for collapsible unchanged sections if enabled
  const processedRows = useMemo(() => {
    const rows = diffResult?.splitRows || [];
    if (!settings.collapseUnchanged) return rows;

    const threshold = settings.collapseThreshold || 8;
    const context = settings.contextLineCount || 3;
    const result = [];

    let i = 0;
    while (i < rows.length) {
      if (rows[i].type === LINE_STATUS.UNCHANGED) {
        let count = 0;
        let startIdx = i;
        while (i < rows.length && rows[i].type === LINE_STATUS.UNCHANGED) {
          count++;
          i++;
        }

        const hunkKey = `hunk-${startIdx}`;
        if (count > threshold && !expandedHunks[hunkKey]) {
          // Show head context
          for (let k = 0; k < context && startIdx + k < startIdx + count; k++) {
            result.push(rows[startIdx + k]);
          }

          const hiddenCount = count - context * 2;
          if (hiddenCount > 0) {
            result.push({
              isCollapsedBar: true,
              hunkKey,
              hiddenCount,
            });
          }

          // Show tail context
          const tailStart = Math.max(startIdx + context, startIdx + count - context);
          for (let k = tailStart; k < startIdx + count; k++) {
            result.push(rows[k]);
          }
        } else {
          for (let k = startIdx; k < startIdx + count; k++) {
            result.push(rows[k]);
          }
        }
      } else {
        result.push(rows[i]);
        i++;
      }
    }
    return result;
  }, [diffResult?.splitRows, settings.collapseUnchanged, settings.collapseThreshold, settings.contextLineCount, expandedHunks]);

  // Scroll to active change when currentChangeIndex changes
  useEffect(() => {
    if (currentChangeIndex <= 0) return;
    const targetElement = document.getElementById(`split-row-change-${currentChangeIndex}`);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [currentChangeIndex]);

  const handleCopyLine = (text, id) => {
    copy(text);
    setCopiedLineId(id);
    setTimeout(() => setCopiedLineId(null), 1500);
  };

  const renderHighlightedContent = (parts, type, query) => {
    if (!parts || parts.length === 0) return <span>&nbsp;</span>;

    return parts.map((part, idx) => {
      const isWordAdded = part.type === LINE_STATUS.ADDED;
      const isWordDeleted = part.type === LINE_STATUS.DELETED;

      let bg = 'transparent';
      let color = 'inherit';

      if (isWordAdded) {
        bg = 'var(--diff-add-word)';
        color = 'var(--diff-add-text)';
      } else if (isWordDeleted) {
        bg = 'var(--diff-del-word)';
        color = 'var(--diff-del-text)';
      }

      // Search match check
      if (query && query.trim() && part.text.toLowerCase().includes(query.toLowerCase())) {
        return (
          <span
            key={idx}
            style={{
              backgroundColor: '#eab308',
              color: '#000',
              borderRadius: '2px',
              padding: '0 2px',
              fontWeight: 700,
            }}
          >
            {part.text}
          </span>
        );
      }

      return (
        <span
          key={idx}
          style={{
            backgroundColor: bg,
            color,
            borderRadius: '2px',
            textDecoration: isWordDeleted ? 'none' : 'none',
          }}
        >
          {part.text}
        </span>
      );
    });
  };

  if (!originalText?.trim() && !modifiedText?.trim()) {
    return (
      <Box
        sx={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2,
          p: 3,
          textAlign: 'center',
          bgcolor: 'background.editor',
        }}
      >
        <Box
          sx={{
            width: 56,
            height: 56,
            borderRadius: '16px',
            bgcolor: 'action.hover',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'primary.main',
          }}
        >
          <EditNoteRoundedIcon sx={{ fontSize: 32 }} />
        </Box>

        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          No Content to Compare Yet
        </Typography>

        <Typography variant="body2" sx={{ color: 'text.secondary', maxWidth: 460 }}>
          You are in Comparison View. Type or paste your original and modified text into Edit mode, or load a sample demo.
        </Typography>

        <Box sx={{ display: 'flex', gap: 1.5, mt: 1 }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<EditNoteRoundedIcon />}
            onClick={() => setViewMode(VIEW_MODES.EDITOR)}
            sx={{ fontWeight: 600, px: 2.5 }}
          >
            Open Text Editor
          </Button>

          <Button
            variant="outlined"
            color="inherit"
            startIcon={<MenuBookRoundedIcon />}
            onClick={() => loadSample(DIFF_SAMPLES[0])}
            sx={{ fontWeight: 600 }}
          >
            Load Sample Demo
          </Button>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%', overflow: 'hidden' }}>
      {/* Mobile-only Segmented Pane Switcher */}
      <Box
        sx={{
          display: { xs: 'flex', md: 'none' },
          p: 0.75,
          bgcolor: 'background.paper',
          borderBottom: '1px solid',
          borderColor: 'divider',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <ToggleButtonGroup
          value={mobileTab}
          exclusive
          onChange={(_, next) => next && setMobileTab(next)}
          size="small"
          fullWidth
          sx={{
            maxWidth: 340,
            bgcolor: 'action.hover',
            p: '2px',
            borderRadius: '8px',
            '& .MuiToggleButton-root': {
              border: 'none',
              borderRadius: '6px',
              fontSize: '0.75rem',
              fontWeight: 600,
              py: 0.4,
              textTransform: 'none',
              '&.Mui-selected': {
                bgcolor: 'background.paper',
                color: 'primary.main',
                fontWeight: 700,
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              },
            },
          }}
        >
          <ToggleButton value="left">
            🔴 {originalTitle || 'Original'}
          </ToggleButton>
          <ToggleButton value="right">
            🟢 {modifiedTitle || 'Modified'}
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* Main Grid Container */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
          flexGrow: 1,
          width: '100%',
          bgcolor: 'background.editor',
          overflow: 'hidden',
          minHeight: 0,
        }}
      >
        {/* Left Column (Original) */}
        <Box
          sx={{
            display: { xs: mobileTab === 'left' ? 'flex' : 'none', md: 'flex' },
            flexDirection: 'column',
            height: '100%',
            borderRight: { xs: 'none', md: '1px solid' },
            borderColor: 'divider',
            overflow: 'hidden',
          }}
        >
        {/* Pane Header */}
        <Box
          sx={{
            px: 2,
            py: 0.75,
            bgcolor: 'background.gutter',
            borderBottom: '1px solid',
            borderColor: 'divider',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase' }}>
            {originalTitle || 'Original'}
          </Typography>
        </Box>

        {/* Scrollable Diff View Container */}
        <Box
          ref={leftRef}
          sx={{
            flexGrow: 1,
            overflow: 'auto',
            fontFamily: 'var(--font-mono)',
            fontSize: `${settings.fontSize}px`,
            lineHeight: 1.6,
          }}
        >
          {processedRows.map((row, idx) => {
            if (row.isCollapsedBar) {
              return (
                <CollapsedLines
                  key={row.hunkKey}
                  count={row.hiddenCount}
                  onExpand={() =>
                    setExpandedHunks((prev) => ({ ...prev, [row.hunkKey]: true }))
                  }
                />
              );
            }

            const info = row.left;
            const isChange = row.changeIndex !== null;
            const isActiveChange = isChange && row.changeIndex === currentChangeIndex;

            let rowBg = 'transparent';
            let rowTextColor = 'inherit';

            if (info.type === LINE_STATUS.DELETED) {
              rowBg = 'var(--diff-del-bg)';
              rowTextColor = 'var(--diff-del-text)';
            } else if (info.type === LINE_STATUS.MODIFIED) {
              rowBg = 'var(--diff-del-bg)';
              rowTextColor = 'var(--diff-del-text)';
            } else if (info.type === LINE_STATUS.EMPTY) {
              rowBg = 'action.hover';
            }

            return (
              <Box
                key={row.id || idx}
                id={isActiveChange ? `split-row-change-${row.changeIndex}` : undefined}
                className="diff-line"
                sx={{
                  bgcolor: rowBg,
                  color: rowTextColor,
                  borderLeft: isActiveChange ? '3px solid' : '3px solid transparent',
                  borderLeftColor: isActiveChange ? 'primary.main' : 'transparent',
                  position: 'relative',
                  '&:hover .copy-btn': { opacity: 1 },
                }}
              >
                {/* Gutter (Line Number) */}
                {settings.showLineNumbers && (
                  <Box
                    sx={{
                      width: 48,
                      minWidth: 48,
                      px: 1,
                      textAlign: 'right',
                      userSelect: 'none',
                      color: 'text.disabled',
                      bgcolor: 'background.gutter',
                      borderRight: '1px solid',
                      borderColor: 'divider',
                      fontSize: '0.75rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'flex-end',
                    }}
                  >
                    {info.lineNum || ''}
                  </Box>
                )}

                {/* Content */}
                <Box
                  sx={{
                    px: 1.5,
                    flexGrow: 1,
                    whiteSpace: settings.wrapLines ? 'pre-wrap' : 'pre',
                    wordBreak: 'break-all',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  {info.type === LINE_STATUS.EMPTY ? (
                    <span style={{ opacity: 0.2 }}>&nbsp;</span>
                  ) : (
                    renderHighlightedContent(info.parts, info.type, searchQuery)
                  )}
                </Box>

                {/* Hover Copy Button */}
                {info.content && (
                  <Tooltip title={copiedLineId === `left-${idx}` ? 'Copied!' : 'Copy line'}>
                    <IconButton
                      size="small"
                      className="copy-btn"
                      onClick={() => handleCopyLine(info.content, `left-${idx}`)}
                      sx={{
                        position: 'absolute',
                        right: 4,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        opacity: 0,
                        transition: 'opacity 0.15s ease',
                        p: 0.3,
                        bgcolor: 'background.paper',
                        boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
                      }}
                    >
                      {copiedLineId === `left-${idx}` ? (
                        <CheckRoundedIcon sx={{ fontSize: 13, color: 'success.main' }} />
                      ) : (
                        <ContentCopyRoundedIcon sx={{ fontSize: 13 }} />
                      )}
                    </IconButton>
                  </Tooltip>
                )}
              </Box>
            );
          })}
        </Box>
      </Box>

      {/* Right Column (Modified) */}
      <Box
        sx={{
          display: { xs: mobileTab === 'right' ? 'flex' : 'none', md: 'flex' },
          flexDirection: 'column',
          height: '100%',
          overflow: 'hidden',
        }}
      >
        {/* Pane Header */}
        <Box
          sx={{
            px: 2,
            py: 0.75,
            bgcolor: 'background.gutter',
            borderBottom: '1px solid',
            borderColor: 'divider',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase' }}>
            {modifiedTitle || 'Modified'}
          </Typography>
        </Box>

        {/* Scrollable Diff View Container */}
        <Box
          ref={rightRef}
          sx={{
            flexGrow: 1,
            overflow: 'auto',
            fontFamily: 'var(--font-mono)',
            fontSize: `${settings.fontSize}px`,
            lineHeight: 1.6,
          }}
        >
          {processedRows.map((row, idx) => {
            if (row.isCollapsedBar) {
              return (
                <CollapsedLines
                  key={row.hunkKey}
                  count={row.hiddenCount}
                  onExpand={() =>
                    setExpandedHunks((prev) => ({ ...prev, [row.hunkKey]: true }))
                  }
                />
              );
            }

            const info = row.right;
            const isChange = row.changeIndex !== null;
            const isActiveChange = isChange && row.changeIndex === currentChangeIndex;

            let rowBg = 'transparent';
            let rowTextColor = 'inherit';

            if (info.type === LINE_STATUS.ADDED) {
              rowBg = 'var(--diff-add-bg)';
              rowTextColor = 'var(--diff-add-text)';
            } else if (info.type === LINE_STATUS.MODIFIED) {
              rowBg = 'var(--diff-add-bg)';
              rowTextColor = 'var(--diff-add-text)';
            } else if (info.type === LINE_STATUS.EMPTY) {
              rowBg = 'action.hover';
            }

            return (
              <Box
                key={row.id || idx}
                className="diff-line"
                sx={{
                  bgcolor: rowBg,
                  color: rowTextColor,
                  borderLeft: isActiveChange ? '3px solid' : '3px solid transparent',
                  borderLeftColor: isActiveChange ? 'primary.main' : 'transparent',
                  position: 'relative',
                  '&:hover .copy-btn': { opacity: 1 },
                }}
              >
                {/* Gutter (Line Number) */}
                {settings.showLineNumbers && (
                  <Box
                    sx={{
                      width: 48,
                      minWidth: 48,
                      px: 1,
                      textAlign: 'right',
                      userSelect: 'none',
                      color: 'text.disabled',
                      bgcolor: 'background.gutter',
                      borderRight: '1px solid',
                      borderColor: 'divider',
                      fontSize: '0.75rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'flex-end',
                    }}
                  >
                    {info.lineNum || ''}
                  </Box>
                )}

                {/* Content */}
                <Box
                  sx={{
                    px: 1.5,
                    flexGrow: 1,
                    whiteSpace: settings.wrapLines ? 'pre-wrap' : 'pre',
                    wordBreak: 'break-all',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  {info.type === LINE_STATUS.EMPTY ? (
                    <span style={{ opacity: 0.2 }}>&nbsp;</span>
                  ) : (
                    renderHighlightedContent(info.parts, info.type, searchQuery)
                  )}
                </Box>

                {/* Hover Copy Button */}
                {info.content && (
                  <Tooltip title={copiedLineId === `right-${idx}` ? 'Copied!' : 'Copy line'}>
                    <IconButton
                      size="small"
                      className="copy-btn"
                      onClick={() => handleCopyLine(info.content, `right-${idx}`)}
                      sx={{
                        position: 'absolute',
                        right: 4,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        opacity: 0,
                        transition: 'opacity 0.15s ease',
                        p: 0.3,
                        bgcolor: 'background.paper',
                        boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
                      }}
                    >
                      {copiedLineId === `right-${idx}` ? (
                        <CheckRoundedIcon sx={{ fontSize: 13, color: 'success.main' }} />
                      ) : (
                        <ContentCopyRoundedIcon sx={{ fontSize: 13 }} />
                      )}
                    </IconButton>
                  </Tooltip>
                )}
              </Box>
            );
          })}
        </Box>
      </Box>
    </Box>
    </Box>
  );
}
