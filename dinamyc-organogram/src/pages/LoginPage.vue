<template>
  <div class="login-page">
    <!-- Esquerda (Campos de login ou registro) -->
    <div :class="['login-section', { 'switch-mode': isRegistering }]">
      <div class="form-container">
        <div class="text-h5 q-mb-lg">
          {{ isRegistering ? 'Register' : 'Login' }}
        </div>
        <q-input
          v-model="email"
          label="Email"
          type="email"
          outlined
          class="q-mb-md"
        />
        <q-input
          v-model="password"
          label="Password"
          type="password"
          outlined
          class="q-mb-md"
        />
        <div class="button-group">
          <q-btn
            label="Submit"
            color="primary"
            unelevated
            @click="handleSubmit"
            class="q-mb-md"
          />
          <q-btn label="Register" flat @click="toggleRegister" />
        </div>
      </div>
    </div>

    <!-- Direita (Imagem ou Fundo Animado) -->
    <div :class="['image-section', { 'switch-mode': isRegistering }]">
      <div class="placeholder">
        <!-- Aqui você pode colocar uma imagem ou animação -->
        <p>{{ isRegistering ? 'Welcome!' : 'Company Logo Here' }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { ref } from 'vue';

const email = ref('');
const password = ref('');
const isRegistering = ref(false);
const router = useRouter();

const handleSubmit = () => {
  // Lógica para login ou registro
  if (isRegistering.value) {
    alert('Registering...');
  } else {
    router.push('/organogram');
  }
};

const toggleRegister = () => {
  isRegistering.value = !isRegistering.value;
};
</script>

<style scoped>
/* Container principal */
.login-page {
  display: flex;
  flex-direction: row;
  height: 100vh;
  overflow: hidden;
}

/* Seção da esquerda (login/register) */
.login-section {
  width: 30%;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.5s ease;
  background-color: #fff;
  padding: 20px;
  z-index: 2;
  position: absolute;
  left: 0;
  height: 100%;
}

.login-section.switch-mode {
  left: 70%;
}

/* Container do formulário */
.form-container {
  width: 80%;
  text-align: center;
}

/* Botões no centro */
.button-group {
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* Seção da direita (imagem/fundo) */
.image-section {
  width: 70%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f0f0; /* Cor de fundo temporária */
  transition: all 0.5s ease;
  position: absolute;
  right: 0;
  height: 100%;
  z-index: 1;
}

.image-section.switch-mode {
  right: 30%;
}

/* Placeholder de imagem ou animação */
.placeholder {
  text-align: center;
  font-size: 1.5rem;
  color: #555;
}

/* Responsividade para telas menores */
@media (max-width: 768px) {
  .login-page {
    flex-direction: column;
  }

  .login-section,
  .image-section {
    width: 100%;
    transform: none;
    position: static;
    height: auto;
  }

  .login-section.switch-mode {
    transform: none;
  }

  .image-section.switch-mode {
    transform: none;
  }
}
</style>
