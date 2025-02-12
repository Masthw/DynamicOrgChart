<template>
  <div class="side-modal" v-if="true">
    <div class="side-modal-header">
      <h2>Adicionar Funcionário</h2>
      <button class="close-btn" @click="close">&times;</button>
    </div>
    <div class="side-modal-body">
      <form @submit.prevent="confirm">
        <div class="form-group">
          <label>Primeiro Nome *</label>
          <input type="text" v-model="formData.firstName" required />
        </div>
        <div class="form-group">
          <label>Sobrenome *</label>
          <input type="text" v-model="formData.lastName" required />
        </div>
        <div class="form-group">
          <label>Cargo</label>
          <input type="text" v-model="formData.position" />
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
          <button type="button" @click="close">Cancelar</button>
          <button type="submit">Salvar</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AddEmployeeModal',
  props: {
    // Você pode usar uma prop para controlar a visibilidade se preferir,
    // mas neste exemplo, o OrgChartPage.vue controla via v-if.
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
    };
  },
  methods: {
    close() {
      this.$emit('close');
    },
    confirm() {
      this.$emit('confirm', this.formData);
    },
  },
};
</script>

<style scoped lang="scss">
.side-modal {
  position: fixed;
  top: 0;
  right: 0;
  width: 400px;
  height: 100vh;
  background: #fff;
  box-shadow: -4px 0 8px rgba(0, 0, 0, 0.2);
  z-index: 10000;
  display: flex;
  flex-direction: column;
  animation: slideIn 0.3s ease;
}

@keyframes slideIn {
  from {
    right: -400px;
  }
  to {
    right: 0;
  }
}

.side-modal-header {
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #f5f5f5;
  border-bottom: 1px solid #ddd;
}

.side-modal-header h2 {
  margin: 0;
  font-size: 18px;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
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
  display: block;
  margin-bottom: 4px;
  font-weight: bold;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.side-modal-footer {
  padding: 16px;
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  border-top: 1px solid #ddd;
  background-color: #f5f5f5;
}
</style>
