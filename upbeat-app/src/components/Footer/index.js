import React from 'react'


export default function({onLogout, onFavs, onEdit, onAccount, onSearch}) {
    return <footer className="footer">
        <form className="footer__modify" onSubmit={event => { event.preventDefault(); onAccount() }}><button><i className="far fa-user"></i></button></form>
        <form className="footer__favs" onSubmit={event => { event.preventDefault(); onFavs() }}><button><i className="fas fa-hand-holding-heart"></i></button></form>
        <form className="footer__search" onSubmit={event => { event.preventDefault(); onSearch() }}><button><i className="fas fa-search"></i></button></form>
        <form className="footer__modify" onSubmit={event => { event.preventDefault(); onEdit() }}><button><i className="fas fa-user-cog"></i></button></form>
        <form className="footer__logout" onSubmit={event => { event.preventDefault(); onLogout() }}><button><i className="fas fa-sign-out-alt"></i></button></form>
        </footer>
}
