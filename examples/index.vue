<template>
  <div>
    <details>
      <summary>Minimal</summary>
      <Minimal/>
    </details>

    <details>
      <summary>Simple</summary>
      <Simple/>
    </details>
  </div>
</template>

<script>
import Minimal from "./minimal";
import Simple from "./simple";

export default {
  components: { Minimal, Simple }
};
</script>

<style>
details {
  margin-bottom: 50px;
}

summary {
  margin-bottom: 20px;
}
</style>