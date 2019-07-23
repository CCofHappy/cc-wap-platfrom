<template>
  <div class="app">
    <div class="main">
      <nuxt keep-alive/>
      <navbar />
    </div>
  </div>
</template>
<script>
import navbar from '@/components/Navbar'
export default {
  components: {
    navbar
  }
}
</script>
