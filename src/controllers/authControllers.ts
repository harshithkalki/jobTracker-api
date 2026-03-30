import { Request, Response, NextFunction } from "express";
import pool from "../db/pool";
import bcrypt from "bcryptjs";
import { User} from "../types";
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

export async function login(req:Request, res:Response, next:NextFunction) {
    console.log("Login request received with body:", req.body);
    const { email, password } = req.body;
    try{
    const result=await pool.query<User>(`Select * from users where email=$1`,[email]);
    const user=result.rows[0];
    if (user){
        const isPasswordValid= await bcrypt.compare(password, user.password_hash);
        if (isPasswordValid){
            const token=jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET as string, { expiresIn: '1h' });
            const { password_hash, ...userWithoutPassword } = user;
            res.status(200).json({ message: "Login successful", token, user: userWithoutPassword });
        }else{
            res.status(400).json({ message: "Invalid email or password" });
        }
    }else{
        res.status(400).json({ message: "Invalid email or password" });
    }
}catch(error){
    console.error("Error logging in user", error);
    next(error);
}
}

export async function register(req:Request, res:Response, next:NextFunction) {
    const { email, password,first_name,last_name } = req.body;
    try {
    const user= await pool.query(`Select * from users where email=$1`,[email]);
    if (user.rows.length > 0){
        res.status(400).json({ message: "User already exists" });
    }else{
        const passwordHash= await bcrypt.hash(password, 10);
        await pool.query(`insert into users (email,password_hash,last_name,first_name) values ($1,$2,$3,$4)`,[email,passwordHash,last_name,first_name]);
        res.status(201).json({ message: "User registered successfully" });  
    } 
    } catch (error) {
        console.error("Error registering user", error);
        next(error);
    }
}