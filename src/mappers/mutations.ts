import { MutationTree, Mutation, mapMutations } from "vuex";
import { keyOf } from "../utils/keyof";

export type MutationPayload<M extends Mutation<any>> = M extends (
  state: any,
  payload?: undefined | null
) => any
  ? undefined
  : M extends (state: any, payload?: infer P) => any
  ? P | undefined
  : M extends (state: any, payload: infer R) => any
  ? NonNullable<R>
  : undefined;

type PickupPayloadWithParams<M extends Mutation<any>> = MutationPayload<
  M
> extends NonNullable<MutationPayload<M>>
  ? (payload: MutationPayload<M>) => ReturnType<M>
  : (payload?: NonNullable<MutationPayload<M>>) => ReturnType<M>;

type PickupPayload<M extends Mutation<any>> = NonNullable<
  MutationPayload<M>
> extends never
  ? () => ReturnType<M>
  : PickupPayloadWithParams<M>;

type MappedMutation<M extends MutationTree<any>> = {
  [P in keyof M]: PickupPayload<M[P]>
};

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
