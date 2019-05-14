import {
  Dictionary,
  ActionMethod,
  Action,
  ActionHandler,
  ActionTree,
  Module,
  MutationTree,
  GetterTree,
  ActionObject,
  mapActions
} from "vuex";

type PickupPayload<T extends (...args: any) => any> = (
  payload: Parameters<T>[1]
) => ReturnType<T>;

type ActionHandlerMapper<A extends Action<any, any>> = A extends ActionHandler<
  any,
  any
>
  ? PickupPayload<A>
  : PickupPayload<ActionObject<any, any>["handler"]>;

type MappedActions<A extends ActionTree<any, any>> = Dictionary<ActionMethod> &
  { [P in keyof A]: ActionHandlerMapper<A[P]> };

const actionMapper = <A extends ActionTree<any, any>, K extends keyof A>(
  map: K[]
) => mapActions(map as string[]) as MappedActions<A>;
const actionMapperWithNamespace = <A extends ActionTree<any, any>, K extends keyof A>(
  namespace: string,
  map: K[]
) => mapActions(namespace, map as string[]) as MappedActions<A>;

interface ActionsMapper<A extends ActionTree<any, any>> {
  <K extends keyof A>(map: K[]): MappedActions<Pick<A, K>>;
  <K extends keyof A>(namespace: string, map: K[]): MappedActions<Pick<A, K>>;
}
export const mapActionsWithType = <A extends ActionTree<any, any>>(
): ActionsMapper<A> => <K extends keyof A>(
  ...args: [K[]] | [string, K[]]
): MappedActions<Pick<A, K>> => {
  const isWithNamespace = (val: [K[]] | [string, K[]]): val is [string, K[]] =>
    typeof val[0] === "string";
  if (isWithNamespace(args)) {
    const [namespace, map] = args;
    return actionMapperWithNamespace<A, K>(namespace, map);
  }

  const [map] = args;
  return actionMapper<A, K>(map);
};

const state = {
  test: "test",
  testNum: 1
};

interface FullyTypedModuleDefinition<
  S,
  R,
  A extends ActionTree<S, R> = {},
  M extends MutationTree<S> = {},
  G extends GetterTree<S, R> = {}
> extends Module<S, R> {
  actions?: A;
  mutations?: M;
  getters?: G;
}

interface FullyTypedModule<
  S,
  R,
  A extends ActionTree<S, R> = {},
  M extends MutationTree<S> = {},
  G extends GetterTree<S, R> = {}
> extends Module<S, R> {
  actions: A;
  mutations: M;
  getters: G;
}

const buildModule = <
  S,
  R,
  A extends ActionTree<S, R> = {},
  M extends MutationTree<S> = {},
  G extends GetterTree<S, R> = {}
>(
  mod: FullyTypedModuleDefinition<S, R, A, M, G>
): FullyTypedModule<S, R, A, M, G> => ({
  actions: {} as A,
  mutations: {} as M,
  getters: {} as G,
  ...mod
});
