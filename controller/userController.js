const userSchema = require('../model/userModel')
const bcrypt = require('bcrypt')
const saltround = 10

const registerUser = async (req,res) =>{


    try {

        const {email,password} = req.body

        const user = await userSchema.findOne({email})
        
        if(user) return res.render('user/register',{message: 'User aldready exists'})


            const hashPassword = await bcrypt.hash(password,saltround)
        
        
        const newUser = new userSchema({
            email,
            password:hashPassword
        })

        await newUser.save()

        res.render('user/login',{message:"created sucsessfully"})
        
    } catch (error) {
      res.render('user/register',{message:'something went wrong'})

    }
}





const logout = (req,res) =>{

    req.session.user = null
    res.redirect('/user/login')

}


const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await userSchema.findOne({ email });

        if (!user) {
            return res.render('user/login', { message: 'User does not exist' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.render('user/login', { message: "Incorrect password, please check your password" });
        }

        req.session.user = true;
        res.render('user/userHome', { message: 'Login successful' });

    } catch (error) {
        console.error("Login error:", error);
        res.render('user/login', { message: 'Something went wrong' });
    }
};


const loadRegister = (req,res)=>{
    res.render('user/register')

}

const loadLogin = (req,res)=>{
    res.render('user/login')
}





const loadHome = (req,res)=>{
    res.render('user/userHome')
}


module.exports ={
    registerUser,

    loadLogin,

    loadRegister,

    login,

    loadHome,

    logout

}