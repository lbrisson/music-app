import React, { useState, useEffect } from 'react'
import axios from "axios"

export default function useAuth(code) {
    const [accessToken, setAccessToken] = useState()
    const [refreshToken, setRefreshToken] = useState()
    const [expiresIn, setExpiresIn] = useState()

    console.log("code form auth: " + code);


    useEffect(() => {
        axios.post('http://localhost:8080/spotify_login', {
            code,
        })
        .then(res => {
            console.log("data: " + res.data)
            setAccessToken(res.data.accessToken)
            setRefreshToken(res.data.refreshToken)
            setExpiresIn(res.data.expiresIn)
            window.history.pushState({}, null, "/")
        })
        .catch((err) => {
            console.log("login err message :" + err.message)
            console.log("login err: " + err)
            // window.location =  "/"
        })
    },  [code])

    useEffect(() => {
        if(!refreshToken || !expiresIn) return
        const interval = setInterval(() => {
            
            axios
            .post('http://localhost:8080/refresh', {
                refreshToken,
            })
            .then(res => {
                 console.log(res.data)
    
                setAccessToken(res.data.accessToken)
                setExpiresIn(res.data.expiresIn)
            })
            .catch((err) => {
                console.log("refresh err message: " + err.message)
                console.log("refresh err: " + err)
                // window.location =  "/"
            })
        }, (expiresIn - 60) * 1000)

        return () => clearInterval(interval)
    }, [refreshToken, expiresIn])

    return accessToken

}