const linkCarro = document.querySelector('.carro')
const Cambio = document.querySelector(".cambio")
const documentacion = document.querySelector(".documentacion")
const obtenerUserId = async()=>{
  try {
    const response = await fetch('/api/users/buscarId');
    if (!response.ok) {
      throw new Error('Error al obtener el usuario');
    }
    const usuario = await response.json();
  
    return usuario;
  } catch (error) {
    return null;
  }
}
  const obtenerCarrito = async () =>{
  try {
    const response = await fetch('/api/carts');
    if (!response.ok) {
      throw new Error('Error al obtener el carrito');
    }

    const carrito = await response.json();
  
    return carrito;
  } catch (error) {
    return null;
  }
}

document.addEventListener('DOMContentLoaded', async() => {
  const userId = await obtenerUserId()
  const carro = await obtenerCarrito();
    linkCarro.href = `/api/carts/${carro}`
    Cambio.href = `/api/users/premium/${userId}`
    documentacion.href = `/api/users/${userId}/documents`
});