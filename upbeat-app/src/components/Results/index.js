import React, { useEffect, useState } from 'react'
import ResultsItem from '../Results-item'
import { retrieveUser, toggleFavs } from '../../logic'

export default function ({ control ,setControl, results, onDetail, onToggleFavs }) {
    const [user, setUser] = useState()
    const { token } = sessionStorage

    async function handleToggleFavs(favId) {
        try {
            await toggleFavs(token, favId)
            const user = await retrieveUser(token)
            setUser({...user, user:{favs:user.favs}})
            control&&setControl(Math.random())
        }
         catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        try {
            if (token) {
                (async () => {

                    setUser(await retrieveUser(token))

                    
                })()
            }
        } catch (error) {
            console.log(error)
        }
    },[])
    return <> {user && <ul className="results">
        {results ? results.map(result => <li className="task-list__item" key={result.id}><ResultsItem result={result} onDetail={onDetail} onToggleFavs={handleToggleFavs} favs={user.favs} /></li>) : <></>}

    </ul>}</>



}
// {results && results.map(result => <li className="results__item" key={result.id}><ResultsItem result={result} /></li>)}