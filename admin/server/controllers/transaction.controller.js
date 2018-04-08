import Transaction from '../models/transaction';
import Setting from '../models/setting';
import User from '../models/user';
import sanitizeHtml from 'sanitize-html';
import * as btc from '../util/btc';
import * as eth from '../util/eth';
import * as usdt from '../util/usdt';

export function getTransacitonFee(req, res) {
  if (req.params.date && req.params.coin) {
    const today = new Date();
    const from = new Date();
    const to = new Date();
    from.setDate(today.getDate() - Number(req.params.date));
    from.setHours(0, 0, 0, 0);
    to.setHours(24, 0, 0, 0);
    Transaction.aggregate([
      {
        $match: {
          coin: (req.params.coin.toUpperCase() !== 'USDT') ? req.params.coin.toUpperCase() : new RegExp('.'),
          dateCreated: { $gte: from, $lte: to },
        },
      },
      {
        $project: {
          dateCreated: { $dateToString: { format: '%Y-%m-%d', date: '$dateCreated' } },
          feeCoin: '$feeCoin',
          feeUsdt: '$feeUsdt',
        },
      },
      {
        $group: {
          _id: '$dateCreated',
          coin: { $sum: '$feeCoin' },
          usdt: { $sum: '$feeUsdt' },
        },
      },
    ])
      .exec((err, transaction) => {
        if (err) {
          res.json({ transaction: [] });
        } else {
          let response = [];
          for (let i = 0; i < req.params.date; i++) {
            const tD = new Date();
            tD.setDate(today.getDate() - i);
            response.push({
              label: `${tD.getDate()}/${tD.getMonth()}/${tD.getYear() + 1900}`,
              coin: 0,
              usdt: 0,
            });
          }
          transaction.map((t) => {
            const tempDate = new Date(t._id);
            for (let i = 0; i < req.params.date; i++) {
              if (response[i].label === `${tempDate.getDate()}/${tempDate.getMonth()}/${tempDate.getYear() + 1900}`) {
                response[i].coin = t.coin;
                response[i].usdt = t.usdt;
              }
            }
          });
          if (transaction.length > 0) {
            res.json({ transaction: response });
          } else {
            res.json({ transaction: [] });
          }
        }
      });
  } else {
    res.json({ transaction: [] });
  }
}

export function getTransaction(req, res) {
  const page = req.query.page ? req.query.page : 0;
  const isToggle = req.query.toggle === '1';
  const regex = new RegExp('.', 'g');
  Transaction
    .find({
      $or: [
        { txCoin: isToggle ? null : regex },
        { txUsdt: isToggle ? null : regex },
      ],
    })
    .populate('from', { userName: 1, _id: 0 })
    .populate('to', { userName: 1, _id: 0 })
    .limit(20)
    .skip(20 * page)
    .exec((err, transaction) => {
      if (err) {
        res.json({ transaction: [], count: 0 });
      } else {
        Transaction
          .find({
            $or: [
              { txCoin: isToggle ? null : regex },
              { txUsdt: isToggle ? null : regex },
            ],
          })
          .count()
          .exec((err2, count) => {
            if (err2) {
              res.json({ transaction: [], count: 0 });
            } else {
              const temp1 = Math.round(count / 20);
              const temp2 = (count % 20 === 0) ? 0 : 1;
              const length = temp1 + temp2;
              res.json({ transaction, count: (count !== 0) ? length : 0 });
            }
          });
      }
    });
}

