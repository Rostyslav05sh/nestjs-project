export class TransformHelper {
  public static uniqueItems({ value }) {
    return value ? Array.from(new Set(value)) : value;
  }

  public static trim({ value }) {
    return value ? value.trim() : value;
  }

  public static trimArray({ value }) {
    return value ? value.map((item) => item.trim()) : value;
  }

  public static toLowerCase({ value }) {
    return value ? value.toLowerCase() : value;
  }

  public static toLowerCaseArray({ value }) {
    return value ? value.map((item) => item.toLowerCase()) : value;
  }
}
