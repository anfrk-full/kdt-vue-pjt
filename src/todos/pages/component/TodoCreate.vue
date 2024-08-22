<template>
    <div class="container">
        <h2> Todo-Creat </h2>
        <form>
            <div class="row">
                <div class="col-6">
                    <div class="form-group">
                        <label>Subject</label>
                        <input  type="text" 
                                class="form-control"
                                v-model="todo.subject">
                        <div    v-if="subjectError"
                                class="text-red">
                                {{ subjectError }}
                        </div>
                    </div>
                    
                </div>
                <div class="col-6">
                    <div class="form-group">
                        <label>State</label>
                        <div>
                            <button class="btn btn-primary"
                                    type="button"> 
                                    InComplete 
                            </button>
                        </div>
                    </div>
                </div>    
            </div>    

            <div class="col-12">
                <div class="form-group">
                    <label>Body</label>
                    <textarea v-model="todo.body" class="form-control" cols="30" rows="10"></textarea>
                    
                    <div    v-if="bodyError"
                            class="text-red">
                        {{ bodyError }}
                    </div>

                </div> 
            </div>

            <button class="btn btn-outline-dark" 
                    type="button"
                    @click.stop="openModal">CREATE</button>

            <!-- cancel 버튼 클릭시  path /todos 연결된 컴포넌트로 화면전환 -->
            <button class="btn btn-outline-danger ml-2"
                    @click.stop="moveToTodos">Cancel</button>   

        </form>
        <Teleport to="#modal">
            <Modal
                v-if="showModal">
                <template v-slot:title>
                    할 일 등록하기
                </template>
                <template v-slot:body>
                    정말 등록하시겠습니까?
                </template>
                <template v-slot:footer>
                    <button type="button" 
                            class="btn btn-secondary" 
                            @click="onClose">Close</button>
                    <button type="button" 
                            class="btn btn-primary"
                            @click="onCreate">Create</button>
                </template>
            </Modal> 
        </Teleport>
    </div>

</template>

<script>
import { ref }       from 'vue' ; 
import { useRouter } from 'vue-router' ;
import axios         from '@/axios' ;
import Modal    from '@/components/modal/ModalComponent.vue' ; 

export default {
    components : {
        Modal,
    },
    setup() {
        const todo         = ref({});
        const router       = useRouter(); 

        const showModal = ref(false);

        const openModal = () => {
            console.log("debug >>> create openModal , ")
            showModal.value = true;
        }

        const onClose = () => {
            showModal.value = false;
        }
        
        const subjectError = ref('');
        const bodyError    = ref('');

        const onCreate = async () => {
            subjectError.value = '' ; 
            bodyError.value = '' ;     
            const data = {
                id : Date.now(),
                subject : todo.value.subject ,
                completed : false ,
                body : todo.value.body
            };

            try { 
                if( !todo.value.subject ) {
                    subjectError.value = 'Subject is required' ; 
                    return ;
                } else if( !todo.value.body ) {
                    bodyError.value = 'Body is required' ;     
                    return ; 
                } else {
                    const response = await axios.post(`todos` , data); 
                    todo.value.subject = '';
                    todo.value.body    = '';
                    console.log("debug >>> post result , " ,  response.data ); 
                    moveToTodos();
                }
            } catch( err ) {
                console.log( err ); 
            }
            
        }
        const moveToTodos = () => {
            router.push({
                name : 'Todos'
            });
        }
        return {
            todo,
            onCreate,
            moveToTodos,
            subjectError,
            bodyError,
            showModal,
            openModal,
            onClose,
            
        }
    }
}
</script>

<style>
    .text-red {
        color : red ; 
    }
</style>