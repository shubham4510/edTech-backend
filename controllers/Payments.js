const {instance} = require('../config/razorpay');
const Course = require('../models/Course');
const User = require('../models/User');
const mailSender = require('../utils/mailSender');
const mongoose = require('mongoose')

//capture the payment and initiate the Razorpay order
exports.capturePayment = async (req,res)=>{
    try {
        //get courseId and userId
        const {course_id} = req.body;
        const userId = req.user.id;
        //validation
        //valid courseId
        if(!coures_id){
            return res.json({
                success:false,
                message:'Please provide valid course ID',
            })
        }
        //valid courseDetail

        let course;
        try {
            course = await Course.findById(course_id);
            if(!course){
                return res.json({
                    success:false,
                    message:'Could not find the course',
                })
            }

        //user already pay for the same course
        const uid =  mongoose.Types.ObjectId(userId);
        if(course.studentsEnrolled.includes(uid)){
            return res.status(200).json({
                success:false,
                message:'Student is already enrolled',
            })
        };



        } catch (error) {
            return res.json({
                success:false,
                message:error.message,
            })
        }
        //order create
        const amount = course.price;
        const currency = "INR";

        const options = {
            amount: amount * 100,
            currency,
            receipt: Math.random(Date.now()).toString,
            notes:{
                courseId:course_id,
                userId,
            }
        };

        try {
            //initiate the payment using razorpay
            const paymentResponse = await instance.orders.create(options)
            console.log(paymentResponse);

            //return response
    
            return res.status(200).json({
                success:true,
                courseName:course.name,
                courseDescription:course.description,
                thumbnail:course.thumbnail,
                orderId:paymentResponse.id,
                currency:paymentResponse.currency,
                amount:paymentResponse.amount,
            })

        } catch (error) {
            console.log(error);
          return res.json({
                success:false,
                message:'Could not initiate order',
            })
        }
        
    } catch (error) {
        return res.json({
            success:false,
            message:error.message,
        })
    }
}

//verify Signature of Razorpay and Server

exports.verifySignature = async (req,res) =>{
    try {
        const webhookSecret = "12345678";

        const signature = req.headers("x-razorpay-signature");

        //TODO: What is checksum
       const shasum = crypto.createHmac("sha256",webhookSecret);
        shasum.update(JSON.stringify(req.body));
        const digest = shasum.digest("hex");

        if(signature === digest){
            console.log("Payment  is Autherised");

            const {courseId,userId} = req.body.payload.payment.entity.notes;

            try {
                //fulfill the action

                //find the course and enroll the student
                const enrolledCourse= await Course.findByIdAndUpdate({_id:courseId},{$push:{studentsEnrolled:userId}},{new:true});

                if(!enrolledCourse){
                    return res.status(500).json({
                        success:false,
                        message:'Course not found',
                    })
                }

                console.log(enrolledCourse);

                //find the student and add the course their list enrolled courses me
                const enrolledStudent = await User.findByIdAndUpdate({_id:userId},{$push:{courses:courseId}},{new:true});

                console.log(enrolledStudent);

                //mail send krdo confirmation wala
                const emailResponse = await mailSender(enrolledStudent.email,"Congratulations from StudyNotion: ","Congratulations, you are onboarded into new StudyNotion Course")

                console.log(emailResponse);

                return res.status(200).json({
                    success:true,
                    message:'Signature Verified and Course Added',
                })
                
            } catch (error) {
                console.log(error);
                return res.status(500).json({
                    status:false,
                    message:error.message,
                })
                
            }

        }

    } catch (error) {
        return res.status(400).json({
            status:false,
            message:'Invalid Request',
        })
    }
}