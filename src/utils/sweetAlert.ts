import Swal from 'sweetalert2';
import "@/styles/popup.css";

//-------------------- GENERAL ALERTS -------------------//

// ----- Close Without Saving Confirmation ----- //
export const showCloseWithoutSavingConfirmation = () => {
    return Swal.fire({
        title: 'Unsaved Changes',
        html: '<p>You have unsaved changes. Are you sure you want to close without saving?</p>',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Close Without Saving',
        cancelButtonText: 'Go Back',
        background: 'white',
        reverseButtons: true,
        customClass: {
            popup: 'swal-custom-popup'
        }
    });
};

// ----- Close Without Updating Confirmation -----
export const showCloseWithoutUpdatingConfirmation = () => {
    return Swal.fire({
        title: 'Unsaved Changes',
        html: '<p>You have unsaved changes. Are you sure you want to close without updating?</p>',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Close Without Updating',
        cancelButtonText: 'Go Back',
        background: 'white',
        reverseButtons: true,
        customClass: {
            popup: 'swal-custom-popup'
        }
    });
};

//-------------------- STOCK MANAGEMENT SPECIFIC -------------------//

// ----- Add Stock Confirmation ----- //
export const showStockSaveConfirmation = (count: number) => {
    const message =
        count > 1
            ? `Are you sure you want to save these ${count} items?`
            : `Are you sure you want to save this item?`;

    return Swal.fire({
        title: 'Confirm Save',
        html: `<p>${message}</p>`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Save',
        cancelButtonText: 'Cancel',
        background: 'white',
        reverseButtons: true,
        customClass: {
            popup: 'swal-custom-popup'
        }
    });
};

// ----- Add Stock Success ----- //
export const showStockSavedSuccess = (count: number) => {
    const message =
        count > 1
            ? `${count} items added successfully.`
            : `Item added successfully.`;

    return Swal.fire({
        icon: 'success',
        title: 'Saved!',
        html: `<p>${message}</p>`,
        background: 'white',
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
        customClass: {
            popup: 'swal-custom-popup'
        }
    });
};

// ----- Duplicate Item Error ----- //
export const showDuplicateItemError = () => {
    return Swal.fire({
        title: 'Duplicate Item',
        text: 'This item is already selected in another form. Please select a different item.',
        icon: 'error',
        confirmButtonText: 'Okay',
        background: 'white',
        customClass: {
            popup: 'swal-custom-popup'
        }
    });
};

// ----- Stock Save Error ----- //
export const showStockSaveError = (errorMessage?: string) => {
    return Swal.fire({
        title: '',
        html: errorMessage || 'Failed to save stock items. Please try again.',
        icon: 'error',
        confirmButtonText: 'Okay',
        background: 'white',
        customClass: {
            popup: 'swal-custom-popup'
        }
    });
};

// ----- Partial Success Warning ----- //
export const showPartialSuccessWarning = () => {
    return Swal.fire({
        title: 'Partial Success',
        text: 'Some items were saved successfully, but others failed. Please check the results.',
        icon: 'warning',
        confirmButtonText: 'Okay',
        background: 'white',
        customClass: {
            popup: 'swal-custom-popup'
        }
    });
};

// ----- Edit Stock Confirmation ----- //
export const showStockUpdateConfirmation = (item_name: string) => {
    return Swal.fire({
        title: 'Confirm Update',
        html: `<p>Are you sure you want to update the stock details for <strong>${item_name}</strong>?</p>`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Update',
        cancelButtonText: 'Cancel',
        background: 'white',
        reverseButtons: true,
        customClass: {
            popup: 'swal-custom-popup'
        }
    });
};

// ----- Edit Stock Success ----- //
export const showStockUpdatedSuccess = () => {
    return Swal.fire({
        title: 'Updated!',
        text: 'Stock details has been updated.',
        icon: 'success',
        background: 'white',
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
        customClass: {
            popup: 'swal-custom-popup'
        }
    });
};

// ----- Delete Stock Confirmation ----- //
export const showStockDeleteConfirmation = (item_name: string) => {
    return Swal.fire({
        title: 'Confirm Deletion',
        html: `<p>Are you sure you want to delete <strong>${item_name}</strong>? You will not be able to undo this.</p>`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel',
        background: 'white',
        reverseButtons: true,
        customClass: {
            popup: 'swal-custom-popup'
        }
    });
};

