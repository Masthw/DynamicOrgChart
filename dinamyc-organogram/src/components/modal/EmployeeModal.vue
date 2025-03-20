<template>
  <div v-if="true">
    <div class="modal-overlay"></div>
    <div class="side-modal">
      <div class="side-modal-header">
        <SearchComponent placeholder="Buscar Empregado" class="search-component" />
        <q-btn flat dense round icon="close" class="close-button" @click="close" />
      </div>

      <div class="side-modal-tabs">
        <div v-for="tab in tabs" :key="tab.name" :class="['tab-item', { active: activeTab === tab.name }]" @click="activeTab = tab.name">
          <img :src="tab.icon" alt="" class="tab-icon" />
          <span class="tab-text">{{ tab.label }}</span>
        </div>
      </div>

      <div class="side-modal-body">
        <form @submit.prevent="confirm">
          <div v-if="activeTab === 'personalData'" class="tab-content">
            <!-- Área para a foto-->
            <div class="photo-container">
              <img :src="photoUrl" alt="Foto do Empregado" class="employee-photo" />
              <input ref="photoInput" type="file" accept="image/*" @change="handlePhotoChange" @click="triggerPhotoUpload" hidden />
            </div>
            <div class="form-group">
              <TextFieldComponent label="Matrícula" v-model="formData.id" placeholder="Matrícula" :required="true" />
            </div>
            <div class="form-group">
              <TextFieldComponent label="Nome" v-model="fullName" placeholder="Primeiro Nome" :required="true" />
            </div>
            <div class="form-group">
              <TextFieldComponent label="Data de Nascimento" v-model="formData.birthDate" placeholder="Data de nascimento" />
            </div>
            <div class="form-group">
              <TextFieldComponent label="Idade" v-model="formData.age" placeholder="Idade" />
            </div>
            <div class="form-group">
              <TextFieldComponent label="Gênero" v-model="formData.gender" placeholder="Gênero" />
            </div>
            <div class="form-group">
              <TextFieldComponent label="Raça/Cor" v-model="formData.ethnicity" placeholder="Raça/Cor" />
            </div>
            <div class="form-group">
              <TextFieldComponent label="Deficiência" v-model="formData.deficiency" placeholder="Deficiência" />
            </div>
            <div class="form-group">
              <TextFieldComponent label="Plano de Previdência" v-model="formData.pensionPlan" placeholder="Plano de Previdência" />
            </div>
          </div>
          <div v-else-if="activeTab === 'organizationalData'" class="tab-content">
            <div class="form-group">
              <TextFieldComponent label="Site" v-model="formData.site" placeholder="Site" />
            </div>
            <div class="form-group">
              <TextFieldComponent label="Sigla" v-model="formData.job_id" placeholder="Sigla" />
            </div>
            <div class="form-group">
              <TextFieldComponent label="Área" v-model="formData.department_name" placeholder="Área" />
            </div>
            <div class="form-group">
              <TextFieldComponent label="Data de Admissão" v-model="formData.hire_date" placeholder="Data de Admissão" />
            </div>
            <div class="form-group">
              <TextFieldComponent label="Tempo de Empresa" v-model="formData.company_time" placeholder="Tempo de empresa" />
            </div>
            <div class="form-group">
              <TextFieldComponent label="Status Empregado" v-model="formData.employee_status" placeholder="Status Empregado" />
            </div>
            <div class="form-group">
              <TextFieldComponent label="Cargo" v-model="formData.position" placeholder="Cargo" />
            </div>
            <div class="form-group">
              <TextFieldComponent label="Subgrupo" v-model="formData.sub_group" placeholder="Subgrupo" />
            </div>
            <div class="form-group">
              <TextFieldComponent label="Tempo no Cargo" v-model="formData.time_in_position" placeholder="Tempo no Cargo" />
            </div>
            <div class="form-group">
              <TextFieldComponent label="Jornada de Trabalho" v-model="formData.work_journey" placeholder="Jornada de Trabalho" />
            </div>
            <div class="form-group">
              <TextFieldComponent label="Centro de Custo" v-model="formData.cost_center" placeholder="Centro de Custo" />
            </div>
          </div>
          <div v-else-if="activeTab === 'remuneration'" class="tab-content">
            <div class="form-group">
              <TextFieldComponent label="Salário Atual" v-model="formData.salary" placeholder="Salário Atual" />
            </div>
            <div class="form-group">
              <TextFieldComponent label="Remuneração Atual" v-model="formData.total_remuneration" placeholder="Remuneração Atual" />
            </div>
            <div class="form-group">
              <TextFieldComponent label="Faixa Salarial Atual" v-model="formData.salaryRange" placeholder="Faixa Salarial Atual" />
            </div>
            <div class="form-group">
              <TextFieldComponent label="Posicionamento na Faixa" v-model="formData.lane_position" placeholder="Posicionamento na Faixa" />
            </div>
            <div class="form-group">
              <TextFieldComponent label="Salário Proposto" v-model="formData.proposed_salary" placeholder="Salário Proposto" />
            </div>
            <div class="form-group">
              <TextFieldComponent label="Remuneração Proposta" v-model="formData.proposed_remuneration" placeholder="Remuneração Proposta" />
            </div>
            <div class="form-group">
              <TextFieldComponent label="Faixa Salarial Proposta" v-model="formData.proposed_salaryRange" placeholder="Faixa Salarial Proposta" />
            </div>
            <div class="form-group">
              <TextFieldComponent label="Posicionamento na Faixa" v-model="formData.proposed_lane_position" placeholder="Posicionamento na Faixa" />
            </div>
          </div>
          <div v-else-if="activeTab === 'degree'" class="tab-content">
            <div class="form-group">
              <TextFieldComponent label="Grau de Escolaridade" v-model="formData.level_education" placeholder="Grau de Escolaridade" />
            </div>
            <div class="form-group">
              <TextFieldComponent label="Curso" v-model="formData.course" placeholder="Curso" />
            </div>
            <div class="form-group">
              <TextFieldComponent
                label="Proficiência Inglês (Nota)"
                v-model="formData.english_proficiency_grade"
                placeholder="Proficiência Inglês (Nota)"
              />
            </div>
            <div class="form-group">
              <TextFieldComponent
                label="Proficiência Inglês (Nível)"
                v-model="formData.english_proficiency_level"
                placeholder="Proficiência Inglês (Nível)"
              />
            </div>
          </div>
          <div v-else-if="activeTab === 'career'" class="tab-content">
            <div class="form-group">
              <TextFieldComponent label="Performance Atual" v-model="formData.employee_performance" placeholder="Performance Atual" />
            </div>
            <div class="form-group">
              <TextFieldComponent label="Potencial Atual" v-model="formData.employee_potential" placeholder="Potencial Atual" />
            </div>
            <div class="form-group">
              <TextFieldComponent label="Performance Anterior" v-model="formData.employee_last_performance" placeholder="Performance Anterior" />
            </div>
            <div class="form-group">
              <TextFieldComponent label="Potencial Anterior" v-model="formData.employee_last_potential" placeholder="Potencial Anterior" />
            </div>

            <h2 class="succession-text">PLANO DE SUCESSÃO</h2>
            <div class="form-group">
              <TextFieldComponent label="Sigla" v-model="formData.job_id" placeholder="Sigla" />
            </div>
            <div class="form-group">
              <TextFieldComponent label="Área" v-model="formData.department_name" placeholder="Área" />
            </div>
            <div class="form-group">
              <TextFieldComponent label="Posição" v-model="formData.position" placeholder="Posição" />
            </div>
            <div class="form-group">
              <TextFieldComponent label="Prontidão" v-model="formData.readiness" placeholder="Prontidão" />
            </div>
          </div>
          <div class="side-modal-footer">
            <ButtonComponent type="button" variant="primary" label="Cancelar" @click="close" />
            <ButtonComponent type="submit" variant="secondary" label="Salvar" />
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import ButtonComponent from '../ButtonComponent.vue';
import SearchComponent from '../SearchComponent.vue';
import TextFieldComponent from '../TextFieldComponent.vue';

