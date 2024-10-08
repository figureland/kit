export const hb_tag = (s: string) => {
  return (
    ((s.charCodeAt(0) & 0xff) << 24) |
    ((s.charCodeAt(1) & 0xff) << 16) |
    ((s.charCodeAt(2) & 0xff) << 8) |
    ((s.charCodeAt(3) & 0xff) << 0)
  )
}

export const hb_untag = (tag: number) => {
  return [
    String.fromCharCode((tag >> 24) & 0xff),
    String.fromCharCode((tag >> 16) & 0xff),
    String.fromCharCode((tag >> 8) & 0xff),
    String.fromCharCode((tag >> 0) & 0xff)
  ].join('')
}

export const buffer_flag = (s: string) => {
  if (s == 'BOT') {
    return 0x1
  }
  if (s == 'EOT') {
    return 0x2
  }
  if (s == 'PRESERVE_DEFAULT_IGNORABLES') {
    return 0x4
  }
  if (s == 'REMOVE_DEFAULT_IGNORABLES') {
    return 0x8
  }
  if (s == 'DO_NOT_INSERT_DOTTED_CIRCLE') {
    return 0x10
  }
  if (s == 'PRODUCE_UNSAFE_TO_CONCAT') {
    return 0x40
  }
  return 0x0
}
