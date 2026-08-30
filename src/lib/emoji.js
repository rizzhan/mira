import twemoji from 'twemoji'

const CDN_BASE = 'https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64'

export function emojiImageUrl(emoji) {
  const code = twemoji.convert.toCodePoint(emoji).replace(/-fe0f$/i, '')
  return `${CDN_BASE}/${code}.png`
}