const { urlencoded } = require('express')
const express = require('express')
const {ObjectId,MongoClient} = require('mongodb')


const app = express()
//const url = 'mongodb://localhost:27017'
const url ='mongodb+srv://new-khoa-27:1234qaz1234@cluster0.buvpy.mongodb.net/test'

app.use(express.urlencoded({extended:true}))
app.set('view engine','hbs')

app.post('/insert',async (req,res)=>{
    const nameInput = req.body.txtName;
    const priceInput = req.body.txtPrice;
    const imageInput = req.body.txtImage;
    const newProduct = {name:nameInput,price:priceInput,image:imageInput};
    const client = await MongoClient.connect(url)
    const dbo = client.db("ASM2DB")
    const newP = await dbo.collection("products").insertOne(newProduct);
    res.redirect('/')
})

app.post('/update', async (req,res)=>{
    const id = req.body.id
    const nameInput = req.body.txtName
    const priceInput = req.body.txtPrice
    const imageInput = req.body.txtImage
    const client = await MongoClient.connect(url)
    const dbo = client.db("ASM2DB")
    const updateProduct =await dbo.collection("products").updateOne({_id:ObjectId(id)},{$set:{name:nameInput,price:priceInput,image:imageInput}})
    res.redirect('/')
})

app.post('/search',async (req,res)=>{
    const searchInput = req.body.txtSearch;
    const client = await MongoClient.connect(url)
    const dbo = client.db("ASM2DB")
    const allProducts = await dbo.collection("products").find({name:searchInput}).toArray();
    res.render('index',{data:allProducts})
})

app.get('/delete',async (req,res)=>{
    const idInput = req.query.id;
    const client = await MongoClient.connect(url);
    const dbo = client.db("ASM2DB");
    await dbo.collection("products").deleteOne({_id:ObjectId(idInput)})
    res.redirect('/')
})

app.get('/edit', async (req,res)=>{
    const idInput = req.query.id;
    const client = await MongoClient.connect(url);
    const dbo = client.db("ASM2DB");
    const search_Product = await dbo.collection("products").findOne({_id:ObjectId(idInput)})      
    res.render('edit',{product:search_Product})
})

app.get('/',async (req,res)=>{
    const client = await MongoClient.connect(url);
    const dbo = client.db("ASM2DB")
    const allProducts = await dbo.collection("products").find({}).toArray();
    res.render('index',{data:allProducts})
})



const PORT = process.env.PORT || 6800;
app.listen(PORT)