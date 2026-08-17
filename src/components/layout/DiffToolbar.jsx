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
  FormControlLabel,
  Popover,
  Button,
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
import { DIFF_TYPES, VIEW_MODES } from '../../core/constants';

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

  const activeFiltersCount = [
    options.ignoreWhitespace,
    options.ignoreCase,
    options.ignorePunctuation,
    options.trimLines,
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
            <ViewColumnRoundedIcon sx={{ fontSize: 16, mr: 0.6 }} />
            Split View
          </ToggleButton>
          <ToggleButton value={VIEW_MODES.UNIFIED} aria-label="Unified View">
            <ViewStreamRoundedIcon sx={{ fontSize: 16, mr: 0.6 }} />
            Unified View
          </ToggleButton>
          <ToggleButton value={VIEW_MODES.EDITOR} aria-label="Editor View">
            <EditNoteRoundedIcon sx={{ fontSize: 16, mr: 0.6 }} />
            Edit Texts
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
            <Tooltip title="Previous difference (Alt+P / Alt+Up)">
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

            <Tooltip title="Next difference (Alt+N / Alt+Down)">
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
        <Tooltip title="Comparison Filters (Ignore whitespace, case, punctuation)">
          <Button
            size="small"
            variant={activeFiltersCount > 0 ? 'contained' : 'outlined'}
            color={activeFiltersCount > 0 ? 'primary' : 'inherit'}
            startIcon={<TuneRoundedIcon />}
            onClick={(e) => setFilterAnchor(e.currentTarget)}
            sx={{
              height: 32,
              fontSize: '0.78rem',
              borderColor: 'divider',
              boxShadow: 'none',
              borderRadius: '8px',
              px: 1.2,
            }}
          >
            Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
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
              p: 2,
              width: 250,
              borderRadius: 2,
              boxShadow: '0 8px 24px rgba(0,0,0,0.18)',
            },
          }}
        >
          <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
            Comparison Rules
          </Typography>

          <FormControlLabel
            control={
              <Checkbox
                size="small"
                checked={options.ignoreWhitespace}
                onChange={(e) => updateOption('ignoreWhitespace', e.target.checked)}
              />
            }
            label={<Typography variant="body2">Ignore Whitespace</Typography>}
          />

          <FormControlLabel
            control={
              <Checkbox
                size="small"
                checked={options.ignoreCase}
                onChange={(e) => updateOption('ignoreCase', e.target.checked)}
              />
            }
            label={<Typography variant="body2">Ignore Case</Typography>}
          />

          <FormControlLabel
            control={
              <Checkbox
                size="small"
                checked={options.ignorePunctuation}
                onChange={(e) => updateOption('ignorePunctuation', e.target.checked)}
              />
            }
            label={<Typography variant="body2">Ignore Punctuation</Typography>}
          />

          <FormControlLabel
            control={
              <Checkbox
                size="small"
                checked={options.trimLines}
                onChange={(e) => updateOption('trimLines', e.target.checked)}
              />
            }
            label={<Typography variant="body2">Trim Trailing Spaces</Typography>}
          />

          {options.diffType === DIFF_TYPES.JSON && (
            <FormControlLabel
              control={
                <Checkbox
                  size="small"
                  checked={options.sortJsonKeys !== false}
                  onChange={(e) => updateOption('sortJsonKeys', e.target.checked)}
                />
              }
              label={<Typography variant="body2">Sort JSON Keys</Typography>}
            />
          )}
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
