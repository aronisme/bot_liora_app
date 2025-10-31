<script lang="ts">
  export let role: 'user'|'assistant'|'system' = 'user';
  export let content = '';
</script>
<div class="msg {role}">
  <div class="small">{role}</div>
  <div style="white-space:pre-wrap;margin-top:6px">{content}</div>
</div>
