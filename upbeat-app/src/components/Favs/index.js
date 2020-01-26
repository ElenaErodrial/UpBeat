import React, {useState, useEffect} from 'react'


import Results from '../Results'
import {retrieveFavs, toggleFavs} from '../../logic'

export default function ({ username, onDetail }) {
    const [favs, setFavs] = useState([])
    const [control, setControl]= useState(Math.random())
    const { token } = sessionStorage

    async function handleToggleFavs(favId) {
        try {
            await toggleFavs(token, favId)
            setControl(!control)
        }
         catch (error) {
            console.error(error)
        }
    }
    useEffect(()=>{
        try{
            if(token){
                (async ()=>{
                    const { favs } = await retrieveFavs(token) 
                    
                    setFavs(favs)
                })()
            }
        }catch({message}){
            console.error(message)
        }
    },[control])
    return <>
        <section className="search">
            <p className='greeting'>Hello, {username}! Your favorites:  </p>
            <Results control={control} setControl={setControl}results={favs} onDetail = {onDetail} onToggleFavs={handleToggleFavs} />
    
        </section>
    </>
}