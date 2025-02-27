<template>
  <div v-if="true">
    <div class="modal-overlay"></div>
    <div class="side-modal">
      <div class="side-modal-header">
        <h2>Adicionar Novas Vagas</h2>
        <q-btn
          flat
          dense
          round
          icon="close"
          class="close-button"
          @click="close"
        />
      </div>
      <div class="side-modal-body">
        <div class="vacancies-control">
          <span class="vacancies-label">Quantidade de Vagas:</span>
          <div class="counter">
            <q-btn
              round
              dense
              class="counter-btn"
              @click="decrement"
              :disabled="vacanciesCount <= 1"
            >
              -
            </q-btn>
            <span class="counter-value">{{ vacanciesCount }}</span>
            <q-btn round dense class="counter-btn" @click="increment">
              +
            </q-btn>
          </div>
        </div>

        <form @submit.prevent="confirm">
          <div class="tab-content">
            <div class="form-group">
              <TextFieldComponent
                label="Cargo"
                v-model="formData.job_title"
                placeholder="Cargo"
              />
            </div>
            <div class="form-group">
              <TextFieldComponent
                label="Site"
                v-model="formData.job_site"
                placeholder="Site"
              />
            </div>
            <div class="form-group">
              <TextFieldComponent
                label="Área"
                v-model="formData.job_department_name"
                placeholder="Área"
              />
            </div>
            <div class="form-group">
              <TextFieldComponent
                label="Sigla"
                v-model="formData.job_id"
                placeholder="Sigla"
              />
            </div>
            <div class="form-group">
              <TextFieldComponent
                label="Centro de Custo"
                v-model="formData.job_cost_center"
                placeholder="Centro de Custo"
              />
            </div>
            <div class="form-group">
              <TextFieldComponent
                label="Salário Contratação (Inicial/Salário Objetivo/Final)"
                v-model="formData.job_remuneration"
                placeholder="Inicial:  | Salário Objetivo: | Final:"
              />
            </div>
            <div class="form-group">
              <TextFieldComponent
                label="Salário Contratação (R$)"
                v-model="formData.job_salary"
                placeholder="Salário Contratação"
              />
            </div>
            <div class="form-group">
              <TextFieldComponent
                label="Jornada de Trabalho"
                v-model="formData.job_work_journey"
                placeholder="Jornada de Trabalho"
              />
            </div>
            <div class="form-group">
              <TextFieldComponent
                label="Subgrupo"
                v-model="formData.job_sub_group"
                placeholder="Subgrupo"
              />
            </div>
            <div class="form-group">
              <TextFieldComponent
                label="Justificativa"
                v-model="formData.job_opening_reason"
                placeholder="Justificativa"
              />
            </div>
            <div class="form-group">
              <TextFieldComponent
                label="Data de Abertura"
                v-model="formData.job_opening_date"
                placeholder="Data de Abertura"
              />
            </div>
          </div>
          <div class="side-modal-footer">
            <ButtonComponent
              type="button"
              variant="primary"
              label="Cancelar"
              @click="close"
            />
            <ButtonComponent
              type="submit"
              variant="secondary"
              label="Salvar"
              @click="confirm"
            />
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import ButtonComponent from '../ButtonComponent.vue';
import TextFieldComponent from '../TextFieldComponent.vue';

