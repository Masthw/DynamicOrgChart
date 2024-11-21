<template>
  <div class="person-card">
    <!-- Foto ou ícone padrão -->
    <div class="person-photo">
      <font-awesome-icon v-if="!person.photo" icon="user-circle" class="icon" />
      <img v-else :src="person.photo" alt="Foto da pessoa" />
    </div>

    <!-- Nome e cargo -->
    <div class="person-info">
      <h3>{{ person.name }}</h3>
      <p>{{ person.position }}</p>
    </div>

    <!-- Botão de ação -->
    <button @click="handleClick" class="expand-button">
      <font-awesome-icon icon="plus" />
    </button>
  </div>
</template>

<script>
export default {
  props: {
    person: {
      type: Object,
      default: () => ({
        name: "João Silva",
        position: "Desenvolvedor",
        photo: "", // Sem foto para exibir o ícone
      }),
    },
  },
  methods: {
    handleClick() {
      alert(`Editando informações de ${this.person.name}`);
    },
  },
};
</script>

<style>
.person-card {
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 16px;
  width: 300px;
  padding: 20px;
  text-align: center;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  position: relative;
}

/* Foto ou ícone */
.person-photo {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  margin: 0 auto 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f4f4f4;
  overflow: hidden;
}

.person-photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.person-photo .icon {
  font-size: 50px;
  color: #ccc;
}

.person-info h3 {
  margin: 0;
  font-size: 18px;
  font-weight: bold;
  color: #666;
}

.person-info p {
  margin: 5px 0 0;
  font-size: 14px;
  color: #666;
}

.expand-button {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 20px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.expand-button:hover {
  background-color: #0056b3;
}

.expand-button .icon {
  font-size: 20px;
}
</style>
