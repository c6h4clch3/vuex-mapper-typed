import { ActionTree, Module, MutationTree, GetterTree } from "vuex";

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

export interface FullyTypedModule<
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

export const buildModule = <
  S,
  R,
  A extends ActionTree<S, R> = ActionTree<S, R>,
  M extends MutationTree<S> = MutationTree<S>,
  G extends GetterTree<S, R> = GetterTree<S, R>
>(
  mod: FullyTypedModuleDefinition<S, R, A, M, G>
): FullyTypedModule<S, R, A, M, G> => ({
  actions: {} as A,
  mutations: {} as M,
  getters: {} as G,
  ...mod
});
