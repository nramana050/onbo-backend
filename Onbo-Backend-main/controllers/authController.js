const authService = require('../services/authService');

const registerUser = async (req, res) => {
  const { mobileNumber, role, firstName, lastName, pid, password } = req.body;
  try {
    const result = await authService.registerUser({
      mobileNumber,
      role,
      firstName,
      lastName,
      pid,
      password,

    });

    if (result.status) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: 'Internal Server Error' });
  }
};

const verifyRegistrationOTP = async (req, res) => {
  const { mobileNumber, enteredOTP } = req.body;

  if (!mobileNumber || !enteredOTP) {
    return res.status(400).json({ status: false, message: 'Mobile number and OTP are required.' });
  }

  const verificationResponse = await authService.verifyOTP(mobileNumber, enteredOTP, true, false);

  return res.status(200).json(verificationResponse);
};
;

const loginUser = async (req, res) => {
  const { mobileNumber, password } = req.body;

  if (!mobileNumber || !password) {
    return res.status(400).json({ status: false, message: 'Mobile number and password are required.' });
  }

  const loginResponse = await authService.loginUser(mobileNumber, password);

  if (loginResponse.status) {
    res.status(200).json(loginResponse);
  } else {
    res.status(401).json(loginResponse);
  }
};


module.exports = {
  registerUser,
  verifyRegistrationOTP,
  loginUser,
};



