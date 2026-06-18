const emptyBrand = {
  name: "",
  tagline: "",
  email: "",
  phone: "",
  website: ""
};

const emptyMeta = {
  quoteId: "",
  issuedDate: ""
};

const emptyClient = {
  name: "",
  email: "",
  company: "",
  phone: ""
};

const emptyProject = {
  title: "",
  description: "",
  validUntil: "",
  currency: ""
};

const toObject = (value) => value && typeof value === "object" && !Array.isArray(value) ? value : {};

const toNumber = (value) => {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
};

const pickStrings = (value, defaults) => {
  const source = toObject(value);
  return Object.keys(defaults).reduce((result, key) => {
    result[key] = source[key] == null ? "" : String(source[key]);
    return result;
  }, {});
};

const normalizeService = (service, includeSelected) => {
  const source = toObject(service);
  const normalized = {
    id: source.id == null ? "" : source.id,
    name: source.name == null ? "" : String(source.name),
    price: toNumber(source.price),
    quantity: toNumber(source.quantity)
  };

  if (includeSelected) {
    normalized.selected = Boolean(source.selected);
  }

  return normalized;
};

export const serializeQuote = (state) => {
  const source = toObject(state);

  return {
    brand: pickStrings(source.brand, emptyBrand),
    meta: pickStrings(source.meta, emptyMeta),
    client: pickStrings(source.client, emptyClient),
    project: pickStrings(source.project, emptyProject),
    services: Array.isArray(source.services) ? source.services.map((service) => normalizeService(service, true)) : [],
    customServices: Array.isArray(source.customServices) ? source.customServices.map((service) => normalizeService(service, false)) : [],
    template: source.template === "statement" ? "statement" : "ledger",
    notes: source.notes == null ? "" : String(source.notes),
    taxRate: toNumber(source.taxRate),
    discount: toNumber(source.discount)
  };
};

export const quoteToJsonString = (state) => JSON.stringify(serializeQuote(state), null, 2);

export const parseQuoteJson = (text) => {
  let parsed;

  try {
    parsed = JSON.parse(text);
  } catch {
    return { ok: false, error: "Invalid JSON syntax" };
  }

  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    return { ok: false, error: "Quote JSON must be an object" };
  }

  if (parsed.client !== undefined && (!parsed.client || typeof parsed.client !== "object" || Array.isArray(parsed.client))) {
    return { ok: false, error: "client must be an object" };
  }

  if (parsed.project !== undefined && (!parsed.project || typeof parsed.project !== "object" || Array.isArray(parsed.project))) {
    return { ok: false, error: "project must be an object" };
  }

  if (parsed.brand !== undefined && (!parsed.brand || typeof parsed.brand !== "object" || Array.isArray(parsed.brand))) {
    return { ok: false, error: "brand must be an object" };
  }

  if (parsed.meta !== undefined && (!parsed.meta || typeof parsed.meta !== "object" || Array.isArray(parsed.meta))) {
    return { ok: false, error: "meta must be an object" };
  }

  if (parsed.services !== undefined && !Array.isArray(parsed.services)) {
    return { ok: false, error: "services must be an array" };
  }

  if (parsed.customServices !== undefined && !Array.isArray(parsed.customServices)) {
    return { ok: false, error: "customServices must be an array" };
  }

  return { ok: true, data: serializeQuote(parsed) };
};

export const formatJsonString = (text) => {
  try {
    return { ok: true, formatted: JSON.stringify(JSON.parse(text), null, 2) };
  } catch {
    return { ok: false, error: "Invalid JSON syntax" };
  }
};

export const downloadJson = (text, filename) => {
  if (typeof document === "undefined") {
    return;
  }

  const blob = new Blob([text], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");

  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
};
