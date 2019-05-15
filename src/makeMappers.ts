import { ActionTree, MutationTree, GetterTree } from "vuex";
import { FullyTypedModule } from "./buildModule";
import { mapStateWithType } from "./state";
import { mapActionsWithType } from "./actions";
import { mapMutationsWithType } from "./mutations";
import { mapGettersWithType } from "./getters";

/**
 * Returns fully-typed mappers:
 *
 * - `mapStateWithType<S>`
 * - `mapActionsWithType<A>`
 * - `mapMutationsWithType<M>`
 * - `mapGettersWithType<G>`
 *
 * @param _module fully typed Vuex module
 */
export const makeMappers = <
  S,
  R,
  A extends ActionTree<S, R>,
  M extends MutationTree<S>,
  G extends GetterTree<S, R>
>(
  _module: FullyTypedModule<S, R, A, M, G>
) => ({
  mapStateWithType: mapStateWithType<S>(),
  mapActionsWithType: mapActionsWithType<A>(),
  mapMutationsWithType: mapMutationsWithType<M>(),
  mapGettersWithType: mapGettersWithType<G>()
});
