<script>
  import { enhance } from '$app/forms';
  import type { ActionData } from './$types';
  import mdsvex from 'mdsvex';

  let markdown = '';
  let rendered = '';
</script>

<header>
  <button>Publish article</button>
  <input type="file" />
</header>

<div class="flex-container">
  <textarea bind:value={markdown}></textarea>
  <div class="preview"></div>
</div>

<style>
  .flex-container {
    display: flex;
  }

  textarea {
    width: 50%;
    height: 80vh;
  }

  .preview {
    width: 50%;
    height: 80vh;
    overflow-y: auto;
  }
</style>
