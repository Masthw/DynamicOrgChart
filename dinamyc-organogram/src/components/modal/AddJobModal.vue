<template>
  <div v-if="visible">
    <div class="modal-overlay"></div>
    <div class="side-modal">
      <div class="side-modal-header">
        <h2>Adicionar Vaga</h2>
        <q-btn
          flat
          dense
          round
          icon="close"
          class="close-button"
          @click="close"
        />
      </div>

      <div class="side-modal-tabs">
        <div
          v-for="tab in tabs"
          :key="tab.name"
          :class="['tab-item', { active: activeTab === tab.name }]"
          @click="activeTab = tab.name"
        >
          <img :src="tab.icon" alt="" class="tab-icon" />
          <span class="tab-text">{{ tab.label }}</span>
        </div>
      </div>

      <div class="side-modal-body">
        <!-- Aba "Sobre" -->
        <div v-if="activeTab === 'sobre'" class="tab-content">
          <div class="form-group">
            <label>Título da Vaga</label>
            <TextFieldComponent
              v-model="formData.jobTitle"
              placeholder="Título da Vaga"
              required
            />
          </div>
          <div class="form-group">
            <label>Departamento/Setor</label>
            <SelectComponent
              v-model="formData.jobDepartment"
              :options="departmentOptions"
              placeholder="Departamento/Setor"
              customClass="larger-select"
            />
          </div>
          <div class="form-group">
            <label>Unidade/Filial</label>
            <TextFieldComponent
              v-model="formData.jobBranch"
              placeholder="Unidade/Filial"
            />
          </div>
          <div class="form-group">
            <label>Gestor Responsável</label>
            <TextFieldComponent
              v-model="formData.jobManager"
              placeholder="Nome do Gestor"
            />
          </div>
          <div class="form-group">
            <label>Superior Imediato</label>
            <TextFieldComponent
              v-model="formData.jobImmediateSuperior"
              placeholder="Nome do Imediato"
            />
          </div>
        </div>

        <!-- Aba "Detalhes" -->
        <div v-else-if="activeTab === 'detalhes'" class="tab-content">
          <div class="form-group">
            <label>Maturidade</label>
            <TextFieldComponent
              v-model="formData.maturity"
              placeholder="Maturidade"
            />
          </div>
          <div class="form-group">
            <label>Tipo de Contratação</label>
            <TextFieldComponent
              v-model="formData.contractType"
              placeholder="Tipo de Contratação"
            />
          </div>
          <div class="form-group">
            <label>Modelo de Trabalho</label>
            <TextFieldComponent
              v-model="formData.jobModality"
              placeholder="Modelo de Trabalho"
            />
          </div>
          <div class="form-group">
            <label>Jornada de Trabalho</label>
            <TextFieldComponent
              v-model="formData.workingDay"
              placeholder="Jornada de Trabalho"
            />
          </div>
          <div class="form-group">
            <label>Faixa Salarial</label>
            <TextFieldComponent
              v-model="formData.salaryRange"
              placeholder="Faixa Salarial"
            />
          </div>
          <div class="form-group">
            <label>Benefícios Oferecidos</label>
            <TextFieldComponent
              v-model="formData.jobBenefits"
              placeholder="Benefícios"
            />
          </div>
        </div>

        <!-- Aba "Requisitos" -->
        <div v-else-if="activeTab === 'requisitos'" class="tab-content">
          <div class="form-group">
            <label>Formação Acadêmica</label>
            <TextFieldComponent
              v-model="formData.educationRequirement"
              placeholder="Formação Acadêmica"
            />
          </div>
          <div class="form-group">
            <label>Certificações Necessárias</label>
            <TextFieldComponent
              v-model="formData.requiredCertifications"
              placeholder="Certificações Necessárias"
            />
          </div>
          <div class="form-group">
            <label>Experiência Mínima Requerida</label>
            <TextFieldComponent
              v-model="formData.minimumExperience"
              placeholder="Experiência Mínima Requerida"
            />
          </div>
          <div class="form-group">
            <label>Habilidades Técnicas</label>
            <TextFieldComponent
              v-model="formData.technicalSkills"
              placeholder="Habilidades Técnicas"
            />
          </div>
          <div class="form-group">
            <label>Idiomas Necessários</label>
            <TextFieldComponent
              v-model="formData.requiredLanguages"
              placeholder="Idiomas Necessários"
            />
          </div>
        </div>

        <!-- Aba "Informações" -->
        <div v-else-if="activeTab === 'informacoes'" class="tab-content">
          <div class="form-group">
            <label>Data de Abertura da Vaga</label>
            <TextFieldComponent
              v-model="formData.jobOpeningDate"
              placeholder="Data de Abertura da Vaga"
            />
          </div>
          <div class="form-group">
            <label>Prazo para Candidaturas</label>
            <TextFieldComponent
              v-model="formData.jobFinalDate"
              placeholder="Prazo para Candidaturas"
            />
          </div>
          <div class="form-group">
            <label>Status da Vaga</label>
            <TextFieldComponent
              v-model="formData.jobStatus"
              placeholder="Status da Vaga"
            />
          </div>
          <div class="form-group">
            <label>Motivo da Criação da Vaga</label>
            <TextFieldComponent
              v-model="formData.jobCreateReason"
              placeholder="Motivo da Criação da Vaga"
            />
          </div>
          <div class="form-group">
            <label>KPIs</label>
            <TextFieldComponent v-model="formData.kpis" placeholder="KPIs" />
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
      </div>
    </div>
  </div>
