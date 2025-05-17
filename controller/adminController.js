const adminModel = require('../model/adminModel');
const bcrypt = require('bcrypt');
const userModel = require('../model/userModel')

// Load Login Page
const loadLogin = async (req, res) => {
    res.render('admin/adminLogin'); // removed slash
};

// Handle Login Form Submission
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(email, password)
        const admin = await adminModel.findOne({ email });

        if (!admin) return res.render('admin/adminLogin', { message: 'Invalid credentials' });


        const isMatch = await bcrypt.compare(password, admin.password);

        if (!isMatch) return res.render('admin/adminLogin', { message: 'Invalid credentials' });


        req.session.admin = true; // or req.session.user = newUser._id
        res.redirect('/admin/dashboard');


    } catch (error) {
        res.send(error);
    }
};

const loadDashboard = async (req, res) => {
    try {
        const admin = req.session.admin
        if (!admin) return res.redirect('/admin/login')

        const users = await userModel.find()


        res.render('admin/dashboard', { users })
    } catch (error) {
        console.error('Error loading dashboard:', error)
        res.status(500).send('Server error')
    }
}



// const logout = (req, res) => {
//     req.session.destroy((err) => {
//         if (err) {
//             console.error('Error destroying session:', err);
//             return res.status(500).send("Could not log out.");
//         }
//         res.redirect('/admin/login');
//     });
// };

const editUser = async (req, res) => {
    try {

        const { email, password, id } = req.body

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await userModel.findOneAndUpdate({ _id: id }, { $set: { email, password: hashedPassword } })


        res.redirect('/admin/dashboard')

        console.log(user)

        res.json(user)


    } catch (error) {
        console.log(error)
    }
}


const deleteUser = async (req, res) => {
    try {


        const { id } = req.params;

        const user = await userModel.findOneAndDelete({ _id: id })

        res.redirect('/admin/dashboard')

    } catch (error) {

        console.log(error);


    }
}

const addUser = async (req, res) => {

    try {

        const { email, password } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10)


        const newUser = new userModel({
            email,
            password: hashedPassword
        })

        await newUser.save()

        res.redirect('/admin/dashboard')



    } catch (error) {

        console.log(error)

    }

}

const logout = async (req, res) => {

    req.session.admin = null

    res.redirect('/admin/logout')
}


module.exports = {
    loadLogin,
    login,
    loadDashboard,
    logout,
    editUser,
    deleteUser,
    addUser
};