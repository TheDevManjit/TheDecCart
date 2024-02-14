import express from 'express';
import axios from 'axios';
import bodyParser from 'body-parser';

const app = express();
const port = 3000;
const API_URL = "https://fakestoreapi.com/products";

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs'); // Set EJS as the view engine

app.get("/", async (req, res) => {
    try {
        const response = await axios.get(API_URL);
        const result = response.data;
        const all_cat_response = await axios.get("https://fakestoreapi.com/products/categories")
        const all_cat_result = all_cat_response.data 
        
        res.render("index.ejs", 
        { content: result,
        all_cat_content:all_cat_result,

         });
    } catch (error) {
        res.status(404).send("Page not responding");
    }
});

// Handle individual product clicks
app.get("/buypage/:productId", async(req, res) => {
    const productId = req.params.productId;
  try {
        const response = await axios.get(`https://fakestoreapi.com/products/${productId}`);
        const result = response.data;

        const cat_response = await axios.get(API_URL);
        const cat_result1 = cat_response.data;
        let cat_result=[]
        for(let i=0;i<cat_result1.length;i++){
            if(result.category==cat_result1[i].category){
              //  cat_result = cat_result1[i]
                cat_result.push(cat_result1[i])

            }
        }
       cat_result.forEach(element => {
        console.log(element)
       });


 // console.log(cat_result1)
        res.render("buypage.ejs",
         {
             content: result,
             cat_content:cat_result
        });
    } catch (error) {
        console.log(error.message);
    } 
});

app.get("/categories/:category",async(req,res)=>{
const category = req.params.category;
console.log(category)
try{
    const response = await axios.get(`${API_URL}/category/${category}`)
    const result = response.data;
    res.render("categories.ejs",{product:result});
    console.log(result)
}catch(error){
    console.log(error.message)
}
})
app.get("/loginpage",(req,res)=>{
    res.render("login.ejs");
})
app.post("/login",(req,res)=>{
    res.render("index.ejs")
})

app.listen(port, () => {
    console.log(`Server is listening on ${port}`);
});
