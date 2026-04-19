import {Request, Response, NextFunction} from 'express';
import {PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import dotenv from "dotenv";
import s3Client from '../config/s3';
import pool from '../db/pool';

dotenv.config()

export const getPresignedUrl = async (req:Request, res:Response,next: NextFunction) =>{
    try{
        const jobId = req.params.jobId;
        const {filename, filetype} = req.body;
        const key = `uploads/${jobId}/${Date.now()}-${filename}`;
        const commaand = new PutObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET,
            Key: key,
            ContentType:filetype
        });
        const url= await getSignedUrl(s3Client,commaand,{expiresIn:600});
        res.json({url, key});

    }catch(error){
        next(error);
    }
}

export const saveDocument = async (req:Request, res:Response, next: NextFunction) =>{
try{
    const {jobId} = req.params;
    const {filename, filetype, s3_key}= req.body;
    const result = await pool.query('insert into documents (job_id, file_name, file_type, s3_key) values ($1, $2, $3, $4) returning *', [jobId, filename, filetype, s3_key]);
    res.status(201).json({message: 'Document saved successfully', result: result.rows[0]});
}catch(error){
    next(error);   
}
}

export const getDocuments = async (req:Request, res:Response, next: NextFunction) =>{
    try{
        const jobId = req.params.jobId;
        const result = await pool.query('select * from documents where job_id = $1', [jobId]);
        res.json(result.rows);
    }catch(error){
        next(error);
    }
}

export const deleteDocument = async (req:Request, res:Response, next: NextFunction) =>{
    try{
        const documentId = req.params.documentId;
        const result = await pool.query('select * from documents where document_id = $1', [documentId]);
        if(result.rowCount === 0){
            return res.status(404).json({message: 'Document not found'});
        }
        const s3Key = result.rows[0].s3_key;
        await s3Client.send(new DeleteObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET,
            Key: s3Key
        }));
        await pool.query('DELETE FROM documents WHERE document_id = $1', [documentId]);
        res.json({message: 'Document deleted successfully', result: result.rows[0]});
    }catch(error){
        next(error);
    }
}

export const downloadDocument = async (req:Request, res:Response, next: NextFunction) =>{
    try{
        const documentId = req.params.documentId;
        const result = await pool.query('select * from documents where document_id = $1', [documentId]);
        if(result.rowCount === 0){
            return res.status(404).json({message: 'Document not found'});
        }
        const s3Key = result.rows[0].s3_key;
        const commaand = new GetObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET,
            Key: s3Key
        });
        const url= await getSignedUrl(s3Client,commaand,{expiresIn:600});
        res.json({url});
    }catch(error){
        next(error);
    }
}