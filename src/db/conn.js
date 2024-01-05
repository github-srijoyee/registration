const mongoose=require("mongoose");
//const validator=require("validator");

mongoose.connect('mongodb://127.0.0.1:27017/registration', { 
    useNewUrlParser: true, 
    useUnifiedTopology: true,/*useCreateIndex:true*/
  /*useFindAndModify:false*/
  })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB');
  });