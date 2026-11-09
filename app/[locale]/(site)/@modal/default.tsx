/**
 * Nothing, which is what the modal slot holds almost all of the time.
 *
 * A parallel route needs a default for every path that does not fill it, or
 * Next has nothing to render there on a hard navigation and the page 404s.
 */
export default function ModalDefault() {
  return null
}
