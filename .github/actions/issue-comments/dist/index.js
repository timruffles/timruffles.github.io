"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// index.ts
var issue_comments_exports = {};
__export(issue_comments_exports, {
  types: () => types
});
module.exports = __toCommonJS(issue_comments_exports);
var import_action = require("@octokit/action");
var core = __toESM(require("@actions/core"));
var import_fs = __toESM(require("fs"));
var mustache = __toESM(require("mustache"));

// ../../../node_modules/arktype/dist/mjs/utils/errors.js
var InternalArktypeError = class extends Error {
};
var throwInternalError = (message) => {
  throw new InternalArktypeError(message);
};
var ParseError = class extends Error {
};
var throwParseError = (message) => {
  throw new ParseError(message);
};

// ../../../node_modules/arktype/dist/mjs/utils/domains.js
var hasDomain = (data, domain) => domainOf(data) === domain;
var domainOf = (data) => {
  const builtinType = typeof data;
  return builtinType === "object" ? data === null ? "null" : "object" : builtinType === "function" ? "object" : builtinType;
};
var domainDescriptions = {
  bigint: "a bigint",
  boolean: "boolean",
  null: "null",
  number: "a number",
  object: "an object",
  string: "a string",
  symbol: "a symbol",
  undefined: "undefined"
};

// ../../../node_modules/arktype/dist/mjs/utils/generics.js
var isKeyOf = (k, obj) => k in obj;
var entriesOf = (o) => Object.entries(o);
var objectKeysOf = (o) => Object.keys(o);
var prototypeKeysOf = (value) => {
  const result = [];
  while (value !== Object.prototype && value !== null && value !== void 0) {
    for (const k of Object.getOwnPropertyNames(value)) {
      if (!result.includes(k)) {
        result.push(k);
      }
    }
    for (const symbol of Object.getOwnPropertySymbols(value)) {
      if (!result.includes(symbol)) {
        result.push(symbol);
      }
    }
    value = Object.getPrototypeOf(value);
  }
  return result;
};
var hasKey = (o, k) => {
  const valueAtKey = o == null ? void 0 : o[k];
  return valueAtKey !== void 0 && valueAtKey !== null;
};
var keyCount = (o) => Object.keys(o).length;
var hasKeys = (value) => hasDomain(value, "object") ? Object.keys(value).length !== 0 : false;
var id = Symbol("id");
var listFrom = (data) => Array.isArray(data) ? data : [
  data
];

// ../../../node_modules/arktype/dist/mjs/utils/paths.js
var Path = class _Path extends Array {
  static fromString(s, delimiter = "/") {
    return s === delimiter ? new _Path() : new _Path(...s.split(delimiter));
  }
  toString(delimiter = "/") {
    return this.length ? this.join(delimiter) : delimiter;
  }
};
var getPath = (root, path) => {
  let result = root;
  for (const segment of path) {
    if (typeof result !== "object" || result === null) {
      return void 0;
    }
    result = result[segment];
  }
  return result;
};

// ../../../node_modules/arktype/dist/mjs/utils/numericLiterals.js
var wellFormedNumberMatcher = /^(?!^-0$)-?(?:0|[1-9]\d*)(?:\.\d*[1-9])?$/;
var isWellFormedNumber = (s) => wellFormedNumberMatcher.test(s);
var numberLikeMatcher = /^-?\d*\.?\d*$/;
var isNumberLike = (s) => s.length !== 0 && numberLikeMatcher.test(s);
var wellFormedIntegerMatcher = /^(?:0|(?:-?[1-9]\d*))$/;
var isWellFormedInteger = (s) => wellFormedIntegerMatcher.test(s);
var wellFormedNonNegativeIntegerMatcher = /^(?:0|(?:[1-9]\d*))$/;
var integerLikeMatcher = /^-?\d+$/;
var isIntegerLike = (s) => integerLikeMatcher.test(s);
var numericLiteralDescriptions = {
  number: "a number",
  bigint: "a bigint",
  integer: "an integer"
};
var writeMalformedNumericLiteralMessage = (def, kind) => `'${def}' was parsed as ${numericLiteralDescriptions[kind]} but could not be narrowed to a literal value. Avoid unnecessary leading or trailing zeros and other abnormal notation`;
var isWellFormed = (def, kind) => kind === "number" ? isWellFormedNumber(def) : isWellFormedInteger(def);
var parseKind = (def, kind) => kind === "number" ? Number(def) : Number.parseInt(def);
var isKindLike = (def, kind) => kind === "number" ? isNumberLike(def) : isIntegerLike(def);
var tryParseWellFormedNumber = (token, errorOnFail) => parseWellFormed(token, "number", errorOnFail);
var tryParseWellFormedInteger = (token, errorOnFail) => parseWellFormed(token, "integer", errorOnFail);
var parseWellFormed = (token, kind, errorOnFail) => {
  const value = parseKind(token, kind);
  if (!Number.isNaN(value)) {
    if (isWellFormed(token, kind)) {
      return value;
    }
    if (isKindLike(token, kind)) {
      return throwParseError(writeMalformedNumericLiteralMessage(token, kind));
    }
  }
  return errorOnFail ? throwParseError(errorOnFail === true ? `Failed to parse ${numericLiteralDescriptions[kind]} from '${token}'` : errorOnFail) : void 0;
};
var tryParseWellFormedBigint = (def) => {
  if (def[def.length - 1] !== "n") {
    return;
  }
  const maybeIntegerLiteral = def.slice(0, -1);
  let value;
  try {
    value = BigInt(maybeIntegerLiteral);
  } catch {
    return;
  }
  if (wellFormedIntegerMatcher.test(maybeIntegerLiteral)) {
    return value;
  }
  if (integerLikeMatcher.test(maybeIntegerLiteral)) {
    return throwParseError(writeMalformedNumericLiteralMessage(def, "bigint"));
  }
};

// ../../../node_modules/arktype/dist/mjs/utils/serialize.js
var stringify = (data, indent) => {
  switch (domainOf(data)) {
    case "object":
      return JSON.stringify(serializeRecurse(data, stringifyOpts, []), null, indent);
    case "symbol":
      return stringifyOpts.onSymbol(data);
    default:
      return serializePrimitive(data);
  }
};
var stringifyOpts = {
  onCycle: () => "(cycle)",
  onSymbol: (v) => `(symbol${v.description && ` ${v.description}`})`,
  onFunction: (v) => `(function${v.name && ` ${v.name}`})`
};
var serializeRecurse = (data, context, seen) => {
  switch (domainOf(data)) {
    case "object":
      if (typeof data === "function") {
        return stringifyOpts.onFunction(data);
      }
      if (seen.includes(data)) {
        return "(cycle)";
      }
      const nextSeen = [
        ...seen,
        data
      ];
      if (Array.isArray(data)) {
        return data.map((item) => serializeRecurse(item, context, nextSeen));
      }
      const result = {};
      for (const k in data) {
        result[k] = serializeRecurse(data[k], context, nextSeen);
      }
      return result;
    case "symbol":
      return stringifyOpts.onSymbol(data);
    case "bigint":
      return `${data}n`;
    case "undefined":
      return "undefined";
    default:
      return data;
  }
};
var serializePrimitive = (value) => typeof value === "string" ? `'${value}'` : typeof value === "bigint" ? `${value}n` : `${value}`;

// ../../../node_modules/arktype/dist/mjs/nodes/compose.js
function _checkPrivateRedeclaration(obj, privateCollection) {
  if (privateCollection.has(obj)) {
    throw new TypeError("Cannot initialize the same private elements twice on an object");
  }
}
function _classApplyDescriptorGet(receiver, descriptor) {
  if (descriptor.get) {
    return descriptor.get.call(receiver);
  }
  return descriptor.value;
}
function _classApplyDescriptorSet(receiver, descriptor, value) {
  if (descriptor.set) {
    descriptor.set.call(receiver, value);
  } else {
    if (!descriptor.writable) {
      throw new TypeError("attempted to set read only private field");
    }
    descriptor.value = value;
  }
}
function _classExtractFieldDescriptor(receiver, privateMap, action2) {
  if (!privateMap.has(receiver)) {
    throw new TypeError("attempted to " + action2 + " private field on non-instance");
  }
  return privateMap.get(receiver);
}
function _classPrivateFieldGet(receiver, privateMap) {
  var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "get");
  return _classApplyDescriptorGet(receiver, descriptor);
}
function _classPrivateFieldInit(obj, privateMap, value) {
  _checkPrivateRedeclaration(obj, privateMap);
  privateMap.set(obj, value);
}
function _classPrivateFieldSet(receiver, privateMap, value) {
  var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "set");
  _classApplyDescriptorSet(receiver, descriptor, value);
  return value;
}
function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}
var composeIntersection = (reducer) => (l, r, state) => l === void 0 ? r === void 0 ? throwInternalError(undefinedOperandsMessage) : r : r === void 0 ? l : reducer(l, r, state);
var undefinedOperandsMessage = `Unexpected operation two undefined operands`;
var disjointDescriptionWriters = {
  domain: ({ l, r }) => `${l.join(", ")} and ${r.join(", ")}`,
  range: ({ l, r }) => `${stringifyRange(l)} and ${stringifyRange(r)}`,
  class: ({ l, r }) => `classes ${typeof l === "string" ? l : l.name} and ${typeof r === "string" ? r : r.name}`,
  tupleLength: ({ l, r }) => `tuples of length ${l} and ${r}`,
  value: ({ l, r }) => `literal values ${stringify(l)} and ${stringify(r)}`,
  leftAssignability: ({ l, r }) => `literal value ${stringify(l.value)} and ${stringify(r)}`,
  rightAssignability: ({ l, r }) => `literal value ${stringify(r.value)} and ${stringify(l)}`,
  union: ({ l, r }) => `branches ${stringify(l)} and branches ${stringify(r)}`
};
var stringifyRange = (range) => "limit" in range ? `the range of exactly ${range.limit}` : range.min ? range.max ? `the range bounded by ${range.min.comparator}${range.min.limit} and ${range.max.comparator}${range.max.limit}` : `${range.min.comparator}${range.min.limit}` : range.max ? `${range.max.comparator}${range.max.limit}` : "the unbounded range";
var _disjoints = /* @__PURE__ */ new WeakMap();
var IntersectionState = class {
  get disjoints() {
    return _classPrivateFieldGet(this, _disjoints);
  }
  addDisjoint(kind, l, r) {
    _classPrivateFieldGet(this, _disjoints)[`${this.path}`] = {
      kind,
      l,
      r
    };
    return empty;
  }
  constructor(type2, lastOperator) {
    _defineProperty(this, "type", void 0);
    _defineProperty(this, "lastOperator", void 0);
    _defineProperty(this, "path", void 0);
    _defineProperty(this, "domain", void 0);
    _classPrivateFieldInit(this, _disjoints, {
      writable: true,
      value: void 0
    });
    this.type = type2;
    this.lastOperator = lastOperator;
    this.path = new Path();
    _classPrivateFieldSet(this, _disjoints, {});
  }
};
var empty = Symbol("empty");
var anonymousDisjoint = () => empty;
var isDisjoint = (result) => result === empty;
var equal = Symbol("equal");
var equality = () => equal;
var isEquality = (result) => result === equal;
var composeKeyedIntersection = (reducer, config) => (l, r, state) => {
  const result = {};
  const keys = objectKeysOf({
    ...l,
    ...r
  });
  let lImpliesR = true;
  let rImpliesL = true;
  for (const k of keys) {
    const keyResult = typeof reducer === "function" ? reducer(k, l[k], r[k], state) : reducer[k](l[k], r[k], state);
    if (isEquality(keyResult)) {
      if (l[k] !== void 0) {
        result[k] = l[k];
      }
    } else if (isDisjoint(keyResult)) {
      if (config.onEmpty === "omit") {
        lImpliesR = false;
        rImpliesL = false;
      } else {
        return empty;
      }
    } else {
      if (keyResult !== void 0) {
        result[k] = keyResult;
      }
      lImpliesR && (lImpliesR = keyResult === l[k]);
      rImpliesL && (rImpliesL = keyResult === r[k]);
    }
  }
  return lImpliesR ? rImpliesL ? equality() : l : rImpliesL ? r : result;
};

// ../../../node_modules/arktype/dist/mjs/parse/ast/intersection.js
var compileDisjointReasonsMessage = (disjoints) => {
  const paths = objectKeysOf(disjoints);
  if (paths.length === 1) {
    const path = paths[0];
    return `${path === "/" ? "" : `At ${path}: `}Intersection of ${disjointDescriptionWriters[disjoints[path].kind](disjoints[path])} results in an unsatisfiable type`;
  }
  let message = `
        "Intersection results in unsatisfiable types at the following paths:
`;
  for (const path in disjoints) {
    message += `  ${path}: ${disjointDescriptionWriters[disjoints[path].kind](disjoints[path])}
`;
  }
  return message;
};
var writeImplicitNeverMessage = (path, operator, description) => `${path.length ? `At ${path}: ` : ""}${operator} ${description ? `${description} ` : ""}results in an unsatisfiable type`;

// ../../../node_modules/arktype/dist/mjs/utils/objectKinds.js
var defaultObjectKinds = {
  Array,
  Date,
  Error,
  Function,
  Map,
  RegExp,
  Set,
  Object,
  String,
  Number,
  Boolean,
  WeakMap,
  WeakSet,
  Promise
};
var objectKindOf = (data, kinds) => {
  var _a;
  if (domainOf(data) !== "object") {
    return void 0;
  }
  const kindSet = kinds ?? defaultObjectKinds;
  let prototype = Object.getPrototypeOf(data);
  while ((prototype == null ? void 0 : prototype.constructor) && (!kindSet[prototype.constructor.name] || !(data instanceof kindSet[prototype.constructor.name]))) {
    prototype = Object.getPrototypeOf(prototype);
  }
  return (_a = prototype == null ? void 0 : prototype.constructor) == null ? void 0 : _a.name;
};
var isArray = (data) => Array.isArray(data);
var objectKindDescriptions = {
  Object: "an object",
  Array: "an array",
  Function: "a function",
  Date: "a Date",
  RegExp: "a RegExp",
  Error: "an Error",
  Map: "a Map",
  Set: "a Set",
  String: "a String object",
  Number: "a Number object",
  Boolean: "a Boolean object",
  Promise: "a Promise",
  WeakMap: "a WeakMap",
  WeakSet: "a WeakSet"
};
var getExactConstructorObjectKind = (constructor) => {
  const constructorName = Object(constructor).name;
  return constructorName && isKeyOf(constructorName, defaultObjectKinds) && defaultObjectKinds[constructorName] === constructor ? constructorName : void 0;
};

// ../../../node_modules/arktype/dist/mjs/nodes/rules/class.js
var classIntersection = composeIntersection((l, r, state) => {
  return l === r ? equality() : l instanceof r ? l : r instanceof l ? r : state.addDisjoint("class", l, r);
});
var checkClass = (expectedClass, state) => {
  if (typeof expectedClass === "string") {
    return objectKindOf(state.data) === expectedClass || !state.problems.add("class", expectedClass);
  }
  return state.data instanceof expectedClass || !state.problems.add("class", expectedClass);
};

// ../../../node_modules/arktype/dist/mjs/nodes/rules/collapsibleSet.js
var collapsibleListUnion = (l, r) => {
  if (Array.isArray(l)) {
    if (Array.isArray(r)) {
      const result = listUnion(l, r);
      return result.length === l.length ? result.length === r.length ? equality() : l : result.length === r.length ? r : result;
    }
    return l.includes(r) ? l : [
      ...l,
      r
    ];
  }
  if (Array.isArray(r)) {
    return r.includes(l) ? r : [
      ...r,
      l
    ];
  }
  return l === r ? equality() : [
    l,
    r
  ];
};
var listUnion = (l, r) => {
  const result = [
    ...l
  ];
  for (const expression of r) {
    if (!l.includes(expression)) {
      result.push(expression);
    }
  }
  return result;
};

// ../../../node_modules/arktype/dist/mjs/nodes/rules/divisor.js
var divisorIntersection = composeIntersection((l, r) => l === r ? equality() : Math.abs(l * r / greatestCommonDivisor(l, r)));
var greatestCommonDivisor = (l, r) => {
  let previous;
  let greatestCommonDivisor2 = l;
  let current = r;
  while (current !== 0) {
    previous = current;
    current = greatestCommonDivisor2 % current;
    greatestCommonDivisor2 = previous;
  }
  return greatestCommonDivisor2;
};
var checkDivisor = (divisor, state) => state.data % divisor === 0 || !state.problems.add("divisor", divisor);

// ../../../node_modules/arktype/dist/mjs/nodes/rules/props.js
var isOptional = (prop) => prop[0] === "?";
var isPrerequisite = (prop) => prop[0] === "!";
var mappedKeys = {
  index: "[index]"
};
var propToNode = (prop) => isOptional(prop) || isPrerequisite(prop) ? prop[1] : prop;
var getTupleLengthIfPresent = (result) => {
  if (typeof result.length === "object" && isPrerequisite(result.length) && typeof result.length[1] !== "string" && isLiteralNode(result.length[1], "number")) {
    return result.length[1].number.value;
  }
};
var propsIntersection = composeIntersection((l, r, state) => {
  const result = propKeysIntersection(l, r, state);
  if (typeof result === "symbol") {
    return result;
  }
  const lengthValue = getTupleLengthIfPresent(result);
  if (lengthValue === void 0 || !(mappedKeys.index in result)) {
    return result;
  }
  const { [mappedKeys.index]: indexProp, ...updatedResult } = result;
  const indexNode = propToNode(indexProp);
  for (let i = 0; i < lengthValue; i++) {
    if (!updatedResult[i]) {
      updatedResult[i] = indexNode;
      continue;
    }
    const existingNodeAtIndex = propToNode(updatedResult[i]);
    state.path.push(`${i}`);
    const updatedResultAtIndex = nodeIntersection(existingNodeAtIndex, indexNode, state);
    state.path.pop();
    if (isDisjoint(updatedResultAtIndex)) {
      return updatedResultAtIndex;
    } else if (!isEquality(updatedResultAtIndex) && updatedResultAtIndex !== existingNodeAtIndex) {
      updatedResult[i] = updatedResultAtIndex;
    }
  }
  return updatedResult;
});
var propKeysIntersection = composeKeyedIntersection((propKey, l, r, context) => {
  if (l === void 0) {
    return r === void 0 ? equality() : r;
  }
  if (r === void 0) {
    return l;
  }
  context.path.push(propKey);
  const result = nodeIntersection(propToNode(l), propToNode(r), context);
  context.path.pop();
  const resultIsOptional = isOptional(l) && isOptional(r);
  if (isDisjoint(result) && resultIsOptional) {
    return {};
  }
  return result;
}, {
  onEmpty: "bubble"
});
var flattenProps = (entries, props, ctx) => {
  var _a;
  const keyConfig = ((_a = ctx.type.config) == null ? void 0 : _a.keys) ?? ctx.type.scope.config.keys;
  return keyConfig === "loose" ? flattenLooseProps(entries, props, ctx) : flattenPropsRecord(keyConfig, entries, props, ctx);
};
var flattenLooseProps = (entries, props, ctx) => {
  for (const k in props) {
    const prop = props[k];
    ctx.path.push(k);
    if (k === mappedKeys.index) {
      entries.push([
        "indexProp",
        flattenNode(propToNode(prop), ctx)
      ]);
    } else if (isOptional(prop)) {
      entries.push([
        "optionalProp",
        [
          k,
          flattenNode(prop[1], ctx)
        ]
      ]);
    } else if (isPrerequisite(prop)) {
      entries.push([
        "prerequisiteProp",
        [
          k,
          flattenNode(prop[1], ctx)
        ]
      ]);
    } else {
      entries.push([
        "requiredProp",
        [
          k,
          flattenNode(prop, ctx)
        ]
      ]);
    }
    ctx.path.pop();
  }
};
var flattenPropsRecord = (kind, entries, props, ctx) => {
  const result = {
    required: {},
    optional: {}
  };
  for (const k in props) {
    const prop = props[k];
    ctx.path.push(k);
    if (k === mappedKeys.index) {
      result.index = flattenNode(propToNode(prop), ctx);
    } else if (isOptional(prop)) {
      result.optional[k] = flattenNode(prop[1], ctx);
    } else if (isPrerequisite(prop)) {
      entries.push([
        "prerequisiteProp",
        [
          k,
          flattenNode(prop[1], ctx)
        ]
      ]);
    } else {
      result.required[k] = flattenNode(prop, ctx);
    }
    ctx.path.pop();
  }
  entries.push([
    `${kind}Props`,
    result
  ]);
};

// ../../../node_modules/arktype/dist/mjs/utils/data.js
function _defineProperty2(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}
var sizeOf = (data) => typeof data === "string" || Array.isArray(data) ? data.length : typeof data === "number" ? data : 0;
var unitsOf = (data) => typeof data === "string" ? "characters" : Array.isArray(data) ? "items long" : "";
var DataWrapper = class {
  toString() {
    return stringify(this.value);
  }
  get domain() {
    return domainOf(this.value);
  }
  get size() {
    return sizeOf(this.value);
  }
  get units() {
    return unitsOf(this.value);
  }
  get className() {
    return Object(this.value).constructor.name;
  }
  constructor(value) {
    _defineProperty2(this, "value", void 0);
    this.value = value;
  }
};

// ../../../node_modules/arktype/dist/mjs/nodes/rules/range.js
var minComparators = {
  ">": true,
  ">=": true
};
var maxComparators = {
  "<": true,
  "<=": true
};
var isEqualityRange = (range) => "comparator" in range;
var rangeIntersection = composeIntersection((l, r, state) => {
  if (isEqualityRange(l)) {
    if (isEqualityRange(r)) {
      return l.limit === r.limit ? equality() : state.addDisjoint("range", l, r);
    }
    return rangeAllows(r, l.limit) ? l : state.addDisjoint("range", l, r);
  }
  if (isEqualityRange(r)) {
    return rangeAllows(l, r.limit) ? r : state.addDisjoint("range", l, r);
  }
  const stricterMin = compareStrictness("min", l.min, r.min);
  const stricterMax = compareStrictness("max", l.max, r.max);
  if (stricterMin === "l") {
    if (stricterMax === "r") {
      return compareStrictness("min", l.min, r.max) === "l" ? state.addDisjoint("range", l, r) : {
        min: l.min,
        max: r.max
      };
    }
    return l;
  }
  if (stricterMin === "r") {
    if (stricterMax === "l") {
      return compareStrictness("max", l.max, r.min) === "l" ? state.addDisjoint("range", l, r) : {
        min: r.min,
        max: l.max
      };
    }
    return r;
  }
  return stricterMax === "l" ? l : stricterMax === "r" ? r : equality();
});
var rangeAllows = (range, n) => isEqualityRange(range) ? n === range.limit : minAllows(range.min, n) && maxAllows(range.max, n);
var minAllows = (min, n) => !min || n > min.limit || n === min.limit && !isExclusive(min.comparator);
var maxAllows = (max, n) => !max || n < max.limit || n === max.limit && !isExclusive(max.comparator);
var flattenRange = (entries, range, ctx) => {
  const units = ctx.lastDomain === "string" ? "characters" : ctx.lastDomain === "object" ? "items long" : void 0;
  if (isEqualityRange(range)) {
    return entries.push([
      "bound",
      units ? {
        ...range,
        units
      } : range
    ]);
  }
  if (range.min) {
    entries.push([
      "bound",
      units ? {
        ...range.min,
        units
      } : range.min
    ]);
  }
  if (range.max) {
    entries.push([
      "bound",
      units ? {
        ...range.max,
        units
      } : range.max
    ]);
  }
};
var checkBound = (bound, state) => comparatorCheckers[bound.comparator](sizeOf(state.data), bound.limit) || !state.problems.add("bound", bound);
var comparatorCheckers = {
  "<": (size, limit) => size < limit,
  ">": (size, limit) => size > limit,
  "<=": (size, limit) => size <= limit,
  ">=": (size, limit) => size >= limit,
  "==": (size, limit) => size === limit
};
var compareStrictness = (kind, l, r) => !l ? !r ? "=" : "r" : !r ? "l" : l.limit === r.limit ? isExclusive(l.comparator) ? isExclusive(r.comparator) ? "=" : "l" : isExclusive(r.comparator) ? "r" : "=" : kind === "min" ? l.limit > r.limit ? "l" : "r" : l.limit < r.limit ? "l" : "r";
var isExclusive = (comparator) => comparator.length === 1;

// ../../../node_modules/arktype/dist/mjs/nodes/rules/regex.js
var regexCache = {};
var getRegex = (source) => {
  if (!regexCache[source]) {
    regexCache[source] = new RegExp(source);
  }
  return regexCache[source];
};
var checkRegex = (source, state) => getRegex(source).test(state.data) || !state.problems.add("regex", `/${source}/`);
var regexIntersection = composeIntersection(collapsibleListUnion);

// ../../../node_modules/arktype/dist/mjs/nodes/rules/rules.js
var rulesIntersection = (l, r, state) => "value" in l ? "value" in r ? l.value === r.value ? equality() : state.addDisjoint("value", l.value, r.value) : literalSatisfiesRules(l.value, r, state) ? l : state.addDisjoint("leftAssignability", l, r) : "value" in r ? literalSatisfiesRules(r.value, l, state) ? r : state.addDisjoint("rightAssignability", l, r) : narrowableRulesIntersection(l, r, state);
var narrowIntersection = composeIntersection(collapsibleListUnion);
var narrowableRulesIntersection = composeKeyedIntersection({
  divisor: divisorIntersection,
  regex: regexIntersection,
  props: propsIntersection,
  class: classIntersection,
  range: rangeIntersection,
  narrow: narrowIntersection
}, {
  onEmpty: "bubble"
});
var flattenRules = (rules, ctx) => {
  const entries = [];
  let k;
  for (k in rules) {
    ruleFlatteners[k](entries, rules[k], ctx);
  }
  return entries.sort((l, r) => precedenceMap[l[0]] - precedenceMap[r[0]]);
};
var ruleFlatteners = {
  regex: (entries, rule) => {
    for (const source of listFrom(rule)) {
      entries.push([
        "regex",
        source
      ]);
    }
  },
  divisor: (entries, rule) => {
    entries.push([
      "divisor",
      rule
    ]);
  },
  range: flattenRange,
  class: (entries, rule) => {
    entries.push([
      "class",
      rule
    ]);
  },
  props: flattenProps,
  narrow: (entries, rule) => {
    for (const narrow2 of listFrom(rule)) {
      entries.push([
        "narrow",
        narrow2
      ]);
    }
  },
  value: (entries, rule) => {
    entries.push([
      "value",
      rule
    ]);
  }
};
var precedenceMap = {
  // Config: Applies before any checks
  config: -1,
  // Critical: No other checks are performed if these fail
  domain: 0,
  value: 0,
  domains: 0,
  branches: 0,
  switch: 0,
  alias: 0,
  class: 0,
  // Shallow: All shallow checks will be performed even if one or more fail
  regex: 1,
  divisor: 1,
  bound: 1,
  // Prerequisite: These are deep checks with special priority, e.g. the
  // length of a tuple, which causes other deep props not to be checked if it
  // is invalid
  prerequisiteProp: 2,
  // Deep: Performed if all shallow checks pass, even if one or more deep checks fail
  distilledProps: 3,
  strictProps: 3,
  requiredProp: 3,
  optionalProp: 3,
  indexProp: 3,
  // Narrow: Only performed if all shallow and deep checks pass
  narrow: 4,
  // Morph: Only performed if all validation passes
  morph: 5
};
var literalSatisfiesRules = (data, rules, state) => !state.type.scope.type([
  "node",
  {
    [state.domain]: rules
  }
])(data).problems;

// ../../../node_modules/arktype/dist/mjs/nodes/branch.js
var isBranchComparison = (comparison) => (comparison == null ? void 0 : comparison.lBranches) !== void 0;
var compareBranches = (lConditions, rConditions, state) => {
  const result = {
    lBranches: lConditions,
    rBranches: rConditions,
    lExtendsR: [],
    rExtendsL: [],
    equalities: [],
    distinctIntersections: []
  };
  const pairs = rConditions.map((condition) => ({
    condition,
    distinct: []
  }));
  lConditions.forEach((l, lIndex) => {
    var _a;
    let lImpliesR = false;
    const distinct = pairs.map((rPairs, rIndex) => {
      if (lImpliesR || !rPairs.distinct) {
        return null;
      }
      const r = rPairs.condition;
      const subresult = branchIntersection(l, r, state);
      if (isDisjoint(subresult)) {
        return null;
      } else if (subresult === l) {
        result.lExtendsR.push(lIndex);
        lImpliesR = true;
        return null;
      } else if (subresult === r) {
        result.rExtendsL.push(rIndex);
        rPairs.distinct = null;
        return null;
      } else if (isEquality(subresult)) {
        result.equalities.push([
          lIndex,
          rIndex
        ]);
        lImpliesR = true;
        rPairs.distinct = null;
        return null;
      } else if (hasDomain(subresult, "object")) {
        return subresult;
      }
      return throwInternalError(`Unexpected predicate intersection result of type '${domainOf(subresult)}'`);
    });
    if (!lImpliesR) {
      for (let i = 0; i < pairs.length; i++) {
        if (distinct[i]) {
          (_a = pairs[i].distinct) == null ? void 0 : _a.push(distinct[i]);
        }
      }
    }
  });
  result.distinctIntersections = pairs.flatMap((pairs2) => pairs2.distinct ?? []);
  return result;
};
var isTransformationBranch = (branch) => "rules" in branch;
var flattenBranch = (branch, ctx) => {
  if (isTransformationBranch(branch)) {
    const result = flattenRules(branch.rules, ctx);
    if (branch.morph) {
      if (typeof branch.morph === "function") {
        result.push([
          "morph",
          branch.morph
        ]);
      } else {
        for (const morph2 of branch.morph) {
          result.push([
            "morph",
            morph2
          ]);
        }
      }
    }
    return result;
  }
  return flattenRules(branch, ctx);
};
var rulesOf = (branch) => branch.rules ?? branch;
var branchIntersection = (l, r, state) => {
  const lRules = rulesOf(l);
  const rRules = rulesOf(r);
  const rulesResult = rulesIntersection(lRules, rRules, state);
  if ("morph" in l) {
    if ("morph" in r) {
      if (l.morph === r.morph) {
        return isEquality(rulesResult) || isDisjoint(rulesResult) ? rulesResult : {
          rules: rulesResult,
          morph: l.morph
        };
      }
      return state.lastOperator === "&" ? throwParseError(writeImplicitNeverMessage(state.path, "Intersection", "of morphs")) : {};
    }
    return isDisjoint(rulesResult) ? rulesResult : {
      rules: isEquality(rulesResult) ? l.rules : rulesResult,
      morph: l.morph
    };
  }
  if ("morph" in r) {
    return isDisjoint(rulesResult) ? rulesResult : {
      rules: isEquality(rulesResult) ? r.rules : rulesResult,
      morph: r.morph
    };
  }
  return rulesResult;
};

// ../../../node_modules/arktype/dist/mjs/parse/ast/union.js
var writeUndiscriminatableMorphUnionMessage = (path) => `${path === "/" ? "A" : `At ${path}, a`} union including one or more morphs must be discriminatable`;

// ../../../node_modules/arktype/dist/mjs/nodes/discriminate.js
var flattenBranches = (branches, ctx) => {
  const discriminants = calculateDiscriminants(branches, ctx);
  const indices = branches.map((_, i) => i);
  return discriminate(branches, indices, discriminants, ctx);
};
var discriminate = (originalBranches, remainingIndices, discriminants, ctx) => {
  if (remainingIndices.length === 1) {
    return flattenBranch(originalBranches[remainingIndices[0]], ctx);
  }
  const bestDiscriminant = findBestDiscriminant(remainingIndices, discriminants);
  if (!bestDiscriminant) {
    return [
      [
        "branches",
        remainingIndices.map((i) => branchIncludesMorph(originalBranches[i], ctx.type.scope) ? throwParseError(writeUndiscriminatableMorphUnionMessage(`${ctx.path}`)) : flattenBranch(originalBranches[i], ctx))
      ]
    ];
  }
  const cases = {};
  for (const caseKey in bestDiscriminant.indexCases) {
    const nextIndices = bestDiscriminant.indexCases[caseKey];
    cases[caseKey] = discriminate(originalBranches, nextIndices, discriminants, ctx);
    if (caseKey !== "default") {
      pruneDiscriminant(cases[caseKey], bestDiscriminant.path, bestDiscriminant, ctx);
    }
  }
  return [
    [
      "switch",
      {
        path: bestDiscriminant.path,
        kind: bestDiscriminant.kind,
        cases
      }
    ]
  ];
};
var pruneDiscriminant = (entries, segments, discriminant, ctx) => {
  for (let i = 0; i < entries.length; i++) {
    const [k, v] = entries[i];
    if (!segments.length) {
      if (discriminant.kind === "domain") {
        if (k === "domain" || k === "domains") {
          entries.splice(i, 1);
          return;
        } else if (k === "class" || k === "value") {
          return;
        }
      } else if (discriminant.kind === k) {
        entries.splice(i, 1);
        return;
      }
    } else if ((k === "requiredProp" || k === "prerequisiteProp" || k === "optionalProp") && v[0] === segments[0]) {
      if (typeof v[1] === "string") {
        if (discriminant.kind !== "domain") {
          return throwInternalPruneFailure(discriminant);
        }
        entries.splice(i, 1);
        return;
      }
      pruneDiscriminant(v[1], segments.slice(1), discriminant, ctx);
      if (v[1].length === 0) {
        entries.splice(i, 1);
      }
      return;
    }
    if (k === "domains") {
      if (keyCount(v) !== 1 || !v.object) {
        return throwInternalPruneFailure(discriminant);
      }
      pruneDiscriminant(v.object, segments, discriminant, ctx);
      return;
    } else if (k === "switch") {
      for (const caseKey in v.cases) {
        pruneDiscriminant(v.cases[caseKey], segments, discriminant, ctx);
      }
      return;
    } else if (k === "branches") {
      for (const branch of v) {
        pruneDiscriminant(branch, segments, discriminant, ctx);
      }
      return;
    }
  }
  return throwInternalPruneFailure(discriminant);
};
var throwInternalPruneFailure = (discriminant) => throwInternalError(`Unexpectedly failed to discriminate ${discriminant.kind} at path '${discriminant.path}'`);
var discriminantKinds = {
  domain: true,
  class: true,
  value: true
};
var calculateDiscriminants = (branches, ctx) => {
  const discriminants = {
    disjointsByPair: {},
    casesByDisjoint: {}
  };
  for (let lIndex = 0; lIndex < branches.length - 1; lIndex++) {
    for (let rIndex = lIndex + 1; rIndex < branches.length; rIndex++) {
      const pairKey = `${lIndex}/${rIndex}`;
      const pairDisjoints = [];
      discriminants.disjointsByPair[pairKey] = pairDisjoints;
      const intersectionState = new IntersectionState(ctx.type, "|");
      branchIntersection(branches[lIndex], branches[rIndex], intersectionState);
      for (const path in intersectionState.disjoints) {
        if (path.includes(mappedKeys.index)) {
          continue;
        }
        const { l, r, kind } = intersectionState.disjoints[path];
        if (!isKeyOf(kind, discriminantKinds)) {
          continue;
        }
        const lSerialized = serializeDefinitionIfAllowed(kind, l);
        const rSerialized = serializeDefinitionIfAllowed(kind, r);
        if (lSerialized === void 0 || rSerialized === void 0) {
          continue;
        }
        const qualifiedDisjoint = path === "/" ? kind : `${path}/${kind}`;
        pairDisjoints.push(qualifiedDisjoint);
        if (!discriminants.casesByDisjoint[qualifiedDisjoint]) {
          discriminants.casesByDisjoint[qualifiedDisjoint] = {
            [lSerialized]: [
              lIndex
            ],
            [rSerialized]: [
              rIndex
            ]
          };
          continue;
        }
        const cases = discriminants.casesByDisjoint[qualifiedDisjoint];
        const existingLBranch = cases[lSerialized];
        if (!existingLBranch) {
          cases[lSerialized] = [
            lIndex
          ];
        } else if (!existingLBranch.includes(lIndex)) {
          existingLBranch.push(lIndex);
        }
        const existingRBranch = cases[rSerialized];
        if (!existingRBranch) {
          cases[rSerialized] = [
            rIndex
          ];
        } else if (!existingRBranch.includes(rIndex)) {
          existingRBranch.push(rIndex);
        }
      }
    }
  }
  return discriminants;
};
var parseQualifiedDisjoint = (qualifiedDisjoint) => {
  const path = Path.fromString(qualifiedDisjoint);
  return [
    path,
    path.pop()
  ];
};
var findBestDiscriminant = (remainingIndices, discriminants) => {
  let bestDiscriminant;
  for (let i = 0; i < remainingIndices.length - 1; i++) {
    const lIndex = remainingIndices[i];
    for (let j = i + 1; j < remainingIndices.length; j++) {
      const rIndex = remainingIndices[j];
      const candidates = discriminants.disjointsByPair[`${lIndex}/${rIndex}`];
      for (const qualifiedDisjoint of candidates) {
        const indexCases = discriminants.casesByDisjoint[qualifiedDisjoint];
        const filteredCases = {};
        const defaultCases = [
          ...remainingIndices
        ];
        let score = 0;
        for (const caseKey in indexCases) {
          const filteredIndices = indexCases[caseKey].filter((i2) => {
            const remainingIndex = remainingIndices.indexOf(i2);
            if (remainingIndex !== -1) {
              delete defaultCases[remainingIndex];
              return true;
            }
          });
          if (filteredIndices.length === 0) {
            continue;
          }
          filteredCases[caseKey] = filteredIndices;
          score++;
        }
        const defaultCaseKeys = objectKeysOf(defaultCases);
        if (defaultCaseKeys.length) {
          filteredCases["default"] = defaultCaseKeys.map((k) => parseInt(k));
        }
        if (!bestDiscriminant || score > bestDiscriminant.score) {
          const [path, kind] = parseQualifiedDisjoint(qualifiedDisjoint);
          bestDiscriminant = {
            path,
            kind,
            indexCases: filteredCases,
            score
          };
          if (score === remainingIndices.length) {
            return bestDiscriminant;
          }
        }
      }
    }
  }
  return bestDiscriminant;
};
var serializeDefinitionIfAllowed = (kind, definition) => {
  switch (kind) {
    case "value":
      return serializeIfPrimitive(definition);
    case "domain":
      return definition;
    case "class":
      return getExactConstructorObjectKind(definition);
    default:
      return;
  }
};
var serializeIfPrimitive = (data) => {
  const domain = domainOf(data);
  return domain === "object" || domain === "symbol" ? void 0 : serializePrimitive(data);
};
var serializeData = {
  value: (data) => serializeIfPrimitive(data) ?? "default",
  class: (data) => objectKindOf(data) ?? "default",
  domain: domainOf
};
var serializeCase = (kind, data) => serializeData[kind](data);
var branchIncludesMorph = (branch, $) => "morph" in branch ? true : "props" in branch ? Object.values(branch.props).some((prop) => nodeIncludesMorph(propToNode(prop), $)) : false;
var nodeIncludesMorph = (node, $) => typeof node === "string" ? $.resolve(node).includesMorph : Object.values($.resolveTypeNode(node)).some((predicate) => predicate === true ? false : isArray(predicate) ? predicate.some((branch) => branchIncludesMorph(branch, $)) : branchIncludesMorph(predicate, $));

// ../../../node_modules/arktype/dist/mjs/nodes/predicate.js
var emptyRulesIfTrue = (predicate) => predicate === true ? {} : predicate;
var comparePredicates = (l, r, context) => {
  if (l === true && r === true) {
    return equality();
  }
  if (!isArray(l) && !isArray(r)) {
    const result = branchIntersection(emptyRulesIfTrue(l), emptyRulesIfTrue(r), context);
    return result === l ? l : result === r ? r : result;
  }
  const lBranches = listFrom(emptyRulesIfTrue(l));
  const rBranches = listFrom(emptyRulesIfTrue(r));
  const comparison = compareBranches(lBranches, rBranches, context);
  if (comparison.equalities.length === lBranches.length && comparison.equalities.length === rBranches.length) {
    return equality();
  }
  if (comparison.lExtendsR.length + comparison.equalities.length === lBranches.length) {
    return l;
  }
  if (comparison.rExtendsL.length + comparison.equalities.length === rBranches.length) {
    return r;
  }
  return comparison;
};
var predicateIntersection = (domain, l, r, state) => {
  state.domain = domain;
  const comparison = comparePredicates(l, r, state);
  if (!isBranchComparison(comparison)) {
    return comparison;
  }
  const resultBranches = [
    ...comparison.distinctIntersections,
    ...comparison.equalities.map((indices) => comparison.lBranches[indices[0]]),
    ...comparison.lExtendsR.map((lIndex) => comparison.lBranches[lIndex]),
    ...comparison.rExtendsL.map((rIndex) => comparison.rBranches[rIndex])
  ];
  if (resultBranches.length === 0) {
    state.addDisjoint("union", comparison.lBranches, comparison.rBranches);
  }
  return resultBranches.length === 1 ? resultBranches[0] : resultBranches;
};
var predicateUnion = (domain, l, r, type2) => {
  const state = new IntersectionState(type2, "|");
  const comparison = comparePredicates(l, r, state);
  if (!isBranchComparison(comparison)) {
    return isEquality(comparison) || comparison === l ? r : comparison === r ? l : (
      // subtype of the other, it consists of two opposite literals
      // and can be simplified to a non-literal boolean.
      domain === "boolean" ? true : [
        emptyRulesIfTrue(l),
        emptyRulesIfTrue(r)
      ]
    );
  }
  const resultBranches = [
    ...comparison.lBranches.filter((_, lIndex) => !comparison.lExtendsR.includes(lIndex) && !comparison.equalities.some((indexPair) => indexPair[0] === lIndex)),
    ...comparison.rBranches.filter((_, rIndex) => !comparison.rExtendsL.includes(rIndex) && !comparison.equalities.some((indexPair) => indexPair[1] === rIndex))
  ];
  return resultBranches.length === 1 ? resultBranches[0] : resultBranches;
};
var flattenPredicate = (predicate, context) => {
  if (predicate === true) {
    return [];
  }
  return isArray(predicate) ? flattenBranches(predicate, context) : flattenBranch(predicate, context);
};
var isLiteralCondition = (predicate) => typeof predicate === "object" && "value" in predicate;

// ../../../node_modules/arktype/dist/mjs/nodes/node.js
var isConfigNode = (node) => "config" in node;
var nodeIntersection = (l, r, state) => {
  state.domain = void 0;
  const lDomains = state.type.scope.resolveTypeNode(l);
  const rDomains = state.type.scope.resolveTypeNode(r);
  const result = typeNodeIntersection(lDomains, rDomains, state);
  if (typeof result === "object" && !hasKeys(result)) {
    return hasKeys(state.disjoints) ? anonymousDisjoint() : state.addDisjoint("domain", objectKeysOf(lDomains), objectKeysOf(rDomains));
  }
  return result === lDomains ? l : result === rDomains ? r : result;
};
var typeNodeIntersection = composeKeyedIntersection((domain, l, r, context) => {
  if (l === void 0) {
    return r === void 0 ? throwInternalError(undefinedOperandsMessage) : void 0;
  }
  if (r === void 0) {
    return void 0;
  }
  return predicateIntersection(domain, l, r, context);
}, {
  onEmpty: "omit"
});
var rootIntersection = (l, r, type2) => {
  const state = new IntersectionState(type2, "&");
  const result = nodeIntersection(l, r, state);
  return isDisjoint(result) ? throwParseError(compileDisjointReasonsMessage(state.disjoints)) : isEquality(result) ? l : result;
};
var rootUnion = (l, r, type2) => {
  const lDomains = type2.scope.resolveTypeNode(l);
  const rDomains = type2.scope.resolveTypeNode(r);
  const result = {};
  const domains = objectKeysOf({
    ...lDomains,
    ...rDomains
  });
  for (const domain of domains) {
    result[domain] = hasKey(lDomains, domain) ? hasKey(rDomains, domain) ? predicateUnion(domain, lDomains[domain], rDomains[domain], type2) : lDomains[domain] : hasKey(rDomains, domain) ? rDomains[domain] : throwInternalError(undefinedOperandsMessage);
  }
  return result;
};
var hasImpliedDomain = (flatPredicate) => flatPredicate[0] && (flatPredicate[0][0] === "value" || flatPredicate[0][0] === "class");
var flattenType = (type2) => {
  const ctx = {
    type: type2,
    path: new Path(),
    lastDomain: "undefined"
  };
  return flattenNode(type2.node, ctx);
};
var flattenNode = (node, ctx) => {
  if (typeof node === "string") {
    return ctx.type.scope.resolve(node).flat;
  }
  const hasConfig = isConfigNode(node);
  const flattenedTypeNode = flattenTypeNode(hasConfig ? node.node : node, ctx);
  return hasConfig ? [
    [
      "config",
      {
        config: entriesOf(node.config),
        node: flattenedTypeNode
      }
    ]
  ] : flattenedTypeNode;
};
var flattenTypeNode = (node, ctx) => {
  const domains = objectKeysOf(node);
  if (domains.length === 1) {
    const domain = domains[0];
    const predicate = node[domain];
    if (predicate === true) {
      return domain;
    }
    ctx.lastDomain = domain;
    const flatPredicate = flattenPredicate(predicate, ctx);
    return hasImpliedDomain(flatPredicate) ? flatPredicate : [
      [
        "domain",
        domain
      ],
      ...flatPredicate
    ];
  }
  const result = {};
  for (const domain of domains) {
    ctx.lastDomain = domain;
    result[domain] = flattenPredicate(node[domain], ctx);
  }
  return [
    [
      "domains",
      result
    ]
  ];
};
var isLiteralNode = (node, domain) => {
  return resolutionExtendsDomain(node, domain) && isLiteralCondition(node[domain]);
};
var resolutionExtendsDomain = (resolution, domain) => {
  const domains = objectKeysOf(resolution);
  return domains.length === 1 && domains[0] === domain;
};
var toArrayNode = (node) => ({
  object: {
    class: Array,
    props: {
      [mappedKeys.index]: node
    }
  }
});

// ../../../node_modules/arktype/dist/mjs/parse/string/shift/scanner.js
function _defineProperty3(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}
var Scanner = class _Scanner {
  /** Get lookahead and advance scanner by one */
  shift() {
    return this.chars[this.i++] ?? "";
  }
  get lookahead() {
    return this.chars[this.i] ?? "";
  }
  shiftUntil(condition) {
    let shifted = "";
    while (this.lookahead) {
      if (condition(this, shifted)) {
        if (shifted[shifted.length - 1] === _Scanner.escapeToken) {
          shifted = shifted.slice(0, -1);
        } else {
          break;
        }
      }
      shifted += this.shift();
    }
    return shifted;
  }
  shiftUntilNextTerminator() {
    this.shiftUntil(_Scanner.lookaheadIsNotWhitespace);
    return this.shiftUntil(_Scanner.lookaheadIsTerminator);
  }
  get unscanned() {
    return this.chars.slice(this.i, this.chars.length).join("");
  }
  lookaheadIs(char) {
    return this.lookahead === char;
  }
  lookaheadIsIn(tokens) {
    return this.lookahead in tokens;
  }
  constructor(def) {
    _defineProperty3(this, "chars", void 0);
    _defineProperty3(this, "i", void 0);
    _defineProperty3(this, "finalized", false);
    this.chars = [
      ...def
    ];
    this.i = 0;
  }
};
(function(Scanner2) {
  var lookaheadIsTerminator = Scanner2.lookaheadIsTerminator = (scanner) => scanner.lookahead in terminatingChars;
  var lookaheadIsNotWhitespace = Scanner2.lookaheadIsNotWhitespace = (scanner) => scanner.lookahead !== whiteSpaceToken;
  var comparatorStartChars = Scanner2.comparatorStartChars = {
    "<": true,
    ">": true,
    "=": true
  };
  var terminatingChars = Scanner2.terminatingChars = {
    ...comparatorStartChars,
    "|": true,
    "&": true,
    ")": true,
    "[": true,
    "%": true,
    " ": true
  };
  var comparators = Scanner2.comparators = {
    "<": true,
    ">": true,
    "<=": true,
    ">=": true,
    "==": true
  };
  var oneCharComparators = Scanner2.oneCharComparators = {
    "<": true,
    ">": true
  };
  var comparatorDescriptions = Scanner2.comparatorDescriptions = {
    "<": "less than",
    ">": "more than",
    "<=": "at most",
    ">=": "at least",
    "==": "exactly"
  };
  var invertedComparators = Scanner2.invertedComparators = {
    "<": ">",
    ">": "<",
    "<=": ">=",
    ">=": "<=",
    "==": "=="
  };
  var branchTokens = Scanner2.branchTokens = {
    "|": true,
    "&": true
  };
  var escapeToken = Scanner2.escapeToken = "\\";
  var whiteSpaceToken = Scanner2.whiteSpaceToken = " ";
})(Scanner || (Scanner = {}));

// ../../../node_modules/arktype/dist/mjs/traverse/problems.js
function _checkPrivateRedeclaration2(obj, privateCollection) {
  if (privateCollection.has(obj)) {
    throw new TypeError("Cannot initialize the same private elements twice on an object");
  }
}
function _classApplyDescriptorGet2(receiver, descriptor) {
  if (descriptor.get) {
    return descriptor.get.call(receiver);
  }
  return descriptor.value;
}
function _classApplyDescriptorSet2(receiver, descriptor, value) {
  if (descriptor.set) {
    descriptor.set.call(receiver, value);
  } else {
    if (!descriptor.writable) {
      throw new TypeError("attempted to set read only private field");
    }
    descriptor.value = value;
  }
}
function _classExtractFieldDescriptor2(receiver, privateMap, action2) {
  if (!privateMap.has(receiver)) {
    throw new TypeError("attempted to " + action2 + " private field on non-instance");
  }
  return privateMap.get(receiver);
}
function _classPrivateFieldGet2(receiver, privateMap) {
  var descriptor = _classExtractFieldDescriptor2(receiver, privateMap, "get");
  return _classApplyDescriptorGet2(receiver, descriptor);
}
function _classPrivateFieldInit2(obj, privateMap, value) {
  _checkPrivateRedeclaration2(obj, privateMap);
  privateMap.set(obj, value);
}
function _classPrivateFieldSet2(receiver, privateMap, value) {
  var descriptor = _classExtractFieldDescriptor2(receiver, privateMap, "set");
  _classApplyDescriptorSet2(receiver, descriptor, value);
  return value;
}
function _defineProperty4(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}
var ArkTypeError = class extends TypeError {
  constructor(problems) {
    super(`${problems}`);
    _defineProperty4(this, "cause", void 0);
    this.cause = problems;
  }
};
var Problem = class {
  toString() {
    return this.message;
  }
  get message() {
    return this.writers.addContext(this.reason, this.path);
  }
  get reason() {
    return this.writers.writeReason(this.mustBe, new DataWrapper(this.data));
  }
  get mustBe() {
    return typeof this.writers.mustBe === "string" ? this.writers.mustBe : this.writers.mustBe(this.source);
  }
  constructor(code, path, data, source, writers) {
    _defineProperty4(this, "code", void 0);
    _defineProperty4(this, "path", void 0);
    _defineProperty4(this, "data", void 0);
    _defineProperty4(this, "source", void 0);
    _defineProperty4(this, "writers", void 0);
    _defineProperty4(this, "parts", void 0);
    this.code = code;
    this.path = path;
    this.data = data;
    this.source = source;
    this.writers = writers;
    if (this.code === "multi") {
      this.parts = this.source;
    }
  }
};
var _state = /* @__PURE__ */ new WeakMap();
var ProblemArray = class extends Array {
  mustBe(description, opts) {
    return this.add("custom", description, opts);
  }
  add(code, source, opts) {
    const path = Path.from((opts == null ? void 0 : opts.path) ?? _classPrivateFieldGet2(this, _state).path);
    const data = (
      // we have to check for the presence of the key explicitly since the
      // data could be undefined or null
      opts && "data" in opts ? opts.data : _classPrivateFieldGet2(this, _state).data
    );
    const problem = new Problem(
      // avoid a bunch of errors from TS trying to discriminate the
      // problem input based on the code
      code,
      path,
      data,
      source,
      _classPrivateFieldGet2(this, _state).getProblemConfig(code)
    );
    this.addProblem(problem);
    return problem;
  }
  addProblem(problem) {
    const pathKey = `${problem.path}`;
    const existing = this.byPath[pathKey];
    if (existing) {
      if (existing.parts) {
        existing.parts.push(problem);
      } else {
        const problemIntersection = new Problem("multi", existing.path, existing.data, [
          existing,
          problem
        ], _classPrivateFieldGet2(this, _state).getProblemConfig("multi"));
        const existingIndex = this.indexOf(existing);
        this[existingIndex === -1 ? this.length : existingIndex] = problemIntersection;
        this.byPath[pathKey] = problemIntersection;
      }
    } else {
      this.byPath[pathKey] = problem;
      this.push(problem);
    }
    this.count++;
  }
  get summary() {
    return `${this}`;
  }
  toString() {
    return this.join("\n");
  }
  throw() {
    throw new ArkTypeError(this);
  }
  constructor(state) {
    super();
    _defineProperty4(this, "byPath", {});
    _defineProperty4(this, "count", 0);
    _classPrivateFieldInit2(this, _state, {
      writable: true,
      value: void 0
    });
    _classPrivateFieldSet2(this, _state, state);
  }
};
var Problems = ProblemArray;
var capitalize = (s) => s[0].toUpperCase() + s.slice(1);
var domainsToDescriptions = (domains) => domains.map((objectKind) => domainDescriptions[objectKind]);
var objectKindsToDescriptions = (kinds) => kinds.map((objectKind) => objectKindDescriptions[objectKind]);
var describeBranches = (descriptions) => {
  if (descriptions.length === 0) {
    return "never";
  }
  if (descriptions.length === 1) {
    return descriptions[0];
  }
  let description = "";
  for (let i = 0; i < descriptions.length - 1; i++) {
    description += descriptions[i];
    if (i < descriptions.length - 2) {
      description += ", ";
    }
  }
  description += ` or ${descriptions[descriptions.length - 1]}`;
  return description;
};
var writeDefaultReason = (mustBe, was) => `must be ${mustBe}${was && ` (was ${was})`}`;
var addDefaultContext = (reason, path) => path.length === 0 ? capitalize(reason) : path.length === 1 && isWellFormedInteger(path[0]) ? `Item at index ${path[0]} ${reason}` : `${path} ${reason}`;
var defaultProblemConfig = {
  divisor: {
    mustBe: (divisor) => divisor === 1 ? `an integer` : `a multiple of ${divisor}`
  },
  class: {
    mustBe: (expected) => {
      const possibleObjectKind = getExactConstructorObjectKind(expected);
      return possibleObjectKind ? objectKindDescriptions[possibleObjectKind] : `an instance of ${expected.name}`;
    },
    writeReason: (mustBe, data) => writeDefaultReason(mustBe, data.className)
  },
  domain: {
    mustBe: (domain) => domainDescriptions[domain],
    writeReason: (mustBe, data) => writeDefaultReason(mustBe, data.domain)
  },
  missing: {
    mustBe: () => "defined",
    writeReason: (mustBe) => writeDefaultReason(mustBe, "")
  },
  extraneous: {
    mustBe: () => "removed",
    writeReason: (mustBe) => writeDefaultReason(mustBe, "")
  },
  bound: {
    mustBe: (bound) => `${Scanner.comparatorDescriptions[bound.comparator]} ${bound.limit}${bound.units ? ` ${bound.units}` : ""}`,
    writeReason: (mustBe, data) => writeDefaultReason(mustBe, `${data.size}`)
  },
  regex: {
    mustBe: (expression) => `a string matching ${expression}`
  },
  value: {
    mustBe: stringify
  },
  branches: {
    mustBe: (branchProblems) => describeBranches(branchProblems.map((problem) => `${problem.path} must be ${problem.parts ? describeBranches(problem.parts.map((part) => part.mustBe)) : problem.mustBe}`)),
    writeReason: (mustBe, data) => `${mustBe} (was ${data})`,
    addContext: (reason, path) => path.length ? `At ${path}, ${reason}` : reason
  },
  multi: {
    mustBe: (problems) => "\u2022 " + problems.map((_) => _.mustBe).join("\n\u2022 "),
    writeReason: (mustBe, data) => `${data} must be...
${mustBe}`,
    addContext: (reason, path) => path.length ? `At ${path}, ${reason}` : reason
  },
  custom: {
    mustBe: (mustBe) => mustBe
  },
  cases: {
    mustBe: (cases) => describeBranches(cases)
  }
};
var problemCodes = objectKeysOf(defaultProblemConfig);
var compileDefaultProblemWriters = () => {
  const result = {};
  let code;
  for (code of problemCodes) {
    result[code] = {
      mustBe: defaultProblemConfig[code].mustBe,
      writeReason: defaultProblemConfig[code].writeReason ?? writeDefaultReason,
      addContext: defaultProblemConfig[code].addContext ?? addDefaultContext
    };
  }
  return result;
};
var defaultProblemWriters = compileDefaultProblemWriters();
var compileProblemWriters = (input) => {
  var _a, _b, _c;
  if (!input) {
    return defaultProblemWriters;
  }
  const result = {};
  for (const code of problemCodes) {
    result[code] = {
      mustBe: ((_a = input[code]) == null ? void 0 : _a.mustBe) ?? defaultProblemConfig[code].mustBe,
      writeReason: ((_b = input[code]) == null ? void 0 : _b.writeReason) ?? defaultProblemConfig[code].writeReason ?? input.writeReason ?? writeDefaultReason,
      addContext: ((_c = input[code]) == null ? void 0 : _c.addContext) ?? defaultProblemConfig[code].addContext ?? input.addContext ?? addDefaultContext
    };
  }
  return result;
};

// ../../../node_modules/arktype/dist/mjs/traverse/traverse.js
function _checkPrivateRedeclaration3(obj, privateCollection) {
  if (privateCollection.has(obj)) {
    throw new TypeError("Cannot initialize the same private elements twice on an object");
  }
}
function _classApplyDescriptorGet3(receiver, descriptor) {
  if (descriptor.get) {
    return descriptor.get.call(receiver);
  }
  return descriptor.value;
}
function _classApplyDescriptorSet3(receiver, descriptor, value) {
  if (descriptor.set) {
    descriptor.set.call(receiver, value);
  } else {
    if (!descriptor.writable) {
      throw new TypeError("attempted to set read only private field");
    }
    descriptor.value = value;
  }
}
function _classExtractFieldDescriptor3(receiver, privateMap, action2) {
  if (!privateMap.has(receiver)) {
    throw new TypeError("attempted to " + action2 + " private field on non-instance");
  }
  return privateMap.get(receiver);
}
function _classPrivateFieldGet3(receiver, privateMap) {
  var descriptor = _classExtractFieldDescriptor3(receiver, privateMap, "get");
  return _classApplyDescriptorGet3(receiver, descriptor);
}
function _classPrivateFieldInit3(obj, privateMap, value) {
  _checkPrivateRedeclaration3(obj, privateMap);
  privateMap.set(obj, value);
}
function _classPrivateFieldSet3(receiver, privateMap, value) {
  var descriptor = _classExtractFieldDescriptor3(receiver, privateMap, "set");
  _classApplyDescriptorSet3(receiver, descriptor, value);
  return value;
}
function _defineProperty5(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}
var initializeTraversalConfig = () => ({
  mustBe: [],
  writeReason: [],
  addContext: [],
  keys: []
});
var problemWriterKeys = [
  "mustBe",
  "writeReason",
  "addContext"
];
var traverseRoot = (t, data) => {
  const state = new TraversalState(data, t);
  traverse(t.flat, state);
  const result = new CheckResult(state);
  if (state.problems.count) {
    result.problems = state.problems;
  } else {
    for (const [o, k] of state.entriesToPrune) {
      delete o[k];
    }
    result.data = state.data;
  }
  return result;
};
var CheckResult = class {
  constructor() {
    _defineProperty5(this, "data", void 0);
    _defineProperty5(this, "problems", void 0);
  }
};
var _seen = /* @__PURE__ */ new WeakMap();
var TraversalState = class {
  getProblemConfig(code) {
    const result = {};
    for (const k of problemWriterKeys) {
      result[k] = this.traversalConfig[k][0] ?? this.rootScope.config.codes[code][k];
    }
    return result;
  }
  traverseConfig(configEntries, node) {
    for (const entry of configEntries) {
      this.traversalConfig[entry[0]].unshift(entry[1]);
    }
    const isValid = traverse(node, this);
    for (const entry of configEntries) {
      this.traversalConfig[entry[0]].shift();
    }
    return isValid;
  }
  traverseKey(key, node) {
    const lastData = this.data;
    this.data = this.data[key];
    this.path.push(key);
    const isValid = traverse(node, this);
    this.path.pop();
    if (lastData[key] !== this.data) {
      lastData[key] = this.data;
    }
    this.data = lastData;
    return isValid;
  }
  traverseResolution(name) {
    const resolution = this.type.scope.resolve(name);
    const id2 = resolution.qualifiedName;
    const data = this.data;
    const isObject = hasDomain(data, "object");
    if (isObject) {
      const seenByCurrentType = _classPrivateFieldGet3(this, _seen)[id2];
      if (seenByCurrentType) {
        if (seenByCurrentType.includes(data)) {
          return true;
        }
        seenByCurrentType.push(data);
      } else {
        _classPrivateFieldGet3(this, _seen)[id2] = [
          data
        ];
      }
    }
    const lastType = this.type;
    this.type = resolution;
    const isValid = traverse(resolution.flat, this);
    this.type = lastType;
    if (isObject) {
      _classPrivateFieldGet3(this, _seen)[id2].pop();
    }
    return isValid;
  }
  traverseBranches(branches) {
    const lastFailFast = this.failFast;
    this.failFast = true;
    const lastProblems = this.problems;
    const branchProblems = new Problems(this);
    this.problems = branchProblems;
    const lastPath = this.path;
    const lastKeysToPrune = this.entriesToPrune;
    let hasValidBranch = false;
    for (const branch of branches) {
      this.path = new Path();
      this.entriesToPrune = [];
      if (checkEntries(branch, this)) {
        hasValidBranch = true;
        lastKeysToPrune.push(...this.entriesToPrune);
        break;
      }
    }
    this.path = lastPath;
    this.entriesToPrune = lastKeysToPrune;
    this.problems = lastProblems;
    this.failFast = lastFailFast;
    return hasValidBranch || !this.problems.add("branches", branchProblems);
  }
  constructor(data, type2) {
    _defineProperty5(this, "data", void 0);
    _defineProperty5(this, "type", void 0);
    _defineProperty5(this, "path", void 0);
    _defineProperty5(this, "problems", void 0);
    _defineProperty5(this, "entriesToPrune", void 0);
    _defineProperty5(this, "failFast", void 0);
    _defineProperty5(this, "traversalConfig", void 0);
    _defineProperty5(this, "rootScope", void 0);
    _classPrivateFieldInit3(this, _seen, {
      writable: true,
      value: void 0
    });
    this.data = data;
    this.type = type2;
    this.path = new Path();
    this.problems = new Problems(this);
    this.entriesToPrune = [];
    this.failFast = false;
    this.traversalConfig = initializeTraversalConfig();
    _classPrivateFieldSet3(this, _seen, {});
    this.rootScope = type2.scope;
  }
};
var traverse = (node, state) => typeof node === "string" ? domainOf(state.data) === node || !state.problems.add("domain", node) : checkEntries(node, state);
var checkEntries = (entries, state) => {
  let isValid = true;
  for (let i = 0; i < entries.length; i++) {
    const [k, v] = entries[i];
    const entryAllowsData = entryCheckers[k](v, state);
    isValid && (isValid = entryAllowsData);
    if (!isValid) {
      if (state.failFast) {
        return false;
      }
      if (i < entries.length - 1 && precedenceMap[k] < precedenceMap[entries[i + 1][0]]) {
        return false;
      }
    }
  }
  return isValid;
};
var checkRequiredProp = (prop, state) => {
  if (prop[0] in state.data) {
    return state.traverseKey(prop[0], prop[1]);
  }
  state.problems.add("missing", void 0, {
    path: state.path.concat(prop[0]),
    data: void 0
  });
  return false;
};
var createPropChecker = (kind) => (props, state) => {
  let isValid = true;
  const remainingUnseenRequired = {
    ...props.required
  };
  for (const k in state.data) {
    if (props.required[k]) {
      isValid = state.traverseKey(k, props.required[k]) && isValid;
      delete remainingUnseenRequired[k];
    } else if (props.optional[k]) {
      isValid = state.traverseKey(k, props.optional[k]) && isValid;
    } else if (props.index && wellFormedIntegerMatcher.test(k)) {
      isValid = state.traverseKey(k, props.index) && isValid;
    } else if (kind === "distilledProps") {
      if (state.failFast) {
        state.entriesToPrune.push([
          state.data,
          k
        ]);
      } else {
        delete state.data[k];
      }
    } else {
      isValid = false;
      state.problems.add("extraneous", state.data[k], {
        path: state.path.concat(k)
      });
    }
    if (!isValid && state.failFast) {
      return false;
    }
  }
  const unseenRequired = Object.keys(remainingUnseenRequired);
  if (unseenRequired.length) {
    for (const k of unseenRequired) {
      state.problems.add("missing", void 0, {
        path: state.path.concat(k)
      });
    }
    return false;
  }
  return isValid;
};
var entryCheckers = {
  regex: checkRegex,
  divisor: checkDivisor,
  domains: (domains, state) => {
    const entries = domains[domainOf(state.data)];
    return entries ? checkEntries(entries, state) : !state.problems.add("cases", domainsToDescriptions(objectKeysOf(domains)));
  },
  domain: (domain, state) => domainOf(state.data) === domain || !state.problems.add("domain", domain),
  bound: checkBound,
  optionalProp: (prop, state) => {
    if (prop[0] in state.data) {
      return state.traverseKey(prop[0], prop[1]);
    }
    return true;
  },
  // these checks work the same way, the keys are only distinct so that
  // prerequisite props can have a higher precedence
  requiredProp: checkRequiredProp,
  prerequisiteProp: checkRequiredProp,
  indexProp: (node, state) => {
    if (!Array.isArray(state.data)) {
      state.problems.add("class", Array);
      return false;
    }
    let isValid = true;
    for (let i = 0; i < state.data.length; i++) {
      isValid = state.traverseKey(`${i}`, node) && isValid;
      if (!isValid && state.failFast) {
        return false;
      }
    }
    return isValid;
  },
  branches: (branches, state) => state.traverseBranches(branches),
  switch: (rule, state) => {
    const dataAtPath = getPath(state.data, rule.path);
    const caseKey = serializeCase(rule.kind, dataAtPath);
    if (hasKey(rule.cases, caseKey)) {
      return checkEntries(rule.cases[caseKey], state);
    }
    const caseKeys = objectKeysOf(rule.cases);
    const missingCasePath = state.path.concat(rule.path);
    const caseDescriptions = rule.kind === "value" ? caseKeys : rule.kind === "domain" ? domainsToDescriptions(caseKeys) : rule.kind === "class" ? objectKindsToDescriptions(caseKeys) : throwInternalError(`Unexpectedly encountered rule kind '${rule.kind}' during traversal`);
    state.problems.add("cases", caseDescriptions, {
      path: missingCasePath,
      data: dataAtPath
    });
    return false;
  },
  alias: (name, state) => state.traverseResolution(name),
  class: checkClass,
  narrow: (narrow2, state) => {
    const lastProblemsCount = state.problems.count;
    const result = narrow2(state.data, state.problems);
    if (!result && state.problems.count === lastProblemsCount) {
      state.problems.mustBe(narrow2.name ? `valid according to ${narrow2.name}` : "valid");
    }
    return result;
  },
  config: ({ config, node }, state) => state.traverseConfig(config, node),
  value: (value, state) => state.data === value || !state.problems.add("value", value),
  morph: (morph2, state) => {
    const out = morph2(state.data, state.problems);
    if (state.problems.length) {
      return false;
    }
    if (out instanceof Problem) {
      state.problems.addProblem(out);
      return false;
    }
    if (out instanceof CheckResult) {
      if (out.problems) {
        for (const problem of out.problems) {
          state.problems.addProblem(problem);
        }
        return false;
      }
      state.data = out.data;
      return true;
    }
    state.data = out;
    return true;
  },
  distilledProps: createPropChecker("distilledProps"),
  strictProps: createPropChecker("strictProps")
};

// ../../../node_modules/arktype/dist/mjs/utils/chainableNoOpProxy.js
var chainableNoOpProxy = new Proxy(() => chainableNoOpProxy, {
  get: () => chainableNoOpProxy
});

// ../../../node_modules/arktype/dist/mjs/scopes/type.js
var initializeType = (name, definition, config, scope2) => {
  const root = {
    // temporarily initialize node/flat to aliases that will be included in
    // the final type in case of cyclic resolutions
    node: name,
    flat: [
      [
        "alias",
        name
      ]
    ],
    allows: (data) => !namedTraverse(data).problems,
    assert: (data) => {
      const result = namedTraverse(data);
      return result.problems ? result.problems.throw() : result.data;
    },
    infer: chainableNoOpProxy,
    inferIn: chainableNoOpProxy,
    qualifiedName: isAnonymousName(name) ? scope2.getAnonymousQualifiedName(name) : `${scope2.name}.${name}`,
    definition,
    scope: scope2,
    includesMorph: false,
    config
  };
  const namedTraverse = {
    [name]: (data) => traverseRoot(namedTraverse, data)
  }[name];
  const t = Object.assign(namedTraverse, root);
  return t;
};
var isType = (value) => (value == null ? void 0 : value.infer) === chainableNoOpProxy;
var isAnonymousName = (name) => name[0] === "\u03BB";

// ../../../node_modules/arktype/dist/mjs/parse/string/shift/operand/unenclosed.js
var parseUnenclosed = (s) => {
  const token = s.scanner.shiftUntilNextTerminator();
  s.setRoot(unenclosedToNode(s, token));
};
var unenclosedToNode = (s, token) => {
  if (s.ctx.type.scope.addParsedReferenceIfResolvable(token, s.ctx)) {
    return token;
  }
  return maybeParseUnenclosedLiteral(token) ?? s.error(token === "" ? writeMissingOperandMessage(s) : writeUnresolvableMessage(token));
};
var maybeParseUnenclosedLiteral = (token) => {
  const maybeNumber = tryParseWellFormedNumber(token);
  if (maybeNumber !== void 0) {
    return {
      number: {
        value: maybeNumber
      }
    };
  }
  const maybeBigint = tryParseWellFormedBigint(token);
  if (maybeBigint !== void 0) {
    return {
      bigint: {
        value: maybeBigint
      }
    };
  }
};
var writeUnresolvableMessage = (token) => `'${token}' is unresolvable`;
var writeMissingOperandMessage = (s) => {
  const operator = s.previousOperator();
  return operator ? writeMissingRightOperandMessage(operator, s.scanner.unscanned) : writeExpressionExpectedMessage(s.scanner.unscanned);
};
var writeMissingRightOperandMessage = (token, unscanned) => `Token '${token}' requires a right operand${unscanned ? ` before '${unscanned}'` : ""}`;
var writeExpressionExpectedMessage = (unscanned) => `Expected an expression${unscanned ? ` before '${unscanned}'` : ""}`;

// ../../../node_modules/arktype/dist/mjs/parse/ast/config.js
var parseConfigTuple = (def, ctx) => ({
  node: ctx.type.scope.resolveTypeNode(parseDefinition(def[0], ctx)),
  config: def[2]
});

// ../../../node_modules/arktype/dist/mjs/utils/freeze.js
var deepFreeze = (value) => Object.isFrozen(value) ? value : Array.isArray(value) ? Object.freeze(value.map(deepFreeze)) : deepFreezeDictionary(value);
var deepFreezeDictionary = (value) => {
  for (const k in value) {
    deepFreeze(value[k]);
  }
  return value;
};

// ../../../node_modules/arktype/dist/mjs/parse/ast/keyof.js
var arrayIndexStringBranch = deepFreeze({
  regex: wellFormedNonNegativeIntegerMatcher.source
});
var arrayIndexNumberBranch = deepFreeze({
  range: {
    min: {
      comparator: ">=",
      limit: 0
    }
  },
  divisor: 1
});
var parseKeyOfTuple = (def, ctx) => {
  const resolution = ctx.type.scope.resolveNode(parseDefinition(def[1], ctx));
  const predicateKeys = objectKeysOf(resolution).map((domain) => keysOfPredicate(domain, resolution[domain]));
  const sharedKeys = sharedKeysOf(predicateKeys);
  if (!sharedKeys.length) {
    return writeImplicitNeverMessage(ctx.path, "keyof");
  }
  const keyNode = {};
  for (const key of sharedKeys) {
    const keyType = typeof key;
    if (keyType === "string" || keyType === "number" || keyType === "symbol") {
      var _keyNode, _keyType;
      (_keyNode = keyNode)[_keyType = keyType] ?? (_keyNode[_keyType] = []);
      keyNode[keyType].push({
        value: key
      });
    } else if (key === wellFormedNonNegativeIntegerMatcher) {
      var _keyNode1, _keyNode2;
      (_keyNode1 = keyNode).string ?? (_keyNode1.string = []);
      keyNode.string.push(arrayIndexStringBranch);
      (_keyNode2 = keyNode).number ?? (_keyNode2.number = []);
      keyNode.number.push(arrayIndexNumberBranch);
    } else {
      return throwInternalError(`Unexpected keyof key '${stringify(key)}'`);
    }
  }
  return Object.fromEntries(Object.entries(keyNode).map(([domain, branches]) => [
    domain,
    branches.length === 1 ? branches[0] : branches
  ]));
};
var baseKeysByDomain = {
  bigint: prototypeKeysOf(0n),
  boolean: prototypeKeysOf(false),
  null: [],
  number: prototypeKeysOf(0),
  // TS doesn't include the Object prototype in keyof, so keyof object is never
  object: [],
  string: prototypeKeysOf(""),
  symbol: prototypeKeysOf(Symbol()),
  undefined: []
};
var keysOfPredicate = (domain, predicate) => domain !== "object" || predicate === true ? baseKeysByDomain[domain] : sharedKeysOf(listFrom(predicate).map((branch) => keysOfObjectBranch(branch)));
var sharedKeysOf = (keyBranches) => {
  if (!keyBranches.length) {
    return [];
  }
  let sharedKeys = keyBranches[0];
  for (let i = 1; i < keyBranches.length; i++) {
    sharedKeys = sharedKeys.filter((k) => keyBranches[i].includes(k));
  }
  return sharedKeys;
};
var keysOfObjectBranch = (branch) => {
  const result = [];
  if ("props" in branch) {
    for (const key of Object.keys(branch.props)) {
      if (key === mappedKeys.index) {
        result.push(wellFormedNonNegativeIntegerMatcher);
      } else if (!result.includes(key)) {
        result.push(key);
        if (wellFormedNonNegativeIntegerMatcher.test(key)) {
          result.push(tryParseWellFormedInteger(key, `Unexpectedly failed to parse an integer from key '${key}'`));
        }
      }
    }
  }
  if ("class" in branch) {
    const constructor = typeof branch.class === "string" ? defaultObjectKinds[branch.class] : branch.class;
    for (const key of prototypeKeysOf(constructor.prototype)) {
      if (!result.includes(key)) {
        result.push(key);
      }
    }
  }
  return result;
};

// ../../../node_modules/arktype/dist/mjs/parse/ast/morph.js
var parseMorphTuple = (def, ctx) => {
  if (typeof def[2] !== "function") {
    return throwParseError(writeMalformedMorphExpressionMessage(def[2]));
  }
  const node = parseDefinition(def[0], ctx);
  const resolution = ctx.type.scope.resolveTypeNode(node);
  const morph2 = def[2];
  ctx.type.includesMorph = true;
  let domain;
  const result = {};
  for (domain in resolution) {
    const predicate = resolution[domain];
    if (predicate === true) {
      result[domain] = {
        rules: {},
        morph: morph2
      };
    } else if (typeof predicate === "object") {
      result[domain] = isArray(predicate) ? predicate.map((branch) => applyMorph(branch, morph2)) : applyMorph(predicate, morph2);
    } else {
      throwInternalError(`Unexpected predicate value for domain '${domain}': ${stringify(predicate)}`);
    }
  }
  return result;
};
var applyMorph = (branch, morph2) => isTransformationBranch(branch) ? {
  ...branch,
  morph: branch.morph ? Array.isArray(branch.morph) ? [
    ...branch.morph,
    morph2
  ] : [
    branch.morph,
    morph2
  ] : morph2
} : {
  rules: branch,
  morph: morph2
};
var writeMalformedMorphExpressionMessage = (value) => `Morph expression requires a function following '|>' (was ${typeof value})`;

// ../../../node_modules/arktype/dist/mjs/parse/ast/distributableFunction.js
var writeMalformedDistributableFunctionMessage = (def) => `Expected a Function or Record<Domain, Function> operand (${stringify(def)} was invalid)`;
var distributeFunctionToNode = (distributableFunction, node, ctx, ruleKey) => {
  const domains = objectKeysOf(node);
  if (!hasDomain(distributableFunction, "object")) {
    return throwParseError(writeMalformedDistributableFunctionMessage(distributableFunction));
  }
  const distributed = {};
  if (typeof distributableFunction === "function") {
    const domainFunction = {
      [ruleKey]: distributableFunction
    };
    for (const domain of domains) {
      distributed[domain] = domainFunction;
    }
  } else {
    for (const domain of domains) {
      if (distributableFunction[domain] === void 0) {
        continue;
      }
      const functionInDomain = {
        [ruleKey]: distributableFunction[domain]
      };
      if (typeof functionInDomain[ruleKey] !== "function") {
        return throwParseError(writeMalformedDistributableFunctionMessage(functionInDomain));
      }
      distributed[domain] = functionInDomain;
    }
  }
  return distributed;
};

// ../../../node_modules/arktype/dist/mjs/parse/ast/narrow.js
var parseNarrowTuple = (def, ctx) => {
  const inputNode = parseDefinition(def[0], ctx);
  const resolution = ctx.type.scope.resolveNode(inputNode);
  const hasConfig = isConfigNode(resolution);
  const typeNode = hasConfig ? resolution.node : resolution;
  const result = rootIntersection(inputNode, distributeFunctionToNode(def[2], typeNode, ctx, "narrow"), ctx.type);
  return hasConfig ? {
    config: resolution.config,
    node: result
  } : result;
};

// ../../../node_modules/arktype/dist/mjs/parse/ast/tuple.js
var parseTuple = (def, ctx) => {
  if (isIndexOneExpression(def)) {
    return indexOneParsers[def[1]](def, ctx);
  }
  if (isIndexZeroExpression(def)) {
    return prefixParsers[def[0]](def, ctx);
  }
  const props = {
    //  length is created as a prerequisite prop, ensuring if it is invalid,
    //  no other props will be checked, which is usually desirable for tuple
    //  definitions.
    length: [
      "!",
      {
        number: {
          value: def.length
        }
      }
    ]
  };
  for (let i = 0; i < def.length; i++) {
    ctx.path.push(`${i}`);
    props[i] = parseDefinition(def[i], ctx);
    ctx.path.pop();
  }
  return {
    object: {
      class: Array,
      props
    }
  };
};
var parseBranchTuple = (def, ctx) => {
  if (def[2] === void 0) {
    return throwParseError(writeMissingRightOperandMessage(def[1], ""));
  }
  const l = parseDefinition(def[0], ctx);
  const r = parseDefinition(def[2], ctx);
  return def[1] === "&" ? rootIntersection(l, r, ctx.type) : rootUnion(l, r, ctx.type);
};
var parseArrayTuple = (def, scope2) => toArrayNode(parseDefinition(def[0], scope2));
var isIndexOneExpression = (def) => indexOneParsers[def[1]] !== void 0;
var indexOneParsers = {
  "|": parseBranchTuple,
  "&": parseBranchTuple,
  "[]": parseArrayTuple,
  "=>": parseNarrowTuple,
  "|>": parseMorphTuple,
  ":": parseConfigTuple
};
var prefixParsers = {
  keyof: parseKeyOfTuple,
  instanceof: (def) => {
    if (typeof def[1] !== "function") {
      return throwParseError(`Expected a constructor following 'instanceof' operator (was ${typeof def[1]}).`);
    }
    return {
      object: {
        class: def[1]
      }
    };
  },
  "===": (def) => ({
    [domainOf(def[1])]: {
      value: def[1]
    }
  }),
  node: (def) => def[1]
};
var isIndexZeroExpression = (def) => prefixParsers[def[0]] !== void 0;

// ../../../node_modules/arktype/dist/mjs/parse/record.js
var parseRecord = (def, ctx) => {
  const props = {};
  for (const definitionKey in def) {
    let keyName = definitionKey;
    let isOptional2 = false;
    if (definitionKey[definitionKey.length - 1] === "?") {
      if (definitionKey[definitionKey.length - 2] === Scanner.escapeToken) {
        keyName = `${definitionKey.slice(0, -2)}?`;
      } else {
        keyName = definitionKey.slice(0, -1);
        isOptional2 = true;
      }
    }
    ctx.path.push(keyName);
    const propNode = parseDefinition(def[definitionKey], ctx);
    ctx.path.pop();
    props[keyName] = isOptional2 ? [
      "?",
      propNode
    ] : propNode;
  }
  return {
    object: {
      props
    }
  };
};

// ../../../node_modules/arktype/dist/mjs/parse/string/reduce/shared.js
var writeUnmatchedGroupCloseMessage = (unscanned) => `Unmatched )${unscanned === "" ? "" : ` before ${unscanned}`}`;
var unclosedGroupMessage = "Missing )";
var writeOpenRangeMessage = (min, comparator) => `Left bounds are only valid when paired with right bounds (try ...${comparator}${min})`;
var writeUnpairableComparatorMessage = (comparator) => `Left-bounded expressions must specify their limits using < or <= (was ${comparator})`;
var writeMultipleLeftBoundsMessage = (openLimit, openComparator, limit, comparator) => `An expression may have at most one left bound (parsed ${openLimit}${Scanner.invertedComparators[openComparator]}, ${limit}${Scanner.invertedComparators[comparator]})`;

// ../../../node_modules/arktype/dist/mjs/parse/string/reduce/dynamic.js
function _defineProperty6(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}
var DynamicState = class {
  error(message) {
    return throwParseError(message);
  }
  hasRoot() {
    return this.root !== void 0;
  }
  resolveRoot() {
    this.assertHasRoot();
    return this.ctx.type.scope.resolveTypeNode(this.root);
  }
  rootToString() {
    this.assertHasRoot();
    return stringify(this.root);
  }
  ejectRootIfLimit() {
    this.assertHasRoot();
    const resolution = typeof this.root === "string" ? this.ctx.type.scope.resolveNode(this.root) : this.root;
    if (isLiteralNode(resolution, "number")) {
      const limit = resolution.number.value;
      this.root = void 0;
      return limit;
    }
  }
  ejectRangeIfOpen() {
    if (this.branches.range) {
      const range = this.branches.range;
      delete this.branches.range;
      return range;
    }
  }
  assertHasRoot() {
    if (this.root === void 0) {
      return throwInternalError("Unexpected interaction with unset root");
    }
  }
  assertUnsetRoot() {
    if (this.root !== void 0) {
      return throwInternalError("Unexpected attempt to overwrite root");
    }
  }
  setRoot(node) {
    this.assertUnsetRoot();
    this.root = node;
  }
  rootToArray() {
    this.root = toArrayNode(this.ejectRoot());
  }
  intersect(node) {
    this.root = rootIntersection(this.ejectRoot(), node, this.ctx.type);
  }
  ejectRoot() {
    this.assertHasRoot();
    const root = this.root;
    this.root = void 0;
    return root;
  }
  ejectFinalizedRoot() {
    this.assertHasRoot();
    const root = this.root;
    this.root = ejectedProxy;
    return root;
  }
  finalize() {
    if (this.groups.length) {
      return this.error(unclosedGroupMessage);
    }
    this.finalizeBranches();
    this.scanner.finalized = true;
  }
  reduceLeftBound(limit, comparator) {
    const invertedComparator = Scanner.invertedComparators[comparator];
    if (!isKeyOf(invertedComparator, minComparators)) {
      return this.error(writeUnpairableComparatorMessage(comparator));
    }
    if (this.branches.range) {
      return this.error(writeMultipleLeftBoundsMessage(`${this.branches.range.limit}`, this.branches.range.comparator, `${limit}`, invertedComparator));
    }
    this.branches.range = {
      limit,
      comparator: invertedComparator
    };
  }
  finalizeBranches() {
    this.assertRangeUnset();
    if (this.branches.union) {
      this.pushRootToBranch("|");
      this.setRoot(this.branches.union);
    } else if (this.branches.intersection) {
      this.setRoot(rootIntersection(this.branches.intersection, this.ejectRoot(), this.ctx.type));
    }
  }
  finalizeGroup() {
    this.finalizeBranches();
    const topBranchState = this.groups.pop();
    if (!topBranchState) {
      return this.error(writeUnmatchedGroupCloseMessage(this.scanner.unscanned));
    }
    this.branches = topBranchState;
  }
  pushRootToBranch(token) {
    this.assertRangeUnset();
    this.branches.intersection = this.branches.intersection ? rootIntersection(this.branches.intersection, this.ejectRoot(), this.ctx.type) : this.ejectRoot();
    if (token === "|") {
      this.branches.union = this.branches.union ? rootUnion(this.branches.union, this.branches.intersection, this.ctx.type) : this.branches.intersection;
      delete this.branches.intersection;
    }
  }
  assertRangeUnset() {
    if (this.branches.range) {
      return this.error(writeOpenRangeMessage(`${this.branches.range.limit}`, this.branches.range.comparator));
    }
  }
  reduceGroupOpen() {
    this.groups.push(this.branches);
    this.branches = {};
  }
  previousOperator() {
    var _a;
    return ((_a = this.branches.range) == null ? void 0 : _a.comparator) ?? this.branches.intersection ? "&" : this.branches.union ? "|" : void 0;
  }
  shiftedByOne() {
    this.scanner.shift();
    return this;
  }
  constructor(def, ctx) {
    _defineProperty6(this, "ctx", void 0);
    _defineProperty6(this, "scanner", void 0);
    _defineProperty6(this, "root", void 0);
    _defineProperty6(this, "branches", void 0);
    _defineProperty6(this, "groups", void 0);
    this.ctx = ctx;
    this.branches = {};
    this.groups = [];
    this.scanner = new Scanner(def);
  }
};
var ejectedProxy = new Proxy({}, {
  get: () => throwInternalError(`Unexpected attempt to access ejected attributes`)
});

// ../../../node_modules/arktype/dist/mjs/parse/string/shift/operand/enclosed.js
var parseEnclosed = (s, enclosing) => {
  const token = s.scanner.shiftUntil(untilLookaheadIsClosing[enclosing]);
  if (s.scanner.lookahead === "") {
    return s.error(writeUnterminatedEnclosedMessage(token, enclosing));
  }
  if (s.scanner.shift() === "/") {
    getRegex(token);
    s.setRoot({
      string: {
        regex: token
      }
    });
  } else {
    s.setRoot({
      string: {
        value: token
      }
    });
  }
};
var enclosingChar = {
  "'": 1,
  '"': 1,
  "/": 1
};
var untilLookaheadIsClosing = {
  "'": (scanner) => scanner.lookahead === `'`,
  '"': (scanner) => scanner.lookahead === `"`,
  "/": (scanner) => scanner.lookahead === `/`
};
var enclosingCharDescriptions = {
  '"': "double-quote",
  "'": "single-quote",
  "/": "forward slash"
};
var writeUnterminatedEnclosedMessage = (fragment, enclosing) => `${enclosing}${fragment} requires a closing ${enclosingCharDescriptions[enclosing]}`;

// ../../../node_modules/arktype/dist/mjs/parse/string/shift/operand/operand.js
var parseOperand = (s) => s.scanner.lookahead === "" ? s.error(writeMissingOperandMessage(s)) : s.scanner.lookahead === "(" ? s.shiftedByOne().reduceGroupOpen() : s.scanner.lookaheadIsIn(enclosingChar) ? parseEnclosed(s, s.scanner.shift()) : s.scanner.lookahead === " " ? parseOperand(s.shiftedByOne()) : parseUnenclosed(s);

// ../../../node_modules/arktype/dist/mjs/parse/ast/bound.js
var writeUnboundableMessage = (root) => `Bounded expression ${root} must be a number, string or array`;

// ../../../node_modules/arktype/dist/mjs/parse/string/shift/operator/bounds.js
var parseBound = (s, start) => {
  const comparator = shiftComparator(s, start);
  const maybeMin = s.ejectRootIfLimit();
  return maybeMin === void 0 ? parseRightBound(s, comparator) : s.reduceLeftBound(maybeMin, comparator);
};
var shiftComparator = (s, start) => s.scanner.lookaheadIs("=") ? `${start}${s.scanner.shift()}` : isKeyOf(start, Scanner.oneCharComparators) ? start : s.error(singleEqualsMessage);
var singleEqualsMessage = `= is not a valid comparator. Use == to check for equality`;
var parseRightBound = (s, comparator) => {
  const limitToken = s.scanner.shiftUntilNextTerminator();
  const limit = tryParseWellFormedNumber(limitToken, writeInvalidLimitMessage(comparator, limitToken + s.scanner.unscanned));
  const openRange = s.ejectRangeIfOpen();
  const rightBound = {
    comparator,
    limit
  };
  const range = openRange ? !hasComparatorIn(rightBound, maxComparators) ? s.error(writeUnpairableComparatorMessage(comparator)) : compareStrictness("min", openRange, rightBound) === "l" ? s.error(writeEmptyRangeMessage({
    min: openRange,
    max: rightBound
  })) : {
    min: openRange,
    max: rightBound
  } : hasComparator(rightBound, "==") ? rightBound : hasComparatorIn(rightBound, minComparators) ? {
    min: rightBound
  } : hasComparatorIn(rightBound, maxComparators) ? {
    max: rightBound
  } : throwInternalError(`Unexpected comparator '${rightBound.comparator}'`);
  s.intersect(distributeRange(range, s));
};
var distributeRange = (range, s) => {
  const resolution = s.resolveRoot();
  const domains = objectKeysOf(resolution);
  const distributedRange = {};
  const rangePredicate = {
    range
  };
  const isBoundable = domains.every((domain) => {
    switch (domain) {
      case "string":
        distributedRange.string = rangePredicate;
        return true;
      case "number":
        distributedRange.number = rangePredicate;
        return true;
      case "object":
        distributedRange.object = rangePredicate;
        if (resolution.object === true) {
          return false;
        }
        return listFrom(resolution.object).every((branch) => "class" in branch && branch.class === Array);
      default:
        return false;
    }
  });
  if (!isBoundable) {
    s.error(writeUnboundableMessage(s.rootToString()));
  }
  return distributedRange;
};
var hasComparator = (bound, comparator) => bound.comparator === comparator;
var hasComparatorIn = (bound, comparators) => bound.comparator in comparators;
var writeInvalidLimitMessage = (comparator, limit) => `Comparator ${comparator} must be followed by a number literal (was '${limit}')`;
var writeEmptyRangeMessage = (range) => `${stringifyRange(range)} is empty`;

// ../../../node_modules/arktype/dist/mjs/parse/ast/divisor.js
var writeIndivisibleMessage = (root) => `Divisibility operand ${root} must be a number`;

// ../../../node_modules/arktype/dist/mjs/parse/string/shift/operator/divisor.js
var parseDivisor = (s) => {
  const divisorToken = s.scanner.shiftUntilNextTerminator();
  const divisor = tryParseWellFormedInteger(divisorToken, writeInvalidDivisorMessage(divisorToken));
  if (divisor === 0) {
    s.error(writeInvalidDivisorMessage(0));
  }
  const rootDomains = objectKeysOf(s.resolveRoot());
  if (rootDomains.length === 1 && rootDomains[0] === "number") {
    s.intersect({
      number: {
        divisor
      }
    });
  } else {
    s.error(writeIndivisibleMessage(s.rootToString()));
  }
};
var writeInvalidDivisorMessage = (divisor) => `% operator must be followed by a non-zero integer literal (was ${divisor})`;

// ../../../node_modules/arktype/dist/mjs/parse/string/shift/operator/operator.js
var parseOperator = (s) => {
  const lookahead = s.scanner.shift();
  return lookahead === "" ? s.finalize() : lookahead === "[" ? s.scanner.shift() === "]" ? s.rootToArray() : s.error(incompleteArrayTokenMessage) : isKeyOf(lookahead, Scanner.branchTokens) ? s.pushRootToBranch(lookahead) : lookahead === ")" ? s.finalizeGroup() : isKeyOf(lookahead, Scanner.comparatorStartChars) ? parseBound(s, lookahead) : lookahead === "%" ? parseDivisor(s) : lookahead === " " ? parseOperator(s) : throwInternalError(writeUnexpectedCharacterMessage(lookahead));
};
var writeUnexpectedCharacterMessage = (char) => `Unexpected character '${char}'`;
var incompleteArrayTokenMessage = `Missing expected ']'`;

// ../../../node_modules/arktype/dist/mjs/parse/string/string.js
var parseString = (def, ctx) => ctx.type.scope.parseCache.get(def) ?? ctx.type.scope.parseCache.set(def, maybeNaiveParse(def, ctx) ?? fullStringParse(def, ctx));
var maybeNaiveParse = (def, ctx) => {
  if (ctx.type.scope.addParsedReferenceIfResolvable(def, ctx)) {
    return def;
  }
  if (def.endsWith("[]")) {
    const elementDef = def.slice(0, -2);
    if (ctx.type.scope.addParsedReferenceIfResolvable(def, ctx)) {
      return toArrayNode(elementDef);
    }
  }
};
var fullStringParse = (def, ctx) => {
  const s = new DynamicState(def, ctx);
  parseOperand(s);
  return loop(s);
};
var loop = (s) => {
  while (!s.scanner.finalized) {
    next(s);
  }
  return s.ejectFinalizedRoot();
};
var next = (s) => s.hasRoot() ? parseOperator(s) : parseOperand(s);

// ../../../node_modules/arktype/dist/mjs/parse/definition.js
var parseDefinition = (def, ctx) => {
  const domain = domainOf(def);
  if (domain === "string") {
    return parseString(def, ctx);
  }
  if (domain !== "object") {
    return throwParseError(writeBadDefinitionTypeMessage(domain));
  }
  const objectKind = objectKindOf(def);
  switch (objectKind) {
    case "Object":
      return parseRecord(def, ctx);
    case "Array":
      return parseTuple(def, ctx);
    case "RegExp":
      return {
        string: {
          regex: def.source
        }
      };
    case "Function":
      if (isType(def)) {
        return ctx.type.scope.addAnonymousTypeReference(def, ctx);
      }
      if (isThunk(def)) {
        const returned = def();
        if (isType(returned)) {
          return ctx.type.scope.addAnonymousTypeReference(returned, ctx);
        }
      }
      return throwParseError(writeBadDefinitionTypeMessage("Function"));
    default:
      return throwParseError(writeBadDefinitionTypeMessage(objectKind ?? stringify(def)));
  }
};
var as = Symbol("as");
var isThunk = (def) => typeof def === "function" && def.length === 0;
var writeBadDefinitionTypeMessage = (actual) => `Type definitions must be strings or objects (was ${actual})`;

// ../../../node_modules/arktype/dist/mjs/scopes/cache.js
function _defineProperty7(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}
var Cache = class {
  get root() {
    return this.cache;
  }
  has(name) {
    return name in this.cache;
  }
  get(name) {
    return this.cache[name];
  }
  set(name, item) {
    this.cache[name] = item;
    return item;
  }
  constructor() {
    _defineProperty7(this, "cache", {});
  }
};
var FreezingCache = class extends Cache {
  set(name, item) {
    this.cache[name] = deepFreeze(item);
    return item;
  }
};

// ../../../node_modules/arktype/dist/mjs/scopes/scope.js
function _checkPrivateRedeclaration4(obj, privateCollection) {
  if (privateCollection.has(obj)) {
    throw new TypeError("Cannot initialize the same private elements twice on an object");
  }
}
function _classApplyDescriptorGet4(receiver, descriptor) {
  if (descriptor.get) {
    return descriptor.get.call(receiver);
  }
  return descriptor.value;
}
function _classApplyDescriptorSet4(receiver, descriptor, value) {
  if (descriptor.set) {
    descriptor.set.call(receiver, value);
  } else {
    if (!descriptor.writable) {
      throw new TypeError("attempted to set read only private field");
    }
    descriptor.value = value;
  }
}
function _classExtractFieldDescriptor4(receiver, privateMap, action2) {
  if (!privateMap.has(receiver)) {
    throw new TypeError("attempted to " + action2 + " private field on non-instance");
  }
  return privateMap.get(receiver);
}
function _classPrivateFieldGet4(receiver, privateMap) {
  var descriptor = _classExtractFieldDescriptor4(receiver, privateMap, "get");
  return _classApplyDescriptorGet4(receiver, descriptor);
}
function _classPrivateFieldInit4(obj, privateMap, value) {
  _checkPrivateRedeclaration4(obj, privateMap);
  privateMap.set(obj, value);
}
function _classPrivateFieldSet4(receiver, privateMap, value) {
  var descriptor = _classExtractFieldDescriptor4(receiver, privateMap, "set");
  _classApplyDescriptorSet4(receiver, descriptor, value);
  return value;
}
function _classPrivateMethodGet(receiver, privateSet, fn) {
  if (!privateSet.has(receiver)) {
    throw new TypeError("attempted to get private field on non-instance");
  }
  return fn;
}
function _classPrivateMethodInit(obj, privateSet) {
  _checkPrivateRedeclaration4(obj, privateSet);
  privateSet.add(obj);
}
function _defineProperty8(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}
var compileScopeOptions = (opts) => ({
  codes: compileProblemWriters(opts.codes),
  keys: opts.keys ?? "loose"
});
var anonymousScopeCount = 0;
var scopeRegistry = {};
var spaceRegistry = {};
var _resolutions = /* @__PURE__ */ new WeakMap();
var _exports = /* @__PURE__ */ new WeakMap();
var _register = /* @__PURE__ */ new WeakSet();
var _cacheSpaces = /* @__PURE__ */ new WeakSet();
var _initializeContext = /* @__PURE__ */ new WeakSet();
var _resolveRecurse = /* @__PURE__ */ new WeakSet();
var Scope = class {
  getAnonymousQualifiedName(base) {
    let increment = 0;
    let id2 = base;
    while (this.isResolvable(id2)) {
      id2 = `${base}${increment++}`;
    }
    return `${this.name}.${id2}`;
  }
  addAnonymousTypeReference(referencedType, ctx) {
    var _ctx_type;
    (_ctx_type = ctx.type).includesMorph || (_ctx_type.includesMorph = referencedType.includesMorph);
    return referencedType.node;
  }
  get infer() {
    return chainableNoOpProxy;
  }
  compile() {
    if (!spaceRegistry[this.name]) {
      for (const name in this.aliases) {
        this.resolve(name);
      }
      spaceRegistry[this.name] = _classPrivateFieldGet4(this, _exports).root;
    }
    return _classPrivateFieldGet4(this, _exports).root;
  }
  addParsedReferenceIfResolvable(name, ctx) {
    var _ctx_type;
    const resolution = _classPrivateMethodGet(this, _resolveRecurse, resolveRecurse).call(this, name, "undefined", [
      name
    ]);
    if (!resolution) {
      return false;
    }
    (_ctx_type = ctx.type).includesMorph || (_ctx_type.includesMorph = resolution.includesMorph);
    return true;
  }
  resolve(name) {
    return _classPrivateMethodGet(this, _resolveRecurse, resolveRecurse).call(this, name, "throw", [
      name
    ]);
  }
  resolveNode(node) {
    return typeof node === "string" ? this.resolveNode(this.resolve(node).node) : node;
  }
  resolveTypeNode(node) {
    const resolution = this.resolveNode(node);
    return isConfigNode(resolution) ? resolution.node : resolution;
  }
  isResolvable(name) {
    return _classPrivateFieldGet4(this, _resolutions).has(name) || this.aliases[name];
  }
  constructor(aliases, opts = {}) {
    _classPrivateMethodInit(this, _register);
    _classPrivateMethodInit(this, _cacheSpaces);
    _classPrivateMethodInit(this, _initializeContext);
    _classPrivateMethodInit(this, _resolveRecurse);
    _defineProperty8(this, "aliases", void 0);
    _defineProperty8(this, "name", void 0);
    _defineProperty8(this, "config", void 0);
    _defineProperty8(this, "parseCache", void 0);
    _classPrivateFieldInit4(this, _resolutions, {
      writable: true,
      value: void 0
    });
    _classPrivateFieldInit4(this, _exports, {
      writable: true,
      value: void 0
    });
    _defineProperty8(this, "expressions", void 0);
    _defineProperty8(this, "intersection", void 0);
    _defineProperty8(this, "union", void 0);
    _defineProperty8(this, "arrayOf", void 0);
    _defineProperty8(this, "keyOf", void 0);
    _defineProperty8(this, "valueOf", void 0);
    _defineProperty8(this, "instanceOf", void 0);
    _defineProperty8(this, "narrow", void 0);
    _defineProperty8(this, "morph", void 0);
    _defineProperty8(this, "type", void 0);
    this.aliases = aliases;
    this.parseCache = new FreezingCache();
    _classPrivateFieldSet4(this, _resolutions, new Cache());
    _classPrivateFieldSet4(this, _exports, new Cache());
    this.expressions = {
      intersection: (l, r, opts2) => this.type([
        l,
        "&",
        r
      ], opts2),
      union: (l, r, opts2) => this.type([
        l,
        "|",
        r
      ], opts2),
      arrayOf: (def, opts2) => this.type([
        def,
        "[]"
      ], opts2),
      keyOf: (def, opts2) => this.type([
        "keyof",
        def
      ], opts2),
      node: (def, opts2) => this.type([
        "node",
        def
      ], opts2),
      instanceOf: (def, opts2) => this.type([
        "instanceof",
        def
      ], opts2),
      valueOf: (def, opts2) => this.type([
        "===",
        def
      ], opts2),
      narrow: (def, fn, opts2) => this.type([
        def,
        "=>",
        fn
      ], opts2),
      morph: (def, fn, opts2) => this.type([
        def,
        "|>",
        fn
      ], opts2)
    };
    this.intersection = this.expressions.intersection;
    this.union = this.expressions.union;
    this.arrayOf = this.expressions.arrayOf;
    this.keyOf = this.expressions.keyOf;
    this.valueOf = this.expressions.valueOf;
    this.instanceOf = this.expressions.instanceOf;
    this.narrow = this.expressions.narrow;
    this.morph = this.expressions.morph;
    this.type = Object.assign((def, config = {}) => {
      const t = initializeType("\u03BBtype", def, config, this);
      const ctx = _classPrivateMethodGet(this, _initializeContext, initializeContext).call(this, t);
      const root = parseDefinition(def, ctx);
      t.node = deepFreeze(hasKeys(config) ? {
        config,
        node: this.resolveTypeNode(root)
      } : root);
      t.flat = deepFreeze(flattenType(t));
      return t;
    }, {
      from: this.expressions.node
    });
    this.name = _classPrivateMethodGet(this, _register, register).call(this, opts);
    if (opts.standard !== false) {
      _classPrivateMethodGet(this, _cacheSpaces, cacheSpaces).call(this, [
        spaceRegistry["standard"]
      ], "imports");
    }
    if (opts.imports) {
      _classPrivateMethodGet(this, _cacheSpaces, cacheSpaces).call(this, opts.imports, "imports");
    }
    if (opts.includes) {
      _classPrivateMethodGet(this, _cacheSpaces, cacheSpaces).call(this, opts.includes, "includes");
    }
    this.config = compileScopeOptions(opts);
  }
};
function register(opts) {
  const name = opts.name ? scopeRegistry[opts.name] ? throwParseError(`A scope named '${opts.name}' already exists`) : opts.name : `scope${++anonymousScopeCount}`;
  scopeRegistry[name] = this;
  return name;
}
function cacheSpaces(spaces, kind) {
  for (const space of spaces) {
    for (const name in space) {
      if (_classPrivateFieldGet4(this, _resolutions).has(name) || name in this.aliases) {
        throwParseError(writeDuplicateAliasesMessage(name));
      }
      _classPrivateFieldGet4(this, _resolutions).set(name, space[name]);
      if (kind === "includes") {
        _classPrivateFieldGet4(this, _exports).set(name, space[name]);
      }
    }
  }
}
function initializeContext(type2) {
  return {
    type: type2,
    path: new Path()
  };
}
function resolveRecurse(name, onUnresolvable, seen) {
  const maybeCacheResult = _classPrivateFieldGet4(this, _resolutions).get(name);
  if (maybeCacheResult) {
    return maybeCacheResult;
  }
  const aliasDef = this.aliases[name];
  if (!aliasDef) {
    return onUnresolvable === "throw" ? throwInternalError(`Unexpectedly failed to resolve alias '${name}'`) : void 0;
  }
  const t = initializeType(name, aliasDef, {}, this);
  const ctx = _classPrivateMethodGet(this, _initializeContext, initializeContext).call(this, t);
  _classPrivateFieldGet4(this, _resolutions).set(name, t);
  _classPrivateFieldGet4(this, _exports).set(name, t);
  let node = parseDefinition(aliasDef, ctx);
  if (typeof node === "string") {
    if (seen.includes(node)) {
      return throwParseError(writeShallowCycleErrorMessage(name, seen));
    }
    seen.push(node);
    node = _classPrivateMethodGet(this, _resolveRecurse, resolveRecurse).call(this, node, "throw", seen).node;
  }
  t.node = deepFreeze(node);
  t.flat = deepFreeze(flattenType(t));
  return t;
}
var scope = (aliases, opts = {}) => new Scope(aliases, opts);
var rootScope = scope({}, {
  name: "root",
  standard: false
});
var rootType = rootScope.type;
var writeShallowCycleErrorMessage = (name, seen) => `Alias '${name}' has a shallow resolution cycle: ${[
  ...seen,
  name
].join("=>")}`;
var writeDuplicateAliasesMessage = (name) => `Alias '${name}' is already defined`;

// ../../../node_modules/arktype/dist/mjs/scopes/jsObjects.js
var jsObjectsScope = scope({
  Function: [
    "node",
    {
      object: {
        class: Function
      }
    }
  ],
  Date: [
    "node",
    {
      object: {
        class: Date
      }
    }
  ],
  Error: [
    "node",
    {
      object: {
        class: Error
      }
    }
  ],
  Map: [
    "node",
    {
      object: {
        class: Map
      }
    }
  ],
  RegExp: [
    "node",
    {
      object: {
        class: RegExp
      }
    }
  ],
  Set: [
    "node",
    {
      object: {
        class: Set
      }
    }
  ],
  WeakMap: [
    "node",
    {
      object: {
        class: WeakMap
      }
    }
  ],
  WeakSet: [
    "node",
    {
      object: {
        class: WeakSet
      }
    }
  ],
  Promise: [
    "node",
    {
      object: {
        class: Promise
      }
    }
  ]
}, {
  name: "jsObjects",
  standard: false
});
var jsObjects = jsObjectsScope.compile();

// ../../../node_modules/arktype/dist/mjs/scopes/tsKeywords.js
var always = {
  bigint: true,
  boolean: true,
  null: true,
  number: true,
  object: true,
  string: true,
  symbol: true,
  undefined: true
};
var tsKeywordsScope = scope({
  any: [
    "node",
    always
  ],
  bigint: [
    "node",
    {
      bigint: true
    }
  ],
  boolean: [
    "node",
    {
      boolean: true
    }
  ],
  false: [
    "node",
    {
      boolean: {
        value: false
      }
    }
  ],
  never: [
    "node",
    {}
  ],
  null: [
    "node",
    {
      null: true
    }
  ],
  number: [
    "node",
    {
      number: true
    }
  ],
  object: [
    "node",
    {
      object: true
    }
  ],
  string: [
    "node",
    {
      string: true
    }
  ],
  symbol: [
    "node",
    {
      symbol: true
    }
  ],
  true: [
    "node",
    {
      boolean: {
        value: true
      }
    }
  ],
  unknown: [
    "node",
    always
  ],
  void: [
    "node",
    {
      undefined: true
    }
  ],
  undefined: [
    "node",
    {
      undefined: true
    }
  ]
}, {
  name: "ts",
  standard: false
});
var tsKeywords = tsKeywordsScope.compile();

// ../../../node_modules/arktype/dist/mjs/scopes/validation/creditCard.js
var isLuhnValid = (creditCardInput) => {
  const sanitized = creditCardInput.replace(/[- ]+/g, "");
  let sum = 0;
  let digit;
  let tmpNum;
  let shouldDouble;
  for (let i = sanitized.length - 1; i >= 0; i--) {
    digit = sanitized.substring(i, i + 1);
    tmpNum = parseInt(digit, 10);
    if (shouldDouble) {
      tmpNum *= 2;
      if (tmpNum >= 10) {
        sum += tmpNum % 10 + 1;
      } else {
        sum += tmpNum;
      }
    } else {
      sum += tmpNum;
    }
    shouldDouble = !shouldDouble;
  }
  return !!(sum % 10 === 0 ? sanitized : false);
};
var creditCardMatcher = /^(?:4[0-9]{12}(?:[0-9]{3,6})?|5[1-5][0-9]{14}|(222[1-9]|22[3-9][0-9]|2[3-6][0-9]{2}|27[01][0-9]|2720)[0-9]{12}|6(?:011|5[0-9][0-9])[0-9]{12,15}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11}|6[27][0-9]{14}|^(81[0-9]{14,17}))$/;
var creditCard = rootType([
  creditCardMatcher,
  "=>",
  (s, problems) => isLuhnValid(s) || !problems.mustBe("a valid credit card number")
], {
  mustBe: "a valid credit card number"
});

// ../../../node_modules/arktype/dist/mjs/scopes/validation/date.js
var dayDelimiterMatcher = /^[./-]$/;
var iso8601Matcher = /^([+-]?\d{4}(?!\d{2}\b))((-?)((0[1-9]|1[0-2])(\3([12]\d|0[1-9]|3[01]))?|W([0-4]\d|5[0-3])(-?[1-7])?|(00[1-9]|0[1-9]\d|[12]\d{2}|3([0-5]\d|6[1-6])))([T]((([01]\d|2[0-3])((:?)[0-5]\d)?|24:?00)([.,]\d+(?!:))?)?(\17[0-5]\d([.,]\d+)?)?([zZ]|([+-])([01]\d|2[0-3]):?([0-5]\d)?)?)?)?$/;
var isValidDateInstance = (date) => !isNaN(date);
var writeFormattedMustBe = (format) => `a ${format}-formatted date`;
var tryParseDate = (data, opts) => {
  if (!(opts == null ? void 0 : opts.format)) {
    const result = new Date(data);
    return isValidDateInstance(result) ? result : "a valid date";
  }
  if (opts.format === "iso8601") {
    return iso8601Matcher.test(data) ? new Date(data) : writeFormattedMustBe("iso8601");
  }
  const dataParts = data.split(dayDelimiterMatcher);
  const delimiter = data[dataParts[0].length];
  const formatParts = delimiter ? opts.format.split(delimiter) : [
    opts.format
  ];
  if (dataParts.length !== formatParts.length) {
    return writeFormattedMustBe(opts.format);
  }
  const parsedParts = {};
  for (let i = 0; i < formatParts.length; i++) {
    if (dataParts[i].length !== formatParts[i].length && // if format is "m" or "d", data is allowed to be 1 or 2 characters
    !(formatParts[i].length === 1 && dataParts[i].length === 2)) {
      return writeFormattedMustBe(opts.format);
    }
    parsedParts[formatParts[i][0]] = dataParts[i];
  }
  const date = /* @__PURE__ */ new Date(`${parsedParts.m}/${parsedParts.d}/${parsedParts.y}`);
  if (`${date.getDate()}` === parsedParts.d) {
    return date;
  }
  return writeFormattedMustBe(opts.format);
};
var parsedDate = rootType([
  tsKeywords.string,
  "|>",
  (s, problems) => {
    const result = tryParseDate(s);
    return typeof result === "string" ? problems.mustBe(result) : result;
  }
]);

// ../../../node_modules/arktype/dist/mjs/scopes/validation/validation.js
var parsedNumber = rootType([
  wellFormedNumberMatcher,
  "|>",
  (s) => parseFloat(s)
], {
  mustBe: "a well-formed numeric string"
});
var parsedInteger = rootType([
  wellFormedIntegerMatcher,
  "|>",
  (s) => parseInt(s)
], {
  mustBe: "a well-formed integer string"
});
var email = rootType(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/, {
  mustBe: "a valid email"
});
var uuid = rootType(/^[0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{12}$/, {
  mustBe: "a valid UUID"
});
var semver = rootType(/^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/, {
  mustBe: "a valid semantic version (see https://semver.org/)"
});
var json = rootType([
  tsKeywords.string,
  "|>",
  (s) => JSON.parse(s)
], {
  mustBe: "a JSON-parsable string"
});
var validationScope = scope({
  // Character sets
  alpha: [
    /^[A-Za-z]*$/,
    ":",
    {
      mustBe: "only letters"
    }
  ],
  alphanumeric: [
    /^[A-Za-z\d]*$/,
    ":",
    {
      mustBe: "only letters and digits"
    }
  ],
  lowercase: [
    /^[a-z]*$/,
    ":",
    {
      mustBe: "only lowercase letters"
    }
  ],
  uppercase: [
    /^[A-Z]*$/,
    ":",
    {
      mustBe: "only uppercase letters"
    }
  ],
  creditCard,
  email,
  uuid,
  parsedNumber,
  parsedInteger,
  parsedDate,
  semver,
  json,
  integer: [
    "node",
    {
      number: {
        divisor: 1
      }
    }
  ]
}, {
  name: "validation",
  standard: false
});
var validation = validationScope.compile();

// ../../../node_modules/arktype/dist/mjs/scopes/ark.js
var arkScope = scope({}, {
  name: "standard",
  includes: [
    tsKeywords,
    jsObjects,
    validation
  ],
  standard: false
});
var ark = arkScope.compile();
var scopes = {
  root: rootScope,
  tsKeywords: tsKeywordsScope,
  jsObjects: jsObjectsScope,
  validation: validationScope,
  ark: arkScope
};
var type = arkScope.type;

// ../../../node_modules/arktype/dist/mjs/scopes/expressions.js
var intersection = scopes.ark.intersection;
var union = scopes.ark.union;
var arrayOf = scopes.ark.arrayOf;
var keyOf = scopes.ark.keyOf;
var instanceOf = scopes.ark.instanceOf;
var valueOf = scopes.ark.valueOf;
var narrow = scopes.ark.narrow;
var morph = scopes.ark.morph;

// index.ts
var util = __toESM(require("util"));
var commentLabel = "ghs-comments";
var types = scope({
  config: {
    contentPath: "string>1",
    // commentTitleHandlebars for the issue title
    issueTitleHandlebars: "string>1",
    // commentHandlebars template defines the template for creating the body
    // of a comment
    issueBodyHandlebars: "string>1"
  },
  contentItem: {
    id: "0<string<51",
    title: "0<string<255",
    url: "0<string<2048"
  },
  siteConfig: {
    content: "contentItem[]"
  }
}).compile();
main();
function main() {
  if (process.env.LOCAL_DEV) {
    return localDev().catch((e) => {
      console.error("unexpected error", util.inspect(e, false, 10));
      process.exitCode = 1;
    });
  }
  throw Error("todo");
}
async function localDev() {
  process.env.GITHUB_ACTION = "true";
  process.env["INPUT_ISSUE-BODY-HANDLEBARS"] = `The comment thread for [{{title}}]({{url}}). Leave a comment below and it'll appear on the site in a few minutes.`;
  process.env["INPUT_ISSUE-TITLE-HANDLEBARS"] = `Comments for '{{title}}'`;
  return await action();
}
function must(contentItem) {
  if (contentItem.problems) {
    throw Error("parse error: " + contentItem.problems.join(","));
  }
  return contentItem.data;
}
async function action() {
  const bodyTpl = core.getInput("issue-body-handlebars");
  const titleTpl = core.getInput("issue-title-handlebars");
  const input = must(types.config({
    contentPath: core.getInput("content-path"),
    issueBodyHandlebars: bodyTpl,
    issueTitleHandlebars: titleTpl
  }));
  const jsonStr = import_fs.default.readFileSync(input.contentPath, { encoding: "utf8" });
  const configRaw = JSON.parse(jsonStr);
  const siteConfig = must(types.siteConfig(configRaw));
  return await synchronise(
    siteConfig,
    input
  );
}
async function synchronise(site, config) {
  const api = new import_action.Octokit();
  const repoNWO = process.env.GITHUB_REPOSITORY;
  if (!repoNWO)
    throw Error("GITHUB_REPOSITORY unset");
  const parts = repoNWO.split("/");
  if (parts.length !== 2)
    throw Error("unexpected GITHUB_REPOSITORY value");
  const [owner = "", repoName = ""] = parts;
  const issues = await api.issues.listForRepo({
    owner,
    repo: repoName,
    labels: commentLabel,
    state: "open"
  });
  const issuesOnly = issues.data.filter((i) => !i.pull_request);
  const byId = issuesOnly.reduce((a, i) => {
    const pathLabels = i.labels.map((l) => (typeof l === "string" ? l : l.name) || "");
    const hasId = pathLabels.find((p) => p.startsWith("id:"));
    if (!hasId) {
      return a;
    }
    const idValue = hasId.replace(/^id:/, "");
    a[idValue] = i;
    return a;
  }, {});
  const missing = site.content.filter((p) => !byId[p.id]);
  mustache.parse(config.issueTitleHandlebars);
  mustache.parse(config.issueBodyHandlebars);
  const createInputAndErrors = missing.map((item) => {
    try {
      return {
        title: mustache.render(config.issueTitleHandlebars, item),
        body: mustache.render(config.issueBodyHandlebars, item),
        labels: [
          commentLabel,
          `id:${item.id}`
        ]
      };
    } catch (e) {
      return e instanceof Error ? e : Error(`${e}`);
    }
  });
  const errs = createInputAndErrors.filter((a) => a instanceof Error);
  if (errs.length) {
    console.error("failed to generate issues: ", errs.join("\n"));
    process.exit(1);
  }
  const createInputs = createInputAndErrors.filter((a) => !(a instanceof Error));
  async function createIssues() {
    for (const input of createInputs) {
      const res = await api.issues.create({
        repo: repoName,
        owner,
        title: input.title,
        body: input.body,
        labels: input.labels
      });
      console.log("created comment issue", {
        title: input.title,
        url: res.data.html_url
      });
      byId[res.data.id] = res.data;
    }
  }
  console.log("generating issues for", createInputs.length, "content items");
  await createIssues();
  console.log("downloading and caching issues for site build");
  const comments = await api.issues.listCommentsForRepo({
    repo: repoName,
    owner,
    per_page: 100
  });
  const commentsByIssueID = /* @__PURE__ */ new Map();
  for (const cmt of comments.data) {
    if (!commentsByIssueID.has(cmt.issue_url)) {
      commentsByIssueID.set(cmt.issue_url, []);
    }
    commentsByIssueID.get(cmt.issue_url).push(cmt);
  }
  for (const [path, issue] of Object.entries(byId)) {
    import_fs.default.writeFileSync(`./cache/${issue.node_id}.json`, JSON.stringify({
      id: path,
      issue,
      comments: commentsByIssueID.get(issue.url) || []
    }, null, 4), { encoding: "utf-8" });
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  types
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vaW5kZXgudHMiLCAiLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Fya3R5cGUvZGlzdC9tanMvdXRpbHMvZXJyb3JzLmpzIiwgIi4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9hcmt0eXBlL2Rpc3QvbWpzL3V0aWxzL2RvbWFpbnMuanMiLCAiLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Fya3R5cGUvZGlzdC9tanMvdXRpbHMvZ2VuZXJpY3MuanMiLCAiLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Fya3R5cGUvZGlzdC9tanMvdXRpbHMvcGF0aHMuanMiLCAiLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Fya3R5cGUvZGlzdC9tanMvdXRpbHMvbnVtZXJpY0xpdGVyYWxzLmpzIiwgIi4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9hcmt0eXBlL2Rpc3QvbWpzL3V0aWxzL3NlcmlhbGl6ZS5qcyIsICIuLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvYXJrdHlwZS9kaXN0L21qcy9ub2Rlcy9jb21wb3NlLmpzIiwgIi4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9hcmt0eXBlL2Rpc3QvbWpzL3BhcnNlL2FzdC9pbnRlcnNlY3Rpb24uanMiLCAiLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Fya3R5cGUvZGlzdC9tanMvdXRpbHMvb2JqZWN0S2luZHMuanMiLCAiLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Fya3R5cGUvZGlzdC9tanMvbm9kZXMvcnVsZXMvY2xhc3MuanMiLCAiLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Fya3R5cGUvZGlzdC9tanMvbm9kZXMvcnVsZXMvY29sbGFwc2libGVTZXQuanMiLCAiLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Fya3R5cGUvZGlzdC9tanMvbm9kZXMvcnVsZXMvZGl2aXNvci5qcyIsICIuLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvYXJrdHlwZS9kaXN0L21qcy9ub2Rlcy9ydWxlcy9wcm9wcy5qcyIsICIuLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvYXJrdHlwZS9kaXN0L21qcy91dGlscy9kYXRhLmpzIiwgIi4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9hcmt0eXBlL2Rpc3QvbWpzL25vZGVzL3J1bGVzL3JhbmdlLmpzIiwgIi4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9hcmt0eXBlL2Rpc3QvbWpzL25vZGVzL3J1bGVzL3JlZ2V4LmpzIiwgIi4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9hcmt0eXBlL2Rpc3QvbWpzL25vZGVzL3J1bGVzL3J1bGVzLmpzIiwgIi4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9hcmt0eXBlL2Rpc3QvbWpzL25vZGVzL2JyYW5jaC5qcyIsICIuLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvYXJrdHlwZS9kaXN0L21qcy9wYXJzZS9hc3QvdW5pb24uanMiLCAiLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Fya3R5cGUvZGlzdC9tanMvbm9kZXMvZGlzY3JpbWluYXRlLmpzIiwgIi4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9hcmt0eXBlL2Rpc3QvbWpzL25vZGVzL3ByZWRpY2F0ZS5qcyIsICIuLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvYXJrdHlwZS9kaXN0L21qcy9ub2Rlcy9ub2RlLmpzIiwgIi4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9hcmt0eXBlL2Rpc3QvbWpzL3BhcnNlL3N0cmluZy9zaGlmdC9zY2FubmVyLmpzIiwgIi4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9hcmt0eXBlL2Rpc3QvbWpzL3RyYXZlcnNlL3Byb2JsZW1zLmpzIiwgIi4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9hcmt0eXBlL2Rpc3QvbWpzL3RyYXZlcnNlL3RyYXZlcnNlLmpzIiwgIi4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9hcmt0eXBlL2Rpc3QvbWpzL3V0aWxzL2NoYWluYWJsZU5vT3BQcm94eS5qcyIsICIuLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvYXJrdHlwZS9kaXN0L21qcy9zY29wZXMvdHlwZS5qcyIsICIuLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvYXJrdHlwZS9kaXN0L21qcy9wYXJzZS9zdHJpbmcvc2hpZnQvb3BlcmFuZC91bmVuY2xvc2VkLmpzIiwgIi4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9hcmt0eXBlL2Rpc3QvbWpzL3BhcnNlL2FzdC9jb25maWcuanMiLCAiLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Fya3R5cGUvZGlzdC9tanMvdXRpbHMvZnJlZXplLmpzIiwgIi4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9hcmt0eXBlL2Rpc3QvbWpzL3BhcnNlL2FzdC9rZXlvZi5qcyIsICIuLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvYXJrdHlwZS9kaXN0L21qcy9wYXJzZS9hc3QvbW9ycGguanMiLCAiLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Fya3R5cGUvZGlzdC9tanMvcGFyc2UvYXN0L2Rpc3RyaWJ1dGFibGVGdW5jdGlvbi5qcyIsICIuLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvYXJrdHlwZS9kaXN0L21qcy9wYXJzZS9hc3QvbmFycm93LmpzIiwgIi4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9hcmt0eXBlL2Rpc3QvbWpzL3BhcnNlL2FzdC90dXBsZS5qcyIsICIuLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvYXJrdHlwZS9kaXN0L21qcy9wYXJzZS9yZWNvcmQuanMiLCAiLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Fya3R5cGUvZGlzdC9tanMvcGFyc2Uvc3RyaW5nL3JlZHVjZS9zaGFyZWQuanMiLCAiLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Fya3R5cGUvZGlzdC9tanMvcGFyc2Uvc3RyaW5nL3JlZHVjZS9keW5hbWljLmpzIiwgIi4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9hcmt0eXBlL2Rpc3QvbWpzL3BhcnNlL3N0cmluZy9zaGlmdC9vcGVyYW5kL2VuY2xvc2VkLmpzIiwgIi4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9hcmt0eXBlL2Rpc3QvbWpzL3BhcnNlL3N0cmluZy9zaGlmdC9vcGVyYW5kL29wZXJhbmQuanMiLCAiLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Fya3R5cGUvZGlzdC9tanMvcGFyc2UvYXN0L2JvdW5kLmpzIiwgIi4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9hcmt0eXBlL2Rpc3QvbWpzL3BhcnNlL3N0cmluZy9zaGlmdC9vcGVyYXRvci9ib3VuZHMuanMiLCAiLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Fya3R5cGUvZGlzdC9tanMvcGFyc2UvYXN0L2Rpdmlzb3IuanMiLCAiLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Fya3R5cGUvZGlzdC9tanMvcGFyc2Uvc3RyaW5nL3NoaWZ0L29wZXJhdG9yL2Rpdmlzb3IuanMiLCAiLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Fya3R5cGUvZGlzdC9tanMvcGFyc2Uvc3RyaW5nL3NoaWZ0L29wZXJhdG9yL29wZXJhdG9yLmpzIiwgIi4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9hcmt0eXBlL2Rpc3QvbWpzL3BhcnNlL3N0cmluZy9zdHJpbmcuanMiLCAiLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Fya3R5cGUvZGlzdC9tanMvcGFyc2UvZGVmaW5pdGlvbi5qcyIsICIuLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvYXJrdHlwZS9kaXN0L21qcy9zY29wZXMvY2FjaGUuanMiLCAiLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Fya3R5cGUvZGlzdC9tanMvc2NvcGVzL3Njb3BlLmpzIiwgIi4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9hcmt0eXBlL2Rpc3QvbWpzL3Njb3Blcy9qc09iamVjdHMuanMiLCAiLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Fya3R5cGUvZGlzdC9tanMvc2NvcGVzL3RzS2V5d29yZHMuanMiLCAiLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Fya3R5cGUvZGlzdC9tanMvc2NvcGVzL3ZhbGlkYXRpb24vY3JlZGl0Q2FyZC5qcyIsICIuLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvYXJrdHlwZS9kaXN0L21qcy9zY29wZXMvdmFsaWRhdGlvbi9kYXRlLmpzIiwgIi4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9hcmt0eXBlL2Rpc3QvbWpzL3Njb3Blcy92YWxpZGF0aW9uL3ZhbGlkYXRpb24uanMiLCAiLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Fya3R5cGUvZGlzdC9tanMvc2NvcGVzL2Fyay5qcyIsICIuLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvYXJrdHlwZS9kaXN0L21qcy9zY29wZXMvZXhwcmVzc2lvbnMuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImltcG9ydCB7T2N0b2tpdH0gZnJvbSBcIkBvY3Rva2l0L2FjdGlvblwiXG5pbXBvcnQgKiBhcyBjb3JlIGZyb20gXCJAYWN0aW9ucy9jb3JlXCJcbmltcG9ydCBmcyBmcm9tIFwiZnNcIlxuaW1wb3J0IHtHZXRSZXNwb25zZURhdGFUeXBlRnJvbUVuZHBvaW50TWV0aG9kLH0gZnJvbSBcIkBvY3Rva2l0L3R5cGVzXCJcbmltcG9ydCAqIGFzIG11c3RhY2hlIGZyb20gXCJtdXN0YWNoZVwiXG5pbXBvcnQge3Njb3BlfSBmcm9tIFwiYXJrdHlwZVwiO1xuaW1wb3J0IHtDaGVja1Jlc3VsdH0gZnJvbSBcImFya3R5cGUvZGlzdC90eXBlcy90cmF2ZXJzZS90cmF2ZXJzZVwiO1xuaW1wb3J0ICogYXMgdXRpbCBmcm9tIFwidXRpbFwiO1xuXG5jb25zdCBjb21tZW50TGFiZWwgPSAnZ2hzLWNvbW1lbnRzJyBhcyBjb25zdDtcblxuZXhwb3J0IGNvbnN0IHR5cGVzID0gc2NvcGUoe1xuICBjb25maWc6IHtcbiAgICBjb250ZW50UGF0aDogJ3N0cmluZz4xJyxcbiAgICAvLyBjb21tZW50VGl0bGVIYW5kbGViYXJzIGZvciB0aGUgaXNzdWUgdGl0bGVcbiAgICBpc3N1ZVRpdGxlSGFuZGxlYmFyczogJ3N0cmluZz4xJyxcbiAgICAvLyBjb21tZW50SGFuZGxlYmFycyB0ZW1wbGF0ZSBkZWZpbmVzIHRoZSB0ZW1wbGF0ZSBmb3IgY3JlYXRpbmcgdGhlIGJvZHlcbiAgICAvLyBvZiBhIGNvbW1lbnRcbiAgICBpc3N1ZUJvZHlIYW5kbGViYXJzOiAnc3RyaW5nPjEnXG4gIH0sXG4gIGNvbnRlbnRJdGVtOiB7XG4gICAgaWQ6ICcwPHN0cmluZzw1MScsXG4gICAgdGl0bGU6ICcwPHN0cmluZzwyNTUnLFxuICAgIHVybDogJzA8c3RyaW5nPDIwNDgnLFxuICB9LFxuICBzaXRlQ29uZmlnOiB7XG4gICAgY29udGVudDogJ2NvbnRlbnRJdGVtW10nLFxuICB9LFxufSkuY29tcGlsZSgpXG5cbmV4cG9ydCB0eXBlIENvbnRlbnRJdGVtID0gdHlwZW9mIHR5cGVzLmNvbnRlbnRJdGVtLmluZmVyO1xuZXhwb3J0IHR5cGUgU2l0ZUNvbmZpZyA9IHR5cGVvZiB0eXBlcy5zaXRlQ29uZmlnLmluZmVyO1xuZXhwb3J0IHR5cGUgQ29uZmlnID0gdHlwZW9mIHR5cGVzLmNvbmZpZy5pbmZlclxuXG5cbm1haW4oKTtcblxuZnVuY3Rpb24gbWFpbigpIHtcbiAgaWYgKHByb2Nlc3MuZW52LkxPQ0FMX0RFVikge1xuICAgIHJldHVybiBsb2NhbERldigpXG4gICAgICAuY2F0Y2goZSA9PiB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoXCJ1bmV4cGVjdGVkIGVycm9yXCIsIHV0aWwuaW5zcGVjdChlLCBmYWxzZSwgMTApKVxuICAgICAgICBwcm9jZXNzLmV4aXRDb2RlID0gMTtcbiAgICAgIH0pXG4gIH1cbiAgdGhyb3cgRXJyb3IoXCJ0b2RvXCIpXG59XG5cbnR5cGUgSXNzdWUgPSBHZXRSZXNwb25zZURhdGFUeXBlRnJvbUVuZHBvaW50TWV0aG9kPE9jdG9raXRbXCJpc3N1ZXNcIl1bXCJsaXN0Rm9yUmVwb1wiXT5bbnVtYmVyXTtcbnR5cGUgSXNzdWVDb21tZW50ID0gR2V0UmVzcG9uc2VEYXRhVHlwZUZyb21FbmRwb2ludE1ldGhvZDxPY3Rva2l0W1wiaXNzdWVzXCJdW1wibGlzdENvbW1lbnRzXCJdPltudW1iZXJdO1xuXG5hc3luYyBmdW5jdGlvbiBsb2NhbERldigpIHtcbiAgcHJvY2Vzcy5lbnYuR0lUSFVCX0FDVElPTiA9IFwidHJ1ZVwiO1xuICBwcm9jZXNzLmVudlsnSU5QVVRfSVNTVUUtQk9EWS1IQU5ETEVCQVJTJ10gPSBgVGhlIGNvbW1lbnQgdGhyZWFkIGZvciBbe3t0aXRsZX19XSh7e3VybH19KS4gTGVhdmUgYSBjb21tZW50IGJlbG93IGFuZCBpdCdsbCBhcHBlYXIgb24gdGhlIHNpdGUgaW4gYSBmZXcgbWludXRlcy5gXG4gIHByb2Nlc3MuZW52WydJTlBVVF9JU1NVRS1USVRMRS1IQU5ETEVCQVJTJ10gPSBgQ29tbWVudHMgZm9yICd7e3RpdGxlfX0nYFxuICByZXR1cm4gYXdhaXQgYWN0aW9uKClcbn1cblxuZnVuY3Rpb24gbXVzdDxUPihjb250ZW50SXRlbTogQ2hlY2tSZXN1bHQ8VD4pOiBUIHtcbiAgaWYgKGNvbnRlbnRJdGVtLnByb2JsZW1zKSB7XG4gICAgdGhyb3cgRXJyb3IoXCJwYXJzZSBlcnJvcjogXCIgKyBjb250ZW50SXRlbS5wcm9ibGVtcy5qb2luKFwiLFwiKSlcbiAgfVxuICByZXR1cm4gY29udGVudEl0ZW0uZGF0YVxufVxuXG5hc3luYyBmdW5jdGlvbiBhY3Rpb24oKSB7XG4gIC8vIFRPRE8gaW5wdXRcblxuICBjb25zdCBib2R5VHBsID0gY29yZS5nZXRJbnB1dChcImlzc3VlLWJvZHktaGFuZGxlYmFyc1wiKVxuICBjb25zdCB0aXRsZVRwbCA9IGNvcmUuZ2V0SW5wdXQoXCJpc3N1ZS10aXRsZS1oYW5kbGViYXJzXCIpXG4gIGNvbnN0IGlucHV0ID0gbXVzdCh0eXBlcy5jb25maWcoe1xuICAgIGNvbnRlbnRQYXRoOiBjb3JlLmdldElucHV0KCdjb250ZW50LXBhdGgnKSxcbiAgICBpc3N1ZUJvZHlIYW5kbGViYXJzOiBib2R5VHBsLFxuICAgIGlzc3VlVGl0bGVIYW5kbGViYXJzOiB0aXRsZVRwbCxcbiAgfSkpXG5cbiAgY29uc3QganNvblN0ciA9IGZzLnJlYWRGaWxlU3luYyhpbnB1dC5jb250ZW50UGF0aCwge2VuY29kaW5nOiBcInV0ZjhcIn0pXG4gIGNvbnN0IGNvbmZpZ1JhdyA9IEpTT04ucGFyc2UoanNvblN0cilcbiAgY29uc3Qgc2l0ZUNvbmZpZyA9IG11c3QodHlwZXMuc2l0ZUNvbmZpZyhjb25maWdSYXcpKVxuXG4gIHJldHVybiBhd2FpdCBzeW5jaHJvbmlzZShcbiAgICBzaXRlQ29uZmlnLFxuICAgIGlucHV0LFxuICApXG59XG5cbmludGVyZmFjZSBJc3N1ZUNyZWF0ZUlucHV0IHtcbiAgdGl0bGU6IHN0cmluZ1xuICBib2R5OiBzdHJpbmdcbiAgbGFiZWxzOiBzdHJpbmdbXVxufVxuXG5cbmFzeW5jIGZ1bmN0aW9uIHN5bmNocm9uaXNlKFxuICBzaXRlOiBTaXRlQ29uZmlnLFxuICBjb25maWc6IENvbmZpZyxcbikge1xuICBjb25zdCBhcGkgPSBuZXcgT2N0b2tpdCgpXG5cbiAgY29uc3QgcmVwb05XTyA9IHByb2Nlc3MuZW52LkdJVEhVQl9SRVBPU0lUT1JZO1xuICBpZiAoIXJlcG9OV08pIHRocm93IEVycm9yKFwiR0lUSFVCX1JFUE9TSVRPUlkgdW5zZXRcIilcbiAgY29uc3QgcGFydHMgPSByZXBvTldPLnNwbGl0KFwiL1wiKTtcbiAgaWYgKHBhcnRzLmxlbmd0aCAhPT0gMikgdGhyb3cgRXJyb3IoXCJ1bmV4cGVjdGVkIEdJVEhVQl9SRVBPU0lUT1JZIHZhbHVlXCIpXG4gIGNvbnN0IFtvd25lciA9IFwiXCIsIHJlcG9OYW1lID0gXCJcIl0gPSBwYXJ0cztcblxuICBjb25zdCBpc3N1ZXMgPSBhd2FpdCBhcGkuaXNzdWVzLmxpc3RGb3JSZXBvKHtcbiAgICBvd25lcixcbiAgICByZXBvOiByZXBvTmFtZSxcbiAgICBsYWJlbHM6IGNvbW1lbnRMYWJlbCxcbiAgICBzdGF0ZTogXCJvcGVuXCIsXG4gIH0pO1xuXG4gIGNvbnN0IGlzc3Vlc09ubHkgPSBpc3N1ZXMuZGF0YS5maWx0ZXIoaSA9PiAhaS5wdWxsX3JlcXVlc3QpO1xuXG4gIGNvbnN0IGJ5SWQgPSBpc3N1ZXNPbmx5LnJlZHVjZSgoYSwgaSkgPT4ge1xuICAgIGNvbnN0IHBhdGhMYWJlbHMgPSBpLmxhYmVscy5tYXAobCA9PlxuICAgICAgKHR5cGVvZiBsID09PSBcInN0cmluZ1wiID8gbCA6IGwubmFtZSkgfHwgXCJcIik7XG4gICAgY29uc3QgaGFzSWQgPSBwYXRoTGFiZWxzLmZpbmQocCA9PiBwLnN0YXJ0c1dpdGgoXCJpZDpcIikpO1xuICAgIGlmICghaGFzSWQpIHtcbiAgICAgIHJldHVybiBhXG4gICAgfVxuICAgIGNvbnN0IGlkVmFsdWUgPSBoYXNJZC5yZXBsYWNlKC9eaWQ6LywgXCJcIilcbiAgICBhW2lkVmFsdWVdID0gaTtcbiAgICByZXR1cm4gYTtcbiAgfSwge30gYXMgeyBbazogc3RyaW5nXTogSXNzdWUgfSk7XG5cbiAgY29uc3QgbWlzc2luZyA9IHNpdGUuY29udGVudC5maWx0ZXIocCA9PiAhYnlJZFtwLmlkXSk7XG5cbiAgbXVzdGFjaGUucGFyc2UoY29uZmlnLmlzc3VlVGl0bGVIYW5kbGViYXJzKTtcbiAgbXVzdGFjaGUucGFyc2UoY29uZmlnLmlzc3VlQm9keUhhbmRsZWJhcnMpO1xuXG4gIGNvbnN0IGNyZWF0ZUlucHV0QW5kRXJyb3JzID0gbWlzc2luZy5tYXAoKGl0ZW0pOiBFcnJvciB8IElzc3VlQ3JlYXRlSW5wdXQgPT4ge1xuICAgIHRyeSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICB0aXRsZTogbXVzdGFjaGUucmVuZGVyKGNvbmZpZy5pc3N1ZVRpdGxlSGFuZGxlYmFycywgaXRlbSksXG4gICAgICAgIGJvZHk6IG11c3RhY2hlLnJlbmRlcihjb25maWcuaXNzdWVCb2R5SGFuZGxlYmFycywgaXRlbSksXG4gICAgICAgIGxhYmVsczogW1xuICAgICAgICAgIGNvbW1lbnRMYWJlbCxcbiAgICAgICAgICBgaWQ6JHtpdGVtLmlkfWAsXG4gICAgICAgIF0sXG4gICAgICB9O1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIHJldHVybiBlIGluc3RhbmNlb2YgRXJyb3IgPyBlIDogRXJyb3IoYCR7ZX1gKVxuICAgIH1cbiAgfSk7XG5cbiAgY29uc3QgZXJycyA9IGNyZWF0ZUlucHV0QW5kRXJyb3JzLmZpbHRlcihhID0+IGEgaW5zdGFuY2VvZiBFcnJvcilcbiAgaWYgKGVycnMubGVuZ3RoKSB7XG4gICAgY29uc29sZS5lcnJvcihcImZhaWxlZCB0byBnZW5lcmF0ZSBpc3N1ZXM6IFwiLCBlcnJzLmpvaW4oXCJcXG5cIikpXG4gICAgcHJvY2Vzcy5leGl0KDEpXG4gIH1cblxuICBjb25zdCBjcmVhdGVJbnB1dHMgPSBjcmVhdGVJbnB1dEFuZEVycm9ycy5maWx0ZXIoKGEpOiBhIGlzIElzc3VlQ3JlYXRlSW5wdXQgPT4gIShhIGluc3RhbmNlb2YgRXJyb3IpKVxuXG4gIGFzeW5jIGZ1bmN0aW9uIGNyZWF0ZUlzc3VlcygpIHtcbiAgICBmb3IgKGNvbnN0IGlucHV0IG9mIGNyZWF0ZUlucHV0cykge1xuICAgICAgY29uc3QgcmVzID0gYXdhaXQgYXBpLmlzc3Vlcy5jcmVhdGUoe1xuICAgICAgICByZXBvOiByZXBvTmFtZSxcbiAgICAgICAgb3duZXIsXG4gICAgICAgIHRpdGxlOiBpbnB1dC50aXRsZSxcbiAgICAgICAgYm9keTogaW5wdXQuYm9keSxcbiAgICAgICAgbGFiZWxzOiBpbnB1dC5sYWJlbHMsXG4gICAgICB9KVxuICAgICAgY29uc29sZS5sb2coXCJjcmVhdGVkIGNvbW1lbnQgaXNzdWVcIiwge1xuICAgICAgICB0aXRsZTogaW5wdXQudGl0bGUsXG4gICAgICAgIHVybDogcmVzLmRhdGEuaHRtbF91cmwsXG4gICAgICB9KVxuICAgICAgLy8gc3RvcmUgaXNzdWUgc28gd2UgY2FuIGNhY2hlIGl0IGJlbG93XG4gICAgICBieUlkW3Jlcy5kYXRhLmlkXSA9IHJlcy5kYXRhO1xuICAgIH1cbiAgfVxuXG4gIGNvbnNvbGUubG9nKFwiZ2VuZXJhdGluZyBpc3N1ZXMgZm9yXCIsIGNyZWF0ZUlucHV0cy5sZW5ndGgsIFwiY29udGVudCBpdGVtc1wiKVxuXG4gIGF3YWl0IGNyZWF0ZUlzc3VlcygpXG5cbiAgY29uc29sZS5sb2coXCJkb3dubG9hZGluZyBhbmQgY2FjaGluZyBpc3N1ZXMgZm9yIHNpdGUgYnVpbGRcIilcblxuICAvLyBUT0RPIHBhZ2luYXRpb25cbiAgY29uc3QgY29tbWVudHMgPSBhd2FpdCBhcGkuaXNzdWVzLmxpc3RDb21tZW50c0ZvclJlcG8oe1xuICAgIHJlcG86IHJlcG9OYW1lLFxuICAgIG93bmVyLFxuICAgIHBlcl9wYWdlOiAxMDAsXG4gIH0pO1xuXG4gIGNvbnN0IGNvbW1lbnRzQnlJc3N1ZUlEID0gbmV3IE1hcDxzdHJpbmcsIElzc3VlQ29tbWVudFtdPigpXG5cbiAgZm9yIChjb25zdCBjbXQgb2YgY29tbWVudHMuZGF0YSkge1xuICAgIGlmICghY29tbWVudHNCeUlzc3VlSUQuaGFzKGNtdC5pc3N1ZV91cmwpKSB7XG4gICAgICBjb21tZW50c0J5SXNzdWVJRC5zZXQoY210Lmlzc3VlX3VybCwgW10pO1xuICAgIH1cbiAgICBjb21tZW50c0J5SXNzdWVJRC5nZXQoY210Lmlzc3VlX3VybCkhLnB1c2goY210KVxuICB9XG5cbiAgZm9yIChjb25zdCBbcGF0aCwgaXNzdWVdIG9mIE9iamVjdC5lbnRyaWVzKGJ5SWQpKSB7XG4gICAgZnMud3JpdGVGaWxlU3luYyhgLi9jYWNoZS8ke2lzc3VlLm5vZGVfaWR9Lmpzb25gLCBKU09OLnN0cmluZ2lmeSh7XG4gICAgICBpZDogcGF0aCxcbiAgICAgIGlzc3VlLFxuICAgICAgY29tbWVudHM6IGNvbW1lbnRzQnlJc3N1ZUlELmdldChpc3N1ZS51cmwpIHx8IFtdLFxuICAgIH0sIG51bGwsIDQpLCB7ZW5jb2Rpbmc6IFwidXRmLThcIn0pXG4gIH1cbn1cblxuXG5leHBvcnQgaW50ZXJmYWNlIENhY2hlZFJlc3BvbnNlIHtcbiAgaWQ6IHN0cmluZ1xuICBpc3N1ZTogSXNzdWVcbiAgY29tbWVudHM6IElzc3VlQ29tbWVudFtdXG59XG5cblxuLy8gVjI6IHN0b3JhZ2Vcbi8vIHN0b3JhZ2U6XG4vLyAtIHVzZSBhIGRldGFjaGVkIGJyYW5jaFxuLy8gLSB1c2UgZ2l0aHViIGFjdGlvbnMgYnVpbGQgY2FjaGVzIChoYXJkZXIgdG8gZGV2ZWxvcCBsb2NhbGx5KVxuIiwgImV4cG9ydCBjbGFzcyBJbnRlcm5hbEFya3R5cGVFcnJvciBleHRlbmRzIEVycm9yIHtcbn1cbmV4cG9ydCBjb25zdCB0aHJvd0ludGVybmFsRXJyb3IgPSAobWVzc2FnZSk9PntcbiAgICB0aHJvdyBuZXcgSW50ZXJuYWxBcmt0eXBlRXJyb3IobWVzc2FnZSk7XG59O1xuZXhwb3J0IGNsYXNzIFBhcnNlRXJyb3IgZXh0ZW5kcyBFcnJvciB7XG59XG5leHBvcnQgY29uc3QgdGhyb3dQYXJzZUVycm9yID0gKG1lc3NhZ2UpPT57XG4gICAgdGhyb3cgbmV3IFBhcnNlRXJyb3IobWVzc2FnZSk7XG59O1xuIiwgImV4cG9ydCBjb25zdCBoYXNEb21haW4gPSAoZGF0YSwgZG9tYWluKT0+ZG9tYWluT2YoZGF0YSkgPT09IGRvbWFpbjtcbmV4cG9ydCBjb25zdCBkb21haW5PZiA9IChkYXRhKT0+e1xuICAgIGNvbnN0IGJ1aWx0aW5UeXBlID0gdHlwZW9mIGRhdGE7XG4gICAgcmV0dXJuIGJ1aWx0aW5UeXBlID09PSBcIm9iamVjdFwiID8gZGF0YSA9PT0gbnVsbCA/IFwibnVsbFwiIDogXCJvYmplY3RcIiA6IGJ1aWx0aW5UeXBlID09PSBcImZ1bmN0aW9uXCIgPyBcIm9iamVjdFwiIDogYnVpbHRpblR5cGU7XG59O1xuLyoqIEVhY2ggZG9tYWluJ3MgY29tcGxldGlvbiBmb3IgdGhlIHBocmFzZSBcIk11c3QgYmUgX19fX19cIiAqLyBleHBvcnQgY29uc3QgZG9tYWluRGVzY3JpcHRpb25zID0ge1xuICAgIGJpZ2ludDogXCJhIGJpZ2ludFwiLFxuICAgIGJvb2xlYW46IFwiYm9vbGVhblwiLFxuICAgIG51bGw6IFwibnVsbFwiLFxuICAgIG51bWJlcjogXCJhIG51bWJlclwiLFxuICAgIG9iamVjdDogXCJhbiBvYmplY3RcIixcbiAgICBzdHJpbmc6IFwiYSBzdHJpbmdcIixcbiAgICBzeW1ib2w6IFwiYSBzeW1ib2xcIixcbiAgICB1bmRlZmluZWQ6IFwidW5kZWZpbmVkXCJcbn07XG4iLCAiaW1wb3J0IHsgaGFzRG9tYWluIH0gZnJvbSBcIi4vZG9tYWlucy5qc1wiO1xuZXhwb3J0IGNvbnN0IGFzQ29uc3QgPSAodCk9PnQ7XG5leHBvcnQgY29uc3QgaXNLZXlPZiA9IChrLCBvYmopPT5rIGluIG9iajtcbmV4cG9ydCBjb25zdCBlbnRyaWVzT2YgPSAobyk9Pk9iamVjdC5lbnRyaWVzKG8pO1xuZXhwb3J0IGNvbnN0IG9iamVjdEtleXNPZiA9IChvKT0+T2JqZWN0LmtleXMobyk7XG4vKiogTWltaWNzIG91dHB1dCBvZiBUUydzIGtleW9mIG9wZXJhdG9yIGF0IHJ1bnRpbWUgKi8gZXhwb3J0IGNvbnN0IHByb3RvdHlwZUtleXNPZiA9ICh2YWx1ZSk9PntcbiAgICBjb25zdCByZXN1bHQgPSBbXTtcbiAgICB3aGlsZSh2YWx1ZSAhPT0gT2JqZWN0LnByb3RvdHlwZSAmJiB2YWx1ZSAhPT0gbnVsbCAmJiB2YWx1ZSAhPT0gdW5kZWZpbmVkKXtcbiAgICAgICAgZm9yIChjb25zdCBrIG9mIE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHZhbHVlKSl7XG4gICAgICAgICAgICBpZiAoIXJlc3VsdC5pbmNsdWRlcyhrKSkge1xuICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKGspO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGZvciAoY29uc3Qgc3ltYm9sIG9mIE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHModmFsdWUpKXtcbiAgICAgICAgICAgIGlmICghcmVzdWx0LmluY2x1ZGVzKHN5bWJvbCkpIHtcbiAgICAgICAgICAgICAgICByZXN1bHQucHVzaChzeW1ib2wpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHZhbHVlID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKHZhbHVlKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbn07XG5leHBvcnQgY29uc3QgaGFzS2V5ID0gKG8sIGspPT57XG4gICAgY29uc3QgdmFsdWVBdEtleSA9IG8/LltrXTtcbiAgICByZXR1cm4gdmFsdWVBdEtleSAhPT0gdW5kZWZpbmVkICYmIHZhbHVlQXRLZXkgIT09IG51bGw7XG59O1xuZXhwb3J0IGNvbnN0IGhhc1NpbmdsZUtleSA9IChvLCBrKT0+ayBpbiBvICYmIE9iamVjdC5rZXlzKG8pLmxlbmd0aCA9PT0gMTtcbmV4cG9ydCBjb25zdCBrZXlDb3VudCA9IChvKT0+T2JqZWN0LmtleXMobykubGVuZ3RoO1xuZXhwb3J0IGNvbnN0IGhhc0tleXMgPSAodmFsdWUpPT5oYXNEb21haW4odmFsdWUsIFwib2JqZWN0XCIpID8gT2JqZWN0LmtleXModmFsdWUpLmxlbmd0aCAhPT0gMCA6IGZhbHNlO1xuY29uc3QgaWQgPSBTeW1ib2woXCJpZFwiKTtcbmV4cG9ydCBjb25zdCBub21pbmFsID0gKG8sIG5hbWUpPT5PYmplY3QuYXNzaWduKG8sIHtcbiAgICAgICAgW2lkXTogbmFtZVxuICAgIH0pO1xuZXhwb3J0IGNvbnN0IGdldE5vbWluYWxJZCA9IChkYXRhKT0+aGFzRG9tYWluKGRhdGEsIFwib2JqZWN0XCIpICYmIGlkIGluIGRhdGEgPyBkYXRhW2lkXSA6IHVuZGVmaW5lZDtcbmV4cG9ydCBjb25zdCBoYXNOb21pbmFsSWQgPSAoZGF0YSwgbmFtZSk9PmdldE5vbWluYWxJZChkYXRhKSA9PT0gbmFtZTtcbmV4cG9ydCBjb25zdCBsaXN0RnJvbSA9IChkYXRhKT0+QXJyYXkuaXNBcnJheShkYXRhKSA/IGRhdGEgOiBbXG4gICAgICAgIGRhdGFcbiAgICBdO1xuIiwgImV4cG9ydCBjbGFzcyBQYXRoIGV4dGVuZHMgQXJyYXkge1xuICAgIHN0YXRpYyBmcm9tU3RyaW5nKHMsIGRlbGltaXRlciA9IFwiL1wiKSB7XG4gICAgICAgIHJldHVybiBzID09PSBkZWxpbWl0ZXIgPyBuZXcgUGF0aCgpIDogbmV3IFBhdGgoLi4ucy5zcGxpdChkZWxpbWl0ZXIpKTtcbiAgICB9XG4gICAgdG9TdHJpbmcoZGVsaW1pdGVyID0gXCIvXCIpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubGVuZ3RoID8gdGhpcy5qb2luKGRlbGltaXRlcikgOiBkZWxpbWl0ZXI7XG4gICAgfVxufVxuZXhwb3J0IGNvbnN0IGdldFBhdGggPSAocm9vdCwgcGF0aCk9PntcbiAgICBsZXQgcmVzdWx0ID0gcm9vdDtcbiAgICBmb3IgKGNvbnN0IHNlZ21lbnQgb2YgcGF0aCl7XG4gICAgICAgIGlmICh0eXBlb2YgcmVzdWx0ICE9PSBcIm9iamVjdFwiIHx8IHJlc3VsdCA9PT0gbnVsbCkge1xuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgfVxuICAgICAgICByZXN1bHQgPSByZXN1bHRbc2VnbWVudF07XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG59O1xuIiwgImltcG9ydCB7IHRocm93UGFyc2VFcnJvciB9IGZyb20gXCIuL2Vycm9ycy5qc1wiO1xuLyoqXG4gKiBUaGUgZ29hbCBvZiB0aGUgbnVtYmVyIGxpdGVyYWwgYW5kIGJpZ2ludCBsaXRlcmFsIHJlZ3VsYXIgZXhwcmVzc2lvbnMgaXMgdG86XG4gKlxuICogICAxLiBFbnN1cmUgZGVmaW5pdGlvbnMgZm9ybSBhIGJpamVjdGlvbiB3aXRoIHRoZSB2YWx1ZXMgdGhleSByZXByZXNlbnQuXG4gKiAgIDIuIEF0dGVtcHQgdG8gbWlycm9yIFR5cGVTY3JpcHQncyBvd24gZm9ybWF0IGZvciBzdHJpbmdpZmljYXRpb24gb2YgbnVtZXJpY1xuICogICAgICB2YWx1ZXMgc3VjaCB0aGF0IHRoZSByZWdleCBzaG91bGQgbWF0Y2ggYSBnaXZlbiBkZWZpbml0aW9uIGlmIGFueSBvbmx5IGlmXG4gKiAgICAgIGEgcHJlY2lzZSBsaXRlcmFsIHR5cGUgd2lsbCBiZSBpbmZlcnJlZCAoaW4gVFM0LjgrKS5cbiAqLyAvKipcbiAqICBNYXRjaGVzIGEgd2VsbC1mb3JtYXR0ZWQgbnVtZXJpYyBleHByZXNzaW9uIGFjY29yZGluZyB0byB0aGUgZm9sbG93aW5nIHJ1bGVzOlxuICogICAgMS4gTXVzdCBpbmNsdWRlIGFuIGludGVnZXIgcG9ydGlvbiAoaS5lLiAnLjMyMScgbXVzdCBiZSB3cml0dGVuIGFzICcwLjMyMScpXG4gKiAgICAyLiBUaGUgZmlyc3QgZGlnaXQgb2YgdGhlIHZhbHVlIG11c3Qgbm90IGJlIDAsIHVubGVzcyB0aGUgZW50aXJlIGludGVnZXIgcG9ydGlvbiBpcyAwXG4gKiAgICAzLiBJZiB0aGUgdmFsdWUgaW5jbHVkZXMgYSBkZWNpbWFsLCBpdHMgbGFzdCBkaWdpdCBtYXkgbm90IGJlIDBcbiAqICAgIDQuIFRoZSB2YWx1ZSBtYXkgbm90IGJlIFwiLTBcIlxuICovIGV4cG9ydCBjb25zdCB3ZWxsRm9ybWVkTnVtYmVyTWF0Y2hlciA9IC9eKD8hXi0wJCktPyg/OjB8WzEtOV1cXGQqKSg/OlxcLlxcZCpbMS05XSk/JC87XG5jb25zdCBpc1dlbGxGb3JtZWROdW1iZXIgPSAocyk9PndlbGxGb3JtZWROdW1iZXJNYXRjaGVyLnRlc3Qocyk7XG5jb25zdCBudW1iZXJMaWtlTWF0Y2hlciA9IC9eLT9cXGQqXFwuP1xcZCokLztcbmNvbnN0IGlzTnVtYmVyTGlrZSA9IChzKT0+cy5sZW5ndGggIT09IDAgJiYgbnVtYmVyTGlrZU1hdGNoZXIudGVzdChzKTtcbi8qKlxuICogIE1hdGNoZXMgYSB3ZWxsLWZvcm1hdHRlZCBpbnRlZ2VyIGFjY29yZGluZyB0byB0aGUgZm9sbG93aW5nIHJ1bGVzOlxuICogICAgMS4gTXVzdCBiZWdpbiB3aXRoIGFuIGludGVnZXIsIHRoZSBmaXJzdCBkaWdpdCBvZiB3aGljaCBjYW5ub3QgYmUgMCB1bmxlc3MgdGhlIGVudGlyZSB2YWx1ZSBpcyAwXG4gKiAgICAyLiBUaGUgdmFsdWUgbWF5IG5vdCBiZSBcIi0wXCJcbiAqLyBleHBvcnQgY29uc3Qgd2VsbEZvcm1lZEludGVnZXJNYXRjaGVyID0gL14oPzowfCg/Oi0/WzEtOV1cXGQqKSkkLztcbmV4cG9ydCBjb25zdCBpc1dlbGxGb3JtZWRJbnRlZ2VyID0gKHMpPT53ZWxsRm9ybWVkSW50ZWdlck1hdGNoZXIudGVzdChzKTtcbmV4cG9ydCBjb25zdCB3ZWxsRm9ybWVkTm9uTmVnYXRpdmVJbnRlZ2VyTWF0Y2hlciA9IC9eKD86MHwoPzpbMS05XVxcZCopKSQvO1xuY29uc3QgaW50ZWdlckxpa2VNYXRjaGVyID0gL14tP1xcZCskLztcbmNvbnN0IGlzSW50ZWdlckxpa2UgPSAocyk9PmludGVnZXJMaWtlTWF0Y2hlci50ZXN0KHMpO1xuY29uc3QgbnVtZXJpY0xpdGVyYWxEZXNjcmlwdGlvbnMgPSB7XG4gICAgbnVtYmVyOiBcImEgbnVtYmVyXCIsXG4gICAgYmlnaW50OiBcImEgYmlnaW50XCIsXG4gICAgaW50ZWdlcjogXCJhbiBpbnRlZ2VyXCJcbn07XG5leHBvcnQgY29uc3Qgd3JpdGVNYWxmb3JtZWROdW1lcmljTGl0ZXJhbE1lc3NhZ2UgPSAoZGVmLCBraW5kKT0+YCcke2RlZn0nIHdhcyBwYXJzZWQgYXMgJHtudW1lcmljTGl0ZXJhbERlc2NyaXB0aW9uc1traW5kXX0gYnV0IGNvdWxkIG5vdCBiZSBuYXJyb3dlZCB0byBhIGxpdGVyYWwgdmFsdWUuIEF2b2lkIHVubmVjZXNzYXJ5IGxlYWRpbmcgb3IgdHJhaWxpbmcgemVyb3MgYW5kIG90aGVyIGFibm9ybWFsIG5vdGF0aW9uYDtcbmNvbnN0IGlzV2VsbEZvcm1lZCA9IChkZWYsIGtpbmQpPT5raW5kID09PSBcIm51bWJlclwiID8gaXNXZWxsRm9ybWVkTnVtYmVyKGRlZikgOiBpc1dlbGxGb3JtZWRJbnRlZ2VyKGRlZik7XG5jb25zdCBwYXJzZUtpbmQgPSAoZGVmLCBraW5kKT0+a2luZCA9PT0gXCJudW1iZXJcIiA/IE51bWJlcihkZWYpIDogTnVtYmVyLnBhcnNlSW50KGRlZik7XG5jb25zdCBpc0tpbmRMaWtlID0gKGRlZiwga2luZCk9PmtpbmQgPT09IFwibnVtYmVyXCIgPyBpc051bWJlckxpa2UoZGVmKSA6IGlzSW50ZWdlckxpa2UoZGVmKTtcbmV4cG9ydCBjb25zdCB0cnlQYXJzZVdlbGxGb3JtZWROdW1iZXIgPSAodG9rZW4sIGVycm9yT25GYWlsKT0+cGFyc2VXZWxsRm9ybWVkKHRva2VuLCBcIm51bWJlclwiLCBlcnJvck9uRmFpbCk7XG5leHBvcnQgY29uc3QgdHJ5UGFyc2VXZWxsRm9ybWVkSW50ZWdlciA9ICh0b2tlbiwgZXJyb3JPbkZhaWwpPT5wYXJzZVdlbGxGb3JtZWQodG9rZW4sIFwiaW50ZWdlclwiLCBlcnJvck9uRmFpbCk7XG5jb25zdCBwYXJzZVdlbGxGb3JtZWQgPSAodG9rZW4sIGtpbmQsIGVycm9yT25GYWlsKT0+e1xuICAgIGNvbnN0IHZhbHVlID0gcGFyc2VLaW5kKHRva2VuLCBraW5kKTtcbiAgICBpZiAoIU51bWJlci5pc05hTih2YWx1ZSkpIHtcbiAgICAgICAgaWYgKGlzV2VsbEZvcm1lZCh0b2tlbiwga2luZCkpIHtcbiAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoaXNLaW5kTGlrZSh0b2tlbiwga2luZCkpIHtcbiAgICAgICAgICAgIC8vIElmIHRoZSBkZWZpbml0aW9uIGxvb2tzIGxpa2UgdGhlIGNvcnJlY3QgbnVtZXJpYyBraW5kIGJ1dCBpc1xuICAgICAgICAgICAgLy8gbm90IHdlbGwtZm9ybWVkLCBhbHdheXMgdGhyb3cuXG4gICAgICAgICAgICByZXR1cm4gdGhyb3dQYXJzZUVycm9yKHdyaXRlTWFsZm9ybWVkTnVtZXJpY0xpdGVyYWxNZXNzYWdlKHRva2VuLCBraW5kKSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGVycm9yT25GYWlsID8gdGhyb3dQYXJzZUVycm9yKGVycm9yT25GYWlsID09PSB0cnVlID8gYEZhaWxlZCB0byBwYXJzZSAke251bWVyaWNMaXRlcmFsRGVzY3JpcHRpb25zW2tpbmRdfSBmcm9tICcke3Rva2VufSdgIDogZXJyb3JPbkZhaWwpIDogdW5kZWZpbmVkO1xufTtcbmV4cG9ydCBjb25zdCB0cnlQYXJzZVdlbGxGb3JtZWRCaWdpbnQgPSAoZGVmKT0+e1xuICAgIGlmIChkZWZbZGVmLmxlbmd0aCAtIDFdICE9PSBcIm5cIikge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IG1heWJlSW50ZWdlckxpdGVyYWwgPSBkZWYuc2xpY2UoMCwgLTEpO1xuICAgIGxldCB2YWx1ZTtcbiAgICB0cnkge1xuICAgICAgICB2YWx1ZSA9IEJpZ0ludChtYXliZUludGVnZXJMaXRlcmFsKTtcbiAgICB9IGNhdGNoICB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKHdlbGxGb3JtZWRJbnRlZ2VyTWF0Y2hlci50ZXN0KG1heWJlSW50ZWdlckxpdGVyYWwpKSB7XG4gICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9XG4gICAgaWYgKGludGVnZXJMaWtlTWF0Y2hlci50ZXN0KG1heWJlSW50ZWdlckxpdGVyYWwpKSB7XG4gICAgICAgIC8vIElmIHRoZSBkZWZpbml0aW9uIGxvb2tzIGxpa2UgYSBiaWdpbnQgYnV0IGlzXG4gICAgICAgIC8vIG5vdCB3ZWxsLWZvcm1lZCwgdGhyb3cuXG4gICAgICAgIHJldHVybiB0aHJvd1BhcnNlRXJyb3Iod3JpdGVNYWxmb3JtZWROdW1lcmljTGl0ZXJhbE1lc3NhZ2UoZGVmLCBcImJpZ2ludFwiKSk7XG4gICAgfVxufTtcbiIsICJpbXBvcnQgeyBkb21haW5PZiB9IGZyb20gXCIuL2RvbWFpbnMuanNcIjtcbmltcG9ydCB7IGlzS2V5T2YgfSBmcm9tIFwiLi9nZW5lcmljcy5qc1wiO1xuaW1wb3J0IHsgdHJ5UGFyc2VXZWxsRm9ybWVkQmlnaW50LCB0cnlQYXJzZVdlbGxGb3JtZWROdW1iZXIgfSBmcm9tIFwiLi9udW1lcmljTGl0ZXJhbHMuanNcIjtcbmV4cG9ydCBjb25zdCBzbmFwc2hvdCA9IChkYXRhLCBvcHRzID0ge30pPT5zZXJpYWxpemVSZWN1cnNlKGRhdGEsIG9wdHMsIFtdKTtcbmV4cG9ydCBjb25zdCBzdHJpbmdpZnkgPSAoZGF0YSwgaW5kZW50KT0+e1xuICAgIHN3aXRjaChkb21haW5PZihkYXRhKSl7XG4gICAgICAgIGNhc2UgXCJvYmplY3RcIjpcbiAgICAgICAgICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShzZXJpYWxpemVSZWN1cnNlKGRhdGEsIHN0cmluZ2lmeU9wdHMsIFtdKSwgbnVsbCwgaW5kZW50KTtcbiAgICAgICAgY2FzZSBcInN5bWJvbFwiOlxuICAgICAgICAgICAgcmV0dXJuIHN0cmluZ2lmeU9wdHMub25TeW1ib2woZGF0YSk7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICByZXR1cm4gc2VyaWFsaXplUHJpbWl0aXZlKGRhdGEpO1xuICAgIH1cbn07XG5jb25zdCBzdHJpbmdpZnlPcHRzID0ge1xuICAgIG9uQ3ljbGU6ICgpPT5cIihjeWNsZSlcIixcbiAgICBvblN5bWJvbDogKHYpPT5gKHN5bWJvbCR7di5kZXNjcmlwdGlvbiAmJiBgICR7di5kZXNjcmlwdGlvbn1gfSlgLFxuICAgIG9uRnVuY3Rpb246ICh2KT0+YChmdW5jdGlvbiR7di5uYW1lICYmIGAgJHt2Lm5hbWV9YH0pYFxufTtcbmNvbnN0IHNlcmlhbGl6ZVJlY3Vyc2UgPSAoZGF0YSwgY29udGV4dCwgc2Vlbik9PntcbiAgICBzd2l0Y2goZG9tYWluT2YoZGF0YSkpe1xuICAgICAgICBjYXNlIFwib2JqZWN0XCI6XG4gICAgICAgICAgICBpZiAodHlwZW9mIGRhdGEgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgICAgIHJldHVybiBzdHJpbmdpZnlPcHRzLm9uRnVuY3Rpb24oZGF0YSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoc2Vlbi5pbmNsdWRlcyhkYXRhKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBcIihjeWNsZSlcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IG5leHRTZWVuID0gW1xuICAgICAgICAgICAgICAgIC4uLnNlZW4sXG4gICAgICAgICAgICAgICAgZGF0YVxuICAgICAgICAgICAgXTtcbiAgICAgICAgICAgIGlmIChBcnJheS5pc0FycmF5KGRhdGEpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGRhdGEubWFwKChpdGVtKT0+c2VyaWFsaXplUmVjdXJzZShpdGVtLCBjb250ZXh0LCBuZXh0U2VlbikpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0ge307XG4gICAgICAgICAgICBmb3IoY29uc3QgayBpbiBkYXRhKXtcbiAgICAgICAgICAgICAgICByZXN1bHRba10gPSBzZXJpYWxpemVSZWN1cnNlKGRhdGFba10sIGNvbnRleHQsIG5leHRTZWVuKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIGNhc2UgXCJzeW1ib2xcIjpcbiAgICAgICAgICAgIHJldHVybiBzdHJpbmdpZnlPcHRzLm9uU3ltYm9sKGRhdGEpO1xuICAgICAgICBjYXNlIFwiYmlnaW50XCI6XG4gICAgICAgICAgICByZXR1cm4gYCR7ZGF0YX1uYDtcbiAgICAgICAgY2FzZSBcInVuZGVmaW5lZFwiOlxuICAgICAgICAgICAgcmV0dXJuIFwidW5kZWZpbmVkXCI7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICByZXR1cm4gZGF0YTtcbiAgICB9XG59O1xuZXhwb3J0IGNvbnN0IHNlcmlhbGl6ZVByaW1pdGl2ZSA9ICh2YWx1ZSk9PnR5cGVvZiB2YWx1ZSA9PT0gXCJzdHJpbmdcIiA/IGAnJHt2YWx1ZX0nYCA6IHR5cGVvZiB2YWx1ZSA9PT0gXCJiaWdpbnRcIiA/IGAke3ZhbHVlfW5gIDogYCR7dmFsdWV9YDtcbmV4cG9ydCBjb25zdCBkZXNlcmlhbGl6ZVByaW1pdGl2ZSA9IChzZXJpYWxpemVkKT0+aXNLZXlPZihzZXJpYWxpemVkLCBzZXJpYWxpemVkS2V5d29yZHMpID8gc2VyaWFsaXplZEtleXdvcmRzW3NlcmlhbGl6ZWRdIDogc2VyaWFsaXplZFswXSA9PT0gXCInXCIgPyBzZXJpYWxpemVkLnNsaWNlKDEsIC0xKSA6IHRyeVBhcnNlV2VsbEZvcm1lZEJpZ2ludChzZXJpYWxpemVkKSA/PyB0cnlQYXJzZVdlbGxGb3JtZWROdW1iZXIoc2VyaWFsaXplZCwgdHJ1ZSk7XG5jb25zdCBzZXJpYWxpemVkS2V5d29yZHMgPSB7XG4gICAgdHJ1ZTogdHJ1ZSxcbiAgICBmYWxzZTogZmFsc2UsXG4gICAgdW5kZWZpbmVkLFxuICAgIG51bGw6IG51bGxcbn07XG4iLCAiZnVuY3Rpb24gX2NoZWNrUHJpdmF0ZVJlZGVjbGFyYXRpb24ob2JqLCBwcml2YXRlQ29sbGVjdGlvbikge1xuICAgIGlmIChwcml2YXRlQ29sbGVjdGlvbi5oYXMob2JqKSkge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGluaXRpYWxpemUgdGhlIHNhbWUgcHJpdmF0ZSBlbGVtZW50cyB0d2ljZSBvbiBhbiBvYmplY3RcIik7XG4gICAgfVxufVxuZnVuY3Rpb24gX2NsYXNzQXBwbHlEZXNjcmlwdG9yR2V0KHJlY2VpdmVyLCBkZXNjcmlwdG9yKSB7XG4gICAgaWYgKGRlc2NyaXB0b3IuZ2V0KSB7XG4gICAgICAgIHJldHVybiBkZXNjcmlwdG9yLmdldC5jYWxsKHJlY2VpdmVyKTtcbiAgICB9XG4gICAgcmV0dXJuIGRlc2NyaXB0b3IudmFsdWU7XG59XG5mdW5jdGlvbiBfY2xhc3NBcHBseURlc2NyaXB0b3JTZXQocmVjZWl2ZXIsIGRlc2NyaXB0b3IsIHZhbHVlKSB7XG4gICAgaWYgKGRlc2NyaXB0b3Iuc2V0KSB7XG4gICAgICAgIGRlc2NyaXB0b3Iuc2V0LmNhbGwocmVjZWl2ZXIsIHZhbHVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoIWRlc2NyaXB0b3Iud3JpdGFibGUpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJhdHRlbXB0ZWQgdG8gc2V0IHJlYWQgb25seSBwcml2YXRlIGZpZWxkXCIpO1xuICAgICAgICB9XG4gICAgICAgIGRlc2NyaXB0b3IudmFsdWUgPSB2YWx1ZTtcbiAgICB9XG59XG5mdW5jdGlvbiBfY2xhc3NFeHRyYWN0RmllbGREZXNjcmlwdG9yKHJlY2VpdmVyLCBwcml2YXRlTWFwLCBhY3Rpb24pIHtcbiAgICBpZiAoIXByaXZhdGVNYXAuaGFzKHJlY2VpdmVyKSkge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiYXR0ZW1wdGVkIHRvIFwiICsgYWN0aW9uICsgXCIgcHJpdmF0ZSBmaWVsZCBvbiBub24taW5zdGFuY2VcIik7XG4gICAgfVxuICAgIHJldHVybiBwcml2YXRlTWFwLmdldChyZWNlaXZlcik7XG59XG5mdW5jdGlvbiBfY2xhc3NQcml2YXRlRmllbGRHZXQocmVjZWl2ZXIsIHByaXZhdGVNYXApIHtcbiAgICB2YXIgZGVzY3JpcHRvciA9IF9jbGFzc0V4dHJhY3RGaWVsZERlc2NyaXB0b3IocmVjZWl2ZXIsIHByaXZhdGVNYXAsIFwiZ2V0XCIpO1xuICAgIHJldHVybiBfY2xhc3NBcHBseURlc2NyaXB0b3JHZXQocmVjZWl2ZXIsIGRlc2NyaXB0b3IpO1xufVxuZnVuY3Rpb24gX2NsYXNzUHJpdmF0ZUZpZWxkSW5pdChvYmosIHByaXZhdGVNYXAsIHZhbHVlKSB7XG4gICAgX2NoZWNrUHJpdmF0ZVJlZGVjbGFyYXRpb24ob2JqLCBwcml2YXRlTWFwKTtcbiAgICBwcml2YXRlTWFwLnNldChvYmosIHZhbHVlKTtcbn1cbmZ1bmN0aW9uIF9jbGFzc1ByaXZhdGVGaWVsZFNldChyZWNlaXZlciwgcHJpdmF0ZU1hcCwgdmFsdWUpIHtcbiAgICB2YXIgZGVzY3JpcHRvciA9IF9jbGFzc0V4dHJhY3RGaWVsZERlc2NyaXB0b3IocmVjZWl2ZXIsIHByaXZhdGVNYXAsIFwic2V0XCIpO1xuICAgIF9jbGFzc0FwcGx5RGVzY3JpcHRvclNldChyZWNlaXZlciwgZGVzY3JpcHRvciwgdmFsdWUpO1xuICAgIHJldHVybiB2YWx1ZTtcbn1cbmZ1bmN0aW9uIF9kZWZpbmVQcm9wZXJ0eShvYmosIGtleSwgdmFsdWUpIHtcbiAgICBpZiAoa2V5IGluIG9iaikge1xuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqLCBrZXksIHtcbiAgICAgICAgICAgIHZhbHVlOiB2YWx1ZSxcbiAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICAgICAgICB3cml0YWJsZTogdHJ1ZVxuICAgICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBvYmpba2V5XSA9IHZhbHVlO1xuICAgIH1cbiAgICByZXR1cm4gb2JqO1xufVxuaW1wb3J0IHsgdGhyb3dJbnRlcm5hbEVycm9yIH0gZnJvbSBcIi4uL3V0aWxzL2Vycm9ycy5qc1wiO1xuaW1wb3J0IHsgb2JqZWN0S2V5c09mIH0gZnJvbSBcIi4uL3V0aWxzL2dlbmVyaWNzLmpzXCI7XG5pbXBvcnQgeyBQYXRoIH0gZnJvbSBcIi4uL3V0aWxzL3BhdGhzLmpzXCI7XG5pbXBvcnQgeyBzdHJpbmdpZnkgfSBmcm9tIFwiLi4vdXRpbHMvc2VyaWFsaXplLmpzXCI7XG5leHBvcnQgY29uc3QgY29tcG9zZUludGVyc2VjdGlvbiA9IChyZWR1Y2VyKT0+KGwsIHIsIHN0YXRlKT0+bCA9PT0gdW5kZWZpbmVkID8gciA9PT0gdW5kZWZpbmVkID8gdGhyb3dJbnRlcm5hbEVycm9yKHVuZGVmaW5lZE9wZXJhbmRzTWVzc2FnZSkgOiByIDogciA9PT0gdW5kZWZpbmVkID8gbCA6IHJlZHVjZXIobCwgciwgc3RhdGUpO1xuZXhwb3J0IGNvbnN0IHVuZGVmaW5lZE9wZXJhbmRzTWVzc2FnZSA9IGBVbmV4cGVjdGVkIG9wZXJhdGlvbiB0d28gdW5kZWZpbmVkIG9wZXJhbmRzYDtcbmV4cG9ydCBjb25zdCBkaXNqb2ludERlc2NyaXB0aW9uV3JpdGVycyA9IHtcbiAgICBkb21haW46ICh7IGwgLCByICB9KT0+YCR7bC5qb2luKFwiLCBcIil9IGFuZCAke3Iuam9pbihcIiwgXCIpfWAsXG4gICAgcmFuZ2U6ICh7IGwgLCByICB9KT0+YCR7c3RyaW5naWZ5UmFuZ2UobCl9IGFuZCAke3N0cmluZ2lmeVJhbmdlKHIpfWAsXG4gICAgY2xhc3M6ICh7IGwgLCByICB9KT0+YGNsYXNzZXMgJHt0eXBlb2YgbCA9PT0gXCJzdHJpbmdcIiA/IGwgOiBsLm5hbWV9IGFuZCAke3R5cGVvZiByID09PSBcInN0cmluZ1wiID8gciA6IHIubmFtZX1gLFxuICAgIHR1cGxlTGVuZ3RoOiAoeyBsICwgciAgfSk9PmB0dXBsZXMgb2YgbGVuZ3RoICR7bH0gYW5kICR7cn1gLFxuICAgIHZhbHVlOiAoeyBsICwgciAgfSk9PmBsaXRlcmFsIHZhbHVlcyAke3N0cmluZ2lmeShsKX0gYW5kICR7c3RyaW5naWZ5KHIpfWAsXG4gICAgbGVmdEFzc2lnbmFiaWxpdHk6ICh7IGwgLCByICB9KT0+YGxpdGVyYWwgdmFsdWUgJHtzdHJpbmdpZnkobC52YWx1ZSl9IGFuZCAke3N0cmluZ2lmeShyKX1gLFxuICAgIHJpZ2h0QXNzaWduYWJpbGl0eTogKHsgbCAsIHIgIH0pPT5gbGl0ZXJhbCB2YWx1ZSAke3N0cmluZ2lmeShyLnZhbHVlKX0gYW5kICR7c3RyaW5naWZ5KGwpfWAsXG4gICAgdW5pb246ICh7IGwgLCByICB9KT0+YGJyYW5jaGVzICR7c3RyaW5naWZ5KGwpfSBhbmQgYnJhbmNoZXMgJHtzdHJpbmdpZnkocil9YFxufTtcbmV4cG9ydCBjb25zdCBzdHJpbmdpZnlSYW5nZSA9IChyYW5nZSk9PlwibGltaXRcIiBpbiByYW5nZSA/IGB0aGUgcmFuZ2Ugb2YgZXhhY3RseSAke3JhbmdlLmxpbWl0fWAgOiByYW5nZS5taW4gPyByYW5nZS5tYXggPyBgdGhlIHJhbmdlIGJvdW5kZWQgYnkgJHtyYW5nZS5taW4uY29tcGFyYXRvcn0ke3JhbmdlLm1pbi5saW1pdH0gYW5kICR7cmFuZ2UubWF4LmNvbXBhcmF0b3J9JHtyYW5nZS5tYXgubGltaXR9YCA6IGAke3JhbmdlLm1pbi5jb21wYXJhdG9yfSR7cmFuZ2UubWluLmxpbWl0fWAgOiByYW5nZS5tYXggPyBgJHtyYW5nZS5tYXguY29tcGFyYXRvcn0ke3JhbmdlLm1heC5saW1pdH1gIDogXCJ0aGUgdW5ib3VuZGVkIHJhbmdlXCI7XG52YXIgX2Rpc2pvaW50cyA9IC8qI19fUFVSRV9fKi8gbmV3IFdlYWtNYXAoKTtcbmV4cG9ydCBjbGFzcyBJbnRlcnNlY3Rpb25TdGF0ZSB7XG4gICAgZ2V0IGRpc2pvaW50cygpIHtcbiAgICAgICAgcmV0dXJuIF9jbGFzc1ByaXZhdGVGaWVsZEdldCh0aGlzLCBfZGlzam9pbnRzKTtcbiAgICB9XG4gICAgYWRkRGlzam9pbnQoa2luZCwgbCwgcikge1xuICAgICAgICBfY2xhc3NQcml2YXRlRmllbGRHZXQodGhpcywgX2Rpc2pvaW50cylbYCR7dGhpcy5wYXRofWBdID0ge1xuICAgICAgICAgICAga2luZCxcbiAgICAgICAgICAgIGwsXG4gICAgICAgICAgICByXG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiBlbXB0eTtcbiAgICB9XG4gICAgY29uc3RydWN0b3IodHlwZSwgbGFzdE9wZXJhdG9yKXtcbiAgICAgICAgX2RlZmluZVByb3BlcnR5KHRoaXMsIFwidHlwZVwiLCB2b2lkIDApO1xuICAgICAgICBfZGVmaW5lUHJvcGVydHkodGhpcywgXCJsYXN0T3BlcmF0b3JcIiwgdm9pZCAwKTtcbiAgICAgICAgX2RlZmluZVByb3BlcnR5KHRoaXMsIFwicGF0aFwiLCB2b2lkIDApO1xuICAgICAgICBfZGVmaW5lUHJvcGVydHkodGhpcywgXCJkb21haW5cIiwgdm9pZCAwKTtcbiAgICAgICAgX2NsYXNzUHJpdmF0ZUZpZWxkSW5pdCh0aGlzLCBfZGlzam9pbnRzLCB7XG4gICAgICAgICAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICAgICAgICAgIHZhbHVlOiB2b2lkIDBcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMudHlwZSA9IHR5cGU7XG4gICAgICAgIHRoaXMubGFzdE9wZXJhdG9yID0gbGFzdE9wZXJhdG9yO1xuICAgICAgICB0aGlzLnBhdGggPSBuZXcgUGF0aCgpO1xuICAgICAgICBfY2xhc3NQcml2YXRlRmllbGRTZXQodGhpcywgX2Rpc2pvaW50cywge30pO1xuICAgIH1cbn1cbmNvbnN0IGVtcHR5ID0gU3ltYm9sKFwiZW1wdHlcIik7XG5leHBvcnQgY29uc3QgYW5vbnltb3VzRGlzam9pbnQgPSAoKT0+ZW1wdHk7XG5leHBvcnQgY29uc3QgaXNEaXNqb2ludCA9IChyZXN1bHQpPT5yZXN1bHQgPT09IGVtcHR5O1xuY29uc3QgZXF1YWwgPSBTeW1ib2woXCJlcXVhbFwiKTtcbmV4cG9ydCBjb25zdCBlcXVhbGl0eSA9ICgpPT5lcXVhbDtcbmV4cG9ydCBjb25zdCBpc0VxdWFsaXR5ID0gKHJlc3VsdCk9PnJlc3VsdCA9PT0gZXF1YWw7XG5leHBvcnQgY29uc3QgY29tcG9zZUtleWVkSW50ZXJzZWN0aW9uID0gKHJlZHVjZXIsIGNvbmZpZyk9PihsLCByLCBzdGF0ZSk9PntcbiAgICAgICAgY29uc3QgcmVzdWx0ID0ge307XG4gICAgICAgIGNvbnN0IGtleXMgPSBvYmplY3RLZXlzT2Yoe1xuICAgICAgICAgICAgLi4ubCxcbiAgICAgICAgICAgIC4uLnJcbiAgICAgICAgfSk7XG4gICAgICAgIGxldCBsSW1wbGllc1IgPSB0cnVlO1xuICAgICAgICBsZXQgckltcGxpZXNMID0gdHJ1ZTtcbiAgICAgICAgZm9yIChjb25zdCBrIG9mIGtleXMpe1xuICAgICAgICAgICAgY29uc3Qga2V5UmVzdWx0ID0gdHlwZW9mIHJlZHVjZXIgPT09IFwiZnVuY3Rpb25cIiA/IHJlZHVjZXIoaywgbFtrXSwgcltrXSwgc3RhdGUpIDogcmVkdWNlcltrXShsW2tdLCByW2tdLCBzdGF0ZSk7XG4gICAgICAgICAgICBpZiAoaXNFcXVhbGl0eShrZXlSZXN1bHQpKSB7XG4gICAgICAgICAgICAgICAgaWYgKGxba10gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICByZXN1bHRba10gPSBsW2tdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSBpZiAoaXNEaXNqb2ludChrZXlSZXN1bHQpKSB7XG4gICAgICAgICAgICAgICAgaWYgKGNvbmZpZy5vbkVtcHR5ID09PSBcIm9taXRcIikge1xuICAgICAgICAgICAgICAgICAgICBsSW1wbGllc1IgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgckltcGxpZXNMID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGVtcHR5O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKGtleVJlc3VsdCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdFtrXSA9IGtleVJlc3VsdDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgbEltcGxpZXNSICYmIChsSW1wbGllc1IgPSBrZXlSZXN1bHQgPT09IGxba10pO1xuICAgICAgICAgICAgICAgIHJJbXBsaWVzTCAmJiAockltcGxpZXNMID0ga2V5UmVzdWx0ID09PSByW2tdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbEltcGxpZXNSID8gckltcGxpZXNMID8gZXF1YWxpdHkoKSA6IGwgOiBySW1wbGllc0wgPyByIDogcmVzdWx0O1xuICAgIH07XG4iLCAiaW1wb3J0IHsgZGlzam9pbnREZXNjcmlwdGlvbldyaXRlcnMgfSBmcm9tIFwiLi4vLi4vbm9kZXMvY29tcG9zZS5qc1wiO1xuaW1wb3J0IHsgb2JqZWN0S2V5c09mIH0gZnJvbSBcIi4uLy4uL3V0aWxzL2dlbmVyaWNzLmpzXCI7XG5leHBvcnQgY29uc3QgY29tcGlsZURpc2pvaW50UmVhc29uc01lc3NhZ2UgPSAoZGlzam9pbnRzKT0+e1xuICAgIGNvbnN0IHBhdGhzID0gb2JqZWN0S2V5c09mKGRpc2pvaW50cyk7XG4gICAgaWYgKHBhdGhzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICBjb25zdCBwYXRoID0gcGF0aHNbMF07XG4gICAgICAgIHJldHVybiBgJHtwYXRoID09PSBcIi9cIiA/IFwiXCIgOiBgQXQgJHtwYXRofTogYH1JbnRlcnNlY3Rpb24gb2YgJHtkaXNqb2ludERlc2NyaXB0aW9uV3JpdGVyc1tkaXNqb2ludHNbcGF0aF0ua2luZF0oZGlzam9pbnRzW3BhdGhdKX0gcmVzdWx0cyBpbiBhbiB1bnNhdGlzZmlhYmxlIHR5cGVgO1xuICAgIH1cbiAgICBsZXQgbWVzc2FnZSA9IGBcbiAgICAgICAgXCJJbnRlcnNlY3Rpb24gcmVzdWx0cyBpbiB1bnNhdGlzZmlhYmxlIHR5cGVzIGF0IHRoZSBmb2xsb3dpbmcgcGF0aHM6XFxuYDtcbiAgICBmb3IoY29uc3QgcGF0aCBpbiBkaXNqb2ludHMpe1xuICAgICAgICBtZXNzYWdlICs9IGAgICR7cGF0aH06ICR7ZGlzam9pbnREZXNjcmlwdGlvbldyaXRlcnNbZGlzam9pbnRzW3BhdGhdLmtpbmRdKGRpc2pvaW50c1twYXRoXSl9XFxuYDtcbiAgICB9XG4gICAgcmV0dXJuIG1lc3NhZ2U7XG59O1xuZXhwb3J0IGNvbnN0IHdyaXRlSW1wbGljaXROZXZlck1lc3NhZ2UgPSAocGF0aCwgb3BlcmF0b3IsIGRlc2NyaXB0aW9uKT0+YCR7cGF0aC5sZW5ndGggPyBgQXQgJHtwYXRofTogYCA6IFwiXCJ9JHtvcGVyYXRvcn0gJHtkZXNjcmlwdGlvbiA/IGAke2Rlc2NyaXB0aW9ufSBgIDogXCJcIn1yZXN1bHRzIGluIGFuIHVuc2F0aXNmaWFibGUgdHlwZWA7XG4iLCAiaW1wb3J0IHsgZG9tYWluT2YgfSBmcm9tIFwiLi9kb21haW5zLmpzXCI7XG5pbXBvcnQgeyBpc0tleU9mIH0gZnJvbSBcIi4vZ2VuZXJpY3MuanNcIjtcbi8vIEJ1aWx0LWluIG9iamVjdCBjb25zdHJ1Y3RvcnMgYmFzZWQgb24gYSBzdWJzZXQgb2Y6XG4vLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9KYXZhU2NyaXB0L1JlZmVyZW5jZS9HbG9iYWxfT2JqZWN0c1xuZXhwb3J0IGNvbnN0IGRlZmF1bHRPYmplY3RLaW5kcyA9IHtcbiAgICBBcnJheSxcbiAgICBEYXRlLFxuICAgIEVycm9yLFxuICAgIEZ1bmN0aW9uLFxuICAgIE1hcCxcbiAgICBSZWdFeHAsXG4gICAgU2V0LFxuICAgIE9iamVjdCxcbiAgICBTdHJpbmcsXG4gICAgTnVtYmVyLFxuICAgIEJvb2xlYW4sXG4gICAgV2Vha01hcCxcbiAgICBXZWFrU2V0LFxuICAgIFByb21pc2Vcbn07XG5leHBvcnQgY29uc3Qgb2JqZWN0S2luZE9mID0gKGRhdGEsIGtpbmRzKT0+e1xuICAgIGlmIChkb21haW5PZihkYXRhKSAhPT0gXCJvYmplY3RcIikge1xuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cbiAgICBjb25zdCBraW5kU2V0ID0ga2luZHMgPz8gZGVmYXVsdE9iamVjdEtpbmRzO1xuICAgIGxldCBwcm90b3R5cGUgPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YoZGF0YSk7XG4gICAgd2hpbGUocHJvdG90eXBlPy5jb25zdHJ1Y3RvciAmJiAoIWtpbmRTZXRbcHJvdG90eXBlLmNvbnN0cnVjdG9yLm5hbWVdIHx8ICEoZGF0YSBpbnN0YW5jZW9mIGtpbmRTZXRbcHJvdG90eXBlLmNvbnN0cnVjdG9yLm5hbWVdKSkpe1xuICAgICAgICBwcm90b3R5cGUgPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YocHJvdG90eXBlKTtcbiAgICB9XG4gICAgcmV0dXJuIHByb3RvdHlwZT8uY29uc3RydWN0b3I/Lm5hbWU7XG59O1xuZXhwb3J0IGNvbnN0IGhhc09iamVjdEtpbmQgPSAoZGF0YSwga2luZCwga2luZHMpPT5vYmplY3RLaW5kT2YoZGF0YSwga2luZHMpID09PSBraW5kO1xuZXhwb3J0IGNvbnN0IGlzQXJyYXkgPSAoZGF0YSk9PkFycmF5LmlzQXJyYXkoZGF0YSk7XG4vKiogRWFjaCBkZWZhdWx0T2JqZWN0S2luZCdzIGNvbXBsZXRpb24gZm9yIHRoZSBwaHJhc2UgXCJNdXN0IGJlIF9fX19fXCIgKi8gZXhwb3J0IGNvbnN0IG9iamVjdEtpbmREZXNjcmlwdGlvbnMgPSB7XG4gICAgT2JqZWN0OiBcImFuIG9iamVjdFwiLFxuICAgIEFycmF5OiBcImFuIGFycmF5XCIsXG4gICAgRnVuY3Rpb246IFwiYSBmdW5jdGlvblwiLFxuICAgIERhdGU6IFwiYSBEYXRlXCIsXG4gICAgUmVnRXhwOiBcImEgUmVnRXhwXCIsXG4gICAgRXJyb3I6IFwiYW4gRXJyb3JcIixcbiAgICBNYXA6IFwiYSBNYXBcIixcbiAgICBTZXQ6IFwiYSBTZXRcIixcbiAgICBTdHJpbmc6IFwiYSBTdHJpbmcgb2JqZWN0XCIsXG4gICAgTnVtYmVyOiBcImEgTnVtYmVyIG9iamVjdFwiLFxuICAgIEJvb2xlYW46IFwiYSBCb29sZWFuIG9iamVjdFwiLFxuICAgIFByb21pc2U6IFwiYSBQcm9taXNlXCIsXG4gICAgV2Vha01hcDogXCJhIFdlYWtNYXBcIixcbiAgICBXZWFrU2V0OiBcImEgV2Vha1NldFwiXG59O1xuLy8gdGhpcyB3aWxsIG9ubHkgcmV0dXJuIGFuIG9iamVjdCBraW5kIGlmIGl0J3MgdGhlIHJvb3QgY29uc3RydWN0b3Jcbi8vIGV4YW1wbGUgVHlwZUVycm9yIHdvdWxkIHJldHVybiB1bmRlZmluZWQgbm90ICdFcnJvcidcbmV4cG9ydCBjb25zdCBnZXRFeGFjdENvbnN0cnVjdG9yT2JqZWN0S2luZCA9IChjb25zdHJ1Y3Rvcik9PntcbiAgICBjb25zdCBjb25zdHJ1Y3Rvck5hbWUgPSBPYmplY3QoY29uc3RydWN0b3IpLm5hbWU7XG4gICAgcmV0dXJuIGNvbnN0cnVjdG9yTmFtZSAmJiBpc0tleU9mKGNvbnN0cnVjdG9yTmFtZSwgZGVmYXVsdE9iamVjdEtpbmRzKSAmJiBkZWZhdWx0T2JqZWN0S2luZHNbY29uc3RydWN0b3JOYW1lXSA9PT0gY29uc3RydWN0b3IgPyBjb25zdHJ1Y3Rvck5hbWUgOiB1bmRlZmluZWQ7XG59O1xuIiwgImltcG9ydCB7IG9iamVjdEtpbmRPZiB9IGZyb20gXCIuLi8uLi91dGlscy9vYmplY3RLaW5kcy5qc1wiO1xuaW1wb3J0IHsgY29tcG9zZUludGVyc2VjdGlvbiwgZXF1YWxpdHkgfSBmcm9tIFwiLi4vY29tcG9zZS5qc1wiO1xuZXhwb3J0IGNvbnN0IGNsYXNzSW50ZXJzZWN0aW9uID0gY29tcG9zZUludGVyc2VjdGlvbigobCwgciwgc3RhdGUpPT57XG4gICAgcmV0dXJuIGwgPT09IHIgPyBlcXVhbGl0eSgpIDogbCBpbnN0YW5jZW9mIHIgPyBsIDogciBpbnN0YW5jZW9mIGwgPyByIDogc3RhdGUuYWRkRGlzam9pbnQoXCJjbGFzc1wiLCBsLCByKTtcbn0pO1xuZXhwb3J0IGNvbnN0IGNoZWNrQ2xhc3MgPSAoZXhwZWN0ZWRDbGFzcywgc3RhdGUpPT57XG4gICAgaWYgKHR5cGVvZiBleHBlY3RlZENsYXNzID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAgIHJldHVybiBvYmplY3RLaW5kT2Yoc3RhdGUuZGF0YSkgPT09IGV4cGVjdGVkQ2xhc3MgfHwgIXN0YXRlLnByb2JsZW1zLmFkZChcImNsYXNzXCIsIGV4cGVjdGVkQ2xhc3MpO1xuICAgIH1cbiAgICByZXR1cm4gc3RhdGUuZGF0YSBpbnN0YW5jZW9mIGV4cGVjdGVkQ2xhc3MgfHwgIXN0YXRlLnByb2JsZW1zLmFkZChcImNsYXNzXCIsIGV4cGVjdGVkQ2xhc3MpO1xufTtcbiIsICJpbXBvcnQgeyBlcXVhbGl0eSB9IGZyb20gXCIuLi9jb21wb3NlLmpzXCI7XG5leHBvcnQgY29uc3QgY29sbGFwc2libGVMaXN0VW5pb24gPSAobCwgcik9PntcbiAgICBpZiAoQXJyYXkuaXNBcnJheShsKSkge1xuICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShyKSkge1xuICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gbGlzdFVuaW9uKGwsIHIpO1xuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdC5sZW5ndGggPT09IGwubGVuZ3RoID8gcmVzdWx0Lmxlbmd0aCA9PT0gci5sZW5ndGggPyBlcXVhbGl0eSgpIDogbCA6IHJlc3VsdC5sZW5ndGggPT09IHIubGVuZ3RoID8gciA6IHJlc3VsdDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbC5pbmNsdWRlcyhyKSA/IGwgOiBbXG4gICAgICAgICAgICAuLi5sLFxuICAgICAgICAgICAgclxuICAgICAgICBdO1xuICAgIH1cbiAgICBpZiAoQXJyYXkuaXNBcnJheShyKSkge1xuICAgICAgICByZXR1cm4gci5pbmNsdWRlcyhsKSA/IHIgOiBbXG4gICAgICAgICAgICAuLi5yLFxuICAgICAgICAgICAgbFxuICAgICAgICBdO1xuICAgIH1cbiAgICByZXR1cm4gbCA9PT0gciA/IGVxdWFsaXR5KCkgOiBbXG4gICAgICAgIGwsXG4gICAgICAgIHJcbiAgICBdO1xufTtcbmV4cG9ydCBjb25zdCBsaXN0VW5pb24gPSAobCwgcik9PntcbiAgICBjb25zdCByZXN1bHQgPSBbXG4gICAgICAgIC4uLmxcbiAgICBdO1xuICAgIGZvciAoY29uc3QgZXhwcmVzc2lvbiBvZiByKXtcbiAgICAgICAgaWYgKCFsLmluY2x1ZGVzKGV4cHJlc3Npb24pKSB7XG4gICAgICAgICAgICByZXN1bHQucHVzaChleHByZXNzaW9uKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xufTtcbiIsICJpbXBvcnQgeyBjb21wb3NlSW50ZXJzZWN0aW9uLCBlcXVhbGl0eSB9IGZyb20gXCIuLi9jb21wb3NlLmpzXCI7XG5leHBvcnQgY29uc3QgZGl2aXNvckludGVyc2VjdGlvbiA9IGNvbXBvc2VJbnRlcnNlY3Rpb24oKGwsIHIpPT5sID09PSByID8gZXF1YWxpdHkoKSA6IE1hdGguYWJzKGwgKiByIC8gZ3JlYXRlc3RDb21tb25EaXZpc29yKGwsIHIpKSk7XG4vLyBodHRwczovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9FdWNsaWRlYW5fYWxnb3JpdGhtXG5jb25zdCBncmVhdGVzdENvbW1vbkRpdmlzb3IgPSAobCwgcik9PntcbiAgICBsZXQgcHJldmlvdXM7XG4gICAgbGV0IGdyZWF0ZXN0Q29tbW9uRGl2aXNvciA9IGw7XG4gICAgbGV0IGN1cnJlbnQgPSByO1xuICAgIHdoaWxlKGN1cnJlbnQgIT09IDApe1xuICAgICAgICBwcmV2aW91cyA9IGN1cnJlbnQ7XG4gICAgICAgIGN1cnJlbnQgPSBncmVhdGVzdENvbW1vbkRpdmlzb3IgJSBjdXJyZW50O1xuICAgICAgICBncmVhdGVzdENvbW1vbkRpdmlzb3IgPSBwcmV2aW91cztcbiAgICB9XG4gICAgcmV0dXJuIGdyZWF0ZXN0Q29tbW9uRGl2aXNvcjtcbn07XG5leHBvcnQgY29uc3QgY2hlY2tEaXZpc29yID0gKGRpdmlzb3IsIHN0YXRlKT0+c3RhdGUuZGF0YSAlIGRpdmlzb3IgPT09IDAgfHwgIXN0YXRlLnByb2JsZW1zLmFkZChcImRpdmlzb3JcIiwgZGl2aXNvcik7XG4iLCAiaW1wb3J0IHsgY29tcG9zZUludGVyc2VjdGlvbiwgY29tcG9zZUtleWVkSW50ZXJzZWN0aW9uLCBlcXVhbGl0eSwgaXNEaXNqb2ludCwgaXNFcXVhbGl0eSB9IGZyb20gXCIuLi9jb21wb3NlLmpzXCI7XG5pbXBvcnQgeyBmbGF0dGVuTm9kZSwgaXNMaXRlcmFsTm9kZSwgbm9kZUludGVyc2VjdGlvbiB9IGZyb20gXCIuLi9ub2RlLmpzXCI7XG5leHBvcnQgY29uc3QgaXNPcHRpb25hbCA9IChwcm9wKT0+cHJvcFswXSA9PT0gXCI/XCI7XG5leHBvcnQgY29uc3QgaXNQcmVyZXF1aXNpdGUgPSAocHJvcCk9PnByb3BbMF0gPT09IFwiIVwiO1xuZXhwb3J0IGNvbnN0IG1hcHBlZEtleXMgPSB7XG4gICAgaW5kZXg6IFwiW2luZGV4XVwiXG59O1xuZXhwb3J0IGNvbnN0IHByb3BUb05vZGUgPSAocHJvcCk9PmlzT3B0aW9uYWwocHJvcCkgfHwgaXNQcmVyZXF1aXNpdGUocHJvcCkgPyBwcm9wWzFdIDogcHJvcDtcbmNvbnN0IGdldFR1cGxlTGVuZ3RoSWZQcmVzZW50ID0gKHJlc3VsdCk9PntcbiAgICBpZiAodHlwZW9mIHJlc3VsdC5sZW5ndGggPT09IFwib2JqZWN0XCIgJiYgaXNQcmVyZXF1aXNpdGUocmVzdWx0Lmxlbmd0aCkgJiYgdHlwZW9mIHJlc3VsdC5sZW5ndGhbMV0gIT09IFwic3RyaW5nXCIgJiYgaXNMaXRlcmFsTm9kZShyZXN1bHQubGVuZ3RoWzFdLCBcIm51bWJlclwiKSkge1xuICAgICAgICByZXR1cm4gcmVzdWx0Lmxlbmd0aFsxXS5udW1iZXIudmFsdWU7XG4gICAgfVxufTtcbmV4cG9ydCBjb25zdCBwcm9wc0ludGVyc2VjdGlvbiA9IGNvbXBvc2VJbnRlcnNlY3Rpb24oKGwsIHIsIHN0YXRlKT0+e1xuICAgIGNvbnN0IHJlc3VsdCA9IHByb3BLZXlzSW50ZXJzZWN0aW9uKGwsIHIsIHN0YXRlKTtcbiAgICBpZiAodHlwZW9mIHJlc3VsdCA9PT0gXCJzeW1ib2xcIikge1xuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cbiAgICBjb25zdCBsZW5ndGhWYWx1ZSA9IGdldFR1cGxlTGVuZ3RoSWZQcmVzZW50KHJlc3VsdCk7XG4gICAgaWYgKGxlbmd0aFZhbHVlID09PSB1bmRlZmluZWQgfHwgIShtYXBwZWRLZXlzLmluZGV4IGluIHJlc3VsdCkpIHtcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG4gICAgLy8gaWYgd2UgYXJlIGF0IHRoaXMgcG9pbnQsIHdlIGhhdmUgYW4gYXJyYXkgd2l0aCBhbiBleGFjdCBsZW5ndGggKGkuZS5cbiAgICAvLyBhIHR1cGxlKSBhbmQgYW4gaW5kZXggc2lnbmF0dXJlLiBJbnRlcnNlY3Rpb24gZWFjaCB0dXBsZSBpdGVtIHdpdGhcbiAgICAvLyB0aGUgaW5kZXggc2lnbmF0dXJlIG5vZGUgYW5kIHJlbW92ZSB0aGUgaW5kZXggc2lnbmF0dXJlIHZpYSBhIG5ld1xuICAgIC8vIHVwZGF0ZWQgcmVzdWx0LCBjb3BpZWQgZnJvbSByZXN1bHQgdG8gYXZvaWQgbXV0YXRpbmcgZXhpc3RpbmcgcmVmZXJlbmNlcy5cbiAgICBjb25zdCB7IFttYXBwZWRLZXlzLmluZGV4XTogaW5kZXhQcm9wICwgLi4udXBkYXRlZFJlc3VsdCB9ID0gcmVzdWx0O1xuICAgIGNvbnN0IGluZGV4Tm9kZSA9IHByb3BUb05vZGUoaW5kZXhQcm9wKTtcbiAgICBmb3IobGV0IGkgPSAwOyBpIDwgbGVuZ3RoVmFsdWU7IGkrKyl7XG4gICAgICAgIGlmICghdXBkYXRlZFJlc3VsdFtpXSkge1xuICAgICAgICAgICAgdXBkYXRlZFJlc3VsdFtpXSA9IGluZGV4Tm9kZTtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGV4aXN0aW5nTm9kZUF0SW5kZXggPSBwcm9wVG9Ob2RlKHVwZGF0ZWRSZXN1bHRbaV0pO1xuICAgICAgICBzdGF0ZS5wYXRoLnB1c2goYCR7aX1gKTtcbiAgICAgICAgY29uc3QgdXBkYXRlZFJlc3VsdEF0SW5kZXggPSBub2RlSW50ZXJzZWN0aW9uKGV4aXN0aW5nTm9kZUF0SW5kZXgsIGluZGV4Tm9kZSwgc3RhdGUpO1xuICAgICAgICBzdGF0ZS5wYXRoLnBvcCgpO1xuICAgICAgICBpZiAoaXNEaXNqb2ludCh1cGRhdGVkUmVzdWx0QXRJbmRleCkpIHtcbiAgICAgICAgICAgIHJldHVybiB1cGRhdGVkUmVzdWx0QXRJbmRleDtcbiAgICAgICAgfSBlbHNlIGlmICghaXNFcXVhbGl0eSh1cGRhdGVkUmVzdWx0QXRJbmRleCkgJiYgdXBkYXRlZFJlc3VsdEF0SW5kZXggIT09IGV4aXN0aW5nTm9kZUF0SW5kZXgpIHtcbiAgICAgICAgICAgIHVwZGF0ZWRSZXN1bHRbaV0gPSB1cGRhdGVkUmVzdWx0QXRJbmRleDtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdXBkYXRlZFJlc3VsdDtcbn0pO1xuY29uc3QgcHJvcEtleXNJbnRlcnNlY3Rpb24gPSBjb21wb3NlS2V5ZWRJbnRlcnNlY3Rpb24oKHByb3BLZXksIGwsIHIsIGNvbnRleHQpPT57XG4gICAgaWYgKGwgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICByZXR1cm4gciA9PT0gdW5kZWZpbmVkID8gZXF1YWxpdHkoKSA6IHI7XG4gICAgfVxuICAgIGlmIChyID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgcmV0dXJuIGw7XG4gICAgfVxuICAgIGNvbnRleHQucGF0aC5wdXNoKHByb3BLZXkpO1xuICAgIGNvbnN0IHJlc3VsdCA9IG5vZGVJbnRlcnNlY3Rpb24ocHJvcFRvTm9kZShsKSwgcHJvcFRvTm9kZShyKSwgY29udGV4dCk7XG4gICAgY29udGV4dC5wYXRoLnBvcCgpO1xuICAgIGNvbnN0IHJlc3VsdElzT3B0aW9uYWwgPSBpc09wdGlvbmFsKGwpICYmIGlzT3B0aW9uYWwocik7XG4gICAgaWYgKGlzRGlzam9pbnQocmVzdWx0KSAmJiByZXN1bHRJc09wdGlvbmFsKSB7XG4gICAgICAgIC8vIElmIGFuIG9wdGlvbmFsIGtleSBoYXMgYW4gZW1wdHkgaW50ZXJzZWN0aW9uLCB0aGUgdHlwZSBjYW5cbiAgICAgICAgLy8gc3RpbGwgYmUgc2F0aXNmaWVkIGFzIGxvbmcgYXMgdGhlIGtleSBpcyBub3QgaW5jbHVkZWQuIFNldFxuICAgICAgICAvLyB0aGUgbm9kZSB0byBuZXZlciByYXRoZXIgdGhhbiBpbnZhbGlkYXRpbmcgdGhlIHR5cGUuXG4gICAgICAgIHJldHVybiB7fTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbn0sIHtcbiAgICBvbkVtcHR5OiBcImJ1YmJsZVwiXG59KTtcbmV4cG9ydCBjb25zdCBmbGF0dGVuUHJvcHMgPSAoZW50cmllcywgcHJvcHMsIGN0eCk9PntcbiAgICBjb25zdCBrZXlDb25maWcgPSBjdHgudHlwZS5jb25maWc/LmtleXMgPz8gY3R4LnR5cGUuc2NvcGUuY29uZmlnLmtleXM7XG4gICAgcmV0dXJuIGtleUNvbmZpZyA9PT0gXCJsb29zZVwiID8gZmxhdHRlbkxvb3NlUHJvcHMoZW50cmllcywgcHJvcHMsIGN0eCkgOiBmbGF0dGVuUHJvcHNSZWNvcmQoa2V5Q29uZmlnLCBlbnRyaWVzLCBwcm9wcywgY3R4KTtcbn07XG5jb25zdCBmbGF0dGVuTG9vc2VQcm9wcyA9IChlbnRyaWVzLCBwcm9wcywgY3R4KT0+e1xuICAgIC8vIGlmIHdlIGRvbid0IGNhcmUgYWJvdXQgZXh0cmFuZW91cyBrZXlzLCBmbGF0dGVuIHByb3BzIHNvIHdlIGNhbiBpdGVyYXRlIG92ZXIgdGhlIGRlZmluaXRpb25zIGRpcmVjdGx5XG4gICAgZm9yKGNvbnN0IGsgaW4gcHJvcHMpe1xuICAgICAgICBjb25zdCBwcm9wID0gcHJvcHNba107XG4gICAgICAgIGN0eC5wYXRoLnB1c2goayk7XG4gICAgICAgIGlmIChrID09PSBtYXBwZWRLZXlzLmluZGV4KSB7XG4gICAgICAgICAgICBlbnRyaWVzLnB1c2goW1xuICAgICAgICAgICAgICAgIFwiaW5kZXhQcm9wXCIsXG4gICAgICAgICAgICAgICAgZmxhdHRlbk5vZGUocHJvcFRvTm9kZShwcm9wKSwgY3R4KVxuICAgICAgICAgICAgXSk7XG4gICAgICAgIH0gZWxzZSBpZiAoaXNPcHRpb25hbChwcm9wKSkge1xuICAgICAgICAgICAgZW50cmllcy5wdXNoKFtcbiAgICAgICAgICAgICAgICBcIm9wdGlvbmFsUHJvcFwiLFxuICAgICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAgICAgayxcbiAgICAgICAgICAgICAgICAgICAgZmxhdHRlbk5vZGUocHJvcFsxXSwgY3R4KVxuICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgIF0pO1xuICAgICAgICB9IGVsc2UgaWYgKGlzUHJlcmVxdWlzaXRlKHByb3ApKSB7XG4gICAgICAgICAgICBlbnRyaWVzLnB1c2goW1xuICAgICAgICAgICAgICAgIFwicHJlcmVxdWlzaXRlUHJvcFwiLFxuICAgICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAgICAgayxcbiAgICAgICAgICAgICAgICAgICAgZmxhdHRlbk5vZGUocHJvcFsxXSwgY3R4KVxuICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgIF0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZW50cmllcy5wdXNoKFtcbiAgICAgICAgICAgICAgICBcInJlcXVpcmVkUHJvcFwiLFxuICAgICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAgICAgayxcbiAgICAgICAgICAgICAgICAgICAgZmxhdHRlbk5vZGUocHJvcCwgY3R4KVxuICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgIF0pO1xuICAgICAgICB9XG4gICAgICAgIGN0eC5wYXRoLnBvcCgpO1xuICAgIH1cbn07XG5jb25zdCBmbGF0dGVuUHJvcHNSZWNvcmQgPSAoa2luZCwgZW50cmllcywgcHJvcHMsIGN0eCk9PntcbiAgICBjb25zdCByZXN1bHQgPSB7XG4gICAgICAgIHJlcXVpcmVkOiB7fSxcbiAgICAgICAgb3B0aW9uYWw6IHt9XG4gICAgfTtcbiAgICAvLyBpZiB3ZSBuZWVkIHRvIGtlZXAgdHJhY2sgb2YgZXh0cmFuZW91cyBrZXlzLCBlaXRoZXIgdG8gYWRkIHByb2JsZW1zIG9yXG4gICAgLy8gcmVtb3ZlIHRoZW0sIHN0b3JlIHRoZSBwcm9wcyBhcyBhIFJlY29yZCB0byBvcHRpbWl6ZSBmb3IgcHJlc2VuY2VcbiAgICAvLyBjaGVja2luZyBhcyB3ZSBpdGVyYXRlIG92ZXIgdGhlIGRhdGFcbiAgICBmb3IoY29uc3QgayBpbiBwcm9wcyl7XG4gICAgICAgIGNvbnN0IHByb3AgPSBwcm9wc1trXTtcbiAgICAgICAgY3R4LnBhdGgucHVzaChrKTtcbiAgICAgICAgaWYgKGsgPT09IG1hcHBlZEtleXMuaW5kZXgpIHtcbiAgICAgICAgICAgIHJlc3VsdC5pbmRleCA9IGZsYXR0ZW5Ob2RlKHByb3BUb05vZGUocHJvcCksIGN0eCk7XG4gICAgICAgIH0gZWxzZSBpZiAoaXNPcHRpb25hbChwcm9wKSkge1xuICAgICAgICAgICAgcmVzdWx0Lm9wdGlvbmFsW2tdID0gZmxhdHRlbk5vZGUocHJvcFsxXSwgY3R4KTtcbiAgICAgICAgfSBlbHNlIGlmIChpc1ByZXJlcXVpc2l0ZShwcm9wKSkge1xuICAgICAgICAgICAgLy8gd2Ugc3RpbGwgaGF2ZSB0byBwdXNoIHByZXJlcXVpc2l0ZSBwcm9wcyBhcyBub3JtYWwgZW50cmllcyBzbyB0aGV5IGNhbiBiZSBjaGVja2VkIGZpcnN0XG4gICAgICAgICAgICBlbnRyaWVzLnB1c2goW1xuICAgICAgICAgICAgICAgIFwicHJlcmVxdWlzaXRlUHJvcFwiLFxuICAgICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAgICAgayxcbiAgICAgICAgICAgICAgICAgICAgZmxhdHRlbk5vZGUocHJvcFsxXSwgY3R4KVxuICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgIF0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmVzdWx0LnJlcXVpcmVkW2tdID0gZmxhdHRlbk5vZGUocHJvcCwgY3R4KTtcbiAgICAgICAgfVxuICAgICAgICBjdHgucGF0aC5wb3AoKTtcbiAgICB9XG4gICAgZW50cmllcy5wdXNoKFtcbiAgICAgICAgYCR7a2luZH1Qcm9wc2AsXG4gICAgICAgIHJlc3VsdFxuICAgIF0pO1xufTtcbiIsICJmdW5jdGlvbiBfZGVmaW5lUHJvcGVydHkob2JqLCBrZXksIHZhbHVlKSB7XG4gICAgaWYgKGtleSBpbiBvYmopIHtcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iaiwga2V5LCB7XG4gICAgICAgICAgICB2YWx1ZTogdmFsdWUsXG4gICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgICAgICAgd3JpdGFibGU6IHRydWVcbiAgICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgb2JqW2tleV0gPSB2YWx1ZTtcbiAgICB9XG4gICAgcmV0dXJuIG9iajtcbn1cbmltcG9ydCB7IGRvbWFpbk9mIH0gZnJvbSBcIi4vZG9tYWlucy5qc1wiO1xuaW1wb3J0IHsgc3RyaW5naWZ5IH0gZnJvbSBcIi4vc2VyaWFsaXplLmpzXCI7XG5leHBvcnQgY29uc3Qgc2l6ZU9mID0gKGRhdGEpPT50eXBlb2YgZGF0YSA9PT0gXCJzdHJpbmdcIiB8fCBBcnJheS5pc0FycmF5KGRhdGEpID8gZGF0YS5sZW5ndGggOiB0eXBlb2YgZGF0YSA9PT0gXCJudW1iZXJcIiA/IGRhdGEgOiAwO1xuZXhwb3J0IGNvbnN0IHVuaXRzT2YgPSAoZGF0YSk9PnR5cGVvZiBkYXRhID09PSBcInN0cmluZ1wiID8gXCJjaGFyYWN0ZXJzXCIgOiBBcnJheS5pc0FycmF5KGRhdGEpID8gXCJpdGVtcyBsb25nXCIgOiBcIlwiO1xuZXhwb3J0IGNsYXNzIERhdGFXcmFwcGVyIHtcbiAgICB0b1N0cmluZygpIHtcbiAgICAgICAgcmV0dXJuIHN0cmluZ2lmeSh0aGlzLnZhbHVlKTtcbiAgICB9XG4gICAgZ2V0IGRvbWFpbigpIHtcbiAgICAgICAgcmV0dXJuIGRvbWFpbk9mKHRoaXMudmFsdWUpO1xuICAgIH1cbiAgICBnZXQgc2l6ZSgpIHtcbiAgICAgICAgcmV0dXJuIHNpemVPZih0aGlzLnZhbHVlKTtcbiAgICB9XG4gICAgZ2V0IHVuaXRzKCkge1xuICAgICAgICByZXR1cm4gdW5pdHNPZih0aGlzLnZhbHVlKTtcbiAgICB9XG4gICAgZ2V0IGNsYXNzTmFtZSgpIHtcbiAgICAgICAgcmV0dXJuIE9iamVjdCh0aGlzLnZhbHVlKS5jb25zdHJ1Y3Rvci5uYW1lO1xuICAgIH1cbiAgICBjb25zdHJ1Y3Rvcih2YWx1ZSl7XG4gICAgICAgIF9kZWZpbmVQcm9wZXJ0eSh0aGlzLCBcInZhbHVlXCIsIHZvaWQgMCk7XG4gICAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgICB9XG59XG4iLCAiaW1wb3J0IHsgc2l6ZU9mIH0gZnJvbSBcIi4uLy4uL3V0aWxzL2RhdGEuanNcIjtcbmltcG9ydCB7IGNvbXBvc2VJbnRlcnNlY3Rpb24sIGVxdWFsaXR5IH0gZnJvbSBcIi4uL2NvbXBvc2UuanNcIjtcbmV4cG9ydCBjb25zdCBtaW5Db21wYXJhdG9ycyA9IHtcbiAgICBcIj5cIjogdHJ1ZSxcbiAgICBcIj49XCI6IHRydWVcbn07XG5leHBvcnQgY29uc3QgbWF4Q29tcGFyYXRvcnMgPSB7XG4gICAgXCI8XCI6IHRydWUsXG4gICAgXCI8PVwiOiB0cnVlXG59O1xuZXhwb3J0IGNvbnN0IGlzRXF1YWxpdHlSYW5nZSA9IChyYW5nZSk9PlwiY29tcGFyYXRvclwiIGluIHJhbmdlO1xuZXhwb3J0IGNvbnN0IHJhbmdlSW50ZXJzZWN0aW9uID0gY29tcG9zZUludGVyc2VjdGlvbigobCwgciwgc3RhdGUpPT57XG4gICAgaWYgKGlzRXF1YWxpdHlSYW5nZShsKSkge1xuICAgICAgICBpZiAoaXNFcXVhbGl0eVJhbmdlKHIpKSB7XG4gICAgICAgICAgICByZXR1cm4gbC5saW1pdCA9PT0gci5saW1pdCA/IGVxdWFsaXR5KCkgOiBzdGF0ZS5hZGREaXNqb2ludChcInJhbmdlXCIsIGwsIHIpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByYW5nZUFsbG93cyhyLCBsLmxpbWl0KSA/IGwgOiBzdGF0ZS5hZGREaXNqb2ludChcInJhbmdlXCIsIGwsIHIpO1xuICAgIH1cbiAgICBpZiAoaXNFcXVhbGl0eVJhbmdlKHIpKSB7XG4gICAgICAgIHJldHVybiByYW5nZUFsbG93cyhsLCByLmxpbWl0KSA/IHIgOiBzdGF0ZS5hZGREaXNqb2ludChcInJhbmdlXCIsIGwsIHIpO1xuICAgIH1cbiAgICBjb25zdCBzdHJpY3Rlck1pbiA9IGNvbXBhcmVTdHJpY3RuZXNzKFwibWluXCIsIGwubWluLCByLm1pbik7XG4gICAgY29uc3Qgc3RyaWN0ZXJNYXggPSBjb21wYXJlU3RyaWN0bmVzcyhcIm1heFwiLCBsLm1heCwgci5tYXgpO1xuICAgIGlmIChzdHJpY3Rlck1pbiA9PT0gXCJsXCIpIHtcbiAgICAgICAgaWYgKHN0cmljdGVyTWF4ID09PSBcInJcIikge1xuICAgICAgICAgICAgcmV0dXJuIGNvbXBhcmVTdHJpY3RuZXNzKFwibWluXCIsIGwubWluLCByLm1heCkgPT09IFwibFwiID8gc3RhdGUuYWRkRGlzam9pbnQoXCJyYW5nZVwiLCBsLCByKSA6IHtcbiAgICAgICAgICAgICAgICBtaW46IGwubWluLFxuICAgICAgICAgICAgICAgIG1heDogci5tYXhcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGw7XG4gICAgfVxuICAgIGlmIChzdHJpY3Rlck1pbiA9PT0gXCJyXCIpIHtcbiAgICAgICAgaWYgKHN0cmljdGVyTWF4ID09PSBcImxcIikge1xuICAgICAgICAgICAgcmV0dXJuIGNvbXBhcmVTdHJpY3RuZXNzKFwibWF4XCIsIGwubWF4LCByLm1pbikgPT09IFwibFwiID8gc3RhdGUuYWRkRGlzam9pbnQoXCJyYW5nZVwiLCBsLCByKSA6IHtcbiAgICAgICAgICAgICAgICBtaW46IHIubWluLFxuICAgICAgICAgICAgICAgIG1heDogbC5tYXhcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHI7XG4gICAgfVxuICAgIHJldHVybiBzdHJpY3Rlck1heCA9PT0gXCJsXCIgPyBsIDogc3RyaWN0ZXJNYXggPT09IFwiclwiID8gciA6IGVxdWFsaXR5KCk7XG59KTtcbmNvbnN0IHJhbmdlQWxsb3dzID0gKHJhbmdlLCBuKT0+aXNFcXVhbGl0eVJhbmdlKHJhbmdlKSA/IG4gPT09IHJhbmdlLmxpbWl0IDogbWluQWxsb3dzKHJhbmdlLm1pbiwgbikgJiYgbWF4QWxsb3dzKHJhbmdlLm1heCwgbik7XG5jb25zdCBtaW5BbGxvd3MgPSAobWluLCBuKT0+IW1pbiB8fCBuID4gbWluLmxpbWl0IHx8IG4gPT09IG1pbi5saW1pdCAmJiAhaXNFeGNsdXNpdmUobWluLmNvbXBhcmF0b3IpO1xuY29uc3QgbWF4QWxsb3dzID0gKG1heCwgbik9PiFtYXggfHwgbiA8IG1heC5saW1pdCB8fCBuID09PSBtYXgubGltaXQgJiYgIWlzRXhjbHVzaXZlKG1heC5jb21wYXJhdG9yKTtcbmV4cG9ydCBjb25zdCBmbGF0dGVuUmFuZ2UgPSAoZW50cmllcywgcmFuZ2UsIGN0eCk9PntcbiAgICBjb25zdCB1bml0cyA9IGN0eC5sYXN0RG9tYWluID09PSBcInN0cmluZ1wiID8gXCJjaGFyYWN0ZXJzXCIgOiBjdHgubGFzdERvbWFpbiA9PT0gXCJvYmplY3RcIiA/IFwiaXRlbXMgbG9uZ1wiIDogdW5kZWZpbmVkO1xuICAgIGlmIChpc0VxdWFsaXR5UmFuZ2UocmFuZ2UpKSB7XG4gICAgICAgIHJldHVybiBlbnRyaWVzLnB1c2goW1xuICAgICAgICAgICAgXCJib3VuZFwiLFxuICAgICAgICAgICAgdW5pdHMgPyB7XG4gICAgICAgICAgICAgICAgLi4ucmFuZ2UsXG4gICAgICAgICAgICAgICAgdW5pdHNcbiAgICAgICAgICAgIH0gOiByYW5nZVxuICAgICAgICBdKTtcbiAgICB9XG4gICAgaWYgKHJhbmdlLm1pbikge1xuICAgICAgICBlbnRyaWVzLnB1c2goW1xuICAgICAgICAgICAgXCJib3VuZFwiLFxuICAgICAgICAgICAgdW5pdHMgPyB7XG4gICAgICAgICAgICAgICAgLi4ucmFuZ2UubWluLFxuICAgICAgICAgICAgICAgIHVuaXRzXG4gICAgICAgICAgICB9IDogcmFuZ2UubWluXG4gICAgICAgIF0pO1xuICAgIH1cbiAgICBpZiAocmFuZ2UubWF4KSB7XG4gICAgICAgIGVudHJpZXMucHVzaChbXG4gICAgICAgICAgICBcImJvdW5kXCIsXG4gICAgICAgICAgICB1bml0cyA/IHtcbiAgICAgICAgICAgICAgICAuLi5yYW5nZS5tYXgsXG4gICAgICAgICAgICAgICAgdW5pdHNcbiAgICAgICAgICAgIH0gOiByYW5nZS5tYXhcbiAgICAgICAgXSk7XG4gICAgfVxufTtcbmV4cG9ydCBjb25zdCBjaGVja0JvdW5kID0gKGJvdW5kLCBzdGF0ZSk9PmNvbXBhcmF0b3JDaGVja2Vyc1tib3VuZC5jb21wYXJhdG9yXShzaXplT2Yoc3RhdGUuZGF0YSksIGJvdW5kLmxpbWl0KSB8fCAhc3RhdGUucHJvYmxlbXMuYWRkKFwiYm91bmRcIiwgYm91bmQpO1xuY29uc3QgY29tcGFyYXRvckNoZWNrZXJzID0ge1xuICAgIFwiPFwiOiAoc2l6ZSwgbGltaXQpPT5zaXplIDwgbGltaXQsXG4gICAgXCI+XCI6IChzaXplLCBsaW1pdCk9PnNpemUgPiBsaW1pdCxcbiAgICBcIjw9XCI6IChzaXplLCBsaW1pdCk9PnNpemUgPD0gbGltaXQsXG4gICAgXCI+PVwiOiAoc2l6ZSwgbGltaXQpPT5zaXplID49IGxpbWl0LFxuICAgIFwiPT1cIjogKHNpemUsIGxpbWl0KT0+c2l6ZSA9PT0gbGltaXRcbn07XG5leHBvcnQgY29uc3QgY29tcGFyZVN0cmljdG5lc3MgPSAoa2luZCwgbCwgcik9PiFsID8gIXIgPyBcIj1cIiA6IFwiclwiIDogIXIgPyBcImxcIiA6IGwubGltaXQgPT09IHIubGltaXQgPyBpc0V4Y2x1c2l2ZShsLmNvbXBhcmF0b3IpID8gaXNFeGNsdXNpdmUoci5jb21wYXJhdG9yKSA/IFwiPVwiIDogXCJsXCIgOiBpc0V4Y2x1c2l2ZShyLmNvbXBhcmF0b3IpID8gXCJyXCIgOiBcIj1cIiA6IGtpbmQgPT09IFwibWluXCIgPyBsLmxpbWl0ID4gci5saW1pdCA/IFwibFwiIDogXCJyXCIgOiBsLmxpbWl0IDwgci5saW1pdCA/IFwibFwiIDogXCJyXCI7XG5jb25zdCBpc0V4Y2x1c2l2ZSA9IChjb21wYXJhdG9yKT0+Y29tcGFyYXRvci5sZW5ndGggPT09IDE7XG4iLCAiaW1wb3J0IHsgY29tcG9zZUludGVyc2VjdGlvbiB9IGZyb20gXCIuLi9jb21wb3NlLmpzXCI7XG5pbXBvcnQgeyBjb2xsYXBzaWJsZUxpc3RVbmlvbiB9IGZyb20gXCIuL2NvbGxhcHNpYmxlU2V0LmpzXCI7XG5jb25zdCByZWdleENhY2hlID0ge307XG5leHBvcnQgY29uc3QgZ2V0UmVnZXggPSAoc291cmNlKT0+e1xuICAgIGlmICghcmVnZXhDYWNoZVtzb3VyY2VdKSB7XG4gICAgICAgIHJlZ2V4Q2FjaGVbc291cmNlXSA9IG5ldyBSZWdFeHAoc291cmNlKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlZ2V4Q2FjaGVbc291cmNlXTtcbn07XG5leHBvcnQgY29uc3QgY2hlY2tSZWdleCA9IChzb3VyY2UsIHN0YXRlKT0+Z2V0UmVnZXgoc291cmNlKS50ZXN0KHN0YXRlLmRhdGEpIHx8ICFzdGF0ZS5wcm9ibGVtcy5hZGQoXCJyZWdleFwiLCBgLyR7c291cmNlfS9gKTtcbmV4cG9ydCBjb25zdCByZWdleEludGVyc2VjdGlvbiA9IGNvbXBvc2VJbnRlcnNlY3Rpb24oY29sbGFwc2libGVMaXN0VW5pb24pO1xuIiwgImltcG9ydCB7IGxpc3RGcm9tIH0gZnJvbSBcIi4uLy4uL3V0aWxzL2dlbmVyaWNzLmpzXCI7XG5pbXBvcnQgeyBjb21wb3NlSW50ZXJzZWN0aW9uLCBjb21wb3NlS2V5ZWRJbnRlcnNlY3Rpb24sIGVxdWFsaXR5IH0gZnJvbSBcIi4uL2NvbXBvc2UuanNcIjtcbmltcG9ydCB7IGNsYXNzSW50ZXJzZWN0aW9uIH0gZnJvbSBcIi4vY2xhc3MuanNcIjtcbmltcG9ydCB7IGNvbGxhcHNpYmxlTGlzdFVuaW9uIH0gZnJvbSBcIi4vY29sbGFwc2libGVTZXQuanNcIjtcbmltcG9ydCB7IGRpdmlzb3JJbnRlcnNlY3Rpb24gfSBmcm9tIFwiLi9kaXZpc29yLmpzXCI7XG5pbXBvcnQgeyBmbGF0dGVuUHJvcHMsIHByb3BzSW50ZXJzZWN0aW9uIH0gZnJvbSBcIi4vcHJvcHMuanNcIjtcbmltcG9ydCB7IGZsYXR0ZW5SYW5nZSwgcmFuZ2VJbnRlcnNlY3Rpb24gfSBmcm9tIFwiLi9yYW5nZS5qc1wiO1xuaW1wb3J0IHsgcmVnZXhJbnRlcnNlY3Rpb24gfSBmcm9tIFwiLi9yZWdleC5qc1wiO1xuZXhwb3J0IGNvbnN0IHJ1bGVzSW50ZXJzZWN0aW9uID0gKGwsIHIsIHN0YXRlKT0+XCJ2YWx1ZVwiIGluIGwgPyBcInZhbHVlXCIgaW4gciA/IGwudmFsdWUgPT09IHIudmFsdWUgPyBlcXVhbGl0eSgpIDogc3RhdGUuYWRkRGlzam9pbnQoXCJ2YWx1ZVwiLCBsLnZhbHVlLCByLnZhbHVlKSA6IGxpdGVyYWxTYXRpc2ZpZXNSdWxlcyhsLnZhbHVlLCByLCBzdGF0ZSkgPyBsIDogc3RhdGUuYWRkRGlzam9pbnQoXCJsZWZ0QXNzaWduYWJpbGl0eVwiLCBsLCByKSA6IFwidmFsdWVcIiBpbiByID8gbGl0ZXJhbFNhdGlzZmllc1J1bGVzKHIudmFsdWUsIGwsIHN0YXRlKSA/IHIgOiBzdGF0ZS5hZGREaXNqb2ludChcInJpZ2h0QXNzaWduYWJpbGl0eVwiLCBsLCByKSA6IG5hcnJvd2FibGVSdWxlc0ludGVyc2VjdGlvbihsLCByLCBzdGF0ZSk7XG5jb25zdCBuYXJyb3dJbnRlcnNlY3Rpb24gPSBjb21wb3NlSW50ZXJzZWN0aW9uKGNvbGxhcHNpYmxlTGlzdFVuaW9uKTtcbmV4cG9ydCBjb25zdCBuYXJyb3dhYmxlUnVsZXNJbnRlcnNlY3Rpb24gPSBjb21wb3NlS2V5ZWRJbnRlcnNlY3Rpb24oe1xuICAgIGRpdmlzb3I6IGRpdmlzb3JJbnRlcnNlY3Rpb24sXG4gICAgcmVnZXg6IHJlZ2V4SW50ZXJzZWN0aW9uLFxuICAgIHByb3BzOiBwcm9wc0ludGVyc2VjdGlvbixcbiAgICBjbGFzczogY2xhc3NJbnRlcnNlY3Rpb24sXG4gICAgcmFuZ2U6IHJhbmdlSW50ZXJzZWN0aW9uLFxuICAgIG5hcnJvdzogbmFycm93SW50ZXJzZWN0aW9uXG59LCB7XG4gICAgb25FbXB0eTogXCJidWJibGVcIlxufSk7XG5leHBvcnQgY29uc3QgZmxhdHRlblJ1bGVzID0gKHJ1bGVzLCBjdHgpPT57XG4gICAgY29uc3QgZW50cmllcyA9IFtdO1xuICAgIGxldCBrO1xuICAgIGZvcihrIGluIHJ1bGVzKXtcbiAgICAgICAgcnVsZUZsYXR0ZW5lcnNba10oZW50cmllcywgcnVsZXNba10sIGN0eCk7XG4gICAgfVxuICAgIC8vIFNvbWUgZW50cmllcyB3aXRoIHRoZSBzYW1lIHByZWNlZGVuY2UsIGUuZy4gbW9ycGhzIGZsYXR0ZW5lZCBmcm9tIGEgbGlzdCxcbiAgICAvLyByZWx5IG9uIHRoZSBmYWN0IHRoYXQgSlMncyBidWlsdGluIHNvcnQgaXMgc3RhYmxlIHRvIGJlaGF2ZSBhcyBleHBlY3RlZFxuICAgIC8vIHdoZW4gdHJhdmVyc2VkOlxuICAgIC8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0phdmFTY3JpcHQvUmVmZXJlbmNlL0dsb2JhbF9PYmplY3RzL0FycmF5L3NvcnRcbiAgICByZXR1cm4gZW50cmllcy5zb3J0KChsLCByKT0+cHJlY2VkZW5jZU1hcFtsWzBdXSAtIHByZWNlZGVuY2VNYXBbclswXV0pO1xufTtcbmNvbnN0IHJ1bGVGbGF0dGVuZXJzID0ge1xuICAgIHJlZ2V4OiAoZW50cmllcywgcnVsZSk9PntcbiAgICAgICAgZm9yIChjb25zdCBzb3VyY2Ugb2YgbGlzdEZyb20ocnVsZSkpe1xuICAgICAgICAgICAgZW50cmllcy5wdXNoKFtcbiAgICAgICAgICAgICAgICBcInJlZ2V4XCIsXG4gICAgICAgICAgICAgICAgc291cmNlXG4gICAgICAgICAgICBdKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgZGl2aXNvcjogKGVudHJpZXMsIHJ1bGUpPT57XG4gICAgICAgIGVudHJpZXMucHVzaChbXG4gICAgICAgICAgICBcImRpdmlzb3JcIixcbiAgICAgICAgICAgIHJ1bGVcbiAgICAgICAgXSk7XG4gICAgfSxcbiAgICByYW5nZTogZmxhdHRlblJhbmdlLFxuICAgIGNsYXNzOiAoZW50cmllcywgcnVsZSk9PntcbiAgICAgICAgZW50cmllcy5wdXNoKFtcbiAgICAgICAgICAgIFwiY2xhc3NcIixcbiAgICAgICAgICAgIHJ1bGVcbiAgICAgICAgXSk7XG4gICAgfSxcbiAgICBwcm9wczogZmxhdHRlblByb3BzLFxuICAgIG5hcnJvdzogKGVudHJpZXMsIHJ1bGUpPT57XG4gICAgICAgIGZvciAoY29uc3QgbmFycm93IG9mIGxpc3RGcm9tKHJ1bGUpKXtcbiAgICAgICAgICAgIGVudHJpZXMucHVzaChbXG4gICAgICAgICAgICAgICAgXCJuYXJyb3dcIixcbiAgICAgICAgICAgICAgICBuYXJyb3dcbiAgICAgICAgICAgIF0pO1xuICAgICAgICB9XG4gICAgfSxcbiAgICB2YWx1ZTogKGVudHJpZXMsIHJ1bGUpPT57XG4gICAgICAgIGVudHJpZXMucHVzaChbXG4gICAgICAgICAgICBcInZhbHVlXCIsXG4gICAgICAgICAgICBydWxlXG4gICAgICAgIF0pO1xuICAgIH1cbn07XG5leHBvcnQgY29uc3QgcHJlY2VkZW5jZU1hcCA9IHtcbiAgICAvLyBDb25maWc6IEFwcGxpZXMgYmVmb3JlIGFueSBjaGVja3NcbiAgICBjb25maWc6IC0xLFxuICAgIC8vIENyaXRpY2FsOiBObyBvdGhlciBjaGVja3MgYXJlIHBlcmZvcm1lZCBpZiB0aGVzZSBmYWlsXG4gICAgZG9tYWluOiAwLFxuICAgIHZhbHVlOiAwLFxuICAgIGRvbWFpbnM6IDAsXG4gICAgYnJhbmNoZXM6IDAsXG4gICAgc3dpdGNoOiAwLFxuICAgIGFsaWFzOiAwLFxuICAgIGNsYXNzOiAwLFxuICAgIC8vIFNoYWxsb3c6IEFsbCBzaGFsbG93IGNoZWNrcyB3aWxsIGJlIHBlcmZvcm1lZCBldmVuIGlmIG9uZSBvciBtb3JlIGZhaWxcbiAgICByZWdleDogMSxcbiAgICBkaXZpc29yOiAxLFxuICAgIGJvdW5kOiAxLFxuICAgIC8vIFByZXJlcXVpc2l0ZTogVGhlc2UgYXJlIGRlZXAgY2hlY2tzIHdpdGggc3BlY2lhbCBwcmlvcml0eSwgZS5nLiB0aGVcbiAgICAvLyBsZW5ndGggb2YgYSB0dXBsZSwgd2hpY2ggY2F1c2VzIG90aGVyIGRlZXAgcHJvcHMgbm90IHRvIGJlIGNoZWNrZWQgaWYgaXRcbiAgICAvLyBpcyBpbnZhbGlkXG4gICAgcHJlcmVxdWlzaXRlUHJvcDogMixcbiAgICAvLyBEZWVwOiBQZXJmb3JtZWQgaWYgYWxsIHNoYWxsb3cgY2hlY2tzIHBhc3MsIGV2ZW4gaWYgb25lIG9yIG1vcmUgZGVlcCBjaGVja3MgZmFpbFxuICAgIGRpc3RpbGxlZFByb3BzOiAzLFxuICAgIHN0cmljdFByb3BzOiAzLFxuICAgIHJlcXVpcmVkUHJvcDogMyxcbiAgICBvcHRpb25hbFByb3A6IDMsXG4gICAgaW5kZXhQcm9wOiAzLFxuICAgIC8vIE5hcnJvdzogT25seSBwZXJmb3JtZWQgaWYgYWxsIHNoYWxsb3cgYW5kIGRlZXAgY2hlY2tzIHBhc3NcbiAgICBuYXJyb3c6IDQsXG4gICAgLy8gTW9ycGg6IE9ubHkgcGVyZm9ybWVkIGlmIGFsbCB2YWxpZGF0aW9uIHBhc3Nlc1xuICAgIG1vcnBoOiA1XG59O1xuZXhwb3J0IGNvbnN0IGxpdGVyYWxTYXRpc2ZpZXNSdWxlcyA9IChkYXRhLCBydWxlcywgc3RhdGUpPT4hc3RhdGUudHlwZS5zY29wZS50eXBlKFtcbiAgICAgICAgXCJub2RlXCIsXG4gICAgICAgIHtcbiAgICAgICAgICAgIFtzdGF0ZS5kb21haW5dOiBydWxlc1xuICAgICAgICB9XG4gICAgXSkoZGF0YSkucHJvYmxlbXM7XG4iLCAiaW1wb3J0IHsgd3JpdGVJbXBsaWNpdE5ldmVyTWVzc2FnZSB9IGZyb20gXCIuLi9wYXJzZS9hc3QvaW50ZXJzZWN0aW9uLmpzXCI7XG5pbXBvcnQgeyBkb21haW5PZiwgaGFzRG9tYWluIH0gZnJvbSBcIi4uL3V0aWxzL2RvbWFpbnMuanNcIjtcbmltcG9ydCB7IHRocm93SW50ZXJuYWxFcnJvciwgdGhyb3dQYXJzZUVycm9yIH0gZnJvbSBcIi4uL3V0aWxzL2Vycm9ycy5qc1wiO1xuaW1wb3J0IHsgaXNEaXNqb2ludCwgaXNFcXVhbGl0eSB9IGZyb20gXCIuL2NvbXBvc2UuanNcIjtcbmltcG9ydCB7IGZsYXR0ZW5SdWxlcywgcnVsZXNJbnRlcnNlY3Rpb24gfSBmcm9tIFwiLi9ydWxlcy9ydWxlcy5qc1wiO1xuZXhwb3J0IGNvbnN0IGlzQnJhbmNoQ29tcGFyaXNvbiA9IChjb21wYXJpc29uKT0+Y29tcGFyaXNvbj8ubEJyYW5jaGVzICE9PSB1bmRlZmluZWQ7XG5leHBvcnQgY29uc3QgY29tcGFyZUJyYW5jaGVzID0gKGxDb25kaXRpb25zLCByQ29uZGl0aW9ucywgc3RhdGUpPT57XG4gICAgY29uc3QgcmVzdWx0ID0ge1xuICAgICAgICBsQnJhbmNoZXM6IGxDb25kaXRpb25zLFxuICAgICAgICByQnJhbmNoZXM6IHJDb25kaXRpb25zLFxuICAgICAgICBsRXh0ZW5kc1I6IFtdLFxuICAgICAgICByRXh0ZW5kc0w6IFtdLFxuICAgICAgICBlcXVhbGl0aWVzOiBbXSxcbiAgICAgICAgZGlzdGluY3RJbnRlcnNlY3Rpb25zOiBbXVxuICAgIH07XG4gICAgY29uc3QgcGFpcnMgPSByQ29uZGl0aW9ucy5tYXAoKGNvbmRpdGlvbik9Pih7XG4gICAgICAgICAgICBjb25kaXRpb24sXG4gICAgICAgICAgICBkaXN0aW5jdDogW11cbiAgICAgICAgfSkpO1xuICAgIGxDb25kaXRpb25zLmZvckVhY2goKGwsIGxJbmRleCk9PntcbiAgICAgICAgbGV0IGxJbXBsaWVzUiA9IGZhbHNlO1xuICAgICAgICBjb25zdCBkaXN0aW5jdCA9IHBhaXJzLm1hcCgoclBhaXJzLCBySW5kZXgpPT57XG4gICAgICAgICAgICBpZiAobEltcGxpZXNSIHx8ICFyUGFpcnMuZGlzdGluY3QpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IHIgPSByUGFpcnMuY29uZGl0aW9uO1xuICAgICAgICAgICAgY29uc3Qgc3VicmVzdWx0ID0gYnJhbmNoSW50ZXJzZWN0aW9uKGwsIHIsIHN0YXRlKTtcbiAgICAgICAgICAgIGlmIChpc0Rpc2pvaW50KHN1YnJlc3VsdCkpIHtcbiAgICAgICAgICAgICAgICAvLyBkb2Vzbid0IHRlbGwgdXMgYWJvdXQgYW55IHJlZHVuZGFuY2llcyBvciBhZGQgYSBkaXN0aW5jdCBwYWlyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHN1YnJlc3VsdCA9PT0gbCkge1xuICAgICAgICAgICAgICAgIHJlc3VsdC5sRXh0ZW5kc1IucHVzaChsSW5kZXgpO1xuICAgICAgICAgICAgICAgIC8vIElmIGwgaXMgYSBzdWJ0eXBlIG9mIHRoZSBjdXJyZW50IHIgYnJhbmNoLCBpbnRlcnNlY3Rpb25zXG4gICAgICAgICAgICAgICAgLy8gd2l0aCB0aGUgcmVtYWluaW5nIGJyYW5jaGVzIG9mIHIgd29uJ3QgbGVhZCB0byBkaXN0aW5jdFxuICAgICAgICAgICAgICAgIC8vIGJyYW5jaGVzLCBzbyB3ZSBzZXQgYSBmbGFnIGluZGljYXRpbmcgd2UgY2FuIHNraXAgdGhlbS5cbiAgICAgICAgICAgICAgICBsSW1wbGllc1IgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChzdWJyZXN1bHQgPT09IHIpIHtcbiAgICAgICAgICAgICAgICByZXN1bHQuckV4dGVuZHNMLnB1c2gockluZGV4KTtcbiAgICAgICAgICAgICAgICAvLyBJZiByIGlzIGEgc3VidHlwZSBvZiB0aGUgY3VycmVudCBsIGJyYW5jaCwgaXQgaXMgcmVtb3ZlZFxuICAgICAgICAgICAgICAgIC8vIGZyb20gcGFpcnNCeVIgYmVjYXVzZSBmdXR1cmUgaW50ZXJzZWN0aW9ucyB3b24ndCBsZWFkIHRvXG4gICAgICAgICAgICAgICAgLy8gZGlzdGluY3QgYnJhbmNoZXMuXG4gICAgICAgICAgICAgICAgclBhaXJzLmRpc3RpbmN0ID0gbnVsbDtcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoaXNFcXVhbGl0eShzdWJyZXN1bHQpKSB7XG4gICAgICAgICAgICAgICAgLy8gQ29tYmluYXRpb24gb2YgbCBhbmQgciBzdWJ0eXBlIGNhc2VzLlxuICAgICAgICAgICAgICAgIHJlc3VsdC5lcXVhbGl0aWVzLnB1c2goW1xuICAgICAgICAgICAgICAgICAgICBsSW5kZXgsXG4gICAgICAgICAgICAgICAgICAgIHJJbmRleFxuICAgICAgICAgICAgICAgIF0pO1xuICAgICAgICAgICAgICAgIGxJbXBsaWVzUiA9IHRydWU7XG4gICAgICAgICAgICAgICAgclBhaXJzLmRpc3RpbmN0ID0gbnVsbDtcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoaGFzRG9tYWluKHN1YnJlc3VsdCwgXCJvYmplY3RcIikpIHtcbiAgICAgICAgICAgICAgICAvLyBOZWl0aGVyIGJyYW5jaCBpcyBhIHN1YnR5cGUgb2YgdGhlIG90aGVyLCByZXR1cm5cbiAgICAgICAgICAgICAgICAvLyB0aGUgcmVzdWx0IG9mIHRoZSBpbnRlcnNlY3Rpb24gYXMgYSBjYW5kaWRhdGVcbiAgICAgICAgICAgICAgICAvLyBicmFuY2ggZm9yIHRoZSBmaW5hbCB1bmlvblxuICAgICAgICAgICAgICAgIHJldHVybiBzdWJyZXN1bHQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdGhyb3dJbnRlcm5hbEVycm9yKGBVbmV4cGVjdGVkIHByZWRpY2F0ZSBpbnRlcnNlY3Rpb24gcmVzdWx0IG9mIHR5cGUgJyR7ZG9tYWluT2Yoc3VicmVzdWx0KX0nYCk7XG4gICAgICAgIH0pO1xuICAgICAgICBpZiAoIWxJbXBsaWVzUikge1xuICAgICAgICAgICAgZm9yKGxldCBpID0gMDsgaSA8IHBhaXJzLmxlbmd0aDsgaSsrKXtcbiAgICAgICAgICAgICAgICBpZiAoZGlzdGluY3RbaV0pIHtcbiAgICAgICAgICAgICAgICAgICAgcGFpcnNbaV0uZGlzdGluY3Q/LnB1c2goZGlzdGluY3RbaV0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pO1xuICAgIHJlc3VsdC5kaXN0aW5jdEludGVyc2VjdGlvbnMgPSBwYWlycy5mbGF0TWFwKChwYWlycyk9PnBhaXJzLmRpc3RpbmN0ID8/IFtdKTtcbiAgICByZXR1cm4gcmVzdWx0O1xufTtcbmV4cG9ydCBjb25zdCBpc1RyYW5zZm9ybWF0aW9uQnJhbmNoID0gKGJyYW5jaCk9PlwicnVsZXNcIiBpbiBicmFuY2g7XG5leHBvcnQgY29uc3QgZmxhdHRlbkJyYW5jaCA9IChicmFuY2gsIGN0eCk9PntcbiAgICBpZiAoaXNUcmFuc2Zvcm1hdGlvbkJyYW5jaChicmFuY2gpKSB7XG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IGZsYXR0ZW5SdWxlcyhicmFuY2gucnVsZXMsIGN0eCk7XG4gICAgICAgIGlmIChicmFuY2gubW9ycGgpIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgYnJhbmNoLm1vcnBoID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgICAgICByZXN1bHQucHVzaChbXG4gICAgICAgICAgICAgICAgICAgIFwibW9ycGhcIixcbiAgICAgICAgICAgICAgICAgICAgYnJhbmNoLm1vcnBoXG4gICAgICAgICAgICAgICAgXSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGZvciAoY29uc3QgbW9ycGggb2YgYnJhbmNoLm1vcnBoKXtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0LnB1c2goW1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJtb3JwaFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgbW9ycGhcbiAgICAgICAgICAgICAgICAgICAgXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuICAgIHJldHVybiBmbGF0dGVuUnVsZXMoYnJhbmNoLCBjdHgpO1xufTtcbmNvbnN0IHJ1bGVzT2YgPSAoYnJhbmNoKT0+YnJhbmNoLnJ1bGVzID8/IGJyYW5jaDtcbmV4cG9ydCBjb25zdCBicmFuY2hJbnRlcnNlY3Rpb24gPSAobCwgciwgc3RhdGUpPT57XG4gICAgY29uc3QgbFJ1bGVzID0gcnVsZXNPZihsKTtcbiAgICBjb25zdCByUnVsZXMgPSBydWxlc09mKHIpO1xuICAgIGNvbnN0IHJ1bGVzUmVzdWx0ID0gcnVsZXNJbnRlcnNlY3Rpb24obFJ1bGVzLCByUnVsZXMsIHN0YXRlKTtcbiAgICBpZiAoXCJtb3JwaFwiIGluIGwpIHtcbiAgICAgICAgaWYgKFwibW9ycGhcIiBpbiByKSB7XG4gICAgICAgICAgICBpZiAobC5tb3JwaCA9PT0gci5tb3JwaCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBpc0VxdWFsaXR5KHJ1bGVzUmVzdWx0KSB8fCBpc0Rpc2pvaW50KHJ1bGVzUmVzdWx0KSA/IHJ1bGVzUmVzdWx0IDoge1xuICAgICAgICAgICAgICAgICAgICBydWxlczogcnVsZXNSZXN1bHQsXG4gICAgICAgICAgICAgICAgICAgIG1vcnBoOiBsLm1vcnBoXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBzdGF0ZS5sYXN0T3BlcmF0b3IgPT09IFwiJlwiID8gdGhyb3dQYXJzZUVycm9yKHdyaXRlSW1wbGljaXROZXZlck1lc3NhZ2Uoc3RhdGUucGF0aCwgXCJJbnRlcnNlY3Rpb25cIiwgXCJvZiBtb3JwaHNcIikpIDoge307XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGlzRGlzam9pbnQocnVsZXNSZXN1bHQpID8gcnVsZXNSZXN1bHQgOiB7XG4gICAgICAgICAgICBydWxlczogaXNFcXVhbGl0eShydWxlc1Jlc3VsdCkgPyBsLnJ1bGVzIDogcnVsZXNSZXN1bHQsXG4gICAgICAgICAgICBtb3JwaDogbC5tb3JwaFxuICAgICAgICB9O1xuICAgIH1cbiAgICBpZiAoXCJtb3JwaFwiIGluIHIpIHtcbiAgICAgICAgcmV0dXJuIGlzRGlzam9pbnQocnVsZXNSZXN1bHQpID8gcnVsZXNSZXN1bHQgOiB7XG4gICAgICAgICAgICBydWxlczogaXNFcXVhbGl0eShydWxlc1Jlc3VsdCkgPyByLnJ1bGVzIDogcnVsZXNSZXN1bHQsXG4gICAgICAgICAgICBtb3JwaDogci5tb3JwaFxuICAgICAgICB9O1xuICAgIH1cbiAgICByZXR1cm4gcnVsZXNSZXN1bHQ7XG59O1xuIiwgImV4cG9ydCBjb25zdCB3cml0ZVVuZGlzY3JpbWluYXRhYmxlTW9ycGhVbmlvbk1lc3NhZ2UgPSAocGF0aCk9PmAke3BhdGggPT09IFwiL1wiID8gXCJBXCIgOiBgQXQgJHtwYXRofSwgYWB9IHVuaW9uIGluY2x1ZGluZyBvbmUgb3IgbW9yZSBtb3JwaHMgbXVzdCBiZSBkaXNjcmltaW5hdGFibGVgO1xuIiwgImltcG9ydCB7IHdyaXRlVW5kaXNjcmltaW5hdGFibGVNb3JwaFVuaW9uTWVzc2FnZSB9IGZyb20gXCIuLi9wYXJzZS9hc3QvdW5pb24uanNcIjtcbmltcG9ydCB7IGRvbWFpbk9mIH0gZnJvbSBcIi4uL3V0aWxzL2RvbWFpbnMuanNcIjtcbmltcG9ydCB7IHRocm93SW50ZXJuYWxFcnJvciwgdGhyb3dQYXJzZUVycm9yIH0gZnJvbSBcIi4uL3V0aWxzL2Vycm9ycy5qc1wiO1xuaW1wb3J0IHsgaXNLZXlPZiwga2V5Q291bnQsIG9iamVjdEtleXNPZiB9IGZyb20gXCIuLi91dGlscy9nZW5lcmljcy5qc1wiO1xuaW1wb3J0IHsgZ2V0RXhhY3RDb25zdHJ1Y3Rvck9iamVjdEtpbmQsIGlzQXJyYXksIG9iamVjdEtpbmRPZiB9IGZyb20gXCIuLi91dGlscy9vYmplY3RLaW5kcy5qc1wiO1xuaW1wb3J0IHsgUGF0aCB9IGZyb20gXCIuLi91dGlscy9wYXRocy5qc1wiO1xuaW1wb3J0IHsgc2VyaWFsaXplUHJpbWl0aXZlIH0gZnJvbSBcIi4uL3V0aWxzL3NlcmlhbGl6ZS5qc1wiO1xuaW1wb3J0IHsgYnJhbmNoSW50ZXJzZWN0aW9uLCBmbGF0dGVuQnJhbmNoIH0gZnJvbSBcIi4vYnJhbmNoLmpzXCI7XG5pbXBvcnQgeyBJbnRlcnNlY3Rpb25TdGF0ZSB9IGZyb20gXCIuL2NvbXBvc2UuanNcIjtcbmltcG9ydCB7IG1hcHBlZEtleXMsIHByb3BUb05vZGUgfSBmcm9tIFwiLi9ydWxlcy9wcm9wcy5qc1wiO1xuZXhwb3J0IGNvbnN0IGZsYXR0ZW5CcmFuY2hlcyA9IChicmFuY2hlcywgY3R4KT0+e1xuICAgIGNvbnN0IGRpc2NyaW1pbmFudHMgPSBjYWxjdWxhdGVEaXNjcmltaW5hbnRzKGJyYW5jaGVzLCBjdHgpO1xuICAgIGNvbnN0IGluZGljZXMgPSBicmFuY2hlcy5tYXAoKF8sIGkpPT5pKTtcbiAgICByZXR1cm4gZGlzY3JpbWluYXRlKGJyYW5jaGVzLCBpbmRpY2VzLCBkaXNjcmltaW5hbnRzLCBjdHgpO1xufTtcbmNvbnN0IGRpc2NyaW1pbmF0ZSA9IChvcmlnaW5hbEJyYW5jaGVzLCByZW1haW5pbmdJbmRpY2VzLCBkaXNjcmltaW5hbnRzLCBjdHgpPT57XG4gICAgaWYgKHJlbWFpbmluZ0luZGljZXMubGVuZ3RoID09PSAxKSB7XG4gICAgICAgIHJldHVybiBmbGF0dGVuQnJhbmNoKG9yaWdpbmFsQnJhbmNoZXNbcmVtYWluaW5nSW5kaWNlc1swXV0sIGN0eCk7XG4gICAgfVxuICAgIGNvbnN0IGJlc3REaXNjcmltaW5hbnQgPSBmaW5kQmVzdERpc2NyaW1pbmFudChyZW1haW5pbmdJbmRpY2VzLCBkaXNjcmltaW5hbnRzKTtcbiAgICBpZiAoIWJlc3REaXNjcmltaW5hbnQpIHtcbiAgICAgICAgcmV0dXJuIFtcbiAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICBcImJyYW5jaGVzXCIsXG4gICAgICAgICAgICAgICAgcmVtYWluaW5nSW5kaWNlcy5tYXAoKGkpPT5icmFuY2hJbmNsdWRlc01vcnBoKG9yaWdpbmFsQnJhbmNoZXNbaV0sIGN0eC50eXBlLnNjb3BlKSA/IHRocm93UGFyc2VFcnJvcih3cml0ZVVuZGlzY3JpbWluYXRhYmxlTW9ycGhVbmlvbk1lc3NhZ2UoYCR7Y3R4LnBhdGh9YCkpIDogZmxhdHRlbkJyYW5jaChvcmlnaW5hbEJyYW5jaGVzW2ldLCBjdHgpKVxuICAgICAgICAgICAgXVxuICAgICAgICBdO1xuICAgIH1cbiAgICBjb25zdCBjYXNlcyA9IHt9O1xuICAgIGZvcihjb25zdCBjYXNlS2V5IGluIGJlc3REaXNjcmltaW5hbnQuaW5kZXhDYXNlcyl7XG4gICAgICAgIGNvbnN0IG5leHRJbmRpY2VzID0gYmVzdERpc2NyaW1pbmFudC5pbmRleENhc2VzW2Nhc2VLZXldO1xuICAgICAgICBjYXNlc1tjYXNlS2V5XSA9IGRpc2NyaW1pbmF0ZShvcmlnaW5hbEJyYW5jaGVzLCBuZXh0SW5kaWNlcywgZGlzY3JpbWluYW50cywgY3R4KTtcbiAgICAgICAgaWYgKGNhc2VLZXkgIT09IFwiZGVmYXVsdFwiKSB7XG4gICAgICAgICAgICBwcnVuZURpc2NyaW1pbmFudChjYXNlc1tjYXNlS2V5XSwgYmVzdERpc2NyaW1pbmFudC5wYXRoLCBiZXN0RGlzY3JpbWluYW50LCBjdHgpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBbXG4gICAgICAgIFtcbiAgICAgICAgICAgIFwic3dpdGNoXCIsXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgcGF0aDogYmVzdERpc2NyaW1pbmFudC5wYXRoLFxuICAgICAgICAgICAgICAgIGtpbmQ6IGJlc3REaXNjcmltaW5hbnQua2luZCxcbiAgICAgICAgICAgICAgICBjYXNlc1xuICAgICAgICAgICAgfVxuICAgICAgICBdXG4gICAgXTtcbn07XG5jb25zdCBwcnVuZURpc2NyaW1pbmFudCA9IChlbnRyaWVzLCBzZWdtZW50cywgZGlzY3JpbWluYW50LCBjdHgpPT57XG4gICAgZm9yKGxldCBpID0gMDsgaSA8IGVudHJpZXMubGVuZ3RoOyBpKyspe1xuICAgICAgICBjb25zdCBbaywgdl0gPSBlbnRyaWVzW2ldO1xuICAgICAgICBpZiAoIXNlZ21lbnRzLmxlbmd0aCkge1xuICAgICAgICAgICAgaWYgKGRpc2NyaW1pbmFudC5raW5kID09PSBcImRvbWFpblwiKSB7XG4gICAgICAgICAgICAgICAgaWYgKGsgPT09IFwiZG9tYWluXCIgfHwgayA9PT0gXCJkb21haW5zXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgZW50cmllcy5zcGxpY2UoaSwgMSk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGsgPT09IFwiY2xhc3NcIiB8fCBrID09PSBcInZhbHVlXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gdGhlc2Uga2V5cyBpbXBseSBhIGRvbWFpbiwgYnV0IGFsc28gYWRkIGFkZGl0aW9uYWxcbiAgICAgICAgICAgICAgICAgICAgLy8gaW5mb3JtYXRpb24sIHNvIGNhbid0IGJlIHBydW5lZFxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmIChkaXNjcmltaW5hbnQua2luZCA9PT0gaykge1xuICAgICAgICAgICAgICAgIGVudHJpZXMuc3BsaWNlKGksIDEpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmICgoayA9PT0gXCJyZXF1aXJlZFByb3BcIiB8fCBrID09PSBcInByZXJlcXVpc2l0ZVByb3BcIiB8fCBrID09PSBcIm9wdGlvbmFsUHJvcFwiKSAmJiB2WzBdID09PSBzZWdtZW50c1swXSkge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiB2WzFdID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAgICAgICAgICAgaWYgKGRpc2NyaW1pbmFudC5raW5kICE9PSBcImRvbWFpblwiKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aHJvd0ludGVybmFsUHJ1bmVGYWlsdXJlKGRpc2NyaW1pbmFudCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVudHJpZXMuc3BsaWNlKGksIDEpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHBydW5lRGlzY3JpbWluYW50KHZbMV0sIHNlZ21lbnRzLnNsaWNlKDEpLCBkaXNjcmltaW5hbnQsIGN0eCk7XG4gICAgICAgICAgICBpZiAodlsxXS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICBlbnRyaWVzLnNwbGljZShpLCAxKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICAvLyBjaGVjayBmb3IgYnJhbmNoIGtleXMsIHdoaWNoIG11c3QgYmUgdHJhdmVyc2VkIGV2ZW4gaWYgdGhlcmUgYXJlIG5vXG4gICAgICAgIC8vIHNlZ21lbnRzIGxlZnRcbiAgICAgICAgaWYgKGsgPT09IFwiZG9tYWluc1wiKSB7XG4gICAgICAgICAgICAvKiBjOCBpZ25vcmUgbmV4dCAqLyBpZiAoa2V5Q291bnQodikgIT09IDEgfHwgIXYub2JqZWN0KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRocm93SW50ZXJuYWxQcnVuZUZhaWx1cmUoZGlzY3JpbWluYW50KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHBydW5lRGlzY3JpbWluYW50KHYub2JqZWN0LCBzZWdtZW50cywgZGlzY3JpbWluYW50LCBjdHgpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9IGVsc2UgaWYgKGsgPT09IFwic3dpdGNoXCIpIHtcbiAgICAgICAgICAgIGZvcihjb25zdCBjYXNlS2V5IGluIHYuY2FzZXMpe1xuICAgICAgICAgICAgICAgIHBydW5lRGlzY3JpbWluYW50KHYuY2FzZXNbY2FzZUtleV0sIHNlZ21lbnRzLCBkaXNjcmltaW5hbnQsIGN0eCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH0gZWxzZSBpZiAoayA9PT0gXCJicmFuY2hlc1wiKSB7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IGJyYW5jaCBvZiB2KXtcbiAgICAgICAgICAgICAgICBwcnVuZURpc2NyaW1pbmFudChicmFuY2gsIHNlZ21lbnRzLCBkaXNjcmltaW5hbnQsIGN0eCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRocm93SW50ZXJuYWxQcnVuZUZhaWx1cmUoZGlzY3JpbWluYW50KTtcbn07XG5jb25zdCB0aHJvd0ludGVybmFsUHJ1bmVGYWlsdXJlID0gKGRpc2NyaW1pbmFudCk9PnRocm93SW50ZXJuYWxFcnJvcihgVW5leHBlY3RlZGx5IGZhaWxlZCB0byBkaXNjcmltaW5hdGUgJHtkaXNjcmltaW5hbnQua2luZH0gYXQgcGF0aCAnJHtkaXNjcmltaW5hbnQucGF0aH0nYCk7XG5jb25zdCBkaXNjcmltaW5hbnRLaW5kcyA9IHtcbiAgICBkb21haW46IHRydWUsXG4gICAgY2xhc3M6IHRydWUsXG4gICAgdmFsdWU6IHRydWVcbn07XG5jb25zdCBjYWxjdWxhdGVEaXNjcmltaW5hbnRzID0gKGJyYW5jaGVzLCBjdHgpPT57XG4gICAgY29uc3QgZGlzY3JpbWluYW50cyA9IHtcbiAgICAgICAgZGlzam9pbnRzQnlQYWlyOiB7fSxcbiAgICAgICAgY2FzZXNCeURpc2pvaW50OiB7fVxuICAgIH07XG4gICAgZm9yKGxldCBsSW5kZXggPSAwOyBsSW5kZXggPCBicmFuY2hlcy5sZW5ndGggLSAxOyBsSW5kZXgrKyl7XG4gICAgICAgIGZvcihsZXQgckluZGV4ID0gbEluZGV4ICsgMTsgckluZGV4IDwgYnJhbmNoZXMubGVuZ3RoOyBySW5kZXgrKyl7XG4gICAgICAgICAgICBjb25zdCBwYWlyS2V5ID0gYCR7bEluZGV4fS8ke3JJbmRleH1gO1xuICAgICAgICAgICAgY29uc3QgcGFpckRpc2pvaW50cyA9IFtdO1xuICAgICAgICAgICAgZGlzY3JpbWluYW50cy5kaXNqb2ludHNCeVBhaXJbcGFpcktleV0gPSBwYWlyRGlzam9pbnRzO1xuICAgICAgICAgICAgY29uc3QgaW50ZXJzZWN0aW9uU3RhdGUgPSBuZXcgSW50ZXJzZWN0aW9uU3RhdGUoY3R4LnR5cGUsIFwifFwiKTtcbiAgICAgICAgICAgIGJyYW5jaEludGVyc2VjdGlvbihicmFuY2hlc1tsSW5kZXhdLCBicmFuY2hlc1tySW5kZXhdLCBpbnRlcnNlY3Rpb25TdGF0ZSk7XG4gICAgICAgICAgICBmb3IoY29uc3QgcGF0aCBpbiBpbnRlcnNlY3Rpb25TdGF0ZS5kaXNqb2ludHMpe1xuICAgICAgICAgICAgICAgIGlmIChwYXRoLmluY2x1ZGVzKG1hcHBlZEtleXMuaW5kZXgpKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjb25zdCB7IGwgLCByICwga2luZCAgfSA9IGludGVyc2VjdGlvblN0YXRlLmRpc2pvaW50c1twYXRoXTtcbiAgICAgICAgICAgICAgICBpZiAoIWlzS2V5T2Yoa2luZCwgZGlzY3JpbWluYW50S2luZHMpKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjb25zdCBsU2VyaWFsaXplZCA9IHNlcmlhbGl6ZURlZmluaXRpb25JZkFsbG93ZWQoa2luZCwgbCk7XG4gICAgICAgICAgICAgICAgY29uc3QgclNlcmlhbGl6ZWQgPSBzZXJpYWxpemVEZWZpbml0aW9uSWZBbGxvd2VkKGtpbmQsIHIpO1xuICAgICAgICAgICAgICAgIGlmIChsU2VyaWFsaXplZCA9PT0gdW5kZWZpbmVkIHx8IHJTZXJpYWxpemVkID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNvbnN0IHF1YWxpZmllZERpc2pvaW50ID0gcGF0aCA9PT0gXCIvXCIgPyBraW5kIDogYCR7cGF0aH0vJHtraW5kfWA7XG4gICAgICAgICAgICAgICAgcGFpckRpc2pvaW50cy5wdXNoKHF1YWxpZmllZERpc2pvaW50KTtcbiAgICAgICAgICAgICAgICBpZiAoIWRpc2NyaW1pbmFudHMuY2FzZXNCeURpc2pvaW50W3F1YWxpZmllZERpc2pvaW50XSkge1xuICAgICAgICAgICAgICAgICAgICBkaXNjcmltaW5hbnRzLmNhc2VzQnlEaXNqb2ludFtxdWFsaWZpZWREaXNqb2ludF0gPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBbbFNlcmlhbGl6ZWRdOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbEluZGV4XG4gICAgICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgW3JTZXJpYWxpemVkXTogW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJJbmRleFxuICAgICAgICAgICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY29uc3QgY2FzZXMgPSBkaXNjcmltaW5hbnRzLmNhc2VzQnlEaXNqb2ludFtxdWFsaWZpZWREaXNqb2ludF07XG4gICAgICAgICAgICAgICAgY29uc3QgZXhpc3RpbmdMQnJhbmNoID0gY2FzZXNbbFNlcmlhbGl6ZWRdO1xuICAgICAgICAgICAgICAgIGlmICghZXhpc3RpbmdMQnJhbmNoKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhc2VzW2xTZXJpYWxpemVkXSA9IFtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxJbmRleFxuICAgICAgICAgICAgICAgICAgICBdO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoIWV4aXN0aW5nTEJyYW5jaC5pbmNsdWRlcyhsSW5kZXgpKSB7XG4gICAgICAgICAgICAgICAgICAgIGV4aXN0aW5nTEJyYW5jaC5wdXNoKGxJbmRleCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNvbnN0IGV4aXN0aW5nUkJyYW5jaCA9IGNhc2VzW3JTZXJpYWxpemVkXTtcbiAgICAgICAgICAgICAgICBpZiAoIWV4aXN0aW5nUkJyYW5jaCkge1xuICAgICAgICAgICAgICAgICAgICBjYXNlc1tyU2VyaWFsaXplZF0gPSBbXG4gICAgICAgICAgICAgICAgICAgICAgICBySW5kZXhcbiAgICAgICAgICAgICAgICAgICAgXTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKCFleGlzdGluZ1JCcmFuY2guaW5jbHVkZXMockluZGV4KSkge1xuICAgICAgICAgICAgICAgICAgICBleGlzdGluZ1JCcmFuY2gucHVzaChySW5kZXgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZGlzY3JpbWluYW50cztcbn07XG5jb25zdCBwYXJzZVF1YWxpZmllZERpc2pvaW50ID0gKHF1YWxpZmllZERpc2pvaW50KT0+e1xuICAgIGNvbnN0IHBhdGggPSBQYXRoLmZyb21TdHJpbmcocXVhbGlmaWVkRGlzam9pbnQpO1xuICAgIHJldHVybiBbXG4gICAgICAgIHBhdGgsXG4gICAgICAgIHBhdGgucG9wKClcbiAgICBdO1xufTtcbmNvbnN0IGZpbmRCZXN0RGlzY3JpbWluYW50ID0gKHJlbWFpbmluZ0luZGljZXMsIGRpc2NyaW1pbmFudHMpPT57XG4gICAgbGV0IGJlc3REaXNjcmltaW5hbnQ7XG4gICAgZm9yKGxldCBpID0gMDsgaSA8IHJlbWFpbmluZ0luZGljZXMubGVuZ3RoIC0gMTsgaSsrKXtcbiAgICAgICAgY29uc3QgbEluZGV4ID0gcmVtYWluaW5nSW5kaWNlc1tpXTtcbiAgICAgICAgZm9yKGxldCBqID0gaSArIDE7IGogPCByZW1haW5pbmdJbmRpY2VzLmxlbmd0aDsgaisrKXtcbiAgICAgICAgICAgIGNvbnN0IHJJbmRleCA9IHJlbWFpbmluZ0luZGljZXNbal07XG4gICAgICAgICAgICBjb25zdCBjYW5kaWRhdGVzID0gZGlzY3JpbWluYW50cy5kaXNqb2ludHNCeVBhaXJbYCR7bEluZGV4fS8ke3JJbmRleH1gXTtcbiAgICAgICAgICAgIGZvciAoY29uc3QgcXVhbGlmaWVkRGlzam9pbnQgb2YgY2FuZGlkYXRlcyl7XG4gICAgICAgICAgICAgICAgY29uc3QgaW5kZXhDYXNlcyA9IGRpc2NyaW1pbmFudHMuY2FzZXNCeURpc2pvaW50W3F1YWxpZmllZERpc2pvaW50XTtcbiAgICAgICAgICAgICAgICBjb25zdCBmaWx0ZXJlZENhc2VzID0ge307XG4gICAgICAgICAgICAgICAgY29uc3QgZGVmYXVsdENhc2VzID0gW1xuICAgICAgICAgICAgICAgICAgICAuLi5yZW1haW5pbmdJbmRpY2VzXG4gICAgICAgICAgICAgICAgXTtcbiAgICAgICAgICAgICAgICBsZXQgc2NvcmUgPSAwO1xuICAgICAgICAgICAgICAgIGZvcihjb25zdCBjYXNlS2V5IGluIGluZGV4Q2FzZXMpe1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBmaWx0ZXJlZEluZGljZXMgPSBpbmRleENhc2VzW2Nhc2VLZXldLmZpbHRlcigoaSk9PntcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHJlbWFpbmluZ0luZGV4ID0gcmVtYWluaW5nSW5kaWNlcy5pbmRleE9mKGkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJlbWFpbmluZ0luZGV4ICE9PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZSBkZWZhdWx0Q2FzZXNbcmVtYWluaW5nSW5kZXhdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGZpbHRlcmVkSW5kaWNlcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGZpbHRlcmVkQ2FzZXNbY2FzZUtleV0gPSBmaWx0ZXJlZEluZGljZXM7XG4gICAgICAgICAgICAgICAgICAgIHNjb3JlKys7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNvbnN0IGRlZmF1bHRDYXNlS2V5cyA9IG9iamVjdEtleXNPZihkZWZhdWx0Q2FzZXMpO1xuICAgICAgICAgICAgICAgIGlmIChkZWZhdWx0Q2FzZUtleXMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgIGZpbHRlcmVkQ2FzZXNbXCJkZWZhdWx0XCJdID0gZGVmYXVsdENhc2VLZXlzLm1hcCgoayk9PnBhcnNlSW50KGspKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKCFiZXN0RGlzY3JpbWluYW50IHx8IHNjb3JlID4gYmVzdERpc2NyaW1pbmFudC5zY29yZSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBbcGF0aCwga2luZF0gPSBwYXJzZVF1YWxpZmllZERpc2pvaW50KHF1YWxpZmllZERpc2pvaW50KTtcbiAgICAgICAgICAgICAgICAgICAgYmVzdERpc2NyaW1pbmFudCA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhdGgsXG4gICAgICAgICAgICAgICAgICAgICAgICBraW5kLFxuICAgICAgICAgICAgICAgICAgICAgICAgaW5kZXhDYXNlczogZmlsdGVyZWRDYXNlcyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNjb3JlXG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgIGlmIChzY29yZSA9PT0gcmVtYWluaW5nSW5kaWNlcy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGlmIHdlIGZpbmQgYSBjYW5kaWRhdGUgdGhhdCBkaXNjcmltaW5hdGVzIGFsbCBicmFuY2hlcywgcmV0dXJuIGVhcmx5XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gYmVzdERpc2NyaW1pbmFudDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gYmVzdERpc2NyaW1pbmFudDtcbn07XG5leHBvcnQgY29uc3Qgc2VyaWFsaXplRGVmaW5pdGlvbklmQWxsb3dlZCA9IChraW5kLCBkZWZpbml0aW9uKT0+e1xuICAgIHN3aXRjaChraW5kKXtcbiAgICAgICAgY2FzZSBcInZhbHVlXCI6XG4gICAgICAgICAgICByZXR1cm4gc2VyaWFsaXplSWZQcmltaXRpdmUoZGVmaW5pdGlvbik7XG4gICAgICAgIGNhc2UgXCJkb21haW5cIjpcbiAgICAgICAgICAgIHJldHVybiBkZWZpbml0aW9uO1xuICAgICAgICBjYXNlIFwiY2xhc3NcIjpcbiAgICAgICAgICAgIHJldHVybiBnZXRFeGFjdENvbnN0cnVjdG9yT2JqZWN0S2luZChkZWZpbml0aW9uKTtcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIHJldHVybjtcbiAgICB9XG59O1xuY29uc3Qgc2VyaWFsaXplSWZQcmltaXRpdmUgPSAoZGF0YSk9PntcbiAgICBjb25zdCBkb21haW4gPSBkb21haW5PZihkYXRhKTtcbiAgICByZXR1cm4gZG9tYWluID09PSBcIm9iamVjdFwiIHx8IGRvbWFpbiA9PT0gXCJzeW1ib2xcIiA/IHVuZGVmaW5lZCA6IHNlcmlhbGl6ZVByaW1pdGl2ZShkYXRhKTtcbn07XG5jb25zdCBzZXJpYWxpemVEYXRhID0ge1xuICAgIHZhbHVlOiAoZGF0YSk9PnNlcmlhbGl6ZUlmUHJpbWl0aXZlKGRhdGEpID8/IFwiZGVmYXVsdFwiLFxuICAgIGNsYXNzOiAoZGF0YSk9Pm9iamVjdEtpbmRPZihkYXRhKSA/PyBcImRlZmF1bHRcIixcbiAgICBkb21haW46IGRvbWFpbk9mXG59O1xuZXhwb3J0IGNvbnN0IHNlcmlhbGl6ZUNhc2UgPSAoa2luZCwgZGF0YSk9PnNlcmlhbGl6ZURhdGFba2luZF0oZGF0YSk7XG5jb25zdCBicmFuY2hJbmNsdWRlc01vcnBoID0gKGJyYW5jaCwgJCk9PlwibW9ycGhcIiBpbiBicmFuY2ggPyB0cnVlIDogXCJwcm9wc1wiIGluIGJyYW5jaCA/IE9iamVjdC52YWx1ZXMoYnJhbmNoLnByb3BzKS5zb21lKChwcm9wKT0+bm9kZUluY2x1ZGVzTW9ycGgocHJvcFRvTm9kZShwcm9wKSwgJCkpIDogZmFsc2U7XG5jb25zdCBub2RlSW5jbHVkZXNNb3JwaCA9IChub2RlLCAkKT0+dHlwZW9mIG5vZGUgPT09IFwic3RyaW5nXCIgPyAkLnJlc29sdmUobm9kZSkuaW5jbHVkZXNNb3JwaCA6IE9iamVjdC52YWx1ZXMoJC5yZXNvbHZlVHlwZU5vZGUobm9kZSkpLnNvbWUoKHByZWRpY2F0ZSk9PnByZWRpY2F0ZSA9PT0gdHJ1ZSA/IGZhbHNlIDogaXNBcnJheShwcmVkaWNhdGUpID8gcHJlZGljYXRlLnNvbWUoKGJyYW5jaCk9PmJyYW5jaEluY2x1ZGVzTW9ycGgoYnJhbmNoLCAkKSkgOiBicmFuY2hJbmNsdWRlc01vcnBoKHByZWRpY2F0ZSwgJCkpO1xuIiwgImltcG9ydCB7IGxpc3RGcm9tIH0gZnJvbSBcIi4uL3V0aWxzL2dlbmVyaWNzLmpzXCI7XG5pbXBvcnQgeyBpc0FycmF5IH0gZnJvbSBcIi4uL3V0aWxzL29iamVjdEtpbmRzLmpzXCI7XG5pbXBvcnQgeyBicmFuY2hJbnRlcnNlY3Rpb24sIGNvbXBhcmVCcmFuY2hlcywgZmxhdHRlbkJyYW5jaCwgaXNCcmFuY2hDb21wYXJpc29uIH0gZnJvbSBcIi4vYnJhbmNoLmpzXCI7XG5pbXBvcnQgeyBlcXVhbGl0eSwgSW50ZXJzZWN0aW9uU3RhdGUsIGlzRXF1YWxpdHkgfSBmcm9tIFwiLi9jb21wb3NlLmpzXCI7XG5pbXBvcnQgeyBmbGF0dGVuQnJhbmNoZXMgfSBmcm9tIFwiLi9kaXNjcmltaW5hdGUuanNcIjtcbmNvbnN0IGVtcHR5UnVsZXNJZlRydWUgPSAocHJlZGljYXRlKT0+cHJlZGljYXRlID09PSB0cnVlID8ge30gOiBwcmVkaWNhdGU7XG5leHBvcnQgY29uc3QgY29tcGFyZVByZWRpY2F0ZXMgPSAobCwgciwgY29udGV4dCk9PntcbiAgICBpZiAobCA9PT0gdHJ1ZSAmJiByID09PSB0cnVlKSB7XG4gICAgICAgIHJldHVybiBlcXVhbGl0eSgpO1xuICAgIH1cbiAgICBpZiAoIWlzQXJyYXkobCkgJiYgIWlzQXJyYXkocikpIHtcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gYnJhbmNoSW50ZXJzZWN0aW9uKGVtcHR5UnVsZXNJZlRydWUobCksIGVtcHR5UnVsZXNJZlRydWUociksIGNvbnRleHQpO1xuICAgICAgICByZXR1cm4gcmVzdWx0ID09PSBsID8gbCA6IHJlc3VsdCA9PT0gciA/IHIgOiByZXN1bHQ7XG4gICAgfVxuICAgIGNvbnN0IGxCcmFuY2hlcyA9IGxpc3RGcm9tKGVtcHR5UnVsZXNJZlRydWUobCkpO1xuICAgIGNvbnN0IHJCcmFuY2hlcyA9IGxpc3RGcm9tKGVtcHR5UnVsZXNJZlRydWUocikpO1xuICAgIGNvbnN0IGNvbXBhcmlzb24gPSBjb21wYXJlQnJhbmNoZXMobEJyYW5jaGVzLCByQnJhbmNoZXMsIGNvbnRleHQpO1xuICAgIGlmIChjb21wYXJpc29uLmVxdWFsaXRpZXMubGVuZ3RoID09PSBsQnJhbmNoZXMubGVuZ3RoICYmIGNvbXBhcmlzb24uZXF1YWxpdGllcy5sZW5ndGggPT09IHJCcmFuY2hlcy5sZW5ndGgpIHtcbiAgICAgICAgcmV0dXJuIGVxdWFsaXR5KCk7XG4gICAgfVxuICAgIGlmIChjb21wYXJpc29uLmxFeHRlbmRzUi5sZW5ndGggKyBjb21wYXJpc29uLmVxdWFsaXRpZXMubGVuZ3RoID09PSBsQnJhbmNoZXMubGVuZ3RoKSB7XG4gICAgICAgIHJldHVybiBsO1xuICAgIH1cbiAgICBpZiAoY29tcGFyaXNvbi5yRXh0ZW5kc0wubGVuZ3RoICsgY29tcGFyaXNvbi5lcXVhbGl0aWVzLmxlbmd0aCA9PT0gckJyYW5jaGVzLmxlbmd0aCkge1xuICAgICAgICByZXR1cm4gcjtcbiAgICB9XG4gICAgcmV0dXJuIGNvbXBhcmlzb247XG59O1xuZXhwb3J0IGNvbnN0IHByZWRpY2F0ZUludGVyc2VjdGlvbiA9IChkb21haW4sIGwsIHIsIHN0YXRlKT0+e1xuICAgIHN0YXRlLmRvbWFpbiA9IGRvbWFpbjtcbiAgICBjb25zdCBjb21wYXJpc29uID0gY29tcGFyZVByZWRpY2F0ZXMobCwgciwgc3RhdGUpO1xuICAgIGlmICghaXNCcmFuY2hDb21wYXJpc29uKGNvbXBhcmlzb24pKSB7XG4gICAgICAgIHJldHVybiBjb21wYXJpc29uO1xuICAgIH1cbiAgICBjb25zdCByZXN1bHRCcmFuY2hlcyA9IFtcbiAgICAgICAgLi4uY29tcGFyaXNvbi5kaXN0aW5jdEludGVyc2VjdGlvbnMsXG4gICAgICAgIC4uLmNvbXBhcmlzb24uZXF1YWxpdGllcy5tYXAoKGluZGljZXMpPT5jb21wYXJpc29uLmxCcmFuY2hlc1tpbmRpY2VzWzBdXSksXG4gICAgICAgIC4uLmNvbXBhcmlzb24ubEV4dGVuZHNSLm1hcCgobEluZGV4KT0+Y29tcGFyaXNvbi5sQnJhbmNoZXNbbEluZGV4XSksXG4gICAgICAgIC4uLmNvbXBhcmlzb24uckV4dGVuZHNMLm1hcCgockluZGV4KT0+Y29tcGFyaXNvbi5yQnJhbmNoZXNbckluZGV4XSlcbiAgICBdO1xuICAgIGlmIChyZXN1bHRCcmFuY2hlcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgc3RhdGUuYWRkRGlzam9pbnQoXCJ1bmlvblwiLCBjb21wYXJpc29uLmxCcmFuY2hlcywgY29tcGFyaXNvbi5yQnJhbmNoZXMpO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0QnJhbmNoZXMubGVuZ3RoID09PSAxID8gcmVzdWx0QnJhbmNoZXNbMF0gOiByZXN1bHRCcmFuY2hlcztcbn07XG5leHBvcnQgY29uc3QgcHJlZGljYXRlVW5pb24gPSAoZG9tYWluLCBsLCByLCB0eXBlKT0+e1xuICAgIGNvbnN0IHN0YXRlID0gbmV3IEludGVyc2VjdGlvblN0YXRlKHR5cGUsIFwifFwiKTtcbiAgICBjb25zdCBjb21wYXJpc29uID0gY29tcGFyZVByZWRpY2F0ZXMobCwgciwgc3RhdGUpO1xuICAgIGlmICghaXNCcmFuY2hDb21wYXJpc29uKGNvbXBhcmlzb24pKSB7XG4gICAgICAgIHJldHVybiBpc0VxdWFsaXR5KGNvbXBhcmlzb24pIHx8IGNvbXBhcmlzb24gPT09IGwgPyByIDogY29tcGFyaXNvbiA9PT0gciA/IGwgOiAvLyBzdWJ0eXBlIG9mIHRoZSBvdGhlciwgaXQgY29uc2lzdHMgb2YgdHdvIG9wcG9zaXRlIGxpdGVyYWxzXG4gICAgICAgIC8vIGFuZCBjYW4gYmUgc2ltcGxpZmllZCB0byBhIG5vbi1saXRlcmFsIGJvb2xlYW4uXG4gICAgICAgIGRvbWFpbiA9PT0gXCJib29sZWFuXCIgPyB0cnVlIDogW1xuICAgICAgICAgICAgZW1wdHlSdWxlc0lmVHJ1ZShsKSxcbiAgICAgICAgICAgIGVtcHR5UnVsZXNJZlRydWUocilcbiAgICAgICAgXTtcbiAgICB9XG4gICAgY29uc3QgcmVzdWx0QnJhbmNoZXMgPSBbXG4gICAgICAgIC4uLmNvbXBhcmlzb24ubEJyYW5jaGVzLmZpbHRlcigoXywgbEluZGV4KT0+IWNvbXBhcmlzb24ubEV4dGVuZHNSLmluY2x1ZGVzKGxJbmRleCkgJiYgIWNvbXBhcmlzb24uZXF1YWxpdGllcy5zb21lKChpbmRleFBhaXIpPT5pbmRleFBhaXJbMF0gPT09IGxJbmRleCkpLFxuICAgICAgICAuLi5jb21wYXJpc29uLnJCcmFuY2hlcy5maWx0ZXIoKF8sIHJJbmRleCk9PiFjb21wYXJpc29uLnJFeHRlbmRzTC5pbmNsdWRlcyhySW5kZXgpICYmICFjb21wYXJpc29uLmVxdWFsaXRpZXMuc29tZSgoaW5kZXhQYWlyKT0+aW5kZXhQYWlyWzFdID09PSBySW5kZXgpKVxuICAgIF07XG4gICAgcmV0dXJuIHJlc3VsdEJyYW5jaGVzLmxlbmd0aCA9PT0gMSA/IHJlc3VsdEJyYW5jaGVzWzBdIDogcmVzdWx0QnJhbmNoZXM7XG59O1xuZXhwb3J0IGNvbnN0IGZsYXR0ZW5QcmVkaWNhdGUgPSAocHJlZGljYXRlLCBjb250ZXh0KT0+e1xuICAgIGlmIChwcmVkaWNhdGUgPT09IHRydWUpIHtcbiAgICAgICAgcmV0dXJuIFtdO1xuICAgIH1cbiAgICByZXR1cm4gaXNBcnJheShwcmVkaWNhdGUpID8gZmxhdHRlbkJyYW5jaGVzKHByZWRpY2F0ZSwgY29udGV4dCkgOiBmbGF0dGVuQnJhbmNoKHByZWRpY2F0ZSwgY29udGV4dCk7XG59O1xuZXhwb3J0IGNvbnN0IGlzTGl0ZXJhbENvbmRpdGlvbiA9IChwcmVkaWNhdGUpPT50eXBlb2YgcHJlZGljYXRlID09PSBcIm9iamVjdFwiICYmIFwidmFsdWVcIiBpbiBwcmVkaWNhdGU7XG4iLCAiaW1wb3J0IHsgY29tcGlsZURpc2pvaW50UmVhc29uc01lc3NhZ2UgfSBmcm9tIFwiLi4vcGFyc2UvYXN0L2ludGVyc2VjdGlvbi5qc1wiO1xuaW1wb3J0IHsgdGhyb3dJbnRlcm5hbEVycm9yLCB0aHJvd1BhcnNlRXJyb3IgfSBmcm9tIFwiLi4vdXRpbHMvZXJyb3JzLmpzXCI7XG5pbXBvcnQgeyBlbnRyaWVzT2YsIGhhc0tleSwgaGFzS2V5cywgb2JqZWN0S2V5c09mIH0gZnJvbSBcIi4uL3V0aWxzL2dlbmVyaWNzLmpzXCI7XG5pbXBvcnQgeyBQYXRoIH0gZnJvbSBcIi4uL3V0aWxzL3BhdGhzLmpzXCI7XG5pbXBvcnQgeyBhbm9ueW1vdXNEaXNqb2ludCwgY29tcG9zZUtleWVkSW50ZXJzZWN0aW9uLCBJbnRlcnNlY3Rpb25TdGF0ZSwgaXNEaXNqb2ludCwgaXNFcXVhbGl0eSwgdW5kZWZpbmVkT3BlcmFuZHNNZXNzYWdlIH0gZnJvbSBcIi4vY29tcG9zZS5qc1wiO1xuaW1wb3J0IHsgZmxhdHRlblByZWRpY2F0ZSwgaXNMaXRlcmFsQ29uZGl0aW9uLCBwcmVkaWNhdGVJbnRlcnNlY3Rpb24sIHByZWRpY2F0ZVVuaW9uIH0gZnJvbSBcIi4vcHJlZGljYXRlLmpzXCI7XG5pbXBvcnQgeyBtYXBwZWRLZXlzIH0gZnJvbSBcIi4vcnVsZXMvcHJvcHMuanNcIjtcbmV4cG9ydCBjb25zdCBpc0NvbmZpZ05vZGUgPSAobm9kZSk9PlwiY29uZmlnXCIgaW4gbm9kZTtcbmV4cG9ydCBjb25zdCBub2RlSW50ZXJzZWN0aW9uID0gKGwsIHIsIHN0YXRlKT0+e1xuICAgIHN0YXRlLmRvbWFpbiA9IHVuZGVmaW5lZDtcbiAgICBjb25zdCBsRG9tYWlucyA9IHN0YXRlLnR5cGUuc2NvcGUucmVzb2x2ZVR5cGVOb2RlKGwpO1xuICAgIGNvbnN0IHJEb21haW5zID0gc3RhdGUudHlwZS5zY29wZS5yZXNvbHZlVHlwZU5vZGUocik7XG4gICAgY29uc3QgcmVzdWx0ID0gdHlwZU5vZGVJbnRlcnNlY3Rpb24obERvbWFpbnMsIHJEb21haW5zLCBzdGF0ZSk7XG4gICAgaWYgKHR5cGVvZiByZXN1bHQgPT09IFwib2JqZWN0XCIgJiYgIWhhc0tleXMocmVzdWx0KSkge1xuICAgICAgICByZXR1cm4gaGFzS2V5cyhzdGF0ZS5kaXNqb2ludHMpID8gYW5vbnltb3VzRGlzam9pbnQoKSA6IHN0YXRlLmFkZERpc2pvaW50KFwiZG9tYWluXCIsIG9iamVjdEtleXNPZihsRG9tYWlucyksIG9iamVjdEtleXNPZihyRG9tYWlucykpO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0ID09PSBsRG9tYWlucyA/IGwgOiByZXN1bHQgPT09IHJEb21haW5zID8gciA6IHJlc3VsdDtcbn07XG5jb25zdCB0eXBlTm9kZUludGVyc2VjdGlvbiA9IGNvbXBvc2VLZXllZEludGVyc2VjdGlvbigoZG9tYWluLCBsLCByLCBjb250ZXh0KT0+e1xuICAgIGlmIChsID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgcmV0dXJuIHIgPT09IHVuZGVmaW5lZCA/IHRocm93SW50ZXJuYWxFcnJvcih1bmRlZmluZWRPcGVyYW5kc01lc3NhZ2UpIDogdW5kZWZpbmVkO1xuICAgIH1cbiAgICBpZiAociA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuICAgIHJldHVybiBwcmVkaWNhdGVJbnRlcnNlY3Rpb24oZG9tYWluLCBsLCByLCBjb250ZXh0KTtcbn0sIHtcbiAgICBvbkVtcHR5OiBcIm9taXRcIlxufSk7XG5leHBvcnQgY29uc3Qgcm9vdEludGVyc2VjdGlvbiA9IChsLCByLCB0eXBlKT0+e1xuICAgIGNvbnN0IHN0YXRlID0gbmV3IEludGVyc2VjdGlvblN0YXRlKHR5cGUsIFwiJlwiKTtcbiAgICBjb25zdCByZXN1bHQgPSBub2RlSW50ZXJzZWN0aW9uKGwsIHIsIHN0YXRlKTtcbiAgICByZXR1cm4gaXNEaXNqb2ludChyZXN1bHQpID8gdGhyb3dQYXJzZUVycm9yKGNvbXBpbGVEaXNqb2ludFJlYXNvbnNNZXNzYWdlKHN0YXRlLmRpc2pvaW50cykpIDogaXNFcXVhbGl0eShyZXN1bHQpID8gbCA6IHJlc3VsdDtcbn07XG5leHBvcnQgY29uc3Qgcm9vdFVuaW9uID0gKGwsIHIsIHR5cGUpPT57XG4gICAgY29uc3QgbERvbWFpbnMgPSB0eXBlLnNjb3BlLnJlc29sdmVUeXBlTm9kZShsKTtcbiAgICBjb25zdCByRG9tYWlucyA9IHR5cGUuc2NvcGUucmVzb2x2ZVR5cGVOb2RlKHIpO1xuICAgIGNvbnN0IHJlc3VsdCA9IHt9O1xuICAgIGNvbnN0IGRvbWFpbnMgPSBvYmplY3RLZXlzT2Yoe1xuICAgICAgICAuLi5sRG9tYWlucyxcbiAgICAgICAgLi4uckRvbWFpbnNcbiAgICB9KTtcbiAgICBmb3IgKGNvbnN0IGRvbWFpbiBvZiBkb21haW5zKXtcbiAgICAgICAgcmVzdWx0W2RvbWFpbl0gPSBoYXNLZXkobERvbWFpbnMsIGRvbWFpbikgPyBoYXNLZXkockRvbWFpbnMsIGRvbWFpbikgPyBwcmVkaWNhdGVVbmlvbihkb21haW4sIGxEb21haW5zW2RvbWFpbl0sIHJEb21haW5zW2RvbWFpbl0sIHR5cGUpIDogbERvbWFpbnNbZG9tYWluXSA6IGhhc0tleShyRG9tYWlucywgZG9tYWluKSA/IHJEb21haW5zW2RvbWFpbl0gOiB0aHJvd0ludGVybmFsRXJyb3IodW5kZWZpbmVkT3BlcmFuZHNNZXNzYWdlKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbn07XG5jb25zdCBoYXNJbXBsaWVkRG9tYWluID0gKGZsYXRQcmVkaWNhdGUpPT5mbGF0UHJlZGljYXRlWzBdICYmIChmbGF0UHJlZGljYXRlWzBdWzBdID09PSBcInZhbHVlXCIgfHwgZmxhdFByZWRpY2F0ZVswXVswXSA9PT0gXCJjbGFzc1wiKTtcbmV4cG9ydCBjb25zdCBmbGF0dGVuVHlwZSA9ICh0eXBlKT0+e1xuICAgIGNvbnN0IGN0eCA9IHtcbiAgICAgICAgdHlwZSxcbiAgICAgICAgcGF0aDogbmV3IFBhdGgoKSxcbiAgICAgICAgbGFzdERvbWFpbjogXCJ1bmRlZmluZWRcIlxuICAgIH07XG4gICAgcmV0dXJuIGZsYXR0ZW5Ob2RlKHR5cGUubm9kZSwgY3R4KTtcbn07XG5leHBvcnQgY29uc3QgZmxhdHRlbk5vZGUgPSAobm9kZSwgY3R4KT0+e1xuICAgIGlmICh0eXBlb2Ygbm9kZSA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgICByZXR1cm4gY3R4LnR5cGUuc2NvcGUucmVzb2x2ZShub2RlKS5mbGF0O1xuICAgIH1cbiAgICBjb25zdCBoYXNDb25maWcgPSBpc0NvbmZpZ05vZGUobm9kZSk7XG4gICAgY29uc3QgZmxhdHRlbmVkVHlwZU5vZGUgPSBmbGF0dGVuVHlwZU5vZGUoaGFzQ29uZmlnID8gbm9kZS5ub2RlIDogbm9kZSwgY3R4KTtcbiAgICByZXR1cm4gaGFzQ29uZmlnID8gW1xuICAgICAgICBbXG4gICAgICAgICAgICBcImNvbmZpZ1wiLFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGNvbmZpZzogZW50cmllc09mKG5vZGUuY29uZmlnKSxcbiAgICAgICAgICAgICAgICBub2RlOiBmbGF0dGVuZWRUeXBlTm9kZVxuICAgICAgICAgICAgfVxuICAgICAgICBdXG4gICAgXSA6IGZsYXR0ZW5lZFR5cGVOb2RlO1xufTtcbmV4cG9ydCBjb25zdCBmbGF0dGVuVHlwZU5vZGUgPSAobm9kZSwgY3R4KT0+e1xuICAgIGNvbnN0IGRvbWFpbnMgPSBvYmplY3RLZXlzT2Yobm9kZSk7XG4gICAgaWYgKGRvbWFpbnMubGVuZ3RoID09PSAxKSB7XG4gICAgICAgIGNvbnN0IGRvbWFpbiA9IGRvbWFpbnNbMF07XG4gICAgICAgIGNvbnN0IHByZWRpY2F0ZSA9IG5vZGVbZG9tYWluXTtcbiAgICAgICAgaWYgKHByZWRpY2F0ZSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgcmV0dXJuIGRvbWFpbjtcbiAgICAgICAgfVxuICAgICAgICBjdHgubGFzdERvbWFpbiA9IGRvbWFpbjtcbiAgICAgICAgY29uc3QgZmxhdFByZWRpY2F0ZSA9IGZsYXR0ZW5QcmVkaWNhdGUocHJlZGljYXRlLCBjdHgpO1xuICAgICAgICByZXR1cm4gaGFzSW1wbGllZERvbWFpbihmbGF0UHJlZGljYXRlKSA/IGZsYXRQcmVkaWNhdGUgOiBbXG4gICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgXCJkb21haW5cIixcbiAgICAgICAgICAgICAgICBkb21haW5cbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAuLi5mbGF0UHJlZGljYXRlXG4gICAgICAgIF07XG4gICAgfVxuICAgIGNvbnN0IHJlc3VsdCA9IHt9O1xuICAgIGZvciAoY29uc3QgZG9tYWluIG9mIGRvbWFpbnMpe1xuICAgICAgICBjdHgubGFzdERvbWFpbiA9IGRvbWFpbjtcbiAgICAgICAgcmVzdWx0W2RvbWFpbl0gPSBmbGF0dGVuUHJlZGljYXRlKG5vZGVbZG9tYWluXSwgY3R4KTtcbiAgICB9XG4gICAgcmV0dXJuIFtcbiAgICAgICAgW1xuICAgICAgICAgICAgXCJkb21haW5zXCIsXG4gICAgICAgICAgICByZXN1bHRcbiAgICAgICAgXVxuICAgIF07XG59O1xuZXhwb3J0IGNvbnN0IGlzTGl0ZXJhbE5vZGUgPSAobm9kZSwgZG9tYWluKT0+e1xuICAgIHJldHVybiByZXNvbHV0aW9uRXh0ZW5kc0RvbWFpbihub2RlLCBkb21haW4pICYmIGlzTGl0ZXJhbENvbmRpdGlvbihub2RlW2RvbWFpbl0pO1xufTtcbmV4cG9ydCBjb25zdCByZXNvbHV0aW9uRXh0ZW5kc0RvbWFpbiA9IChyZXNvbHV0aW9uLCBkb21haW4pPT57XG4gICAgY29uc3QgZG9tYWlucyA9IG9iamVjdEtleXNPZihyZXNvbHV0aW9uKTtcbiAgICByZXR1cm4gZG9tYWlucy5sZW5ndGggPT09IDEgJiYgZG9tYWluc1swXSA9PT0gZG9tYWluO1xufTtcbmV4cG9ydCBjb25zdCB0b0FycmF5Tm9kZSA9IChub2RlKT0+KHtcbiAgICAgICAgb2JqZWN0OiB7XG4gICAgICAgICAgICBjbGFzczogQXJyYXksXG4gICAgICAgICAgICBwcm9wczoge1xuICAgICAgICAgICAgICAgIFttYXBwZWRLZXlzLmluZGV4XTogbm9kZVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSk7XG4iLCAiZnVuY3Rpb24gX2RlZmluZVByb3BlcnR5KG9iaiwga2V5LCB2YWx1ZSkge1xuICAgIGlmIChrZXkgaW4gb2JqKSB7XG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmosIGtleSwge1xuICAgICAgICAgICAgdmFsdWU6IHZhbHVlLFxuICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgICAgICAgIHdyaXRhYmxlOiB0cnVlXG4gICAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIG9ialtrZXldID0gdmFsdWU7XG4gICAgfVxuICAgIHJldHVybiBvYmo7XG59XG5leHBvcnQgY2xhc3MgU2Nhbm5lciB7XG4gICAgLyoqIEdldCBsb29rYWhlYWQgYW5kIGFkdmFuY2Ugc2Nhbm5lciBieSBvbmUgKi8gc2hpZnQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNoYXJzW3RoaXMuaSsrXSA/PyBcIlwiO1xuICAgIH1cbiAgICBnZXQgbG9va2FoZWFkKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jaGFyc1t0aGlzLmldID8/IFwiXCI7XG4gICAgfVxuICAgIHNoaWZ0VW50aWwoY29uZGl0aW9uKSB7XG4gICAgICAgIGxldCBzaGlmdGVkID0gXCJcIjtcbiAgICAgICAgd2hpbGUodGhpcy5sb29rYWhlYWQpe1xuICAgICAgICAgICAgaWYgKGNvbmRpdGlvbih0aGlzLCBzaGlmdGVkKSkge1xuICAgICAgICAgICAgICAgIGlmIChzaGlmdGVkW3NoaWZ0ZWQubGVuZ3RoIC0gMV0gPT09IFNjYW5uZXIuZXNjYXBlVG9rZW4pIHtcbiAgICAgICAgICAgICAgICAgICAgc2hpZnRlZCA9IHNoaWZ0ZWQuc2xpY2UoMCwgLTEpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHNoaWZ0ZWQgKz0gdGhpcy5zaGlmdCgpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzaGlmdGVkO1xuICAgIH1cbiAgICBzaGlmdFVudGlsTmV4dFRlcm1pbmF0b3IoKSB7XG4gICAgICAgIHRoaXMuc2hpZnRVbnRpbChTY2FubmVyLmxvb2thaGVhZElzTm90V2hpdGVzcGFjZSk7XG4gICAgICAgIHJldHVybiB0aGlzLnNoaWZ0VW50aWwoU2Nhbm5lci5sb29rYWhlYWRJc1Rlcm1pbmF0b3IpO1xuICAgIH1cbiAgICBnZXQgdW5zY2FubmVkKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jaGFycy5zbGljZSh0aGlzLmksIHRoaXMuY2hhcnMubGVuZ3RoKS5qb2luKFwiXCIpO1xuICAgIH1cbiAgICBsb29rYWhlYWRJcyhjaGFyKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmxvb2thaGVhZCA9PT0gY2hhcjtcbiAgICB9XG4gICAgbG9va2FoZWFkSXNJbih0b2tlbnMpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubG9va2FoZWFkIGluIHRva2VucztcbiAgICB9XG4gICAgY29uc3RydWN0b3IoZGVmKXtcbiAgICAgICAgX2RlZmluZVByb3BlcnR5KHRoaXMsIFwiY2hhcnNcIiwgdm9pZCAwKTtcbiAgICAgICAgX2RlZmluZVByb3BlcnR5KHRoaXMsIFwiaVwiLCB2b2lkIDApO1xuICAgICAgICBfZGVmaW5lUHJvcGVydHkodGhpcywgXCJmaW5hbGl6ZWRcIiwgZmFsc2UpO1xuICAgICAgICB0aGlzLmNoYXJzID0gW1xuICAgICAgICAgICAgLi4uZGVmXG4gICAgICAgIF07XG4gICAgICAgIHRoaXMuaSA9IDA7XG4gICAgfVxufVxuKGZ1bmN0aW9uKFNjYW5uZXIpIHtcbiAgICB2YXIgbG9va2FoZWFkSXNUZXJtaW5hdG9yID0gU2Nhbm5lci5sb29rYWhlYWRJc1Rlcm1pbmF0b3IgPSAoc2Nhbm5lcik9PnNjYW5uZXIubG9va2FoZWFkIGluIHRlcm1pbmF0aW5nQ2hhcnM7XG4gICAgdmFyIGxvb2thaGVhZElzTm90V2hpdGVzcGFjZSA9IFNjYW5uZXIubG9va2FoZWFkSXNOb3RXaGl0ZXNwYWNlID0gKHNjYW5uZXIpPT5zY2FubmVyLmxvb2thaGVhZCAhPT0gd2hpdGVTcGFjZVRva2VuO1xuICAgIHZhciBjb21wYXJhdG9yU3RhcnRDaGFycyA9IFNjYW5uZXIuY29tcGFyYXRvclN0YXJ0Q2hhcnMgPSB7XG4gICAgICAgIFwiPFwiOiB0cnVlLFxuICAgICAgICBcIj5cIjogdHJ1ZSxcbiAgICAgICAgXCI9XCI6IHRydWVcbiAgICB9O1xuICAgIHZhciB0ZXJtaW5hdGluZ0NoYXJzID0gU2Nhbm5lci50ZXJtaW5hdGluZ0NoYXJzID0ge1xuICAgICAgICAuLi5jb21wYXJhdG9yU3RhcnRDaGFycyxcbiAgICAgICAgXCJ8XCI6IHRydWUsXG4gICAgICAgIFwiJlwiOiB0cnVlLFxuICAgICAgICBcIilcIjogdHJ1ZSxcbiAgICAgICAgXCJbXCI6IHRydWUsXG4gICAgICAgIFwiJVwiOiB0cnVlLFxuICAgICAgICBcIiBcIjogdHJ1ZVxuICAgIH07XG4gICAgdmFyIGNvbXBhcmF0b3JzID0gU2Nhbm5lci5jb21wYXJhdG9ycyA9IHtcbiAgICAgICAgXCI8XCI6IHRydWUsXG4gICAgICAgIFwiPlwiOiB0cnVlLFxuICAgICAgICBcIjw9XCI6IHRydWUsXG4gICAgICAgIFwiPj1cIjogdHJ1ZSxcbiAgICAgICAgXCI9PVwiOiB0cnVlXG4gICAgfTtcbiAgICB2YXIgb25lQ2hhckNvbXBhcmF0b3JzID0gU2Nhbm5lci5vbmVDaGFyQ29tcGFyYXRvcnMgPSB7XG4gICAgICAgIFwiPFwiOiB0cnVlLFxuICAgICAgICBcIj5cIjogdHJ1ZVxuICAgIH07XG4gICAgdmFyIGNvbXBhcmF0b3JEZXNjcmlwdGlvbnMgPSBTY2FubmVyLmNvbXBhcmF0b3JEZXNjcmlwdGlvbnMgPSB7XG4gICAgICAgIFwiPFwiOiBcImxlc3MgdGhhblwiLFxuICAgICAgICBcIj5cIjogXCJtb3JlIHRoYW5cIixcbiAgICAgICAgXCI8PVwiOiBcImF0IG1vc3RcIixcbiAgICAgICAgXCI+PVwiOiBcImF0IGxlYXN0XCIsXG4gICAgICAgIFwiPT1cIjogXCJleGFjdGx5XCJcbiAgICB9O1xuICAgIHZhciBpbnZlcnRlZENvbXBhcmF0b3JzID0gU2Nhbm5lci5pbnZlcnRlZENvbXBhcmF0b3JzID0ge1xuICAgICAgICBcIjxcIjogXCI+XCIsXG4gICAgICAgIFwiPlwiOiBcIjxcIixcbiAgICAgICAgXCI8PVwiOiBcIj49XCIsXG4gICAgICAgIFwiPj1cIjogXCI8PVwiLFxuICAgICAgICBcIj09XCI6IFwiPT1cIlxuICAgIH07XG4gICAgdmFyIGJyYW5jaFRva2VucyA9IFNjYW5uZXIuYnJhbmNoVG9rZW5zID0ge1xuICAgICAgICBcInxcIjogdHJ1ZSxcbiAgICAgICAgXCImXCI6IHRydWVcbiAgICB9O1xuICAgIHZhciBlc2NhcGVUb2tlbiA9IFNjYW5uZXIuZXNjYXBlVG9rZW4gPSBcIlxcXFxcIjtcbiAgICB2YXIgd2hpdGVTcGFjZVRva2VuID0gU2Nhbm5lci53aGl0ZVNwYWNlVG9rZW4gPSBcIiBcIjtcbn0pKFNjYW5uZXIgfHwgKFNjYW5uZXIgPSB7fSkpO1xuIiwgImZ1bmN0aW9uIF9jaGVja1ByaXZhdGVSZWRlY2xhcmF0aW9uKG9iaiwgcHJpdmF0ZUNvbGxlY3Rpb24pIHtcbiAgICBpZiAocHJpdmF0ZUNvbGxlY3Rpb24uaGFzKG9iaikpIHtcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBpbml0aWFsaXplIHRoZSBzYW1lIHByaXZhdGUgZWxlbWVudHMgdHdpY2Ugb24gYW4gb2JqZWN0XCIpO1xuICAgIH1cbn1cbmZ1bmN0aW9uIF9jbGFzc0FwcGx5RGVzY3JpcHRvckdldChyZWNlaXZlciwgZGVzY3JpcHRvcikge1xuICAgIGlmIChkZXNjcmlwdG9yLmdldCkge1xuICAgICAgICByZXR1cm4gZGVzY3JpcHRvci5nZXQuY2FsbChyZWNlaXZlcik7XG4gICAgfVxuICAgIHJldHVybiBkZXNjcmlwdG9yLnZhbHVlO1xufVxuZnVuY3Rpb24gX2NsYXNzQXBwbHlEZXNjcmlwdG9yU2V0KHJlY2VpdmVyLCBkZXNjcmlwdG9yLCB2YWx1ZSkge1xuICAgIGlmIChkZXNjcmlwdG9yLnNldCkge1xuICAgICAgICBkZXNjcmlwdG9yLnNldC5jYWxsKHJlY2VpdmVyLCB2YWx1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKCFkZXNjcmlwdG9yLndyaXRhYmxlKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiYXR0ZW1wdGVkIHRvIHNldCByZWFkIG9ubHkgcHJpdmF0ZSBmaWVsZFwiKTtcbiAgICAgICAgfVxuICAgICAgICBkZXNjcmlwdG9yLnZhbHVlID0gdmFsdWU7XG4gICAgfVxufVxuZnVuY3Rpb24gX2NsYXNzRXh0cmFjdEZpZWxkRGVzY3JpcHRvcihyZWNlaXZlciwgcHJpdmF0ZU1hcCwgYWN0aW9uKSB7XG4gICAgaWYgKCFwcml2YXRlTWFwLmhhcyhyZWNlaXZlcikpIHtcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcImF0dGVtcHRlZCB0byBcIiArIGFjdGlvbiArIFwiIHByaXZhdGUgZmllbGQgb24gbm9uLWluc3RhbmNlXCIpO1xuICAgIH1cbiAgICByZXR1cm4gcHJpdmF0ZU1hcC5nZXQocmVjZWl2ZXIpO1xufVxuZnVuY3Rpb24gX2NsYXNzUHJpdmF0ZUZpZWxkR2V0KHJlY2VpdmVyLCBwcml2YXRlTWFwKSB7XG4gICAgdmFyIGRlc2NyaXB0b3IgPSBfY2xhc3NFeHRyYWN0RmllbGREZXNjcmlwdG9yKHJlY2VpdmVyLCBwcml2YXRlTWFwLCBcImdldFwiKTtcbiAgICByZXR1cm4gX2NsYXNzQXBwbHlEZXNjcmlwdG9yR2V0KHJlY2VpdmVyLCBkZXNjcmlwdG9yKTtcbn1cbmZ1bmN0aW9uIF9jbGFzc1ByaXZhdGVGaWVsZEluaXQob2JqLCBwcml2YXRlTWFwLCB2YWx1ZSkge1xuICAgIF9jaGVja1ByaXZhdGVSZWRlY2xhcmF0aW9uKG9iaiwgcHJpdmF0ZU1hcCk7XG4gICAgcHJpdmF0ZU1hcC5zZXQob2JqLCB2YWx1ZSk7XG59XG5mdW5jdGlvbiBfY2xhc3NQcml2YXRlRmllbGRTZXQocmVjZWl2ZXIsIHByaXZhdGVNYXAsIHZhbHVlKSB7XG4gICAgdmFyIGRlc2NyaXB0b3IgPSBfY2xhc3NFeHRyYWN0RmllbGREZXNjcmlwdG9yKHJlY2VpdmVyLCBwcml2YXRlTWFwLCBcInNldFwiKTtcbiAgICBfY2xhc3NBcHBseURlc2NyaXB0b3JTZXQocmVjZWl2ZXIsIGRlc2NyaXB0b3IsIHZhbHVlKTtcbiAgICByZXR1cm4gdmFsdWU7XG59XG5mdW5jdGlvbiBfZGVmaW5lUHJvcGVydHkob2JqLCBrZXksIHZhbHVlKSB7XG4gICAgaWYgKGtleSBpbiBvYmopIHtcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iaiwga2V5LCB7XG4gICAgICAgICAgICB2YWx1ZTogdmFsdWUsXG4gICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgICAgICAgd3JpdGFibGU6IHRydWVcbiAgICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgb2JqW2tleV0gPSB2YWx1ZTtcbiAgICB9XG4gICAgcmV0dXJuIG9iajtcbn1cbmltcG9ydCB7IFNjYW5uZXIgfSBmcm9tIFwiLi4vcGFyc2Uvc3RyaW5nL3NoaWZ0L3NjYW5uZXIuanNcIjtcbmltcG9ydCB7IERhdGFXcmFwcGVyIH0gZnJvbSBcIi4uL3V0aWxzL2RhdGEuanNcIjtcbmltcG9ydCB7IGRvbWFpbkRlc2NyaXB0aW9ucyB9IGZyb20gXCIuLi91dGlscy9kb21haW5zLmpzXCI7XG5pbXBvcnQgeyBvYmplY3RLZXlzT2YgfSBmcm9tIFwiLi4vdXRpbHMvZ2VuZXJpY3MuanNcIjtcbmltcG9ydCB7IGlzV2VsbEZvcm1lZEludGVnZXIgfSBmcm9tIFwiLi4vdXRpbHMvbnVtZXJpY0xpdGVyYWxzLmpzXCI7XG5pbXBvcnQgeyBnZXRFeGFjdENvbnN0cnVjdG9yT2JqZWN0S2luZCwgb2JqZWN0S2luZERlc2NyaXB0aW9ucyB9IGZyb20gXCIuLi91dGlscy9vYmplY3RLaW5kcy5qc1wiO1xuaW1wb3J0IHsgUGF0aCB9IGZyb20gXCIuLi91dGlscy9wYXRocy5qc1wiO1xuaW1wb3J0IHsgc3RyaW5naWZ5IH0gZnJvbSBcIi4uL3V0aWxzL3NlcmlhbGl6ZS5qc1wiO1xuZXhwb3J0IGNsYXNzIEFya1R5cGVFcnJvciBleHRlbmRzIFR5cGVFcnJvciB7XG4gICAgY29uc3RydWN0b3IocHJvYmxlbXMpe1xuICAgICAgICBzdXBlcihgJHtwcm9ibGVtc31gKTtcbiAgICAgICAgX2RlZmluZVByb3BlcnR5KHRoaXMsIFwiY2F1c2VcIiwgdm9pZCAwKTtcbiAgICAgICAgdGhpcy5jYXVzZSA9IHByb2JsZW1zO1xuICAgIH1cbn1cbmV4cG9ydCBjbGFzcyBQcm9ibGVtIHtcbiAgICB0b1N0cmluZygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubWVzc2FnZTtcbiAgICB9XG4gICAgZ2V0IG1lc3NhZ2UoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLndyaXRlcnMuYWRkQ29udGV4dCh0aGlzLnJlYXNvbiwgdGhpcy5wYXRoKTtcbiAgICB9XG4gICAgZ2V0IHJlYXNvbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMud3JpdGVycy53cml0ZVJlYXNvbih0aGlzLm11c3RCZSwgbmV3IERhdGFXcmFwcGVyKHRoaXMuZGF0YSkpO1xuICAgIH1cbiAgICBnZXQgbXVzdEJlKCkge1xuICAgICAgICByZXR1cm4gdHlwZW9mIHRoaXMud3JpdGVycy5tdXN0QmUgPT09IFwic3RyaW5nXCIgPyB0aGlzLndyaXRlcnMubXVzdEJlIDogdGhpcy53cml0ZXJzLm11c3RCZSh0aGlzLnNvdXJjZSk7XG4gICAgfVxuICAgIGNvbnN0cnVjdG9yKGNvZGUsIHBhdGgsIGRhdGEsIHNvdXJjZSwgd3JpdGVycyl7XG4gICAgICAgIF9kZWZpbmVQcm9wZXJ0eSh0aGlzLCBcImNvZGVcIiwgdm9pZCAwKTtcbiAgICAgICAgX2RlZmluZVByb3BlcnR5KHRoaXMsIFwicGF0aFwiLCB2b2lkIDApO1xuICAgICAgICBfZGVmaW5lUHJvcGVydHkodGhpcywgXCJkYXRhXCIsIHZvaWQgMCk7XG4gICAgICAgIF9kZWZpbmVQcm9wZXJ0eSh0aGlzLCBcInNvdXJjZVwiLCB2b2lkIDApO1xuICAgICAgICBfZGVmaW5lUHJvcGVydHkodGhpcywgXCJ3cml0ZXJzXCIsIHZvaWQgMCk7XG4gICAgICAgIF9kZWZpbmVQcm9wZXJ0eSh0aGlzLCBcInBhcnRzXCIsIHZvaWQgMCk7XG4gICAgICAgIHRoaXMuY29kZSA9IGNvZGU7XG4gICAgICAgIHRoaXMucGF0aCA9IHBhdGg7XG4gICAgICAgIHRoaXMuZGF0YSA9IGRhdGE7XG4gICAgICAgIHRoaXMuc291cmNlID0gc291cmNlO1xuICAgICAgICB0aGlzLndyaXRlcnMgPSB3cml0ZXJzO1xuICAgICAgICBpZiAodGhpcy5jb2RlID09PSBcIm11bHRpXCIpIHtcbiAgICAgICAgICAgIHRoaXMucGFydHMgPSB0aGlzLnNvdXJjZTtcbiAgICAgICAgfVxuICAgIH1cbn1cbnZhciBfc3RhdGUgPSAvKiNfX1BVUkVfXyovIG5ldyBXZWFrTWFwKCk7XG5jbGFzcyBQcm9ibGVtQXJyYXkgZXh0ZW5kcyBBcnJheSB7XG4gICAgbXVzdEJlKGRlc2NyaXB0aW9uLCBvcHRzKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmFkZChcImN1c3RvbVwiLCBkZXNjcmlwdGlvbiwgb3B0cyk7XG4gICAgfVxuICAgIGFkZChjb2RlLCBzb3VyY2UsIG9wdHMpIHtcbiAgICAgICAgLy8gY29weSB0aGUgcGF0aCB0byBhdm9pZCBmdXR1cmUgbXV0YXRpb25zIGFmZmVjdGluZyBpdFxuICAgICAgICBjb25zdCBwYXRoID0gUGF0aC5mcm9tKG9wdHM/LnBhdGggPz8gX2NsYXNzUHJpdmF0ZUZpZWxkR2V0KHRoaXMsIF9zdGF0ZSkucGF0aCk7XG4gICAgICAgIGNvbnN0IGRhdGEgPSAvLyB3ZSBoYXZlIHRvIGNoZWNrIGZvciB0aGUgcHJlc2VuY2Ugb2YgdGhlIGtleSBleHBsaWNpdGx5IHNpbmNlIHRoZVxuICAgICAgICAvLyBkYXRhIGNvdWxkIGJlIHVuZGVmaW5lZCBvciBudWxsXG4gICAgICAgIG9wdHMgJiYgXCJkYXRhXCIgaW4gb3B0cyA/IG9wdHMuZGF0YSA6IF9jbGFzc1ByaXZhdGVGaWVsZEdldCh0aGlzLCBfc3RhdGUpLmRhdGE7XG4gICAgICAgIGNvbnN0IHByb2JsZW0gPSBuZXcgUHJvYmxlbSgvLyBhdm9pZCBhIGJ1bmNoIG9mIGVycm9ycyBmcm9tIFRTIHRyeWluZyB0byBkaXNjcmltaW5hdGUgdGhlXG4gICAgICAgIC8vIHByb2JsZW0gaW5wdXQgYmFzZWQgb24gdGhlIGNvZGVcbiAgICAgICAgY29kZSwgcGF0aCwgZGF0YSwgc291cmNlLCBfY2xhc3NQcml2YXRlRmllbGRHZXQodGhpcywgX3N0YXRlKS5nZXRQcm9ibGVtQ29uZmlnKGNvZGUpKTtcbiAgICAgICAgdGhpcy5hZGRQcm9ibGVtKHByb2JsZW0pO1xuICAgICAgICByZXR1cm4gcHJvYmxlbTtcbiAgICB9XG4gICAgYWRkUHJvYmxlbShwcm9ibGVtKSB7XG4gICAgICAgIGNvbnN0IHBhdGhLZXkgPSBgJHtwcm9ibGVtLnBhdGh9YDtcbiAgICAgICAgY29uc3QgZXhpc3RpbmcgPSB0aGlzLmJ5UGF0aFtwYXRoS2V5XTtcbiAgICAgICAgaWYgKGV4aXN0aW5nKSB7XG4gICAgICAgICAgICBpZiAoZXhpc3RpbmcucGFydHMpIHtcbiAgICAgICAgICAgICAgICBleGlzdGluZy5wYXJ0cy5wdXNoKHByb2JsZW0pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb25zdCBwcm9ibGVtSW50ZXJzZWN0aW9uID0gbmV3IFByb2JsZW0oXCJtdWx0aVwiLCBleGlzdGluZy5wYXRoLCBleGlzdGluZy5kYXRhLCBbXG4gICAgICAgICAgICAgICAgICAgIGV4aXN0aW5nLFxuICAgICAgICAgICAgICAgICAgICBwcm9ibGVtXG4gICAgICAgICAgICAgICAgXSwgX2NsYXNzUHJpdmF0ZUZpZWxkR2V0KHRoaXMsIF9zdGF0ZSkuZ2V0UHJvYmxlbUNvbmZpZyhcIm11bHRpXCIpKTtcbiAgICAgICAgICAgICAgICBjb25zdCBleGlzdGluZ0luZGV4ID0gdGhpcy5pbmRleE9mKGV4aXN0aW5nKTtcbiAgICAgICAgICAgICAgICAvLyBJZiBleGlzdGluZyBpcyBmb3VuZCAod2hpY2ggaXQgYWx3YXlzIHNob3VsZCBiZSB1bmxlc3MgdGhpcyB3YXMgZXh0ZXJuYWxseSBtdXRhdGVkKSxcbiAgICAgICAgICAgICAgICAvLyByZXBsYWNlIGl0IHdpdGggdGhlIG5ldyBwcm9ibGVtIGludGVyc2VjdGlvbi4gSW4gY2FzZSBpdCBpc24ndCBmb3Igd2hhdGV2ZXIgcmVhc29uLFxuICAgICAgICAgICAgICAgIC8vIGp1c3QgYXBwZW5kIHRoZSBpbnRlcnNlY3Rpb24uXG4gICAgICAgICAgICAgICAgdGhpc1tleGlzdGluZ0luZGV4ID09PSAtMSA/IHRoaXMubGVuZ3RoIDogZXhpc3RpbmdJbmRleF0gPSBwcm9ibGVtSW50ZXJzZWN0aW9uO1xuICAgICAgICAgICAgICAgIHRoaXMuYnlQYXRoW3BhdGhLZXldID0gcHJvYmxlbUludGVyc2VjdGlvbjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuYnlQYXRoW3BhdGhLZXldID0gcHJvYmxlbTtcbiAgICAgICAgICAgIHRoaXMucHVzaChwcm9ibGVtKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmNvdW50Kys7XG4gICAgfVxuICAgIGdldCBzdW1tYXJ5KCkge1xuICAgICAgICByZXR1cm4gYCR7dGhpc31gO1xuICAgIH1cbiAgICB0b1N0cmluZygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuam9pbihcIlxcblwiKTtcbiAgICB9XG4gICAgdGhyb3coKSB7XG4gICAgICAgIHRocm93IG5ldyBBcmtUeXBlRXJyb3IodGhpcyk7XG4gICAgfVxuICAgIGNvbnN0cnVjdG9yKHN0YXRlKXtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgX2RlZmluZVByb3BlcnR5KHRoaXMsIFwiYnlQYXRoXCIsIHt9KTtcbiAgICAgICAgX2RlZmluZVByb3BlcnR5KHRoaXMsIFwiY291bnRcIiwgMCk7XG4gICAgICAgIF9jbGFzc1ByaXZhdGVGaWVsZEluaXQodGhpcywgX3N0YXRlLCB7XG4gICAgICAgICAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICAgICAgICAgIHZhbHVlOiB2b2lkIDBcbiAgICAgICAgfSk7XG4gICAgICAgIF9jbGFzc1ByaXZhdGVGaWVsZFNldCh0aGlzLCBfc3RhdGUsIHN0YXRlKTtcbiAgICB9XG59XG5leHBvcnQgY29uc3QgUHJvYmxlbXMgPSBQcm9ibGVtQXJyYXk7XG5jb25zdCBjYXBpdGFsaXplID0gKHMpPT5zWzBdLnRvVXBwZXJDYXNlKCkgKyBzLnNsaWNlKDEpO1xuZXhwb3J0IGNvbnN0IGRvbWFpbnNUb0Rlc2NyaXB0aW9ucyA9IChkb21haW5zKT0+ZG9tYWlucy5tYXAoKG9iamVjdEtpbmQpPT5kb21haW5EZXNjcmlwdGlvbnNbb2JqZWN0S2luZF0pO1xuZXhwb3J0IGNvbnN0IG9iamVjdEtpbmRzVG9EZXNjcmlwdGlvbnMgPSAoa2luZHMpPT5raW5kcy5tYXAoKG9iamVjdEtpbmQpPT5vYmplY3RLaW5kRGVzY3JpcHRpb25zW29iamVjdEtpbmRdKTtcbmV4cG9ydCBjb25zdCBkZXNjcmliZUJyYW5jaGVzID0gKGRlc2NyaXB0aW9ucyk9PntcbiAgICBpZiAoZGVzY3JpcHRpb25zLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICByZXR1cm4gXCJuZXZlclwiO1xuICAgIH1cbiAgICBpZiAoZGVzY3JpcHRpb25zLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICByZXR1cm4gZGVzY3JpcHRpb25zWzBdO1xuICAgIH1cbiAgICBsZXQgZGVzY3JpcHRpb24gPSBcIlwiO1xuICAgIGZvcihsZXQgaSA9IDA7IGkgPCBkZXNjcmlwdGlvbnMubGVuZ3RoIC0gMTsgaSsrKXtcbiAgICAgICAgZGVzY3JpcHRpb24gKz0gZGVzY3JpcHRpb25zW2ldO1xuICAgICAgICBpZiAoaSA8IGRlc2NyaXB0aW9ucy5sZW5ndGggLSAyKSB7XG4gICAgICAgICAgICBkZXNjcmlwdGlvbiArPSBcIiwgXCI7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZGVzY3JpcHRpb24gKz0gYCBvciAke2Rlc2NyaXB0aW9uc1tkZXNjcmlwdGlvbnMubGVuZ3RoIC0gMV19YDtcbiAgICByZXR1cm4gZGVzY3JpcHRpb247XG59O1xuY29uc3Qgd3JpdGVEZWZhdWx0UmVhc29uID0gKG11c3RCZSwgd2FzKT0+YG11c3QgYmUgJHttdXN0QmV9JHt3YXMgJiYgYCAod2FzICR7d2FzfSlgfWA7XG5jb25zdCBhZGREZWZhdWx0Q29udGV4dCA9IChyZWFzb24sIHBhdGgpPT5wYXRoLmxlbmd0aCA9PT0gMCA/IGNhcGl0YWxpemUocmVhc29uKSA6IHBhdGgubGVuZ3RoID09PSAxICYmIGlzV2VsbEZvcm1lZEludGVnZXIocGF0aFswXSkgPyBgSXRlbSBhdCBpbmRleCAke3BhdGhbMF19ICR7cmVhc29ufWAgOiBgJHtwYXRofSAke3JlYXNvbn1gO1xuY29uc3QgZGVmYXVsdFByb2JsZW1Db25maWcgPSB7XG4gICAgZGl2aXNvcjoge1xuICAgICAgICBtdXN0QmU6IChkaXZpc29yKT0+ZGl2aXNvciA9PT0gMSA/IGBhbiBpbnRlZ2VyYCA6IGBhIG11bHRpcGxlIG9mICR7ZGl2aXNvcn1gXG4gICAgfSxcbiAgICBjbGFzczoge1xuICAgICAgICBtdXN0QmU6IChleHBlY3RlZCk9PntcbiAgICAgICAgICAgIGNvbnN0IHBvc3NpYmxlT2JqZWN0S2luZCA9IGdldEV4YWN0Q29uc3RydWN0b3JPYmplY3RLaW5kKGV4cGVjdGVkKTtcbiAgICAgICAgICAgIHJldHVybiBwb3NzaWJsZU9iamVjdEtpbmQgPyBvYmplY3RLaW5kRGVzY3JpcHRpb25zW3Bvc3NpYmxlT2JqZWN0S2luZF0gOiBgYW4gaW5zdGFuY2Ugb2YgJHtleHBlY3RlZC5uYW1lfWA7XG4gICAgICAgIH0sXG4gICAgICAgIHdyaXRlUmVhc29uOiAobXVzdEJlLCBkYXRhKT0+d3JpdGVEZWZhdWx0UmVhc29uKG11c3RCZSwgZGF0YS5jbGFzc05hbWUpXG4gICAgfSxcbiAgICBkb21haW46IHtcbiAgICAgICAgbXVzdEJlOiAoZG9tYWluKT0+ZG9tYWluRGVzY3JpcHRpb25zW2RvbWFpbl0sXG4gICAgICAgIHdyaXRlUmVhc29uOiAobXVzdEJlLCBkYXRhKT0+d3JpdGVEZWZhdWx0UmVhc29uKG11c3RCZSwgZGF0YS5kb21haW4pXG4gICAgfSxcbiAgICBtaXNzaW5nOiB7XG4gICAgICAgIG11c3RCZTogKCk9PlwiZGVmaW5lZFwiLFxuICAgICAgICB3cml0ZVJlYXNvbjogKG11c3RCZSk9PndyaXRlRGVmYXVsdFJlYXNvbihtdXN0QmUsIFwiXCIpXG4gICAgfSxcbiAgICBleHRyYW5lb3VzOiB7XG4gICAgICAgIG11c3RCZTogKCk9PlwicmVtb3ZlZFwiLFxuICAgICAgICB3cml0ZVJlYXNvbjogKG11c3RCZSk9PndyaXRlRGVmYXVsdFJlYXNvbihtdXN0QmUsIFwiXCIpXG4gICAgfSxcbiAgICBib3VuZDoge1xuICAgICAgICBtdXN0QmU6IChib3VuZCk9PmAke1NjYW5uZXIuY29tcGFyYXRvckRlc2NyaXB0aW9uc1tib3VuZC5jb21wYXJhdG9yXX0gJHtib3VuZC5saW1pdH0ke2JvdW5kLnVuaXRzID8gYCAke2JvdW5kLnVuaXRzfWAgOiBcIlwifWAsXG4gICAgICAgIHdyaXRlUmVhc29uOiAobXVzdEJlLCBkYXRhKT0+d3JpdGVEZWZhdWx0UmVhc29uKG11c3RCZSwgYCR7ZGF0YS5zaXplfWApXG4gICAgfSxcbiAgICByZWdleDoge1xuICAgICAgICBtdXN0QmU6IChleHByZXNzaW9uKT0+YGEgc3RyaW5nIG1hdGNoaW5nICR7ZXhwcmVzc2lvbn1gXG4gICAgfSxcbiAgICB2YWx1ZToge1xuICAgICAgICBtdXN0QmU6IHN0cmluZ2lmeVxuICAgIH0sXG4gICAgYnJhbmNoZXM6IHtcbiAgICAgICAgbXVzdEJlOiAoYnJhbmNoUHJvYmxlbXMpPT5kZXNjcmliZUJyYW5jaGVzKGJyYW5jaFByb2JsZW1zLm1hcCgocHJvYmxlbSk9PmAke3Byb2JsZW0ucGF0aH0gbXVzdCBiZSAke3Byb2JsZW0ucGFydHMgPyBkZXNjcmliZUJyYW5jaGVzKHByb2JsZW0ucGFydHMubWFwKChwYXJ0KT0+cGFydC5tdXN0QmUpKSA6IHByb2JsZW0ubXVzdEJlfWApKSxcbiAgICAgICAgd3JpdGVSZWFzb246IChtdXN0QmUsIGRhdGEpPT5gJHttdXN0QmV9ICh3YXMgJHtkYXRhfSlgLFxuICAgICAgICBhZGRDb250ZXh0OiAocmVhc29uLCBwYXRoKT0+cGF0aC5sZW5ndGggPyBgQXQgJHtwYXRofSwgJHtyZWFzb259YCA6IHJlYXNvblxuICAgIH0sXG4gICAgbXVsdGk6IHtcbiAgICAgICAgbXVzdEJlOiAocHJvYmxlbXMpPT5cIlx1MjAyMiBcIiArIHByb2JsZW1zLm1hcCgoXyk9Pl8ubXVzdEJlKS5qb2luKFwiXFxuXHUyMDIyIFwiKSxcbiAgICAgICAgd3JpdGVSZWFzb246IChtdXN0QmUsIGRhdGEpPT5gJHtkYXRhfSBtdXN0IGJlLi4uXFxuJHttdXN0QmV9YCxcbiAgICAgICAgYWRkQ29udGV4dDogKHJlYXNvbiwgcGF0aCk9PnBhdGgubGVuZ3RoID8gYEF0ICR7cGF0aH0sICR7cmVhc29ufWAgOiByZWFzb25cbiAgICB9LFxuICAgIGN1c3RvbToge1xuICAgICAgICBtdXN0QmU6IChtdXN0QmUpPT5tdXN0QmVcbiAgICB9LFxuICAgIGNhc2VzOiB7XG4gICAgICAgIG11c3RCZTogKGNhc2VzKT0+ZGVzY3JpYmVCcmFuY2hlcyhjYXNlcylcbiAgICB9XG59O1xuZXhwb3J0IGNvbnN0IHByb2JsZW1Db2RlcyA9IG9iamVjdEtleXNPZihkZWZhdWx0UHJvYmxlbUNvbmZpZyk7XG5jb25zdCBjb21waWxlRGVmYXVsdFByb2JsZW1Xcml0ZXJzID0gKCk9PntcbiAgICBjb25zdCByZXN1bHQgPSB7fTtcbiAgICBsZXQgY29kZTtcbiAgICBmb3IgKGNvZGUgb2YgcHJvYmxlbUNvZGVzKXtcbiAgICAgICAgcmVzdWx0W2NvZGVdID0ge1xuICAgICAgICAgICAgbXVzdEJlOiBkZWZhdWx0UHJvYmxlbUNvbmZpZ1tjb2RlXS5tdXN0QmUsXG4gICAgICAgICAgICB3cml0ZVJlYXNvbjogZGVmYXVsdFByb2JsZW1Db25maWdbY29kZV0ud3JpdGVSZWFzb24gPz8gd3JpdGVEZWZhdWx0UmVhc29uLFxuICAgICAgICAgICAgYWRkQ29udGV4dDogZGVmYXVsdFByb2JsZW1Db25maWdbY29kZV0uYWRkQ29udGV4dCA/PyBhZGREZWZhdWx0Q29udGV4dFxuICAgICAgICB9O1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xufTtcbmV4cG9ydCBjb25zdCBkZWZhdWx0UHJvYmxlbVdyaXRlcnMgPSBjb21waWxlRGVmYXVsdFByb2JsZW1Xcml0ZXJzKCk7XG5leHBvcnQgY29uc3QgY29tcGlsZVByb2JsZW1Xcml0ZXJzID0gKGlucHV0KT0+e1xuICAgIGlmICghaW5wdXQpIHtcbiAgICAgICAgcmV0dXJuIGRlZmF1bHRQcm9ibGVtV3JpdGVycztcbiAgICB9XG4gICAgY29uc3QgcmVzdWx0ID0ge307XG4gICAgZm9yIChjb25zdCBjb2RlIG9mIHByb2JsZW1Db2Rlcyl7XG4gICAgICAgIHJlc3VsdFtjb2RlXSA9IHtcbiAgICAgICAgICAgIG11c3RCZTogaW5wdXRbY29kZV0/Lm11c3RCZSA/PyBkZWZhdWx0UHJvYmxlbUNvbmZpZ1tjb2RlXS5tdXN0QmUsXG4gICAgICAgICAgICB3cml0ZVJlYXNvbjogaW5wdXRbY29kZV0/LndyaXRlUmVhc29uID8/IGRlZmF1bHRQcm9ibGVtQ29uZmlnW2NvZGVdLndyaXRlUmVhc29uID8/IGlucHV0LndyaXRlUmVhc29uID8/IHdyaXRlRGVmYXVsdFJlYXNvbixcbiAgICAgICAgICAgIGFkZENvbnRleHQ6IGlucHV0W2NvZGVdPy5hZGRDb250ZXh0ID8/IGRlZmF1bHRQcm9ibGVtQ29uZmlnW2NvZGVdLmFkZENvbnRleHQgPz8gaW5wdXQuYWRkQ29udGV4dCA/PyBhZGREZWZhdWx0Q29udGV4dFxuICAgICAgICB9O1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xufTtcbiIsICJmdW5jdGlvbiBfY2hlY2tQcml2YXRlUmVkZWNsYXJhdGlvbihvYmosIHByaXZhdGVDb2xsZWN0aW9uKSB7XG4gICAgaWYgKHByaXZhdGVDb2xsZWN0aW9uLmhhcyhvYmopKSB7XG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgaW5pdGlhbGl6ZSB0aGUgc2FtZSBwcml2YXRlIGVsZW1lbnRzIHR3aWNlIG9uIGFuIG9iamVjdFwiKTtcbiAgICB9XG59XG5mdW5jdGlvbiBfY2xhc3NBcHBseURlc2NyaXB0b3JHZXQocmVjZWl2ZXIsIGRlc2NyaXB0b3IpIHtcbiAgICBpZiAoZGVzY3JpcHRvci5nZXQpIHtcbiAgICAgICAgcmV0dXJuIGRlc2NyaXB0b3IuZ2V0LmNhbGwocmVjZWl2ZXIpO1xuICAgIH1cbiAgICByZXR1cm4gZGVzY3JpcHRvci52YWx1ZTtcbn1cbmZ1bmN0aW9uIF9jbGFzc0FwcGx5RGVzY3JpcHRvclNldChyZWNlaXZlciwgZGVzY3JpcHRvciwgdmFsdWUpIHtcbiAgICBpZiAoZGVzY3JpcHRvci5zZXQpIHtcbiAgICAgICAgZGVzY3JpcHRvci5zZXQuY2FsbChyZWNlaXZlciwgdmFsdWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGlmICghZGVzY3JpcHRvci53cml0YWJsZSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcImF0dGVtcHRlZCB0byBzZXQgcmVhZCBvbmx5IHByaXZhdGUgZmllbGRcIik7XG4gICAgICAgIH1cbiAgICAgICAgZGVzY3JpcHRvci52YWx1ZSA9IHZhbHVlO1xuICAgIH1cbn1cbmZ1bmN0aW9uIF9jbGFzc0V4dHJhY3RGaWVsZERlc2NyaXB0b3IocmVjZWl2ZXIsIHByaXZhdGVNYXAsIGFjdGlvbikge1xuICAgIGlmICghcHJpdmF0ZU1hcC5oYXMocmVjZWl2ZXIpKSB7XG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJhdHRlbXB0ZWQgdG8gXCIgKyBhY3Rpb24gKyBcIiBwcml2YXRlIGZpZWxkIG9uIG5vbi1pbnN0YW5jZVwiKTtcbiAgICB9XG4gICAgcmV0dXJuIHByaXZhdGVNYXAuZ2V0KHJlY2VpdmVyKTtcbn1cbmZ1bmN0aW9uIF9jbGFzc1ByaXZhdGVGaWVsZEdldChyZWNlaXZlciwgcHJpdmF0ZU1hcCkge1xuICAgIHZhciBkZXNjcmlwdG9yID0gX2NsYXNzRXh0cmFjdEZpZWxkRGVzY3JpcHRvcihyZWNlaXZlciwgcHJpdmF0ZU1hcCwgXCJnZXRcIik7XG4gICAgcmV0dXJuIF9jbGFzc0FwcGx5RGVzY3JpcHRvckdldChyZWNlaXZlciwgZGVzY3JpcHRvcik7XG59XG5mdW5jdGlvbiBfY2xhc3NQcml2YXRlRmllbGRJbml0KG9iaiwgcHJpdmF0ZU1hcCwgdmFsdWUpIHtcbiAgICBfY2hlY2tQcml2YXRlUmVkZWNsYXJhdGlvbihvYmosIHByaXZhdGVNYXApO1xuICAgIHByaXZhdGVNYXAuc2V0KG9iaiwgdmFsdWUpO1xufVxuZnVuY3Rpb24gX2NsYXNzUHJpdmF0ZUZpZWxkU2V0KHJlY2VpdmVyLCBwcml2YXRlTWFwLCB2YWx1ZSkge1xuICAgIHZhciBkZXNjcmlwdG9yID0gX2NsYXNzRXh0cmFjdEZpZWxkRGVzY3JpcHRvcihyZWNlaXZlciwgcHJpdmF0ZU1hcCwgXCJzZXRcIik7XG4gICAgX2NsYXNzQXBwbHlEZXNjcmlwdG9yU2V0KHJlY2VpdmVyLCBkZXNjcmlwdG9yLCB2YWx1ZSk7XG4gICAgcmV0dXJuIHZhbHVlO1xufVxuZnVuY3Rpb24gX2RlZmluZVByb3BlcnR5KG9iaiwga2V5LCB2YWx1ZSkge1xuICAgIGlmIChrZXkgaW4gb2JqKSB7XG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmosIGtleSwge1xuICAgICAgICAgICAgdmFsdWU6IHZhbHVlLFxuICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgICAgICAgIHdyaXRhYmxlOiB0cnVlXG4gICAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIG9ialtrZXldID0gdmFsdWU7XG4gICAgfVxuICAgIHJldHVybiBvYmo7XG59XG5pbXBvcnQgeyBzZXJpYWxpemVDYXNlIH0gZnJvbSBcIi4uL25vZGVzL2Rpc2NyaW1pbmF0ZS5qc1wiO1xuaW1wb3J0IHsgY2hlY2tDbGFzcyB9IGZyb20gXCIuLi9ub2Rlcy9ydWxlcy9jbGFzcy5qc1wiO1xuaW1wb3J0IHsgY2hlY2tEaXZpc29yIH0gZnJvbSBcIi4uL25vZGVzL3J1bGVzL2Rpdmlzb3IuanNcIjtcbmltcG9ydCB7IGNoZWNrQm91bmQgfSBmcm9tIFwiLi4vbm9kZXMvcnVsZXMvcmFuZ2UuanNcIjtcbmltcG9ydCB7IGNoZWNrUmVnZXggfSBmcm9tIFwiLi4vbm9kZXMvcnVsZXMvcmVnZXguanNcIjtcbmltcG9ydCB7IHByZWNlZGVuY2VNYXAgfSBmcm9tIFwiLi4vbm9kZXMvcnVsZXMvcnVsZXMuanNcIjtcbmltcG9ydCB7IGRvbWFpbk9mLCBoYXNEb21haW4gfSBmcm9tIFwiLi4vdXRpbHMvZG9tYWlucy5qc1wiO1xuaW1wb3J0IHsgdGhyb3dJbnRlcm5hbEVycm9yIH0gZnJvbSBcIi4uL3V0aWxzL2Vycm9ycy5qc1wiO1xuaW1wb3J0IHsgaGFzS2V5LCBvYmplY3RLZXlzT2YgfSBmcm9tIFwiLi4vdXRpbHMvZ2VuZXJpY3MuanNcIjtcbmltcG9ydCB7IHdlbGxGb3JtZWRJbnRlZ2VyTWF0Y2hlciB9IGZyb20gXCIuLi91dGlscy9udW1lcmljTGl0ZXJhbHMuanNcIjtcbmltcG9ydCB7IGdldFBhdGgsIFBhdGggfSBmcm9tIFwiLi4vdXRpbHMvcGF0aHMuanNcIjtcbmltcG9ydCB7IGRvbWFpbnNUb0Rlc2NyaXB0aW9ucywgb2JqZWN0S2luZHNUb0Rlc2NyaXB0aW9ucywgUHJvYmxlbSwgUHJvYmxlbXMgfSBmcm9tIFwiLi9wcm9ibGVtcy5qc1wiO1xuY29uc3QgaW5pdGlhbGl6ZVRyYXZlcnNhbENvbmZpZyA9ICgpPT4oe1xuICAgICAgICBtdXN0QmU6IFtdLFxuICAgICAgICB3cml0ZVJlYXNvbjogW10sXG4gICAgICAgIGFkZENvbnRleHQ6IFtdLFxuICAgICAgICBrZXlzOiBbXVxuICAgIH0pO1xuY29uc3QgcHJvYmxlbVdyaXRlcktleXMgPSBbXG4gICAgXCJtdXN0QmVcIixcbiAgICBcIndyaXRlUmVhc29uXCIsXG4gICAgXCJhZGRDb250ZXh0XCJcbl07XG5leHBvcnQgY29uc3QgdHJhdmVyc2VSb290ID0gKHQsIGRhdGEpPT57XG4gICAgY29uc3Qgc3RhdGUgPSBuZXcgVHJhdmVyc2FsU3RhdGUoZGF0YSwgdCk7XG4gICAgdHJhdmVyc2UodC5mbGF0LCBzdGF0ZSk7XG4gICAgY29uc3QgcmVzdWx0ID0gbmV3IENoZWNrUmVzdWx0KHN0YXRlKTtcbiAgICBpZiAoc3RhdGUucHJvYmxlbXMuY291bnQpIHtcbiAgICAgICAgcmVzdWx0LnByb2JsZW1zID0gc3RhdGUucHJvYmxlbXM7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgZm9yIChjb25zdCBbbywga10gb2Ygc3RhdGUuZW50cmllc1RvUHJ1bmUpe1xuICAgICAgICAgICAgZGVsZXRlIG9ba107XG4gICAgICAgIH1cbiAgICAgICAgcmVzdWx0LmRhdGEgPSBzdGF0ZS5kYXRhO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xufTtcbmNvbnN0IENoZWNrUmVzdWx0ID0gY2xhc3Mge1xuICAgIGNvbnN0cnVjdG9yKCl7XG4gICAgICAgIF9kZWZpbmVQcm9wZXJ0eSh0aGlzLCBcImRhdGFcIiwgdm9pZCAwKTtcbiAgICAgICAgX2RlZmluZVByb3BlcnR5KHRoaXMsIFwicHJvYmxlbXNcIiwgdm9pZCAwKTtcbiAgICB9XG59O1xudmFyIF9zZWVuID0gLyojX19QVVJFX18qLyBuZXcgV2Vha01hcCgpO1xuZXhwb3J0IGNsYXNzIFRyYXZlcnNhbFN0YXRlIHtcbiAgICBnZXRQcm9ibGVtQ29uZmlnKGNvZGUpIHtcbiAgICAgICAgY29uc3QgcmVzdWx0ID0ge307XG4gICAgICAgIGZvciAoY29uc3QgayBvZiBwcm9ibGVtV3JpdGVyS2V5cyl7XG4gICAgICAgICAgICByZXN1bHRba10gPSB0aGlzLnRyYXZlcnNhbENvbmZpZ1trXVswXSA/PyB0aGlzLnJvb3RTY29wZS5jb25maWcuY29kZXNbY29kZV1ba107XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG4gICAgdHJhdmVyc2VDb25maWcoY29uZmlnRW50cmllcywgbm9kZSkge1xuICAgICAgICBmb3IgKGNvbnN0IGVudHJ5IG9mIGNvbmZpZ0VudHJpZXMpe1xuICAgICAgICAgICAgdGhpcy50cmF2ZXJzYWxDb25maWdbZW50cnlbMF1dLnVuc2hpZnQoZW50cnlbMV0pO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGlzVmFsaWQgPSB0cmF2ZXJzZShub2RlLCB0aGlzKTtcbiAgICAgICAgZm9yIChjb25zdCBlbnRyeSBvZiBjb25maWdFbnRyaWVzKXtcbiAgICAgICAgICAgIHRoaXMudHJhdmVyc2FsQ29uZmlnW2VudHJ5WzBdXS5zaGlmdCgpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBpc1ZhbGlkO1xuICAgIH1cbiAgICB0cmF2ZXJzZUtleShrZXksIG5vZGUpIHtcbiAgICAgICAgY29uc3QgbGFzdERhdGEgPSB0aGlzLmRhdGE7XG4gICAgICAgIHRoaXMuZGF0YSA9IHRoaXMuZGF0YVtrZXldO1xuICAgICAgICB0aGlzLnBhdGgucHVzaChrZXkpO1xuICAgICAgICBjb25zdCBpc1ZhbGlkID0gdHJhdmVyc2Uobm9kZSwgdGhpcyk7XG4gICAgICAgIHRoaXMucGF0aC5wb3AoKTtcbiAgICAgICAgaWYgKGxhc3REYXRhW2tleV0gIT09IHRoaXMuZGF0YSkge1xuICAgICAgICAgICAgbGFzdERhdGFba2V5XSA9IHRoaXMuZGF0YTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmRhdGEgPSBsYXN0RGF0YTtcbiAgICAgICAgcmV0dXJuIGlzVmFsaWQ7XG4gICAgfVxuICAgIHRyYXZlcnNlUmVzb2x1dGlvbihuYW1lKSB7XG4gICAgICAgIGNvbnN0IHJlc29sdXRpb24gPSB0aGlzLnR5cGUuc2NvcGUucmVzb2x2ZShuYW1lKTtcbiAgICAgICAgY29uc3QgaWQgPSByZXNvbHV0aW9uLnF1YWxpZmllZE5hbWU7XG4gICAgICAgIC8vIHRoaXMgYXNzaWdubWVudCBoZWxwcyB3aXRoIG5hcnJvd2luZ1xuICAgICAgICBjb25zdCBkYXRhID0gdGhpcy5kYXRhO1xuICAgICAgICBjb25zdCBpc09iamVjdCA9IGhhc0RvbWFpbihkYXRhLCBcIm9iamVjdFwiKTtcbiAgICAgICAgaWYgKGlzT2JqZWN0KSB7XG4gICAgICAgICAgICBjb25zdCBzZWVuQnlDdXJyZW50VHlwZSA9IF9jbGFzc1ByaXZhdGVGaWVsZEdldCh0aGlzLCBfc2VlbilbaWRdO1xuICAgICAgICAgICAgaWYgKHNlZW5CeUN1cnJlbnRUeXBlKSB7XG4gICAgICAgICAgICAgICAgaWYgKHNlZW5CeUN1cnJlbnRUeXBlLmluY2x1ZGVzKGRhdGEpKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGlmIGRhdGEgaGFzIGFscmVhZHkgYmVlbiBjaGVja2VkIGJ5IHRoaXMgYWxpYXMgYXMgcGFydCBvZlxuICAgICAgICAgICAgICAgICAgICAvLyBhIHJlc29sdXRpb24gaGlnaGVyIHVwIG9uIHRoZSBjYWxsIHN0YWNrLCBpdCBtdXN0IGJlIHZhbGlkXG4gICAgICAgICAgICAgICAgICAgIC8vIG9yIHdlIHdvdWxkbid0IGJlIGhlcmVcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHNlZW5CeUN1cnJlbnRUeXBlLnB1c2goZGF0YSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIF9jbGFzc1ByaXZhdGVGaWVsZEdldCh0aGlzLCBfc2VlbilbaWRdID0gW1xuICAgICAgICAgICAgICAgICAgICBkYXRhXG4gICAgICAgICAgICAgICAgXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBjb25zdCBsYXN0VHlwZSA9IHRoaXMudHlwZTtcbiAgICAgICAgdGhpcy50eXBlID0gcmVzb2x1dGlvbjtcbiAgICAgICAgY29uc3QgaXNWYWxpZCA9IHRyYXZlcnNlKHJlc29sdXRpb24uZmxhdCwgdGhpcyk7XG4gICAgICAgIHRoaXMudHlwZSA9IGxhc3RUeXBlO1xuICAgICAgICBpZiAoaXNPYmplY3QpIHtcbiAgICAgICAgICAgIF9jbGFzc1ByaXZhdGVGaWVsZEdldCh0aGlzLCBfc2VlbilbaWRdLnBvcCgpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBpc1ZhbGlkO1xuICAgIH1cbiAgICB0cmF2ZXJzZUJyYW5jaGVzKGJyYW5jaGVzKSB7XG4gICAgICAgIGNvbnN0IGxhc3RGYWlsRmFzdCA9IHRoaXMuZmFpbEZhc3Q7XG4gICAgICAgIHRoaXMuZmFpbEZhc3QgPSB0cnVlO1xuICAgICAgICBjb25zdCBsYXN0UHJvYmxlbXMgPSB0aGlzLnByb2JsZW1zO1xuICAgICAgICBjb25zdCBicmFuY2hQcm9ibGVtcyA9IG5ldyBQcm9ibGVtcyh0aGlzKTtcbiAgICAgICAgdGhpcy5wcm9ibGVtcyA9IGJyYW5jaFByb2JsZW1zO1xuICAgICAgICBjb25zdCBsYXN0UGF0aCA9IHRoaXMucGF0aDtcbiAgICAgICAgY29uc3QgbGFzdEtleXNUb1BydW5lID0gdGhpcy5lbnRyaWVzVG9QcnVuZTtcbiAgICAgICAgbGV0IGhhc1ZhbGlkQnJhbmNoID0gZmFsc2U7XG4gICAgICAgIGZvciAoY29uc3QgYnJhbmNoIG9mIGJyYW5jaGVzKXtcbiAgICAgICAgICAgIHRoaXMucGF0aCA9IG5ldyBQYXRoKCk7XG4gICAgICAgICAgICB0aGlzLmVudHJpZXNUb1BydW5lID0gW107XG4gICAgICAgICAgICBpZiAoY2hlY2tFbnRyaWVzKGJyYW5jaCwgdGhpcykpIHtcbiAgICAgICAgICAgICAgICBoYXNWYWxpZEJyYW5jaCA9IHRydWU7XG4gICAgICAgICAgICAgICAgbGFzdEtleXNUb1BydW5lLnB1c2goLi4udGhpcy5lbnRyaWVzVG9QcnVuZSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5wYXRoID0gbGFzdFBhdGg7XG4gICAgICAgIHRoaXMuZW50cmllc1RvUHJ1bmUgPSBsYXN0S2V5c1RvUHJ1bmU7XG4gICAgICAgIHRoaXMucHJvYmxlbXMgPSBsYXN0UHJvYmxlbXM7XG4gICAgICAgIHRoaXMuZmFpbEZhc3QgPSBsYXN0RmFpbEZhc3Q7XG4gICAgICAgIHJldHVybiBoYXNWYWxpZEJyYW5jaCB8fCAhdGhpcy5wcm9ibGVtcy5hZGQoXCJicmFuY2hlc1wiLCBicmFuY2hQcm9ibGVtcyk7XG4gICAgfVxuICAgIGNvbnN0cnVjdG9yKGRhdGEsIHR5cGUpe1xuICAgICAgICBfZGVmaW5lUHJvcGVydHkodGhpcywgXCJkYXRhXCIsIHZvaWQgMCk7XG4gICAgICAgIF9kZWZpbmVQcm9wZXJ0eSh0aGlzLCBcInR5cGVcIiwgdm9pZCAwKTtcbiAgICAgICAgX2RlZmluZVByb3BlcnR5KHRoaXMsIFwicGF0aFwiLCB2b2lkIDApO1xuICAgICAgICBfZGVmaW5lUHJvcGVydHkodGhpcywgXCJwcm9ibGVtc1wiLCB2b2lkIDApO1xuICAgICAgICBfZGVmaW5lUHJvcGVydHkodGhpcywgXCJlbnRyaWVzVG9QcnVuZVwiLCB2b2lkIDApO1xuICAgICAgICBfZGVmaW5lUHJvcGVydHkodGhpcywgXCJmYWlsRmFzdFwiLCB2b2lkIDApO1xuICAgICAgICBfZGVmaW5lUHJvcGVydHkodGhpcywgXCJ0cmF2ZXJzYWxDb25maWdcIiwgdm9pZCAwKTtcbiAgICAgICAgX2RlZmluZVByb3BlcnR5KHRoaXMsIFwicm9vdFNjb3BlXCIsIHZvaWQgMCk7XG4gICAgICAgIF9jbGFzc1ByaXZhdGVGaWVsZEluaXQodGhpcywgX3NlZW4sIHtcbiAgICAgICAgICAgIHdyaXRhYmxlOiB0cnVlLFxuICAgICAgICAgICAgdmFsdWU6IHZvaWQgMFxuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5kYXRhID0gZGF0YTtcbiAgICAgICAgdGhpcy50eXBlID0gdHlwZTtcbiAgICAgICAgdGhpcy5wYXRoID0gbmV3IFBhdGgoKTtcbiAgICAgICAgdGhpcy5wcm9ibGVtcyA9IG5ldyBQcm9ibGVtcyh0aGlzKTtcbiAgICAgICAgdGhpcy5lbnRyaWVzVG9QcnVuZSA9IFtdO1xuICAgICAgICB0aGlzLmZhaWxGYXN0ID0gZmFsc2U7XG4gICAgICAgIHRoaXMudHJhdmVyc2FsQ29uZmlnID0gaW5pdGlhbGl6ZVRyYXZlcnNhbENvbmZpZygpO1xuICAgICAgICBfY2xhc3NQcml2YXRlRmllbGRTZXQodGhpcywgX3NlZW4sIHt9KTtcbiAgICAgICAgdGhpcy5yb290U2NvcGUgPSB0eXBlLnNjb3BlO1xuICAgIH1cbn1cbmV4cG9ydCBjb25zdCB0cmF2ZXJzZSA9IChub2RlLCBzdGF0ZSk9PnR5cGVvZiBub2RlID09PSBcInN0cmluZ1wiID8gZG9tYWluT2Yoc3RhdGUuZGF0YSkgPT09IG5vZGUgfHwgIXN0YXRlLnByb2JsZW1zLmFkZChcImRvbWFpblwiLCBub2RlKSA6IGNoZWNrRW50cmllcyhub2RlLCBzdGF0ZSk7XG5leHBvcnQgY29uc3QgY2hlY2tFbnRyaWVzID0gKGVudHJpZXMsIHN0YXRlKT0+e1xuICAgIGxldCBpc1ZhbGlkID0gdHJ1ZTtcbiAgICBmb3IobGV0IGkgPSAwOyBpIDwgZW50cmllcy5sZW5ndGg7IGkrKyl7XG4gICAgICAgIGNvbnN0IFtrLCB2XSA9IGVudHJpZXNbaV07XG4gICAgICAgIGNvbnN0IGVudHJ5QWxsb3dzRGF0YSA9IGVudHJ5Q2hlY2tlcnNba10odiwgc3RhdGUpO1xuICAgICAgICBpc1ZhbGlkICYmIChpc1ZhbGlkID0gZW50cnlBbGxvd3NEYXRhKTtcbiAgICAgICAgaWYgKCFpc1ZhbGlkKSB7XG4gICAgICAgICAgICBpZiAoc3RhdGUuZmFpbEZhc3QpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoaSA8IGVudHJpZXMubGVuZ3RoIC0gMSAmJiBwcmVjZWRlbmNlTWFwW2tdIDwgcHJlY2VkZW5jZU1hcFtlbnRyaWVzW2kgKyAxXVswXV0pIHtcbiAgICAgICAgICAgICAgICAvLyBpZiB3ZSd2ZSBlbmNvdW50ZXJlZCBhIHByb2JsZW0sIHRoZXJlIGlzIGF0IGxlYXN0IG9uZSBlbnRyeVxuICAgICAgICAgICAgICAgIC8vIHJlbWFpbmluZywgYW5kIHRoZSBuZXh0IGVudHJ5IGlzIG9mIGEgaGlnaGVyIHByZWNlZGVuY2UgbGV2ZWxcbiAgICAgICAgICAgICAgICAvLyB0aGFuIHRoZSBjdXJyZW50IGVudHJ5LCByZXR1cm4gaW1tZWRpYXRlbHlcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGlzVmFsaWQ7XG59O1xuZXhwb3J0IGNvbnN0IGNoZWNrUmVxdWlyZWRQcm9wID0gKHByb3AsIHN0YXRlKT0+e1xuICAgIGlmIChwcm9wWzBdIGluIHN0YXRlLmRhdGEpIHtcbiAgICAgICAgcmV0dXJuIHN0YXRlLnRyYXZlcnNlS2V5KHByb3BbMF0sIHByb3BbMV0pO1xuICAgIH1cbiAgICBzdGF0ZS5wcm9ibGVtcy5hZGQoXCJtaXNzaW5nXCIsIHVuZGVmaW5lZCwge1xuICAgICAgICBwYXRoOiBzdGF0ZS5wYXRoLmNvbmNhdChwcm9wWzBdKSxcbiAgICAgICAgZGF0YTogdW5kZWZpbmVkXG4gICAgfSk7XG4gICAgcmV0dXJuIGZhbHNlO1xufTtcbmNvbnN0IGNyZWF0ZVByb3BDaGVja2VyID0gKGtpbmQpPT4ocHJvcHMsIHN0YXRlKT0+e1xuICAgICAgICBsZXQgaXNWYWxpZCA9IHRydWU7XG4gICAgICAgIGNvbnN0IHJlbWFpbmluZ1Vuc2VlblJlcXVpcmVkID0ge1xuICAgICAgICAgICAgLi4ucHJvcHMucmVxdWlyZWRcbiAgICAgICAgfTtcbiAgICAgICAgZm9yKGNvbnN0IGsgaW4gc3RhdGUuZGF0YSl7XG4gICAgICAgICAgICBpZiAocHJvcHMucmVxdWlyZWRba10pIHtcbiAgICAgICAgICAgICAgICBpc1ZhbGlkID0gc3RhdGUudHJhdmVyc2VLZXkoaywgcHJvcHMucmVxdWlyZWRba10pICYmIGlzVmFsaWQ7XG4gICAgICAgICAgICAgICAgZGVsZXRlIHJlbWFpbmluZ1Vuc2VlblJlcXVpcmVkW2tdO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChwcm9wcy5vcHRpb25hbFtrXSkge1xuICAgICAgICAgICAgICAgIGlzVmFsaWQgPSBzdGF0ZS50cmF2ZXJzZUtleShrLCBwcm9wcy5vcHRpb25hbFtrXSkgJiYgaXNWYWxpZDtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAocHJvcHMuaW5kZXggJiYgd2VsbEZvcm1lZEludGVnZXJNYXRjaGVyLnRlc3QoaykpIHtcbiAgICAgICAgICAgICAgICBpc1ZhbGlkID0gc3RhdGUudHJhdmVyc2VLZXkoaywgcHJvcHMuaW5kZXgpICYmIGlzVmFsaWQ7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGtpbmQgPT09IFwiZGlzdGlsbGVkUHJvcHNcIikge1xuICAgICAgICAgICAgICAgIGlmIChzdGF0ZS5mYWlsRmFzdCkge1xuICAgICAgICAgICAgICAgICAgICAvLyBJZiB3ZSdyZSBpbiBhIHVuaW9uIChpLmUuIGZhaWxGYXN0IGlzIGVuYWJsZWQpIGluXG4gICAgICAgICAgICAgICAgICAgIC8vIGRpc3RpbGxlZCBtb2RlLCB3ZSBuZWVkIHRvIHdhaXQgdG8gcHJ1bmUgZGlzdGlsbGVkIGtleXNcbiAgICAgICAgICAgICAgICAgICAgLy8gdG8gYXZvaWQgbXV0YXRpbmcgZGF0YSBiYXNlZCBvbiBhIGJyYW5jaCB0aGF0IHdpbGwgbm90IGJlXG4gICAgICAgICAgICAgICAgICAgIC8vIGluY2x1ZGVkIGluIHRoZSBmaW5hbCByZXN1bHQuIEluc3RlYWQsIHdlIHB1c2ggdGhlIG9iamVjdFxuICAgICAgICAgICAgICAgICAgICAvLyBhbmQga2V5IHRvIHN0YXRlIHRvIGhhbmRsZSBhZnRlciB0cmF2ZXJzYWwgaXMgY29tcGxldGUuXG4gICAgICAgICAgICAgICAgICAgIHN0YXRlLmVudHJpZXNUb1BydW5lLnB1c2goW1xuICAgICAgICAgICAgICAgICAgICAgICAgc3RhdGUuZGF0YSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGtcbiAgICAgICAgICAgICAgICAgICAgXSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gSWYgd2UncmUgbm90IGluIGEgdW5pb24sIHdlIGNhbiBzYWZlbHkgZGlzdGlsbCByaWdodCBhd2F5XG4gICAgICAgICAgICAgICAgICAgIGRlbGV0ZSBzdGF0ZS5kYXRhW2tdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaXNWYWxpZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHN0YXRlLnByb2JsZW1zLmFkZChcImV4dHJhbmVvdXNcIiwgc3RhdGUuZGF0YVtrXSwge1xuICAgICAgICAgICAgICAgICAgICBwYXRoOiBzdGF0ZS5wYXRoLmNvbmNhdChrKVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCFpc1ZhbGlkICYmIHN0YXRlLmZhaWxGYXN0KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHVuc2VlblJlcXVpcmVkID0gT2JqZWN0LmtleXMocmVtYWluaW5nVW5zZWVuUmVxdWlyZWQpO1xuICAgICAgICBpZiAodW5zZWVuUmVxdWlyZWQubGVuZ3RoKSB7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IGsgb2YgdW5zZWVuUmVxdWlyZWQpe1xuICAgICAgICAgICAgICAgIHN0YXRlLnByb2JsZW1zLmFkZChcIm1pc3NpbmdcIiwgdW5kZWZpbmVkLCB7XG4gICAgICAgICAgICAgICAgICAgIHBhdGg6IHN0YXRlLnBhdGguY29uY2F0KGspXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGlzVmFsaWQ7XG4gICAgfTtcbmNvbnN0IGVudHJ5Q2hlY2tlcnMgPSB7XG4gICAgcmVnZXg6IGNoZWNrUmVnZXgsXG4gICAgZGl2aXNvcjogY2hlY2tEaXZpc29yLFxuICAgIGRvbWFpbnM6IChkb21haW5zLCBzdGF0ZSk9PntcbiAgICAgICAgY29uc3QgZW50cmllcyA9IGRvbWFpbnNbZG9tYWluT2Yoc3RhdGUuZGF0YSldO1xuICAgICAgICByZXR1cm4gZW50cmllcyA/IGNoZWNrRW50cmllcyhlbnRyaWVzLCBzdGF0ZSkgOiAhc3RhdGUucHJvYmxlbXMuYWRkKFwiY2FzZXNcIiwgZG9tYWluc1RvRGVzY3JpcHRpb25zKG9iamVjdEtleXNPZihkb21haW5zKSkpO1xuICAgIH0sXG4gICAgZG9tYWluOiAoZG9tYWluLCBzdGF0ZSk9PmRvbWFpbk9mKHN0YXRlLmRhdGEpID09PSBkb21haW4gfHwgIXN0YXRlLnByb2JsZW1zLmFkZChcImRvbWFpblwiLCBkb21haW4pLFxuICAgIGJvdW5kOiBjaGVja0JvdW5kLFxuICAgIG9wdGlvbmFsUHJvcDogKHByb3AsIHN0YXRlKT0+e1xuICAgICAgICBpZiAocHJvcFswXSBpbiBzdGF0ZS5kYXRhKSB7XG4gICAgICAgICAgICByZXR1cm4gc3RhdGUudHJhdmVyc2VLZXkocHJvcFswXSwgcHJvcFsxXSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSxcbiAgICAvLyB0aGVzZSBjaGVja3Mgd29yayB0aGUgc2FtZSB3YXksIHRoZSBrZXlzIGFyZSBvbmx5IGRpc3RpbmN0IHNvIHRoYXRcbiAgICAvLyBwcmVyZXF1aXNpdGUgcHJvcHMgY2FuIGhhdmUgYSBoaWdoZXIgcHJlY2VkZW5jZVxuICAgIHJlcXVpcmVkUHJvcDogY2hlY2tSZXF1aXJlZFByb3AsXG4gICAgcHJlcmVxdWlzaXRlUHJvcDogY2hlY2tSZXF1aXJlZFByb3AsXG4gICAgaW5kZXhQcm9wOiAobm9kZSwgc3RhdGUpPT57XG4gICAgICAgIGlmICghQXJyYXkuaXNBcnJheShzdGF0ZS5kYXRhKSkge1xuICAgICAgICAgICAgc3RhdGUucHJvYmxlbXMuYWRkKFwiY2xhc3NcIiwgQXJyYXkpO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGxldCBpc1ZhbGlkID0gdHJ1ZTtcbiAgICAgICAgZm9yKGxldCBpID0gMDsgaSA8IHN0YXRlLmRhdGEubGVuZ3RoOyBpKyspe1xuICAgICAgICAgICAgaXNWYWxpZCA9IHN0YXRlLnRyYXZlcnNlS2V5KGAke2l9YCwgbm9kZSkgJiYgaXNWYWxpZDtcbiAgICAgICAgICAgIGlmICghaXNWYWxpZCAmJiBzdGF0ZS5mYWlsRmFzdCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gaXNWYWxpZDtcbiAgICB9LFxuICAgIGJyYW5jaGVzOiAoYnJhbmNoZXMsIHN0YXRlKT0+c3RhdGUudHJhdmVyc2VCcmFuY2hlcyhicmFuY2hlcyksXG4gICAgc3dpdGNoOiAocnVsZSwgc3RhdGUpPT57XG4gICAgICAgIGNvbnN0IGRhdGFBdFBhdGggPSBnZXRQYXRoKHN0YXRlLmRhdGEsIHJ1bGUucGF0aCk7XG4gICAgICAgIGNvbnN0IGNhc2VLZXkgPSBzZXJpYWxpemVDYXNlKHJ1bGUua2luZCwgZGF0YUF0UGF0aCk7XG4gICAgICAgIGlmIChoYXNLZXkocnVsZS5jYXNlcywgY2FzZUtleSkpIHtcbiAgICAgICAgICAgIHJldHVybiBjaGVja0VudHJpZXMocnVsZS5jYXNlc1tjYXNlS2V5XSwgc3RhdGUpO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGNhc2VLZXlzID0gb2JqZWN0S2V5c09mKHJ1bGUuY2FzZXMpO1xuICAgICAgICBjb25zdCBtaXNzaW5nQ2FzZVBhdGggPSBzdGF0ZS5wYXRoLmNvbmNhdChydWxlLnBhdGgpO1xuICAgICAgICBjb25zdCBjYXNlRGVzY3JpcHRpb25zID0gcnVsZS5raW5kID09PSBcInZhbHVlXCIgPyBjYXNlS2V5cyA6IHJ1bGUua2luZCA9PT0gXCJkb21haW5cIiA/IGRvbWFpbnNUb0Rlc2NyaXB0aW9ucyhjYXNlS2V5cykgOiBydWxlLmtpbmQgPT09IFwiY2xhc3NcIiA/IG9iamVjdEtpbmRzVG9EZXNjcmlwdGlvbnMoY2FzZUtleXMpIDogdGhyb3dJbnRlcm5hbEVycm9yKGBVbmV4cGVjdGVkbHkgZW5jb3VudGVyZWQgcnVsZSBraW5kICcke3J1bGUua2luZH0nIGR1cmluZyB0cmF2ZXJzYWxgKTtcbiAgICAgICAgc3RhdGUucHJvYmxlbXMuYWRkKFwiY2FzZXNcIiwgY2FzZURlc2NyaXB0aW9ucywge1xuICAgICAgICAgICAgcGF0aDogbWlzc2luZ0Nhc2VQYXRoLFxuICAgICAgICAgICAgZGF0YTogZGF0YUF0UGF0aFxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0sXG4gICAgYWxpYXM6IChuYW1lLCBzdGF0ZSk9PnN0YXRlLnRyYXZlcnNlUmVzb2x1dGlvbihuYW1lKSxcbiAgICBjbGFzczogY2hlY2tDbGFzcyxcbiAgICBuYXJyb3c6IChuYXJyb3csIHN0YXRlKT0+e1xuICAgICAgICBjb25zdCBsYXN0UHJvYmxlbXNDb3VudCA9IHN0YXRlLnByb2JsZW1zLmNvdW50O1xuICAgICAgICBjb25zdCByZXN1bHQgPSBuYXJyb3coc3RhdGUuZGF0YSwgc3RhdGUucHJvYmxlbXMpO1xuICAgICAgICBpZiAoIXJlc3VsdCAmJiBzdGF0ZS5wcm9ibGVtcy5jb3VudCA9PT0gbGFzdFByb2JsZW1zQ291bnQpIHtcbiAgICAgICAgICAgIHN0YXRlLnByb2JsZW1zLm11c3RCZShuYXJyb3cubmFtZSA/IGB2YWxpZCBhY2NvcmRpbmcgdG8gJHtuYXJyb3cubmFtZX1gIDogXCJ2YWxpZFwiKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH0sXG4gICAgY29uZmlnOiAoeyBjb25maWcgLCBub2RlICB9LCBzdGF0ZSk9PnN0YXRlLnRyYXZlcnNlQ29uZmlnKGNvbmZpZywgbm9kZSksXG4gICAgdmFsdWU6ICh2YWx1ZSwgc3RhdGUpPT5zdGF0ZS5kYXRhID09PSB2YWx1ZSB8fCAhc3RhdGUucHJvYmxlbXMuYWRkKFwidmFsdWVcIiwgdmFsdWUpLFxuICAgIG1vcnBoOiAobW9ycGgsIHN0YXRlKT0+e1xuICAgICAgICBjb25zdCBvdXQgPSBtb3JwaChzdGF0ZS5kYXRhLCBzdGF0ZS5wcm9ibGVtcyk7XG4gICAgICAgIGlmIChzdGF0ZS5wcm9ibGVtcy5sZW5ndGgpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAob3V0IGluc3RhbmNlb2YgUHJvYmxlbSkge1xuICAgICAgICAgICAgLy8gaWYgYSBwcm9ibGVtIHdhcyByZXR1cm5lZCBmcm9tIHRoZSBtb3JwaCBidXQgbm90IGFkZGVkLCBhZGQgaXRcbiAgICAgICAgICAgIHN0YXRlLnByb2JsZW1zLmFkZFByb2JsZW0ob3V0KTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAob3V0IGluc3RhbmNlb2YgQ2hlY2tSZXN1bHQpIHtcbiAgICAgICAgICAgIGlmIChvdXQucHJvYmxlbXMpIHtcbiAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IHByb2JsZW0gb2Ygb3V0LnByb2JsZW1zKXtcbiAgICAgICAgICAgICAgICAgICAgc3RhdGUucHJvYmxlbXMuYWRkUHJvYmxlbShwcm9ibGVtKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc3RhdGUuZGF0YSA9IG91dC5kYXRhO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgc3RhdGUuZGF0YSA9IG91dDtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSxcbiAgICBkaXN0aWxsZWRQcm9wczogY3JlYXRlUHJvcENoZWNrZXIoXCJkaXN0aWxsZWRQcm9wc1wiKSxcbiAgICBzdHJpY3RQcm9wczogY3JlYXRlUHJvcENoZWNrZXIoXCJzdHJpY3RQcm9wc1wiKVxufTtcbiIsICIvKipcbiAqICBDYW4gYmUgdXNlZCB0byBhbGxvdyBhcmJpdHJhcmlseSBjaGFpbmVkIHByb3BlcnR5IGFjY2VzcyBhbmQgZnVuY3Rpb24gY2FsbHMuXG4gKiAgVGhpcyBpcyB1c2VmdWwgZm9yIGV4cHJlc3Npb25zIHdob3NlIG1lYW5pbmcgaXMgbm90IGF0dGFjaGVkIHRvIGEgdmFsdWUsXG4gKiAgZS5nLiB0byBhbGxvdyB0aGUgZXh0cmFjdGlvbiBvZiB0eXBlcyB1c2luZyB0eXBlb2Ygd2l0aG91dCBkZXBlbmRpbmcgb25cbiAqICB0aGUgZXhpc3RlbmNlIG9mIGEgcmVhbCBvYmplY3QgdGhhdCBjb25mb3JtcyB0byB0aGF0IHR5cGUncyBzdHJ1Y3R1cmU6XG4gKlxuICogQGV4YW1wbGVcbiAqIGNvbnN0IG15VHlwZTogTXlUeXBlID0gY2hhaW5hYmxlTm9PcFByb3h5XG4gKlxuICogLy8gVGhlIGZvbGxvd2luZyB0eXBlcyBhcmUgZXF1aXZhbGVudFxuICogdHlwZSBFeHRyYWN0ZWRUeXBlID0gdHlwZW9mIG15VHlwZS5hLmIuY1xuICogdHlwZSBEaXJlY3RseUV4dHJhY3RlZFR5cGUgPSBNeVR5cGVbXCJhXCJdW1wiYlwiXVtcImNcIl1cbiAqLyBleHBvcnQgY29uc3QgY2hhaW5hYmxlTm9PcFByb3h5ID0gbmV3IFByb3h5KCgpPT5jaGFpbmFibGVOb09wUHJveHksIHtcbiAgICBnZXQ6ICgpPT5jaGFpbmFibGVOb09wUHJveHlcbn0pO1xuIiwgImltcG9ydCB7IHRyYXZlcnNlUm9vdCB9IGZyb20gXCIuLi90cmF2ZXJzZS90cmF2ZXJzZS5qc1wiO1xuaW1wb3J0IHsgY2hhaW5hYmxlTm9PcFByb3h5IH0gZnJvbSBcIi4uL3V0aWxzL2NoYWluYWJsZU5vT3BQcm94eS5qc1wiO1xuZXhwb3J0IGNvbnN0IGluaXRpYWxpemVUeXBlID0gKG5hbWUsIGRlZmluaXRpb24sIGNvbmZpZywgc2NvcGUpPT57XG4gICAgY29uc3Qgcm9vdCA9IHtcbiAgICAgICAgLy8gdGVtcG9yYXJpbHkgaW5pdGlhbGl6ZSBub2RlL2ZsYXQgdG8gYWxpYXNlcyB0aGF0IHdpbGwgYmUgaW5jbHVkZWQgaW5cbiAgICAgICAgLy8gdGhlIGZpbmFsIHR5cGUgaW4gY2FzZSBvZiBjeWNsaWMgcmVzb2x1dGlvbnNcbiAgICAgICAgbm9kZTogbmFtZSxcbiAgICAgICAgZmxhdDogW1xuICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgIFwiYWxpYXNcIixcbiAgICAgICAgICAgICAgICBuYW1lXG4gICAgICAgICAgICBdXG4gICAgICAgIF0sXG4gICAgICAgIGFsbG93czogKGRhdGEpPT4hbmFtZWRUcmF2ZXJzZShkYXRhKS5wcm9ibGVtcyxcbiAgICAgICAgYXNzZXJ0OiAoZGF0YSk9PntcbiAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IG5hbWVkVHJhdmVyc2UoZGF0YSk7XG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0LnByb2JsZW1zID8gcmVzdWx0LnByb2JsZW1zLnRocm93KCkgOiByZXN1bHQuZGF0YTtcbiAgICAgICAgfSxcbiAgICAgICAgaW5mZXI6IGNoYWluYWJsZU5vT3BQcm94eSxcbiAgICAgICAgaW5mZXJJbjogY2hhaW5hYmxlTm9PcFByb3h5LFxuICAgICAgICBxdWFsaWZpZWROYW1lOiBpc0Fub255bW91c05hbWUobmFtZSkgPyBzY29wZS5nZXRBbm9ueW1vdXNRdWFsaWZpZWROYW1lKG5hbWUpIDogYCR7c2NvcGUubmFtZX0uJHtuYW1lfWAsXG4gICAgICAgIGRlZmluaXRpb24sXG4gICAgICAgIHNjb3BlLFxuICAgICAgICBpbmNsdWRlc01vcnBoOiBmYWxzZSxcbiAgICAgICAgY29uZmlnXG4gICAgfTtcbiAgICAvLyBkZWZpbmUgd2l0aGluIGEga2V5IHRvIGR5bmFtaWNhbGx5IGFzc2lnbiBhIG5hbWUgdG8gdGhlIGZ1bmN0aW9uXG4gICAgY29uc3QgbmFtZWRUcmF2ZXJzZSA9IHtcbiAgICAgICAgW25hbWVdOiAoZGF0YSk9PnRyYXZlcnNlUm9vdChuYW1lZFRyYXZlcnNlLCBkYXRhKVxuICAgIH1bbmFtZV07XG4gICAgY29uc3QgdCA9IE9iamVjdC5hc3NpZ24obmFtZWRUcmF2ZXJzZSwgcm9vdCk7XG4gICAgcmV0dXJuIHQ7XG59O1xuZXhwb3J0IGNvbnN0IGlzVHlwZSA9ICh2YWx1ZSk9PnZhbHVlPy5pbmZlciA9PT0gY2hhaW5hYmxlTm9PcFByb3h5O1xuZXhwb3J0IGNvbnN0IGlzQW5vbnltb3VzTmFtZSA9IChuYW1lKT0+bmFtZVswXSA9PT0gXCJcdTAzQkJcIjtcbiIsICJpbXBvcnQgeyB0cnlQYXJzZVdlbGxGb3JtZWRCaWdpbnQsIHRyeVBhcnNlV2VsbEZvcm1lZE51bWJlciB9IGZyb20gXCIuLi8uLi8uLi8uLi91dGlscy9udW1lcmljTGl0ZXJhbHMuanNcIjtcbmV4cG9ydCBjb25zdCBwYXJzZVVuZW5jbG9zZWQgPSAocyk9PntcbiAgICBjb25zdCB0b2tlbiA9IHMuc2Nhbm5lci5zaGlmdFVudGlsTmV4dFRlcm1pbmF0b3IoKTtcbiAgICBzLnNldFJvb3QodW5lbmNsb3NlZFRvTm9kZShzLCB0b2tlbikpO1xufTtcbmNvbnN0IHVuZW5jbG9zZWRUb05vZGUgPSAocywgdG9rZW4pPT57XG4gICAgaWYgKHMuY3R4LnR5cGUuc2NvcGUuYWRkUGFyc2VkUmVmZXJlbmNlSWZSZXNvbHZhYmxlKHRva2VuLCBzLmN0eCkpIHtcbiAgICAgICAgcmV0dXJuIHRva2VuO1xuICAgIH1cbiAgICByZXR1cm4gbWF5YmVQYXJzZVVuZW5jbG9zZWRMaXRlcmFsKHRva2VuKSA/PyBzLmVycm9yKHRva2VuID09PSBcIlwiID8gd3JpdGVNaXNzaW5nT3BlcmFuZE1lc3NhZ2UocykgOiB3cml0ZVVucmVzb2x2YWJsZU1lc3NhZ2UodG9rZW4pKTtcbn07XG5jb25zdCBtYXliZVBhcnNlVW5lbmNsb3NlZExpdGVyYWwgPSAodG9rZW4pPT57XG4gICAgY29uc3QgbWF5YmVOdW1iZXIgPSB0cnlQYXJzZVdlbGxGb3JtZWROdW1iZXIodG9rZW4pO1xuICAgIGlmIChtYXliZU51bWJlciAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBudW1iZXI6IHtcbiAgICAgICAgICAgICAgICB2YWx1ZTogbWF5YmVOdW1iZXJcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9XG4gICAgY29uc3QgbWF5YmVCaWdpbnQgPSB0cnlQYXJzZVdlbGxGb3JtZWRCaWdpbnQodG9rZW4pO1xuICAgIGlmIChtYXliZUJpZ2ludCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBiaWdpbnQ6IHtcbiAgICAgICAgICAgICAgICB2YWx1ZTogbWF5YmVCaWdpbnRcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9XG59O1xuZXhwb3J0IGNvbnN0IHdyaXRlVW5yZXNvbHZhYmxlTWVzc2FnZSA9ICh0b2tlbik9PmAnJHt0b2tlbn0nIGlzIHVucmVzb2x2YWJsZWA7XG5leHBvcnQgY29uc3Qgd3JpdGVNaXNzaW5nT3BlcmFuZE1lc3NhZ2UgPSAocyk9PntcbiAgICBjb25zdCBvcGVyYXRvciA9IHMucHJldmlvdXNPcGVyYXRvcigpO1xuICAgIHJldHVybiBvcGVyYXRvciA/IHdyaXRlTWlzc2luZ1JpZ2h0T3BlcmFuZE1lc3NhZ2Uob3BlcmF0b3IsIHMuc2Nhbm5lci51bnNjYW5uZWQpIDogd3JpdGVFeHByZXNzaW9uRXhwZWN0ZWRNZXNzYWdlKHMuc2Nhbm5lci51bnNjYW5uZWQpO1xufTtcbmV4cG9ydCBjb25zdCB3cml0ZU1pc3NpbmdSaWdodE9wZXJhbmRNZXNzYWdlID0gKHRva2VuLCB1bnNjYW5uZWQpPT5gVG9rZW4gJyR7dG9rZW59JyByZXF1aXJlcyBhIHJpZ2h0IG9wZXJhbmQke3Vuc2Nhbm5lZCA/IGAgYmVmb3JlICcke3Vuc2Nhbm5lZH0nYCA6IFwiXCJ9YDtcbmV4cG9ydCBjb25zdCB3cml0ZUV4cHJlc3Npb25FeHBlY3RlZE1lc3NhZ2UgPSAodW5zY2FubmVkKT0+YEV4cGVjdGVkIGFuIGV4cHJlc3Npb24ke3Vuc2Nhbm5lZCA/IGAgYmVmb3JlICcke3Vuc2Nhbm5lZH0nYCA6IFwiXCJ9YDtcbiIsICJpbXBvcnQgeyBwYXJzZURlZmluaXRpb24gfSBmcm9tIFwiLi4vZGVmaW5pdGlvbi5qc1wiO1xuLyoqXG4gKiBAb3BlcmF0b3Ige0BsaW5rIHBhcnNlQ29uZmlnVHVwbGUgfCA6fVxuICogQGRvY2dlblRhYmxlXG4gKiBAdHVwbGUgW1widHlwZVwiLCBcIjpcIiwgY29uZmlnXVxuICovIGV4cG9ydCBjb25zdCBwYXJzZUNvbmZpZ1R1cGxlID0gKGRlZiwgY3R4KT0+KHtcbiAgICAgICAgbm9kZTogY3R4LnR5cGUuc2NvcGUucmVzb2x2ZVR5cGVOb2RlKHBhcnNlRGVmaW5pdGlvbihkZWZbMF0sIGN0eCkpLFxuICAgICAgICBjb25maWc6IGRlZlsyXVxuICAgIH0pO1xuIiwgImV4cG9ydCBjb25zdCBkZWVwRnJlZXplID0gKHZhbHVlKT0+T2JqZWN0LmlzRnJvemVuKHZhbHVlKSA/IHZhbHVlIDogQXJyYXkuaXNBcnJheSh2YWx1ZSkgPyBPYmplY3QuZnJlZXplKHZhbHVlLm1hcChkZWVwRnJlZXplKSkgOiBkZWVwRnJlZXplRGljdGlvbmFyeSh2YWx1ZSk7XG5jb25zdCBkZWVwRnJlZXplRGljdGlvbmFyeSA9ICh2YWx1ZSk9PntcbiAgICBmb3IoY29uc3QgayBpbiB2YWx1ZSl7XG4gICAgICAgIGRlZXBGcmVlemUodmFsdWVba10pO1xuICAgIH1cbiAgICByZXR1cm4gdmFsdWU7XG59O1xuIiwgImltcG9ydCB7IG1hcHBlZEtleXMgfSBmcm9tIFwiLi4vLi4vbm9kZXMvcnVsZXMvcHJvcHMuanNcIjtcbmltcG9ydCB7IHRocm93SW50ZXJuYWxFcnJvciB9IGZyb20gXCIuLi8uLi91dGlscy9lcnJvcnMuanNcIjtcbmltcG9ydCB7IGRlZXBGcmVlemUgfSBmcm9tIFwiLi4vLi4vdXRpbHMvZnJlZXplLmpzXCI7XG5pbXBvcnQgeyBsaXN0RnJvbSwgb2JqZWN0S2V5c09mLCBwcm90b3R5cGVLZXlzT2YgfSBmcm9tIFwiLi4vLi4vdXRpbHMvZ2VuZXJpY3MuanNcIjtcbmltcG9ydCB7IHRyeVBhcnNlV2VsbEZvcm1lZEludGVnZXIsIHdlbGxGb3JtZWROb25OZWdhdGl2ZUludGVnZXJNYXRjaGVyIH0gZnJvbSBcIi4uLy4uL3V0aWxzL251bWVyaWNMaXRlcmFscy5qc1wiO1xuaW1wb3J0IHsgZGVmYXVsdE9iamVjdEtpbmRzIH0gZnJvbSBcIi4uLy4uL3V0aWxzL29iamVjdEtpbmRzLmpzXCI7XG5pbXBvcnQgeyBzdHJpbmdpZnkgfSBmcm9tIFwiLi4vLi4vdXRpbHMvc2VyaWFsaXplLmpzXCI7XG5pbXBvcnQgeyBwYXJzZURlZmluaXRpb24gfSBmcm9tIFwiLi4vZGVmaW5pdGlvbi5qc1wiO1xuaW1wb3J0IHsgd3JpdGVJbXBsaWNpdE5ldmVyTWVzc2FnZSB9IGZyb20gXCIuL2ludGVyc2VjdGlvbi5qc1wiO1xuY29uc3QgYXJyYXlJbmRleFN0cmluZ0JyYW5jaCA9IGRlZXBGcmVlemUoe1xuICAgIHJlZ2V4OiB3ZWxsRm9ybWVkTm9uTmVnYXRpdmVJbnRlZ2VyTWF0Y2hlci5zb3VyY2Vcbn0pO1xuY29uc3QgYXJyYXlJbmRleE51bWJlckJyYW5jaCA9IGRlZXBGcmVlemUoe1xuICAgIHJhbmdlOiB7XG4gICAgICAgIG1pbjoge1xuICAgICAgICAgICAgY29tcGFyYXRvcjogXCI+PVwiLFxuICAgICAgICAgICAgbGltaXQ6IDBcbiAgICAgICAgfVxuICAgIH0sXG4gICAgZGl2aXNvcjogMVxufSk7XG5leHBvcnQgY29uc3QgcGFyc2VLZXlPZlR1cGxlID0gKGRlZiwgY3R4KT0+e1xuICAgIGNvbnN0IHJlc29sdXRpb24gPSBjdHgudHlwZS5zY29wZS5yZXNvbHZlTm9kZShwYXJzZURlZmluaXRpb24oZGVmWzFdLCBjdHgpKTtcbiAgICBjb25zdCBwcmVkaWNhdGVLZXlzID0gb2JqZWN0S2V5c09mKHJlc29sdXRpb24pLm1hcCgoZG9tYWluKT0+a2V5c09mUHJlZGljYXRlKGRvbWFpbiwgcmVzb2x1dGlvbltkb21haW5dKSk7XG4gICAgY29uc3Qgc2hhcmVkS2V5cyA9IHNoYXJlZEtleXNPZihwcmVkaWNhdGVLZXlzKTtcbiAgICBpZiAoIXNoYXJlZEtleXMubGVuZ3RoKSB7XG4gICAgICAgIHJldHVybiB3cml0ZUltcGxpY2l0TmV2ZXJNZXNzYWdlKGN0eC5wYXRoLCBcImtleW9mXCIpO1xuICAgIH1cbiAgICBjb25zdCBrZXlOb2RlID0ge307XG4gICAgZm9yIChjb25zdCBrZXkgb2Ygc2hhcmVkS2V5cyl7XG4gICAgICAgIGNvbnN0IGtleVR5cGUgPSB0eXBlb2Yga2V5O1xuICAgICAgICBpZiAoa2V5VHlwZSA9PT0gXCJzdHJpbmdcIiB8fCBrZXlUeXBlID09PSBcIm51bWJlclwiIHx8IGtleVR5cGUgPT09IFwic3ltYm9sXCIpIHtcbiAgICAgICAgICAgIHZhciBfa2V5Tm9kZSwgX2tleVR5cGU7XG4gICAgICAgICAgICAoX2tleU5vZGUgPSBrZXlOb2RlKVtfa2V5VHlwZSA9IGtleVR5cGVdID8/IChfa2V5Tm9kZVtfa2V5VHlwZV0gPSBbXSk7XG4gICAgICAgICAgICBrZXlOb2RlW2tleVR5cGVdLnB1c2goe1xuICAgICAgICAgICAgICAgIHZhbHVlOiBrZXlcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2UgaWYgKGtleSA9PT0gd2VsbEZvcm1lZE5vbk5lZ2F0aXZlSW50ZWdlck1hdGNoZXIpIHtcbiAgICAgICAgICAgIHZhciBfa2V5Tm9kZTEsIF9rZXlOb2RlMjtcbiAgICAgICAgICAgIChfa2V5Tm9kZTEgPSBrZXlOb2RlKS5zdHJpbmcgPz8gKF9rZXlOb2RlMS5zdHJpbmcgPSBbXSk7XG4gICAgICAgICAgICBrZXlOb2RlLnN0cmluZy5wdXNoKGFycmF5SW5kZXhTdHJpbmdCcmFuY2gpO1xuICAgICAgICAgICAgKF9rZXlOb2RlMiA9IGtleU5vZGUpLm51bWJlciA/PyAoX2tleU5vZGUyLm51bWJlciA9IFtdKTtcbiAgICAgICAgICAgIGtleU5vZGUubnVtYmVyLnB1c2goYXJyYXlJbmRleE51bWJlckJyYW5jaCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdGhyb3dJbnRlcm5hbEVycm9yKGBVbmV4cGVjdGVkIGtleW9mIGtleSAnJHtzdHJpbmdpZnkoa2V5KX0nYCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIE9iamVjdC5mcm9tRW50cmllcyhPYmplY3QuZW50cmllcyhrZXlOb2RlKS5tYXAoKFtkb21haW4sIGJyYW5jaGVzXSk9PltcbiAgICAgICAgICAgIGRvbWFpbixcbiAgICAgICAgICAgIGJyYW5jaGVzLmxlbmd0aCA9PT0gMSA/IGJyYW5jaGVzWzBdIDogYnJhbmNoZXNcbiAgICAgICAgXSkpO1xufTtcbmNvbnN0IGJhc2VLZXlzQnlEb21haW4gPSB7XG4gICAgYmlnaW50OiBwcm90b3R5cGVLZXlzT2YoMG4pLFxuICAgIGJvb2xlYW46IHByb3RvdHlwZUtleXNPZihmYWxzZSksXG4gICAgbnVsbDogW10sXG4gICAgbnVtYmVyOiBwcm90b3R5cGVLZXlzT2YoMCksXG4gICAgLy8gVFMgZG9lc24ndCBpbmNsdWRlIHRoZSBPYmplY3QgcHJvdG90eXBlIGluIGtleW9mLCBzbyBrZXlvZiBvYmplY3QgaXMgbmV2ZXJcbiAgICBvYmplY3Q6IFtdLFxuICAgIHN0cmluZzogcHJvdG90eXBlS2V5c09mKFwiXCIpLFxuICAgIHN5bWJvbDogcHJvdG90eXBlS2V5c09mKFN5bWJvbCgpKSxcbiAgICB1bmRlZmluZWQ6IFtdXG59O1xuY29uc3Qga2V5c09mUHJlZGljYXRlID0gKGRvbWFpbiwgcHJlZGljYXRlKT0+ZG9tYWluICE9PSBcIm9iamVjdFwiIHx8IHByZWRpY2F0ZSA9PT0gdHJ1ZSA/IGJhc2VLZXlzQnlEb21haW5bZG9tYWluXSA6IHNoYXJlZEtleXNPZihsaXN0RnJvbShwcmVkaWNhdGUpLm1hcCgoYnJhbmNoKT0+a2V5c09mT2JqZWN0QnJhbmNoKGJyYW5jaCkpKTtcbmNvbnN0IHNoYXJlZEtleXNPZiA9IChrZXlCcmFuY2hlcyk9PntcbiAgICBpZiAoIWtleUJyYW5jaGVzLmxlbmd0aCkge1xuICAgICAgICByZXR1cm4gW107XG4gICAgfVxuICAgIGxldCBzaGFyZWRLZXlzID0ga2V5QnJhbmNoZXNbMF07XG4gICAgZm9yKGxldCBpID0gMTsgaSA8IGtleUJyYW5jaGVzLmxlbmd0aDsgaSsrKXtcbiAgICAgICAgLy8gd2UgY2FuIGZpbHRlciBkaXJlY3RseSBieSBlcXVhbGl0eSBoZXJlIGJlY2F1c2UgdGhlIFJlZ0V4cCB3ZSdyZVxuICAgICAgICAvLyB1c2luZyB3aWxsIGFsd2F5cyBiZSByZWZlcmVuY2UgZXF1YWwgdG9cbiAgICAgICAgLy8gd2VsbEZvcm1lZE5vbk5lZ2F0aXZlSW50ZWdlck1hdGNoZXJcbiAgICAgICAgc2hhcmVkS2V5cyA9IHNoYXJlZEtleXMuZmlsdGVyKChrKT0+a2V5QnJhbmNoZXNbaV0uaW5jbHVkZXMoaykpO1xuICAgIH1cbiAgICByZXR1cm4gc2hhcmVkS2V5cztcbn07XG5jb25zdCBrZXlzT2ZPYmplY3RCcmFuY2ggPSAoYnJhbmNoKT0+e1xuICAgIGNvbnN0IHJlc3VsdCA9IFtdO1xuICAgIGlmIChcInByb3BzXCIgaW4gYnJhbmNoKSB7XG4gICAgICAgIGZvciAoY29uc3Qga2V5IG9mIE9iamVjdC5rZXlzKGJyYW5jaC5wcm9wcykpe1xuICAgICAgICAgICAgaWYgKGtleSA9PT0gbWFwcGVkS2V5cy5pbmRleCkge1xuICAgICAgICAgICAgICAgIC8vIGlmIGFueSBudW1iZXIgaXMgYSB2YWxpZCBrZXkgcHVzaCB0aGlzIFJlZ0V4cFxuICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKHdlbGxGb3JtZWROb25OZWdhdGl2ZUludGVnZXJNYXRjaGVyKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIXJlc3VsdC5pbmNsdWRlcyhrZXkpKSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0LnB1c2goa2V5KTtcbiAgICAgICAgICAgICAgICBpZiAod2VsbEZvcm1lZE5vbk5lZ2F0aXZlSW50ZWdlck1hdGNoZXIudGVzdChrZXkpKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGFsbG93IG51bWVyaWMgYWNjZXNzIHRvIGtleXNcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0LnB1c2godHJ5UGFyc2VXZWxsRm9ybWVkSW50ZWdlcihrZXksIGBVbmV4cGVjdGVkbHkgZmFpbGVkIHRvIHBhcnNlIGFuIGludGVnZXIgZnJvbSBrZXkgJyR7a2V5fSdgKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIGlmIChcImNsYXNzXCIgaW4gYnJhbmNoKSB7XG4gICAgICAgIGNvbnN0IGNvbnN0cnVjdG9yID0gdHlwZW9mIGJyYW5jaC5jbGFzcyA9PT0gXCJzdHJpbmdcIiA/IGRlZmF1bHRPYmplY3RLaW5kc1ticmFuY2guY2xhc3NdIDogYnJhbmNoLmNsYXNzO1xuICAgICAgICBmb3IgKGNvbnN0IGtleSBvZiBwcm90b3R5cGVLZXlzT2YoY29uc3RydWN0b3IucHJvdG90eXBlKSl7XG4gICAgICAgICAgICBpZiAoIXJlc3VsdC5pbmNsdWRlcyhrZXkpKSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0LnB1c2goa2V5KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xufTtcbiIsICJpbXBvcnQgeyBpc1RyYW5zZm9ybWF0aW9uQnJhbmNoIH0gZnJvbSBcIi4uLy4uL25vZGVzL2JyYW5jaC5qc1wiO1xuaW1wb3J0IHsgdGhyb3dJbnRlcm5hbEVycm9yLCB0aHJvd1BhcnNlRXJyb3IgfSBmcm9tIFwiLi4vLi4vdXRpbHMvZXJyb3JzLmpzXCI7XG5pbXBvcnQgeyBpc0FycmF5IH0gZnJvbSBcIi4uLy4uL3V0aWxzL29iamVjdEtpbmRzLmpzXCI7XG5pbXBvcnQgeyBzdHJpbmdpZnkgfSBmcm9tIFwiLi4vLi4vdXRpbHMvc2VyaWFsaXplLmpzXCI7XG5pbXBvcnQgeyBwYXJzZURlZmluaXRpb24gfSBmcm9tIFwiLi4vZGVmaW5pdGlvbi5qc1wiO1xuZXhwb3J0IGNvbnN0IHBhcnNlTW9ycGhUdXBsZSA9IChkZWYsIGN0eCk9PntcbiAgICBpZiAodHlwZW9mIGRlZlsyXSAhPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgIHJldHVybiB0aHJvd1BhcnNlRXJyb3Iod3JpdGVNYWxmb3JtZWRNb3JwaEV4cHJlc3Npb25NZXNzYWdlKGRlZlsyXSkpO1xuICAgIH1cbiAgICBjb25zdCBub2RlID0gcGFyc2VEZWZpbml0aW9uKGRlZlswXSwgY3R4KTtcbiAgICBjb25zdCByZXNvbHV0aW9uID0gY3R4LnR5cGUuc2NvcGUucmVzb2x2ZVR5cGVOb2RlKG5vZGUpO1xuICAgIGNvbnN0IG1vcnBoID0gZGVmWzJdO1xuICAgIGN0eC50eXBlLmluY2x1ZGVzTW9ycGggPSB0cnVlO1xuICAgIGxldCBkb21haW47XG4gICAgY29uc3QgcmVzdWx0ID0ge307XG4gICAgZm9yKGRvbWFpbiBpbiByZXNvbHV0aW9uKXtcbiAgICAgICAgY29uc3QgcHJlZGljYXRlID0gcmVzb2x1dGlvbltkb21haW5dO1xuICAgICAgICBpZiAocHJlZGljYXRlID09PSB0cnVlKSB7XG4gICAgICAgICAgICByZXN1bHRbZG9tYWluXSA9IHtcbiAgICAgICAgICAgICAgICBydWxlczoge30sXG4gICAgICAgICAgICAgICAgbW9ycGhcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIHByZWRpY2F0ZSA9PT0gXCJvYmplY3RcIikge1xuICAgICAgICAgICAgcmVzdWx0W2RvbWFpbl0gPSBpc0FycmF5KHByZWRpY2F0ZSkgPyBwcmVkaWNhdGUubWFwKChicmFuY2gpPT5hcHBseU1vcnBoKGJyYW5jaCwgbW9ycGgpKSA6IGFwcGx5TW9ycGgocHJlZGljYXRlLCBtb3JwaCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aHJvd0ludGVybmFsRXJyb3IoYFVuZXhwZWN0ZWQgcHJlZGljYXRlIHZhbHVlIGZvciBkb21haW4gJyR7ZG9tYWlufSc6ICR7c3RyaW5naWZ5KHByZWRpY2F0ZSl9YCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbn07XG5jb25zdCBhcHBseU1vcnBoID0gKGJyYW5jaCwgbW9ycGgpPT5pc1RyYW5zZm9ybWF0aW9uQnJhbmNoKGJyYW5jaCkgPyB7XG4gICAgICAgIC4uLmJyYW5jaCxcbiAgICAgICAgbW9ycGg6IGJyYW5jaC5tb3JwaCA/IEFycmF5LmlzQXJyYXkoYnJhbmNoLm1vcnBoKSA/IFtcbiAgICAgICAgICAgIC4uLmJyYW5jaC5tb3JwaCxcbiAgICAgICAgICAgIG1vcnBoXG4gICAgICAgIF0gOiBbXG4gICAgICAgICAgICBicmFuY2gubW9ycGgsXG4gICAgICAgICAgICBtb3JwaFxuICAgICAgICBdIDogbW9ycGhcbiAgICB9IDoge1xuICAgICAgICBydWxlczogYnJhbmNoLFxuICAgICAgICBtb3JwaFxuICAgIH07XG5leHBvcnQgY29uc3Qgd3JpdGVNYWxmb3JtZWRNb3JwaEV4cHJlc3Npb25NZXNzYWdlID0gKHZhbHVlKT0+YE1vcnBoIGV4cHJlc3Npb24gcmVxdWlyZXMgYSBmdW5jdGlvbiBmb2xsb3dpbmcgJ3w+JyAod2FzICR7dHlwZW9mIHZhbHVlfSlgO1xuIiwgImltcG9ydCB7IGhhc0RvbWFpbiB9IGZyb20gXCIuLi8uLi91dGlscy9kb21haW5zLmpzXCI7XG5pbXBvcnQgeyB0aHJvd1BhcnNlRXJyb3IgfSBmcm9tIFwiLi4vLi4vdXRpbHMvZXJyb3JzLmpzXCI7XG5pbXBvcnQgeyBvYmplY3RLZXlzT2YgfSBmcm9tIFwiLi4vLi4vdXRpbHMvZ2VuZXJpY3MuanNcIjtcbmltcG9ydCB7IHN0cmluZ2lmeSB9IGZyb20gXCIuLi8uLi91dGlscy9zZXJpYWxpemUuanNcIjtcbmV4cG9ydCBjb25zdCB3cml0ZU1hbGZvcm1lZERpc3RyaWJ1dGFibGVGdW5jdGlvbk1lc3NhZ2UgPSAoZGVmKT0+YEV4cGVjdGVkIGEgRnVuY3Rpb24gb3IgUmVjb3JkPERvbWFpbiwgRnVuY3Rpb24+IG9wZXJhbmQgKCR7c3RyaW5naWZ5KGRlZil9IHdhcyBpbnZhbGlkKWA7XG5leHBvcnQgY29uc3QgZGlzdHJpYnV0ZUZ1bmN0aW9uVG9Ob2RlID0gKGRpc3RyaWJ1dGFibGVGdW5jdGlvbiwgbm9kZSwgY3R4LCBydWxlS2V5KT0+e1xuICAgIGNvbnN0IGRvbWFpbnMgPSBvYmplY3RLZXlzT2Yobm9kZSk7XG4gICAgaWYgKCFoYXNEb21haW4oZGlzdHJpYnV0YWJsZUZ1bmN0aW9uLCBcIm9iamVjdFwiKSkge1xuICAgICAgICByZXR1cm4gdGhyb3dQYXJzZUVycm9yKHdyaXRlTWFsZm9ybWVkRGlzdHJpYnV0YWJsZUZ1bmN0aW9uTWVzc2FnZShkaXN0cmlidXRhYmxlRnVuY3Rpb24pKTtcbiAgICB9XG4gICAgY29uc3QgZGlzdHJpYnV0ZWQgPSB7fTtcbiAgICBpZiAodHlwZW9mIGRpc3RyaWJ1dGFibGVGdW5jdGlvbiA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgIGNvbnN0IGRvbWFpbkZ1bmN0aW9uID0ge1xuICAgICAgICAgICAgW3J1bGVLZXldOiBkaXN0cmlidXRhYmxlRnVuY3Rpb25cbiAgICAgICAgfTtcbiAgICAgICAgZm9yIChjb25zdCBkb21haW4gb2YgZG9tYWlucyl7XG4gICAgICAgICAgICBkaXN0cmlidXRlZFtkb21haW5dID0gZG9tYWluRnVuY3Rpb247XG4gICAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgICBmb3IgKGNvbnN0IGRvbWFpbiBvZiBkb21haW5zKXtcbiAgICAgICAgICAgIGlmIChkaXN0cmlidXRhYmxlRnVuY3Rpb25bZG9tYWluXSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBmdW5jdGlvbkluRG9tYWluID0ge1xuICAgICAgICAgICAgICAgIFtydWxlS2V5XTogZGlzdHJpYnV0YWJsZUZ1bmN0aW9uW2RvbWFpbl1cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBpZiAodHlwZW9mIGZ1bmN0aW9uSW5Eb21haW5bcnVsZUtleV0gIT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aHJvd1BhcnNlRXJyb3Iod3JpdGVNYWxmb3JtZWREaXN0cmlidXRhYmxlRnVuY3Rpb25NZXNzYWdlKGZ1bmN0aW9uSW5Eb21haW4pKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGRpc3RyaWJ1dGVkW2RvbWFpbl0gPSBmdW5jdGlvbkluRG9tYWluO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBkaXN0cmlidXRlZDtcbn07XG4iLCAiaW1wb3J0IHsgaXNDb25maWdOb2RlLCByb290SW50ZXJzZWN0aW9uIH0gZnJvbSBcIi4uLy4uL25vZGVzL25vZGUuanNcIjtcbmltcG9ydCB7IHBhcnNlRGVmaW5pdGlvbiB9IGZyb20gXCIuLi9kZWZpbml0aW9uLmpzXCI7XG5pbXBvcnQgeyBkaXN0cmlidXRlRnVuY3Rpb25Ub05vZGUgfSBmcm9tIFwiLi9kaXN0cmlidXRhYmxlRnVuY3Rpb24uanNcIjtcbmV4cG9ydCBjb25zdCBwYXJzZU5hcnJvd1R1cGxlID0gKGRlZiwgY3R4KT0+e1xuICAgIGNvbnN0IGlucHV0Tm9kZSA9IHBhcnNlRGVmaW5pdGlvbihkZWZbMF0sIGN0eCk7XG4gICAgY29uc3QgcmVzb2x1dGlvbiA9IGN0eC50eXBlLnNjb3BlLnJlc29sdmVOb2RlKGlucHV0Tm9kZSk7XG4gICAgY29uc3QgaGFzQ29uZmlnID0gaXNDb25maWdOb2RlKHJlc29sdXRpb24pO1xuICAgIGNvbnN0IHR5cGVOb2RlID0gaGFzQ29uZmlnID8gcmVzb2x1dGlvbi5ub2RlIDogcmVzb2x1dGlvbjtcbiAgICBjb25zdCByZXN1bHQgPSByb290SW50ZXJzZWN0aW9uKGlucHV0Tm9kZSwgZGlzdHJpYnV0ZUZ1bmN0aW9uVG9Ob2RlKGRlZlsyXSwgdHlwZU5vZGUsIGN0eCwgXCJuYXJyb3dcIiksIGN0eC50eXBlKTtcbiAgICByZXR1cm4gaGFzQ29uZmlnID8ge1xuICAgICAgICBjb25maWc6IHJlc29sdXRpb24uY29uZmlnLFxuICAgICAgICBub2RlOiByZXN1bHRcbiAgICB9IDogcmVzdWx0O1xufTtcbiIsICJpbXBvcnQgeyByb290SW50ZXJzZWN0aW9uLCByb290VW5pb24sIHRvQXJyYXlOb2RlIH0gZnJvbSBcIi4uLy4uL25vZGVzL25vZGUuanNcIjtcbmltcG9ydCB7IGRvbWFpbk9mIH0gZnJvbSBcIi4uLy4uL3V0aWxzL2RvbWFpbnMuanNcIjtcbmltcG9ydCB7IHRocm93UGFyc2VFcnJvciB9IGZyb20gXCIuLi8uLi91dGlscy9lcnJvcnMuanNcIjtcbmltcG9ydCB7IHBhcnNlRGVmaW5pdGlvbiB9IGZyb20gXCIuLi9kZWZpbml0aW9uLmpzXCI7XG5pbXBvcnQgeyB3cml0ZU1pc3NpbmdSaWdodE9wZXJhbmRNZXNzYWdlIH0gZnJvbSBcIi4uL3N0cmluZy9zaGlmdC9vcGVyYW5kL3VuZW5jbG9zZWQuanNcIjtcbmltcG9ydCB7IHBhcnNlQ29uZmlnVHVwbGUgfSBmcm9tIFwiLi9jb25maWcuanNcIjtcbmltcG9ydCB7IHBhcnNlS2V5T2ZUdXBsZSB9IGZyb20gXCIuL2tleW9mLmpzXCI7XG5pbXBvcnQgeyBwYXJzZU1vcnBoVHVwbGUgfSBmcm9tIFwiLi9tb3JwaC5qc1wiO1xuaW1wb3J0IHsgcGFyc2VOYXJyb3dUdXBsZSB9IGZyb20gXCIuL25hcnJvdy5qc1wiO1xuZXhwb3J0IGNvbnN0IHBhcnNlVHVwbGUgPSAoZGVmLCBjdHgpPT57XG4gICAgaWYgKGlzSW5kZXhPbmVFeHByZXNzaW9uKGRlZikpIHtcbiAgICAgICAgcmV0dXJuIGluZGV4T25lUGFyc2Vyc1tkZWZbMV1dKGRlZiwgY3R4KTtcbiAgICB9XG4gICAgaWYgKGlzSW5kZXhaZXJvRXhwcmVzc2lvbihkZWYpKSB7XG4gICAgICAgIHJldHVybiBwcmVmaXhQYXJzZXJzW2RlZlswXV0oZGVmLCBjdHgpO1xuICAgIH1cbiAgICBjb25zdCBwcm9wcyA9IHtcbiAgICAgICAgLy8gIGxlbmd0aCBpcyBjcmVhdGVkIGFzIGEgcHJlcmVxdWlzaXRlIHByb3AsIGVuc3VyaW5nIGlmIGl0IGlzIGludmFsaWQsXG4gICAgICAgIC8vICBubyBvdGhlciBwcm9wcyB3aWxsIGJlIGNoZWNrZWQsIHdoaWNoIGlzIHVzdWFsbHkgZGVzaXJhYmxlIGZvciB0dXBsZVxuICAgICAgICAvLyAgZGVmaW5pdGlvbnMuXG4gICAgICAgIGxlbmd0aDogW1xuICAgICAgICAgICAgXCIhXCIsXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgbnVtYmVyOiB7XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlOiBkZWYubGVuZ3RoXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICBdXG4gICAgfTtcbiAgICBmb3IobGV0IGkgPSAwOyBpIDwgZGVmLmxlbmd0aDsgaSsrKXtcbiAgICAgICAgY3R4LnBhdGgucHVzaChgJHtpfWApO1xuICAgICAgICBwcm9wc1tpXSA9IHBhcnNlRGVmaW5pdGlvbihkZWZbaV0sIGN0eCk7XG4gICAgICAgIGN0eC5wYXRoLnBvcCgpO1xuICAgIH1cbiAgICByZXR1cm4ge1xuICAgICAgICBvYmplY3Q6IHtcbiAgICAgICAgICAgIGNsYXNzOiBBcnJheSxcbiAgICAgICAgICAgIHByb3BzXG4gICAgICAgIH1cbiAgICB9O1xufTtcbmNvbnN0IHBhcnNlQnJhbmNoVHVwbGUgPSAoZGVmLCBjdHgpPT57XG4gICAgaWYgKGRlZlsyXSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHJldHVybiB0aHJvd1BhcnNlRXJyb3Iod3JpdGVNaXNzaW5nUmlnaHRPcGVyYW5kTWVzc2FnZShkZWZbMV0sIFwiXCIpKTtcbiAgICB9XG4gICAgY29uc3QgbCA9IHBhcnNlRGVmaW5pdGlvbihkZWZbMF0sIGN0eCk7XG4gICAgY29uc3QgciA9IHBhcnNlRGVmaW5pdGlvbihkZWZbMl0sIGN0eCk7XG4gICAgcmV0dXJuIGRlZlsxXSA9PT0gXCImXCIgPyByb290SW50ZXJzZWN0aW9uKGwsIHIsIGN0eC50eXBlKSA6IHJvb3RVbmlvbihsLCByLCBjdHgudHlwZSk7XG59O1xuY29uc3QgcGFyc2VBcnJheVR1cGxlID0gKGRlZiwgc2NvcGUpPT50b0FycmF5Tm9kZShwYXJzZURlZmluaXRpb24oZGVmWzBdLCBzY29wZSkpO1xuZXhwb3J0IGNvbnN0IHdyaXRlTWFsZm9ybWVkRnVuY3Rpb25hbEV4cHJlc3Npb25NZXNzYWdlID0gKG9wZXJhdG9yLCByaWdodERlZik9PmBFeHByZXNzaW9uIHJlcXVpcmVzIGEgZnVuY3Rpb24gZm9sbG93aW5nICcke29wZXJhdG9yfScgKHdhcyAke3R5cGVvZiByaWdodERlZn0pYDtcbmNvbnN0IGlzSW5kZXhPbmVFeHByZXNzaW9uID0gKGRlZik9PmluZGV4T25lUGFyc2Vyc1tkZWZbMV1dICE9PSB1bmRlZmluZWQ7XG5jb25zdCBpbmRleE9uZVBhcnNlcnMgPSB7XG4gICAgXCJ8XCI6IHBhcnNlQnJhbmNoVHVwbGUsXG4gICAgXCImXCI6IHBhcnNlQnJhbmNoVHVwbGUsXG4gICAgXCJbXVwiOiBwYXJzZUFycmF5VHVwbGUsXG4gICAgXCI9PlwiOiBwYXJzZU5hcnJvd1R1cGxlLFxuICAgIFwifD5cIjogcGFyc2VNb3JwaFR1cGxlLFxuICAgIFwiOlwiOiBwYXJzZUNvbmZpZ1R1cGxlXG59O1xuY29uc3QgcHJlZml4UGFyc2VycyA9IHtcbiAgICBrZXlvZjogcGFyc2VLZXlPZlR1cGxlLFxuICAgIGluc3RhbmNlb2Y6IChkZWYpPT57XG4gICAgICAgIGlmICh0eXBlb2YgZGVmWzFdICE9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgIHJldHVybiB0aHJvd1BhcnNlRXJyb3IoYEV4cGVjdGVkIGEgY29uc3RydWN0b3IgZm9sbG93aW5nICdpbnN0YW5jZW9mJyBvcGVyYXRvciAod2FzICR7dHlwZW9mIGRlZlsxXX0pLmApO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBvYmplY3Q6IHtcbiAgICAgICAgICAgICAgICBjbGFzczogZGVmWzFdXG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfSxcbiAgICBcIj09PVwiOiAoZGVmKT0+KHtcbiAgICAgICAgICAgIFtkb21haW5PZihkZWZbMV0pXToge1xuICAgICAgICAgICAgICAgIHZhbHVlOiBkZWZbMV1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSksXG4gICAgbm9kZTogKGRlZik9PmRlZlsxXVxufTtcbmNvbnN0IGlzSW5kZXhaZXJvRXhwcmVzc2lvbiA9IChkZWYpPT5wcmVmaXhQYXJzZXJzW2RlZlswXV0gIT09IHVuZGVmaW5lZDtcbiIsICJpbXBvcnQgeyBwYXJzZURlZmluaXRpb24gfSBmcm9tIFwiLi9kZWZpbml0aW9uLmpzXCI7XG5pbXBvcnQgeyBTY2FubmVyIH0gZnJvbSBcIi4vc3RyaW5nL3NoaWZ0L3NjYW5uZXIuanNcIjtcbmV4cG9ydCBjb25zdCBwYXJzZVJlY29yZCA9IChkZWYsIGN0eCk9PntcbiAgICBjb25zdCBwcm9wcyA9IHt9O1xuICAgIGZvcihjb25zdCBkZWZpbml0aW9uS2V5IGluIGRlZil7XG4gICAgICAgIGxldCBrZXlOYW1lID0gZGVmaW5pdGlvbktleTtcbiAgICAgICAgbGV0IGlzT3B0aW9uYWwgPSBmYWxzZTtcbiAgICAgICAgaWYgKGRlZmluaXRpb25LZXlbZGVmaW5pdGlvbktleS5sZW5ndGggLSAxXSA9PT0gXCI/XCIpIHtcbiAgICAgICAgICAgIGlmIChkZWZpbml0aW9uS2V5W2RlZmluaXRpb25LZXkubGVuZ3RoIC0gMl0gPT09IFNjYW5uZXIuZXNjYXBlVG9rZW4pIHtcbiAgICAgICAgICAgICAgICBrZXlOYW1lID0gYCR7ZGVmaW5pdGlvbktleS5zbGljZSgwLCAtMil9P2A7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGtleU5hbWUgPSBkZWZpbml0aW9uS2V5LnNsaWNlKDAsIC0xKTtcbiAgICAgICAgICAgICAgICBpc09wdGlvbmFsID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBjdHgucGF0aC5wdXNoKGtleU5hbWUpO1xuICAgICAgICBjb25zdCBwcm9wTm9kZSA9IHBhcnNlRGVmaW5pdGlvbihkZWZbZGVmaW5pdGlvbktleV0sIGN0eCk7XG4gICAgICAgIGN0eC5wYXRoLnBvcCgpO1xuICAgICAgICBwcm9wc1trZXlOYW1lXSA9IGlzT3B0aW9uYWwgPyBbXG4gICAgICAgICAgICBcIj9cIixcbiAgICAgICAgICAgIHByb3BOb2RlXG4gICAgICAgIF0gOiBwcm9wTm9kZTtcbiAgICB9XG4gICAgcmV0dXJuIHtcbiAgICAgICAgb2JqZWN0OiB7XG4gICAgICAgICAgICBwcm9wc1xuICAgICAgICB9XG4gICAgfTtcbn07XG4iLCAiaW1wb3J0IHsgU2Nhbm5lciB9IGZyb20gXCIuLi9zaGlmdC9zY2FubmVyLmpzXCI7XG5leHBvcnQgY29uc3Qgd3JpdGVVbm1hdGNoZWRHcm91cENsb3NlTWVzc2FnZSA9ICh1bnNjYW5uZWQpPT5gVW5tYXRjaGVkICkke3Vuc2Nhbm5lZCA9PT0gXCJcIiA/IFwiXCIgOiBgIGJlZm9yZSAke3Vuc2Nhbm5lZH1gfWA7XG5leHBvcnQgY29uc3QgdW5jbG9zZWRHcm91cE1lc3NhZ2UgPSBcIk1pc3NpbmcgKVwiO1xuZXhwb3J0IGNvbnN0IHdyaXRlT3BlblJhbmdlTWVzc2FnZSA9IChtaW4sIGNvbXBhcmF0b3IpPT5gTGVmdCBib3VuZHMgYXJlIG9ubHkgdmFsaWQgd2hlbiBwYWlyZWQgd2l0aCByaWdodCBib3VuZHMgKHRyeSAuLi4ke2NvbXBhcmF0b3J9JHttaW59KWA7XG5leHBvcnQgY29uc3Qgd3JpdGVVbnBhaXJhYmxlQ29tcGFyYXRvck1lc3NhZ2UgPSAoY29tcGFyYXRvcik9PmBMZWZ0LWJvdW5kZWQgZXhwcmVzc2lvbnMgbXVzdCBzcGVjaWZ5IHRoZWlyIGxpbWl0cyB1c2luZyA8IG9yIDw9ICh3YXMgJHtjb21wYXJhdG9yfSlgO1xuZXhwb3J0IGNvbnN0IHdyaXRlTXVsdGlwbGVMZWZ0Qm91bmRzTWVzc2FnZSA9IChvcGVuTGltaXQsIG9wZW5Db21wYXJhdG9yLCBsaW1pdCwgY29tcGFyYXRvcik9PmBBbiBleHByZXNzaW9uIG1heSBoYXZlIGF0IG1vc3Qgb25lIGxlZnQgYm91bmQgKHBhcnNlZCAke29wZW5MaW1pdH0ke1NjYW5uZXIuaW52ZXJ0ZWRDb21wYXJhdG9yc1tvcGVuQ29tcGFyYXRvcl19LCAke2xpbWl0fSR7U2Nhbm5lci5pbnZlcnRlZENvbXBhcmF0b3JzW2NvbXBhcmF0b3JdfSlgO1xuIiwgImZ1bmN0aW9uIF9kZWZpbmVQcm9wZXJ0eShvYmosIGtleSwgdmFsdWUpIHtcbiAgICBpZiAoa2V5IGluIG9iaikge1xuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqLCBrZXksIHtcbiAgICAgICAgICAgIHZhbHVlOiB2YWx1ZSxcbiAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICAgICAgICB3cml0YWJsZTogdHJ1ZVxuICAgICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBvYmpba2V5XSA9IHZhbHVlO1xuICAgIH1cbiAgICByZXR1cm4gb2JqO1xufVxuaW1wb3J0IHsgaXNMaXRlcmFsTm9kZSwgcm9vdEludGVyc2VjdGlvbiwgcm9vdFVuaW9uLCB0b0FycmF5Tm9kZSB9IGZyb20gXCIuLi8uLi8uLi9ub2Rlcy9ub2RlLmpzXCI7XG5pbXBvcnQgeyBtaW5Db21wYXJhdG9ycyB9IGZyb20gXCIuLi8uLi8uLi9ub2Rlcy9ydWxlcy9yYW5nZS5qc1wiO1xuaW1wb3J0IHsgdGhyb3dJbnRlcm5hbEVycm9yLCB0aHJvd1BhcnNlRXJyb3IgfSBmcm9tIFwiLi4vLi4vLi4vdXRpbHMvZXJyb3JzLmpzXCI7XG5pbXBvcnQgeyBpc0tleU9mIH0gZnJvbSBcIi4uLy4uLy4uL3V0aWxzL2dlbmVyaWNzLmpzXCI7XG5pbXBvcnQgeyBzdHJpbmdpZnkgfSBmcm9tIFwiLi4vLi4vLi4vdXRpbHMvc2VyaWFsaXplLmpzXCI7XG5pbXBvcnQgeyBTY2FubmVyIH0gZnJvbSBcIi4uL3NoaWZ0L3NjYW5uZXIuanNcIjtcbmltcG9ydCB7IHVuY2xvc2VkR3JvdXBNZXNzYWdlLCB3cml0ZU11bHRpcGxlTGVmdEJvdW5kc01lc3NhZ2UsIHdyaXRlT3BlblJhbmdlTWVzc2FnZSwgd3JpdGVVbm1hdGNoZWRHcm91cENsb3NlTWVzc2FnZSwgd3JpdGVVbnBhaXJhYmxlQ29tcGFyYXRvck1lc3NhZ2UgfSBmcm9tIFwiLi9zaGFyZWQuanNcIjtcbmV4cG9ydCBjbGFzcyBEeW5hbWljU3RhdGUge1xuICAgIGVycm9yKG1lc3NhZ2UpIHtcbiAgICAgICAgcmV0dXJuIHRocm93UGFyc2VFcnJvcihtZXNzYWdlKTtcbiAgICB9XG4gICAgaGFzUm9vdCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucm9vdCAhPT0gdW5kZWZpbmVkO1xuICAgIH1cbiAgICByZXNvbHZlUm9vdCgpIHtcbiAgICAgICAgdGhpcy5hc3NlcnRIYXNSb290KCk7XG4gICAgICAgIHJldHVybiB0aGlzLmN0eC50eXBlLnNjb3BlLnJlc29sdmVUeXBlTm9kZSh0aGlzLnJvb3QpO1xuICAgIH1cbiAgICByb290VG9TdHJpbmcoKSB7XG4gICAgICAgIHRoaXMuYXNzZXJ0SGFzUm9vdCgpO1xuICAgICAgICByZXR1cm4gc3RyaW5naWZ5KHRoaXMucm9vdCk7XG4gICAgfVxuICAgIGVqZWN0Um9vdElmTGltaXQoKSB7XG4gICAgICAgIHRoaXMuYXNzZXJ0SGFzUm9vdCgpO1xuICAgICAgICBjb25zdCByZXNvbHV0aW9uID0gdHlwZW9mIHRoaXMucm9vdCA9PT0gXCJzdHJpbmdcIiA/IHRoaXMuY3R4LnR5cGUuc2NvcGUucmVzb2x2ZU5vZGUodGhpcy5yb290KSA6IHRoaXMucm9vdDtcbiAgICAgICAgaWYgKGlzTGl0ZXJhbE5vZGUocmVzb2x1dGlvbiwgXCJudW1iZXJcIikpIHtcbiAgICAgICAgICAgIGNvbnN0IGxpbWl0ID0gcmVzb2x1dGlvbi5udW1iZXIudmFsdWU7XG4gICAgICAgICAgICB0aGlzLnJvb3QgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICByZXR1cm4gbGltaXQ7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZWplY3RSYW5nZUlmT3BlbigpIHtcbiAgICAgICAgaWYgKHRoaXMuYnJhbmNoZXMucmFuZ2UpIHtcbiAgICAgICAgICAgIGNvbnN0IHJhbmdlID0gdGhpcy5icmFuY2hlcy5yYW5nZTtcbiAgICAgICAgICAgIGRlbGV0ZSB0aGlzLmJyYW5jaGVzLnJhbmdlO1xuICAgICAgICAgICAgcmV0dXJuIHJhbmdlO1xuICAgICAgICB9XG4gICAgfVxuICAgIGFzc2VydEhhc1Jvb3QoKSB7XG4gICAgICAgIGlmICh0aGlzLnJvb3QgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuIHRocm93SW50ZXJuYWxFcnJvcihcIlVuZXhwZWN0ZWQgaW50ZXJhY3Rpb24gd2l0aCB1bnNldCByb290XCIpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGFzc2VydFVuc2V0Um9vdCgpIHtcbiAgICAgICAgaWYgKHRoaXMucm9vdCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhyb3dJbnRlcm5hbEVycm9yKFwiVW5leHBlY3RlZCBhdHRlbXB0IHRvIG92ZXJ3cml0ZSByb290XCIpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHNldFJvb3Qobm9kZSkge1xuICAgICAgICB0aGlzLmFzc2VydFVuc2V0Um9vdCgpO1xuICAgICAgICB0aGlzLnJvb3QgPSBub2RlO1xuICAgIH1cbiAgICByb290VG9BcnJheSgpIHtcbiAgICAgICAgdGhpcy5yb290ID0gdG9BcnJheU5vZGUodGhpcy5lamVjdFJvb3QoKSk7XG4gICAgfVxuICAgIGludGVyc2VjdChub2RlKSB7XG4gICAgICAgIHRoaXMucm9vdCA9IHJvb3RJbnRlcnNlY3Rpb24odGhpcy5lamVjdFJvb3QoKSwgbm9kZSwgdGhpcy5jdHgudHlwZSk7XG4gICAgfVxuICAgIGVqZWN0Um9vdCgpIHtcbiAgICAgICAgdGhpcy5hc3NlcnRIYXNSb290KCk7XG4gICAgICAgIGNvbnN0IHJvb3QgPSB0aGlzLnJvb3Q7XG4gICAgICAgIHRoaXMucm9vdCA9IHVuZGVmaW5lZDtcbiAgICAgICAgcmV0dXJuIHJvb3Q7XG4gICAgfVxuICAgIGVqZWN0RmluYWxpemVkUm9vdCgpIHtcbiAgICAgICAgdGhpcy5hc3NlcnRIYXNSb290KCk7XG4gICAgICAgIGNvbnN0IHJvb3QgPSB0aGlzLnJvb3Q7XG4gICAgICAgIHRoaXMucm9vdCA9IGVqZWN0ZWRQcm94eTtcbiAgICAgICAgcmV0dXJuIHJvb3Q7XG4gICAgfVxuICAgIGZpbmFsaXplKCkge1xuICAgICAgICBpZiAodGhpcy5ncm91cHMubGVuZ3RoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5lcnJvcih1bmNsb3NlZEdyb3VwTWVzc2FnZSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5maW5hbGl6ZUJyYW5jaGVzKCk7XG4gICAgICAgIHRoaXMuc2Nhbm5lci5maW5hbGl6ZWQgPSB0cnVlO1xuICAgIH1cbiAgICByZWR1Y2VMZWZ0Qm91bmQobGltaXQsIGNvbXBhcmF0b3IpIHtcbiAgICAgICAgY29uc3QgaW52ZXJ0ZWRDb21wYXJhdG9yID0gU2Nhbm5lci5pbnZlcnRlZENvbXBhcmF0b3JzW2NvbXBhcmF0b3JdO1xuICAgICAgICBpZiAoIWlzS2V5T2YoaW52ZXJ0ZWRDb21wYXJhdG9yLCBtaW5Db21wYXJhdG9ycykpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmVycm9yKHdyaXRlVW5wYWlyYWJsZUNvbXBhcmF0b3JNZXNzYWdlKGNvbXBhcmF0b3IpKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5icmFuY2hlcy5yYW5nZSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZXJyb3Iod3JpdGVNdWx0aXBsZUxlZnRCb3VuZHNNZXNzYWdlKGAke3RoaXMuYnJhbmNoZXMucmFuZ2UubGltaXR9YCwgdGhpcy5icmFuY2hlcy5yYW5nZS5jb21wYXJhdG9yLCBgJHtsaW1pdH1gLCBpbnZlcnRlZENvbXBhcmF0b3IpKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmJyYW5jaGVzLnJhbmdlID0ge1xuICAgICAgICAgICAgbGltaXQsXG4gICAgICAgICAgICBjb21wYXJhdG9yOiBpbnZlcnRlZENvbXBhcmF0b3JcbiAgICAgICAgfTtcbiAgICB9XG4gICAgZmluYWxpemVCcmFuY2hlcygpIHtcbiAgICAgICAgdGhpcy5hc3NlcnRSYW5nZVVuc2V0KCk7XG4gICAgICAgIGlmICh0aGlzLmJyYW5jaGVzLnVuaW9uKSB7XG4gICAgICAgICAgICB0aGlzLnB1c2hSb290VG9CcmFuY2goXCJ8XCIpO1xuICAgICAgICAgICAgdGhpcy5zZXRSb290KHRoaXMuYnJhbmNoZXMudW5pb24pO1xuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuYnJhbmNoZXMuaW50ZXJzZWN0aW9uKSB7XG4gICAgICAgICAgICB0aGlzLnNldFJvb3Qocm9vdEludGVyc2VjdGlvbih0aGlzLmJyYW5jaGVzLmludGVyc2VjdGlvbiwgdGhpcy5lamVjdFJvb3QoKSwgdGhpcy5jdHgudHlwZSkpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGZpbmFsaXplR3JvdXAoKSB7XG4gICAgICAgIHRoaXMuZmluYWxpemVCcmFuY2hlcygpO1xuICAgICAgICBjb25zdCB0b3BCcmFuY2hTdGF0ZSA9IHRoaXMuZ3JvdXBzLnBvcCgpO1xuICAgICAgICBpZiAoIXRvcEJyYW5jaFN0YXRlKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5lcnJvcih3cml0ZVVubWF0Y2hlZEdyb3VwQ2xvc2VNZXNzYWdlKHRoaXMuc2Nhbm5lci51bnNjYW5uZWQpKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmJyYW5jaGVzID0gdG9wQnJhbmNoU3RhdGU7XG4gICAgfVxuICAgIHB1c2hSb290VG9CcmFuY2godG9rZW4pIHtcbiAgICAgICAgdGhpcy5hc3NlcnRSYW5nZVVuc2V0KCk7XG4gICAgICAgIHRoaXMuYnJhbmNoZXMuaW50ZXJzZWN0aW9uID0gdGhpcy5icmFuY2hlcy5pbnRlcnNlY3Rpb24gPyByb290SW50ZXJzZWN0aW9uKHRoaXMuYnJhbmNoZXMuaW50ZXJzZWN0aW9uLCB0aGlzLmVqZWN0Um9vdCgpLCB0aGlzLmN0eC50eXBlKSA6IHRoaXMuZWplY3RSb290KCk7XG4gICAgICAgIGlmICh0b2tlbiA9PT0gXCJ8XCIpIHtcbiAgICAgICAgICAgIHRoaXMuYnJhbmNoZXMudW5pb24gPSB0aGlzLmJyYW5jaGVzLnVuaW9uID8gcm9vdFVuaW9uKHRoaXMuYnJhbmNoZXMudW5pb24sIHRoaXMuYnJhbmNoZXMuaW50ZXJzZWN0aW9uLCB0aGlzLmN0eC50eXBlKSA6IHRoaXMuYnJhbmNoZXMuaW50ZXJzZWN0aW9uO1xuICAgICAgICAgICAgZGVsZXRlIHRoaXMuYnJhbmNoZXMuaW50ZXJzZWN0aW9uO1xuICAgICAgICB9XG4gICAgfVxuICAgIGFzc2VydFJhbmdlVW5zZXQoKSB7XG4gICAgICAgIGlmICh0aGlzLmJyYW5jaGVzLnJhbmdlKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5lcnJvcih3cml0ZU9wZW5SYW5nZU1lc3NhZ2UoYCR7dGhpcy5icmFuY2hlcy5yYW5nZS5saW1pdH1gLCB0aGlzLmJyYW5jaGVzLnJhbmdlLmNvbXBhcmF0b3IpKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZWR1Y2VHcm91cE9wZW4oKSB7XG4gICAgICAgIHRoaXMuZ3JvdXBzLnB1c2godGhpcy5icmFuY2hlcyk7XG4gICAgICAgIHRoaXMuYnJhbmNoZXMgPSB7fTtcbiAgICB9XG4gICAgcHJldmlvdXNPcGVyYXRvcigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYnJhbmNoZXMucmFuZ2U/LmNvbXBhcmF0b3IgPz8gdGhpcy5icmFuY2hlcy5pbnRlcnNlY3Rpb24gPyBcIiZcIiA6IHRoaXMuYnJhbmNoZXMudW5pb24gPyBcInxcIiA6IHVuZGVmaW5lZDtcbiAgICB9XG4gICAgc2hpZnRlZEJ5T25lKCkge1xuICAgICAgICB0aGlzLnNjYW5uZXIuc2hpZnQoKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIGNvbnN0cnVjdG9yKGRlZiwgY3R4KXtcbiAgICAgICAgX2RlZmluZVByb3BlcnR5KHRoaXMsIFwiY3R4XCIsIHZvaWQgMCk7XG4gICAgICAgIF9kZWZpbmVQcm9wZXJ0eSh0aGlzLCBcInNjYW5uZXJcIiwgdm9pZCAwKTtcbiAgICAgICAgX2RlZmluZVByb3BlcnR5KHRoaXMsIFwicm9vdFwiLCB2b2lkIDApO1xuICAgICAgICBfZGVmaW5lUHJvcGVydHkodGhpcywgXCJicmFuY2hlc1wiLCB2b2lkIDApO1xuICAgICAgICBfZGVmaW5lUHJvcGVydHkodGhpcywgXCJncm91cHNcIiwgdm9pZCAwKTtcbiAgICAgICAgdGhpcy5jdHggPSBjdHg7XG4gICAgICAgIHRoaXMuYnJhbmNoZXMgPSB7fTtcbiAgICAgICAgdGhpcy5ncm91cHMgPSBbXTtcbiAgICAgICAgdGhpcy5zY2FubmVyID0gbmV3IFNjYW5uZXIoZGVmKTtcbiAgICB9XG59XG5jb25zdCBlamVjdGVkUHJveHkgPSBuZXcgUHJveHkoe30sIHtcbiAgICBnZXQ6ICgpPT50aHJvd0ludGVybmFsRXJyb3IoYFVuZXhwZWN0ZWQgYXR0ZW1wdCB0byBhY2Nlc3MgZWplY3RlZCBhdHRyaWJ1dGVzYClcbn0pO1xuIiwgImltcG9ydCB7IGdldFJlZ2V4IH0gZnJvbSBcIi4uLy4uLy4uLy4uL25vZGVzL3J1bGVzL3JlZ2V4LmpzXCI7XG5leHBvcnQgY29uc3QgcGFyc2VFbmNsb3NlZCA9IChzLCBlbmNsb3NpbmcpPT57XG4gICAgY29uc3QgdG9rZW4gPSBzLnNjYW5uZXIuc2hpZnRVbnRpbCh1bnRpbExvb2thaGVhZElzQ2xvc2luZ1tlbmNsb3NpbmddKTtcbiAgICBpZiAocy5zY2FubmVyLmxvb2thaGVhZCA9PT0gXCJcIikge1xuICAgICAgICByZXR1cm4gcy5lcnJvcih3cml0ZVVudGVybWluYXRlZEVuY2xvc2VkTWVzc2FnZSh0b2tlbiwgZW5jbG9zaW5nKSk7XG4gICAgfVxuICAgIC8vIFNoaWZ0IHRoZSBzY2FubmVyIG9uZSBhZGRpdGlvbmFsIHRpbWUgZm9yIHRoZSBzZWNvbmQgZW5jbG9zaW5nIHRva2VuXG4gICAgaWYgKHMuc2Nhbm5lci5zaGlmdCgpID09PSBcIi9cIikge1xuICAgICAgICAvLyBDYWNoZSB0aGUgcmVnZXggaW5zdGFuY2UgdG8gdGhyb3cgcmlnaHQgd2F5IGlmIGl0cyBpbnZhbGlkXG4gICAgICAgIGdldFJlZ2V4KHRva2VuKTtcbiAgICAgICAgcy5zZXRSb290KHtcbiAgICAgICAgICAgIHN0cmluZzoge1xuICAgICAgICAgICAgICAgIHJlZ2V4OiB0b2tlblxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBzLnNldFJvb3Qoe1xuICAgICAgICAgICAgc3RyaW5nOiB7XG4gICAgICAgICAgICAgICAgdmFsdWU6IHRva2VuXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbn07XG5leHBvcnQgY29uc3QgZW5jbG9zaW5nQ2hhciA9IHtcbiAgICBcIidcIjogMSxcbiAgICAnXCInOiAxLFxuICAgIFwiL1wiOiAxXG59O1xuY29uc3QgdW50aWxMb29rYWhlYWRJc0Nsb3NpbmcgPSB7XG4gICAgXCInXCI6IChzY2FubmVyKT0+c2Nhbm5lci5sb29rYWhlYWQgPT09IGAnYCxcbiAgICAnXCInOiAoc2Nhbm5lcik9PnNjYW5uZXIubG9va2FoZWFkID09PSBgXCJgLFxuICAgIFwiL1wiOiAoc2Nhbm5lcik9PnNjYW5uZXIubG9va2FoZWFkID09PSBgL2Bcbn07XG5jb25zdCBlbmNsb3NpbmdDaGFyRGVzY3JpcHRpb25zID0ge1xuICAgICdcIic6IFwiZG91YmxlLXF1b3RlXCIsXG4gICAgXCInXCI6IFwic2luZ2xlLXF1b3RlXCIsXG4gICAgXCIvXCI6IFwiZm9yd2FyZCBzbGFzaFwiXG59O1xuZXhwb3J0IGNvbnN0IHdyaXRlVW50ZXJtaW5hdGVkRW5jbG9zZWRNZXNzYWdlID0gKGZyYWdtZW50LCBlbmNsb3NpbmcpPT5gJHtlbmNsb3Npbmd9JHtmcmFnbWVudH0gcmVxdWlyZXMgYSBjbG9zaW5nICR7ZW5jbG9zaW5nQ2hhckRlc2NyaXB0aW9uc1tlbmNsb3NpbmddfWA7XG4iLCAiaW1wb3J0IHsgZW5jbG9zaW5nQ2hhciwgcGFyc2VFbmNsb3NlZCB9IGZyb20gXCIuL2VuY2xvc2VkLmpzXCI7XG5pbXBvcnQgeyBwYXJzZVVuZW5jbG9zZWQsIHdyaXRlTWlzc2luZ09wZXJhbmRNZXNzYWdlIH0gZnJvbSBcIi4vdW5lbmNsb3NlZC5qc1wiO1xuZXhwb3J0IGNvbnN0IHBhcnNlT3BlcmFuZCA9IChzKT0+cy5zY2FubmVyLmxvb2thaGVhZCA9PT0gXCJcIiA/IHMuZXJyb3Iod3JpdGVNaXNzaW5nT3BlcmFuZE1lc3NhZ2UocykpIDogcy5zY2FubmVyLmxvb2thaGVhZCA9PT0gXCIoXCIgPyBzLnNoaWZ0ZWRCeU9uZSgpLnJlZHVjZUdyb3VwT3BlbigpIDogcy5zY2FubmVyLmxvb2thaGVhZElzSW4oZW5jbG9zaW5nQ2hhcikgPyBwYXJzZUVuY2xvc2VkKHMsIHMuc2Nhbm5lci5zaGlmdCgpKSA6IHMuc2Nhbm5lci5sb29rYWhlYWQgPT09IFwiIFwiID8gcGFyc2VPcGVyYW5kKHMuc2hpZnRlZEJ5T25lKCkpIDogcGFyc2VVbmVuY2xvc2VkKHMpO1xuIiwgImV4cG9ydCBjb25zdCB3cml0ZURvdWJsZVJpZ2h0Qm91bmRNZXNzYWdlID0gKHJvb3QpPT5gRXhwcmVzc2lvbiAke3Jvb3R9IG11c3QgaGF2ZSBhdCBtb3N0IG9uZSByaWdodCBib3VuZGA7XG5leHBvcnQgY29uc3Qgd3JpdGVVbmJvdW5kYWJsZU1lc3NhZ2UgPSAocm9vdCk9PmBCb3VuZGVkIGV4cHJlc3Npb24gJHtyb290fSBtdXN0IGJlIGEgbnVtYmVyLCBzdHJpbmcgb3IgYXJyYXlgO1xuIiwgImltcG9ydCB7IHN0cmluZ2lmeVJhbmdlIH0gZnJvbSBcIi4uLy4uLy4uLy4uL25vZGVzL2NvbXBvc2UuanNcIjtcbmltcG9ydCB7IGNvbXBhcmVTdHJpY3RuZXNzLCBtYXhDb21wYXJhdG9ycywgbWluQ29tcGFyYXRvcnMgfSBmcm9tIFwiLi4vLi4vLi4vLi4vbm9kZXMvcnVsZXMvcmFuZ2UuanNcIjtcbmltcG9ydCB7IHRocm93SW50ZXJuYWxFcnJvciB9IGZyb20gXCIuLi8uLi8uLi8uLi91dGlscy9lcnJvcnMuanNcIjtcbmltcG9ydCB7IGlzS2V5T2YsIGxpc3RGcm9tLCBvYmplY3RLZXlzT2YgfSBmcm9tIFwiLi4vLi4vLi4vLi4vdXRpbHMvZ2VuZXJpY3MuanNcIjtcbmltcG9ydCB7IHRyeVBhcnNlV2VsbEZvcm1lZE51bWJlciB9IGZyb20gXCIuLi8uLi8uLi8uLi91dGlscy9udW1lcmljTGl0ZXJhbHMuanNcIjtcbmltcG9ydCB7IHdyaXRlVW5ib3VuZGFibGVNZXNzYWdlIH0gZnJvbSBcIi4uLy4uLy4uL2FzdC9ib3VuZC5qc1wiO1xuaW1wb3J0IHsgd3JpdGVVbnBhaXJhYmxlQ29tcGFyYXRvck1lc3NhZ2UgfSBmcm9tIFwiLi4vLi4vcmVkdWNlL3NoYXJlZC5qc1wiO1xuaW1wb3J0IHsgU2Nhbm5lciB9IGZyb20gXCIuLi9zY2FubmVyLmpzXCI7XG5leHBvcnQgY29uc3QgcGFyc2VCb3VuZCA9IChzLCBzdGFydCk9PntcbiAgICBjb25zdCBjb21wYXJhdG9yID0gc2hpZnRDb21wYXJhdG9yKHMsIHN0YXJ0KTtcbiAgICBjb25zdCBtYXliZU1pbiA9IHMuZWplY3RSb290SWZMaW1pdCgpO1xuICAgIHJldHVybiBtYXliZU1pbiA9PT0gdW5kZWZpbmVkID8gcGFyc2VSaWdodEJvdW5kKHMsIGNvbXBhcmF0b3IpIDogcy5yZWR1Y2VMZWZ0Qm91bmQobWF5YmVNaW4sIGNvbXBhcmF0b3IpO1xufTtcbmNvbnN0IHNoaWZ0Q29tcGFyYXRvciA9IChzLCBzdGFydCk9PnMuc2Nhbm5lci5sb29rYWhlYWRJcyhcIj1cIikgPyBgJHtzdGFydH0ke3Muc2Nhbm5lci5zaGlmdCgpfWAgOiBpc0tleU9mKHN0YXJ0LCBTY2FubmVyLm9uZUNoYXJDb21wYXJhdG9ycykgPyBzdGFydCA6IHMuZXJyb3Ioc2luZ2xlRXF1YWxzTWVzc2FnZSk7XG5leHBvcnQgY29uc3Qgc2luZ2xlRXF1YWxzTWVzc2FnZSA9IGA9IGlzIG5vdCBhIHZhbGlkIGNvbXBhcmF0b3IuIFVzZSA9PSB0byBjaGVjayBmb3IgZXF1YWxpdHlgO1xuZXhwb3J0IGNvbnN0IHBhcnNlUmlnaHRCb3VuZCA9IChzLCBjb21wYXJhdG9yKT0+e1xuICAgIGNvbnN0IGxpbWl0VG9rZW4gPSBzLnNjYW5uZXIuc2hpZnRVbnRpbE5leHRUZXJtaW5hdG9yKCk7XG4gICAgY29uc3QgbGltaXQgPSB0cnlQYXJzZVdlbGxGb3JtZWROdW1iZXIobGltaXRUb2tlbiwgd3JpdGVJbnZhbGlkTGltaXRNZXNzYWdlKGNvbXBhcmF0b3IsIGxpbWl0VG9rZW4gKyBzLnNjYW5uZXIudW5zY2FubmVkKSk7XG4gICAgY29uc3Qgb3BlblJhbmdlID0gcy5lamVjdFJhbmdlSWZPcGVuKCk7XG4gICAgY29uc3QgcmlnaHRCb3VuZCA9IHtcbiAgICAgICAgY29tcGFyYXRvcixcbiAgICAgICAgbGltaXRcbiAgICB9O1xuICAgIGNvbnN0IHJhbmdlID0gb3BlblJhbmdlID8gIWhhc0NvbXBhcmF0b3JJbihyaWdodEJvdW5kLCBtYXhDb21wYXJhdG9ycykgPyBzLmVycm9yKHdyaXRlVW5wYWlyYWJsZUNvbXBhcmF0b3JNZXNzYWdlKGNvbXBhcmF0b3IpKSA6IGNvbXBhcmVTdHJpY3RuZXNzKFwibWluXCIsIG9wZW5SYW5nZSwgcmlnaHRCb3VuZCkgPT09IFwibFwiID8gcy5lcnJvcih3cml0ZUVtcHR5UmFuZ2VNZXNzYWdlKHtcbiAgICAgICAgbWluOiBvcGVuUmFuZ2UsXG4gICAgICAgIG1heDogcmlnaHRCb3VuZFxuICAgIH0pKSA6IHtcbiAgICAgICAgbWluOiBvcGVuUmFuZ2UsXG4gICAgICAgIG1heDogcmlnaHRCb3VuZFxuICAgIH0gOiBoYXNDb21wYXJhdG9yKHJpZ2h0Qm91bmQsIFwiPT1cIikgPyByaWdodEJvdW5kIDogaGFzQ29tcGFyYXRvckluKHJpZ2h0Qm91bmQsIG1pbkNvbXBhcmF0b3JzKSA/IHtcbiAgICAgICAgbWluOiByaWdodEJvdW5kXG4gICAgfSA6IGhhc0NvbXBhcmF0b3JJbihyaWdodEJvdW5kLCBtYXhDb21wYXJhdG9ycykgPyB7XG4gICAgICAgIG1heDogcmlnaHRCb3VuZFxuICAgIH0gOiB0aHJvd0ludGVybmFsRXJyb3IoYFVuZXhwZWN0ZWQgY29tcGFyYXRvciAnJHtyaWdodEJvdW5kLmNvbXBhcmF0b3J9J2ApO1xuICAgIHMuaW50ZXJzZWN0KGRpc3RyaWJ1dGVSYW5nZShyYW5nZSwgcykpO1xufTtcbmNvbnN0IGRpc3RyaWJ1dGVSYW5nZSA9IChyYW5nZSwgcyk9PntcbiAgICBjb25zdCByZXNvbHV0aW9uID0gcy5yZXNvbHZlUm9vdCgpO1xuICAgIGNvbnN0IGRvbWFpbnMgPSBvYmplY3RLZXlzT2YocmVzb2x1dGlvbik7XG4gICAgY29uc3QgZGlzdHJpYnV0ZWRSYW5nZSA9IHt9O1xuICAgIGNvbnN0IHJhbmdlUHJlZGljYXRlID0ge1xuICAgICAgICByYW5nZVxuICAgIH07XG4gICAgY29uc3QgaXNCb3VuZGFibGUgPSBkb21haW5zLmV2ZXJ5KChkb21haW4pPT57XG4gICAgICAgIHN3aXRjaChkb21haW4pe1xuICAgICAgICAgICAgY2FzZSBcInN0cmluZ1wiOlxuICAgICAgICAgICAgICAgIGRpc3RyaWJ1dGVkUmFuZ2Uuc3RyaW5nID0gcmFuZ2VQcmVkaWNhdGU7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICBjYXNlIFwibnVtYmVyXCI6XG4gICAgICAgICAgICAgICAgZGlzdHJpYnV0ZWRSYW5nZS5udW1iZXIgPSByYW5nZVByZWRpY2F0ZTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIGNhc2UgXCJvYmplY3RcIjpcbiAgICAgICAgICAgICAgICBkaXN0cmlidXRlZFJhbmdlLm9iamVjdCA9IHJhbmdlUHJlZGljYXRlO1xuICAgICAgICAgICAgICAgIGlmIChyZXNvbHV0aW9uLm9iamVjdCA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBsaXN0RnJvbShyZXNvbHV0aW9uLm9iamVjdCkuZXZlcnkoKGJyYW5jaCk9PlwiY2xhc3NcIiBpbiBicmFuY2ggJiYgYnJhbmNoLmNsYXNzID09PSBBcnJheSk7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgIH0pO1xuICAgIGlmICghaXNCb3VuZGFibGUpIHtcbiAgICAgICAgcy5lcnJvcih3cml0ZVVuYm91bmRhYmxlTWVzc2FnZShzLnJvb3RUb1N0cmluZygpKSk7XG4gICAgfVxuICAgIHJldHVybiBkaXN0cmlidXRlZFJhbmdlO1xufTtcbmNvbnN0IGhhc0NvbXBhcmF0b3IgPSAoYm91bmQsIGNvbXBhcmF0b3IpPT5ib3VuZC5jb21wYXJhdG9yID09PSBjb21wYXJhdG9yO1xuY29uc3QgaGFzQ29tcGFyYXRvckluID0gKGJvdW5kLCBjb21wYXJhdG9ycyk9PmJvdW5kLmNvbXBhcmF0b3IgaW4gY29tcGFyYXRvcnM7XG5leHBvcnQgY29uc3Qgd3JpdGVJbnZhbGlkTGltaXRNZXNzYWdlID0gKGNvbXBhcmF0b3IsIGxpbWl0KT0+YENvbXBhcmF0b3IgJHtjb21wYXJhdG9yfSBtdXN0IGJlIGZvbGxvd2VkIGJ5IGEgbnVtYmVyIGxpdGVyYWwgKHdhcyAnJHtsaW1pdH0nKWA7XG5leHBvcnQgY29uc3Qgd3JpdGVFbXB0eVJhbmdlTWVzc2FnZSA9IChyYW5nZSk9PmAke3N0cmluZ2lmeVJhbmdlKHJhbmdlKX0gaXMgZW1wdHlgO1xuIiwgImV4cG9ydCBjb25zdCB3cml0ZUluZGl2aXNpYmxlTWVzc2FnZSA9IChyb290KT0+YERpdmlzaWJpbGl0eSBvcGVyYW5kICR7cm9vdH0gbXVzdCBiZSBhIG51bWJlcmA7XG4iLCAiaW1wb3J0IHsgb2JqZWN0S2V5c09mIH0gZnJvbSBcIi4uLy4uLy4uLy4uL3V0aWxzL2dlbmVyaWNzLmpzXCI7XG5pbXBvcnQgeyB0cnlQYXJzZVdlbGxGb3JtZWRJbnRlZ2VyIH0gZnJvbSBcIi4uLy4uLy4uLy4uL3V0aWxzL251bWVyaWNMaXRlcmFscy5qc1wiO1xuaW1wb3J0IHsgd3JpdGVJbmRpdmlzaWJsZU1lc3NhZ2UgfSBmcm9tIFwiLi4vLi4vLi4vYXN0L2Rpdmlzb3IuanNcIjtcbmV4cG9ydCBjb25zdCBwYXJzZURpdmlzb3IgPSAocyk9PntcbiAgICBjb25zdCBkaXZpc29yVG9rZW4gPSBzLnNjYW5uZXIuc2hpZnRVbnRpbE5leHRUZXJtaW5hdG9yKCk7XG4gICAgY29uc3QgZGl2aXNvciA9IHRyeVBhcnNlV2VsbEZvcm1lZEludGVnZXIoZGl2aXNvclRva2VuLCB3cml0ZUludmFsaWREaXZpc29yTWVzc2FnZShkaXZpc29yVG9rZW4pKTtcbiAgICBpZiAoZGl2aXNvciA9PT0gMCkge1xuICAgICAgICBzLmVycm9yKHdyaXRlSW52YWxpZERpdmlzb3JNZXNzYWdlKDApKTtcbiAgICB9XG4gICAgY29uc3Qgcm9vdERvbWFpbnMgPSBvYmplY3RLZXlzT2Yocy5yZXNvbHZlUm9vdCgpKTtcbiAgICBpZiAocm9vdERvbWFpbnMubGVuZ3RoID09PSAxICYmIHJvb3REb21haW5zWzBdID09PSBcIm51bWJlclwiKSB7XG4gICAgICAgIHMuaW50ZXJzZWN0KHtcbiAgICAgICAgICAgIG51bWJlcjoge1xuICAgICAgICAgICAgICAgIGRpdmlzb3JcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcy5lcnJvcih3cml0ZUluZGl2aXNpYmxlTWVzc2FnZShzLnJvb3RUb1N0cmluZygpKSk7XG4gICAgfVxufTtcbmV4cG9ydCBjb25zdCB3cml0ZUludmFsaWREaXZpc29yTWVzc2FnZSA9IChkaXZpc29yKT0+YCUgb3BlcmF0b3IgbXVzdCBiZSBmb2xsb3dlZCBieSBhIG5vbi16ZXJvIGludGVnZXIgbGl0ZXJhbCAod2FzICR7ZGl2aXNvcn0pYDtcbiIsICJpbXBvcnQgeyB0aHJvd0ludGVybmFsRXJyb3IgfSBmcm9tIFwiLi4vLi4vLi4vLi4vdXRpbHMvZXJyb3JzLmpzXCI7XG5pbXBvcnQgeyBpc0tleU9mIH0gZnJvbSBcIi4uLy4uLy4uLy4uL3V0aWxzL2dlbmVyaWNzLmpzXCI7XG5pbXBvcnQgeyBTY2FubmVyIH0gZnJvbSBcIi4uL3NjYW5uZXIuanNcIjtcbmltcG9ydCB7IHBhcnNlQm91bmQgfSBmcm9tIFwiLi9ib3VuZHMuanNcIjtcbmltcG9ydCB7IHBhcnNlRGl2aXNvciB9IGZyb20gXCIuL2Rpdmlzb3IuanNcIjtcbi8vIEBzbmlwU3RhcnQ6cGFyc2VPcGVyYXRvclxuZXhwb3J0IGNvbnN0IHBhcnNlT3BlcmF0b3IgPSAocyk9PntcbiAgICBjb25zdCBsb29rYWhlYWQgPSBzLnNjYW5uZXIuc2hpZnQoKTtcbiAgICByZXR1cm4gbG9va2FoZWFkID09PSBcIlwiID8gcy5maW5hbGl6ZSgpIDogbG9va2FoZWFkID09PSBcIltcIiA/IHMuc2Nhbm5lci5zaGlmdCgpID09PSBcIl1cIiA/IHMucm9vdFRvQXJyYXkoKSA6IHMuZXJyb3IoaW5jb21wbGV0ZUFycmF5VG9rZW5NZXNzYWdlKSA6IGlzS2V5T2YobG9va2FoZWFkLCBTY2FubmVyLmJyYW5jaFRva2VucykgPyBzLnB1c2hSb290VG9CcmFuY2gobG9va2FoZWFkKSA6IGxvb2thaGVhZCA9PT0gXCIpXCIgPyBzLmZpbmFsaXplR3JvdXAoKSA6IGlzS2V5T2YobG9va2FoZWFkLCBTY2FubmVyLmNvbXBhcmF0b3JTdGFydENoYXJzKSA/IHBhcnNlQm91bmQocywgbG9va2FoZWFkKSA6IGxvb2thaGVhZCA9PT0gXCIlXCIgPyBwYXJzZURpdmlzb3IocykgOiBsb29rYWhlYWQgPT09IFwiIFwiID8gcGFyc2VPcGVyYXRvcihzKSA6IHRocm93SW50ZXJuYWxFcnJvcih3cml0ZVVuZXhwZWN0ZWRDaGFyYWN0ZXJNZXNzYWdlKGxvb2thaGVhZCkpO1xufTtcbi8vIEBzbmlwRW5kXG5leHBvcnQgY29uc3Qgd3JpdGVVbmV4cGVjdGVkQ2hhcmFjdGVyTWVzc2FnZSA9IChjaGFyKT0+YFVuZXhwZWN0ZWQgY2hhcmFjdGVyICcke2NoYXJ9J2A7XG5leHBvcnQgY29uc3QgaW5jb21wbGV0ZUFycmF5VG9rZW5NZXNzYWdlID0gYE1pc3NpbmcgZXhwZWN0ZWQgJ10nYDtcbiIsICJpbXBvcnQgeyB0b0FycmF5Tm9kZSB9IGZyb20gXCIuLi8uLi9ub2Rlcy9ub2RlLmpzXCI7XG5pbXBvcnQgeyBEeW5hbWljU3RhdGUgfSBmcm9tIFwiLi9yZWR1Y2UvZHluYW1pYy5qc1wiO1xuaW1wb3J0IHsgcGFyc2VPcGVyYW5kIH0gZnJvbSBcIi4vc2hpZnQvb3BlcmFuZC9vcGVyYW5kLmpzXCI7XG5pbXBvcnQgeyBwYXJzZU9wZXJhdG9yIH0gZnJvbSBcIi4vc2hpZnQvb3BlcmF0b3Ivb3BlcmF0b3IuanNcIjtcbmV4cG9ydCBjb25zdCBwYXJzZVN0cmluZyA9IChkZWYsIGN0eCk9PmN0eC50eXBlLnNjb3BlLnBhcnNlQ2FjaGUuZ2V0KGRlZikgPz8gY3R4LnR5cGUuc2NvcGUucGFyc2VDYWNoZS5zZXQoZGVmLCBtYXliZU5haXZlUGFyc2UoZGVmLCBjdHgpID8/IGZ1bGxTdHJpbmdQYXJzZShkZWYsIGN0eCkpO1xuZXhwb3J0IGNvbnN0IG1heWJlTmFpdmVQYXJzZSA9IChkZWYsIGN0eCk9PntcbiAgICBpZiAoY3R4LnR5cGUuc2NvcGUuYWRkUGFyc2VkUmVmZXJlbmNlSWZSZXNvbHZhYmxlKGRlZiwgY3R4KSkge1xuICAgICAgICByZXR1cm4gZGVmO1xuICAgIH1cbiAgICBpZiAoZGVmLmVuZHNXaXRoKFwiW11cIikpIHtcbiAgICAgICAgY29uc3QgZWxlbWVudERlZiA9IGRlZi5zbGljZSgwLCAtMik7XG4gICAgICAgIGlmIChjdHgudHlwZS5zY29wZS5hZGRQYXJzZWRSZWZlcmVuY2VJZlJlc29sdmFibGUoZGVmLCBjdHgpKSB7XG4gICAgICAgICAgICByZXR1cm4gdG9BcnJheU5vZGUoZWxlbWVudERlZik7XG4gICAgICAgIH1cbiAgICB9XG59O1xuZXhwb3J0IGNvbnN0IGZ1bGxTdHJpbmdQYXJzZSA9IChkZWYsIGN0eCk9PntcbiAgICBjb25zdCBzID0gbmV3IER5bmFtaWNTdGF0ZShkZWYsIGN0eCk7XG4gICAgcGFyc2VPcGVyYW5kKHMpO1xuICAgIHJldHVybiBsb29wKHMpO1xufTtcbmNvbnN0IGxvb3AgPSAocyk9PntcbiAgICB3aGlsZSghcy5zY2FubmVyLmZpbmFsaXplZCl7XG4gICAgICAgIG5leHQocyk7XG4gICAgfVxuICAgIHJldHVybiBzLmVqZWN0RmluYWxpemVkUm9vdCgpO1xufTtcbmNvbnN0IG5leHQgPSAocyk9PnMuaGFzUm9vdCgpID8gcGFyc2VPcGVyYXRvcihzKSA6IHBhcnNlT3BlcmFuZChzKTtcbiIsICJpbXBvcnQgeyBpc1R5cGUgfSBmcm9tIFwiLi4vc2NvcGVzL3R5cGUuanNcIjtcbmltcG9ydCB7IGRvbWFpbk9mIH0gZnJvbSBcIi4uL3V0aWxzL2RvbWFpbnMuanNcIjtcbmltcG9ydCB7IHRocm93UGFyc2VFcnJvciB9IGZyb20gXCIuLi91dGlscy9lcnJvcnMuanNcIjtcbmltcG9ydCB7IG9iamVjdEtpbmRPZiB9IGZyb20gXCIuLi91dGlscy9vYmplY3RLaW5kcy5qc1wiO1xuaW1wb3J0IHsgc3RyaW5naWZ5IH0gZnJvbSBcIi4uL3V0aWxzL3NlcmlhbGl6ZS5qc1wiO1xuaW1wb3J0IHsgcGFyc2VUdXBsZSB9IGZyb20gXCIuL2FzdC90dXBsZS5qc1wiO1xuaW1wb3J0IHsgcGFyc2VSZWNvcmQgfSBmcm9tIFwiLi9yZWNvcmQuanNcIjtcbmltcG9ydCB7IHBhcnNlU3RyaW5nIH0gZnJvbSBcIi4vc3RyaW5nL3N0cmluZy5qc1wiO1xuZXhwb3J0IGNvbnN0IHBhcnNlRGVmaW5pdGlvbiA9IChkZWYsIGN0eCk9PntcbiAgICBjb25zdCBkb21haW4gPSBkb21haW5PZihkZWYpO1xuICAgIGlmIChkb21haW4gPT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgcmV0dXJuIHBhcnNlU3RyaW5nKGRlZiwgY3R4KTtcbiAgICB9XG4gICAgaWYgKGRvbWFpbiAhPT0gXCJvYmplY3RcIikge1xuICAgICAgICByZXR1cm4gdGhyb3dQYXJzZUVycm9yKHdyaXRlQmFkRGVmaW5pdGlvblR5cGVNZXNzYWdlKGRvbWFpbikpO1xuICAgIH1cbiAgICBjb25zdCBvYmplY3RLaW5kID0gb2JqZWN0S2luZE9mKGRlZik7XG4gICAgc3dpdGNoKG9iamVjdEtpbmQpe1xuICAgICAgICBjYXNlIFwiT2JqZWN0XCI6XG4gICAgICAgICAgICByZXR1cm4gcGFyc2VSZWNvcmQoZGVmLCBjdHgpO1xuICAgICAgICBjYXNlIFwiQXJyYXlcIjpcbiAgICAgICAgICAgIHJldHVybiBwYXJzZVR1cGxlKGRlZiwgY3R4KTtcbiAgICAgICAgY2FzZSBcIlJlZ0V4cFwiOlxuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBzdHJpbmc6IHtcbiAgICAgICAgICAgICAgICAgICAgcmVnZXg6IGRlZi5zb3VyY2VcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICBjYXNlIFwiRnVuY3Rpb25cIjpcbiAgICAgICAgICAgIGlmIChpc1R5cGUoZGVmKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBjdHgudHlwZS5zY29wZS5hZGRBbm9ueW1vdXNUeXBlUmVmZXJlbmNlKGRlZiwgY3R4KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChpc1RodW5rKGRlZikpIHtcbiAgICAgICAgICAgICAgICBjb25zdCByZXR1cm5lZCA9IGRlZigpO1xuICAgICAgICAgICAgICAgIGlmIChpc1R5cGUocmV0dXJuZWQpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBjdHgudHlwZS5zY29wZS5hZGRBbm9ueW1vdXNUeXBlUmVmZXJlbmNlKHJldHVybmVkLCBjdHgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0aHJvd1BhcnNlRXJyb3Iod3JpdGVCYWREZWZpbml0aW9uVHlwZU1lc3NhZ2UoXCJGdW5jdGlvblwiKSk7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICByZXR1cm4gdGhyb3dQYXJzZUVycm9yKHdyaXRlQmFkRGVmaW5pdGlvblR5cGVNZXNzYWdlKG9iamVjdEtpbmQgPz8gc3RyaW5naWZ5KGRlZikpKTtcbiAgICB9XG59O1xuZXhwb3J0IGNvbnN0IGFzID0gU3ltYm9sKFwiYXNcIik7XG5jb25zdCBpc1RodW5rID0gKGRlZik9PnR5cGVvZiBkZWYgPT09IFwiZnVuY3Rpb25cIiAmJiBkZWYubGVuZ3RoID09PSAwO1xuZXhwb3J0IGNvbnN0IHdyaXRlQmFkRGVmaW5pdGlvblR5cGVNZXNzYWdlID0gKGFjdHVhbCk9PmBUeXBlIGRlZmluaXRpb25zIG11c3QgYmUgc3RyaW5ncyBvciBvYmplY3RzICh3YXMgJHthY3R1YWx9KWA7XG4iLCAiZnVuY3Rpb24gX2RlZmluZVByb3BlcnR5KG9iaiwga2V5LCB2YWx1ZSkge1xuICAgIGlmIChrZXkgaW4gb2JqKSB7XG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmosIGtleSwge1xuICAgICAgICAgICAgdmFsdWU6IHZhbHVlLFxuICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgICAgICAgIHdyaXRhYmxlOiB0cnVlXG4gICAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIG9ialtrZXldID0gdmFsdWU7XG4gICAgfVxuICAgIHJldHVybiBvYmo7XG59XG5pbXBvcnQgeyBkZWVwRnJlZXplIH0gZnJvbSBcIi4uL3V0aWxzL2ZyZWV6ZS5qc1wiO1xuZXhwb3J0IGNsYXNzIENhY2hlIHtcbiAgICBnZXQgcm9vdCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2FjaGU7XG4gICAgfVxuICAgIGhhcyhuYW1lKSB7XG4gICAgICAgIHJldHVybiBuYW1lIGluIHRoaXMuY2FjaGU7XG4gICAgfVxuICAgIGdldChuYW1lKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNhY2hlW25hbWVdO1xuICAgIH1cbiAgICBzZXQobmFtZSwgaXRlbSkge1xuICAgICAgICB0aGlzLmNhY2hlW25hbWVdID0gaXRlbTtcbiAgICAgICAgcmV0dXJuIGl0ZW07XG4gICAgfVxuICAgIGNvbnN0cnVjdG9yKCl7XG4gICAgICAgIF9kZWZpbmVQcm9wZXJ0eSh0aGlzLCBcImNhY2hlXCIsIHt9KTtcbiAgICB9XG59XG5leHBvcnQgY2xhc3MgRnJlZXppbmdDYWNoZSBleHRlbmRzIENhY2hlIHtcbiAgICBzZXQobmFtZSwgaXRlbSkge1xuICAgICAgICB0aGlzLmNhY2hlW25hbWVdID0gZGVlcEZyZWV6ZShpdGVtKTtcbiAgICAgICAgcmV0dXJuIGl0ZW07XG4gICAgfVxufVxuIiwgImZ1bmN0aW9uIF9jaGVja1ByaXZhdGVSZWRlY2xhcmF0aW9uKG9iaiwgcHJpdmF0ZUNvbGxlY3Rpb24pIHtcbiAgICBpZiAocHJpdmF0ZUNvbGxlY3Rpb24uaGFzKG9iaikpIHtcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBpbml0aWFsaXplIHRoZSBzYW1lIHByaXZhdGUgZWxlbWVudHMgdHdpY2Ugb24gYW4gb2JqZWN0XCIpO1xuICAgIH1cbn1cbmZ1bmN0aW9uIF9jbGFzc0FwcGx5RGVzY3JpcHRvckdldChyZWNlaXZlciwgZGVzY3JpcHRvcikge1xuICAgIGlmIChkZXNjcmlwdG9yLmdldCkge1xuICAgICAgICByZXR1cm4gZGVzY3JpcHRvci5nZXQuY2FsbChyZWNlaXZlcik7XG4gICAgfVxuICAgIHJldHVybiBkZXNjcmlwdG9yLnZhbHVlO1xufVxuZnVuY3Rpb24gX2NsYXNzQXBwbHlEZXNjcmlwdG9yU2V0KHJlY2VpdmVyLCBkZXNjcmlwdG9yLCB2YWx1ZSkge1xuICAgIGlmIChkZXNjcmlwdG9yLnNldCkge1xuICAgICAgICBkZXNjcmlwdG9yLnNldC5jYWxsKHJlY2VpdmVyLCB2YWx1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKCFkZXNjcmlwdG9yLndyaXRhYmxlKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiYXR0ZW1wdGVkIHRvIHNldCByZWFkIG9ubHkgcHJpdmF0ZSBmaWVsZFwiKTtcbiAgICAgICAgfVxuICAgICAgICBkZXNjcmlwdG9yLnZhbHVlID0gdmFsdWU7XG4gICAgfVxufVxuZnVuY3Rpb24gX2NsYXNzRXh0cmFjdEZpZWxkRGVzY3JpcHRvcihyZWNlaXZlciwgcHJpdmF0ZU1hcCwgYWN0aW9uKSB7XG4gICAgaWYgKCFwcml2YXRlTWFwLmhhcyhyZWNlaXZlcikpIHtcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcImF0dGVtcHRlZCB0byBcIiArIGFjdGlvbiArIFwiIHByaXZhdGUgZmllbGQgb24gbm9uLWluc3RhbmNlXCIpO1xuICAgIH1cbiAgICByZXR1cm4gcHJpdmF0ZU1hcC5nZXQocmVjZWl2ZXIpO1xufVxuZnVuY3Rpb24gX2NsYXNzUHJpdmF0ZUZpZWxkR2V0KHJlY2VpdmVyLCBwcml2YXRlTWFwKSB7XG4gICAgdmFyIGRlc2NyaXB0b3IgPSBfY2xhc3NFeHRyYWN0RmllbGREZXNjcmlwdG9yKHJlY2VpdmVyLCBwcml2YXRlTWFwLCBcImdldFwiKTtcbiAgICByZXR1cm4gX2NsYXNzQXBwbHlEZXNjcmlwdG9yR2V0KHJlY2VpdmVyLCBkZXNjcmlwdG9yKTtcbn1cbmZ1bmN0aW9uIF9jbGFzc1ByaXZhdGVGaWVsZEluaXQob2JqLCBwcml2YXRlTWFwLCB2YWx1ZSkge1xuICAgIF9jaGVja1ByaXZhdGVSZWRlY2xhcmF0aW9uKG9iaiwgcHJpdmF0ZU1hcCk7XG4gICAgcHJpdmF0ZU1hcC5zZXQob2JqLCB2YWx1ZSk7XG59XG5mdW5jdGlvbiBfY2xhc3NQcml2YXRlRmllbGRTZXQocmVjZWl2ZXIsIHByaXZhdGVNYXAsIHZhbHVlKSB7XG4gICAgdmFyIGRlc2NyaXB0b3IgPSBfY2xhc3NFeHRyYWN0RmllbGREZXNjcmlwdG9yKHJlY2VpdmVyLCBwcml2YXRlTWFwLCBcInNldFwiKTtcbiAgICBfY2xhc3NBcHBseURlc2NyaXB0b3JTZXQocmVjZWl2ZXIsIGRlc2NyaXB0b3IsIHZhbHVlKTtcbiAgICByZXR1cm4gdmFsdWU7XG59XG5mdW5jdGlvbiBfY2xhc3NQcml2YXRlTWV0aG9kR2V0KHJlY2VpdmVyLCBwcml2YXRlU2V0LCBmbikge1xuICAgIGlmICghcHJpdmF0ZVNldC5oYXMocmVjZWl2ZXIpKSB7XG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJhdHRlbXB0ZWQgdG8gZ2V0IHByaXZhdGUgZmllbGQgb24gbm9uLWluc3RhbmNlXCIpO1xuICAgIH1cbiAgICByZXR1cm4gZm47XG59XG5mdW5jdGlvbiBfY2xhc3NQcml2YXRlTWV0aG9kSW5pdChvYmosIHByaXZhdGVTZXQpIHtcbiAgICBfY2hlY2tQcml2YXRlUmVkZWNsYXJhdGlvbihvYmosIHByaXZhdGVTZXQpO1xuICAgIHByaXZhdGVTZXQuYWRkKG9iaik7XG59XG5mdW5jdGlvbiBfZGVmaW5lUHJvcGVydHkob2JqLCBrZXksIHZhbHVlKSB7XG4gICAgaWYgKGtleSBpbiBvYmopIHtcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iaiwga2V5LCB7XG4gICAgICAgICAgICB2YWx1ZTogdmFsdWUsXG4gICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgICAgICAgd3JpdGFibGU6IHRydWVcbiAgICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgb2JqW2tleV0gPSB2YWx1ZTtcbiAgICB9XG4gICAgcmV0dXJuIG9iajtcbn1cbmltcG9ydCB7IGZsYXR0ZW5UeXBlLCBpc0NvbmZpZ05vZGUgfSBmcm9tIFwiLi4vbm9kZXMvbm9kZS5qc1wiO1xuaW1wb3J0IHsgcGFyc2VEZWZpbml0aW9uIH0gZnJvbSBcIi4uL3BhcnNlL2RlZmluaXRpb24uanNcIjtcbmltcG9ydCB7IGNvbXBpbGVQcm9ibGVtV3JpdGVycyB9IGZyb20gXCIuLi90cmF2ZXJzZS9wcm9ibGVtcy5qc1wiO1xuaW1wb3J0IHsgY2hhaW5hYmxlTm9PcFByb3h5IH0gZnJvbSBcIi4uL3V0aWxzL2NoYWluYWJsZU5vT3BQcm94eS5qc1wiO1xuaW1wb3J0IHsgdGhyb3dJbnRlcm5hbEVycm9yLCB0aHJvd1BhcnNlRXJyb3IgfSBmcm9tIFwiLi4vdXRpbHMvZXJyb3JzLmpzXCI7XG5pbXBvcnQgeyBkZWVwRnJlZXplIH0gZnJvbSBcIi4uL3V0aWxzL2ZyZWV6ZS5qc1wiO1xuaW1wb3J0IHsgaGFzS2V5cyB9IGZyb20gXCIuLi91dGlscy9nZW5lcmljcy5qc1wiO1xuaW1wb3J0IHsgUGF0aCB9IGZyb20gXCIuLi91dGlscy9wYXRocy5qc1wiO1xuaW1wb3J0IHsgQ2FjaGUsIEZyZWV6aW5nQ2FjaGUgfSBmcm9tIFwiLi9jYWNoZS5qc1wiO1xuaW1wb3J0IHsgaW5pdGlhbGl6ZVR5cGUgfSBmcm9tIFwiLi90eXBlLmpzXCI7XG5leHBvcnQgY29uc3QgY29tcGlsZVNjb3BlT3B0aW9ucyA9IChvcHRzKT0+KHtcbiAgICAgICAgY29kZXM6IGNvbXBpbGVQcm9ibGVtV3JpdGVycyhvcHRzLmNvZGVzKSxcbiAgICAgICAga2V5czogb3B0cy5rZXlzID8/IFwibG9vc2VcIlxuICAgIH0pO1xubGV0IGFub255bW91c1Njb3BlQ291bnQgPSAwO1xuY29uc3Qgc2NvcGVSZWdpc3RyeSA9IHt9O1xuY29uc3Qgc3BhY2VSZWdpc3RyeSA9IHt9O1xuZXhwb3J0IGNvbnN0IGlzQ29uZmlnVHVwbGUgPSAoZGVmKT0+QXJyYXkuaXNBcnJheShkZWYpICYmIGRlZlsxXSA9PT0gXCI6XCI7XG52YXIgX3Jlc29sdXRpb25zID0gLyojX19QVVJFX18qLyBuZXcgV2Vha01hcCgpLCBfZXhwb3J0cyA9IC8qI19fUFVSRV9fKi8gbmV3IFdlYWtNYXAoKSwgX3JlZ2lzdGVyID0gLyojX19QVVJFX18qLyBuZXcgV2Vha1NldCgpLCBfY2FjaGVTcGFjZXMgPSAvKiNfX1BVUkVfXyovIG5ldyBXZWFrU2V0KCksIF9pbml0aWFsaXplQ29udGV4dCA9IC8qI19fUFVSRV9fKi8gbmV3IFdlYWtTZXQoKSwgX3Jlc29sdmVSZWN1cnNlID0gLyojX19QVVJFX18qLyBuZXcgV2Vha1NldCgpO1xuZXhwb3J0IGNsYXNzIFNjb3BlIHtcbiAgICBnZXRBbm9ueW1vdXNRdWFsaWZpZWROYW1lKGJhc2UpIHtcbiAgICAgICAgbGV0IGluY3JlbWVudCA9IDA7XG4gICAgICAgIGxldCBpZCA9IGJhc2U7XG4gICAgICAgIHdoaWxlKHRoaXMuaXNSZXNvbHZhYmxlKGlkKSl7XG4gICAgICAgICAgICBpZCA9IGAke2Jhc2V9JHtpbmNyZW1lbnQrK31gO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBgJHt0aGlzLm5hbWV9LiR7aWR9YDtcbiAgICB9XG4gICAgYWRkQW5vbnltb3VzVHlwZVJlZmVyZW5jZShyZWZlcmVuY2VkVHlwZSwgY3R4KSB7XG4gICAgICAgIHZhciBfY3R4X3R5cGU7XG4gICAgICAgIChfY3R4X3R5cGUgPSBjdHgudHlwZSkuaW5jbHVkZXNNb3JwaCB8fCAoX2N0eF90eXBlLmluY2x1ZGVzTW9ycGggPSByZWZlcmVuY2VkVHlwZS5pbmNsdWRlc01vcnBoKTtcbiAgICAgICAgcmV0dXJuIHJlZmVyZW5jZWRUeXBlLm5vZGU7XG4gICAgfVxuICAgIGdldCBpbmZlcigpIHtcbiAgICAgICAgcmV0dXJuIGNoYWluYWJsZU5vT3BQcm94eTtcbiAgICB9XG4gICAgY29tcGlsZSgpIHtcbiAgICAgICAgaWYgKCFzcGFjZVJlZ2lzdHJ5W3RoaXMubmFtZV0pIHtcbiAgICAgICAgICAgIGZvcihjb25zdCBuYW1lIGluIHRoaXMuYWxpYXNlcyl7XG4gICAgICAgICAgICAgICAgdGhpcy5yZXNvbHZlKG5hbWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc3BhY2VSZWdpc3RyeVt0aGlzLm5hbWVdID0gX2NsYXNzUHJpdmF0ZUZpZWxkR2V0KHRoaXMsIF9leHBvcnRzKS5yb290O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBfY2xhc3NQcml2YXRlRmllbGRHZXQodGhpcywgX2V4cG9ydHMpLnJvb3Q7XG4gICAgfVxuICAgIGFkZFBhcnNlZFJlZmVyZW5jZUlmUmVzb2x2YWJsZShuYW1lLCBjdHgpIHtcbiAgICAgICAgdmFyIF9jdHhfdHlwZTtcbiAgICAgICAgY29uc3QgcmVzb2x1dGlvbiA9IF9jbGFzc1ByaXZhdGVNZXRob2RHZXQodGhpcywgX3Jlc29sdmVSZWN1cnNlLCByZXNvbHZlUmVjdXJzZSkuY2FsbCh0aGlzLCBuYW1lLCBcInVuZGVmaW5lZFwiLCBbXG4gICAgICAgICAgICBuYW1lXG4gICAgICAgIF0pO1xuICAgICAgICBpZiAoIXJlc29sdXRpb24pIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICAoX2N0eF90eXBlID0gY3R4LnR5cGUpLmluY2x1ZGVzTW9ycGggfHwgKF9jdHhfdHlwZS5pbmNsdWRlc01vcnBoID0gcmVzb2x1dGlvbi5pbmNsdWRlc01vcnBoKTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHJlc29sdmUobmFtZSkge1xuICAgICAgICByZXR1cm4gX2NsYXNzUHJpdmF0ZU1ldGhvZEdldCh0aGlzLCBfcmVzb2x2ZVJlY3Vyc2UsIHJlc29sdmVSZWN1cnNlKS5jYWxsKHRoaXMsIG5hbWUsIFwidGhyb3dcIiwgW1xuICAgICAgICAgICAgbmFtZVxuICAgICAgICBdKTtcbiAgICB9XG4gICAgcmVzb2x2ZU5vZGUobm9kZSkge1xuICAgICAgICByZXR1cm4gdHlwZW9mIG5vZGUgPT09IFwic3RyaW5nXCIgPyB0aGlzLnJlc29sdmVOb2RlKHRoaXMucmVzb2x2ZShub2RlKS5ub2RlKSA6IG5vZGU7XG4gICAgfVxuICAgIHJlc29sdmVUeXBlTm9kZShub2RlKSB7XG4gICAgICAgIGNvbnN0IHJlc29sdXRpb24gPSB0aGlzLnJlc29sdmVOb2RlKG5vZGUpO1xuICAgICAgICByZXR1cm4gaXNDb25maWdOb2RlKHJlc29sdXRpb24pID8gcmVzb2x1dGlvbi5ub2RlIDogcmVzb2x1dGlvbjtcbiAgICB9XG4gICAgaXNSZXNvbHZhYmxlKG5hbWUpIHtcbiAgICAgICAgcmV0dXJuIF9jbGFzc1ByaXZhdGVGaWVsZEdldCh0aGlzLCBfcmVzb2x1dGlvbnMpLmhhcyhuYW1lKSB8fCB0aGlzLmFsaWFzZXNbbmFtZV07XG4gICAgfVxuICAgIGNvbnN0cnVjdG9yKGFsaWFzZXMsIG9wdHMgPSB7fSl7XG4gICAgICAgIF9jbGFzc1ByaXZhdGVNZXRob2RJbml0KHRoaXMsIF9yZWdpc3Rlcik7XG4gICAgICAgIF9jbGFzc1ByaXZhdGVNZXRob2RJbml0KHRoaXMsIF9jYWNoZVNwYWNlcyk7XG4gICAgICAgIF9jbGFzc1ByaXZhdGVNZXRob2RJbml0KHRoaXMsIF9pbml0aWFsaXplQ29udGV4dCk7XG4gICAgICAgIF9jbGFzc1ByaXZhdGVNZXRob2RJbml0KHRoaXMsIF9yZXNvbHZlUmVjdXJzZSk7XG4gICAgICAgIF9kZWZpbmVQcm9wZXJ0eSh0aGlzLCBcImFsaWFzZXNcIiwgdm9pZCAwKTtcbiAgICAgICAgX2RlZmluZVByb3BlcnR5KHRoaXMsIFwibmFtZVwiLCB2b2lkIDApO1xuICAgICAgICBfZGVmaW5lUHJvcGVydHkodGhpcywgXCJjb25maWdcIiwgdm9pZCAwKTtcbiAgICAgICAgX2RlZmluZVByb3BlcnR5KHRoaXMsIFwicGFyc2VDYWNoZVwiLCB2b2lkIDApO1xuICAgICAgICBfY2xhc3NQcml2YXRlRmllbGRJbml0KHRoaXMsIF9yZXNvbHV0aW9ucywge1xuICAgICAgICAgICAgd3JpdGFibGU6IHRydWUsXG4gICAgICAgICAgICB2YWx1ZTogdm9pZCAwXG4gICAgICAgIH0pO1xuICAgICAgICBfY2xhc3NQcml2YXRlRmllbGRJbml0KHRoaXMsIF9leHBvcnRzLCB7XG4gICAgICAgICAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICAgICAgICAgIHZhbHVlOiB2b2lkIDBcbiAgICAgICAgfSk7XG4gICAgICAgIF9kZWZpbmVQcm9wZXJ0eSh0aGlzLCBcImV4cHJlc3Npb25zXCIsIHZvaWQgMCk7XG4gICAgICAgIF9kZWZpbmVQcm9wZXJ0eSh0aGlzLCBcImludGVyc2VjdGlvblwiLCB2b2lkIDApO1xuICAgICAgICBfZGVmaW5lUHJvcGVydHkodGhpcywgXCJ1bmlvblwiLCB2b2lkIDApO1xuICAgICAgICBfZGVmaW5lUHJvcGVydHkodGhpcywgXCJhcnJheU9mXCIsIHZvaWQgMCk7XG4gICAgICAgIF9kZWZpbmVQcm9wZXJ0eSh0aGlzLCBcImtleU9mXCIsIHZvaWQgMCk7XG4gICAgICAgIF9kZWZpbmVQcm9wZXJ0eSh0aGlzLCBcInZhbHVlT2ZcIiwgdm9pZCAwKTtcbiAgICAgICAgX2RlZmluZVByb3BlcnR5KHRoaXMsIFwiaW5zdGFuY2VPZlwiLCB2b2lkIDApO1xuICAgICAgICBfZGVmaW5lUHJvcGVydHkodGhpcywgXCJuYXJyb3dcIiwgdm9pZCAwKTtcbiAgICAgICAgX2RlZmluZVByb3BlcnR5KHRoaXMsIFwibW9ycGhcIiwgdm9pZCAwKTtcbiAgICAgICAgX2RlZmluZVByb3BlcnR5KHRoaXMsIFwidHlwZVwiLCB2b2lkIDApO1xuICAgICAgICB0aGlzLmFsaWFzZXMgPSBhbGlhc2VzO1xuICAgICAgICB0aGlzLnBhcnNlQ2FjaGUgPSBuZXcgRnJlZXppbmdDYWNoZSgpO1xuICAgICAgICBfY2xhc3NQcml2YXRlRmllbGRTZXQodGhpcywgX3Jlc29sdXRpb25zLCBuZXcgQ2FjaGUoKSk7XG4gICAgICAgIF9jbGFzc1ByaXZhdGVGaWVsZFNldCh0aGlzLCBfZXhwb3J0cywgbmV3IENhY2hlKCkpO1xuICAgICAgICB0aGlzLmV4cHJlc3Npb25zID0ge1xuICAgICAgICAgICAgaW50ZXJzZWN0aW9uOiAobCwgciwgb3B0cyk9PnRoaXMudHlwZShbXG4gICAgICAgICAgICAgICAgICAgIGwsXG4gICAgICAgICAgICAgICAgICAgIFwiJlwiLFxuICAgICAgICAgICAgICAgICAgICByXG4gICAgICAgICAgICAgICAgXSwgb3B0cyksXG4gICAgICAgICAgICB1bmlvbjogKGwsIHIsIG9wdHMpPT50aGlzLnR5cGUoW1xuICAgICAgICAgICAgICAgICAgICBsLFxuICAgICAgICAgICAgICAgICAgICBcInxcIixcbiAgICAgICAgICAgICAgICAgICAgclxuICAgICAgICAgICAgICAgIF0sIG9wdHMpLFxuICAgICAgICAgICAgYXJyYXlPZjogKGRlZiwgb3B0cyk9PnRoaXMudHlwZShbXG4gICAgICAgICAgICAgICAgICAgIGRlZixcbiAgICAgICAgICAgICAgICAgICAgXCJbXVwiXG4gICAgICAgICAgICAgICAgXSwgb3B0cyksXG4gICAgICAgICAgICBrZXlPZjogKGRlZiwgb3B0cyk9PnRoaXMudHlwZShbXG4gICAgICAgICAgICAgICAgICAgIFwia2V5b2ZcIixcbiAgICAgICAgICAgICAgICAgICAgZGVmXG4gICAgICAgICAgICAgICAgXSwgb3B0cyksXG4gICAgICAgICAgICBub2RlOiAoZGVmLCBvcHRzKT0+dGhpcy50eXBlKFtcbiAgICAgICAgICAgICAgICAgICAgXCJub2RlXCIsXG4gICAgICAgICAgICAgICAgICAgIGRlZlxuICAgICAgICAgICAgICAgIF0sIG9wdHMpLFxuICAgICAgICAgICAgaW5zdGFuY2VPZjogKGRlZiwgb3B0cyk9PnRoaXMudHlwZShbXG4gICAgICAgICAgICAgICAgICAgIFwiaW5zdGFuY2VvZlwiLFxuICAgICAgICAgICAgICAgICAgICBkZWZcbiAgICAgICAgICAgICAgICBdLCBvcHRzKSxcbiAgICAgICAgICAgIHZhbHVlT2Y6IChkZWYsIG9wdHMpPT50aGlzLnR5cGUoW1xuICAgICAgICAgICAgICAgICAgICBcIj09PVwiLFxuICAgICAgICAgICAgICAgICAgICBkZWZcbiAgICAgICAgICAgICAgICBdLCBvcHRzKSxcbiAgICAgICAgICAgIG5hcnJvdzogKGRlZiwgZm4sIG9wdHMpPT50aGlzLnR5cGUoW1xuICAgICAgICAgICAgICAgICAgICBkZWYsXG4gICAgICAgICAgICAgICAgICAgIFwiPT5cIixcbiAgICAgICAgICAgICAgICAgICAgZm5cbiAgICAgICAgICAgICAgICBdLCBvcHRzKSxcbiAgICAgICAgICAgIG1vcnBoOiAoZGVmLCBmbiwgb3B0cyk9PnRoaXMudHlwZShbXG4gICAgICAgICAgICAgICAgICAgIGRlZixcbiAgICAgICAgICAgICAgICAgICAgXCJ8PlwiLFxuICAgICAgICAgICAgICAgICAgICBmblxuICAgICAgICAgICAgICAgIF0sIG9wdHMpXG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuaW50ZXJzZWN0aW9uID0gdGhpcy5leHByZXNzaW9ucy5pbnRlcnNlY3Rpb247XG4gICAgICAgIHRoaXMudW5pb24gPSB0aGlzLmV4cHJlc3Npb25zLnVuaW9uO1xuICAgICAgICB0aGlzLmFycmF5T2YgPSB0aGlzLmV4cHJlc3Npb25zLmFycmF5T2Y7XG4gICAgICAgIHRoaXMua2V5T2YgPSB0aGlzLmV4cHJlc3Npb25zLmtleU9mO1xuICAgICAgICB0aGlzLnZhbHVlT2YgPSB0aGlzLmV4cHJlc3Npb25zLnZhbHVlT2Y7XG4gICAgICAgIHRoaXMuaW5zdGFuY2VPZiA9IHRoaXMuZXhwcmVzc2lvbnMuaW5zdGFuY2VPZjtcbiAgICAgICAgdGhpcy5uYXJyb3cgPSB0aGlzLmV4cHJlc3Npb25zLm5hcnJvdztcbiAgICAgICAgdGhpcy5tb3JwaCA9IHRoaXMuZXhwcmVzc2lvbnMubW9ycGg7XG4gICAgICAgIHRoaXMudHlwZSA9IE9iamVjdC5hc3NpZ24oKGRlZiwgY29uZmlnID0ge30pPT57XG4gICAgICAgICAgICBjb25zdCB0ID0gaW5pdGlhbGl6ZVR5cGUoXCJcdTAzQkJ0eXBlXCIsIGRlZiwgY29uZmlnLCB0aGlzKTtcbiAgICAgICAgICAgIGNvbnN0IGN0eCA9IF9jbGFzc1ByaXZhdGVNZXRob2RHZXQodGhpcywgX2luaXRpYWxpemVDb250ZXh0LCBpbml0aWFsaXplQ29udGV4dCkuY2FsbCh0aGlzLCB0KTtcbiAgICAgICAgICAgIGNvbnN0IHJvb3QgPSBwYXJzZURlZmluaXRpb24oZGVmLCBjdHgpO1xuICAgICAgICAgICAgdC5ub2RlID0gZGVlcEZyZWV6ZShoYXNLZXlzKGNvbmZpZykgPyB7XG4gICAgICAgICAgICAgICAgY29uZmlnLFxuICAgICAgICAgICAgICAgIG5vZGU6IHRoaXMucmVzb2x2ZVR5cGVOb2RlKHJvb3QpXG4gICAgICAgICAgICB9IDogcm9vdCk7XG4gICAgICAgICAgICB0LmZsYXQgPSBkZWVwRnJlZXplKGZsYXR0ZW5UeXBlKHQpKTtcbiAgICAgICAgICAgIHJldHVybiB0O1xuICAgICAgICB9LCB7XG4gICAgICAgICAgICBmcm9tOiB0aGlzLmV4cHJlc3Npb25zLm5vZGVcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMubmFtZSA9IF9jbGFzc1ByaXZhdGVNZXRob2RHZXQodGhpcywgX3JlZ2lzdGVyLCByZWdpc3RlcikuY2FsbCh0aGlzLCBvcHRzKTtcbiAgICAgICAgaWYgKG9wdHMuc3RhbmRhcmQgIT09IGZhbHNlKSB7XG4gICAgICAgICAgICBfY2xhc3NQcml2YXRlTWV0aG9kR2V0KHRoaXMsIF9jYWNoZVNwYWNlcywgY2FjaGVTcGFjZXMpLmNhbGwodGhpcywgW1xuICAgICAgICAgICAgICAgIHNwYWNlUmVnaXN0cnlbXCJzdGFuZGFyZFwiXVxuICAgICAgICAgICAgXSwgXCJpbXBvcnRzXCIpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChvcHRzLmltcG9ydHMpIHtcbiAgICAgICAgICAgIF9jbGFzc1ByaXZhdGVNZXRob2RHZXQodGhpcywgX2NhY2hlU3BhY2VzLCBjYWNoZVNwYWNlcykuY2FsbCh0aGlzLCBvcHRzLmltcG9ydHMsIFwiaW1wb3J0c1wiKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAob3B0cy5pbmNsdWRlcykge1xuICAgICAgICAgICAgX2NsYXNzUHJpdmF0ZU1ldGhvZEdldCh0aGlzLCBfY2FjaGVTcGFjZXMsIGNhY2hlU3BhY2VzKS5jYWxsKHRoaXMsIG9wdHMuaW5jbHVkZXMsIFwiaW5jbHVkZXNcIik7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jb25maWcgPSBjb21waWxlU2NvcGVPcHRpb25zKG9wdHMpO1xuICAgIH1cbn1cbmZ1bmN0aW9uIHJlZ2lzdGVyKG9wdHMpIHtcbiAgICBjb25zdCBuYW1lID0gb3B0cy5uYW1lID8gc2NvcGVSZWdpc3RyeVtvcHRzLm5hbWVdID8gdGhyb3dQYXJzZUVycm9yKGBBIHNjb3BlIG5hbWVkICcke29wdHMubmFtZX0nIGFscmVhZHkgZXhpc3RzYCkgOiBvcHRzLm5hbWUgOiBgc2NvcGUkeysrYW5vbnltb3VzU2NvcGVDb3VudH1gO1xuICAgIHNjb3BlUmVnaXN0cnlbbmFtZV0gPSB0aGlzO1xuICAgIHJldHVybiBuYW1lO1xufVxuZnVuY3Rpb24gY2FjaGVTcGFjZXMoc3BhY2VzLCBraW5kKSB7XG4gICAgZm9yIChjb25zdCBzcGFjZSBvZiBzcGFjZXMpe1xuICAgICAgICBmb3IoY29uc3QgbmFtZSBpbiBzcGFjZSl7XG4gICAgICAgICAgICBpZiAoX2NsYXNzUHJpdmF0ZUZpZWxkR2V0KHRoaXMsIF9yZXNvbHV0aW9ucykuaGFzKG5hbWUpIHx8IG5hbWUgaW4gdGhpcy5hbGlhc2VzKSB7XG4gICAgICAgICAgICAgICAgdGhyb3dQYXJzZUVycm9yKHdyaXRlRHVwbGljYXRlQWxpYXNlc01lc3NhZ2UobmFtZSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgX2NsYXNzUHJpdmF0ZUZpZWxkR2V0KHRoaXMsIF9yZXNvbHV0aW9ucykuc2V0KG5hbWUsIHNwYWNlW25hbWVdKTtcbiAgICAgICAgICAgIGlmIChraW5kID09PSBcImluY2x1ZGVzXCIpIHtcbiAgICAgICAgICAgICAgICBfY2xhc3NQcml2YXRlRmllbGRHZXQodGhpcywgX2V4cG9ydHMpLnNldChuYW1lLCBzcGFjZVtuYW1lXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59XG5mdW5jdGlvbiBpbml0aWFsaXplQ29udGV4dCh0eXBlKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgdHlwZSxcbiAgICAgICAgcGF0aDogbmV3IFBhdGgoKVxuICAgIH07XG59XG5mdW5jdGlvbiByZXNvbHZlUmVjdXJzZShuYW1lLCBvblVucmVzb2x2YWJsZSwgc2Vlbikge1xuICAgIGNvbnN0IG1heWJlQ2FjaGVSZXN1bHQgPSBfY2xhc3NQcml2YXRlRmllbGRHZXQodGhpcywgX3Jlc29sdXRpb25zKS5nZXQobmFtZSk7XG4gICAgaWYgKG1heWJlQ2FjaGVSZXN1bHQpIHtcbiAgICAgICAgcmV0dXJuIG1heWJlQ2FjaGVSZXN1bHQ7XG4gICAgfVxuICAgIGNvbnN0IGFsaWFzRGVmID0gdGhpcy5hbGlhc2VzW25hbWVdO1xuICAgIGlmICghYWxpYXNEZWYpIHtcbiAgICAgICAgcmV0dXJuIG9uVW5yZXNvbHZhYmxlID09PSBcInRocm93XCIgPyB0aHJvd0ludGVybmFsRXJyb3IoYFVuZXhwZWN0ZWRseSBmYWlsZWQgdG8gcmVzb2x2ZSBhbGlhcyAnJHtuYW1lfSdgKSA6IHVuZGVmaW5lZDtcbiAgICB9XG4gICAgY29uc3QgdCA9IGluaXRpYWxpemVUeXBlKG5hbWUsIGFsaWFzRGVmLCB7fSwgdGhpcyk7XG4gICAgY29uc3QgY3R4ID0gX2NsYXNzUHJpdmF0ZU1ldGhvZEdldCh0aGlzLCBfaW5pdGlhbGl6ZUNvbnRleHQsIGluaXRpYWxpemVDb250ZXh0KS5jYWxsKHRoaXMsIHQpO1xuICAgIF9jbGFzc1ByaXZhdGVGaWVsZEdldCh0aGlzLCBfcmVzb2x1dGlvbnMpLnNldChuYW1lLCB0KTtcbiAgICBfY2xhc3NQcml2YXRlRmllbGRHZXQodGhpcywgX2V4cG9ydHMpLnNldChuYW1lLCB0KTtcbiAgICBsZXQgbm9kZSA9IHBhcnNlRGVmaW5pdGlvbihhbGlhc0RlZiwgY3R4KTtcbiAgICBpZiAodHlwZW9mIG5vZGUgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgaWYgKHNlZW4uaW5jbHVkZXMobm9kZSkpIHtcbiAgICAgICAgICAgIHJldHVybiB0aHJvd1BhcnNlRXJyb3Iod3JpdGVTaGFsbG93Q3ljbGVFcnJvck1lc3NhZ2UobmFtZSwgc2VlbikpO1xuICAgICAgICB9XG4gICAgICAgIHNlZW4ucHVzaChub2RlKTtcbiAgICAgICAgbm9kZSA9IF9jbGFzc1ByaXZhdGVNZXRob2RHZXQodGhpcywgX3Jlc29sdmVSZWN1cnNlLCByZXNvbHZlUmVjdXJzZSkuY2FsbCh0aGlzLCBub2RlLCBcInRocm93XCIsIHNlZW4pLm5vZGU7XG4gICAgfVxuICAgIHQubm9kZSA9IGRlZXBGcmVlemUobm9kZSk7XG4gICAgdC5mbGF0ID0gZGVlcEZyZWV6ZShmbGF0dGVuVHlwZSh0KSk7XG4gICAgcmV0dXJuIHQ7XG59XG5leHBvcnQgY29uc3Qgc2NvcGUgPSAoYWxpYXNlcywgb3B0cyA9IHt9KT0+bmV3IFNjb3BlKGFsaWFzZXMsIG9wdHMpO1xuZXhwb3J0IGNvbnN0IHJvb3RTY29wZSA9IHNjb3BlKHt9LCB7XG4gICAgbmFtZTogXCJyb290XCIsXG4gICAgc3RhbmRhcmQ6IGZhbHNlXG59KTtcbmV4cG9ydCBjb25zdCByb290VHlwZSA9IHJvb3RTY29wZS50eXBlO1xuZXhwb3J0IGNvbnN0IHdyaXRlU2hhbGxvd0N5Y2xlRXJyb3JNZXNzYWdlID0gKG5hbWUsIHNlZW4pPT5gQWxpYXMgJyR7bmFtZX0nIGhhcyBhIHNoYWxsb3cgcmVzb2x1dGlvbiBjeWNsZTogJHtbXG4gICAgICAgIC4uLnNlZW4sXG4gICAgICAgIG5hbWVcbiAgICBdLmpvaW4oXCI9PlwiKX1gO1xuZXhwb3J0IGNvbnN0IHdyaXRlRHVwbGljYXRlQWxpYXNlc01lc3NhZ2UgPSAobmFtZSk9PmBBbGlhcyAnJHtuYW1lfScgaXMgYWxyZWFkeSBkZWZpbmVkYDtcbiIsICJpbXBvcnQgeyBzY29wZSB9IGZyb20gXCIuL3Njb3BlLmpzXCI7XG4vKipcbiAqIEBkb2NnZW5TY29wZVxuICogQGRvY2dlblRhYmxlXG4gKi8gZXhwb3J0IGNvbnN0IGpzT2JqZWN0c1Njb3BlID0gc2NvcGUoe1xuICAgIEZ1bmN0aW9uOiBbXG4gICAgICAgIFwibm9kZVwiLFxuICAgICAgICB7XG4gICAgICAgICAgICBvYmplY3Q6IHtcbiAgICAgICAgICAgICAgICBjbGFzczogRnVuY3Rpb25cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIF0sXG4gICAgRGF0ZTogW1xuICAgICAgICBcIm5vZGVcIixcbiAgICAgICAge1xuICAgICAgICAgICAgb2JqZWN0OiB7XG4gICAgICAgICAgICAgICAgY2xhc3M6IERhdGVcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIF0sXG4gICAgRXJyb3I6IFtcbiAgICAgICAgXCJub2RlXCIsXG4gICAgICAgIHtcbiAgICAgICAgICAgIG9iamVjdDoge1xuICAgICAgICAgICAgICAgIGNsYXNzOiBFcnJvclxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgXSxcbiAgICBNYXA6IFtcbiAgICAgICAgXCJub2RlXCIsXG4gICAgICAgIHtcbiAgICAgICAgICAgIG9iamVjdDoge1xuICAgICAgICAgICAgICAgIGNsYXNzOiBNYXBcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIF0sXG4gICAgUmVnRXhwOiBbXG4gICAgICAgIFwibm9kZVwiLFxuICAgICAgICB7XG4gICAgICAgICAgICBvYmplY3Q6IHtcbiAgICAgICAgICAgICAgICBjbGFzczogUmVnRXhwXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICBdLFxuICAgIFNldDogW1xuICAgICAgICBcIm5vZGVcIixcbiAgICAgICAge1xuICAgICAgICAgICAgb2JqZWN0OiB7XG4gICAgICAgICAgICAgICAgY2xhc3M6IFNldFxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgXSxcbiAgICBXZWFrTWFwOiBbXG4gICAgICAgIFwibm9kZVwiLFxuICAgICAgICB7XG4gICAgICAgICAgICBvYmplY3Q6IHtcbiAgICAgICAgICAgICAgICBjbGFzczogV2Vha01hcFxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgXSxcbiAgICBXZWFrU2V0OiBbXG4gICAgICAgIFwibm9kZVwiLFxuICAgICAgICB7XG4gICAgICAgICAgICBvYmplY3Q6IHtcbiAgICAgICAgICAgICAgICBjbGFzczogV2Vha1NldFxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgXSxcbiAgICBQcm9taXNlOiBbXG4gICAgICAgIFwibm9kZVwiLFxuICAgICAgICB7XG4gICAgICAgICAgICBvYmplY3Q6IHtcbiAgICAgICAgICAgICAgICBjbGFzczogUHJvbWlzZVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgXVxufSwge1xuICAgIG5hbWU6IFwianNPYmplY3RzXCIsXG4gICAgc3RhbmRhcmQ6IGZhbHNlXG59KTtcbmV4cG9ydCBjb25zdCBqc09iamVjdHMgPSBqc09iamVjdHNTY29wZS5jb21waWxlKCk7XG4iLCAiaW1wb3J0IHsgc2NvcGUgfSBmcm9tIFwiLi9zY29wZS5qc1wiO1xuY29uc3QgYWx3YXlzID0ge1xuICAgIGJpZ2ludDogdHJ1ZSxcbiAgICBib29sZWFuOiB0cnVlLFxuICAgIG51bGw6IHRydWUsXG4gICAgbnVtYmVyOiB0cnVlLFxuICAgIG9iamVjdDogdHJ1ZSxcbiAgICBzdHJpbmc6IHRydWUsXG4gICAgc3ltYm9sOiB0cnVlLFxuICAgIHVuZGVmaW5lZDogdHJ1ZVxufTtcbi8qKlxuICogQGtleXdvcmRzIGtleXdvcmRzOiB7XCJhbnlcIjogXCJhbnlcIixcbiAgICAgICAgXCJiaWdpbnRcIjogXCJhIGJpZ2ludFwiLFxuICAgICAgICBcImJvb2xlYW5cIjogXCJhIGJvb2xlYW5cIixcbiAgICAgICAgXCJmYWxzZVwiOiBcImZhbHNlXCIsXG4gICAgICAgIFwibmV2ZXJcIjogXCJuZXZlclwiLFxuICAgICAgICBcIm51bGxcIjogXCJudWxsXCIsXG4gICAgICAgIFwibnVtYmVyXCI6IFwiYSBudW1iZXJcIixcbiAgICAgICAgXCJvYmplY3RcIjogXCJhbiBvYmplY3RcIixcbiAgICAgICAgXCJzdHJpbmdcIjogXCJhIHN0cmluZ1wiLFxuICAgICAgICBcInN5bWJvbFwiOiBcImEgc3ltYm9sXCIsXG4gICAgICAgIFwidHJ1ZVwiOiBcInRydWVcIixcbiAgICAgICAgXCJ1bmtub3duXCI6IFwidW5rbm93blwiLFxuICAgICAgICBcInZvaWRcIjogXCJ2b2lkXCIsXG4gICAgICAgIFwidW5kZWZpbmVkXCI6IFwidW5kZWZpbmVkXCJ9XG4gKiBAZG9jZ2VuU2NvcGVcbiAqIEBkb2NnZW5UYWJsZVxuICovIGV4cG9ydCBjb25zdCB0c0tleXdvcmRzU2NvcGUgPSBzY29wZSh7XG4gICAgYW55OiBbXG4gICAgICAgIFwibm9kZVwiLFxuICAgICAgICBhbHdheXNcbiAgICBdLFxuICAgIGJpZ2ludDogW1xuICAgICAgICBcIm5vZGVcIixcbiAgICAgICAge1xuICAgICAgICAgICAgYmlnaW50OiB0cnVlXG4gICAgICAgIH1cbiAgICBdLFxuICAgIGJvb2xlYW46IFtcbiAgICAgICAgXCJub2RlXCIsXG4gICAgICAgIHtcbiAgICAgICAgICAgIGJvb2xlYW46IHRydWVcbiAgICAgICAgfVxuICAgIF0sXG4gICAgZmFsc2U6IFtcbiAgICAgICAgXCJub2RlXCIsXG4gICAgICAgIHtcbiAgICAgICAgICAgIGJvb2xlYW46IHtcbiAgICAgICAgICAgICAgICB2YWx1ZTogZmFsc2VcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIF0sXG4gICAgbmV2ZXI6IFtcbiAgICAgICAgXCJub2RlXCIsXG4gICAgICAgIHt9XG4gICAgXSxcbiAgICBudWxsOiBbXG4gICAgICAgIFwibm9kZVwiLFxuICAgICAgICB7XG4gICAgICAgICAgICBudWxsOiB0cnVlXG4gICAgICAgIH1cbiAgICBdLFxuICAgIG51bWJlcjogW1xuICAgICAgICBcIm5vZGVcIixcbiAgICAgICAge1xuICAgICAgICAgICAgbnVtYmVyOiB0cnVlXG4gICAgICAgIH1cbiAgICBdLFxuICAgIG9iamVjdDogW1xuICAgICAgICBcIm5vZGVcIixcbiAgICAgICAge1xuICAgICAgICAgICAgb2JqZWN0OiB0cnVlXG4gICAgICAgIH1cbiAgICBdLFxuICAgIHN0cmluZzogW1xuICAgICAgICBcIm5vZGVcIixcbiAgICAgICAge1xuICAgICAgICAgICAgc3RyaW5nOiB0cnVlXG4gICAgICAgIH1cbiAgICBdLFxuICAgIHN5bWJvbDogW1xuICAgICAgICBcIm5vZGVcIixcbiAgICAgICAge1xuICAgICAgICAgICAgc3ltYm9sOiB0cnVlXG4gICAgICAgIH1cbiAgICBdLFxuICAgIHRydWU6IFtcbiAgICAgICAgXCJub2RlXCIsXG4gICAgICAgIHtcbiAgICAgICAgICAgIGJvb2xlYW46IHtcbiAgICAgICAgICAgICAgICB2YWx1ZTogdHJ1ZVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgXSxcbiAgICB1bmtub3duOiBbXG4gICAgICAgIFwibm9kZVwiLFxuICAgICAgICBhbHdheXNcbiAgICBdLFxuICAgIHZvaWQ6IFtcbiAgICAgICAgXCJub2RlXCIsXG4gICAgICAgIHtcbiAgICAgICAgICAgIHVuZGVmaW5lZDogdHJ1ZVxuICAgICAgICB9XG4gICAgXSxcbiAgICB1bmRlZmluZWQ6IFtcbiAgICAgICAgXCJub2RlXCIsXG4gICAgICAgIHtcbiAgICAgICAgICAgIHVuZGVmaW5lZDogdHJ1ZVxuICAgICAgICB9XG4gICAgXVxufSwge1xuICAgIG5hbWU6IFwidHNcIixcbiAgICBzdGFuZGFyZDogZmFsc2Vcbn0pO1xuZXhwb3J0IGNvbnN0IHRzS2V5d29yZHMgPSB0c0tleXdvcmRzU2NvcGUuY29tcGlsZSgpO1xuIiwgImltcG9ydCB7IHJvb3RUeXBlIH0gZnJvbSBcIi4uL3Njb3BlLmpzXCI7XG4vLyBodHRwczovL2dpdGh1Yi5jb20vdmFsaWRhdG9yanMvdmFsaWRhdG9yLmpzL2Jsb2IvbWFzdGVyL3NyYy9saWIvaXNMdWhuTnVtYmVyLmpzXG5leHBvcnQgY29uc3QgaXNMdWhuVmFsaWQgPSAoY3JlZGl0Q2FyZElucHV0KT0+e1xuICAgIGNvbnN0IHNhbml0aXplZCA9IGNyZWRpdENhcmRJbnB1dC5yZXBsYWNlKC9bLSBdKy9nLCBcIlwiKTtcbiAgICBsZXQgc3VtID0gMDtcbiAgICBsZXQgZGlnaXQ7XG4gICAgbGV0IHRtcE51bTtcbiAgICBsZXQgc2hvdWxkRG91YmxlO1xuICAgIGZvcihsZXQgaSA9IHNhbml0aXplZC5sZW5ndGggLSAxOyBpID49IDA7IGktLSl7XG4gICAgICAgIGRpZ2l0ID0gc2FuaXRpemVkLnN1YnN0cmluZyhpLCBpICsgMSk7XG4gICAgICAgIHRtcE51bSA9IHBhcnNlSW50KGRpZ2l0LCAxMCk7XG4gICAgICAgIGlmIChzaG91bGREb3VibGUpIHtcbiAgICAgICAgICAgIHRtcE51bSAqPSAyO1xuICAgICAgICAgICAgaWYgKHRtcE51bSA+PSAxMCkge1xuICAgICAgICAgICAgICAgIHN1bSArPSB0bXBOdW0gJSAxMCArIDE7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHN1bSArPSB0bXBOdW07XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzdW0gKz0gdG1wTnVtO1xuICAgICAgICB9XG4gICAgICAgIHNob3VsZERvdWJsZSA9ICFzaG91bGREb3VibGU7XG4gICAgfVxuICAgIHJldHVybiAhIShzdW0gJSAxMCA9PT0gMCA/IHNhbml0aXplZCA6IGZhbHNlKTtcbn07XG4vLyBodHRwczovL2dpdGh1Yi5jb20vdmFsaWRhdG9yanMvdmFsaWRhdG9yLmpzL2Jsb2IvbWFzdGVyL3NyYy9saWIvaXNDcmVkaXRDYXJkLmpzXG5jb25zdCBjcmVkaXRDYXJkTWF0Y2hlciA9IC9eKD86NFswLTldezEyfSg/OlswLTldezMsNn0pP3w1WzEtNV1bMC05XXsxNH18KDIyMlsxLTldfDIyWzMtOV1bMC05XXwyWzMtNl1bMC05XXsyfXwyN1swMV1bMC05XXwyNzIwKVswLTldezEyfXw2KD86MDExfDVbMC05XVswLTldKVswLTldezEyLDE1fXwzWzQ3XVswLTldezEzfXwzKD86MFswLTVdfFs2OF1bMC05XSlbMC05XXsxMX18KD86MjEzMXwxODAwfDM1XFxkezN9KVxcZHsxMX18NlsyN11bMC05XXsxNH18Xig4MVswLTldezE0LDE3fSkpJC87XG5leHBvcnQgY29uc3QgY3JlZGl0Q2FyZCA9IHJvb3RUeXBlKFtcbiAgICBjcmVkaXRDYXJkTWF0Y2hlcixcbiAgICBcIj0+XCIsXG4gICAgKHMsIHByb2JsZW1zKT0+aXNMdWhuVmFsaWQocykgfHwgIXByb2JsZW1zLm11c3RCZShcImEgdmFsaWQgY3JlZGl0IGNhcmQgbnVtYmVyXCIpXG5dLCB7XG4gICAgbXVzdEJlOiBcImEgdmFsaWQgY3JlZGl0IGNhcmQgbnVtYmVyXCJcbn0pO1xuIiwgImltcG9ydCB7IHJvb3RUeXBlIH0gZnJvbSBcIi4uL3Njb3BlLmpzXCI7XG5pbXBvcnQgeyB0c0tleXdvcmRzIH0gZnJvbSBcIi4uL3RzS2V5d29yZHMuanNcIjtcbmNvbnN0IGRheURlbGltaXRlck1hdGNoZXIgPSAvXlsuLy1dJC87XG4vLyBJU08gODYwMSBkYXRlL3RpbWUgbW9kZXJuaXplZCBmcm9tIGh0dHBzOi8vZ2l0aHViLmNvbS92YWxpZGF0b3Jqcy92YWxpZGF0b3IuanMvYmxvYi9tYXN0ZXIvc3JjL2xpYi9pc0lTTzg2MDEuanNcbi8vIEJhc2VkIG9uIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtZGF0ZS10aW1lLXN0cmluZy1mb3JtYXQsIHRoZSBUXG4vLyBkZWxpbWl0ZXIgZm9yIGRhdGUvdGltZSBpcyBtYW5kYXRvcnkuIFJlZ2V4IGZyb20gdmFsaWRhdG9yLmpzIHN0cmljdCBtYXRjaGVyOlxuY29uc3QgaXNvODYwMU1hdGNoZXIgPSAvXihbKy1dP1xcZHs0fSg/IVxcZHsyfVxcYikpKCgtPykoKDBbMS05XXwxWzAtMl0pKFxcMyhbMTJdXFxkfDBbMS05XXwzWzAxXSkpP3xXKFswLTRdXFxkfDVbMC0zXSkoLT9bMS03XSk/fCgwMFsxLTldfDBbMS05XVxcZHxbMTJdXFxkezJ9fDMoWzAtNV1cXGR8NlsxLTZdKSkpKFtUXSgoKFswMV1cXGR8MlswLTNdKSgoOj8pWzAtNV1cXGQpP3wyNDo/MDApKFsuLF1cXGQrKD8hOikpPyk/KFxcMTdbMC01XVxcZChbLixdXFxkKyk/KT8oW3paXXwoWystXSkoWzAxXVxcZHwyWzAtM10pOj8oWzAtNV1cXGQpPyk/KT8pPyQvO1xuY29uc3QgaXNWYWxpZERhdGVJbnN0YW5jZSA9IChkYXRlKT0+IWlzTmFOKGRhdGUpO1xuY29uc3Qgd3JpdGVGb3JtYXR0ZWRNdXN0QmUgPSAoZm9ybWF0KT0+YGEgJHtmb3JtYXR9LWZvcm1hdHRlZCBkYXRlYDtcbmV4cG9ydCBjb25zdCB0cnlQYXJzZURhdGUgPSAoZGF0YSwgb3B0cyk9PntcbiAgICBpZiAoIW9wdHM/LmZvcm1hdCkge1xuICAgICAgICBjb25zdCByZXN1bHQgPSBuZXcgRGF0ZShkYXRhKTtcbiAgICAgICAgcmV0dXJuIGlzVmFsaWREYXRlSW5zdGFuY2UocmVzdWx0KSA/IHJlc3VsdCA6IFwiYSB2YWxpZCBkYXRlXCI7XG4gICAgfVxuICAgIGlmIChvcHRzLmZvcm1hdCA9PT0gXCJpc284NjAxXCIpIHtcbiAgICAgICAgcmV0dXJuIGlzbzg2MDFNYXRjaGVyLnRlc3QoZGF0YSkgPyBuZXcgRGF0ZShkYXRhKSA6IHdyaXRlRm9ybWF0dGVkTXVzdEJlKFwiaXNvODYwMVwiKTtcbiAgICB9XG4gICAgY29uc3QgZGF0YVBhcnRzID0gZGF0YS5zcGxpdChkYXlEZWxpbWl0ZXJNYXRjaGVyKTtcbiAgICAvLyB3aWxsIGJlIHRoZSBmaXJzdCBkZWxpbWl0ZXIgbWF0Y2hlZCwgaWYgdGhlcmUgaXMgb25lXG4gICAgY29uc3QgZGVsaW1pdGVyID0gZGF0YVtkYXRhUGFydHNbMF0ubGVuZ3RoXTtcbiAgICBjb25zdCBmb3JtYXRQYXJ0cyA9IGRlbGltaXRlciA/IG9wdHMuZm9ybWF0LnNwbGl0KGRlbGltaXRlcikgOiBbXG4gICAgICAgIG9wdHMuZm9ybWF0XG4gICAgXTtcbiAgICBpZiAoZGF0YVBhcnRzLmxlbmd0aCAhPT0gZm9ybWF0UGFydHMubGVuZ3RoKSB7XG4gICAgICAgIHJldHVybiB3cml0ZUZvcm1hdHRlZE11c3RCZShvcHRzLmZvcm1hdCk7XG4gICAgfVxuICAgIGNvbnN0IHBhcnNlZFBhcnRzID0ge307XG4gICAgZm9yKGxldCBpID0gMDsgaSA8IGZvcm1hdFBhcnRzLmxlbmd0aDsgaSsrKXtcbiAgICAgICAgaWYgKGRhdGFQYXJ0c1tpXS5sZW5ndGggIT09IGZvcm1hdFBhcnRzW2ldLmxlbmd0aCAmJiAvLyBpZiBmb3JtYXQgaXMgXCJtXCIgb3IgXCJkXCIsIGRhdGEgaXMgYWxsb3dlZCB0byBiZSAxIG9yIDIgY2hhcmFjdGVyc1xuICAgICAgICAhKGZvcm1hdFBhcnRzW2ldLmxlbmd0aCA9PT0gMSAmJiBkYXRhUGFydHNbaV0ubGVuZ3RoID09PSAyKSkge1xuICAgICAgICAgICAgcmV0dXJuIHdyaXRlRm9ybWF0dGVkTXVzdEJlKG9wdHMuZm9ybWF0KTtcbiAgICAgICAgfVxuICAgICAgICBwYXJzZWRQYXJ0c1tmb3JtYXRQYXJ0c1tpXVswXV0gPSBkYXRhUGFydHNbaV07XG4gICAgfVxuICAgIGNvbnN0IGRhdGUgPSBuZXcgRGF0ZShgJHtwYXJzZWRQYXJ0cy5tfS8ke3BhcnNlZFBhcnRzLmR9LyR7cGFyc2VkUGFydHMueX1gKTtcbiAgICBpZiAoYCR7ZGF0ZS5nZXREYXRlKCl9YCA9PT0gcGFyc2VkUGFydHMuZCkge1xuICAgICAgICByZXR1cm4gZGF0ZTtcbiAgICB9XG4gICAgcmV0dXJuIHdyaXRlRm9ybWF0dGVkTXVzdEJlKG9wdHMuZm9ybWF0KTtcbn07XG5leHBvcnQgY29uc3QgcGFyc2VkRGF0ZSA9IHJvb3RUeXBlKFtcbiAgICB0c0tleXdvcmRzLnN0cmluZyxcbiAgICBcInw+XCIsXG4gICAgKHMsIHByb2JsZW1zKT0+e1xuICAgICAgICBjb25zdCByZXN1bHQgPSB0cnlQYXJzZURhdGUocyk7XG4gICAgICAgIHJldHVybiB0eXBlb2YgcmVzdWx0ID09PSBcInN0cmluZ1wiID8gcHJvYmxlbXMubXVzdEJlKHJlc3VsdCkgOiByZXN1bHQ7XG4gICAgfVxuXSk7XG4iLCAiaW1wb3J0IHsgd2VsbEZvcm1lZEludGVnZXJNYXRjaGVyLCB3ZWxsRm9ybWVkTnVtYmVyTWF0Y2hlciB9IGZyb20gXCIuLi8uLi91dGlscy9udW1lcmljTGl0ZXJhbHMuanNcIjtcbmltcG9ydCB7IHJvb3RUeXBlLCBzY29wZSB9IGZyb20gXCIuLi9zY29wZS5qc1wiO1xuaW1wb3J0IHsgdHNLZXl3b3JkcyB9IGZyb20gXCIuLi90c0tleXdvcmRzLmpzXCI7XG5pbXBvcnQgeyBjcmVkaXRDYXJkIH0gZnJvbSBcIi4vY3JlZGl0Q2FyZC5qc1wiO1xuaW1wb3J0IHsgcGFyc2VkRGF0ZSB9IGZyb20gXCIuL2RhdGUuanNcIjtcbi8vIE5vbi10cml2aWFsIGV4cHJlc3Npb25zIHNob3VsZCBoYXZlIGFuIGV4cGxhbmF0aW9uIG9yIGF0dHJpYnV0aW9uXG5jb25zdCBwYXJzZWROdW1iZXIgPSByb290VHlwZShbXG4gICAgd2VsbEZvcm1lZE51bWJlck1hdGNoZXIsXG4gICAgXCJ8PlwiLFxuICAgIChzKT0+cGFyc2VGbG9hdChzKVxuXSwge1xuICAgIG11c3RCZTogXCJhIHdlbGwtZm9ybWVkIG51bWVyaWMgc3RyaW5nXCJcbn0pO1xuY29uc3QgcGFyc2VkSW50ZWdlciA9IHJvb3RUeXBlKFtcbiAgICB3ZWxsRm9ybWVkSW50ZWdlck1hdGNoZXIsXG4gICAgXCJ8PlwiLFxuICAgIChzKT0+cGFyc2VJbnQocylcbl0sIHtcbiAgICBtdXN0QmU6IFwiYSB3ZWxsLWZvcm1lZCBpbnRlZ2VyIHN0cmluZ1wiXG59KTtcbi8vIGh0dHBzOi8vd3d3LnJlZ3VsYXItZXhwcmVzc2lvbnMuaW5mby9lbWFpbC5odG1sXG5jb25zdCBlbWFpbCA9IHJvb3RUeXBlKC9eW0EtWmEtejAtOS5fJSstXStAW0EtWmEtejAtOS4tXStcXC5bQS1aYS16XXsyLH0kLywge1xuICAgIG11c3RCZTogXCJhIHZhbGlkIGVtYWlsXCJcbn0pO1xuLy8gaHR0cHM6Ly9naXRodWIuY29tL3ZhbGlkYXRvcmpzL3ZhbGlkYXRvci5qcy9ibG9iL21hc3Rlci9zcmMvbGliL2lzVVVJRC5qc1xuY29uc3QgdXVpZCA9IHJvb3RUeXBlKC9eWzAtOUEtRmEtZl17OH0tWzAtOUEtRmEtZl17NH0tWzAtOUEtRmEtZl17NH0tWzAtOUEtRmEtZl17NH0tWzAtOUEtRmEtZl17MTJ9JC8sIHtcbiAgICBtdXN0QmU6IFwiYSB2YWxpZCBVVUlEXCJcbn0pO1xuLy8gaHR0cHM6Ly9zZW12ZXIub3JnL1xuY29uc3Qgc2VtdmVyID0gcm9vdFR5cGUoL14oMHxbMS05XVxcZCopXFwuKDB8WzEtOV1cXGQqKVxcLigwfFsxLTldXFxkKikoPzotKCg/OjB8WzEtOV1cXGQqfFxcZCpbYS16QS1aLV1bMC05YS16QS1aLV0qKSg/OlxcLig/OjB8WzEtOV1cXGQqfFxcZCpbYS16QS1aLV1bMC05YS16QS1aLV0qKSkqKSk/KD86XFwrKFswLTlhLXpBLVotXSsoPzpcXC5bMC05YS16QS1aLV0rKSopKT8kLywge1xuICAgIG11c3RCZTogXCJhIHZhbGlkIHNlbWFudGljIHZlcnNpb24gKHNlZSBodHRwczovL3NlbXZlci5vcmcvKVwiXG59KTtcbmNvbnN0IGpzb24gPSByb290VHlwZShbXG4gICAgdHNLZXl3b3Jkcy5zdHJpbmcsXG4gICAgXCJ8PlwiLFxuICAgIChzKT0+SlNPTi5wYXJzZShzKVxuXSwge1xuICAgIG11c3RCZTogXCJhIEpTT04tcGFyc2FibGUgc3RyaW5nXCJcbn0pO1xuLyoqXG4gKiBAa2V5d29yZHMga2V5d29yZHM6IHsgXG4gICAgICAgIFwiYWxwaGFcIjogXCJvbmx5IGxldHRlcnNcIixcbiAgICAgICAgXCJhbHBoYW51bWVyaWNcIjogXCJvbmx5IGxldHRlcnMgYW5kIGRpZ2l0c1wiLFxuICAgICAgICBcImxvd2VyY2FzZVwiOiBcIm9ubHkgbG93ZXJjYXNlIGxldHRlcnNcIixcbiAgICAgICAgXCJ1cHBlcmNhc2VcIjogXCJvbmx5IHVwcGVyY2FzZSBsZXR0ZXJzXCIsXG4gICAgICAgIFwiY3JlZGl0Q2FyZFwiOiBcImEgdmFsaWQgY3JlZGl0IGNhcmQgbnVtYmVyXCIsXG4gICAgICAgIFwiZW1haWxcIjogXCJhIHZhbGlkIGVtYWlsXCIsXG4gICAgICAgIFwidXVpZFwiOiBcImEgdmFsaWQgVVVJRFwiLFxuICAgICAgICBcInBhcnNlZE51bWJlclwiOiBcImEgd2VsbC1mb3JtZWQgbnVtZXJpYyBzdHJpbmdcIixcbiAgICAgICAgXCJwYXJzZWRJbnRlZ2VyXCI6IFwiYSB3ZWxsLWZvcm1lZCBpbnRlZ2VyIHN0cmluZ1wiLFxuICAgICAgICBcInBhcnNlZERhdGVcIjogXCJhIHZhbGlkIGRhdGVcIixcbiAgICAgICAgXCJzZW12ZXJcIjogXCJhIHZhbGlkIHNlbWFudGljIHZlcnNpb25cIixcbiAgICAgICAgXCJqc29uXCI6IFwiYSBKU09OLXBhcnNhYmxlIHN0cmluZ1wiLFxuICAgICAgICBcImludGVnZXJcIjogXCJhbiBpbnRlZ2VyXCJcbn1cbiAqIEBkb2NnZW5TY29wZVxuICogQGRvY2dlblRhYmxlXG4gKi8gZXhwb3J0IGNvbnN0IHZhbGlkYXRpb25TY29wZSA9IHNjb3BlKHtcbiAgICAvLyBDaGFyYWN0ZXIgc2V0c1xuICAgIGFscGhhOiBbXG4gICAgICAgIC9eW0EtWmEtel0qJC8sXG4gICAgICAgIFwiOlwiLFxuICAgICAgICB7XG4gICAgICAgICAgICBtdXN0QmU6IFwib25seSBsZXR0ZXJzXCJcbiAgICAgICAgfVxuICAgIF0sXG4gICAgYWxwaGFudW1lcmljOiBbXG4gICAgICAgIC9eW0EtWmEtelxcZF0qJC8sXG4gICAgICAgIFwiOlwiLFxuICAgICAgICB7XG4gICAgICAgICAgICBtdXN0QmU6IFwib25seSBsZXR0ZXJzIGFuZCBkaWdpdHNcIlxuICAgICAgICB9XG4gICAgXSxcbiAgICBsb3dlcmNhc2U6IFtcbiAgICAgICAgL15bYS16XSokLyxcbiAgICAgICAgXCI6XCIsXG4gICAgICAgIHtcbiAgICAgICAgICAgIG11c3RCZTogXCJvbmx5IGxvd2VyY2FzZSBsZXR0ZXJzXCJcbiAgICAgICAgfVxuICAgIF0sXG4gICAgdXBwZXJjYXNlOiBbXG4gICAgICAgIC9eW0EtWl0qJC8sXG4gICAgICAgIFwiOlwiLFxuICAgICAgICB7XG4gICAgICAgICAgICBtdXN0QmU6IFwib25seSB1cHBlcmNhc2UgbGV0dGVyc1wiXG4gICAgICAgIH1cbiAgICBdLFxuICAgIGNyZWRpdENhcmQsXG4gICAgZW1haWwsXG4gICAgdXVpZCxcbiAgICBwYXJzZWROdW1iZXIsXG4gICAgcGFyc2VkSW50ZWdlcixcbiAgICBwYXJzZWREYXRlLFxuICAgIHNlbXZlcixcbiAgICBqc29uLFxuICAgIGludGVnZXI6IFtcbiAgICAgICAgXCJub2RlXCIsXG4gICAgICAgIHtcbiAgICAgICAgICAgIG51bWJlcjoge1xuICAgICAgICAgICAgICAgIGRpdmlzb3I6IDFcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIF1cbn0sIHtcbiAgICBuYW1lOiBcInZhbGlkYXRpb25cIixcbiAgICBzdGFuZGFyZDogZmFsc2Vcbn0pO1xuZXhwb3J0IGNvbnN0IHZhbGlkYXRpb24gPSB2YWxpZGF0aW9uU2NvcGUuY29tcGlsZSgpO1xuIiwgImltcG9ydCB7IGpzT2JqZWN0cywganNPYmplY3RzU2NvcGUgfSBmcm9tIFwiLi9qc09iamVjdHMuanNcIjtcbmltcG9ydCB7IHJvb3RTY29wZSwgc2NvcGUgfSBmcm9tIFwiLi9zY29wZS5qc1wiO1xuaW1wb3J0IHsgdHNLZXl3b3JkcywgdHNLZXl3b3Jkc1Njb3BlIH0gZnJvbSBcIi4vdHNLZXl3b3Jkcy5qc1wiO1xuaW1wb3J0IHsgdmFsaWRhdGlvbiwgdmFsaWRhdGlvblNjb3BlIH0gZnJvbSBcIi4vdmFsaWRhdGlvbi92YWxpZGF0aW9uLmpzXCI7XG5leHBvcnQgY29uc3QgYXJrU2NvcGUgPSBzY29wZSh7fSwge1xuICAgIG5hbWU6IFwic3RhbmRhcmRcIixcbiAgICBpbmNsdWRlczogW1xuICAgICAgICB0c0tleXdvcmRzLFxuICAgICAgICBqc09iamVjdHMsXG4gICAgICAgIHZhbGlkYXRpb25cbiAgICBdLFxuICAgIHN0YW5kYXJkOiBmYWxzZVxufSk7XG5leHBvcnQgY29uc3QgYXJrID0gYXJrU2NvcGUuY29tcGlsZSgpO1xuZXhwb3J0IGNvbnN0IHNjb3BlcyA9IHtcbiAgICByb290OiByb290U2NvcGUsXG4gICAgdHNLZXl3b3JkczogdHNLZXl3b3Jkc1Njb3BlLFxuICAgIGpzT2JqZWN0czoganNPYmplY3RzU2NvcGUsXG4gICAgdmFsaWRhdGlvbjogdmFsaWRhdGlvblNjb3BlLFxuICAgIGFyazogYXJrU2NvcGVcbn07XG5leHBvcnQgY29uc3Qgc3BhY2VzID0ge1xuICAgIHRzS2V5d29yZHMsXG4gICAganNPYmplY3RzLFxuICAgIHZhbGlkYXRpb24sXG4gICAgYXJrXG59O1xuZXhwb3J0IGNvbnN0IHR5cGUgPSBhcmtTY29wZS50eXBlO1xuIiwgImltcG9ydCB7IHNjb3BlcyB9IGZyb20gXCIuL2Fyay5qc1wiO1xuLyoqXG4gKiBAb3BlcmF0b3Ige0BsaW5rIGludGVyc2VjdGlvbiB8ICZ9XG4gKiBAZG9jZ2VuVGFibGVcbiAqIEBzdHJpbmcgXCJMJlJcIlxuICogQHR1cGxlICBbTCwgXCImXCIsIFJdXG4gKiBAaGVscGVyICBpbnRlcnNlY3Rpb24oTCxSKVxuICogQGV4YW1wbGUgc3RyaW5nXG4gKiAgICAgIGNvbnN0IGludGVyc2VjdGlvbiA9IHR5cGUoXCIvQGFya3R5cGVcXC5pbyQvICYgZW1haWxcIilcbiAqIEBleGFtcGxlIHR1cGxlXG4gKiAgICAgIGNvbnN0IHR1cGxlSW50ZXJzZWN0aW9uID0gdHlwZShbXCIvQGFya3R5cGVcXC5pbyQvXCIsIFwiJlwiLCBcImVtYWlsXCJdKVxuICogQGV4YW1wbGUgaGVscGVyXG4gKiAgICAgIGNvbnN0IGhlbHBlckludGVyc2VjdGlvbiA9IGludGVyc2VjdGlvbihcIi9AYXJrdHlwZVxcLmlvJC9cIixcImVtYWlsXCIpXG4gKi8gZXhwb3J0IGNvbnN0IGludGVyc2VjdGlvbiA9IHNjb3Blcy5hcmsuaW50ZXJzZWN0aW9uO1xuLyoqXG4gKiBAb3BlcmF0b3Ige0BsaW5rIHVuaW9uIHwgfH1cbiAqIEBkb2NnZW5UYWJsZVxuICogQHN0cmluZyBcIkx8UlwiXG4gKiBAdHVwbGUgW0wsIFwifFwiICwgUl1cbiAqIEBoZWxwZXIgdW5pb24oTCxSKVxuICogQGV4YW1wbGUgc3RyaW5nXG4gKiAgICAgIGNvbnN0IHVuaW9uID0gdHlwZShcInN0cmluZ3xudW1iZXJcIilcbiAqIEBleGFtcGxlIHR1cGxlXG4gKiAgICAgIGNvbnN0IHR1cGxlVW5pb24gPSB0eXBlKFtcInN0cmluZ1wiLCBcInxcIiwgXCJudW1iZXJcIl0pXG4gKiBAZXhhbXBsZSBoZWxwZXJcbiAqICAgICAgY29uc3QgaGVscGVyVW5pb24gPSB1bmlvbihcInN0cmluZ1wiLCBcIm51bWJlclwiKVxuICovIGV4cG9ydCBjb25zdCB1bmlvbiA9IHNjb3Blcy5hcmsudW5pb247XG4vKipcbiAqIEBvcGVyYXRvciB7QGxpbmsgYXJyYXlPZn1cbiAqIEBkb2NnZW5UYWJsZVxuICogQHN0cmluZyBcIlRbXVwiXG4gKiBAdHVwbGUgW1QsIFwiW11cIl1cbiAqIEBoZWxwZXIgYXJyYXlPZihUKVxuICogQGV4YW1wbGUgc3RyaW5nXG4gKiAgICAgIGNvbnN0IG51bWJlckFycmF5ID0gdHlwZShcIm51bWJlcltdXCIpXG4gKiBAZXhhbXBsZSB0dXBsZVxuICogICAgICBjb25zdCB0dXBsZUFycmF5ID0gdHlwZShbXCJudW1iZXJcIiwgXCJbXVwiXSlcbiAqIEBleGFtcGxlIGhlbHBlclxuICogICAgICBjb25zdCBoZWxwZXJBcnJheSA9IGFycmF5T2YoXCJudW1iZXJcIilcbiAqLyBleHBvcnQgY29uc3QgYXJyYXlPZiA9IHNjb3Blcy5hcmsuYXJyYXlPZjtcbi8qKlxuICogQG9wZXJhdG9yIHtAbGluayBrZXlPZn1cbiAqIEBkb2NnZW5UYWJsZVxuICogQHR1cGxlIFwiW1wia2V5T2ZcIiwgVF1cIlxuICogQGhlbHBlciAga2V5T2YoVClcbiAqIEBleGFtcGxlIHR1cGxlXG4gKiAgICAgIGNvbnN0IHR1cGxlS2V5T2YgPSB0eXBlKFtcImtleU9mXCIsIHthOlwic3RyaW5nXCJ9XSlcbiAqIEBleGFtcGxlIGhlbHBlclxuICogICAgICBjb25zdCBoZWxwZXJLZXlPZiA9IGtleU9mKHthOlwic3RyaW5nXCJ9KVxuICovIGV4cG9ydCBjb25zdCBrZXlPZiA9IHNjb3Blcy5hcmsua2V5T2Y7XG4vKipcbiAqIEBvcGVyYXRvciB7QGxpbmsgaW5zdGFuY2VPZn1cbiAqIEBkb2NnZW5UYWJsZVxuICogQHR1cGxlIFtcImluc3RhbmNlT2ZcIiwgVF1cbiAqIEBoZWxwZXIgaW5zdGFuY2VPZihUKVxuICogQGV4YW1wbGUgdHVwbGVcbiAqICAgICAgY29uc3QgdHVwbGVJbnN0YW5jZU9mID0gdHlwZShbXCJpbnN0YW5jZU9mXCIsIERhdGVdKVxuICogQGV4YW1wbGUgaGVscGVyXG4gKiAgICAgIGNvbnN0IGhlbHBlckluc3RhbmNlT2YgPSBpbnN0YW5jZU9mKERhdGUpXG4gKi8gZXhwb3J0IGNvbnN0IGluc3RhbmNlT2YgPSBzY29wZXMuYXJrLmluc3RhbmNlT2Y7XG4vKipcbiAqIEBvcGVyYXRvciB7QGxpbmsgdmFsdWVPZiB8ID09PX1cbiAqIEBkb2NnZW5UYWJsZVxuICogQHR1cGxlIFtcIj09PVwiLCBUXVxuICogQGhlbHBlciB2YWx1ZU9mKFQpXG4gKiBAZXhhbXBsZSB0dXBsZVxuICogICAgICBjb25zdCB0dXBsZVZhbHVlT2YgPSB0eXBlKFtcInZhbHVlT2ZcIiwge2E6XCJzdHJpbmdcIn1dKVxuICogQGV4YW1wbGUgaGVscGVyXG4gKiAgICAgIGNvbnN0IGhlbHBlclZhbHVlT2YgPSB2YWx1ZU9mKHthOlwic3RyaW5nXCJ9KVxuICovIGV4cG9ydCBjb25zdCB2YWx1ZU9mID0gc2NvcGVzLmFyay52YWx1ZU9mO1xuLyoqXG4gKiBAb3BlcmF0b3Ige0BsaW5rIG5hcnJvdyB8ID0+fVxuICogQGRvY2dlblRhYmxlXG4gKiBAdHVwbGUgW1widHlwZVwiLCBcIj0+XCIgLCBjb25kaXRpb25dXG4gKiBAZXhhbXBsZSB0dXBsZVxuICogICAgICBjb25zdCBuYXJyb3cgPSB0eXBlKCBbXCJudW1iZXJcIiwgXCI9PlwiICwgKG4pID0+IG4gJSAyID09PSAwXSlcbiAqIEBleGFtcGxlXG4gKiAgICAgIGNvbnN0IGlzRXZlbiA9ICh4OiB1bmtub3duKTogeCBpcyBudW1iZXIgPT4geCAlIDIgPT09IDBcbiAqLyBleHBvcnQgY29uc3QgbmFycm93ID0gc2NvcGVzLmFyay5uYXJyb3c7XG4vKipcbiAqIEBvcGVyYXRvciB7QGxpbmsgbW9ycGggfCB8Pn1cbiAqIEBkb2NnZW5UYWJsZVxuICogQHR1cGxlIFtpbnB1dFR5cGUsIFwifD5cIiwgKGRhdGEpID0+IG91dHB1dF1cbiAqIEBoZWxwZXIgbW9ycGgoaW5wdXRUeXBlLCAoZGF0YSkgPT4gb3V0cHV0KVxuICogQGV4YW1wbGUgdHVwbGVcbiAqICAgICAgY29uc3QgdHVwbGVNb3JwaCA9IHR5cGUoIFtcInN0cmluZ1wiLCBcInw+XCIgLCAoZGF0YSkgPT4gYG1vcnBoZWQgJHtkYXRhfWBdKVxuICogQGV4YW1wbGUgaGVscGVyXG4gKiAgICAgIGNvbnN0IGhlbHBlck1vcnBoID0gbW9ycGgoXCJzdHJpbmdcIiwgKGRhdGEpID0+IGBtb3JwaGVkICR7ZGF0YX1gKVxuICovIGV4cG9ydCBjb25zdCBtb3JwaCA9IHNjb3Blcy5hcmsubW9ycGg7XG4iXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsb0JBQXNCO0FBQ3RCLFdBQXNCO0FBQ3RCLGdCQUFlO0FBRWYsZUFBMEI7OztBQ0puQixJQUFNLHVCQUFOLGNBQW1DLE1BQU07QUFDaEQ7QUFDTyxJQUFNLHFCQUFxQixDQUFDLFlBQVU7QUFDekMsUUFBTSxJQUFJLHFCQUFxQixPQUFPO0FBQzFDO0FBQ08sSUFBTSxhQUFOLGNBQXlCLE1BQU07QUFDdEM7QUFDTyxJQUFNLGtCQUFrQixDQUFDLFlBQVU7QUFDdEMsUUFBTSxJQUFJLFdBQVcsT0FBTztBQUNoQzs7O0FDVE8sSUFBTSxZQUFZLENBQUMsTUFBTSxXQUFTLFNBQVMsSUFBSSxNQUFNO0FBQ3JELElBQU0sV0FBVyxDQUFDLFNBQU87QUFDNUIsUUFBTSxjQUFjLE9BQU87QUFDM0IsU0FBTyxnQkFBZ0IsV0FBVyxTQUFTLE9BQU8sU0FBUyxXQUFXLGdCQUFnQixhQUFhLFdBQVc7QUFDbEg7QUFDc0UsSUFBTSxxQkFBcUI7QUFBQSxFQUM3RixRQUFRO0FBQUEsRUFDUixTQUFTO0FB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QUs7QUFBQSxJQUNEO0FBQUEsSUFDQTtBQUFBLEVBQ0o7QUFBQSxFQUNBLFFBQVE7QUFBQSxJQUNKO0FBQUEsSUFDQTtBQUFBLE1BQ0ksUUFBUTtBQUFBLElBQ1o7QUFBQSxFQUNKO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDTDtBQUFBLElBQ0E7QUFBQSxNQUNJLFNBQVM7QUFBQSxJQUNiO0FBQUEsRUFDSjtBQUFBLEVBQ0EsT0FBTztBQUFBLElBQ0g7QUFBQSxJQUNBO0FBQUEsTUFDSSxTQUFTO0FBQUEsUUFDTCxPQUFPO0FBQUEsTUFDWDtBQUFBLElBQ0o7QUFBQSxFQUNKO0FBQUEsRUFDQSxPQUFPO0FBQUEsSUFDSDtBQUFBLElBQ0EsQ0FBQztBQUFBLEVBQ0w7QUFBQSxFQUNBLE1BQU07QUFBQSxJQUNGO0FBQUEsSUFDQTtBQUFBLE1BQ0ksTUFBTTtBQUFBLElBQ1Y7QUFBQSxFQUNKO0FBQUEsRUFDQSxRQUFRO0FBQUEsSUFDSjtBQUFBLElBQ0E7QUFBQSxNQUNJLFFBQVE7QUFBQSxJQUNaO0FBQUEsRUFDSjtBQUFBLEVBQ0EsUUFBUTtBQUFBLElBQ0o7QUFBQSxJQUNBO0FBQUEsTUFDSSxRQUFRO0FBQUEsSUFDWjtBQUFBLEVBQ0o7QUFBQSxFQUNBLFFBQVE7QUFBQSxJQUNKO0FBQUEsSUFDQTtBQUFBLE1BQ0ksUUFBUTtBQUFBLElBQ1o7QUFBQSxFQUNKO0FBQUEsRUFDQSxRQUFRO0FBQUEsSUFDSjtBQUFBLElBQ0E7QUFBQSxNQUNJLFFBQVE7QUFBQSxJQUNaO0FBQUEsRUFDSjtBQUFBLEVBQ0EsTUFBTTtBQUFBLElBQ0Y7QUFBQSxJQUNBO0FBQUEsTUFDSSxTQUFTO0FBQUEsUUFDTCxPQUFPO0FBQUEsTUFDWDtBQUFBLElBQ0o7QUFBQSxFQUNKO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDTDtBQUFBLElBQ0E7QUFBQSxFQUNKO0FBQUEsRUFDQSxNQUFNO0FBQUEsSUFDRjtBQUFBLElBQ0E7QUFBQSxNQUNJLFdBQVc7QUFBQSxJQUNmO0FBQUEsRUFDSjtBQUFBLEVBQ0EsV0FBVztBQUFBLElB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LFFBQU0sb0JBQW9CLG9CQUFJLElBQTRCO0FBRTFELGFBQVcsT0FBTyxTQUFTLE1BQU07QUFDL0IsUUFBSSxDQUFDLGtCQUFrQixJQUFJLElBQUksU0FBUyxHQUFHO0FBQ3pDLHdCQUFrQixJQUFJLElBQUksV0FBVyxDQUFDLENBQUM7QUFBQSxJQUN6QztBQUNBLHNCQUFrQixJQUFJLElBQUksU0FBUyxFQUFHLEtBQUssR0FBRztBQUFBLEVBQ2hEO0FBRUEsYUFBVyxDQUFDLE1BQU0sS0FBSyxLQUFLLE9BQU8sUUFBUSxJQUFJLEdBQUc7QUFDaEQsY0FBQUEsUUFBRyxjQUFjLFdBQVcsTUFBTSxnQkFBZ0IsS0FBSyxVQUFVO0FBQUEsTUFDL0QsSUFBSTtBQUFBLE1BQ0o7QUFBQSxNQUNBLFVBQVUsa0JBQWtCLElBQUksTUFBTSxHQUFHLEtBQUssQ0FBQztBQUFBLElBQ2pELEdBQUcsTUFBTSxDQUFDLEdBQUcsRUFBQyxVQUFVLFFBQU8sQ0FBQztBQUFBLEVBQ2xDO0FBQ0Y7IiwKICAibmFtZXMiOiBbImFjdGlvbiIsICJ0eXBlIiwgImdyZWF0ZXN0Q29tbW9uRGl2aXNvciIsICJfZGVmaW5lUHJvcGVydHkiLCAibmFycm93IiwgInBhaXJzIiwgIm1vcnBoIiwgImkiLCAidHlwZSIsICJ0eXBlIiwgIl9kZWZpbmVQcm9wZXJ0eSIsICJTY2FubmVyIiwgIl9jaGVja1ByaXZhdGVSZWRlY2xhcmF0aW9uIiwgIl9jbGFzc0FwcGx5RGVzY3JpcHRvckdldCIsICJfY2xhc3NBcHBseURlc2NyaXB0b3JTZXQiLCAiX2NsYXNzRXh0cmFjdEZpZWxkRGVzY3JpcHRvciIsICJhY3Rpb24iLCAiX2NsYXNzUHJpdmF0ZUZpZWxkR2V0IiwgIl9jbGFzc1ByaXZhdGVGaWVsZEluaXQiLCAiX2NsYXNzUHJpdmF0ZUZpZWxkU2V0IiwgIl9kZWZpbmVQcm9wZXJ0eSIsICJfY2hlY2tQcml2YXRlUmVkZWNsYXJhdGlvbiIsICJfY2xhc3NBcHBseURlc2NyaXB0b3JHZXQiLCAiX2NsYXNzQXBwbHlEZXNjcmlwdG9yU2V0IiwgIl9jbGFzc0V4dHJhY3RGaWVsZERlc2NyaXB0b3IiLCAiYWN0aW9uIiwgIl9jbGFzc1ByaXZhdGVGaWVsZEdldCIsICJfY2xhc3NQcml2YXRlRmllbGRJbml0IiwgIl9jbGFzc1ByaXZhdGVGaWVsZFNldCIsICJfZGVmaW5lUHJvcGVydHkiLCAiaWQiLCAidHlwZSIsICJuYXJyb3ciLCAibW9ycGgiLCAic2NvcGUiLCAibW9ycGgiLCAic2NvcGUiLCAiaXNPcHRpb25hbCIsICJfZGVmaW5lUHJvcGVydHkiLCAiX2RlZmluZVByb3BlcnR5IiwgIl9jaGVja1ByaXZhdGVSZWRlY2xhcmF0aW9uIiwgIl9jbGFzc0FwcGx5RGVzY3JpcHRvckdldCIsICJfY2xhc3NBcHBseURlc2NyaXB0b3JTZXQiLCAiX2NsYXNzRXh0cmFjdEZpZWxkRGVzY3JpcHRvciIsICJhY3Rpb24iLCAiX2NsYXNzUHJpdmF0ZUZpZWxkR2V0IiwgIl9jbGFzc1ByaXZhdGVGaWVsZEluaXQiLCAiX2NsYXNzUHJpdmF0ZUZpZWxkU2V0IiwgIl9kZWZpbmVQcm9wZXJ0eSIsICJpZCIsICJfY2xhc3NQcml2YXRlRmllbGRHZXQiLCAiX2RlZmluZVByb3BlcnR5IiwgIl9jbGFzc1ByaXZhdGVGaWVsZEluaXQiLCAiX2NsYXNzUHJpdmF0ZUZpZWxkU2V0IiwgIm9wdHMiLCAidHlwZSIsICJmcyJdCn0K
