"use server"

import { InputUser, PartialUser } from "./types"
import bcrypt from 'bcrypt'
import { nanoid } from 'nanoid'
import { addUser, getUserByLogin } from "./api"
import { redirect } from "next/navigation"

export const handleSignup = async (prev: unknown, data: FormData) => {


    let user: PartialUser = {
        id: nanoid(),
        name: data.get("name") as string,
        surname: data.get("surname") as string,
        login: data.get("login") as string,
        password: data.get("password") as string
    }
    const pattern = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&]).{6,}$/

    if (!data.get("name") || !data.get("surname") || !data.get("login") || !data.get("password")) {
        return {
            message: "Please fill all the fields"
        }
    } else if (!pattern.test(data.get("password") as string)) {
        return {
            message: "Password must include at least 6 characters, letters, numbers, and symbols"
        }

    }
    const login = getUserByLogin(user.login as string)
    if (login) {
        return {
            message: "login is not available."
        }
    }

    if (user.password) {
        user.password = await bcrypt.hash(user.password, 10)
    }
    const result = addUser(user)
    console.log(result)

    redirect("/login")

}

export const handleLogin = async (prev: unknown, data: FormData) => {
    if (!data.get("login") || !data.get("password")) {
        return {
            message: "Please fill all the fields"
        }
    }
    const login = getUserByLogin(data.get("login") as string)
    if (!login) {
        return {
            message: "user not found"
        }
    }
    const password = await bcrypt.compare(data.get("password") as string, login.password)
    if (!password) {
        return {
            message: "password is incorrect"
        }
    }
    redirect("/profile")
}