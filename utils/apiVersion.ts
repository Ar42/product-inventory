export enum ApiVersion {
  V1 = "v1",
}

export const versioningApiUrl = ({
  version,
  endpoint,
}: {
  version: ApiVersion;
  endpoint: string;
}) => `https://api.escuelajs.co/api/${version}/${endpoint}`;
