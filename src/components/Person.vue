<template>
  <div class="person-card">
    <div class="person-info-container">
      <!-- Foto ou ícone -->
      <div v-if="!person.photo" class="person-photo">
        <font-awesome-icon icon="user-circle" />
      </div>
      <img v-else :src="person.photo" alt="Foto" class="person-photo" />

      <div class="person-header">
        <div class="person-info">
          <h3>{{ person.name }}</h3>
          <p>{{ person.position }}</p>
        </div>
      </div>
    </div>

    <!-- Botão expand/ocultar -->
    <button v-if="hasChildren" @click="toggleChildren" class="expand-button">
      <font-awesome-icon :icon="isExpanded ? 'minus' : 'plus'" />
    </button>

    <!-- Exibir filhos -->
    <div v-if="isExpanded" class="children">
      <div v-for="child in person.children" :key="child.id">
        <Person :person="child" />
      </div>
    </div>
  </div>
</template>

<script>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { defineComponent, ref, computed } from "vue";

export default defineComponent({
  name: "Person",
  components: {
    FontAwesomeIcon,
  },
  props: {
    person: Object,
  },
  setup(props) {
    const isExpanded = ref(false);
    const hasChildren = computed(
      () => props.person.children && props.person.children.length > 0
    );

    const toggleChildren = () => {
      isExpanded.value = !isExpanded.value;
    };

    return {
      isExpanded,
      hasChildren,
      toggleChildren,
    };
  },
});
</script>

<style scoped>
.person-card {
  position: relative;
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 16px;
  width: 250px;
  padding: 16px;
  text-align: center;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  margin: 10px;
}

.person-info-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 15px;
  width: 100%;
}

.person-photo {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f3f3f3;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  font-size: 40px;
  color: #aaa;
  margin-bottom: 10px; /* Espaçamento entre a foto e o nome */
}

.person-info h3 {
  color: #666;
  margin-block: 0;
  line-height: 1.2; /* Controla a altura da linha */
}

.person-info p {
  color: #666;
  margin-block: 0; 
  font-size: 14px; 
}

.expand-button {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 50%;
  padding: 8px; /* Reduz tamanho do botão */
  font-size: 12px; /* Reduz o ícone dentro do botão */
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.expand-button:hover {
  background-color: #0056b3;
}

.children {
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
</style>
