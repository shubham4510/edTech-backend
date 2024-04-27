const Category = require('../models/Category');

//create Category ka handler function

exports.createCategory = async (req,res) =>{
    try {
        //fetch data
        const {name,description} = req.body;

        //validation
        if(!name || !description){
            return res.status(400).json({
                success:false,
                message:'All fields are required',
            })
        }

        //create entry in DB
        const categoryDetails = await Category.create({
            name:name,
            description:description,
        })
        console.log(categoryDetails);

        //return response
        return res.status(200).json({
            success:true,
            message:'Category Created Successfully',
        })
        
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }
}

//getAllCategories handler function

exports.showAllCategory = async (req,res) =>{
    try {
        const allCategories = await Category.find({},{name:true,description:true});
        res.status(200).json({
            success:true,
            message:'All Categories returned successfully',
            allCategories,
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }
}


//categoryPageDetails
exports.categoryPageDetails = async (req,res) => {
    try {
        //get categoryId
        const {categoryId} = req.body;
        // get courses for specified categoryId
        const selectedCategory = await Category.findById(categoryId).populate("courses")
                                                                    .exec();
        //validation
        if(!selectedCategory){
            return res.status(404).json({
                success:false,
                message:'Data Not Found',
            })
        }

        //get courses for different categories
        const differentCategories = await Category.find({
            _id: {$ne: categoryId}
        }).populate("courses").exec();

        //get top 10 selling courses
        //HW: write it on your own
        //return response
        return res.status(200).json({
            success:true,
            data:{
                selectedCategory,
                differentCategories,
            },
        })
        
    } catch (error) {
        return res.status(500).json({
            status:false,
            message:error.message,
        })
    }
}