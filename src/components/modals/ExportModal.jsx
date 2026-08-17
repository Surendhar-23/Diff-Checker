import { useState } from 'react';
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
import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded';
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import ShareRoundedIcon from '@mui/icons-material/ShareRounded';
import HtmlRoundedIcon from '@mui/icons-material/HtmlRounded';
import DescriptionRoundedIcon from '@mui/icons-material/DescriptionRounded';
import LinkRoundedIcon from '@mui/icons-material/LinkRounded';

import { useDiff, useClipboard } from '../../hooks';
import { exportPatchFile, exportHtmlReport, generateMarkdownDiff } from '../../core/exportService';
import { encodeDiffToUrl } from '../../core/urlState';

export function ExportModal({ open, onClose }) {
  const { originalText, modifiedText, originalTitle, modifiedTitle, diffResult, options } = useDiff();
  const { copy } = useClipboard();

  const [copiedType, setCopiedType] = useState(null);

  const handleDownloadPatch = () => {
    exportPatchFile(
      originalText,
      modifiedText,
      originalTitle ? `${originalTitle}.txt` : 'original.txt',
      modifiedTitle ? `${modifiedTitle}.txt` : 'modified.txt'
    );
  };

  const handleDownloadHtml = () => {
    exportHtmlReport(originalText, modifiedText, diffResult?.stats, options);
  };

  const handleCopyMarkdown = async () => {
    const md = generateMarkdownDiff(originalText, modifiedText, diffResult?.stats);
    await copy(md);
    setCopiedType('markdown');
    setTimeout(() => setCopiedType(null), 2000);
  };

  const handleCopyShareUrl = async () => {
    const url = encodeDiffToUrl(originalText, modifiedText, options);
    await copy(url);
    setCopiedType('url');
    setTimeout(() => setCopiedType(null), 2000);
  };

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
          <ShareRoundedIcon color="primary" />
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Export & Share Diff
          </Typography>
        </Box>
        <IconButton size="small" onClick={onClose}>
          <CloseRoundedIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2.5 }}>
          Choose your preferred export format or copy a direct shareable link with embedded diff contents.
        </Typography>

        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', gap: 1.5 }}>
          {/* Git Patch Download */}
          <Paper
            elevation={0}
            sx={{
              p: 2,
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <DescriptionRoundedIcon color="primary" />
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  Unified Git Patch (.patch)
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  Standard patch file applicable via git apply
                </Typography>
              </Box>
            </Box>
            <Button
              size="small"
              variant="outlined"
              startIcon={<DownloadRoundedIcon />}
              onClick={handleDownloadPatch}
              sx={{ fontWeight: 600, textTransform: 'none' }}
            >
              Download
            </Button>
          </Paper>

          {/* Standalone HTML Report */}
          <Paper
            elevation={0}
            sx={{
              p: 2,
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <HtmlRoundedIcon color="primary" />
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  Interactive HTML Report
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  Self-contained styled report with metrics
                </Typography>
              </Box>
            </Box>
            <Button
              size="small"
              variant="outlined"
              startIcon={<DownloadRoundedIcon />}
              onClick={handleDownloadHtml}
              sx={{ fontWeight: 600, textTransform: 'none' }}
            >
              Download
            </Button>
          </Paper>

          {/* Markdown Diff Copy */}
          <Paper
            elevation={0}
            sx={{
              p: 2,
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <ContentCopyRoundedIcon color="primary" />
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  Markdown Diff Code Block
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  Ready to paste into GitHub PRs, issues, or docs
                </Typography>
              </Box>
            </Box>
            <Button
              size="small"
              variant="outlined"
              startIcon={copiedType === 'markdown' ? <CheckRoundedIcon /> : <ContentCopyRoundedIcon />}
              onClick={handleCopyMarkdown}
              color={copiedType === 'markdown' ? 'success' : 'primary'}
              sx={{ fontWeight: 600, textTransform: 'none' }}
            >
              {copiedType === 'markdown' ? 'Copied!' : 'Copy'}
            </Button>
          </Paper>

          {/* Direct Shareable Link */}
          <Paper
            elevation={0}
            sx={{
              p: 2,
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <LinkRoundedIcon color="primary" />
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  Shareable Diff URL
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  Creates an encoded link with this diff state
                </Typography>
              </Box>
            </Box>
            <Button
              size="small"
              variant="contained"
              startIcon={copiedType === 'url' ? <CheckRoundedIcon /> : <LinkRoundedIcon />}
              onClick={handleCopyShareUrl}
              color={copiedType === 'url' ? 'success' : 'primary'}
              sx={{ fontWeight: 600, textTransform: 'none' }}
            >
              {copiedType === 'url' ? 'Link Copied!' : 'Copy Link'}
            </Button>
          </Paper>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} variant="text" color="inherit">
          Done
        </Button>
      </DialogActions>
    </Dialog>
  );
}
