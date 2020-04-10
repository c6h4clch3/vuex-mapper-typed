import { Store, ActionTree, MutationTree, GetterTree } from "vuex";
import { FullyTypedModule } from "../modules/buildModule";
import { makeMappers } from "../mappers/makeMappers";

interface ModuleTree {
  [key: string]: FullyTypedModule<any, any, any, any, any>;
}

export class ManagedStore<
  R,
  A extends ActionTree<R, R>,
  Mu extends MutationTree<R>,
  G extends GetterTree<R, R>,
  Mo extends ModuleTree
> extends Store<R> {
  private def: {
    state: R | (() => R);
    actions: A;
    mutations: Mu;
    getters: G;
    modules: Mo;
  };
  constructor(def: {
    state: R | (() => R);
    actions: A;
    mutations: Mu;
    getters: G;
    modules: Mo;
  }) {
    super(def);

    this.def = def;
  }

  mappersOf(key?: keyof Mo) {
    if (!key) {
      const mappers = makeMappers(this.def);
      return {
        mapStateWithType(map?: (keyof R)[]) {
          return map
            ? mappers.mapStateWithType(map)
            : mappers.mapStateWithType();
        },
        mapActionsWithType(map?: (keyof A)[]) {
          return map
            ? mappers.mapActionsWithType(map)
            : mappers.mapActionsWithType();
        },
        mapMutationsWithType(map?: (keyof Mu)[]) {
          return map
            ? mappers.mapMutationsWithType(map)
            : mappers.mapMutationsWithType();
        },
        mapGettersWithType(map?: (keyof G)[]) {
          return map
            ? mappers.mapGettersWithType(map)
            : mappers.mapGettersWithType();
        }
      };
    }

    const mod = this.def.modules[key];
    const {
      mapStateWithType,
      mapActionsWithType,
      mapMutationsWithType,
      mapGettersWithType
    } = makeMappers(mod);
    return {
      mapStateWithType(map?: (keyof typeof mod.state)[]) {
        return map ? mapStateWithType(map) : mapStateWithType();
      },
      mapActionsWithType(map?: (keyof typeof mod.actions)[]) {
        return map ? mapActionsWithType(map) : mapActionsWithType();
      },
      mapMutationsWithType(map?: (keyof typeof mod.mutations)[]) {
        return map ? mapMutationsWithType(map) : mapMutationsWithType();
      },
      mapGettersWithType(map?: (keyof typeof mod.getters)[]) {
        return map ? mapGettersWithType(map) : mapGettersWithType();
      }
    };
  }
}
