const FaceRecord = require('../models/faceModel');
const User = require('../models/user');

const registerFace = async ({ userId, faceProfile }) => {
  try{
    const user = await User.findById(userId);

    if (!user) {
      throw new Error('User not found');
  }
 
 // Find an existing FaceRecord for the user
 let existingFaceRecord = await FaceRecord.findOne({ userId: user._id });

 if (!existingFaceRecord) {
   // If no existing FaceRecord, create a new one
   existingFaceRecord = new FaceRecord({ userId: user._id, faceProfile });
   await existingFaceRecord.save();

   // Update the User model to include the new FaceRecord ID
   user.faceRecords.push(existingFaceRecord._id);
   await user.save();
 } else {
   // If there's an existing FaceRecord, update the faceProfile
   existingFaceRecord.faceProfile = faceProfile;
   await existingFaceRecord.save();
 }


  const newFace = new FaceRecord({ userId, faceProfile });
  await newFace.save();

  return { status: true, message: 'Face registered successfully' };

}catch (error) {
  console.error('Error registering face:', error);
    return { status: false, message: 'Internal Server Error' };
  }
};

const getFacesById = async (userId) => {
  try {
    const user = await User.findById(userId);

    if (!user) {
      return { status: false, message: 'User not found' };
    }

    const faces = await FaceRecord.find({ userId }).exec();

    if (faces.length === 0) {
      return { status: false, message: 'No face features found for the user' };
    }

    return {
      success: true,
      message: 'Face data retrieved successfully',
      data: {
        userId: user._id,
        faceRecord: faces.map(face => face.faceProfile), // Assuming you want the faceProfile of the first record
      },
    }; // Assuming you want the faceProfile of the first record
  } catch (error) {
    console.error('Error getting faces by ID:', error);
    return { status: false, message: 'Internal Server Error' };
  }
};

const getAllFaces = async () => {
  try {
    const allFaces = await FaceRecord.find().exec();

    if (allFaces.length === 0) {
      return { success: false, message: 'No face features found' };
    }

    const userData = {};

    allFaces.forEach((face) => {
      const { userId, faceProfile } = face;
      if (userData.hasOwnProperty(userId)) {
        userData[userId].faceProfiles.push(faceProfile);
      } else {
        userData[userId] = {
          userId,
          faceProfiles: [faceProfile],
        };
      }
    });

    const resultData = Object.values(userData);

    return {
      success: true,
      message: 'All face data retrieved successfully',
      data: resultData,
    };
  } catch (error) {
    console.error('Error getting all faces:', error);
    return { success: false, message: 'Internal Server Error' };
  }
};

module.exports = {
  registerFace,
  getFacesById,
  getAllFaces,
};
