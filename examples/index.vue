<template>
  <div>
    <form @submit.prevent="submitForm()">
      <input v-model="formData.email" name="email" />
      <button>Pay</button>
    </form>

    <WebpayForm ref="webpay" :test="test" :form-data="formDataWebpay" />
  </div>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue'
import axios from 'axios'

export default Vue.extend({
  props: {},
  data() {
    return {
      test: process.env.NODE_ENV !== 'production',
      formDataWebpay: {},
      formData: {
        email: '',
      },
    }
  },
  computed: {},
  methods: {
    async getData() {
      const { data } = await axios.get('/getForm', {
        email: this.formData.email,
      })
      return data
    },

    submitWebpayForm() {
      const webpayForm = this.$refs.webpay as HTMLFormElement
      webpayForm.submit()
    },

    async submitForm() {
      try {
        this.formDataWebpay = await this.getData()

        setTimeout(() => {
          this.submitWebpayForm()
        }, 5000)
      } catch (e) {
        console.error(e.response.data?.message)
      }
    },
  },
})
</script>

<style lang="postcss" scoped></style>
