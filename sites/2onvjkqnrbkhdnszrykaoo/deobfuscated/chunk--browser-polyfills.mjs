/**
 * browser polyfills
 */
var e = Object.defineProperty;
var d = (n, t) => {
  for (var o in t) e(n, o, { get: t[o], enumerable: true });
};
var f = typeof document < "u" ? globalThis.navigator : undefined,
  r = typeof document < "u" ? globalThis.window : undefined,
  i = typeof document > "u" ? {} : undefined;
if (typeof document > "u") {
  let n = Object.prototype.toString;
  Object.prototype.toString = function (...t) {
    return this === i ? "[object global]" : n.call(this, ...t);
  };
}
export { d as a, f as b, r as c };
