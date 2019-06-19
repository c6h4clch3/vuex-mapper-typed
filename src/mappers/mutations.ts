import {
  MutationTree,
  Mutation,
  Dictionary,
  MutationMethod,
  mapMutations
} from "vuex";
import { keyOf } from "../utils/keyof";

type PickupPayload<M extends Mutation<any>> = (
  payload: Parameters<M>[1]
) => ReturnType<M>;

type MappedMutation<M extends MutationTree<any>> = Dictionary<MutationMethod> &
  { [P in keyof M]: PickupPayload<M[P]> };

const mutationMapper = <M extends MutationTree<any>, K extends keyof M>(
  _mutations: M,
  map: K[]
) => mapMutations(map as string[]) as MappedMutation<M>;
const mutationMapperWithNamespace = <
  M extends MutationTree<any>,
  K extends keyof M
>(
  _mutations: M,
  namespace: string,
  map: K[]
) => mapMutations(namespace, map as string[]) as MappedMutation<M>;

export interface MutationsMapper<M extends MutationTree<any>> {
  <K extends keyof M>(map: K[]): MappedMutation<Pick<M, K>>;
  <K extends keyof M>(namespace: string, map: K[]): MappedMutation<Pick<M, K>>;
  (): MappedMutation<M>;
  (namespace: string): MappedMutation<M>;
}
export const mapMutationsWithType = <M extends MutationTree<any>>(
  mutations: M
): MutationsMapper<M> => <K extends keyof M>(
  ...args: [K[]] | [string, K[]] | [string] | []
) => {
  if (!args.length) {
    return mutationMapper(mutations, keyOf(mutations));
  }

  const isNamespaceOnly = (
    val: [K[]] | [string, K[]] | [string] | []
  ): val is [string] => val.length === 1 && typeof val[0] === "string";
  if (isNamespaceOnly(args)) {
    return mutationMapperWithNamespace(mutations, args[0], keyOf(mutations));
  }

  const isWithNamespace = (val: [K[]] | [string, K[]]): val is [string, K[]] =>
    typeof val[0] === "string";
  if (isWithNamespace(args)) {
    const [namespace, map] = args;
    return mutationMapperWithNamespace(mutations, namespace, map);
  }

  const [map] = args;
  return mutationMapper(mutations, map);
};
