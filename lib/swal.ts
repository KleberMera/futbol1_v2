import Swal from 'sweetalert2'

export const swal = Swal.mixin({
  background: '#06102a',
  color: '#ffffff',
  confirmButtonColor: '#ff7a00',
  cancelButtonColor: '#1f2a44',
  customClass: {
    popup: 'rounded-3xl border border-white/10 shadow-2xl',
    title: 'text-xl font-bold tracking-tight',
    confirmButton: 'rounded-full px-6 py-2.5 text-sm font-bold uppercase tracking-wider',
    cancelButton: 'rounded-full px-6 py-2.5 text-sm font-bold uppercase tracking-wider',
  },
  buttonsStyling: true,
})

export const showLoading = (title = 'Cargando...') => {
  return swal.fire({
    title,
    allowOutsideClick: false,
    didOpen: () => {
      swal.showLoading()
    },
  })
}

export const showError = (message: string) => {
  return swal.fire({
    icon: 'error',
    title: '¡Ups!',
    text: message,
    confirmButtonText: 'Entendido',
  })
}

export const showSuccess = (message: string) => {
  return swal.fire({
    icon: 'success',
    title: '¡Éxito!',
    text: message,
    timer: 2000,
    showConfirmButton: false,
  })
}

export const showInfo = (title: string, message: string) => {
  return swal.fire({
    icon: 'info',
    title: title,
    text: message,
    confirmButtonText: 'Entendido',
    timer: 3000,
    timerProgressBar: true,
  })
}

export const showConfirm = (title: string, text: string, confirmText = 'Sí, continuar') => {
  return swal.fire({
    title,
    text,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: 'Cancelar',
  })
}
