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

  <q-card-actions v-show="!getDataSetStore.length" align="center">
    <q-btn
      class="q-mt-lg"
      label="Add New DataSet"
      dense
      no-caps
      @click="addNewDataSet()"
    />
  </q-card-actions>

  <div class="q-mb-lg" v-for="data in getDataSetStore" :key="data.id">
    <div class="q-pa-md" style="max-width: 100%">
      <q-input
        outlined
        rows="3"
        v-model="data.commentSection"
        type="textarea"
        placeholder="This is commenting section"
      />
    </div>
    <div class="q-mx-md dataSet-title">
      <span class="q-mr-sm"> Data Set Title : </span>
      <q-input
        dense
        outlined
        v-model="data.title"
        style="max-width: 200px"
        :input-style="{ fontSize: '16px' }"
      />
    </div>
    <q-card-actions>
      <q-btn
        flat
        no-caps
        style="font-size: 16px"
        :label="data.addRow"
        color="deep-purple-12"
        @click="addNewRow(data.id)"
      />
      <q-btn
        flat
        no-caps
        style="font-size: 16px"
        :label="data.addNewdataSet"
        color="deep-purple-12"
        @click="addNewDataSet()"
      />
      <q-btn
        flat
        no-caps
        style="font-size: 16px"
        :label="data.deleteDataSet"
        color="deep-purple-12"
        @click="deleteDataSetStore(data.id)"
      />
    </q-card-actions>

    <div class="row q-mb-md">
      <div class="bg-pink-3 data_set_name text-center col-3">
        {{ data.alphabet }}
      </div>
      <div class="col-9">
        <div class="justify-around row">
          <div class="data-set bg-purple-2 col-3">
            {{ data.columnA }}
          </div>
          <div class="data-set bg-purple-2 col-3">
            {{ data.columnB }}
          </div>
          <div class="data-set bg-purple-2 col-3">
            {{ data.columnX }}
          </div>
        </div>
        <div class="row justify-around q-mt-sm">
          <div class="data-set bg-blue-2 col-3">
            {{ data.description }}
          </div>
          <div class="data-set bg-blue-2 col-3">
            {{ data.formula }}
          </div>
          <div class="data-set bg-blue-2 col-3">
            {{ data.result }}
          </div>
        </div>
      </div>
    </div>

    <div v-for="row in data.rows" :key="row.id">
      <div class="row q-mb-sm">
        <div class="col-3">
          <div class="q-ml-sm row" style="height: 40px">
            <div class="data-set q-mr-sm bg-purple-2 col-3">
              {{ row.name }}
            </div>
            <div class="data-set q-mr-xs bg-purple-2 col-3">Y</div>
            <div clickable class="data-set col-3 cursor-pointer">
              <q-icon
                size="sm"
                name="delete"
                @click="deleteRow(row.id, data.id)"
              />
            </div>
          </div>
        </div>
        <div class="col-9">
          <div class="justify-around row">
            <div class="col-3">
              <q-input dense outlined v-model="row.rowDescription" />
            </div>
            <div class="col-3">
              <!-- autogrow , :type="row.formula"-->
              <q-input dense outlined autogrow v-model="row.rowFormula" />
            </div>
            <div class="col-3">
              <q-input dense outlined v-model="row.rowResult" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <q-separator color="grey q-mt-md" size="5px" />
  </div>
</template>

<script>
import { useDataSetStore } from "src/stores/dataSet";
import { computed, defineComponent, ref, watch } from "vue";
import { Dialog, useQuasar } from "quasar";

export default defineComponent({
  name: "DataSet",
  setup() {
    const useDataStore = useDataSetStore();
    const $q = useQuasar();
    const getDataSetStore = computed(() => useDataStore.dataSetStore);

    const dataSets = ref([]);
    const addNewDataSet = () => {
      let alphabet = 65;
      dataSets.value.push({
        id: dataSets.value.length + 1,
        alphabet: String.fromCharCode(alphabet + dataSets.value.length),
        title: "",
        columnA: "A",
        columnB: "B",
        columnX: "X",
        commentSection: "",
        description: "Description",
        formula: "Formula",
        result: "Result(kl)",
        addRow: "Add Row",
        addNewdataSet: "Add New DataSets",
        deleteDataSet: "Delete",
        rows: [
          // {
          //   id: dataSets.value.length + 1,
          //   name:
          //     `${String.fromCharCode(alphabet + dataSets.value.length)}` +
          //     `${dataSets.value.length + 1}`,
          //   description: "text",
          //   formula: "textarea",
          //   result: "number",
          // },
        ],
      });
      useDataStore.addDataStore(dataSets.value);
    };

    const addNewRow = (_id) => {
      getDataSetStore.value.map((_el) => {
        if (_id === _el.id) {
          let rowName = `${_el.alphabet}` + `${_el.rows.length + 1}`;
          _el.rows.push({
            id: _el.rows.length + 1,
            name: rowName,
            description: "text",
            formula: "textarea",
            result: "number",
            // rowDescription: rowName + `${_el.columnA}`,
            // rowFormula: rowName + `${_el.columnB}`,
            // rowResult: rowName + `${_el.columnX}`,
            rowDescription: "",
            rowFormula: "",
            rowResult: "",
          });
        }
      });
    };
    const deleteDataSetStore = (id) => {
      $q.dialog({
        title: "Confirm",
        message: "Are you sure you want to delete this DataSet?",
        cancel: true,
        persistent: true,
      }).onOk(() => {
        useDataStore.deleteDataSet(id);
      });
    };
    const deleteRow = (rowId, DataSetId) => {
      $q.dialog({
        title: "Confirm",
        message:
          "Are you sure you want to delete this row? This may change your calculation.",
        cancel: true,
        persistent: true,
      }).onOk(() => {
        useDataStore.deleteDataSetRow(rowId, DataSetId);
      });
    };
    return {
      addNewDataSet,
      dataSets,
      getDataSetStore,
      deleteDataSetStore,
      addNewRow,
      deleteRow,
    };
  },
});
</script>

<style scoped>
.dataSet-title {
  font-size: 18px;
  display: flex;
  align-items: baseline;
}
.data-set {
  text-align: center;
  padding: 8px 0px;
  border-radius: 5px;
}
.containerWidth {
  max-width: 480px;
  margin: auto;
}
.data_set_name {
  border-radius: 10px;
  height: 70px;
  width: 80px;
  justify-content: center;
  text-align: center;
  margin: auto;
  font-size: -webkit-xxx-large;
}

/* textarea {
  height: 800px !important;
} */
</style>
