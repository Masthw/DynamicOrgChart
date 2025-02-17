<template>
  <div class="side-modal" v-if="true">
    <div class="side-modal-header">
      <SearchComponent
        placeholder="Buscar Funcionário"
        class="search-component"
      />
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
      <form @submit.prevent="confirm">
        <div v-if="activeTab === 'sobre'" class="tab-content">
          <!-- Área para a foto-->
          <div class="photo-container">
            <img
              :src="photoUrl"
              alt="Foto do Funcionário"
              class="employee-photo"
            />
            <input
              ref="photoInput"
              type="file"
              accept="image/*"
              @change="handlePhotoChange"
              @click="triggerPhotoUpload"
              hidden
            />
          </div>

          <div class="form-group">
            <label>Primeiro Nome *</label>
            <TextFieldComponent
              v-model="formData.name"
              placeholder="Primeiro Nome"
              required
            />
          </div>
          <div class="form-group">
            <label>Sobrenome *</label>
            <TextFieldComponent
              v-model="formData.lastName"
              placeholder="Sobrenome"
              required
            />
          </div>
          <div class="form-group">
            <label>Cargo</label>
            <TextFieldComponent
              v-model="formData.position"
              placeholder="Cargo"
            />
          </div>
          <div class="form-group">
            <label>Gênero</label>
            <select v-model="formData.gender">
              <option value="">Selecione</option>
              <option value="Masculino">Masculino</option>
              <option value="Feminino">Feminino</option>
              <option value="Outro">Outro</option>
            </select>
          </div>
          <div class="form-group">
            <label>Data de Admissão</label>
            <input type="date" v-model="formattedHireDate" />
          </div>
        </div>
        <div v-else-if="activeTab === 'conexoes'" class="tab-content">
          <div class="form-group">
            <label>Gestor Imediato</label>
            <TextFieldComponent
              v-model="formData.parentId"
              placeholder="Nome do Gestor"
            />
          </div>
          <div class="form-group">
            <label>Departamento</label>
            <TextFieldComponent
              v-model="formData.department_name"
              placeholder="Departamento"
            />
          </div>
          <div class="form-group">
            <label>Sigla</label>
            <TextFieldComponent
              v-model="formData.departmentAcronym"
              placeholder="Sigla do Departamento"
            />
          </div>
          <div class="form-group">
            <label>Salário</label>
            <TextFieldComponent
              v-model="formData.salary"
              placeholder="Salário"
            />
          </div>
          <div class="form-group">
            <label>Benefícios</label>
            <TextFieldComponent
              v-model="formData.benefits"
              placeholder="Benefícios"
            />
          </div>
          <div class="form-group">
            <label>Horas de Trabalho</label>
            <TextFieldComponent
              v-model="formData.workingHours"
              placeholder="Horas de Trabalho"
            />
          </div>
        </div>
        <div v-else-if="activeTab === 'formacao'" class="tab-content">
          <div class="form-group">
            <label>Escolaridade</label>
            <TextFieldComponent
              v-model="formData.education"
              placeholder="Escolaridade"
            />
          </div>
          <div class="form-group">
            <label>Cursos</label>
            <TextFieldComponent
              v-model="formData.courses"
              placeholder="Cursos"
            />
          </div>
          <div class="form-group">
            <label>Certificações</label>
            <TextFieldComponent
              v-model="formData.certifications"
              placeholder="Certificações"
            />
          </div>
          <div class="form-group">
            <label>Idiomas</label>
            <TextFieldComponent
              v-model="formData.languages"
              placeholder="Idiomas"
            />
          </div>
          <div class="form-group">
            <label>Habilidades Técnicas</label>
            <TextFieldComponent
              v-model="formData.technicalSkills"
              placeholder="Habilidades Técnicas"
            />
          </div>
        </div>
        <div v-else-if="activeTab === 'localizacao'" class="tab-content">
          <div class="form-group">
            <label>Centro de Custo</label>
            <TextFieldComponent
              v-model="formData.costCenter"
              placeholder="Centro de Custo"
            />
          </div>
          <div class="form-group">
            <label>Área</label>
            <TextFieldComponent v-model="formData.area" placeholder="Área" />
          </div>
          <div class="form-group">
            <label>Localização</label>
            <TextFieldComponent
              v-model="formData.location_state"
              placeholder="Localização"
            />
          </div>
          <div class="form-group">
            <label>Unidade/Filial</label>
            <TextFieldComponent
              v-model="formData.branch"
              placeholder="Unidade/Filial"
            />
          </div>
          <div class="form-group">
            <label>Modalidade de Trabalho</label>
            <TextFieldComponent
              v-model="formData.workMode"
              placeholder="Modalidade de Trabalho"
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
          <ButtonComponent type="submit" variant="secondary" label="Salvar" />
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import ButtonComponent from '../ButtonComponent.vue';
import SearchComponent from '../SearchComponent.vue';
import TextFieldComponent from '../TextFieldComponent.vue';

export default {
  name: 'AddEmployeeModal',
  components: {
    ButtonComponent,
    TextFieldComponent,
    SearchComponent,
  },
  props: {
    show: Boolean,
    employeeData: Object,
  },
  data() {
    return {
      formData: { ...this.employeeData },
      photoUrl: this.employeeData.image || 'https://via.placeholder.com/150',
      tabs: [
        {
          name: 'sobre',
          label: 'Sobre',
          icon: 'src/assets/icons/contact_mail.png',
        },
        {
          name: 'conexoes',
          label: 'Conexões',
          icon: 'src/assets/icons/connect_without_contact.png',
        },
        {
          name: 'formacao',
          label: 'Formação',
          icon: 'src/assets/icons/import_contacts.png',
        },
        {
          name: 'localizacao',
          label: 'Localização',
          icon: 'src/assets/icons/location.png',
        },
      ],
      activeTab: 'sobre',
    };
  },
  computed: {
    formattedHireDate: {
      get() {
        return this.formData.hire_date
          ? this.formData.hire_date.split('T')[0]
          : '';
      },
      set(value) {
        this.formData.hire_date = value; // já está no formato correto
      },
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
</style>
