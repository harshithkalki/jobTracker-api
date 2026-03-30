import app from './app';
import dotenv from 'dotenv';
import pool from './db/pool';

dotenv.config();

const PORT=process.env.PORT || 3000;

pool.connect().then(client=>{
    console.log('Connected to the database');
    client.release();   
}).catch(err=>{
    console.error('Error connecting to the database',err);
    process.exit(1);
}) 

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
})
