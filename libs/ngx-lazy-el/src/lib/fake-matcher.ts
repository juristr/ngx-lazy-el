/**
 * The route config requires either a
 * path or a matcher. Providing a path is not ideal
 * as it might result in having Angular register
 * our lazy module as a route, which we don't want.
 *
 * This simply returns a matcher that never matches
 */
export function fakeMatcher(url) {
  return false;
}
