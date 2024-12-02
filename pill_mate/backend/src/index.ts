import { config } from 'dotenv'
import express, { Request, Response } from 'express'

config({ path: '../.env' })

const port = process.env.BACKEND_PORT || 3000

const app = express()

app.get('/', (req: Request, res: Response) => {
    res.send('Hello, World!')
})

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
