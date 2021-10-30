<template>
  <div class="h-full flex">
    <div class="flex-1 relative z-0 flex overflow-hidden">
      <main class="w-1/2 h-screen flex-1 relative z-0 overflow-y-auto focus:outline-none xl:order-last">
        <div
          class="overflow-y-auto p-5 prose"
          v-html="content"
        />
      </main>
      <aside class="h-screen relative order-first flex flex-col flex-shrink-0 w-1/2 border-r border-gray-200 overflow-y-auto">
        <div
          id="markdown-editor"
          style="width: 100%; height: 100%"
        />
      </aside>
    </div>
  </div>
</template>

<script lang="ts">
import init, { parse } from '/@/parser/parser';
import * as ace from 'brace';
import {defineComponent, onMounted, reactive, toRefs } from 'vue';
import 'brace/mode/markdown';
import 'brace/theme/github';
import 'brace/ext/searchbox';

type mdData = {
  editor: ace.Editor | null,
  content: string | undefined,
}

export default defineComponent({
  name: 'MarkDownApp',
  setup() {
   const markDownData: mdData = reactive({
     editor: null,
     content: undefined,
   });

   onMounted(() => {
     markDownData.editor = ace.edit('markdown-editor');
     markDownData.editor.setOptions({
       wrapBehavioursEnabled: true,
       wrap: true,
       useWorker: true,
       behavioursEnabled: true,
       showGutter: true,
       highlightActiveLine: true,
       highlightSelectedWord: true,
     });
     markDownData.editor.getSession().setMode('ace/mode/markdown');
     markDownData.editor.setTheme('ace/theme/github');
     markDownData.editor.on('change', async () => {
       await init();
       markDownData.content = parse(<string> markDownData.editor?.getValue());
     });
   });

    return {
      ...toRefs(markDownData),
    };
  },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
textarea {
  width: 100% !important;
  height: 100vh !important;
}
</style>
