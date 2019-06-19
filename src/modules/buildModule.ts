import { ActionTree, Module, MutationTree, GetterTree } from "vuex";
import { State } from "../definitions";

interface FullyTypedModuleDefinition<
  S,
  R,
  A extends ActionTree<S, R> = {},
  M extends MutationTree<S> = {},
  G extends GetterTree<S, R> = {}
> extends Module<S, R> {
  state?: State<S>;
  actions?: A;
  mutations?: M;
  getters?: G;
}

export interface FullyTypedModule<
  S,
  R,
  A extends ActionTree<S, R> = {},
  M extends MutationTree<S> = {},
  G extends GetterTree<S, R> = {}
> extends Module<S, R> {
  state: State<S>;
  actions: A;
  mutations: M;
  getters: G;
}

/**
 * Defines fully-typed Vuex module.
 *
 * @param mod definition of Vuex module
 */
export const buildModule = <
  S,
  R,
  A extends ActionTree<S, R> = ActionTree<S, R>,
  M extends MutationTree<S> = MutationTree<S>,
  G extends GetterTree<S, R> = GetterTree<S, R>
>(
  mod: FullyTypedModuleDefinition<S, R, A, M, G>
): FullyTypedModule<S, R, A, M, G> => ({
  state: {} as State<S>,
  actions: {} as A,
  mutations: {} as M,
  getters: {} as G,
  ...mod
});
