import express from 'express';
import connectDb from './db/connect';
import cors from 'cors';
import UserRoutes from './routes/users'
const main = async () => {
    const app = express();
    const port = process.env.PORT || '4000';
    connectDb();
    app.use(cors());
    //  Welcome Message
    app.use('/favicon.ico', express.static('public/favicon.svg'));
    app.use('/', express.static('public'));

     //  Define Routes
    app.use('/api/users',UserRoutes);
     app.listen(port, () => {
        console.log(`🚀 Server ready at http://localhost:${port}`);
    });

}
main()