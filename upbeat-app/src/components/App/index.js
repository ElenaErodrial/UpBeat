import React, { useState, useEffect } from 'react';
import './index.sass'
import Landing from '../Landing'
import Register from '../Register'
import Login from '../Login'
import Header from '../Header'
import Search from '../Search'
import Footer from '../Footer'
import Detail from '../Detail'
import Account from '../Account'
import EditProfile from '../Edit-profile'
import Favs from '../Favs'
import { Route, withRouter, Redirect } from 'react-router-dom'
import { authenticateUser, registerUser, retrieveUser, searchUsers, retrieveMusician, editProfile, retrieveFavs, toggleFavs } from '../../logic/'


export default withRouter(function ({ history }) {
    const [username, setUsername] = useState()
    const [user, setUser] = useState(undefined)
    const [result, setResult] = useState([])
    const [favs, setFavs] = useState([])
    const [musician, setMusician] = useState({})
    const [render, setRender] = useState(true)
    const { token } = sessionStorage;

    useEffect(() => {
         
        
        (async () => {
            if (token) {
                
                const user = await retrieveUser(token)
                setUsername(user.username)
                setUser(user)


            }
        })()
    }, [ render])




    async function handleRegister(username, email, password, rol, groups, instruments, location) {
        try {
            await registerUser(username, email, password, rol, groups, instruments, location)

            history.push('/login')
        } catch (error) {
            console.error(error)
        }
    }

    async function handleLogin(email, password) {
        try {
            sessionStorage.token = await authenticateUser(email, password)

            setRender(!render)
            

            history.push('/search')
        
        } catch (error) {
            console.error(error)
        }
    }

    

    async function handleSearch(query) {
        

        try {
            if (query) {const result = await searchUsers(query) 
                
                
                setResult(result)
    
            } else {setResult([])}
            }   
            
         catch (error) {
            console.error(error)
        }

    }

    async function handleFavs() {


        try {
            const { favs } = await retrieveFavs(token) 
                
            setFavs(favs) 
            history.push('/favs') 

        }
         catch (error) {
            console.error(error)
        }

    }

    async function handleToggleFavs(favId) {


        try {
            
            await toggleFavs(token, favId)
            const { favs } = await retrieveFavs(token) 
            
            setFavs(favs) 
            setRender(!render)
            
          
        }
         catch (error) {
            console.error(error)
        }

    }
    
    async function handleDetail(id) {

        try {

            setUser(await retrieveUser(token))
            const musician = await retrieveMusician(id)
            setMusician(musician)

            history.push(`/detail/${musician.id}`)
        }
            catch (error) {
                console.error(error)
        }
            
    }

    function handleGoBack() { history.push('/') }

    function handleLogout() {
        sessionStorage.clear()
        setResult([])
        handleGoBack()
    }

    function handleGoToEdit() { 
        history.push('/edit') 
    }


    function handleGoToSearch() { 
        history.push('/search') 
    }

    async function handleEdit(id, username, email, description, upcomings, location, links) { 
        
        try { 

            await editProfile(id, token, username, email, description, upcomings, location, links)
            const user = await retrieveUser(token)
            setUser(user)
            setRender(!render)
            history.push('/') 
        }
            catch (error) {
                console.error(error)
        }
            
    }

    function handleGoToAccount() {
        history.push('/account')
    }

    async function handleAccount(token) {

        try {
            
            const user = await retrieveUser(token)
            
        }
            catch (error) {
                console.error(error)
        }
            
    }

   
        



    return <>
        <Route exact path="/" render={() => token ? <Redirect to="/search" /> : <Landing />} />
        
        <Route path="/register" render={() => token ? <Redirect to="/search" /> : <><Header /><Register onRegister={handleRegister} /> </>} />
        
        <Route path="/login" render={() => token ? <Redirect to="/search" /> : <><Header /><Login onLogin={handleLogin} /> </>} />
        
        <Route path="/search" render={() => token ? <><Header /><Search username={username} onSearch={handleSearch} results={result} onDetail={handleDetail} onToggleFavs={handleToggleFavs} /><Footer onLogout={handleLogout} onEdit={handleGoToEdit} onAccount={handleGoToAccount} onFavs={handleFavs} onSearch={handleGoToSearch} /> </> : <Redirect to="/" />} />
        
        <Route path="/favs" render={() => token ? <><Header /><Favs username={username} onFavs={handleFavs} onDetail={handleDetail} onToggleFavs={handleToggleFavs} /><Footer onLogout={handleLogout} onEdit={handleGoToEdit} onAccount={handleGoToAccount} onFavs={handleFavs} onSearch={handleGoToSearch}/> </> : <Redirect to="/" />} />
        
        <Route path="/detail/:id" render={() => token && user? <><Header /><Detail onToggleFavs = {handleToggleFavs} musician={musician} favs = {user.favs} /><Footer onLogout={handleLogout} onEdit={handleGoToEdit} onAccount={handleGoToAccount} onFavs={handleFavs} onSearch={handleGoToSearch}/> </> : <Redirect to= "/" />} />
        
        <Route path="/edit" render={() => token && user ? <><Header /><EditProfile  user={user} onEdit={handleEdit}/> <Footer onLogout={handleLogout} onEdit={handleGoToEdit} onAccount={handleGoToAccount} onFavs={handleFavs} onSearch={handleGoToSearch} /> </>: <Redirect to= "/" />}/>
        
        <Route path="/account" render={() => token && user ? <><Header /><Account onAccount={handleAccount} user={user}/><Footer onLogout={handleLogout} onEdit={handleGoToEdit} onAccount={handleGoToAccount} onFavs={handleFavs} onSearch={handleGoToSearch}/> </> :  <Redirect to= "/" />  }/>        
    </>
})