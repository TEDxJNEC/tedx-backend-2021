import express from 'express';
import connectDb from './db/connect';
import cors from 'cors';
import UserRoutes from './routes/users'
import AmbassadorRoutes from './routes/ambassadors'
import TransactionRoutes from './routes/transaction'
import EventRoutes from './routes/event'

const main = async () => {
    const app = express();
    const port = process.env.PORT || '4000';
    connectDb();
    app.use(cors());
        // @ts-ignore
        app.use(express.json({ extended: false }));
    //  Welcome Message
    app.use('/favicon.ico', express.static('public/favicon.svg'));
    app.use('/', express.static('public'));

     //  Define Routes
    app.use('/api/users',UserRoutes);
    app.use('/api/ambassadors',AmbassadorRoutes);
    app.use('/api/transaction',TransactionRoutes)
    app.use('/api/event',EventRoutes)
     app.listen(port, () => {
        console.log(`🚀 Server ready at http://localhost:${port}`);
    });

}
main()