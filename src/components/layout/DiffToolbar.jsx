import {
  Box,
  ToggleButtonGroup,
  ToggleButton,
  Typography,
  IconButton,
  Tooltip,
  TextField,
  InputAdornment,
  Checkbox,
  Popover,
  Button,
  Divider,
} from '@mui/material';
import ViewColumnRoundedIcon from '@mui/icons-material/ViewColumnRounded';
import ViewStreamRoundedIcon from '@mui/icons-material/ViewStreamRounded';
import EditNoteRoundedIcon from '@mui/icons-material/EditNoteRounded';
import NavigateBeforeRoundedIcon from '@mui/icons-material/NavigateBeforeRounded';
import NavigateNextRoundedIcon from '@mui/icons-material/NavigateNextRounded';
import TuneRoundedIcon from '@mui/icons-material/TuneRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import ClearRoundedIcon from '@mui/icons-material/ClearRounded';
import FormatLineSpacingRoundedIcon from '@mui/icons-material/FormatLineSpacingRounded';
import SpellcheckRoundedIcon from '@mui/icons-material/SpellcheckRounded';
import DataObjectRoundedIcon from '@mui/icons-material/DataObjectRounded';
import AbcRoundedIcon from '@mui/icons-material/AbcRounded';
import { useState } from 'react';

import { useDiff } from '../../hooks';
import { DIFF_TYPES, VIEW_MODES, MODIFIER_KEY } from '../../core/constants';

