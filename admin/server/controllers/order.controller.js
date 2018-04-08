import Order from '../models/order';
import User from '../models/user';
import cuid from 'cuid';
import sanitizeHtml from 'sanitize-html';
import { ordersAndHold, updateOrderListToAll, ordersIndividualAndHold } from '../routes/socket_routes/chat_socket';
import * as btc from '../util/btc';
import { orderMatching } from '../util/orderMatching';

export function getOrderStatistic(req, res) {
  if (req.params.date && req.params.coin) {
    const today = new Date();
    const from = new Date();
    const to = new Date();
    from.setDate(today.getDate() - Number(req.params.date));
    from.setHours(0, 0, 0, 0);
    to.setHours(24, 0, 0, 0);
    Order.aggregate([
      {
        $match: {
          coin: req.params.coin.toUpperCase(),
          dateCreated: { $gte: from, $lte: to },

        },
      },
      {
        $project: {
          dateCreated: { $dateToString: { format: '%Y-%m-%d', date: '$dateCreated' } },
          stage: '$stage',
        },
      },
      {
        $group: {
          _id: {
            stage: '$stage',
            dateCreated: '$dateCreated',
          },
          count: { $sum: 1 },
        },
      },
    ]).exec((err, orders) => {
      if (err) {
        res.json({ order: [] });
      } else {
        let response = [];
        for (let i = 0; i < req.params.date; i++) {
          const tD = new Date();
          tD.setDate(today.getDate() - i);
          response.push({
            label: `${tD.getDate()}/${tD.getMonth()}/${tD.getYear() + 1900}`,
            open: 0,
            close: 0,
          });
        }
        orders.map((t) => {
          const tempDate = new Date(t._id.dateCreated);
          for (let i = 0; i < req.params.date; i++) {
            if (response[i].label === `${tempDate.getDate()}/${tempDate.getMonth()}/${tempDate.getYear() + 1900}`) {
              if (t._id.stage === 'open') {
                response[i].open = t.count;
              }
              if (t._id.stage === 'close') {
                response[i].close = t.count;
              }
            }
          }
        });
        res.json({ order: response });
      }
    });
  } else {
    res.json({ order: [] });
  }
}