// ----- Delete Stock Success ----- //
export const showStockDeletedSuccess = (item_name: string) => {
    return Swal.fire({
        title: 'Deleted!',
        html: `<p><strong>${item_name}</strong> has been deleted.</p>`,
        icon: 'success',
        background: 'white',
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
        customClass: {
            popup: 'swal-custom-popup'
        }
    });
};

// ----- Remove Expired Confirmation ----- //
export const showDeleteExpiredConfirmation = (batch_id: string) => {
    return Swal.fire({
        title: 'Remove Expired Item',
        html: 
            `<p>Are you sure you want to delete this expired batch? You will not be able to undo this.</p>
            <span id="hidden-batch-id" style="display: none;">${batch_id}</span>`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel',
        background: 'white',
        reverseButtons: true,
        customClass: {
            popup: 'swal-custom-popup'
        }
    });
};

// ----- Remove Expired Success ----- //
export const showDeleteExpiredSuccess = (batch_id: string) => {
    return Swal.fire({
        title: 'Deleted!',
        html: `<p>An expired item has been deleted.</p>
                <span id="hidden-batch-id" style="display: none;">${batch_id}</span>`,
        icon: 'success',
        background: 'white',
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
        customClass: {
            popup: 'swal-custom-popup'
        }
    });
};



//-------------------- REQUEST MANAGEMENT SPECIFIC -------------------//

// ----- Add Request Confirmation ----- //
export const showRequestSaveConfirmation = (count: number) => {
    const message =
        count > 1
            ? `Are you sure you want to save these ${count} item requests?`
            : `Are you sure you want to save this item request?`;

    return Swal.fire({
        title: 'Confirm Save',
        html: `<p>${message}</p>`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Save',
        cancelButtonText: 'Cancel',
        background: 'white',
        reverseButtons: true,
        customClass: {
            popup: 'swal-custom-popup'
        }
    });
};

// ----- Add Request Success ----- //
export const showRequestSavedSuccess = (count: number) => {
    const message =
        count > 1
            ? `${count} item requests added successfully.`
            : `Item request added successfully.`;

    return Swal.fire({
        icon: 'success',
        title: 'Saved!',
        html: `<p>${message}</p>`,
        background: 'white',
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
        customClass: {
            popup: 'swal-custom-popup'
        }
    });
};

// ----- Edit Request Confirmation ----- //
export const showRequestUpdateConfirmation = (itemName: string) => {
    return Swal.fire({
        title: 'Confirm Update',
        html: `<p>Are you sure you want to update the request details for <strong>${itemName}</strong>?</p>`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Update',
        cancelButtonText: 'Cancel',
        background: 'white',
        reverseButtons: true,
        customClass: {
            popup: 'swal-custom-popup'
        }
    });
};

// ----- Edit Request Success ----- //
export const showRequestUpdatedSuccess = () => {
    return Swal.fire({
        title: 'Updated!',
        text: 'Item request has been updated.',
        icon: 'success',
        background: 'white',
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
        customClass: {
            popup: 'swal-custom-popup'
        }
    });
};

// ----- Delete Request Confirmation ----- //
export const showRequestDeleteConfirmation = (itemName: string) => {
    return Swal.fire({
        title: 'Confirm Deletion',
        html: `<p>Are you sure you want to delete the request for <strong>${itemName}</strong>? You will not be able to undo this.</p>`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel',
        background: 'white',
        reverseButtons: true,
        customClass: {
            popup: 'swal-custom-popup'
        }
    });
};

// ----- Delete Request Success ----- //
export const showRequestDeletedSuccess = () => {
    return Swal.fire({
        title: 'Deleted!',
        text: 'Item request has been deleted.',
        icon: 'success',
        background: 'white',
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
        customClass: {
            popup: 'swal-custom-popup'
        }
    });
};


//-------------------- ORDER MANAGEMENT SPECIFIC -------------------//

// ----- Add Order Confirmation ----- //
export const showOrderSaveConfirmation = () => {
    return Swal.fire({
        title: 'Confirm Save',
        text: 'Are you sure you want to save this order request?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Save',
        cancelButtonText: 'Cancel',
        background: 'white',
        reverseButtons: true,
        customClass: {
            popup: 'swal-custom-popup'
        }
    });
};

