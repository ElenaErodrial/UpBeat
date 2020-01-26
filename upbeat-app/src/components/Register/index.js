import React from 'react'
import { Link } from 'react-router-dom'


export default function ({ onRegister, error }) {
    return <>
        <section className="register">

            <h1 className="register__title">Register</h1>
            <h2 className="register__intro">New at UpBeat?</h2>
            <h2 className="register__intro">Create an account, it's easy and free!</h2>
            <div className="line"></div>
            <form className="register-form" onSubmit={event=> {
                
                event.preventDefault()
                
                let instruments = [] 

                const { username: { value: username }, email: { value: email }, password: { value: password }, rol: { value: rol }, groups: {value: groups}, location: { value: location}  } = event.target

                if(event.target.drums.checked) instruments.push('drums')
                if(event.target.guitar.checked) instruments.push('guitar')
                if(event.target.piano.checked) instruments.push('piano')
                if(event.target.violin.checked) instruments.push('violin')
                if(event.target.bass.checked) instruments.push('bass')
                if(event.target.cello.checked) instruments.push('cello')
                if(event.target.clarinet.checked) instruments.push('clarinet')
                if(event.target.doublebass.checked) instruments.push('double-bass')
                if(event.target.flute.checked) instruments.push('flute')
                if(event.target.saxophone.checked) instruments.push('saxophone')
                if(event.target.trombone.checked) instruments.push('trombone')
                if(event.target.trumpet.checked) instruments.push('trumpet')
                if(event.target.ukelele.checked) instruments.push('ukelele')
                if(event.target.viola.checked) instruments.push('viola')
                if(event.target.voice.checked) instruments.push('voice')

                // if(event.target.band.checked) groups = "band"
                // if(event.target.choir.checked) groups = "choir"
                // if(event.target.modernEnsemble.checked) groups = "modern-ensemble"
                // if(event.target.orchestra.checked) groups = "orchestra"
                // if(event.target.classicChamber.checked) groups = "classic-chamber"


                onRegister(username, email, password, rol, groups, instruments, location)
            }}>


                <input className="register-form__username" type="username" name="username" placeholder="user or artistic name" />
                <input className="register-form__email" type="email" name="email" placeholder="e-mail" />
                <input className="register-form__password" type="password" name="password" placeholder="password" />
                <p className="instructions">Your city: </p>
                <input className="register-form__location" type="location" name="location" placeholder="city" />
                <div className="checking-container">
                    <p className="instructions">Are you a single musician or a group?</p>

                    <label>Single musician</label>
                    <input className="register-form__option" id="type-single" type="radio"
                        name="rol" value="solo" />
                    <br />
                    <label>Group</label>
                    <input className="register-form__option" id="type-groups" type="radio" name="rol" value="groups" />

                    <div className="type-groups">
                        <p className="instructions">Select your type of group</p>
                        <div className="checkbox-container">
                            <select name="groups">

                                <option value="band" defaultValue>Band</option>
                                <option value="choir">Choir</option>
                                <option value="modernEnsemble">Modern ensemble</option>
                                <option value="orchestra">Orchestra</option>
                                <option value="classicChamber">Classic chamber</option>

                            </select>



                            {/* 

                            <label>Band</label><input className="register-form__option" type="radio"
                                name="groups" value="band" />
                            <label>Choir</label><input className="register-form__option" type="radio"
                                name="groups" value="choir" />
                            <label>Modern ensemble</label><input className="register-form__option"
                                type="radio" name="groups" value="modern ensemble" />
                            <label>Orchestra</label><input className="register-form__option" type="radio"
                                name="groups" value="orchestra" />
                            <label>Classic chamber</label><input className="register-form__option" type="radio"
                                name="groups" value="classic chamber" /> */}
                        </div>
                    </div>

                    <div className="type-single">
                        <p className="instructions">Please, select the instruments you play:</p>
                        <div className="checkbox-container">
                            <label><input className="register-form__option" type="checkbox" name="drums"
                                value="drums" />Drums</label>
                            <label><input className="register-form__option" type="checkbox" name="guitar"
                                value="guitar" />Guitar</label>
                            <label><input className="register-form__option" type="checkbox" name="piano"
                                value="piano" />Piano</label>
                            <label><input className="register-form__option" type="checkbox" name="violin"
                                value="violin" />Violin</label>
                            <label><input className="register-form__option" type="checkbox" name="bass"
                                value="bass" />Bass</label>
                            <label><input className="register-form__option" type="checkbox" name="cello"
                                value="cello" />Cello</label>
                            <label><input className="register-form__option" type="checkbox" name="clarinet"
                                value="clarinet" />Clarinet</label>
                            <label><input className="register-form__option" type="checkbox" name="doublebass"
                                value="doublebass" />Double-bass</label>
                            <label><input className="register-form__option" type="checkbox" name="flute"
                                value="flute" />Flute</label>
                            <label><input className="register-form__option" type="checkbox" name="saxophone"
                                value="saxophone" />Saxophone</label>
                            <label><input className="register-form__option" type="checkbox" name="trombone"
                                value="trombone" />Trombone</label>
                            <label><input className="register-form__option" type="checkbox" name="trumpet"
                                value="trumpet" />Trumpet</label>
                            <label><input className="register-form__option" type="checkbox" name="ukelele"
                                value="ukelele" />Ukelele</label>
                            <label><input className="register-form__option" type="checkbox" name="viola"
                                value="viola" />Viola</label>
                            <label><input className="register-form__option" type="checkbox" name="voice"
                                value="voice" />Voice</label>
                        </div>
                    </div>
                </div>
                <button className="register-form__submit">Submit</button>
                <Link className="go-back" to="/"> Go back</Link>
            </form>
        </section>
    </>
}




