import {
  Dictionary,
  ActionMethod,
  Action,
  ActionHandler,
  ActionTree,
  ActionObject,
  mapActions
} from "vuex";

type PickupPayload<A extends ActionHandler<any, any>> = (
  payload: Parameters<A>[1]
) => ReturnType<A>;

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
const actionMapperWithNamespace = <
  A extends ActionTree<any, any>,
  K extends keyof A
>(
  namespace: string,
  map: K[]
) => mapActions(namespace, map as string[]) as MappedActions<A>;

interface ActionsMapper<A extends ActionTree<any, any>> {
  <K extends keyof A>(map: K[]): MappedActions<Pick<A, K>>;
  <K extends keyof A>(namespace: string, map: K[]): MappedActions<Pick<A, K>>;
}
export const mapActionsWithType = <
  A extends ActionTree<any, any>
>(): ActionsMapper<A> => <K extends keyof A>(
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