// ----- Add Order Success ----- //
export const showOrderSavedSuccess = () => {
    return Swal.fire({
        icon: 'success',
        title: 'Saved!',
        text: 'Order added successfully.',
        background: 'white',
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
        customClass: {
            popup: 'swal-custom-popup'
        }
    });
};

// ----- Edit Order Confirmation ----- //
export const showOrderUpdateConfirmation = (itemName: string) => {
    return Swal.fire({
        title: 'Confirm Update',
        html: `<p>Are you sure you want to update the order details for <strong>${itemName}</strong>?</p>`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Update',
        cancelButtonText: 'Cancel',
        background: 'white',
        reverseButtons: true,
        customClass: {
            popup: 'swal-custom-popup'
        }
    });
};

// ----- Edit Order Success ----- //
export const showOrderUpdatedSuccess = () => {
    return Swal.fire({
        title: 'Updated!',
        text: 'Order detail has been updated.',
        icon: 'success',
        background: 'white',
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
        customClass: {
            popup: 'swal-custom-popup'
        }
    });
};

// ----- Delete Order Confirmation ----- //
export const showOrderDeleteConfirmation = (itemName: string) => {
    return Swal.fire({
        title: 'Confirm Deletion',
        html: `<p>Are you sure you want to delete the order for <strong>${itemName}</strong>? You will not be able to undo this.</p>`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel',
        background: 'white',
        reverseButtons: true,
        customClass: {
            popup: 'swal-custom-popup'
        }
    });
};

// ----- Delete Order Success ----- //
export const showOrderDeletedSuccess = () => {
    return Swal.fire({
        title: 'Deleted!',
        text: 'Order for has been deleted.',
        icon: 'success',
        background: 'white',
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
        customClass: {
            popup: 'swal-custom-popup'
        }
    });
};


//-------------------- BUS MANAGEMENT SPECIFIC -------------------//

// ----- Add Bus Confirmation ----- //
export const showBusSaveConfirmation = () => {
    return Swal.fire({
        title: 'Confirm Save',
        text: 'Are you sure you want to save this bus details?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Save',
        cancelButtonText: 'Cancel',
        background: 'white',
        reverseButtons: true,
        customClass: {
            popup: 'swal-custom-popup'
        }
    });
};

// ----- Add Bus Success ----- //
export const showBusSavedSuccess = () => {
    return Swal.fire({
        icon: 'success',
        title: 'Saved!',
        text: 'Bus added successfully.',
        background: 'white',
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
        customClass: {
            popup: 'swal-custom-popup'
        }
    });
};

// ----- Edit Bus Confirmation ----- //
export const showBusUpdateConfirmation = (bodyNumber: string) => {
    return Swal.fire({
        title: 'Confirm Update',
        html: `<p>Are you sure you want to update the bus details for <strong>${bodyNumber}</strong>?</p>`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Update',
        cancelButtonText: 'Cancel',
        background: 'white',
        reverseButtons: true,
        customClass: {
            popup: 'swal-custom-popup'
        }
    });
};

// ----- Edit Bus Success ----- //
export const showBusUpdatedSuccess = () => {
    return Swal.fire({
        title: 'Updated!',
        text: 'Bus detail has been updated.',
        icon: 'success',
        background: 'white',
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
        customClass: {
            popup: 'swal-custom-popup'
        }
    });
};


//-------------------- GENERATE REPORT SPECIFIC -------------------//
export const showGenerateReportConfirmation = () => {
    return Swal.fire({
        title: 'Generate Report',
        html: '<p>Are you sure you want to generate a report with the current data?</p>',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Generate Report',
        cancelButtonText: 'Cancel',
        background: 'white',
        confirmButtonColor: '#961C1E',
        cancelButtonColor: '#ECECEC',
        customClass: {
            popup: 'swal-custom-popup'
        }
    });
};

export const showReportGeneratedSuccess = () => {
    return Swal.fire({
        icon: 'success',
        title: 'Report Generated!',
        text: 'Your report has been generated successfully.',
        confirmButtonColor: '#961C1E',
        background: 'white',
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
        customClass: {
            popup: 'swal-custom-popup'
        }
    });
};
