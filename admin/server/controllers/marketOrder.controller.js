import MarketOrder from '../models/marketOrder';
import Setting from '../models/setting';
import * as btc from '../util/btc';
import * as eth from '../util/eth';
import { donePhase } from '../routes/socket_routes/chat_socket';

export function getMarketOrders(req, res) {
  const page = req.query.page ? req.query.page : 0;
  const mode = req.query.mode;
  const regex = new RegExp('.', 'g');
  let arr = [];
  switch (mode) {
    case 'ongoing': {
      arr = ['second', 'third'];
      break;
    }
    case 'conflict': {
      arr = ['second', 'third'];
      break;
    }
    case 'done': {
      arr = ['first', 'second', 'third', 'done'];
      break;
    }
    case 'standard': {
      arr = ['first', 'second', 'third', 'done'];
      break;
    }
    default: break;
  }
  MarketOrder
    .find({
      $or: [
        { stage: { $in: arr } },
      ],
    })
    .populate('createUser', { userName: 1, _id: 1 })
    .populate('userId', { userName: 1, _id: 1 })
    .limit(20)
    .skip(20 * page)
    .exec((err, market) => {
      if (err) {
        res.json({ market: [], count: 0 });
      } else {
        MarketOrder
          .find({
            $or: [
              { stage: { $in: arr } },
            ],
          })
          .count()
          .exec((err2, count) => {
            if (err2) {
              res.json({ market: [], count: 0 });
            } else {
              const temp1 = Math.round(count / 20);
              const temp2 = (count % 20 === 0) ? 0 : 1;
              const length = temp1 + temp2;
              res.json({ market, count: (count !== 0) ? length : 0 });
            }
          });
      }
    });
}
export function marketOrderRefresh(req, res) {
  const reqMarket = req.body.market;
  if (reqMarket && reqMarket.hasOwnProperty('_id')) {
    MarketOrder.findOneAndUpdate(
      { _id: reqMarket.id },
      { stage: 'open', accountName: '', accountNumber: '' }
      ).exec((err) => {
        if (err) {
          res.json({ market: 'error' });
        } else {
          res.json({ market: 'success' });
        }
    })
  } else {
    res.json({ market: 'missing' });
  }
}
export function marketOrderAuto(req, res) {
  const reqMarket = req.body.market;
  if (reqMarket && reqMarket.hasOwnProperty('id')) {
    MarketOrder
      .findOne({ _id: reqMarket.id })
      .populate('createUser', 'addresses')
      .populate('userId', 'addresses')
      .exec((err, market) => {
      if (err) {
        res.json({ market: 'error' })
      } else {
        if (market) {
          let api = {};
          switch (market.coin) {
            case 'BTC': {
              api = btc;
              break;
            }
            case 'ETH': {
              api = eth;
              break;
            }
            default:
              res.json({ market: 'Sàn chưa hỗ trợ đồng này.'});
              return;
          }
          Setting.find((errSetting, setting) => {
            if (errSetting) {
              return;
            } else {
              let feeNetwork = setting.filter(set => {return set.name === `feeNetwork${market.coin}`;});
              let feeUsdt = setting.filter(set => {return set.name === 'feeUsdt'; });
              let feeCoin = setting.filter(set => {return set.name === `feeCoin${market.coin}`;});
              let minimumFeeCoin = setting.filter(set => {return set.name === `minimumFee${market.coin.toUpperCase()}`;});
              let addressCoin =  setting.filter(set => {return set.name === `addressCoin${market.coin}`;});

              if (feeNetwork.length === 0) return;
              if (minimumFeeCoin.length === 0) return;
              if (feeUsdt.length === 0) return;
              if (feeCoin.length === 0) return;
              if (addressCoin.length === 0) return;
              api.send(market, addressCoin[0].value, feeCoin, minimumFeeCoin[0].value, feeNetwork)
                .catch((errSend) => {
                  res.json({ market: 'error' });
                })
                .then((ret) => {
                  MarketOrder.findOneAndUpdate(
                    { _id: reqMarket.id },
                    { stage: 'done', txHash: ret.txHash, txHashFee: ret.txHashFee, feeNetwork: ret.feeNetwork, feeTrade: ret.feeTrade, feeTradeAdmin: ret.feeTradeAdmin, dateDone: Date.now() },
                    { new: true },
                  ).exec((err3, market2) => {
                    if (err3) {
                      res.json({ market: 'error' });
                    } else {
                      const message = {
                        idFrom: market.userId._id,
                        idTo: market.createUser._id,
                        coin: market.coin,
                      };
                      donePhase(message);
                      res.json({ market: market2 });
                    }
                  });
                })
            }
          });
        } else {
          res.json({ market: 'market not exist' });
        }
      }
    })
  } else {
    res.json({ market: 'missing' });
  }
}
