<template>

  <div class="container">생명주기 관련한 부분으로 console.log 확인 바람...</div>
  <button   class="btn btn-primary"
            :disabled="flag"
            @click="btnHandler">Button</button>  
</template>

<script>

import { ref, onBeforeMount , onMounted , onUpdated , onUnmounted } from 'vue' ; 

export default {
    setup() {
        
        const flag = ref(false) ; 
        const btnHandler = () => {
            flag.value = true ; 
        }

        

        onBeforeMount( () => {
            console.log(">>>>> onBeforeMount");
        });
        onMounted(() => {
            console.log(">>>>> onMounted");
        });
        onUpdated(() => {
            console.log(">>>>> onUpdated");
        });
        onUnmounted(() => {
            console.log(">>>>> onUnmounted");
        });

        return {
            flag, 
            btnHandler
        }

    }
}
</script>

<style>

</style>