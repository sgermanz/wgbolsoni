/**
 * Turn a user-pasted YouTube/Vimeo link into an embeddable URL.
 * Returns null if the URL isn't a recognized provider.
 */
export function toEmbedUrl(url: string): string | null {
  const yt = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/))([\w-]{11})/,
  );
  if (yt) return `https://www.youtube.com/embed/${yt[1]}`;
  const vm = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vm) return `https://player.vimeo.com/video/${vm[1]}`;
  return null;
}

/**
 * Background-video variant: autoplay, muted, looping, no controls/chrome.
 * Used for hero backgrounds where the video should behave like a silent
 * looping backdrop behind text.
 */
export function toBackgroundEmbedUrl(url: string): string | null {
  const yt = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/))([\w-]{11})/,
  );
  if (yt) {
    const id = yt[1];
    const params = new URLSearchParams({
      autoplay: "1",
      mute: "1",
      loop: "1",
      playlist: id,
      controls: "0",
      showinfo: "0",
      modestbranding: "1",
      rel: "0",
      playsinline: "1",
    });
    return `https://www.youtube.com/embed/${id}?${params.toString()}`;
  }
  const vm = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vm) {
    return `https://player.vimeo.com/video/${vm[1]}?background=1&autoplay=1&loop=1&muted=1`;
  }
  return null;
}