export default {
  name: 'AddJobModal',
  components: {
    ButtonComponent,
    TextFieldComponent,
  },
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    initialData: {
      type: Object,
      default: () => ({}),
    },
    departments: {
      type: Array,
      required: true,
    },
  },

  data() {
    return {
      confirming: false,
      vacanciesCount: 1,
      formData: {
        nodeId: '',
        job_title: '',
        job_site: '',
        job_department_name: '',
        job_id: '',
        job_cost_center: '',
        job_remuneration: '',
        job_salary: '',
        job_work_journey: '',
        job_sub_group: '',
        job_opening_reason: '',
        job_opening_date: '',
      },
    };
  },
  mounted() {
    if (this.initialData) {
      this.formData.jobImmediateSuperior =
        this.initialData.jobImmediateSuperior;
      this.formData.nodeId = this.initialData.nodeId;
      this.formData.jobDepartment = this.initialData.departments;
    }
  },
  computed: {
    departmentOptions() {
      return this.departments.map((department) => ({
        value: department,
        label: department,
      }));
    },
  },
  methods: {
    increment() {
      this.vacanciesCount++;
    },
    decrement() {
      if (this.vacanciesCount > 1) {
        this.vacanciesCount--;
      }
    },
    close() {
      this.$emit('close');
    },

    confirm(event) {
      if (this.confirming) return;
      this.confirming = true;
      if (event && event.preventDefault) {
        event.preventDefault();
      }

      const dataToSend = JSON.parse(
        JSON.stringify({
          ...this.formData,
          vacanciesCount: this.vacanciesCount,
        })
      );
      const orgchartIframe = window.parent.document.querySelector('iframe');
      if (orgchartIframe && orgchartIframe.contentWindow) {
        orgchartIframe.contentWindow.postMessage(
          { type: 'confirmAddJob', data: dataToSend },
          '*'
        );
      } else {
        console.warn('Orgchart iframe não foi encontrado.');
      }
      this.$emit('confirm', dataToSend);
      setTimeout(() => {
        this.close();
        this.confirming = false;
      }, 100);
    },
  },
};
</script>

<style scoped lang="scss">
.modal-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 9999;
}

.vacancies-control {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  border-radius: 8px;
}

.vacancies-label {
  font-weight: bold;
  color: $gray;
}

.counter {
  display: flex;
  align-items: center;
  gap: 10px;
}

.counter-btn {
  width: 30px;
  height: 30px;
  background-color: $white;
  color: $orange;
  border-radius: 10px;
  border: 1px solid $orange;
  box-shadow: none;

  &:disabled {
    background-color: $background-gray;
    cursor: not-allowed;
    color: $white;
    border-color: transparent;
  }
}

.counter-value {
  min-width: 30px;
  text-align: center;
  font-weight: bold;
}

.side-modal {
  position: absolute;
  top: 50%;
  right: 20px;
  transform: translateY(-45%);
  width: 450px;
  height: auto;
  max-height: 90vh;
  justify-content: center;
  background: $white;
  z-index: 10000;
  display: flex;
  border-radius: 16px;
  flex-direction: column;
  overflow: hidden;
}

.side-modal-header {
  color: $background-gray;
  padding: 16px 16px 0px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.side-modal-header h2 {
  margin: 0;
  font-size: 18px;
  font-weight: bold;
}

.close-button {
  position: absolute;
  top: 20px;
  right: 15px;
  color: $gray;

  &:hover {
    color: $orange;
  }
}

.tab-item {
  flex: 1;
  padding: 8px 10px;
  text-align: left;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: $background-gray;
  border-top: 1px solid $background-gray;
  border-left: 1px solid $background-gray;
  border-right: 1px solid $background-gray;
  border-bottom: none;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  background: $white;
  justify-content: center;
}

.tab-item.active {
  color: $orange;
  border-top: 1px solid $orange;
  border-left: 1px solid $orange;
  border-right: 1px solid $orange;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  background: $white;
  margin-bottom: -1px;
}

.tab-icon {
  color: $background-gray;
  width: 18px;
  height: 18px;
  object-fit: contain;
}

.tab-text {
  display: inline-block;
}

.side-modal-tabs {
  position: relative;
  display: flex;
  background-color: $white;
  margin: 0 10px;
  border-bottom: 1px solid $orange;
  gap: 3px;
}

.side-modal-body {
  padding: 0px 16px 16px 16px;
  flex: 1;
  overflow-y: auto;
  &::-webkit-scrollbar {
    width: 2px;
  }

  &::-webkit-scrollbar-track {
    background: $background-white;
    border-radius: 2px;
  }

  &::-webkit-scrollbar-thumb {
    background: $orange;
    border-radius: 2px;
  }
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  color: $background-gray;
  display: block;
  margin-bottom: 4px;
  font-weight: bold;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 8px;
  background-color: $white;
  border: 1px solid $background-gray;
  border-radius: 14px;
  color: $background-gray;
}

.side-modal-footer {
  height: 18px;
  display: flex;
  justify-content: space-between;
  margin-bottom: 30px;
}

.larger-select {
  width: 100%;
  box-shadow: none;
  border: 1px solid $background-gray;
  border-radius: 14px;
  padding-left: 0px;
  font-size: 14px;
}

:deep(.field-label) {
  font-size: 14px !important;
  color: $background-gray;
}
</style>
