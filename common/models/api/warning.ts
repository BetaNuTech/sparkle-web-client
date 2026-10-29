// A non-fatal warning returned by the API
// alongside a successful response under `meta.warnings`
export default interface apiWarning {
  id?: string;
  type?: string;
  title: string;
  detail: string;
} // eslint-disable-line
