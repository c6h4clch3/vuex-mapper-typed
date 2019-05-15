import {
  MutationTree,
  Mutation,
  Dictionary,
  MutationMethod,
  mapMutations
} from "vuex";

type PickupPayload<M extends Mutation<any>> = (
  payload: Parameters<M>[1]
) => ReturnType<M>;

type MappedMutation<M extends MutationTree<any>> = Dictionary<MutationMethod> &
  { [P in keyof M]: PickupPayload<M[P]> };

const mutationMapper = <M extends MutationTree<any>, K extends keyof M>(
  map: K[]
) => mapMutations(map as string[]) as MappedMutation<Pick<M, K>>;
const mutationMapperWithNamespace = <
  M extends MutationTree<any>,
  K extends keyof M
>(
  namespace: string,
  map: K[]
) => mapMutations(namespace, map as string[]) as MappedMutation<Pick<M, K>>;

export interface MutationsMapper<M extends MutationTree<any>> {
  <K extends keyof M>(map: K[]): MappedMutation<Pick<M, K>>;
  <K extends keyof M>(namespace: string, map: K[]): MappedMutation<Pick<M, K>>;
}
export const mapMutationsWithType = <
  M extends MutationTree<any>
>(): MutationsMapper<M> => <K extends keyof M>(
  ...args: [K[]] | [string, K[]]
) => {
  const isWithNamespace = (val: [K[]] | [string, K[]]): val is [string, K[]] =>
    typeof val[0] === "string";
  if (isWithNamespace(args)) {
    const [namespace, map] = args;
    return mutationMapperWithNamespace<M, K>(namespace, map);
  }

  const [map] = args;
  return mutationMapper<M, K>(map);
};
