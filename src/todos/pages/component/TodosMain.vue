<template>
    <router-view />
    <div class="container">

        <h2>Todos Page</h2>
        
        <input  class="form-control"
                type="text"
                v-model="searchTxt"
                placeholder="Search..."/>
        <p/>
        <!-- <TodoForm @add-todo="addTodo"/> -->
        <!--  
        실습과제)
        아래 버튼 클릭시 router(todos/create) 를 이용해서 TodoCreate.vue 이동  
        src - todos - pages - component - TodoCreate.vue (TodoForm)
        컴포넌트 이동이 확인 되었으면 TodoForm 의 화면 구성을 하고 
        데이터를 입력하고 버튼을 클릭하면 axios 를 이용해서 데이터를 json-server 전달
        오류가 없으면 화면은 router(todos) 를 이용해서 리스트로 화면전환
        -->
        <div class="d-grid gap-2" align="right">
            <button class="btn btn-primary" 
                    type="button"
                    @click="onCreate">CREATE</button>
        </div>
        
        <div style="color :red ;">{{ error }}</div>
        <p/>
        
        <TodoList   :todos="filteredTodos"
                    @toggle-todo="toggleTodo"
                    @delete-todo="onDelete"
                    @open-modal="openModal"/>

        <Alert  v-if="showAlert"
                :message="alertMsg"
                :type="alertType"/>

        <Teleport to="#modal">
            <Modal
                v-if="showModal">
                <template v-slot:title>
                    할 일 삭제하기
                </template>
                <template v-slot:body>
                    정말 삭제하시겠습니까?
                </template>
                <template v-slot:footer>
                    <button type="button" 
                            class="btn btn-secondary" 
                            @click="onClose">Close</button>
                    <button type="button" 
                            class="btn btn-danger"
                            @click="deleteTodo">Delete</button>
                </template>
            </Modal> 
        </Teleport>
    </div>
</template>

<script>
import { ref, computed } from 'vue' ; 
import { useRouter }     from 'vue-router' ; 

// import TodoForm from '@/components/todo/TodoForm.vue';

import TodoList from '@/components/todo/TodoList.vue';
import axios    from '@/axios' ; 
import Alert    from '@/components/alert/AlertComponent.vue' ; 
import Modal    from '@/components/modal/ModalComponent.vue' ; 

import { useToast } from '@/composables/toast' ; 

export default {
    components : {
        // TodoForm,
        TodoList,
        Alert, 
        Modal,
    },
    setup() {
        const todo  = ref('');
        const todos = ref([]);
        const searchTxt = ref('');
        const error = ref('');
        const router = useRouter();
        const showModal = ref(false);
        const dataId = ref('')

        const openModal = (id) => {
            console.log("debug >>> todo id , " ,id);
            dataId.value = id;
            showModal.value = true;
        }

        const { 
            showAlert, alertMsg, alertType , triggerAlert
        } = useToast() ; 


        /*
        getTodos 페이지 로딩시 json-server 부터 모든 데이터를 select 
        axios.get("http://localhost:3000/todos");
        get       - select
        post      - insert
        delete    - delete 
        put|patch - update 
        */
        const getTodos = async () => {
            try {
                const response = await axios.get("todos"); 
                console.log( response.data ); 
                todos.value = response.data ; 
            } catch ( err ) {
                console.log( err  );
                error.value = 'Something went wrong...'; 
            }
        }
        getTodos() ;

        /*
        const onDelete = (index) => {
            console.log("debug >>>> todos delete index , " , index ); 
            todos.value.splice(index, 1); 
        }
        */
        const onDelete = async (index) => {
            console.log("debug >>>> todos delete id , " , index ); 
            error.value = '';
            const id = todos.value[index].id ; 
            try {
                // axios 통신을 통해서 키값을 전달하고 json-server 쪽에서 삭제
                const response = await axios.delete(`todos/${id}`);  
                console.log("debug >>>> todos delete response , " , response );  
                todos.value.splice(index, 1); 
            } catch( err ) {
                console.log( err  );
                error.value = 'Something went wrong...'; 
            } 
            
        }

        const filteredTodos = computed(() => {
            if (searchTxt.value) {
                return todos.value.filter(todo => {
                    return todo.subject.includes(searchTxt.value);
                });
            }
            return todos.value;
        }) ; 

        /*
        기존 배열에 담았던 객체 정보를 
        axios 통신을 통해서 json-server db.json 에 저장하도록 변경 
        const addTodo = (data) => {
            todos.value.push(data); 
        }
        const addTodo = (data) => {
            error.value = '' ;
            axios.post('http://localhost:3000/todos' , {
                id : Date.now(),
                subject : data.subject , 
                completed : data.completed 
            }).then( response => {
                console.log( response );
                console.log( response.data );
                todos.value.push( response.data ); 
            }).catch( err => {
                console.log( err  );
                error.value = 'Something went wrong...'; 
            });
        }
        */

        const addTodo = async (data) => { 
            try {
                const response = await axios.post('todos' , {
                                                    id : Date.now(),
                                                    subject : data.subject , 
                                                    completed : data.completed 
                                                }) ;

                todos.value.push( response.data );
            } catch( err ) {
                console.log( err  );
                error.value = 'Something went wrong...'; 
            }
        }
        /*
        const toggleTodo = (index) => {
            todos.value[index].completed = !todos.value[index].completed;
        }
        update table set completed = ? where id = ?  ;
        axios patch 이용해서 
        */
        
        const toggleTodo = async (index) => {
            
            const key = todos.value[index].id ; 
            const updateData = {
                completed : !todos.value[index].completed
            };
            try {
                const response = await axios.patch(`todos/${key}` , updateData); 
                console.log( response.data ); 
                todos.value[index].completed = response.data.completed ;  
                
                triggerAlert('Successfully checked....' , 'primary'); 
            } catch( err ) {
                console.log( err );
                error.value = 'Something went wrong...'; 
            }
        }


        const onCreate = () => {
            // console.log("debug >>>> Main onCreate click ~~ "); 
            router.push({
                name : 'Create'
            });
        }
        
        const onClose = () => {
            console.log("debug >>>> Modal emit onClose click ~~ ");
            showModal.value = false;
        }

        const deleteTodo = async() => {
            console.log("debug >>>> todos delete id , " , dataId.value ); 
            error.value = '';
            try {
                // axios 통신을 통해서 키값을 전달하고 json-server 쪽에서 삭제
                const response = await axios.delete(`todos/${dataId.value}`);  
                console.log("debug >>>> todos delete response , " , response );
                showModal.value = false;
                //getTodos(); 밑에 코드를 이 코드로 대체사용 가능함.
                for (let idx = todos.value.length -1; idx >= 0; idx--){
                    if(todos.value[idx].id == dataId.value){
                        todos.value.splice(idx, 1);
                    }
                }
                
            } catch( err ) {
                console.log( err  );
                error.value = 'Something went wrong...'; 
            } 
        }

        return {
            todo, 
            todos,
            onDelete,
            filteredTodos,
            addTodo,
            toggleTodo,
            error,
            searchTxt,
            showAlert,
            alertMsg,
            alertType,
            onCreate,
            onClose,
            showModal,
            openModal,
            deleteTodo,
            dataId,
        }
    }
}
</script>

<style>

</style>

