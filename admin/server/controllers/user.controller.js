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

export function getUserStatistic(req, res) {
  const from = new Date();
  const to = new Date();
  from.setHours(0, 0, 0, 0);
  to.setHours(24, 0, 0, 0);
  User.aggregate([
    {
      $match: {
        dateCreated: { $gte: from, $lte: to },
      },
    },
    {
      $count: 'count',
    },
  ]).exec((err, users) => {
    if (err) {
      res.json({ total: 0, today: 0 });
    } else {
      User.count().exec((errCount, count) => {
        if (errCount) {
          res.json({ total: 0, today: 0 });
        } else {
          if (users.length === 0) {
            res.json({ total: count, today: 0 });
          } else {
            res.json({ total: count, today: users[0].count });
          }
        }
      });
    }
  });
}

export function getUser(req, res) {
  const string = (req.query.search !== 'undefined') ? req.query.search : '';
  const page = (req.query.page !== 'undefined') ? req.query.page : 0;
  User.find(
    { userName: { $regex: `^${string}`, $options: 'i' }  },
    {  },
    { skip: 10 * page, limit: 10, sort: { dateCreated: -1 } }
  )
    .exec((err, user) => {
      if (err) {
        res.json({ user: [] });
      } else {
        res.json({ user });
      }
    });
}
export function approveUser(req, res) {
  const reqUser = req.body.user;
  if (reqUser &&
      reqUser.hasOwnProperty('id') &&
      reqUser.hasOwnProperty('approved')
  ) {
    User.findOneAndUpdate(
      { _id: mongoose.Types.ObjectId(reqUser.id) },
      {
        approved: !reqUser.approved,
        isSubmitting: false,
      },
      { new: true })
      .exec((err, user) => {
      if (err) {
        res.json({ user: 'error' });
      } else {
        res.json({ user: 'success' });
      }
    });
  } else {
    res.json({ user: 'missing' });
  }
}
