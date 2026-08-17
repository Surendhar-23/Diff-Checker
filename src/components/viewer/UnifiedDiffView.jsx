import { useEffect, useState, useMemo } from 'react';
import { Box, IconButton, Tooltip } from '@mui/material';
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';

import { useDiff, useSettings, useClipboard } from '../../hooks';
import { LINE_STATUS } from '../../core/constants';
import { CollapsedLines } from './CollapsedLines';

export function UnifiedDiffView() {
  const { diffResult, currentChangeIndex, searchQuery } = useDiff();
  const { settings } = useSettings();
  const { copy } = useClipboard();

  const [copiedLineId, setCopiedLineId] = useState(null);
  const [expandedHunks, setExpandedHunks] = useState({});

  // Group lines for collapsible unchanged sections
  const processedLines = useMemo(() => {
    const lines = diffResult?.unifiedLines || [];
    if (!settings.collapseUnchanged) return lines;

    const threshold = settings.collapseThreshold || 8;
    const context = settings.contextLineCount || 3;
    const result = [];

    let i = 0;
    while (i < lines.length) {
      if (lines[i].type === LINE_STATUS.UNCHANGED) {
        let count = 0;
        let startIdx = i;
        while (i < lines.length && lines[i].type === LINE_STATUS.UNCHANGED) {
          count++;
          i++;
        }

        const hunkKey = `unified-hunk-${startIdx}`;
        if (count > threshold && !expandedHunks[hunkKey]) {
          for (let k = 0; k < context && startIdx + k < startIdx + count; k++) {
            result.push(lines[startIdx + k]);
          }

          const hiddenCount = count - context * 2;
          if (hiddenCount > 0) {
            result.push({
              isCollapsedBar: true,
              hunkKey,
              hiddenCount,
            });
          }

          const tailStart = Math.max(startIdx + context, startIdx + count - context);
          for (let k = tailStart; k < startIdx + count; k++) {
            result.push(lines[k]);
          }
        } else {
          for (let k = startIdx; k < startIdx + count; k++) {
            result.push(lines[k]);
          }
        }
      } else {
        result.push(lines[i]);
        i++;
      }
    }
    return result;
  }, [diffResult?.unifiedLines, settings.collapseUnchanged, settings.collapseThreshold, settings.contextLineCount, expandedHunks]);

  // Scroll to active change
  useEffect(() => {
    if (currentChangeIndex <= 0) return;
    const targetElement = document.getElementById(`unified-row-change-${currentChangeIndex}`);
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
        bg = 'var(--diff-add-word-dark, rgba(46, 160, 67, 0.35))';
      } else if (isWordDeleted) {
        bg = 'var(--diff-del-word-dark, rgba(248, 81, 73, 0.35))';
      }

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
          }}
        >
          {part.text}
        </span>
      );
    });
  };

  return (
    <Box
      sx={{
        height: '100%',
        width: '100%',
        bgcolor: 'background.editor',
        overflow: 'auto',
        fontFamily: 'var(--font-mono)',
        fontSize: `${settings.fontSize}px`,
        lineHeight: 1.6,
      }}
    >
      {processedLines.map((line, idx) => {
        if (line.isCollapsedBar) {
          return (
            <CollapsedLines
              key={line.hunkKey}
              count={line.hiddenCount}
              onExpand={() =>
                setExpandedHunks((prev) => ({ ...prev, [line.hunkKey]: true }))
              }
            />
          );
        }

        const isAdded = line.type === LINE_STATUS.ADDED;
        const isDeleted = line.type === LINE_STATUS.DELETED;
        const isChange = line.changeIndex !== null;
        const isActiveChange = isChange && line.changeIndex === currentChangeIndex;

        let rowBg = 'transparent';
        let rowColor = 'inherit';
        let marker = ' ';

        if (isAdded) {
          rowBg = 'var(--diff-add-bg-dark, rgba(46, 160, 67, 0.15))';
          rowColor = 'var(--diff-add-text-dark, #7ee787)';
          marker = '+';
        } else if (isDeleted) {
          rowBg = 'var(--diff-del-bg-dark, rgba(248, 81, 73, 0.15))';
          rowColor = 'var(--diff-del-text-dark, #ff7b72)';
          marker = '-';
        }

        return (
          <Box
            key={line.id || idx}
            id={isActiveChange ? `unified-row-change-${line.changeIndex}` : undefined}
            className="diff-line"
            sx={{
              bgcolor: rowBg,
              color: rowColor,
              borderLeft: isActiveChange ? '3px solid' : '3px solid transparent',
              borderLeftColor: isActiveChange ? 'primary.main' : 'transparent',
              position: 'relative',
              '&:hover .copy-btn': { opacity: 1 },
            }}
          >
            {/* Old Line Gutter */}
            {settings.showLineNumbers && (
              <>
                <Box
                  sx={{
                    width: 44,
                    minWidth: 44,
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
                  {line.oldLineNum || ''}
                </Box>

                {/* New Line Gutter */}
                <Box
                  sx={{
                    width: 44,
                    minWidth: 44,
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
                  {line.newLineNum || ''}
                </Box>
              </>
            )}

            {/* Marker (+, -, space) */}
            <Box
              sx={{
                width: 24,
                minWidth: 24,
                textAlign: 'center',
                userSelect: 'none',
                fontWeight: 700,
                color: isAdded ? 'success.main' : isDeleted ? 'error.main' : 'text.disabled',
              }}
            >
              {marker}
            </Box>

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
              {renderHighlightedContent(line.parts, line.type, searchQuery)}
            </Box>

            {/* Hover Copy Button */}
            {line.content && (
              <Tooltip title={copiedLineId === `uni-${idx}` ? 'Copied!' : 'Copy line'}>
                <IconButton
                  size="small"
                  className="copy-btn"
                  onClick={() => handleCopyLine(line.content, `uni-${idx}`)}
                  sx={{
                    position: 'absolute',
                    right: 8,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    opacity: 0,
                    transition: 'opacity 0.15s ease',
                    p: 0.3,
                    bgcolor: 'background.paper',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
                  }}
                >
                  {copiedLineId === `uni-${idx}` ? (
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
  );
}
