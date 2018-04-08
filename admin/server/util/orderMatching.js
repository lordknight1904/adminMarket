import User from '../models/user';
import Order from '../models/order';
import { transactionWithFee } from '../util/btc';

export function orderMatching(coin) {
  Order.aggregate([
    {
      $match: {
        stage: 'open',
        coin: coin,
        amountRemain: { $gte: 100 }
      },
    },
    { $sort: { 'price': -1, 'dateCreated': -1 } },
    {
      $group: {
        _id: '$type',
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
        max: { $max: '$price' },
        min: { $min: '$price' }
      }
    },
  ]).exec((err, order) => {
    if (err) {
      return;
    } else {
      const arr = order.filter((o) => { return o._id === 'sell'});
      const arr2 = order.filter((o) => { return o._id === 'buy'});
      const sell = (arr.length > 0) ? arr[0] : {};
      sell.order.reverse();
      const buy = (arr2.length > 0) ? arr2[0] : {};
      if (buy.max !== 0 && sell.min !== 0 && buy.max > sell.min) {
        console.log('khớp lệnh');
        User.findOne({ _id: sell.order[0].userId }).exec((err, userFrom) => {
          if (err) return;
          else {
            if (userFrom) {
              User.findOne({_id: buy.order[0].userId}).exec((err2, userTo) => {
                if (err2) return;
                else {
                  if (userTo) {
                    transactionWithFee(userFrom, userTo, sell.order[0], buy.order[0]);
                  }
                }
              });
            }
          }
        });
      }
    }
  });
}
