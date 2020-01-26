import React from 'react'
import { Link } from 'react-router-dom'

export default function() {
    return <section className="landing">
        <h1 className="landing__title">UpBeat</h1>
        <h2 className="landing__slogan">From Musicians, For Musicians</h2>
        <Link className="landing__register" to="/register">Register</Link>
        <Link className="landing__login" to="/login">Login</Link>
    </section>
}