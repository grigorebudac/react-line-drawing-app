export function getParamFromUrl(property: string) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(property) as string | undefined;
}

export function appendParamToUrl(property: string, value: string) {
  const urlParams = new URLSearchParams(window.location.search);
  urlParams.delete(property);
  urlParams.append(property, value);

  window.location.search = urlParams.toString();
}

export function appendParamToUrlIfNotExists(property: string, value: string) {
  const paramValue = getParamFromUrl(property);

  if (paramValue == null) {
    appendParamToUrl(property, value);
  }
}
