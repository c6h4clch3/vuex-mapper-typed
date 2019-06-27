import { Dictionary, Computed, mapGetters, GetterTree } from "vuex";
import { keyOf } from "../utils/keyof";

type MappedGetters<G extends GetterTree<any, any>> = Dictionary<Computed> &
  { [P in keyof G]: () => ReturnType<G[P]> };

const getterMapper = <G extends GetterTree<any, any>, K extends keyof G>(
  _getters: G,
  map: K[]
) => mapGetters(map as string[]) as MappedGetters<G>;
const getterMapperWithNamespace = <
  G extends GetterTree<any, any>,
  K extends keyof G
>(
  _getters: G,
  namespace: string,
  map: K[]
) => mapGetters(namespace, map as string[]) as MappedGetters<G>;

export interface GettersMapper<G extends GetterTree<any, any>> {
  <K extends keyof G>(map: K[]): MappedGetters<Pick<G, K>>;
  <K extends keyof G>(namespace: string, map: K[]): MappedGetters<Pick<G, K>>;
  (): MappedGetters<Pick<G, keyof G>>;
  (namespace: string): MappedGetters<G>;
}
export const mapGettersWithType = <G extends GetterTree<any, any>>(
  getters: G
): GettersMapper<G> => <K extends keyof G>(
  ...args: [K[]] | [string, K[]] | [string] | []
) => {
  if (!args.length) {
    return getterMapper(getters, keyOf(getters));
  }

  const isNamespaceOnly = (
    val: [K[]] | [string, K[]] | [string] | []
  ): val is [string] => val.length === 1 && typeof val[0] === "string";
  if (isNamespaceOnly(args)) {
    return getterMapperWithNamespace(getters, args[0], keyOf(getters));
  }

  const isWithNamespace = (val: [K[]] | [string, K[]]): val is [string, K[]] =>
    typeof val[0] === "string";
  if (isWithNamespace(args)) {
    const [namespace, map] = args;
    return getterMapperWithNamespace(getters, namespace, map);
  }

  const [map] = args;
  return getterMapper(getters, map);
};
