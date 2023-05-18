const form = document.getElementById('login_form')
form.addEventListener('submit', loginUser)

async function loginUser(event){
    event.preventDefault()
    const email = document.getElementById('email').value
    const password = document.getElementById('password').value
    alert("Ваши данные отправлены");
    const result = await fetch('/employee/list',{
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email,
            password
        })
    }).then(res => res.json())
    console.log(result)
}