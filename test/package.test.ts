import { expect } from "chai";
import { buildModule, makeMappers } from "../src/index";
import { createLocalVue, shallowMount, Wrapper } from "@vue/test-utils";
import Vuex, { Store } from "vuex";

const localVue = createLocalVue();
localVue.use(Vuex);

const modular = buildModule({
  state: () => {
    return {
      a: 0,
      b: "1234"
    };
  },
  actions: {
    modA({ commit }, num: number) {
      commit("mutateA", num);
    }
  },
  mutations: {
    mutateA(state, num: number) {
      state.a = num;
    }
  },
  getters: {
    strA(state) {
      return state.a.toString();
    },
    numberB(state) {
      return parseFloat(state.b);
    }
  }
});
const namespacedModular = buildModule({
  ...modular,
  namespaced: true
});

const MODULE_IDENTIFIER = "test";
describe("Non-Namespaced store", () => {
  const mappers = makeMappers(modular);
  const mappedState = mappers.mapStateWithType(["a", "b"]);
  const mappedActions = mappers.mapActionsWithType(["modA"]);
  const mappedMutations = mappers.mapMutationsWithType(["mutateA"]);
  const mappedGetters = mappers.mapGettersWithType(["strA", "numberB"]);

  const component = localVue.extend({
    template: "<div></div>",
    computed: {
      ...mappedState,
      ...mappedGetters
    },
    methods: {
      ...mappedActions,
      ...mappedMutations
    }
  });

  let store: Store<any>;
  let wrapper: Wrapper<any>;
  let vm: any;
  beforeEach(() => {
    store = new Vuex.Store({ ...modular });
    wrapper = shallowMount(component, {
      store,
      localVue
    });
    vm = wrapper.vm;
  });
  it('has property "a" is 0', () => {
    expect(vm.a).to.eq(0);
  });
  it('has property "b" is "1234"', () => {
    expect(vm.b).to.eq("1234");
  });
  it('has getter "strA" is "0"', () => {
    expect(vm.strA).to.eq("0");
  });
  it('has getter "numberB" is 1234', () => {
    expect(vm.numberB).to.eq(1234);
  });
  it('has action "modA"', async () => {
    await vm.modA(2);
    expect(vm.a).to.eq(2);
  });
  it('has mutation "mutateA"', () => {
    vm.mutateA(3);
    expect(vm.a).to.eq(3);
  });
});

describe("Namespaced store", () => {
  const namespacedMappers = makeMappers(namespacedModular);
  const namespacedMappedState = namespacedMappers.mapStateWithType(
    MODULE_IDENTIFIER,
    ["a", "b"]
  );
  const namespacedMappedActions = namespacedMappers.mapActionsWithType(
    MODULE_IDENTIFIER,
    ["modA"]
  );
  const namespacedMappedMutations = namespacedMappers.mapMutationsWithType(
    MODULE_IDENTIFIER,
    ["mutateA"]
  );
  const namespacedMappedGetters = namespacedMappers.mapGettersWithType(
    MODULE_IDENTIFIER,
    ["strA", "numberB"]
  );
  const namespacedMappedComponent = localVue.extend({
    template: "<div></div>",
    computed: {
      ...namespacedMappedState,
      ...namespacedMappedGetters
    },
    methods: {
      ...namespacedMappedActions,
      ...namespacedMappedMutations
    }
  });
  let store: Store<any>;
  let wrapper: Wrapper<any>;
  let vm: any;
  beforeEach(() => {
    store = new Vuex.Store({
      modules: {
        [MODULE_IDENTIFIER]: namespacedModular
      }
    });
    wrapper = shallowMount(namespacedMappedComponent, {
      store,
      localVue
    });
    vm = wrapper.vm;
  });
  it('has property "a" is 0', () => {
    expect(vm.a).to.eq(0);
  });
  it('has property "b" is "1234"', () => {
    expect(vm.b).to.eq("1234");
  });
  it('has getter "strA" is "0"', () => {
    expect(vm.strA).to.eq("0");
  });
  it('has getter "numberB" is 1234', () => {
    expect(vm.numberB).to.eq(1234);
  });
  it('has action "modA"', async () => {
    await vm.modA(2);
    expect(vm.a).to.eq(2);
  });
  it('has mutation "mutateA"', () => {
    vm.mutateA(3);
    expect(vm.a).to.eq(3);
  });
});
