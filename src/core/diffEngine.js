import * as Diff from 'diff';
import { DIFF_TYPES, LINE_STATUS } from './constants';
import { formatJsonString } from './formatters';

/**
 * Computes word-level diff highlights between two specific lines
 */
export function computeInlineWordDiff(oldLine, newLine, options = {}) {
  const normOld = options.ignoreCase ? oldLine.toLowerCase() : oldLine;
  const normNew = options.ignoreCase ? newLine.toLowerCase() : newLine;

  const wordDiff = Diff.diffWordsWithSpace(normOld, normNew);

  const leftParts = [];
  const rightParts = [];

  let oldIdx = 0;
  let newIdx = 0;

  for (const part of wordDiff) {
    if (part.added) {
      const len = part.value.length;
      const actualText = newLine.substr(newIdx, len);
      newIdx += len;
      rightParts.push({ text: actualText, type: LINE_STATUS.ADDED });
    } else if (part.removed) {
      const len = part.value.length;
      const actualText = oldLine.substr(oldIdx, len);
      oldIdx += len;
      leftParts.push({ text: actualText, type: LINE_STATUS.DELETED });
    } else {
      const len = part.value.length;
      const actualOld = oldLine.substr(oldIdx, len);
      const actualNew = newLine.substr(newIdx, len);
      oldIdx += len;
      newIdx += len;
      leftParts.push({ text: actualOld, type: LINE_STATUS.UNCHANGED });
      rightParts.push({ text: actualNew, type: LINE_STATUS.UNCHANGED });
    }
  }

  return { leftParts, rightParts };
}

/**
 * Computes character-level diff highlights between two lines
 */
export function computeInlineCharDiff(oldLine, newLine, options = {}) {
  const normOld = options.ignoreCase ? oldLine.toLowerCase() : oldLine;
  const normNew = options.ignoreCase ? newLine.toLowerCase() : newLine;

  const charDiff = Diff.diffChars(normOld, normNew);

  const leftParts = [];
  const rightParts = [];

  let oldIdx = 0;
  let newIdx = 0;

  for (const part of charDiff) {
    if (part.added) {
      const len = part.value.length;
      const actualText = newLine.substr(newIdx, len);
      newIdx += len;
      rightParts.push({ text: actualText, type: LINE_STATUS.ADDED });
    } else if (part.removed) {
      const len = part.value.length;
      const actualText = oldLine.substr(oldIdx, len);
      oldIdx += len;
      leftParts.push({ text: actualText, type: LINE_STATUS.DELETED });
    } else {
      const len = part.value.length;
      const actualOld = oldLine.substr(oldIdx, len);
      const actualNew = newLine.substr(newIdx, len);
      oldIdx += len;
      newIdx += len;
      leftParts.push({ text: actualOld, type: LINE_STATUS.UNCHANGED });
      rightParts.push({ text: actualNew, type: LINE_STATUS.UNCHANGED });
    }
  }

  return { leftParts, rightParts };
}

/**
 * Normalizes input text according to diff options
 */
export function prepareText(text, options = {}) {
  if (text === null || text === undefined) return '';
  let processed = text;

  if (options.diffType === DIFF_TYPES.JSON) {
    processed = formatJsonString(processed, options.sortJsonKeys !== false);
  }

  if (options.trimLines) {
    processed = processed
      .split('\n')
      .map((line) => line.trim())
      .join('\n');
  }

  return processed;
}

/**
 * Primary Diff Computing Engine
 */
