
/**
 * Tries to find a valid bounding client rect for the current cursor or selection.
 * Useful for positioning toolbars near the editing point.
 * Robust against missing cursor elements (common in Firefox or when selection exists).
 */
export function getCursorOrSelectionRect(): DOMRect | null {
    // Strategy 1: Look for the primary cursor element (CodeMirror specific)
    // .cm-cursor-primary is used in CodeMirror 6
    const cursor = document.querySelector('.cm-cursor-primary');
    if (cursor) {
        const rect = cursor.getBoundingClientRect();
        // A valid cursor usually has height, even if width is 0.
        // If top/left are 0, it might be hidden or invalid.
        if (rect.top !== 0 || rect.left !== 0 || rect.height !== 0) {
            return rect;
        }
    }

    // Strategy 2: Look for the native selection
    // This works well if CodeMirror syncs with native selection (which it usually does)
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        // getBoundingClientRect for a collapsed range might return 0 size, 
        // but usually returns the position.
        const rect = range.getBoundingClientRect();

        // If the rect seems valid
        if (rect.top !== 0 || rect.left !== 0 || rect.height !== 0) {
            return rect;
        }

        // Attempt to use getClientRects (sometimes better for collapsed text nodes)
        const rects = range.getClientRects();
        if (rects.length > 0) {
            return rects[0];
        }
    }

    // Strategy 3: Look for CodeMirror selection background
    // If text is selected, the cursor might be hidden, so we look for the selection highlight.
    // .cm-selectionBackground might describe multiple blocks if multi-line.
    // We take the last one to be near the "end" or just the first one.
    const selectionBg = document.querySelectorAll('.cm-selectionBackground');
    if (selectionBg.length > 0) {
        // Determine which one to use? Usually the one corresponding to the cursor head.
        // But safely, just taking the last one or the bounding box of all might be okay.
        // Let's take the first one found as a fallback.
        const rect = selectionBg[0].getBoundingClientRect();
        if (rect.top !== 0 || rect.left !== 0 || rect.height !== 0) {
            return rect;
        }
    }

    return null;
}