</template>

<script>
import ButtonComponent from '../ButtonComponent.vue';
import SelectComponent from '../SelectComponent.vue';
import TextFieldComponent from '../TextFieldComponent.vue';

export default {
  name: 'AddJobModal',
  components: {
    ButtonComponent,
    TextFieldComponent,
    SelectComponent,
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
      visible: true,
      confirming: false,
      formData: {
        nodeId: '',
        jobTitle: '',
        jobDepartment: '',
        jobBranch: '',
        jobManager: '',
        jobImmediateSuperior: '',
        maturity: '',
        contractType: '',
        jobModality: '',
        workingDay: '',
        salaryRange: '',
        jobBenefits: '',
        educationRequirement: '',
        requiredCertifications: '',
        minimumExperience: '',
        technicalSkills: '',
        requiredLanguages: '',
        jobOpeningDate: '',
        jobFinalDate: '',
        jobStatus: '',
        jobCreateReason: '',
        kpis: '',
      },
      tabs: [
        {
          name: 'sobre',
          label: 'Sobre',
          icon: 'src/assets/icons/contact_mail.png',
        },
        {
          name: 'detalhes',
          label: 'Detalhes',
          icon: 'src/assets/icons/connect_without_contact.png',
        },
        {
          name: 'requisitos',
          label: 'Requisitos',
          icon: 'src/assets/icons/import_contacts.png',
        },
        {
          name: 'informacoes',
          label: 'Informações',
          icon: 'src/assets/icons/info.png',
        },
      ],
      activeTab: 'sobre',
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
    close() {
      this.$emit('close');
    },

    confirm(event) {
      if (this.confirming) return;
      this.confirming = true;
      if (event && event.preventDefault) {
        event.preventDefault();
      }

      const dataToSend = JSON.parse(JSON.stringify(this.formData));
      const orgchartIframe = window.parent.document.querySelector('iframe');
      if (orgchartIframe && orgchartIframe.contentWindow) {
        orgchartIframe.contentWindow.postMessage(
          { type: 'confirmAddJob', data: dataToSend },
          '*'
        );
      } else {
        console.warn('Orgchart iframe não foi encontrado.');
      }
      this.$emit('confirm', this.formData);
      this.close();
    },
  },
};
</script>

<style scoped lang="scss">
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  z-index: 9999;
}

.side-modal {
  position: absolute;
  top: 50%;
  right: 20px;
  transform: translateY(-40%);
  width: 450px;
  height: auto;
  max-height: 90vh;
  justify-content: center;
  background: $white;
  z-index: 10000;
  display: flex;
  border-radius: 16px;
  border: 1px solid $background-gray;
  flex-direction: column;
  overflow: hidden;
}

.side-modal-header {
  color: $background-gray;
  padding: 16px;
  border-radius: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: $white;
}

.side-modal-header h2 {
  margin: 0;
  font-size: 18px;
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
  padding: 16px;
  flex: 1;
  overflow-y: auto;
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
</style>
