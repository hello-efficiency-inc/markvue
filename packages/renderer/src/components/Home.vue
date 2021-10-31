<template>
  <div class="h-screen flex overflow-hidden bg-white">
    <div class="flex flex-col w-0 flex-1">
      <div class="sticky top-0 z-10 flex-shrink-0 flex align-middle h-12 p-2 bg-white border-b border-gray-200">
        <p class="mb-0 text-md">
          Untitled.md
        </p>
      </div>
      <splitpanes
        class="flex-1 relative z-0 flex overflow-hidden"
        @resize="initAceEditor"
      >
        <pane
          class="relative order-first flex flex-col w-1/2 border-r border-gray-200 overflow-y-auto"
          min-size="20"
        >
          <div
            id="markdown-editor"
            style="width: 100%; height: 100%"
          />
        </pane>
        <pane
          class="w-1/2 relative z-0 overflow-y-auto focus:outline-none xl:order-last"
          min-size="20"
        >
          <div
            class="p-8 overflow-y-auto prose max-w-full h-full"
            v-html="content"
          />
        </pane>
      </splitpanes>
    </div>
  </div>
</template>

<script lang="ts">
import { Splitpanes, Pane } from 'splitpanes';
import init, { parse } from '/@/parser/parser';
import { useElectron } from '/@/use/electron';
import * as ace from 'brace';
import {defineComponent, onMounted, reactive, toRefs } from 'vue';
import 'brace/mode/markdown';
import 'brace/theme/github';
import 'brace/ext/searchbox';
import 'splitpanes/dist/splitpanes.css';

type mdData = {
  editor: ace.Editor | null,
  markdownCode: string | undefined,
  content: string | undefined,
}

export default defineComponent({
  name: 'MarkDownApp',
  components: { Splitpanes, Pane },
  setup() {
   const markDownData: mdData = reactive({
     editor: null,
     markdownCode: undefined,
     content: undefined,
   });

   const { ipcRendReceive, ipcSendData } = useElectron();

   onMounted(() => {
     initAceEditor();
   });

   ipcRendReceive('fetch-data', () => {
     if (markDownData.markdownCode) {
      ipcSendData(markDownData.markdownCode);
     }
   });

   function initAceEditor()
   {
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
       markDownData.markdownCode = markDownData.editor?.getValue();
       markDownData.content = parse(<string> markDownData.editor?.getValue());
     });
   }

    return {
      ...toRefs(markDownData),
      initAceEditor,
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
