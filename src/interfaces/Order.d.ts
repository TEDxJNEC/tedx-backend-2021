interface IOrder {
    order_id:string;
    txnId:string;
    user:string;
    createdAt:Date;
    updatedAt:Date;
    attempts:number;
    status:string;
    amount_due:number;
    amount_paid:number;
}

export default IOrder;