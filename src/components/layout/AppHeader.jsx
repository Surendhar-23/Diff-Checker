import { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  IconButton,
  Tooltip,
  Chip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import CompareArrowsRoundedIcon from '@mui/icons-material/CompareArrowsRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import AutoFixHighRoundedIcon from '@mui/icons-material/AutoFixHighRounded';
import HistoryRoundedIcon from '@mui/icons-material/HistoryRounded';
import ShareRoundedIcon from '@mui/icons-material/ShareRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import KeyboardRoundedIcon from '@mui/icons-material/KeyboardRounded';
import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded';
import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded';
import MenuBookRoundedIcon from '@mui/icons-material/MenuBookRounded';
import CodeRoundedIcon from '@mui/icons-material/CodeRounded';
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded';

import { useDiff, useAppTheme, useHistory } from '../../hooks';
import { DIFF_SAMPLES } from '../../core/samples';
import { MODIFIER_KEY } from '../../core/constants';

export function AppHeader({
  onOpenHistory,
  onOpenExport,
  onOpenSettings,
  onOpenShortcuts,
  onOpenSamples,
}) {
  const { mode, toggleTheme } = useAppTheme();
  const { swapTexts, clearAll, beautifyOriginal, beautifyModified, loadSample } = useDiff();
  const { history } = useHistory();

  const [sampleMenuAnchor, setSampleMenuAnchor] = useState(null);
  const [mobileMenuAnchor, setMobileMenuAnchor] = useState(null);

  const handleOpenSampleMenu = (event) => {
    setSampleMenuAnchor(event.currentTarget);
  };

  const handleCloseSampleMenu = () => {
    setSampleMenuAnchor(null);
  };

  const handleSelectSample = (sample) => {
    loadSample(sample);
    handleCloseSampleMenu();
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: 'background.paper',
        borderBottom: '1px solid',
        borderColor: 'divider',
        color: 'text.primary',
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar
        variant="dense"
        disableGutters
        sx={{
          px: { xs: 1.5, md: 2.5 },
          minHeight: 56,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 1.5,
        }}
      >
        {/* Brand & Title */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 32,
              height: 32,
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
              color: '#fff',
              boxShadow: '0 2px 8px rgba(37,99,235,0.35)',
            }}
          >
            <CompareArrowsRoundedIcon sx={{ fontSize: 20 }} />
          </Box>
          <Typography
            variant="h6"
            component="div"
            sx={{
              fontWeight: 700,
              fontSize: '1.05rem',
              letterSpacing: '-0.02em',
              display: 'flex',
              alignItems: 'center',
              gap: 0.8,
            }}
          >
            SNDDiffX
            <Chip
              label="PRO"
              size="small"
              sx={{
                height: 18,
                fontSize: '0.65rem',
                fontWeight: 800,
                bgcolor: 'primary.main',
                color: '#fff',
                borderRadius: '4px',
                px: 0.2,
              }}
            />
          </Typography>
        </Box>

        {/* Center Quick Actions */}
        <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1 }}>
          <Tooltip title={`Swap Left & Right texts (${MODIFIER_KEY}+S)`}>
            <Button
              size="small"
              variant="outlined"
              color="inherit"
              startIcon={<CompareArrowsRoundedIcon />}
              onClick={swapTexts}
              sx={{ borderColor: 'divider', color: 'text.primary', fontSize: '0.8rem', py: 0.4 }}
            >
              Swap
            </Button>
          </Tooltip>

          <Tooltip title="Format / Prettify JSON in both panes">
            <Button
              size="small"
              variant="outlined"
              color="inherit"
              startIcon={<AutoFixHighRoundedIcon />}
              onClick={() => {
                beautifyOriginal();
                beautifyModified();
              }}
              sx={{ borderColor: 'divider', color: 'text.primary', fontSize: '0.8rem', py: 0.4 }}
            >
              Format JSON
            </Button>
          </Tooltip>

          <Button
            size="small"
            variant="outlined"
            color="inherit"
            startIcon={<MenuBookRoundedIcon />}
            onClick={handleOpenSampleMenu}
            sx={{ borderColor: 'divider', color: 'text.primary', fontSize: '0.8rem', py: 0.4 }}
          >
            Samples
          </Button>

          <Menu
            anchorEl={sampleMenuAnchor}
            open={Boolean(sampleMenuAnchor)}
            onClose={handleCloseSampleMenu}
            PaperProps={{
              sx: {
                minWidth: 260,
                mt: 1,
                boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
                borderRadius: 2,
              },
            }}
          >
            <Box sx={{ px: 2, py: 1 }}>
              <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase' }}>
                Load Test Samples
              </Typography>
            </Box>
            <Divider />
            {DIFF_SAMPLES.map((sample) => (
              <MenuItem key={sample.id} onClick={() => handleSelectSample(sample)} sx={{ py: 1 }}>
                <ListItemIcon>
                  <CodeRoundedIcon fontSize="small" color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary={sample.name}
                  secondary={sample.category}
                  primaryTypographyProps={{ variant: 'body2', fontWeight: 600 }}
                  secondaryTypographyProps={{ variant: 'caption' }}
                />
              </MenuItem>
            ))}
            <Divider />
            <MenuItem
              onClick={() => {
                handleCloseSampleMenu();
                onOpenSamples?.();
              }}
              sx={{ py: 1 }}
            >
              <ListItemIcon>
                <MenuBookRoundedIcon fontSize="small" color="primary" />
              </ListItemIcon>
              <ListItemText
                primary="Browse Sample Suite..."
                primaryTypographyProps={{ variant: 'body2', fontWeight: 700, color: 'primary.main' }}
              />
            </MenuItem>
          </Menu>

          <Tooltip title="Clear all text from both editors">
            <Button
              size="small"
              variant="outlined"
              color="inherit"
              startIcon={<DeleteOutlineRoundedIcon />}
              onClick={clearAll}
              sx={{ borderColor: 'divider', color: 'text.secondary', fontSize: '0.8rem', py: 0.4 }}
            >
              Clear
            </Button>
          </Tooltip>
        </Box>

        {/* Right Tools & Navigation */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
          <Tooltip title="Diff History">
            <IconButton
              size="small"
              onClick={onOpenHistory}
              sx={{
                border: '1px solid',
                borderColor: 'divider',
                bgcolor: 'background.paper',
                position: 'relative',
              }}
            >
              <HistoryRoundedIcon fontSize="small" />
              {history.length > 0 && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: 2,
                    right: 2,
                    width: 7,
                    height: 7,
                    borderRadius: '50%',
                    bgcolor: 'primary.main',
                  }}
                />
              )}
            </IconButton>
          </Tooltip>

          <Tooltip title="Export / Share diff">
            <Button
              size="small"
              variant="contained"
              color="primary"
              startIcon={<ShareRoundedIcon />}
              onClick={onOpenExport}
              sx={{
                fontWeight: 600,
                fontSize: '0.8125rem',
                py: 0.5,
                px: 1.5,
                boxShadow: 'none',
              }}
            >
              Export
            </Button>
          </Tooltip>

          <Tooltip title="Keyboard Shortcuts (?)">
            <IconButton
              size="small"
              onClick={onOpenShortcuts}
              sx={{ border: '1px solid', borderColor: 'divider' }}
            >
              <KeyboardRoundedIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Settings">
            <IconButton
              size="small"
              onClick={onOpenSettings}
              sx={{ border: '1px solid', borderColor: 'divider' }}
            >
              <SettingsRoundedIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          <Tooltip title={`Switch to ${mode === 'dark' ? 'Light' : 'Dark'} Mode`}>
            <IconButton
              size="small"
              onClick={toggleTheme}
              sx={{ border: '1px solid', borderColor: 'divider', color: 'primary.main' }}
            >
              {mode === 'dark' ? (
                <LightModeRoundedIcon fontSize="small" />
              ) : (
                <DarkModeRoundedIcon fontSize="small" />
              )}
            </IconButton>
          </Tooltip>

          {/* Mobile More Actions Menu Button */}
          <IconButton
            size="small"
            onClick={(e) => setMobileMenuAnchor(e.currentTarget)}
            sx={{
              display: { xs: 'flex', md: 'none' },
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            <MoreVertRoundedIcon fontSize="small" />
          </IconButton>

          {/* Mobile Actions Dropdown */}
          <Menu
            anchorEl={mobileMenuAnchor}
            open={Boolean(mobileMenuAnchor)}
            onClose={() => setMobileMenuAnchor(null)}
            PaperProps={{
              sx: {
                minWidth: 220,
                mt: 1,
                borderRadius: 2,
                boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
              },
            }}
          >
            <MenuItem
              onClick={() => {
                swapTexts();
                setMobileMenuAnchor(null);
              }}
            >
              <ListItemIcon>
                <CompareArrowsRoundedIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Swap Texts" />
            </MenuItem>

            <MenuItem
              onClick={() => {
                beautifyOriginal();
                beautifyModified();
                setMobileMenuAnchor(null);
              }}
            >
              <ListItemIcon>
                <AutoFixHighRoundedIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Format JSON" />
            </MenuItem>

            <MenuItem
              onClick={() => {
                setMobileMenuAnchor(null);
                onOpenSamples?.();
              }}
            >
              <ListItemIcon>
                <MenuBookRoundedIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Load Samples..." />
            </MenuItem>

            <Divider />

            <MenuItem
              onClick={() => {
                setMobileMenuAnchor(null);
                onOpenSettings?.();
              }}
            >
              <ListItemIcon>
                <SettingsRoundedIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Settings" />
            </MenuItem>

            <MenuItem
              onClick={() => {
                setMobileMenuAnchor(null);
                onOpenShortcuts?.();
              }}
            >
              <ListItemIcon>
                <KeyboardRoundedIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Shortcuts" />
            </MenuItem>

            <Divider />

            <MenuItem
              onClick={() => {
                clearAll();
                setMobileMenuAnchor(null);
              }}
              sx={{ color: 'error.main' }}
            >
              <ListItemIcon>
                <DeleteOutlineRoundedIcon fontSize="small" color="error" />
              </ListItemIcon>
              <ListItemText primary="Clear All Texts" />
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
