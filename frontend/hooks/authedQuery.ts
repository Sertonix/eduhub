import { useQuery } from "@apollo/client";
import { useKeycloak } from "@react-keycloak/ssr";
import { KeycloakInstance } from "keycloak-js";

export const useAuthedQuery: typeof useQuery = (query, passedOptions) => {
  const { keycloak } = useKeycloak<KeycloakInstance>();

  const token = keycloak?.token;

  const options = token
    ? {
        ...passedOptions,
        context: {
          ...passedOptions?.context,
          headers: {
            ...passedOptions?.context?.headers,
            Authorization: "Bearer " + token,
          },
        },
      }
    : passedOptions;

  return useQuery(query, options);
};