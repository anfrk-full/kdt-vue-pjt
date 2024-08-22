<template>
    <div class="container">
        <div class="modal-wrapper">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">
                            <slot name="title"></slot>
                        </h5>
                        <button type="button" 
                                class="close" 
                                data-dismiss="modal" 
                                aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <slot name="body"></slot>
                    </div>
                    <div class="modal-footer">
                        <slot name="footer"></slot>
                        <!--
                        <button type="button" 
                                class="btn btn-secondary" 
                                @click="onClose">Close</button>
                        <button type="button" 
                                class="btn btn-danger"
                                @click="onDelete">Delete</button>>
                        -->
                    </div>
                </div>
            </div>
        </div>
    </div>
  
</template>

<script>
export default {
    /*
    emits : ['close'], 
    setup(props , {emit}) {
        const onClose = () => {
            emit('close');
        }
        const onDelete = () => {
            emit('delete');
        }
        return {
            onClose,
            onDelete
        }
    }
        */
    setup() {
        
    }
}
</script>

<style>
    .modal-wrapper {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0,0,0,0.5);
    }
</style>