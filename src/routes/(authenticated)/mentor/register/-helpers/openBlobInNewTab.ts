export const openBlobInNewTab = (blob: Blob, filename: string) => {
	const url = URL.createObjectURL(blob);
	const newTab = window.open(url, "_blank");
	if (!newTab) return;
	newTab.onload = () => URL.revokeObjectURL(url);
};
