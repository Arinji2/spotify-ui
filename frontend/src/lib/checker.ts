function removeTags(str: string) {
	return str.split("-")[1];
}
export function parseContentId(
	str: string,
): { type: "artist"; id: string } | { type: "playlist"; id: string } {
	if (str.includes("artist")) {
		return { type: "artist", id: removeTags(str) };
	} else {
		return { type: "playlist", id: str };
	}
}
