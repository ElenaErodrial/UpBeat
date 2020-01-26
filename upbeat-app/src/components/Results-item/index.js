import React from 'react'
import Detail from '../Detail'

export default function ({result , onDetail, onToggleFavs,  favs}) {
    const { username, format, image, rol, location} = result

    return <>{result && <a href="#" className="item" onClick={event => {event.preventDefault()

onDetail(result.id)    
}}>
    { rol === "solo" && <img className="item__image" src={image ? image : "images/default/solo.jpg"}/>}
    { rol === "groups" && <img className="item__image" src={image ? image : "images/default/groups.jpg"}/>}
    <div className="item__contdata">
        <a href='' onClick={event => {
             event.preventDefault()
             event.stopPropagation()
             onToggleFavs(result.id)
        }}><i className="far fa-heart" id={favs.includes(result.id) ? "fav" : ""}></i></a>
        <h2 className="item__contdata-username">{username}</h2>
        <h3 className="item__contdata-position">{format.groups ? format.groups : format.instruments.join() }</h3>
        <div className="location-container">
            <i className="fas fa-map-marker-alt"></i>
            <p className="profile__ubication">{location}</p>
        </div>
    </div>
</a> }</>
}

