import {
  Dictionary,
  Computed,
  ActionMethod,
  Action,
  ActionHandler,
  ActionTree,
  mapState,
  Module
} from "vuex";

type ArrayLike<T> = T[] | ReadonlyArray<T>;

type MappedState<S> = Dictionary<Computed> & { [P in keyof S]: () => S[P] };

type PickupPayload<T extends (...args: any) => any> = (
  args: Parameters<T>[1]
) => ReturnType<T>;

type ActionHandlerMapper<
  A extends Action<S, R>,
  S = {},
  R = {}
> = A extends ActionHandler<S, R>
  ? PickupPayload<A>
  : PickupPayload<Exclude<A, ActionHandler<S, R>>["handler"]>;

type MappedActions<A extends ActionTree<S, R>, S = {}, R = {}> = Dictionary<
  ActionMethod
> &
  { [P in keyof A]: ActionHandlerMapper<A[P], S, R> };

interface StateMapper {
  <S, K extends keyof S>(map: K[]): MappedState<Pick<S, K>>;
}

interface StateMapperWithNamespace {
  <S, K extends keyof S>(namespace: string, map: K[]): MappedState<Pick<S, K>>;
}

type StateMapperFunc = StateMapper & StateMapperWithNamespace;

const stateMapper = <S, K extends keyof S>(map: K[]) =>
  mapState(map as string[]) as MappedState<Pick<S, K>>;
const stateMapperWithNamespace = <S, K extends keyof S>(
  namespace: string,
  map: K[]
) => mapState(namespace, map as string[]) as MappedState<Pick<S, K>>;

export const mapStateWithType = <S, R = {}>(_: Module<S, R>) => <
  K extends keyof S
>(
  ...args: [K[]] | [string, K[]]
) => {
  const isWithNamespace = (val: [K[]] | [string, K[]]): val is [string, K[]] =>
    typeof val[0] === "string";
  if (isWithNamespace(args)) {
    const [namespace, map] = args;
    return stateMapperWithNamespace<S, K>(namespace, map);
  }

  const [map] = args;
  return stateMapper<S, K>(map);
};

const state = {
  test: "test",
  testNum: 1
};

const actions = {
  fetchTest: async () => console.log("actions")
};

const modules = <Module<typeof state, {}>>{
  state
};

const mapper = mapStateWithType(modules);
const mapped = mapper(["test"]);
