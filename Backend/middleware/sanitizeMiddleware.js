// Recursive sanitizer to strip script tags and harmful HTML characters
function sanitizeValue(value) {
  if (typeof value === "string") {
    return value
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
      .trim();
  }
  if (Array.isArray(value)) {
    return value.map(sanitizeValue);
  }
  if (value !== null && typeof value === "object") {
    const cleaned = {};
    for (const key of Object.keys(value)) {
      cleaned[key] = sanitizeValue(value[key]);
    }
    return cleaned;
  }
  return value;
}

export const xssSanitize = (req, res, next) => {
  if (req.body) {
    req.body = sanitizeValue(req.body);
  }
  if (req.params) {
    req.params = sanitizeValue(req.params);
  }
  next();
};

// Express 5 compatible NoSQL injection sanitizer
function sanitizeNoSqlObject(obj) {
  if (Array.isArray(obj)) {
    obj.forEach(sanitizeNoSqlObject);
  } else if (obj !== null && typeof obj === "object") {
    for (const key of Object.keys(obj)) {
      if (key.startsWith("$") || key.includes(".")) {
        delete obj[key];
      } else {
        sanitizeNoSqlObject(obj[key]);
      }
    }
  }
}

export const mongoSanitizeMiddleware = (req, res, next) => {
  if (req.body) {
    sanitizeNoSqlObject(req.body);
  }
  if (req.params) {
    sanitizeNoSqlObject(req.params);
  }
  if (req.query && typeof req.query === "object") {
    for (const key of Object.keys(req.query)) {
      if (key.startsWith("$") || key.includes(".")) {
        delete req.query[key];
      }
    }
  }
  next();
};
