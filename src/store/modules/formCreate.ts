import { defineStore } from "pinia";
import { type setType, store, getConfig } from "../utils";

export const useFormCreateStore = defineStore("form-create", {
  state: () => ({
    modelConfig: "",
    formulaMaths: [],
    projectTypeRes: [],
    projectLevelRes: [],
    projectStatusRes: [],
    countryTypeRes: [],
    secretLevelRes: [],
    investUnitRes: [],
    scaleUnitRes: [],
    customerRes: [],
    devModeRes: [],
  }),
  getters: {
    getModelConfig(state) {
      return state.modelConfig;
    },
    getFormulaMaths(state) {
      return state.formulaMaths;
    },
  },
  actions: {
    CHANGE_SETTING({ key, value }) {
      if (Reflect.has(this, key)) {
        this[key] = value;
      }
    },
    changeSetting(data) {
      this.CHANGE_SETTING(data);
    }
  },
  persist: true
});

export function useFormCreateStoreHook() {
  return useFormCreateStore(store);
}