export function computeDiff(originalRaw, modifiedRaw, options = {}) {
  const original = prepareText(originalRaw, options);
  const modified = prepareText(modifiedRaw, options);

  const diffOptions = {
    ignoreWhitespace: !!options.ignoreWhitespace,
    ignoreCase: !!options.ignoreCase,
  };

  // Perform raw line-level diff
  const rawDiff = Diff.diffLines(original, modified, diffOptions);

  // Deconstruct rawDiff into explicit line arrays
  const splitRows = [];
  const unifiedLines = [];
  const changeHunks = [];

  let oldLineNum = 1;
  let newLineNum = 1;
  let currentChangeIndex = 0;

  let additions = 0;
  let deletions = 0;
  let modifications = 0;
  let unchanged = 0;

  let i = 0;
  while (i < rawDiff.length) {
    const chunk = rawDiff[i];

    if (!chunk.added && !chunk.removed) {
      // Unchanged lines block
      const lines = chunk.value.endsWith('\n')
        ? chunk.value.slice(0, -1).split('\n')
        : chunk.value.split('\n');

      for (const line of lines) {
        unchanged++;
        const row = {
          id: `split-${splitRows.length}`,
          type: LINE_STATUS.UNCHANGED,
          changeIndex: null,
          left: {
            lineNum: oldLineNum,
            content: line,
            type: LINE_STATUS.UNCHANGED,
            parts: [{ text: line, type: LINE_STATUS.UNCHANGED }],
          },
          right: {
            lineNum: newLineNum,
            content: line,
            type: LINE_STATUS.UNCHANGED,
            parts: [{ text: line, type: LINE_STATUS.UNCHANGED }],
          },
        };
        splitRows.push(row);

        unifiedLines.push({
          id: `unified-${unifiedLines.length}`,
          oldLineNum,
          newLineNum,
          type: LINE_STATUS.UNCHANGED,
          content: line,
          changeIndex: null,
          parts: [{ text: line, type: LINE_STATUS.UNCHANGED }],
        });

        oldLineNum++;
        newLineNum++;
      }
      i++;
    } else {
      // Change block: could be deletion followed by addition (modification) or solo
      const isRemoved = !!chunk.removed;
      const nextChunk = rawDiff[i + 1];
      const isModifiedPair = isRemoved && nextChunk && nextChunk.added;

      currentChangeIndex++;
      const hunkStartRow = splitRows.length;
      const hunkStartUnified = unifiedLines.length;

      if (isModifiedPair) {
        // Paired Modification (Old lines replaced by New lines)
        const delLines = chunk.value.endsWith('\n')
          ? chunk.value.slice(0, -1).split('\n')
          : chunk.value.split('\n');
        const addLines = nextChunk.value.endsWith('\n')
          ? nextChunk.value.slice(0, -1).split('\n')
          : nextChunk.value.split('\n');

        const maxLen = Math.max(delLines.length, addLines.length);

        for (let idx = 0; idx < maxLen; idx++) {
          const hasDel = idx < delLines.length;
          const hasAdd = idx < addLines.length;

          let leftInfo = null;
          let rightInfo = null;

          if (hasDel && hasAdd) {
            modifications++;
            const delLine = delLines[idx];
            const addLine = addLines[idx];

            let inlineParts;
            if (options.diffType === DIFF_TYPES.CHAR) {
              inlineParts = computeInlineCharDiff(delLine, addLine, options);
            } else {
              inlineParts = computeInlineWordDiff(delLine, addLine, options);
            }

            leftInfo = {
              lineNum: oldLineNum++,
              content: delLine,
              type: LINE_STATUS.MODIFIED,
              parts: inlineParts.leftParts,
            };
            rightInfo = {
              lineNum: newLineNum++,
              content: addLine,
              type: LINE_STATUS.MODIFIED,
              parts: inlineParts.rightParts,
            };
          } else if (hasDel) {
            deletions++;
            const delLine = delLines[idx];
            leftInfo = {
              lineNum: oldLineNum++,
              content: delLine,
              type: LINE_STATUS.DELETED,
              parts: [{ text: delLine, type: LINE_STATUS.DELETED }],
            };
            rightInfo = {
              lineNum: null,
              content: '',
              type: LINE_STATUS.EMPTY,
              parts: [],
            };
          } else if (hasAdd) {
            additions++;
            const addLine = addLines[idx];
            leftInfo = {
              lineNum: null,
              content: '',
              type: LINE_STATUS.EMPTY,
              parts: [],
            };
            rightInfo = {
              lineNum: newLineNum++,
              content: addLine,
              type: LINE_STATUS.ADDED,
              parts: [{ text: addLine, type: LINE_STATUS.ADDED }],
            };
          }

          splitRows.push({
            id: `split-${splitRows.length}`,
            type: LINE_STATUS.MODIFIED,
            changeIndex: currentChangeIndex,
            left: leftInfo,
            right: rightInfo,
          });
        }

        // Unified view: first show all deletions, then all additions
        delLines.forEach((line, dIdx) => {
          const correspondingAdd = dIdx < addLines.length ? addLines[dIdx] : null;
          let parts = [{ text: line, type: LINE_STATUS.DELETED }];
          if (correspondingAdd !== null) {
            parts = (options.diffType === DIFF_TYPES.CHAR
              ? computeInlineCharDiff(line, correspondingAdd, options)
              : computeInlineWordDiff(line, correspondingAdd, options)
            ).leftParts;
          }
          unifiedLines.push({
            id: `unified-${unifiedLines.length}`,
            oldLineNum: oldLineNum - delLines.length + dIdx,
            newLineNum: null,
            type: LINE_STATUS.DELETED,
            content: line,
            changeIndex: currentChangeIndex,
            parts,
          });
        });

        addLines.forEach((line, aIdx) => {
          const correspondingDel = aIdx < delLines.length ? delLines[aIdx] : null;
          let parts = [{ text: line, type: LINE_STATUS.ADDED }];
          if (correspondingDel !== null) {
            parts = (options.diffType === DIFF_TYPES.CHAR
              ? computeInlineCharDiff(correspondingDel, line, options)
              : computeInlineWordDiff(correspondingDel, line, options)
            ).rightParts;
          }
          unifiedLines.push({
            id: `unified-${unifiedLines.length}`,
            oldLineNum: null,
            newLineNum: newLineNum - addLines.length + aIdx,
            type: LINE_STATUS.ADDED,
            content: line,
            changeIndex: currentChangeIndex,
            parts,
          });
        });

        i += 2; // Handled both removed and added chunk
      } else {
        // Solo Deletion or Solo Addition
        const lines = chunk.value.endsWith('\n')
          ? chunk.value.slice(0, -1).split('\n')
          : chunk.value.split('\n');

        if (isRemoved) {
          deletions += lines.length;
          for (const line of lines) {
            splitRows.push({
              id: `split-${splitRows.length}`,
              type: LINE_STATUS.DELETED,
              changeIndex: currentChangeIndex,
              left: {
                lineNum: oldLineNum,
                content: line,
                type: LINE_STATUS.DELETED,
                parts: [{ text: line, type: LINE_STATUS.DELETED }],
              },
              right: {
                lineNum: null,
                content: '',
                type: LINE_STATUS.EMPTY,
                parts: [],
              },
            });

            unifiedLines.push({
              id: `unified-${unifiedLines.length}`,
              oldLineNum,
              newLineNum: null,
              type: LINE_STATUS.DELETED,
              content: line,
              changeIndex: currentChangeIndex,
              parts: [{ text: line, type: LINE_STATUS.DELETED }],
            });

            oldLineNum++;
          }
        } else {
          // Pure addition
          additions += lines.length;
          for (const line of lines) {
            splitRows.push({
              id: `split-${splitRows.length}`,
              type: LINE_STATUS.ADDED,
              changeIndex: currentChangeIndex,
              left: {
                lineNum: null,
                content: '',
                type: LINE_STATUS.EMPTY,
                parts: [],
              },
              right: {
                lineNum: newLineNum,
                content: line,
                type: LINE_STATUS.ADDED,
                parts: [{ text: line, type: LINE_STATUS.ADDED }],
              },
            });

            unifiedLines.push({
              id: `unified-${unifiedLines.length}`,
              oldLineNum: null,
              newLineNum,
              type: LINE_STATUS.ADDED,
              content: line,
              changeIndex: currentChangeIndex,
              parts: [{ text: line, type: LINE_STATUS.ADDED }],
            });

            newLineNum++;
          }
        }
        i++;
      }

      changeHunks.push({
        changeIndex: currentChangeIndex,
        splitRowIndex: hunkStartRow,
        unifiedLineIndex: hunkStartUnified,
      });
    }
  }

  // Calculate similarity score (Dice coefficient based)
  const totalComparedLines = additions + deletions + modifications * 2 + unchanged * 2;
  const similarityScore =
    totalComparedLines === 0
      ? 100
      : Math.max(0, Math.min(100, Math.round(((unchanged * 2) / totalComparedLines) * 100)));

  return {
    splitRows,
    unifiedLines,
    changeHunks,
    totalChanges: currentChangeIndex,
    stats: {
      additions,
      deletions,
      modifications,
      unchanged,
      totalLinesOriginal: oldLineNum - 1,
      totalLinesModified: newLineNum - 1,
      similarityScore,
    },
  };
}

/**
 * Generates unified patch / diff output in git format
 */
export function generateGitPatch(oldName = 'original.txt', newName = 'modified.txt', oldText = '', newText = '') {
  return Diff.createTwoFilesPatch(oldName, newName, oldText, newText, '', '', { context: 3 });
}