export function createOrder(req, res) {
  const reqOrder = req.body.order;
  if (reqOrder &&
    reqOrder.hasOwnProperty('userId') &&
    reqOrder.hasOwnProperty('type') &&
    reqOrder.hasOwnProperty('coin') &&
    reqOrder.hasOwnProperty('price') && Number(reqOrder.price) > 0 &&
    reqOrder.hasOwnProperty('amount') && Number(reqOrder.amount) > 0) {
    User.findOne({ _id: reqOrder.userId }).exec((err, user) => {
      if (err) {
        res.json({ order: 'Không thể đặt lệnh' });
      } else {
        if (user) {
          const newOrder = new Order({
            userId: sanitizeHtml(reqOrder.userId),
            type: sanitizeHtml(reqOrder.type),
            coin: sanitizeHtml(reqOrder.coin),
            price: sanitizeHtml(reqOrder.price),
            amount: sanitizeHtml(reqOrder.amount),
            amountRemain: sanitizeHtml(reqOrder.amount),
          });
          if (reqOrder.type === 'sell') {
            //dat lenh cho` ban BTC, kiem tra so du coin
            const address = user.addresses.filter((a) => {
              return a.coin === sanitizeHtml(reqOrder.coin);
            });
            if (address.length > 0) {
              btc.getAddress(address[0].address).catch(() => {
                res.json({order: 'Không thể đặt lệnh'});
              }).then((data) => {
                btc.getHold(user._id)
                .catch(() => {
                  res.json({order: 'Không thể đặt lệnh'});
                })
                .then((hold) => {
                  if (data.balance >= hold + Number(sanitizeHtml(reqOrder.amount))) {
                    newOrder.save((err) => {
                      if (err) {
                        res.json({order: 'Không thể đặt lệnh'});
                      } else {
                        orderMatching(sanitizeHtml(reqOrder.coin));
                        ordersAndHold({ coin: sanitizeHtml(reqOrder.coin), id: reqOrder.userId });
                        res.json({order: 'success'})
                      }
                    });
                  } else {
                    res.json({order: `Không đủ ${sanitizeHtml(reqOrder.coin)}`});
                  }
                });
              });
            } else {
              res.json({order: 'Không thể đặt lệnh'});
            }
          } else {
            //dat lenh cho` mua coin, kiem tra so du USDT
            newOrder.save((err) => {
              if (err) {
                res.json({order: 'Không thể đặt lệnh'});
              } else {
                orderMatching(sanitizeHtml(reqOrder.coin));
                updateOrderListToAll({ coin: sanitizeHtml(reqOrder.coin) });
                res.json({order: 'success'})
              }
            });
          }
        } else {
          res.json({ order: 'Không thể đặt lệnh' });
        }
      }
    });
  } else {
    res.json({ order: 'Thiếu thông tin' });
  }
}
export function getOrder(req, res) {
  if (req.params.type && req.params.coin) {
    Order.aggregate([
      {
        $match: {
          type: sanitizeHtml(req.params.type),
          coin: sanitizeHtml(req.params.coin),
          stage: "open"
        },
      },
      {
        $group: {
          _id: "$price",
          amountRemain: { $sum: "$amountRemain"},
          coin: { $first: "$coin" },
          stage: { $first: "$stage" },
          type: { $first: "$type" },
        }
      },
      {
        $project: {
          price: "$_id",
          amountRemain: "$amountRemain" ,
          coin:  "$amountRemain" ,
          stage:  "$amountRemain" ,
          type:  "$type" ,
        }
      },
      { $sort: { _id: (sanitizeHtml(req.params.type) === 'buy') ? -1 : 1 } },
      { $limit: 30 },
    ]).exec((err, order) => {
      if (err) {
        res.json({ order: [] });
      } else {
        res.json({ order: order });
      }
    })
  } else {
    res.json({ order: [] });
  }
}
export function getMyOrder(req, res) {
  if (req.params.userName && req.params.coin) {
    User.findOne({ userName: sanitizeHtml(req.params.userName) }).exec((err, user) => {
      if (err) {
        res.json({ order: [] });
      } else {
        if (user) {
          Order.aggregate([
            {
              $match: {
                userId: user._id,
                coin: sanitizeHtml(req.params.coin),
                $or: [{stage: 'open'}, {stage: 'cancel'}, {stage: 'done'}]
                // stage: 'open',
              },
            },
            {
              $group: {
                _id: '$stage',
                order: {
                  $push: {
                    _id: '$_id',
                    userId: '$userId',
                    type: '$type',
                    coin: '$coin',
                    price: '$price',
                    amount: '$amount',
                    amountRemain: '$amountRemain',
                    dateCreated: '$dateCreated',
                    stage: '$stage',
                  }
                },
              }
            },
            {
              $sort: { dateCreated: -1 }
            }
          ]).exec((err2, order) => {
            if (err2) {
              res.json({ order: [] });
            } else {
              const arr = order.filter((o) => { return o._id === 'cancel'});
              const arr2 = order.filter((o) => { return o._id === 'open'});
              const arr3 = order.filter((o) => { return o._id === 'done'});
              const cancel = (arr.length > 0) ? arr[0].order : [];
              const open = (arr2.length > 0) ? arr2[0].order : [];
              const done = (arr3.length > 0) ? arr3[0].order : [];
              res.json({ order: { open, cancel, done } });
            }
          })
        } else {
          res.json({ order: [] });
        }
      }
    });
  } else {
    res.json({ order: [] });
  }
}
export function deleteOrder(req, res) {
  const reqOrder = req.body.del;
  if (reqOrder &&
    reqOrder.hasOwnProperty('orderId') &&
    reqOrder.hasOwnProperty('userName')
  ) {
    User.findOne({ userName: reqOrder.userName }).exec((err, user) => {
      if (err) {
        res.json({ order: 'Không thể xóa lệnh.' });
      } else {
        if (user) {
          Order.findOneAndUpdate({ _id: reqOrder.orderId, userId: user._id }, { stage: 'cancel' }, { new: true }).exec((err2, order) => {
            if (err2) {
              res.json({ order: 'Không thể xóa lệnh.' });
            } else {
              ordersIndividualAndHold({ coin: order.coin, id: order.userId });
              res.json({ order: 'success' });
            }
          });
        } else {
          res.json({ order: 'Không thể xóa lệnh.' });
        }
      }
    });
  } else {
    res.json({ order: 'Thiếu thông tin' });
  }
}
