// 工具函数
// by z0gSh1u @ 2020-05

// ASCII打印字符范围
export const ASCII_MIN = 32
export const ASCII_MAX = 126
export const SUPPORTED_ESCAPE = `dstrn\\[]*?+()|"`

/**
 * Ensure `condition`. Else throw `hint`.
 */
export function assert(condition: unknown, hint: string): void {
  if (!condition) {
    throw new Error(hint)
  }
}

/**
 * Print directly to stdout.
 */
export function stdoutPrint(content: string): void {
  process.stdout.write(content)
}

/**
 * Return true if ch can be found in str.
 */
export function inStr(ch: string, str: string) {
  return str.indexOf(ch) !== -1
}

/**
 * Return true if target is in some range of `ranges` (closed).
 * @param ranges [l, r][]
 */
export function inRange(ranges: [number, number][], target: number) {
  return ranges.some((range) => target >= range[0] && target <= range[1])
}

/**
 * Return all ranges (closed) of matches.
 * @param regex a RegExp with note `g`
 */
export function getMatchedRanges(regex: RegExp, str: string, resultGroup = 0) {
  let result: RegExpExecArray | null,
    ranges: [number, number][] = []
  while ((result = regex.exec(str)) != null) {
    result = result as RegExpExecArray
    ranges.push([result.index, result.index + result[resultGroup].length - 1])
  }
  return ranges
}

/**
 * Split a string using any delim (1 character) in delims.
 * Return split array with delim remained.
 */
export function splitAndKeep(str: string, delims: string) {
  let res = [],
    part = ''
  for (let i = 0; i < str.length; i++) {
    if (inStr(str[i], delims)) {
      !!part && res.push(part)
      part = ''
      res.push(str[i])
    } else {
      part += str[i]
    }
  }
  part.length !== 0 && res.push(part)
  return res
}

/**
 * Return true if ch is an English character.
 */
export function isAlpha(ch: string) {
  return ch.length === 1 && !!ch.match(/[A-Za-z]/)
}
