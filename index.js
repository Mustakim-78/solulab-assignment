import express from 'express';
import env from 'dotenv';
import bodyparser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import Category from './models/category.js';
import Product from './models/product.js';
env.config();
const app = express();
app.use(bodyparser.json({limit : "30mb", extended : true}));
app.use(bodyparser.urlencoded({limit : "30mb", extended : true}));
app.use(cors());


const CONNECTION_URL = process.env.CONNURL;

const PORT = process.env.PORT || 5000;

mongoose.connect(CONNECTION_URL,{useNewUrlParser : true, useUnifiedTopology : true})
    .then(() => app.listen(PORT, () => console.log(`Server Running on port : ${PORT}`)))
    .catch((error) => console.log(error.message));

mongoose.set('useFindAndModify', false);

app.get('/',(req,res) => res.send("Solulab Assignment"));

app.get('/product/read/:productID', async (req,res) => {
    const productID = req.params.productID;
    try{
        const products = await Product.findOne({_id:productID})
        .populate({path:'categoryId', select:['categoryName']});

        res.status(200).json(products);
    }
    catch (error){
        res.status(404).json({message : error.message});
    }
});

app.get('/product/readAll', async (req,res) => {
    try{
        const products = await Product.find()
        .populate({path:'categoryId', select:['categoryName']});

        res.status(200).json(products);
    }
    catch (error){
        res.status(404).json({message : error.message});
    }
});

app.post('/product/create', async (req,res) => {
    const product = req.body;
    const newProduct = new Product(product);
    try{
        await newProduct.save();
        res.status(201).json(newProduct);
    }
    catch(error){
        res.status(409).json({message : error.message});
    }
});

app.post('/category/create', async (req,res) => {
    const category = req.body;
    const newCategory = new Category(category);
    try{
        await newCategory.save();
        res.status(201).json(newCategory);
    }
    catch(error){
        res.status(409).json({message : error.message});
    }
});

app.put('/product/update/:productID', async (req,res) => {
    const product = req.body;
    const _id = req.params.productID;
    try{
        const updatedProduct = await Product.findByIdAndUpdate(_id, {...product,_id}, {new:true});
        res.status(201).json(updatedProduct);
    }
    catch (error){
        console.log(error)
    }
});

app.delete('/product/delete/:productID', async (req,res) => {
    const productID = req.params.productID;
    try{
        await Product.deleteOne({_id:productID})

        res.status(200).json("Product Deleted");
    }
    catch (error){
        res.status(404).json({message : error.message});
    }
});