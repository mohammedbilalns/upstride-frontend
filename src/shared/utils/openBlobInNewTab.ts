/**
 * Opens a given Blob in a new browser tab.
 * Automatically revokes the object URL once the tab has loaded.
 *
 * @param blob - The Blob to open (e.g., from fetch or file input)
 */
export const openBlobInNewTab = (blob: Blob): void => {
  if (!(blob instanceof Blob)) {
    console.error("Invalid Blob provided to openBlobInNewTab");
    return;
  }

  const url = URL.createObjectURL(blob);

  const newTab = window.open(url, "_blank");

  // If popup blocked or failed to open
  if (!newTab) {
    URL.revokeObjectURL(url);
    console.warn("Failed to open new tab — popup may be blocked.");
    return;
  }

  // Revoke URL after content is loaded to avoid memory leaks
  newTab.onload = () => URL.revokeObjectURL(url);
};

