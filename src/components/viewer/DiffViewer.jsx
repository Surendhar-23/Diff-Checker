import { Box } from '@mui/material';
import { useDiff } from '../../hooks';
import { VIEW_MODES } from '../../core/constants';
import { SplitDiffView } from './SplitDiffView';
import { UnifiedDiffView } from './UnifiedDiffView';
import { TextEditorPane } from '../editor/TextEditorPane';

export function DiffViewer() {
  const { viewMode } = useDiff();

  return (
    <Box sx={{ flexGrow: 1, height: '100%', width: '100%', overflow: 'hidden', position: 'relative' }}>
      {viewMode === VIEW_MODES.SPLIT && <SplitDiffView />}
      {viewMode === VIEW_MODES.UNIFIED && <UnifiedDiffView />}
      {viewMode === VIEW_MODES.EDITOR && <TextEditorPane />}
    </Box>
  );
}