export function getHash(req, res) {
  if (req.params.coin && req.params.txHash) {
    switch (req.params.coin) {
      case 'BTC': {
        btc.getHash(req.params.txHash).catch(() => {
          res.json({ confirmations: -1 });
        }).then((data) => {
          res.json({ confirmations: data });
        });
        break;
      }
      case 'ETH': {
        eth.getHash(req.params.txHash).catch(() => {
          res.json({ confirmations: -1 });
        }).then((data) => {
          res.json({ confirmations: data });
        });
        break;
      }
      case 'USDT': {
        usdt.getHash(req.params.txHash).catch(() => {
          res.json({ confirmations: -1 });
        }).then((data) => {
          res.json({ confirmations: data });
        });
        break;
      }
      default: {
        res.json({ confirmations: -1 });
      }
    }
  } else {
    res.json({ confirmations: -1 });
  }
}
export function fix(req, res) {
  Transaction
    .find({
      $or: [
        { txCoin: null },
        { txUsdt: null },
      ],
    })
    .populate('from', { userName: 1, _id: 1, addresses: 1 })
    .populate('to', { userName: 1, _id: 1, addresses: 1 })
    .exec((err, transaction) => {
      if (err) {
        res.json({ transaction: 'error' });
      } else {
        Setting.find((errSetting, setting) => {
          if (errSetting) {
            return;
          } else {
            const feeNetworkArr = setting.filter(s => {
              return s.name === 'feeNetwork';
            });
            if (feeNetworkArr.length === 0) return;

            const feeBTCArr = setting.filter(s => {
              return s.name === 'feeBTC';
            });
            if (feeBTCArr.length === 0) return;
            const feeETHArr = setting.filter(s => {
              return s.name === 'feeETH';
            });
            if (feeETHArr.length === 0) return;
            const feeUSDTArr = setting.filter(s => {
              return s.name === 'feeUSDT';
            });
            if (feeETHArr.length === 0) return;

            const addressBTCArr = setting.filter(s => {
              return s.name === 'addressBTC';
            });
            if (addressBTCArr.length === 0) return;
            const addressETHArr = setting.filter(s => {
              return s.name === 'addressETH';
            });
            if (addressETHArr.length === 0) return;
            const addressUSDTArr = setting.filter(s => {
              return s.name === 'addressUSDT';
            });
            if (addressUSDTArr.length === 0) return;

            const feeBTC = Number(feeBTCArr[0].value);
            const feeETH = Number(feeETHArr[0].value);
            const feeUSDT = Number(feeUSDTArr[0].value);
            const feeNetwork = Number(feeNetworkArr[0].value);

            const addressBTC = addressBTCArr[0].value;
            const addressETH = addressETHArr[0].value;
            const addressUSDT = addressUSDTArr[0].value;

            let feeCoin = 0;
            let addressCoin = '';

            let api = {};
            console.log('here');
            transaction.map((t) => {
              console.log(t);
              if (t.txCoin === null) {
                switch (transaction.coin) {
                  case 'BTC': {
                    api = btc;
                    feeCoin = feeBTC;
                    addressCoin = addressBTC;
                    break;
                  }
                  case 'ETH': {
                    api = eth;
                    feeCoin = feeETH;
                    addressCoin = addressETH;
                    break;
                  }
                  default:
                    api = {};
                    return;
                }
                api.addressToAddressWithFee(t.from, t.to, t.amount, feeNetwork, feeCoin, addressCoin).catch(() => {
                  res.json({ transaction: 'error' });
                  return;
                }).then((txCoin) => {
                  Transaction.updateOne({ _id: t._id }, { txCoin }).exec(() => {});
                });
              }
              if (t.txUsdt === null) {
                let unit = 0;
                switch (t.coin) {
                  case 'BTC': {
                    unit = 100000000;
                    break;
                  }
                  case 'ETH': {
                    unit = 1000000000000000000;
                    break;
                  }
                  default: unit = 100000000;
                }
                const amount = (t.amount) / unit * 100000 * t.price - feeNetwork - feeUSDT;
                usdt.addressToAddressWithFee(t.from, t.to, amount, feeNetwork, feeUSDT, addressUSDT).catch(() => {
                  res.json({ transaction: 'error' });
                  return;
                }).then((txUsdt) => {
                  Transaction.updateOne({ _id: t._id }, { txUsdt }).exec(() => {});
                });
              }
            });
            res.json({ transaction: 'done' });
          }
        });
      }
    });
}
