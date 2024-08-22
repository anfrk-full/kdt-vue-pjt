import { createRouter , createWebHistory } from 'vue-router' ; 

import Home   from '@/todos/pages/TodoIndex.vue' ; 
import Todos  from '@/todos/pages/component/TodosMain.vue' ; 
import Todo   from '@/todos/pages/component/TodoView.vue' ; 
import Create from '@/todos/pages/component/TodoCreate.vue' ;  

import Login  from '@/components/login/UserLogin.vue' ; 

const router = createRouter({
    history: createWebHistory() , 
    routes : [
        {
            path : '/',
            name : 'Home',
            component : Home 
        },
        {
            path : '/todos',
            name : 'Todos',
            component : Todos 
        },
        {
            path : '/todos/:id',
            name : 'Todo',
            component : Todo 
        },
        {
            path : '/login',
            name : 'Login',
            component : Login 
        },
        {
            path : '/todos/create',
            name : 'Create',
            component : Create 
        },
    ]
});
export default router  ;
