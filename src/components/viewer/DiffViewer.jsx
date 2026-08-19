import { Box } from '@mui/material';
import { useDiff } from '../../hooks';
import { VIEW_MODES } from '../../core/constants';
import { SplitDiffView } from './SplitDiffView';
import { UnifiedDiffView } from './UnifiedDiffView';
import { TextEditorPane } from '../editor/TextEditorPane';

export function DiffViewer() {
  const { viewMode } = useDiff();

  return (
    <Box sx={{ flex: '1 1 auto', minHeight: 0, width: '100%', overflow: 'hidden', position: 'relative' }}>
      <Box
        sx={{
          display: viewMode === VIEW_MODES.SPLIT ? 'flex' : 'none',
          flexDirection: 'column',
          height: '100%',
          width: '100%',
        }}
      >
        <SplitDiffView />
      </Box>
      <Box
        sx={{
          display: viewMode === VIEW_MODES.UNIFIED ? 'block' : 'none',
          height: '100%',
          width: '100%',
        }}
      >
        <UnifiedDiffView />
      </Box>
      <Box
        sx={{
          display: viewMode === VIEW_MODES.EDITOR ? 'block' : 'none',
          height: '100%',
          width: '100%',
        }}
      >
        <TextEditorPane />
      </Box>
    </Box>
  );
}