export default {
  name: 'EmployeeModal',
  components: {
    ButtonComponent,
    TextFieldComponent,
    SearchComponent,
  },
  props: {
    employeeData: {
      type: Object,
      default: () => ({}),
    },
    vacancies: {
      type: Array,
      default: () => [
        {
          id: 1740402427263,
          jobTitle: '?',
          position: 'aaaa',
          type: 'vacancy',
          department_name: 'IT',
          salaryRange: '10000',
        },
        {
          id: 1740402427265,
          jobTitle: 'Desenvolvedor Frontend',
          position: 'Desenvolvedor Frontend',
          type: 'vacancy',
          department_name: 'IT',
          salaryRange: '20000-30000',
        },
        {
          id: 1740402427266,
          jobTitle: 'Analista de Sistemas',
          position: 'Analista de Sistemas',
          type: 'vacancy',
          department_name: 'TI',
          salaryRange: '15000-25000',
        },
      ],
    },
  },
  data() {
    return {
      formData: { ...this.employeeData },
      photoUrl: this.employeeData.image || 'https://via.placeholder.com/150',
      tabs: [
        {
          name: 'personalData',
          label: 'Dados Pessoais',
          icon: 'src/assets/icons/contact_mail.png',
        },
        {
          name: 'organizationalData',
          label: 'Dados Organizacionais',
          icon: 'src/assets/icons/connect_without_contact.png',
        },
        {
          name: 'remuneration',
          label: 'Remuneração',
          icon: 'src/assets/icons/paid.png',
        },
        {
          name: 'degree',
          label: 'Formação',
          icon: 'src/assets/icons/import_contacts.png',
        },
        {
          name: 'career',
          label: 'Carreira e Sucessão',
          icon: 'src/assets/icons/lan.png',
        },
      ],
      activeTab: 'personalData',
    };
  },
  computed: {
    fullName: {
      get() {
        return `${this.formData.name} ${this.formData.lastName}`.trim();
      },
      set(value) {
        const parts = value.split(' ');
        this.formData.name = parts.shift() || '';
        this.formData.lastName = parts.join(' ') || '';
      },
    },
    formattedHireDate: {
      get() {
        return this.formData.hire_date ? this.formData.hire_date.split('T')[0] : '';
      },
      set(value) {
        this.formData.hire_date = value;
      },
    },
    vacancyOptions() {
      return this.vacancies
        .filter((vacancy) => vacancy.type === 'vacancy' || vacancy.jobTitle === '?')
        .map((vacancy) => ({
          value: vacancy.id,
          label: vacancy.jobTitle !== '?' ? vacancy.jobTitle : vacancy.position,
        }));
    },
  },
  methods: {
    close() {
      this.$emit('close');
    },

    confirm() {
      this.$emit('confirm', this.formData);
    },
    triggerPhotoUpload() {
      this.$refs.photoInput.click();
    },
    handlePhotoChange(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.photoUrl = e.target.result;
        };
        reader.readAsDataURL(file);
      }
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
  background: rgba(0, 0, 0, 0.3);
  z-index: 9999;
}

