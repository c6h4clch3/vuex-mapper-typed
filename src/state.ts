import { Dictionary, Computed, mapState } from "vuex";

type MappedState<S> = Dictionary<Computed> & { [P in keyof S]: () => S[P] };

const stateMapper = <S, K extends keyof S>(map: K[]) =>
  mapState(map as string[]) as MappedState<Pick<S, K>>;
const stateMapperWithNamespace = <S, K extends keyof S>(
  namespace: string,
  map: K[]
) => mapState(namespace, map as string[]) as MappedState<Pick<S, K>>;

interface StateMapper<State> {
  <Key extends keyof State>(map: Key[]): MappedState<Pick<State, Key>>;
  <Key extends keyof State>(namespace: string, map: Key[]): MappedState<
    Pick<State, Key>
  >;
}

export const mapStateWithType = <S>(
): StateMapper<S> => <K extends keyof S>(
  ...args: [K[]] | [string, K[]]
): MappedState<Pick<S, K>> => {
  const isWithNamespace = (val: [K[]] | [string, K[]]): val is [string, K[]] =>
    typeof val[0] === "string";
  if (isWithNamespace(args)) {
    const [namespace, map] = args;
    return stateMapperWithNamespace<S, K>(namespace, map);
  }

  const [map] = args;
  return stateMapper<S, K>(map);
};
