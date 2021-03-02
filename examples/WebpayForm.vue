<template>
  <form
    ref="form"
    :action="action"
    method="post"
    @submit.prevent
    :target="target ? '_blank' : ''"
    class="hidden"
  >
    <input
      type="text"
      v-for="(value, name, i) in formData"
      :key="i"
      :name="name"
      :value="`${value}`"
    />
  </form>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue'

export default Vue.extend({
  props: {
    formData: {
      type: Object,
      default: () => ({}),
    },

    target: {
      type: Boolean,
      default: false,
    },

    test: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {}
  },

  computed: {
    action(): string {
      return this.test
        ? 'https://securesandbox.webpay.by'
        : 'https://payment.webpay.by'
    },
  },
  methods: {
    submit() {
      this.$nextTick(() => {
        const form = this.$refs.form as HTMLFormElement

        if (form) {
          form.submit()
        }
      })
    },
  },
})
</script>

<style lang="postcss" scoped></style>
