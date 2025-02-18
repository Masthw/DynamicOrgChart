<template>
  <div v-if="true">
    <div class="modal-overlay"></div>
    <div class="side-modal">
      <div class="side-modal-header">
        <SearchComponent
          placeholder="Buscar Departamento"
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
        <div class="tab-item active">
          <img
            src="src/assets/icons/contact_mail.png"
            alt=""
            class="tab-icon"
          />
          <span class="tab-text">Sobre</span>
        </div>
      </div>
      <div class="side-modal-body">
        <form @submit.prevent="confirm">
          <div class="tab-content">
            <div class="form-group">
              <label>Nome *</label>
              <TextFieldComponent
                v-model="formData.departmentName"
                placeholder="Digite o nome do departamento"
                required
              />
            </div>
            <div class="form-group">
              <label>Descrição</label>
              <TextFieldComponent
                v-model="formData.departmentDescription"
                placeholder="Insira a descrição"
              />
            </div>
            <div class="form-group">
              <label>Cor</label>
              <div class="color-options">
                <div
                  v-for="color in colors"
                  :key="color"
                  :style="{ backgroundColor: color }"
                  class="color-circle"
                  @click="selectColor(color)"
                  :class="{ selected: formData.departmentColor === color }"
                ></div>
              </div>
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
  </div>
</template>

<script>
import ButtonComponent from '../ButtonComponent.vue';
import SearchComponent from '../SearchComponent.vue';
import TextFieldComponent from '../TextFieldComponent.vue';

export default {
  name: 'DepartmentModal',
  components: {
    ButtonComponent,
    TextFieldComponent,
    SearchComponent,
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
        departmentName: '',
        departmentDescription: '',
        departmentColor: '',
      },
      colors: [
        '#414141',
        '#D9D9D9',
        '#0072CE',
        '#460A78',
        '#10B12D',
        '#F58746',
        '#FF3700',
        '#BF2900',
        '#7F1B00',
      ],
    };
  },
  methods: {
    close() {
      this.$emit('close');
    },
    confirm() {
      this.$emit('confirm', this.formData);
    },
    selectColor(color) {
      this.formData.departmentColor = color;
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
  display: flex;
  background-color: $white;
  border-bottom: 1px solid $orange;
  margin-left: 20px;
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

.color-options {
  display: flex;
  justify-content: space-between;
  gap: 10px;
}

.color-circle {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  cursor: pointer;
  border: 2px solid transparent;
  transition: border 0.2s ease-in-out;
  position: relative;
}

.color-circle.selected {
  border: 4px solid rgba(0, 0, 0, 0.3);
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
}

.color-circle.selected::after {
  content: '';
  width: 10px;
  height: 2px;
  background-color: rgba(0, 0, 0, 0.7);
  position: absolute;
  bottom: -15px;
  left: 50%;
  transform: translateX(-50%);
  border-radius: 2px;
}

.side-modal-footer {
  margin-top: 50px;
  height: 18px;
  display: flex;
  justify-content: space-between;
  margin-bottom: 30px;
}
</style>
