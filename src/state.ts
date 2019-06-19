import { Dictionary, Computed, mapState } from "vuex";
import { keyOf } from "./utils/keyof";

type MappedState<S> = Dictionary<Computed> & { [P in keyof S]: () => S[P] };

const stateMapper = <S, K extends keyof S>(_state: S, map: K[]) =>
  mapState(map as string[]) as MappedState<S>;
const stateMapperWithNamespace = <S, K extends keyof S>(
  _state: S,
  namespace: string,
  map: K[]
) => mapState(namespace, map as string[]) as MappedState<S>;

export interface StateMapper<State> {
  <Key extends keyof State>(map: Key[]): MappedState<Pick<State, Key>>;
  <Key extends keyof State>(namespace: string, map: Key[]): MappedState<
    Pick<State, Key>
  >;
  (): MappedState<State>;
  (namespace: string): MappedState<State>;
}

export const mapStateWithType = <S>(state: S): StateMapper<S> => <
  K extends keyof S
>(
  ...args: [K[]] | [string, K[]] | [string] | []
) => {
  if (!args.length) {
    return stateMapper(state, keyOf(state));
  }

  const isNamespaceOnly = (
    val: [K[]] | [string, K[]] | [string] | []
  ): val is [string] => val.length === 1 && typeof val[0] === "string";
  if (isNamespaceOnly(args)) {
    return stateMapperWithNamespace(state, args[0], keyOf(state));
  }

  const isWithNamespace = (val: [K[]] | [string, K[]]): val is [string, K[]] =>
    typeof val[0] === "string";
  if (isWithNamespace(args)) {
    const [namespace, map] = args;
    return stateMapperWithNamespace(state, namespace, map);
  }

  const [map] = args;
  return stateMapper(state, map);
};
