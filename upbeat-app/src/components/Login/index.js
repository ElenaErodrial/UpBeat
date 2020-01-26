import React from 'react'
import { Link } from 'react-router-dom'

export default function({onLogin, error}) {
return <section className="login">
<h1 className="login__title">Login</h1>

<form className="login-form" onSubmit={event=> {
            event.preventDefault()

            const { email: { value: email },  password: { value: password } } = event.target

            onLogin(email, password)
        }}>

    <input className="login-form__email" type="email" name="email" autoFocus placeholder="e-mail"/>
    <input className="login-form__password" type="password" name="password" placeholder="password"/>
    <button className="login-form__submit">Submit</button>
    <Link className="login-form__register" to="/register">Create an account</Link>

   
</form>

</section>


}
