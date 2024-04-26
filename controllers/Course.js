const Category = require('../models/Category')
const Course = require('../models/Course')
const User = require('../models/User')
const {uploadImageToCloudinary} = require('../utils/imageUploader')

//createCourse handler function
exports.createCourse = async (req,res) =>{
    try {
        //fetch data
        const {courseName,courseDescription,whatYouWillLearn,price,category} = req.body

        //get thumbnail
        const thumbnail = req.files.thumbnailImage;

        //validation
        if(!courseName || !courseDescription || !whatYouWillLearn || !price || !category || !thumbnail){
            return res.status(400).json({
                success:false,
                message:'All fields are required',
            })
        }

        //check for instructor
        const userId = req.user.id;
        const instructorDetails = await User.findById({userId});
        console.log("Instructor Details: ",instructorDetails)
        //TODO: Verify that userId and instructorDetails._id are same or different ?

        if(!instructorDetails){
            return res.status(404).json({
                success:false,
                message:'Instructor Details not found'
            })
        }

        //check given category is valid or not
        const categoryDetails = await Category.find({category})
        if(!categoryDetails){
            return res.status(404).json({
                success:false,
                message:'category Details not found'
            })
        }

        //Upload Image to Cloudinary
        const thumbnailImage = await uploadImageToCloudinary(thumbnail,process.env.FOLDER_NAME);

        //create an entry for new Course
        const newCourse = await Course.create({
            courseName,
            courseDescription,
            instructor:instructorDetails._id,
            whatYouWillLearn,
            price,
            category:categoryDetails._id,
            thumbnail:thumbnailImage.secure_url,
        })

        //add the new course to the user schema of Instructor
        await User.findByIdAndUpdate({_id:instructorDetails._id},{$push:{courses:newCourse._id,}},{new:true})

        //update the CATEGORY ka schema
        //TODO: HW

        //return response
        return res.status(200).json({
            success:true,
            message:'Course Created Successfully',
            data:newCourse,
        })


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:'Failed to Create the Course',
            error:error.message
        })
    }
}

exports.showAllCourses = async (req,res) =>{
    try {
        //TODO: change the below statement incrementally
        const allCourses = await Course.find({},{courseName:true,
                                                 price:true,
                                                 thumbnail:true,
                                                 instructor:true,
                                                 ratingAndReviews:true,
                                                 studentsEnrolled:true,}).populate("instructor").exec();

    return res.status(200).json({
        success:true,
        message:'Data for all courses fetched successfully',
        data:allCourses,
    })
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:'Cannot Fetch Course Data',
            error:error.message
        })
    }
}