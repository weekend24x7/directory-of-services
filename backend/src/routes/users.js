import bcrypt from 'bcrypt';
import passport from 'passport';
import express from 'express';
import randomstring from 'randomstring';
import nodemailer from 'nodemailer';
import mg from 'nodemailer-mailgun-transport';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import secret from '../authentication/config';
import '../authentication/passport';
import {
  getAllUsers,
  getUsersById,
  addUser,
  updateUser,
  updateUserbyEmail,
  deleteUser,
  getUserByEmail,
  comparePassword,
  validateResetInfo,
  updateUserbyVerified,
  getUsersByVerified
} from '../controllers/users_controller';

import * as config from '../config';




const router = express.Router();
const auth = {
  auth: {
    api_key: process.env.MAILGUN_API_KEY,
    domain: process.env.MAILGUN_DOMAIN
  }
};
const nodemailerMailgun = nodemailer.createTransport(mg(auth));
// Send email
async function sendEmail({
  from,
  to,
  subject,
  text
}) {
  try {
    await nodemailerMailgun.sendMail({
      from: `${from}`,
      to: `${to}`,
      subject: `${subject}`,
      text: `${text}`
    });
  } catch (err) {
    throw new Error(JSON.parse(err.message));
  }
}

router.get('/users', async (req, res) => {
  try {
    const data = await getAllUsers();
    const users = data.map(user => ({
      id: user.id,
      fullname: user.fullname,
      role: user.role,
      organisation: user.organisation,
      last_updated: user.last_updated,
      hasRequestedEditor: user.hasRequestedEditor,
      rejectedByAdmin: user.rejectedByAdmin,
      email: user.email,
      verified: user.verified
    }));
    res.status(200).json(users);
  } catch (err) {
    res.status(502).json(err);
  }
});



router.get('/users/:id', async (req, res) => {
  try {
    const response = await getUsersById(req.params.id);
    res.status(200).json(response);
  } catch (err) {
    res.status(502).json(err);
  }
});

router.delete('/users/:userId', async (req, res) => {
  try {
    const response = await deleteUser(req.params.userId);
    res
      .status(200)
      .json({ success: true, message: 'User deleted successfully', response });
  } catch (err) {
    res
      .status(502)
      .json({ success: false, message: 'There is an error occurred', err });
  }
});

router.post('/users', async (req, res) => {
  let { password } = req.body;
  const {
    email, orgName, fullname
  } = req.body;
  await bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, async (error, hash) => {
      if (error) {
        throw error;
      }
      password = hash;
      await addUser({
        salt_password: password,
        email: email,
        fullname: fullname,
        organisation: orgName
      }).then(user => res.json(user));
    });
  });
});

router.put('/users/:userId', async (req, res) => {
  let { password } = req.body;
  const {
    email, fullname, organisation
  } = req.body;
  await bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, async (error, hash) => {
      if (error) {
        throw error;
      }
      password = hash;
      await updateUser(req.params.userId, {
        salt_password: password,
        email,
        fullname,
        organisation
      }).then(() =>
        res.json({
          message: 'User updated successfully'
        }));
    });
  });
});

router.post('/verified/:verify', async (req, res) => {
  const { verify } = req.params;
  try {
    const response = await getUsersByVerified(verify);
    const verifiedDB = await response[0].verification_code
    const requested = await response[0].hasRequestedEditor
    const role = await response[0].role
    if (verify && requested === false) {
      await updateUserbyVerified(verify, {
        hasRequestedEditor: true
      })
      res.status(200).json({
        request: requested, // this is to make sure the user has already requested
        success: true,
        message: 'Your email has been verified.'
      });
    } else if (verifiedDB === verify && requested && role === null) {
      res.status(200).json({
        request: requested,
        success: true,
        message: 'Your email has been verified. We are waiting for the approval from the admins.'
      });
    }else if (verifiedDB === verify && role === 'Editor' ) {
      res.status(200).json({
        request: requested,
        success: true,
        message: 'Your request to become an editor has been approved. Please log out and log in again.'
      });
    }else if (verifiedDB === verify && role === 'Admin' ) {
      res.status(200).json({
        request: requested,
        success: true,
        message: 'Your request to become an admin has been approved. Please log out and log in again.'
      });
    }
  } catch (err) {
    res.status(502).json({
      success: false,
      message: 'Please check your email.',
      err
    });
  }
});

