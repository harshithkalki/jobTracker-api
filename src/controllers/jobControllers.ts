import {Request, Response, NextFunction} from "express";
import pool from "../db/pool";



export async function createJob(req:Request, res:Response, next:NextFunction){
    const {organisation_name,job_role,description,application_link,status}=req.body;
    const user_id=req.user.userId;
    try{
        const result= await pool.query(
            "Insert into jobs (user_id, organisation_name,job_role, description,application_link,status) values ($1,$2,$3,$4,$5,$6)",
            [user_id, organisation_name,job_role,description,application_link,status]);
        res.status(201).json({message:"Job created successfully"});
        }catch(error){
            console.error("Error creating job", error);
            next(error);
        }
            
}

export async function getJobs(req:Request, res:Response, next:NextFunction){
    const user_id=req.user.userId;
    try{
        const result= await pool.query("Select * from jobs where user_id=$1",[user_id]);
        res.status(200).json(result.rows);
    }catch(error){
        console.error("Error fetching jobs", error);
        next(error);

    }
}

export async function DeleteJob(req:Request, res:Response, next:NextFunction){
    const job_Id=req.params.id;
    const user_id=req.user.userId;
    try{
        const result = await pool.query("Delete from jobs where job_id=$1 and user_id=$2",[job_Id,user_id]);
        if ((result.rowCount ?? 0 ) > 0){
            res.status(200).json({message:"Job deleted successfully"});
        }else{
            res.status(404).json({message:"Job not found"});
        }
    }catch(error){
        console.error("Error deleting job", error);
        next(error);
    }
}

export async function UpdateJob(req:Request, res:Response, next:NextFunction){
    const job_Id=req.params.id;
    const user_id=req.user.userId;
    const {organisation_name,job_role,description,application_link,status}=req.body;
    try{
        const result = await pool.query(
            "Update jobs set organisation_name=$1, job_role=$2, description=$3, application_link=$4, status=$5 where job_id=$6 and user_id=$7",
            [organisation_name,job_role,description,application_link,status,job_Id,user_id]
        );
        if ((result.rowCount ?? 0) > 0){
            res.status(200).json({message:"Job updated successfully"});
        }else{
            res.status(404).json({message:"Job not found"});
        }
    }catch(error){
        console.error("Error updating job", error);
        next(error);
    }
}

export async function UpdateJobStatus(req:Request, res:Response, next:NextFunction){
    const job_Id=req.params.id;
    const user_id=req.user.userId;
    const {status}=req.body;
    try{
        const result = await pool.query(
            "Update jobs set status=$1 where job_id=$2 and user_id=$3",
            [status,job_Id,user_id]
        );
        if ((result.rowCount ?? 0) > 0){
            res.status(200).json({message:"Job status updated successfully"});
        }else{
            res.status(404).json({message:"Job not found"});
        }
    }catch(error){
        console.error("Error updating job status", error);
        next(error);
    }
}