import { Dictionary, Computed, mapGetters, GetterTree } from "vuex";

type MappedGetters<G extends GetterTree<any, any>> = Dictionary<Computed> &
  { [P in keyof G]: G[P] };

const getterMapper = <G extends GetterTree<any, any>, K extends keyof G>(
  map: K[]
) => mapGetters(map as string[]) as MappedGetters<Pick<G, K>>;
const getterMapperWithNamespace = <
  G extends GetterTree<any, any>,
  K extends keyof G
>(
  namespace: string,
  map: K[]
) => mapGetters(namespace, map as string[]) as MappedGetters<Pick<G, K>>;

export interface GettersMapper<G extends GetterTree<any, any>> {
  <K extends keyof G>(map: K[]): MappedGetters<Pick<G, K>>;
  <K extends keyof G>(namespace: string, map: K[]): MappedGetters<Pick<G, K>>;
}
export const mapGettersWithType = <
  G extends GetterTree<any, any>
>(): GettersMapper<G> => <K extends keyof G>(
  ...args: [K[]] | [string, K[]]
) => {
  const isWithNamespace = (val: [K[]] | [string, K[]]): val is [string, K[]] =>
    typeof val[0] === "string";
  if (isWithNamespace(args)) {
    const [namespace, map] = args;
    return getterMapperWithNamespace<G, K>(namespace, map);
  }

  const [map] = args;
  return getterMapper<G, K>(map);
};