router.post('/requestEditor', async (req, res) => {
  const verified = randomstring.generate(12);
  const {
    email
  } = req.body;
  try {
    await
    sendEmail({
      from: config.SITE_EMAIL,
      to: email,
      subject: 'invite',
      text: `Please Click on the link to verify your email https://${config.SITE_HOST}/verified/${verified}`
    })
    await updateUserbyEmail(email, {
      verification_code: verified
    })
    res.status(200).json({
      success: true,
      message: 'Your invitation has been sent!'
    });
  } catch (error) {
    res.status(502).json({
      message: 'We could not sent your invitation please try again.',
      error
    });
  }
});

router.put('/acceptEditor', async (req, res) => {
  const {
    role,
    hasRequestedEditor,
    id
  } = req.body;
  await updateUser(id, {
    hasRequestedEditor,
    role
  }).then(() => {
    res.json({
      message: 'Accepted To Become An Editor'
    })
  })
    .catch(err => {
      console.log('err happened', err)
    })
});

router.put('/rejectEditor', async (req, res) => {
  const {
    hasRequestedEditor,
    id,
    role,
    rejectedByAdmin
  } = req.body;
  await updateUser(id, {
    hasRequestedEditor,
    role,
    rejectedByAdmin
  }).then(() => {
    console.log('success on call')
    res.json({
      message: 'Rejecged To Become An Editor'
    })
  })
    .catch(err => {
      console.log('err happened', err)
    })
});

router.put('/cancelEditorRequest', async (req, res) => {
  const {
    hasRequestedEditor,
    email
  } = req.body;
  await updateUserbyEmail(email, {
    hasRequestedEditor
  }).then(() => {
    res.json({
      message: 'Rejecged To Become An Editor'
    })
  })
    .catch(err => {
      console.log('err happened', err)
    })
});

// Use this route to modify user role, org name, fullname
router.put('/user/role', async (req, res) => {
  try {
    const {
      role,
      fullname,
      organisation,
      id
    } = req.body;
    await updateUser(id, {
      role,
      fullname,
      organisation,
      id
    });
    res.status(200).json({
      success: true,
      message: 'User updated successfully'
    });
  } catch (err) {
    res.status(502).json({
      success: false,
      message: 'User has not been updated',
      err
    });
  }
});



router.post('/signup', async (req, res) => {
  try {
    let { password } = req.body;
    const { fullname, email, organisation } = req.body;
    if (email.length > 0 && password.length > 0) {
      const user = await getUserByEmail(email);
      if (user.length > 0) {
        res.json({
          success: false,
          message: 'User already exist'
        });
      } else {
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(password, salt, (error, hash) => {
            if (error) {
              throw error;
            }
            password = hash;
            addUser({
              salt_password: password,
              email,
              fullname,
              organisation,
              hasRequestedEditor: false,
              rejectedByAdmin: false
            }).then(userData => {
              if (userData) {
                sendEmail(
                  {
                    from: config.SITE_EMAIL,
                    to: `${email}`,
                    subject: 'Welcome to DOS',
                    text: `
                    Hello,
                    Welcome to the Welcome Guide, and thanks for signing up.
                    The Welcome Guide is a directory of service for case workers who work with asylum seekers, refugeees and other
                    people in need.
                    This beta service was developed by developers from CodeYourFuture with the
                    support of Help Refugees. We appreciate your feedback to improve this
                    service.

                    Thanks,
                    CYF / HR`
                  },
                  (errors, info) => {
                    if (errors) {
                      res.status(500).json({ success: false, errors: errors });
                    }
                    res.json(`Response: ${info}`);
                  }
                );
                res.json({
                  success: true,
                  message: 'User is registered'
                });
              } else {
                res.json({
                  success: false,
                  message: 'User is not registered'
                });
              }
            });
          });
        });
      }
    }
  } catch (err) {
    res.status(502).json({
      success: false,
      message: 'You have to add email and password!',
      err
    });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { password, email } = req.body;
    await getUserByEmail(email).then(userInfo => {
      if (userInfo.length <= 0) {
        res.status(403).json({
          success: false,
          message: 'User is not registered'
        });
      } else {
        comparePassword(password, userInfo[0].salt_password, (err, isMatch) => {
          if (err) {
            throw err;
          }
          if (isMatch) {
            const token = jwt.sign({
              sub: userInfo[0].id,
              fullname: userInfo[0].fullname,
              organisation: userInfo[0].organisation,
              role: userInfo[0].role,
              email: userInfo[0].email,
              success: 'true',
              hasRequestedEditor: userInfo[0].hasRequestedEditor,
              rejectedByAdmin: userInfo[0].rejectedByAdmin,
              verified: userInfo[0].verified
            }, secret);
            res
              .status(200)
              .json({
                token,
                user: userInfo
              });
          } else {
            res.status(403).json({
              success: false,
              message: 'Password is not match'
            });
          }
        });
      }
    });
  } catch (err) {
    res.status(502).json({
      success: false,
      message: 'Your Password or email doesn\'t match!',
      err
    });
  }
});

