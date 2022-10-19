<template>
    <div class="modal fade">
        <div class="modal-dialog">
            <div class="modal-content">

                <!-- Modal Header -->
                <div class="modal-header">
                    <h4 class="modal-title">Modal Heading</h4>
                    <button type="button" class="close">&times;</button>
                </div>

                <!-- Modal body -->
                <div class="modal-body">
                    Modal body..
                </div>

                <!-- Modal footer -->
                <div class="modal-footer">
                    <button type="button" class="btn btn-danger" @click="$emit('update:alert_modal', false)">Close</button>
                </div>

            </div>
        </div>
    </div>
</template>

<script>
export default {
    setup() {
        
    },
}
</script>