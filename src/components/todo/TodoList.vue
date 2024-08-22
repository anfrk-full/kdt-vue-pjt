<template>

    <div    v-for="(data , index) in todos" 
            :key="data.id"
            class="card mt-2">
        <div    class="card-body p-2 d-flex align-items-center" 
                @click="moveToView(data.id)"
                style="cursor : pointer">

            <div class="form-check flex-grow-1">
                <input  type="checkbox" 
                        class="form-check-input"
                        :checked="data.completed"
                        @change="toggleTodo(index)"
                        @click.stop>  
                <label  class="form-check-label"
                        :style="data.completed ? todoStyle : {}">
                    {{ data.subject }} 
                </label>
            </div>
            <div>
                <button     class="btn btn-danger btn-sm"
                            @click.stop="openModal(data.id)">
                    Delete
                </button>
            </div>
        </div>
    </div>

</template>

<script>

import { useRouter } from 'vue-router' ; 
export default {
    props : {
        todos : {
            type : Array , 
            required : true 
        }
    } , 
    emits : ['toggle-todo','delete-todo'],
    setup(props, context) {
        const router = useRouter(); 

        const moveToView = (todoId)  => {
            // router.push(`todos/${todoId}`);
            router.push({
                name : 'Todo',
                params : {
                    id : todoId
                }
            });
        }


        const todoStyle = {
            textDecoration : 'line-through' , 
            color : 'gray'
        }
        const toggleTodo = (index) => {
            context.emit('toggle-todo' , index) ;
        }
        const onDelete = (index) => {
            context.emit('delete-todo' , index) ;
        }

        const openModal = (id) => {
            context.emit('open-modal' , id);
        }


        return {
            todoStyle,
            toggleTodo,
            onDelete,
            moveToView,
            openModal,
        }
    }
}
</script>

<style>

</style>