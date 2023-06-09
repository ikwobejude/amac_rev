
const makePayment = document.getElementById('makePayment');
let subPay = document.getElementById('subPay');

makePayment.addEventListener('submit', async(e) => {
  e.preventDefault();
  subPay.textContent = "Please wait..."
  const inputData = {
    full_name: makePayment.full_name.value,
    email: makePayment.email.value,
    // phone: makePayment.phone.value,
    amount: makePayment.amount.value,
    invoice_number: makePayment.invoice_number.value
  }
  console.log(inputData)
  subPay.textContent = 'Make Payment';
  try {
    const res = await fetch('/api/get_payment_page', {
      method: "post",
      body: JSON.stringify(inputData),
      headers: {'Content-Type': 'application/json'}
    })

    const data = await res.json();
    console.log(data)

    if(data.status == false){
      Swal.fire({
        icon: 'error',
        title: data.message,
        text: 'Something went wrong!',
      })
    } 

    if(data.status == true){
      location.assign(data.redirectUrl)
    }

  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: error.message,
      text: 'Something went wrong!',
    })
  }
})
