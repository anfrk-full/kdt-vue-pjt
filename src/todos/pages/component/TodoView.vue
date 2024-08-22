<template>
    <div class="container">
        <h2>Todo Read View</h2>
        
        <div v-if="loading">
            Loding.......
        </div>

        <form   v-else
                @submit.prevent="onUpdate">
            <div class="row">
                <div class="col-6">
                    <div class="form-group">
                        <label>Subject</label>
                        <input  type="text" 
                                class="form-control"
                                v-model="todo.subject">
                    </div>
                    
                </div>
                <div class="col-6">
                    <div class="form-group">
                        <label>State</label>
                        <div>
                            <button class="btn"
                                    :class="todo.completed ? 'btn-primary' : 'btn-danger'"
                                    @click="toggleState"
                                    type="button"> 
                                    {{ todo.completed ? 'Completed' : 'InComplete' }}
                            </button>
                        </div>
                    </div>
                </div>    
            </div>    

            <div class="col-12">
                <div class="form-group">
                    <label>Body</label>
                    <textarea v-model="todo.body" class="form-control" cols="30" rows="10"></textarea>
                </div> 
            </div>

            <button     class="btn btn-outline-dark" 
                        type="submit"
                        :disabled="!todoUpdated">Update</button>

            <!-- cancel 버튼 클릭시  path /todos 연결된 컴포넌트로 화면전환 -->
            <button class="btn btn-outline-danger ml-2"
                    @click.stop="moveToTodos">Cancel</button>   

        </form>

        <transition name="fade">
            <Alert  v-if="showAlert"
                    :message="alertMsg"
                    :type="alertType"/>
        </transition>

    </div>
</template>

<script>

import { useRoute , useRouter } from 'vue-router' ; 
import { ref , computed }      from 'vue';
import axios        from '@/axios' ; 
import _            from 'lodash' ;

import Alert        from '@/components/alert/AlertComponent.vue' ; 
import { useToast } from '@/composables/toast' ; 

export default {
    components : {
        Alert , 
    },

    setup() {
        const route  = useRoute();
        const router = useRouter();
        
        
        console.log("debug >>> TodoView params , " , route.params) ; 
        console.log("debug >>> TodoView params , " , route.params.id) ;  

        const loading = ref(true);
        const todo    = ref(null);
        const origianlTodo = ref(null);

        const { 
            showAlert, alertMsg, alertType , triggerAlert
        } = useToast() ; 

        const todoUpdated = computed(() => {
            return !_.isEqual(todo.value , origianlTodo.value);
        });
        /*
        update 클릭시 변경된 상태값을 json-server에 변경하고 
        화면을 path todos 이동 
        */
        const onUpdate = async () => {
            try {
                console.log("debug >>> onUpdate , " , route.params.id); 

                await axios.patch(`todos/${route.params.id}` , {
                    completed : todo.value.completed ,
                    subject   : todo.value.subject ,
                    body      : todo.value.body
                });
                // triggerAlert('Successfully updated....');
                moveToTodos();
                
            } catch( err ) {
                console.log(err); 
                triggerAlert('Something went wrong....', 'danger');
            } 
        }

        /*
        button 이벤트에 의해서 호출함수
        이벤트 핸들러에서 
        todo의 completed 값을 변경하는 구현!!!
        */
        const toggleState = () => {
            todo.value.completed = !todo.value.completed ; 
        }

        const getTodo = async () => {
            try {
                const response = await axios.get(`todos/${route.params.id}`); 
                console.log( response.data ); 
                todo.value = {...response.data} ;
                origianlTodo.value = {...response.data} ; 
                loading.value = false ;
                triggerAlert('Successfully get Todo....');
            } catch ( err ) {
                console.log( err );
                triggerAlert('Something went wrong....', 'danger');
            }
        }
        getTodo();

        const moveToTodos = () => {
            // router.push("/todos");
            router.push({
                name : 'Todos'
            });
        }

        return {
            loading,
            todo,
            moveToTodos,
            toggleState,
            onUpdate,
            todoUpdated,
            showAlert,
            alertMsg,
            alertType
        }
    }
}
</script>

<style>
    .fade-enter-active,
    .fade-leave-active {
        transition: all 0.5s ease ;
    }
    .fade-enter-from,
    .fade-leave-to {
        opacity: 1;
        transform: translateY(-30px) ;
    }
    .fade-enter-to,
    .fade-leave-from {
        opacity: 1;
        transform: translateY(-30px) ;
    }
</style>