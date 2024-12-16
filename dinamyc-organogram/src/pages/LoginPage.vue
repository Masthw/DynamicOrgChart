<template>
  <div class="login-page">
    <!-- Esquerda (Campos de login ou registro) -->
    <div :class="['login-section', { 'switch-mode': isRegistering }]">
      <div class="form-container">
        <div class="text-h5 q-mb-lg">
          {{ isRegistering ? 'Registrar' : 'Entrar' }}
        </div>
        <q-input
          v-if="isRegistering"
          v-model="fullName"
          label="Nome Completo"
          type="text"
          outlined
          class="q-mb-md"
        />
        <q-input
          v-model="email"
          label="Email"
          type="email"
          outlined
          class="q-mb-md"
        />
        <q-input
          v-model="password"
          :label="isRegistering ? 'Senha' : 'Password'"
          type="password"
          outlined
          class="q-mb-md"
        />
        <q-input
          v-if="isRegistering"
          v-model="confirmPassword"
          label="Confirme sua senha"
          type="password"
          outlined
          class="q-mb-md"
        />
        <q-btn
          :label="isRegistering ? 'Registrar' : 'Entrar'"
          color="primary"
          unelevated
          @click="handleSubmit"
          class="q-mb-md"
          style="width: 100%"
        />

        <!-- Textos adicionais -->
        <div v-if="!isRegistering" class="aux-text">
          <span class="link-text" @click="redirectToReset"
            >Esqueceu sua senha?</span
          >
        </div>
        <div class="aux-text">
          <span>
            {{
              isRegistering ? 'Já tem uma conta?' : 'Ainda não tem uma conta?'
            }}
          </span>
          <span class="link-text" @click="toggleRegister">
            {{ isRegistering ? 'Entrar' : 'Registrar-se' }}
          </span>
        </div>
      </div>
    </div>

    <!-- Direita (Imagem ou Fundo Animado) -->
    <div :class="['image-section', { 'switch-mode': isRegistering }]">
      <div class="placeholder">
        <p>Company Logo Here</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { ref } from 'vue';

const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const fullName = ref('');
const isRegistering = ref(false);
const router = useRouter();

// Lógica para enviar formulário
const handleSubmit = () => {
  if (isRegistering.value) {
    if (password.value !== confirmPassword.value) {
      console.log('As senhas não coincidem!');
      return;
    }
    console.log('Registrando...');
  } else {
    router.push('/dashboard');
  }
};

const toggleRegister = () => {
  isRegistering.value = !isRegistering.value;
};

const redirectToReset = () => {
  router.push('/reset-password');
};
</script>

<style scoped>
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

.form-container {
  width: 80%;
  text-align: center;
}

.aux-text {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 5px;
  font-size: 0.9rem;
  margin-top: 10px;
}

.link-text {
  color: #007bff;
  text-decoration: underline;
  cursor: pointer;
}

.link-text:hover {
  color: #0056b3;
}

.image-section {
  width: 70%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f0f0;
  transition: all 0.5s ease;
  position: absolute;
  right: 0;
  height: 100%;
  z-index: 1;
}

.image-section.switch-mode {
  right: 30%;
}

.placeholder {
  text-align: center;
  font-size: 1.5rem;
  color: #555;
}

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
