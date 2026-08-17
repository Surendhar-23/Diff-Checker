import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Slider,
  Switch,
  FormControlLabel,
  Divider,
  IconButton,
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import RestartAltRoundedIcon from '@mui/icons-material/RestartAltRounded';

import { useSettings } from '../../hooks';

export function SettingsModal({ open, onClose }) {
  const { settings, updateSetting, resetSettings } = useSettings();

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
          <SettingsRoundedIcon color="primary" />
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Editor & Diff Preferences
          </Typography>
        </Box>
        <IconButton size="small" onClick={onClose}>
          <CloseRoundedIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
        {/* Font Size */}
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              Editor Font Size
            </Typography>
            <Typography variant="caption" sx={{ fontWeight: 700, color: 'primary.main' }}>
              {settings.fontSize}px
            </Typography>
          </Box>
          <Slider
            value={settings.fontSize}
            min={10}
            max={20}
            step={1}
            marks={[
              { value: 11, label: '11px' },
              { value: 13, label: 'Default (13px)' },
              { value: 16, label: '16px' },
              { value: 20, label: '20px' },
            ]}
            onChange={(_, val) => updateSetting('fontSize', val)}
          />
        </Box>

        <Divider />

        {/* Tab Size */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              Tab Size
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              Number of spaces inserted per tab key
            </Typography>
          </Box>
          <ToggleButtonGroup
            value={settings.tabSize}
            exclusive
            onChange={(_, val) => val && updateSetting('tabSize', val)}
            size="small"
          >
            <ToggleButton value={2}>2 spaces</ToggleButton>
            <ToggleButton value={4}>4 spaces</ToggleButton>
            <ToggleButton value={8}>8 spaces</ToggleButton>
          </ToggleButtonGroup>
        </Box>

        <Divider />

        {/* Toggles */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.2 }}>
          <FormControlLabel
            control={
              <Switch
                checked={settings.showLineNumbers}
                onChange={(e) => updateSetting('showLineNumbers', e.target.checked)}
                color="primary"
              />
            }
            label={
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  Show Line Numbers
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  Display gutter with line indices for both panes
                </Typography>
              </Box>
            }
          />

          <FormControlLabel
            control={
              <Switch
                checked={settings.syncScroll}
                onChange={(e) => updateSetting('syncScroll', e.target.checked)}
                color="primary"
              />
            }
            label={
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  Synchronized Scrolling
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  Scroll both sides in tandem in Split View
                </Typography>
              </Box>
            }
          />

          <FormControlLabel
            control={
              <Switch
                checked={settings.wrapLines}
                onChange={(e) => updateSetting('wrapLines', e.target.checked)}
                color="primary"
              />
            }
            label={
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  Line Wrapping
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  Wrap long text lines instead of horizontal scroll
                </Typography>
              </Box>
            }
          />

          <FormControlLabel
            control={
              <Switch
                checked={settings.collapseUnchanged}
                onChange={(e) => updateSetting('collapseUnchanged', e.target.checked)}
                color="primary"
              />
            }
            label={
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  Collapse Unchanged Sections
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  Fold identical code blocks with more than {settings.collapseThreshold || 8} lines
                </Typography>
              </Box>
            }
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2, display: 'flex', justifyContent: 'space-between' }}>
        <Button
          startIcon={<RestartAltRoundedIcon />}
          onClick={resetSettings}
          color="inherit"
          size="small"
        >
          Reset to Defaults
        </Button>
        <Button onClick={onClose} variant="contained">
          Done
        </Button>
      </DialogActions>
    </Dialog>
  );
}
