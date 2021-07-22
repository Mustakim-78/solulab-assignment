import mongoose from 'mongoose';

const productSchema = mongoose.Schema({
    productName: {
        type:String,
        required:true,
    },
    qtyPerUnit:{
        type: Number,
        required: true,
    },
    unitPrice:{
        type:Number,
        required:true,
    },
    unitInStock:{
        type: Number,
        required:true
    },
    discontinued:{
        type:Boolean,
        required:true,
    },
    categoryId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'categories'
    }
})


const Product = mongoose.model('Products', productSchema);
export default Product;