import {
  Dictionary,
  ActionMethod,
  Action,
  ActionHandler,
  ActionTree,
  ActionObject,
  mapActions,
  Store
} from "vuex";
import { keyOf } from "../utils/keyof";

type ActionPayload<A extends ActionHandler<any, any>> = A extends (
  this: Store<any>,
  injectee: any,
  payload?: undefined | null
) => any
  ? undefined
  : A extends (this: Store<any>, injectee: any, payload?: infer P) => any
  ? P | undefined
  : A extends (this: Store<any>, injectee: any, payload: infer R) => any
  ? NonNullable<R>
  : undefined;

type PickupPayloadWithParams<A extends ActionHandler<any, any>> = ActionPayload<
  A
> extends NonNullable<ActionPayload<A>>
  ? (payload: ActionPayload<A>) => ReturnType<A>
  : (payload?: NonNullable<ActionPayload<A>>) => ReturnType<A>;

type PickupPayload<A extends ActionHandler<any, any>> = NonNullable<
  ActionPayload<A>
> extends never
  ? () => ReturnType<A>
  : PickupPayloadWithParams<A>;

type ActionHandlerMapper<A extends Action<any, any>> = A extends ActionHandler<
  any,
  any
>
  ? PickupPayload<A>
  : PickupPayload<ActionObject<any, any>["handler"]>;

type MappedActions<A extends ActionTree<any, any>> = {
  [P in keyof A]: ActionHandlerMapper<A[P]>
};

const actionMapper = <A extends ActionTree<any, any>, K extends keyof A>(
  _actions: A,
  map: K[]
) => mapActions(map as string[]) as MappedActions<A>;
const actionMapperWithNamespace = <
  A extends ActionTree<any, any>,
  K extends keyof A
>(
  _actions: A,
  namespace: string,
  map: K[]
) => mapActions(namespace, map as string[]) as MappedActions<A>;

export interface ActionsMapper<A extends ActionTree<any, any>> {
  <K extends keyof A>(map: K[]): MappedActions<Pick<A, K>>;
  <K extends keyof A>(namespace: string, map: K[]): MappedActions<Pick<A, K>>;
  (): MappedActions<A>;
  (namespace: string): MappedActions<A>;
}
export const mapActionsWithType = <A extends ActionTree<any, any>>(
  actions: A
): ActionsMapper<A> => <K extends keyof A>(
  ...args: [K[]] | [string, K[]] | [string] | []
) => {
  if (!args.length) {
    return actionMapper(actions, keyOf(actions));
  }

  const isNamespaceOnly = (
    val: [K[]] | [string, K[]] | [string] | []
  ): val is [string] => val.length === 1 && typeof val[0] === "string";
  if (isNamespaceOnly(args)) {
    return actionMapperWithNamespace(actions, args[0], keyOf(actions));
  }

  const isWithNamespace = (val: [K[]] | [string, K[]]): val is [string, K[]] =>
    typeof val[0] === "string";
  if (isWithNamespace(args)) {
    const [namespace, map] = args;
    return actionMapperWithNamespace(actions, namespace, map);
  }

  const [map] = args;
  return actionMapper(actions, map);
};