export function DiffToolbar() {
  const {
    options,
    updateOption,
    viewMode,
    setViewMode,
    diffResult,
    currentChangeIndex,
    goToNextChange,
    goToPrevChange,
    searchQuery,
    setSearchQuery,
  } = useDiff();

  const [filterAnchor, setFilterAnchor] = useState(null);
  const totalChanges = diffResult.totalChanges;

  const handleDiffTypeChange = (_, newType) => {
    if (newType !== null) {
      updateOption('diffType', newType);
    }
  };

  const handleViewModeChange = (_, newMode) => {
    if (newMode !== null) {
      setViewMode(newMode);
    }
  };

  const handleResetFilters = (e) => {
    if (e) e.stopPropagation();
    updateOption('ignoreWhitespace', false);
    updateOption('ignoreCase', false);
    updateOption('ignorePunctuation', false);
    updateOption('trimLines', false);
    if (options.diffType === DIFF_TYPES.JSON) {
      updateOption('sortJsonKeys', false);
    }
  };

  const activeFiltersCount = [
    options.ignoreWhitespace,
    options.ignoreCase,
    options.ignorePunctuation,
    options.trimLines,
    options.diffType === DIFF_TYPES.JSON && options.sortJsonKeys,
  ].filter(Boolean).length;

  return (
    <Box
      sx={{
        px: { xs: 1.5, md: 2.5 },
        py: 1,
        bgcolor: 'background.paper',
        borderBottom: '1px solid',
        borderColor: 'divider',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 1.5,
        flexShrink: 0,
      }}
    >
      {/* Left: View Mode Toggle & Diff Granularity */}
      <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1.5 }}>
        {/* View Mode Toggle */}
        <ToggleButtonGroup
          value={viewMode}
          exclusive
          onChange={handleViewModeChange}
          size="small"
          aria-label="View mode"
          sx={{
            height: 32,
            bgcolor: 'action.hover',
            p: '2px',
            borderRadius: '8px',
            '& .MuiToggleButton-root': {
              border: 'none',
              borderRadius: '6px',
              px: 1.5,
              py: 0.3,
              fontSize: '0.8rem',
              fontWeight: 600,
              textTransform: 'none',
              '&.Mui-selected': {
                bgcolor: 'background.paper',
                color: 'primary.main',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              },
            },
          }}
        >
          <ToggleButton value={VIEW_MODES.SPLIT} aria-label="Split View">
            <ViewColumnRoundedIcon sx={{ fontSize: 16, mr: { xs: 0.3, sm: 0.6 } }} />
            Split<Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>&nbsp;View</Box>
          </ToggleButton>
          <ToggleButton value={VIEW_MODES.UNIFIED} aria-label="Unified View">
            <ViewStreamRoundedIcon sx={{ fontSize: 16, mr: { xs: 0.3, sm: 0.6 } }} />
            Unified<Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>&nbsp;View</Box>
          </ToggleButton>
          <ToggleButton value={VIEW_MODES.EDITOR} aria-label="Editor View">
            <EditNoteRoundedIcon sx={{ fontSize: 16, mr: { xs: 0.3, sm: 0.6 } }} />
            Edit<Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>&nbsp;Texts</Box>
          </ToggleButton>
        </ToggleButtonGroup>

        {/* Diff Granularity Switcher */}
        <ToggleButtonGroup
          value={options.diffType}
          exclusive
          onChange={handleDiffTypeChange}
          size="small"
          aria-label="Diff granularity"
          sx={{
            height: 32,
            bgcolor: 'action.hover',
            p: '2px',
            borderRadius: '8px',
            display: { xs: 'none', sm: 'inline-flex' },
            '& .MuiToggleButton-root': {
              border: 'none',
              borderRadius: '6px',
              px: 1.2,
              py: 0.3,
              fontSize: '0.75rem',
              fontWeight: 500,
              textTransform: 'none',
              '&.Mui-selected': {
                bgcolor: 'background.paper',
                color: 'primary.main',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                fontWeight: 600,
              },
            },
          }}
        >
          <ToggleButton value={DIFF_TYPES.LINE}>
            <FormatLineSpacingRoundedIcon sx={{ fontSize: 15, mr: 0.5 }} />
            Line Diff
          </ToggleButton>
          <ToggleButton value={DIFF_TYPES.WORD}>
            <SpellcheckRoundedIcon sx={{ fontSize: 15, mr: 0.5 }} />
            Word Diff
          </ToggleButton>
          <ToggleButton value={DIFF_TYPES.CHAR}>
            <AbcRoundedIcon sx={{ fontSize: 15, mr: 0.5 }} />
            Char Diff
          </ToggleButton>
          <ToggleButton value={DIFF_TYPES.JSON}>
            <DataObjectRoundedIcon sx={{ fontSize: 15, mr: 0.5 }} />
            JSON Diff
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* Right: Filters, Difference Navigator, and Search */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, flexWrap: 'wrap' }}>
        {/* Difference Navigation Stepper */}
        {totalChanges > 0 ? (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              bgcolor: 'action.hover',
              borderRadius: '8px',
              p: '2px',
              height: 32,
            }}
          >
            <Tooltip title={`Previous difference (${MODIFIER_KEY}+P / ${MODIFIER_KEY}+Up)`}>
              <span>
                <IconButton
                  size="small"
                  onClick={goToPrevChange}
                  sx={{ p: 0.5, borderRadius: '6px' }}
                >
                  <NavigateBeforeRoundedIcon fontSize="small" />
                </IconButton>
              </span>
            </Tooltip>

            <Typography
              variant="caption"
              sx={{
                px: 1,
                fontWeight: 600,
                color: 'text.secondary',
                userSelect: 'none',
                minWidth: 72,
                textAlign: 'center',
              }}
            >
              {currentChangeIndex > 0 ? `${currentChangeIndex} of ${totalChanges}` : `${totalChanges} diffs`}
            </Typography>

            <Tooltip title={`Next difference (${MODIFIER_KEY}+N / ${MODIFIER_KEY}+Down)`}>
              <span>
                <IconButton
                  size="small"
                  onClick={goToNextChange}
                  sx={{ p: 0.5, borderRadius: '6px' }}
                >
                  <NavigateNextRoundedIcon fontSize="small" />
                </IconButton>
              </span>
            </Tooltip>
          </Box>
        ) : (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              bgcolor: 'diff.addedBg',
              color: 'diff.addedText',
              borderRadius: '6px',
              px: 1.5,
              py: 0.4,
              fontSize: '0.75rem',
              fontWeight: 600,
            }}
          >
            ✓ Identical / No Changes
          </Box>
        )}

        {/* Filter / Normalization Options Popover */}
        <Tooltip title="Comparison Rules (Ignore whitespace, case, punctuation, etc.)">
          <Button
            size="small"
            variant={activeFiltersCount > 0 ? 'contained' : 'outlined'}
            color={activeFiltersCount > 0 ? 'primary' : 'inherit'}
            startIcon={<TuneRoundedIcon sx={{ fontSize: 16 }} />}
            onClick={(e) => setFilterAnchor(e.currentTarget)}
            sx={{
              height: 32,
              fontSize: '0.78rem',
              fontWeight: 600,
              borderColor: 'divider',
              boxShadow: 'none',
              borderRadius: '8px',
              px: 1.3,
              textTransform: 'none',
            }}
          >
            Rules {activeFiltersCount > 0 && `(${activeFiltersCount})`}
          </Button>
        </Tooltip>

        <Popover
          open={Boolean(filterAnchor)}
          anchorEl={filterAnchor}
          onClose={() => setFilterAnchor(null)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          PaperProps={{
            sx: {
              py: 0.5,
              width: 275,
              borderRadius: 2.5,
              boxShadow: '0 12px 32px rgba(0,0,0,0.22)',
              border: '1px solid',
              borderColor: 'divider',
              overflow: 'hidden',
            },
          }}
        >
          {/* Mobile-only Diff Granularity Selector */}
          <Box sx={{ display: { xs: 'block', sm: 'none' }, px: 2, pt: 1.5, pb: 1 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1, fontSize: '0.8125rem' }}>
              Diff Granularity
            </Typography>
            <ToggleButtonGroup
              value={options.diffType}
              exclusive
              onChange={handleDiffTypeChange}
              size="small"
              fullWidth
              sx={{
                bgcolor: 'action.hover',
                p: '2px',
                borderRadius: '8px',
                '& .MuiToggleButton-root': {
                  border: 'none',
                  fontSize: '0.72rem',
                  py: 0.4,
                  fontWeight: 600,
                  textTransform: 'none',
                  '&.Mui-selected': {
                    bgcolor: 'background.paper',
                    color: 'primary.main',
                    fontWeight: 700,
                  },
                },
              }}
            >
              <ToggleButton value={DIFF_TYPES.LINE}>Line</ToggleButton>
              <ToggleButton value={DIFF_TYPES.WORD}>Word</ToggleButton>
              <ToggleButton value={DIFF_TYPES.CHAR}>Char</ToggleButton>
              <ToggleButton value={DIFF_TYPES.JSON}>JSON</ToggleButton>
            </ToggleButtonGroup>
            <Divider sx={{ my: 1.5 }} />
          </Box>

          {/* Header */}
          <Box
            sx={{
              px: 2,
              py: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid',
              borderColor: 'divider',
              mb: 0.5,
            }}
          >
            <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: '0.8125rem' }}>
              Comparison Rules
            </Typography>
            {activeFiltersCount > 0 && (
              <Button
                size="small"
                onClick={handleResetFilters}
                sx={{
                  fontSize: '0.7rem',
                  py: 0.1,
                  px: 0.8,
                  minWidth: 0,
                  textTransform: 'none',
                  color: 'primary.main',
                  fontWeight: 600,
                }}
              >
                Reset
              </Button>
            )}
          </Box>

          {/* Rules List */}
          <Box sx={{ display: 'flex', flexDirection: 'column', py: 0.5 }}>
            {[
              {
                key: 'ignoreWhitespace',
                label: 'Ignore Whitespace',
                desc: 'Ignore difference in spaces & tabs',
                checked: !!options.ignoreWhitespace,
              },
              {
                key: 'ignoreCase',
                label: 'Ignore Case',
                desc: 'Case-insensitive match (A = a)',
                checked: !!options.ignoreCase,
              },
              {
                key: 'ignorePunctuation',
                label: 'Ignore Punctuation',
                desc: 'Strip symbols and punctuation',
                checked: !!options.ignorePunctuation,
              },
              {
                key: 'trimLines',
                label: 'Trim Trailing Spaces',
                desc: 'Ignore leading & trailing whitespace',
                checked: !!options.trimLines,
              },
              ...(options.diffType === DIFF_TYPES.JSON
                ? [
                    {
                      key: 'sortJsonKeys',
                      label: 'Sort JSON Keys',
                      desc: 'Deep alphabetical key sorting',
                      checked: !!options.sortJsonKeys,
                    },
                  ]
                : []),
            ].map((item) => (
              <Box
                key={item.key}
                onClick={() => updateOption(item.key, !item.checked)}
                sx={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  px: 2,
                  py: 0.85,
                  cursor: 'pointer',
                  userSelect: 'none',
                  transition: 'background-color 0.15s ease',
                  '&:hover': { bgcolor: 'action.hover' },
                }}
              >
                <Checkbox
                  size="small"
                  checked={item.checked}
                  onChange={(e) => {
                    e.stopPropagation();
                    updateOption(item.key, e.target.checked);
                  }}
                  sx={{
                    p: 0,
                    mr: 1.25,
                    mt: 0.15,
                    '&.Mui-checked': { color: 'primary.main' },
                  }}
                />
                <Box sx={{ flexGrow: 1 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      fontSize: '0.8125rem',
                      fontWeight: item.checked ? 600 : 500,
                      color: item.checked ? 'text.primary' : 'text.secondary',
                      lineHeight: 1.3,
                    }}
                  >
                    {item.label}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      fontSize: '0.6875rem',
                      color: 'text.disabled',
                      display: 'block',
                      lineHeight: 1.2,
                      mt: 0.25,
                    }}
                  >
                    {item.desc}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Popover>

        {/* Quick In-diff Search Bar */}
        <TextField
          size="small"
          placeholder="Find in diff..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchRoundedIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
              </InputAdornment>
            ),
            endAdornment: searchQuery ? (
              <InputAdornment position="end">
                <IconButton size="small" onClick={() => setSearchQuery('')} sx={{ p: 0.2 }}>
                  <ClearRoundedIcon sx={{ fontSize: 14 }} />
                </IconButton>
              </InputAdornment>
            ) : null,
            sx: {
              height: 32,
              fontSize: '0.8rem',
              borderRadius: '8px',
              width: { xs: 120, sm: 160 },
              bgcolor: 'background.default',
            },
          }}
        />
      </Box>
    </Box>
  );
}
