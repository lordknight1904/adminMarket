import User from '../models/user';
import Admin from '../models/admin';
import Order from '../models/order';
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';
import cuid from 'cuid';
import jwt from 'jsonwebtoken';
import fs from 'fs-extra';
import mongoose from 'mongoose';
import crypto from 'crypto';
import sanitizeHtml from 'sanitize-html';

function generateToken(user) {
  const u = {
    userName: user.userName,
    _id: user.id,
  };
  return jwt.sign(u, 'diginex', {
    expiresIn: '1h'
  });
}
export function getAdmin(req, res) {
  const string = (req.query.search !== 'undefined') ? req.query.search : '';
  const page = (req.query.page !== 'undefined') ? req.query.page : 0;
  Admin.find(
    { userName: { $regex: `^${string}`, $options: 'i' }  },
    { userName: 1, _id: 1, dateCreated: 1, role: 1, disabled: 1 },
    { skip: 10 * page, limit: 10, sort: { dateCreated: -1 } }
  )
    .exec((err, admin) => {
    if (err) {
      res.json({ admin: [] });
    } else {
      res.json({ admin });
    }
  });
}
export function createAdmin(req, res) {
  const reqAdmin = req.body.admin;
  if (reqAdmin &&
    reqAdmin.hasOwnProperty('password') &&
    reqAdmin.hasOwnProperty('role') &&
    reqAdmin.hasOwnProperty('userName')) {
    bcrypt.genSalt(10).then((salt) => {
      bcrypt.hash(reqAdmin.password, salt).then((password) => {
        const newAdmin = new Admin({
          userName: sanitizeHtml(reqAdmin.userName),
          password: password,
          salt: salt,
          role: sanitizeHtml(reqAdmin.role),
        });
        newAdmin.save((err, admin) => {
          if(err) {
            console.log(err);
            res.json({ admin: { code: 'error' } });
          } else{
            res.json({ admin: { code: 'success' } });
          }
        });
      });
    });
  } else {
    res.json({ admin: { code: 'Thiếu thông tin.' } });
  }
}

export function loginAdmin(req, res) {
  const reqAdmin = req.body.admin;
  if (reqAdmin &&
    reqAdmin.hasOwnProperty('userName') &&
    reqAdmin.hasOwnProperty('password')) {
    Admin.findOne({ userName: reqAdmin.userName }).exec((err, admin) => {
      if (err) {
        res.json({ admin: err });
      } else {
        if (admin !== null) {
          bcrypt.compare(reqAdmin.password, admin.password, (err2, result) => {
            if (err2) {
              res.json({ admin: { code: 'login fail' } });
            } else {
              if (result) {
                const token = generateToken(admin);
                const response = {
                  id: admin._id,
                  userName: admin.userName,
                  token
                };
                res.json({ admin: { code: 'success', admin: response } });
              } else {
                res.json({ admin: { code: 'login fail' } });
              }
            }
          });
        } else {
          res.json({ admin: { code: 'login fail' } });
        }
      }
    });
  }
}
export function deleteAdmin(req, res) {
  const delAdmin = req.body.del;
  if (delAdmin &&
    delAdmin.hasOwnProperty('id')) {
    Admin.findOneAndUpdate({ _id: delAdmin.id, disabled: false}, { disabled: true }, { new: true }).exec((err, admin) => {
      if (err) {
        res.json({ admin: 'Không thể tước quyền quản trị viên này.' });
      } else {
        if (admin) {
          res.json({ admin: 'success' });
        } else {
          res.json({ admin: 'Không thể tước quyền quản trị viên này.' });
        }
      }
    });
  } else {
    res.json({ admin: 'Không thể tước quyền quản trị viên này.' });
  }
}
export function recoverAdmin(req, res) {
  const recoverAdmin = req.body.recover;
  console.log(recoverAdmin);
  if (recoverAdmin &&
    recoverAdmin.hasOwnProperty('id')) {
    Admin.findOneAndUpdate({ _id: recoverAdmin.id, disabled: true}, { disabled: false}, { new: true }).exec((err, admin) => {
      if (err) {
        res.json({ admin: 'Không thể phục hồi quản trị viên này.' });
      } else {
        if (admin) {
          res.json({ admin: 'success' });
        } else {
          res.json({ admin: 'Không thể phục hồi quản trị viên này.' });
        }
      }
    });
  } else {
    res.json({ admin: 'Không thể phục hồi quản trị viên này.' });
  }
}
