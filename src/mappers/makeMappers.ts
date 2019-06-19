import { ActionTree, MutationTree, GetterTree } from "vuex";
import { FullyTypedModule } from "../modules/buildModule";
import { mapStateWithType } from "./state";
import { mapActionsWithType } from "./actions";
import { mapMutationsWithType } from "./mutations";
import { mapGettersWithType } from "./getters";
import { State } from "../definitions";

const isStateConstructor = <S>(val: State<S>): val is () => S =>
  typeof val === "function";

/**
 * Returns fully-typed mappers:
 *
 * - `mapStateWithType<S>`
 * - `mapActionsWithType<A>`
 * - `mapMutationsWithType<M>`
 * - `mapGettersWithType<G>`
 *
 * @param mod fully typed Vuex module
 */
export const makeMappers = <
  S,
  R,
  A extends ActionTree<S, R>,
  M extends MutationTree<S>,
  G extends GetterTree<S, R>
>(
  mod: FullyTypedModule<S, R, A, M, G>
) => ({
  mapStateWithType: mapStateWithType(
    isStateConstructor(mod.state) ? mod.state() : mod.state
  ),
  mapActionsWithType: mapActionsWithType(mod.actions),
  mapMutationsWithType: mapMutationsWithType(mod.mutations),
  mapGettersWithType: mapGettersWithType(mod.getters)
});
