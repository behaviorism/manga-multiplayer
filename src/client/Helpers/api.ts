export const apiCall = async (
  path: string,
  query?: { [key: string]: string }
) => {
  const response = await fetch(
    `/api${path}${query ? `?${new URLSearchParams(query).toString()}` : ""}`
  );

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.error);
  }

  return json;
};
