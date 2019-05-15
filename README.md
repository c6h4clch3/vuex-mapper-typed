# Vuex Typed Mapper

Vuex の mapXXXX をモジュール定義から動的に利用できるようにするツール

The Helper Tools allows you to use mapXXXX methods in Vuex with the mapped types derives from module definition.

## Note

Vuex Typed Mapper は mapXXXX のすべての記法をサポートしているわけではありません。
サポートしているのは下記の記法のみです。

```ts
function mapXXXX(map: string[]);
function mapXXXX(namespace: string, map: string[]);
```

オブジェクト形式のマッピングをオミットしたのには、下記の理由があります:

- 単純に実装コストが高かった
- 一度型情報さえつけてしまえば、別のオブジェクトに再マッピングするのはそう難しいことではない

なので、現状オブジェクト形式のマッピングをサポートする予定はありません。

Vuex Typed Mapper does not support all of signature of mapXXXX.
it only supports below signature:

```ts
function mapXXXX(map: string[]);
function mapXXXX(namespace: string, map: string[]);
```

The reasons I omit Object-based mapping:

- It might be too difficult to support.
- Once the mapped properties typed, it is easy to re-map them with new keys.

For these reasons, there're no plans about supporting Object-based mapping.

## Usage

```ts
// Vuex Module
import { buildModule, makeMappers } from "vuex-typed-mapper";

export const hogeModule = buildModule({
  namespaced: true,
  state: {
    id: 1,
    name: "Jhon Doe"
  },
  actions: {
    rename({ commit }, name: string) {
      commit("rename", name);
    }
  },
  mutations: {
    updateName(state, name: string) {
      state.name = name;
    }
  }
});
export const hogeMappers = makeMappers(hogeModule);
```

```ts
// Vuex Store
import Vue from "vue";
import Vuex from "vuex";
import { hogeModule } from "./path/to/module-definition";

Vue.use(Vuex);

export default new Vuex.Store({
  module: {
    hoge: hogeModule
  }
});
```

```ts
// Vue Component
<script lang="ts">
import Vue from 'vue';
import { hogeMapper } from './path/to/module-definition';

const hogeMappedState = hogeMapper.mapStateWithType(
  'hoge',
  ['id', 'name']
);

export default Vue.extend({
  computed: {
    ...hogeMappedState
  },
  methods: {
    hogehoge() {
      this.id   // (property) this.id: number;
      this.name // (property) this.name: string;
    }
  }
});
</script>
```

### Methods

#### buildModule

Defines fully-typed Vuex module.

##### signature

```ts
function buildModule<
  S,
  R,
  A extends ActionTree<S, R> = {},
  M extends MutationTree<S> = {},
  G extends GetterTree<S, R> = {}
>(
  mod: FullyTypedModuleDefinition<S, R, A, M, G>
): FullyTypeModule<S, R, A, M, G>;
```

#### makeMappers

Returns fully-typed mappers:

- `mapStateWithType<S>`
- `mapActionsWithType<A>`
- `mapMutationsWithType<M>`
- `mapGettersWithType<G>`

##### signature

```ts
function makeMappers<
  S,
  R,
  A extends ActionTree<S, R>,
  M extends MutationTree<S>,
  G extends GetterTree<S, R>
>(
  _module: FullyTypedModule<S, R, A, M, G>
): {
  mapStateWithType<S>(...args: [(keyof S)[]] | [string, [(keyof S)]]);
  mapActionsWithType<A>(...args: [(keyof A)[]] | [string, [(keyof A)]]);
  mapMutationsWithType<M>(...args: [(keyof M)[]] | [string, [(keyof M)]]);
  mapGettersWithType<G>(...args: [(keyof G)[]] | [string, [(keyof G)]]);
};
```

### Interfaces

#### FullyTypedModule

Extended `Vuex.Module<S, R>`, it can be used as `Vuex.Store.module`.

```ts
interface FullyTypedModule<
  S,
  R,
  A extends ActionTree<S, R>,
  M extends MutationTree<S>,
  G extends GetterTree<S, R>
> extends Vuex.Module<S, R> {
  actions: A;
  mutations: M;
  getters: G;
}
```

#### FullyTypedModuleDefinition

Module definition for `FullyTypedModule`

```ts
interface FullyTypedModuleDefinition<
  S,
  R,
  A extends ActionTree<S, R>,
  M extends MutationTree<S>,
  G extends GetterTree<S, R>
> extends Vuex.Module<S, R> {
  actions?: A;
  mutations?: M;
  getters?: G;
}
```

## LICENSE

MIT
