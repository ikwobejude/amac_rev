
let form = document.querySelector('#form1')
// const formerror = document.querySelector('.error');
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    // formerror.textContent = '';


    const building_type = form.business_size.value;
    let dtx = {
        title: form.title.value,
        id: '',
        url: form.formUrl.value
    }

    console.log(building_type)

    try {
        let res = await fetch('/admin/business_size', {
            method: "POST",
            body: JSON.stringify(dtx),
            headers: { 'Content-Type': 'application/json' }
        })

        const data = await res.json();
        if (data.status == "error") {
            // formerror.textContent = data.err;
            var notify = $.notify('<i class="fa fa-warning"></i><strong>' + data.error + '</strong>.', {
                type: 'danger',
                allow_dismiss: true,
                delay: 5000,
                showProgressbar: true,
                timer: 300
            });


        } else {

            var notify = $.notify('<i class="fa fa-bell-o"></i><strong>' + data.message + '</strong>', {
                type: 'theme',
                allow_dismiss: true,
                delay: 2000,
                showProgressbar: true,
                timer: 1000
            });

            setTimeout(function () {
                location.reload()
            }, 1000);

        }
    } catch (error) {
        var notify = $.notify('<i class="fa fa-warning"></i><strong>' + error.message + '</strong>.', {
            type: 'danger',
            allow_dismiss: true,
            delay: 5000,
            showProgressbar: true,
            timer: 300
        });
    }
})



async function edit(id, ebusiness_size) {
    $('#ebusiness_size').val(ebusiness_size);
    $('#id').val(id);

    $('#exampleModal').modal('show');
}

let form1 = document.querySelector('#update_form2');
form1.addEventListener('submit', async (e) => {
    e.preventDefault();
    let dtx = JSON.stringify({ business_size: form1.ebusiness_size.value, id: form1.id.value });
    console.log(dtx)
    try {
        let res = await fetch('/admin/business_size', {
            method: "put",
            body: dtx,
            headers: { 'Content-Type': 'application/json' }
        })

        const data = await res.json();
        if (data.status == "error") {
            // formerror.textContent = data.err;
            var notify = $.notify('<i class="fa fa-warning"></i><strong>' + data.error + '</strong>.', {
                type: 'danger',
                allow_dismiss: true,
                delay: 5000,
                showProgressbar: true,
                timer: 300
            });


        } else {

            var notify = $.notify('<i class="fa fa-bell-o"></i><strong>' + data.message + '</strong>', {
                type: 'theme',
                allow_dismiss: true,
                delay: 2000,
                showProgressbar: true,
                timer: 1000
            });

            setTimeout(function () {
                location.reload()
            }, 1000);

        }
    } catch (error) {
        console.log(error)
        var notify = $.notify('<i class="fa fa-warning"></i><strong>' + error.message + '</strong>.', {
            type: 'danger',
            allow_dismiss: true,
            delay: 5000,
            showProgressbar: true,
            timer: 300
        });
    }
})

