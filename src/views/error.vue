<template>
  <div>
    <section class="error">
      <h1>404</h1>
      <h2>Not Found</h2>
    </section>
  </div>
</template>

<script>
export default {
  name: 'not-found',

  title: 'Not Found'
}
</script>

<style lang="scss">
  .error {
    display: flex;
    flex: 1;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    letter-spacing: .125rem;

    h1,
    h2 {
      margin: 0;
      font: 300 2.5rem sans-serif;
    }

    h1 {
      font-size: 15rem;
    }

    footer {
      margin-top: 5rem;
      font-size: .75rem;
    }
  }
</style>
