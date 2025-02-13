<template>
  <div class="side-modal" v-if="true">
    <div class="side-modal-header">
      <h2>Adicionar Funcionário</h2>
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
      <div v-if="activeTab === 'sobre'" class="tab-content">
        <!-- Área para a foto: componente inline de foto -->
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
        <form @submit.prevent="confirm">
          <div class="form-group">
            <label>Primeiro Nome *</label>
            <TextFieldComponent
              v-model="formData.firstName"
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
            <input type="date" v-model="formData.admissionDate" />
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
      <div v-else-if="activeTab === 'conexoes'" class="tab-content">
        <p>Conteúdo de Conexões</p>
      </div>
      <div v-else-if="activeTab === 'formacao'" class="tab-content">
        <p>Conteúdo de Formação</p>
      </div>
      <div v-else-if="activeTab === 'localizacao'" class="tab-content">
        <p>Conteúdo de Localização</p>
      </div>
    </div>
  </div>
</template>

<script>
import ButtonComponent from '../ButtonComponent.vue';
import TextFieldComponent from '../TextFieldComponent.vue';

export default {
  name: 'AddEmployeeModal',
  components: {
    ButtonComponent,
    TextFieldComponent,
  },
  props: {
    show: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      formData: {
        firstName: '',
        lastName: '',
        position: '',
        gender: '',
        admissionDate: '',
      },
      photoUrl: 'https://via.placeholder.com/150',
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
  methods: {
    close() {
      this.$emit('close');
    },

    confirm() {
      this.$emit('confirm', this.formData);
      this.startClose();
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
  box-shadow: -1px 0 8px rgba(0, 0, 0, 0.2);
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
  top: 15px;
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
  border-bottom: 2px solid transparent;
  justify-content: center;
}

.tab-item.active {
  color: $orange;
  border-bottom: 2px solid $orange;
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
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 8px;
}

.side-modal-tabs {
  margin: 0 10px;
  display: flex;
  border-bottom: 1px solid #ddd;
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
  border: 1px solid #ccc;
  border-radius: 14px;
}

.side-modal-footer {
  height: 18px;
  display: flex;
  justify-content: space-between;
  margin-bottom: 30px;
}
</style>