.side-modal {
  position: absolute;
  top: 50%;
  right: 20px;
  transform: translateY(-45%);
  width: 550px;
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
  padding: 16px;
  border-radius: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: $white;
}

.search-component {
  width: 350px;
  margin: 0;
  box-shadow: none;
  border: 1px solid $background-gray;
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
  padding: 2px 8px;
  text-align: center;
  cursor: pointer;
  display: flex;
  align-items: center;
  font-size: 10px;
  color: $background-gray;
  border-top: 1px solid $background-gray;
  border-left: 1px solid $background-gray;
  border-right: 1px solid $background-gray;
  border-bottom: none;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  background: $white;
  justify-content: space-evenly;
}

.tab-item.active {
  color: $orange;
  border-top: 1px solid $orange;
  border-left: 1px solid $orange;
  border-right: 1px solid $orange;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  background: $white;
  margin-bottom: -1.5px;
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
.photo-container {
  text-align: center;
}

.employee-photo {
  width: 65px;
  height: 65px;
  border-radius: 50%;
  object-fit: cover;
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
  padding: 10px 16px 12px 16px;
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

:deep(.field-label) {
  font-size: 14px !important;
  color: $background-gray;
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

.succession-text {
  display: flex;
  font-size: 18px;
  margin: 0;
  font-weight: bold;
  color: $gray;
  justify-content: center;
  padding: 0;
}
</style>
