import { Box, Typography, LinearProgress, Chip } from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import RemoveRoundedIcon from '@mui/icons-material/RemoveRounded';
import ChangeCircleRoundedIcon from '@mui/icons-material/ChangeCircleRounded';
import CodeRoundedIcon from '@mui/icons-material/CodeRounded';

import { useDiff } from '../../hooks';
import { StatBadge } from '../common/StatBadge';

export function DiffStatsBar() {
  const { diffResult, detectedLanguage } = useDiff();
  const stats = diffResult?.stats || {
    additions: 0,
    deletions: 0,
    modifications: 0,
    unchanged: 0,
    similarityScore: 100,
    totalLinesOriginal: 0,
    totalLinesModified: 0,
  };

  const sim = stats.similarityScore;

  // Determine similarity color
  const simColor = sim >= 90 ? '#22c55e' : sim >= 60 ? '#eab308' : '#ef4444';

  return (
    <Box
      sx={{
        px: { xs: 1.5, md: 2.5 },
        py: 0.75,
        bgcolor: 'background.default',
        borderBottom: '1px solid',
        borderColor: 'divider',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 1.5,
        fontSize: '0.8125rem',
      }}
    >
      {/* Metrics & Badges */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
        <StatBadge
          icon={AddRoundedIcon}
          label="Additions"
          value={`+${stats.additions}`}
          color="diff.addedText"
          bg="diff.addedBg"
          border="rgba(46,160,67,0.3)"
        />
        <StatBadge
          icon={RemoveRoundedIcon}
          label="Deletions"
          value={`-${stats.deletions}`}
          color="diff.deletedText"
          bg="diff.deletedBg"
          border="rgba(248,81,73,0.3)"
        />
        <StatBadge
          icon={ChangeCircleRoundedIcon}
          label="Modified"
          value={`~${stats.modifications}`}
          color="diff.modifiedText"
          bg="diff.modifiedBg"
          border="rgba(217,119,6,0.3)"
        />

        <Chip
          icon={<CodeRoundedIcon sx={{ fontSize: '14px !important' }} />}
          label={detectedLanguage.toUpperCase()}
          size="small"
          sx={{
            height: 24,
            fontSize: '0.7rem',
            fontWeight: 700,
            bgcolor: 'action.hover',
            borderRadius: '6px',
          }}
        />
      </Box>

      {/* Similarity Progress Score */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 200 }}>
        <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary', whiteSpace: 'nowrap' }}>
          Similarity: <strong style={{ color: simColor }}>{sim}%</strong>
        </Typography>
        <Box sx={{ flexGrow: 1, minWidth: 80 }}>
          <LinearProgress
            variant="determinate"
            value={sim}
            sx={{
              height: 6,
              borderRadius: 3,
              bgcolor: 'divider',
              '& .MuiLinearProgress-bar': {
                bgcolor: simColor,
                borderRadius: 3,
              },
            }}
          />
        </Box>
      </Box>
    </Box>
  );
}
