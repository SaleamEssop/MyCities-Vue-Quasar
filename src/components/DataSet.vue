<template>
  <q-header elevated class="containerWidth">
    <q-toolbar>
      <q-btn
        flat
        dense
        round
        icon="arrow_back"
        text-color="black"
        @click="$router.back()"
      />
      <q-toolbar-title class="text-dark">Home</q-toolbar-title>
    </q-toolbar>
  </q-header>
  <q-card-actions v-show="!getDataStore.length" align="center">
    <q-btn
      class=""
      label="Add New DataSet"
      dense
      no-caps
      @click="addNewDataSet()"
    />
  </q-card-actions>

  <div class="q-my-lg" v-for="data in getDataStore" :key="data.id">
    <div class="q-mx-md">
      <q-item-label class="text-body1">
        Data Set Title : {{ data.title }}</q-item-label
      >
    </div>
    <q-card-actions>
      <q-btn
        flat
        no-caps
        style="font-size: 16px"
        :label="data.addRow"
        color="deep-purple-12"
      />
      <q-btn
        flat
        no-caps
        style="font-size: 16px"
        :label="data.addNewdataSet"
        color="deep-purple-12"
        @click="addNewDataSet()"
      />
    </q-card-actions>
    <div class="row justify-around">
      <div class="col-3 data-set bg-purple-2">
        {{ data.columnA }}
      </div>
      <div class="col-3 data-set bg-purple-2">
        {{ data.columnB }}
      </div>
      <div class="col-3 data-set bg-purple-2">
        {{ data.columnX }}
      </div>
    </div>
    <div class="row justify-around q-my-sm">
      <div class="col-3 data-set bg-blue-2">
        {{ data.description }}
      </div>
      <div class="col-3 data-set bg-blue-2">
        {{ data.formula }}
      </div>
      <div class="col-3 data-set bg-blue-2">
        {{ data.result }}
      </div>
    </div>
    <q-separator color="grey q-mt-sm" size="5px" />
  </div>
</template>

<script>
import { useDataSetStore } from "src/stores/dataSet";
import { computed, defineComponent, ref, watch } from "vue";

export default defineComponent({
  name: "DataSet",
  setup() {
    const useDataStore = useDataSetStore();

    const getDataStore = computed(() => useDataStore.dataStore);

    const dataSets = ref([]);
    const addNewDataSet = () => {
      dataSets.value.push({
        id: dataSets.value.length + 1,
        title: "Water_used",
        columnA: "A",
        columnB: "B",
        columnX: "X",
        description: "Description",
        formula: "Formula",
        result: "Result( kl )",
        addRow: "Add Row",
        addNewdataSet: "Add New DataSets",
      });
      console.log("DataSet", dataSets.value);
      useDataStore.addDataStore(dataSets.value);
    };
    return {
      addNewDataSet,
      dataSets,
      getDataStore,
    };
  },
});
</script>

<style scoped>
.data-set {
  text-align: center;
  padding: 8px 0px;
  border-radius: 5px;
}
</style>