router.get(
  '/users/profile',
  passport.authenticate('jwt', {
    session: false
  }),
  (req, res) => {
    res.json({
      success: true
    });
  }
);

// Generate token
async function generateToken() {
  return new Promise((resolve, reject) => {
    crypto.randomBytes(20, async (err, buf) => {
      if (err) {
        reject(err);
      }
      if (buf) {
        resolve(buf.toString('hex'));
      }
    });
  });
}


router.post('/forgot', async (req, res) => {
  try {
    const { email } = req.body;
    const token = await generateToken();
    const user = await getUserByEmail(email);
    let { resetPasswordExpires, resetPasswordToken } = user[0];
    resetPasswordToken = token;
    resetPasswordExpires = (Date.now() + 3600000).toString(); // 1 hour

    await updateUser(user[0].id, {
      resetPasswordExpires,
      resetPasswordToken
    });
    await sendEmail({
      from: config.SITE_EMAIL,
      to: `${email}`,
      subject: 'Reset User Password',
      text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
        Please click on the following link, or paste this into your browser to complete the process:\n\n
        https://${config.SITE_HOST}/reset/${token}\n\n
        If you did not request this, please ignore this email and your password will remain unchanged.\n`
    });
    res.status(200).json({
      success: true,
      message: 'An email has been sent to you with password reset instructions!'
    });
  } catch (error) {
    res.status(502).json({
      success: false,
      message: 'We could not reset your password, please try again!'
    });
  }
});

router.get('/reset/:token', async (req, res) => {
  try {
    const user = await validateResetInfo(
      req.params.token,
      Date.now().toString()
    );
    const userId = user[0].id;
    const { email } = user[0];
    res.status(200).json({
      success: true,
      userId,
      email
    });
  } catch (err) {
    res.status(502).json({
      success: false,
      message: 'Password reset token is invalid or has expired.',
      err
    });
  }
});

router.post('/reset/:token', async (req, res) => {
  try {
    const user = await validateResetInfo(req.body.token, Date.now().toString());
    if (req.body.password === req.body.confirm) {
      let { password } = req.body;
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(password, salt, async (error, hash) => {
          if (error) {
            throw error;
          }
          password = hash;
          await updateUser(user[0].id, {
            salt_password: password,
            resetPasswordToken: '',
            resetPasswordExpires: ''
          });
        });
      });
      await sendEmail({
        from: `${req.body.siteEmail}`,
        to: `${user[0].email}`,
        subject: 'Your password has been changed',
        text: `Hello,\n\n This is a confirmation that the password for your account ${
          user[0].email
        } has just been changed.\n`
      });
    }
    res.status(200).json({
      success: true,
      message: 'Your password has been changed successfully!'
    });
  } catch (error) {
    res.status(502).json({
      message: 'Password reset token is invalid or has expired.',
      error
    });
  }
});

// Invite user to use the service
router.post('/invite', async (req, res) => {
  const { email, message } = req.body;
  const arrEmail = email.split(',');
  try {
    await arrEmail.map(emai =>
      sendEmail({
        from: config.SITE_EMAIL,
        to: emai,
        subject: 'invite',
        text: `${message}

      Join by using this link https://dos.codeyourfuture.io.

      This beta service was developed by developers from CodeYourFuture with the
      support of Help Refugees. We appreciate your feedback to improve this
      service.

      Thanks,
      CYF / HR`
      }))
    res.status(200).json({
      success: true,
      message: 'Your invitation has been sent!'
    });
  } catch (error) {
    res.status(502).json({
      message: 'We could not sent your invitation please try again.',
      error
    });
  }
});

module.exports = router;
